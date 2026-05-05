---
title: "How to Build AI Agents That Work in Production"
tags: ["agents", "production", "evals", "mcp", "context-engineering", "memory"]
last_updated: "2026-05-04"
---

# How to Build AI Agents That Work in Production

## Intent

Walk through every decision point — from problem definition to live evaluation — in the order you actually face it. Each step is actionable on its own and links to the deeper guides in this repository for when you need to go further.

## Who this is for

Engineers and architects shipping their first production agent, or teams debugging why a demo-grade agent breaks under real workloads.

---

## The 7-Step Framework

```
1. Start with a Goal
2. Pick the Right Model
3. Choose the Right Framework
4. Connect Tools
5. Divide Memory
6. Manage Context
7. Test and Evals
```

Steps 1–3 are design decisions made before you write code. Steps 4–6 are architectural decisions made while building. Step 7 runs continuously in production.

---

## Step 1 — Start with a Goal

**The most common failure mode is building the wrong thing at the right quality.**

Before touching a model or framework, answer four questions:

| Question | Why it matters |
|---|---|
| What is the measurable goal? | Defines when the agent is "done" and what an eval should assert. |
| Which workflow pattern fits? | Retrieval, Task, or Autonomous — each has different complexity and risk. |
| Where does a human need to stay in the loop? | HITL points prevent cascading errors in irreversible actions. |
| What is the agent explicitly not allowed to do? | Constraints written now become the system prompt and guardrails later. |

### Choosing the workflow pattern

| Pattern | Use when | Risk if misapplied |
|---|---|---|
| **Retrieval** | Grounded Q&A over approved data | Hallucination outside the corpus |
| **Task** | Predictable, repeatable workflows | Brittleness when a parameter is missing |
| **Autonomous** | Multi-step plans, sub-agent orchestration | Cascading failures, runaway cost |

Start at the lowest pattern that satisfies the goal. Escalating to autonomous adds cost and failure surface; de-escalating later is difficult once users expect it.

### Defining HITL points

Identify actions that are irreversible (send email, delete record, charge card) or high-stakes (regulatory submission, patient data). Place a human approval gate before every such action. Design the agent to pause and surface a structured summary — not a raw prompt — so the reviewer can decide quickly.

> Deep dive: [AI Agents Overview — Agent Types](./ai-agents-overview.md)

---

## Step 2 — Pick the Right Model

**Match the model tier to the job, not to the marketing headline.**

Models fall into three tiers based on the compute-reasoning tradeoff:

| Tier | Best for | Examples |
|---|---|---|
| **LRM** (Large Reasoning Model) | Complex multi-step reasoning, coding agents, long-horizon planning | Claude Opus 4.7, GPT o3-pro |
| **LLM** (Standard Large Model) | General-purpose agents, balanced token cost and quality | Claude Sonnet 4.6, Gemini 3, GPT-5 |
| **SLM** (Small Language Model) | Query routing, rewriting, tool-call dispatch, latency-sensitive loops | Phi-4, Ministral 3B, FunctionGemma |

A common production pattern is to **split planning from execution**: use an LRM or LLM to reason and plan, then delegate individual tool calls to a fine-tuned SLM. This keeps frontier-model costs at the reasoning layer only.

Research reinforces this: a 350M-parameter model fine-tuned specifically for tool calling scores 77.55% on ToolBench, significantly outperforming much larger generalist models on the same task (see [models guide](./models-for-ai-agents-2026.md#research-highlight-tool-calling-specialization-beats-scale)). **FunctionGemma** (270M parameters) is a ready-to-use option for this routing tier.

### Model selection checklist

- [ ] Clarify the agent's core job: reasoning-heavy, retrieval-first, creative, or automation-focused.
- [ ] Verify availability in your stack (managed API vs. on-prem vs. edge).
- [ ] Check licensing and data residency for regulated domains.
- [ ] Benchmark latency, cost per 1K tokens, and tool-use reliability before committing.
- [ ] Name a fallback model per region for outages.

> Deep dive: [Best Model Providers for AI Agents 2026](./models-for-ai-agents-2026.md)

---

## Step 3 — Choose the Right Framework

**Frameworks differ most on: how they handle state, whether they support MCP, and how they route between agents.**

### Simple / low-code frameworks

Use these for rapid prototyping, non-technical builders, or linear workflows:

| Framework | Strength |
|---|---|
| n8n | 100+ integrations, visual sub-workflows, MCP support |
| Flowise | Drag-and-drop LangChain flows |
| Dify | Prompt IDE + workflow builder in one tool |
| Gumloop / Langflow | Fast visual prototyping for demos |

### Production / code-first frameworks

Use these when you need state machines, multi-agent orchestration, or enterprise governance:

| Framework | Strength | MCP support |
|---|---|---|
| **Anthropic Agent SDK** | Native Claude + MCP + web search integration | Remote |
| **LangGraph** | DAG-based flow, best for stateful agents | Local + Remote |
| **Google ADK** | Scalable enterprise agents with Google Ecosystem | Remote |
| **Microsoft Agent Framework** | Enterprise Azure / C# / .NET, multi-language | None natively |
| **CrewAI** | Role-based multi-agent workflows | Remote |
| **LlamaIndex** | RAG-heavy agents with strong indexing primitives | Remote |
| **AutoGen / AutoGen Studio** | Programmatic and visual multi-agent chaining | None natively |

### Decision heuristic

1. Need a working prototype in a day? → n8n or Dify.
2. Need Python control flow + stateful routing? → LangGraph.
3. Shipping on Azure or .NET? → Microsoft Agent Framework.
4. Building primarily with Claude and MCP tools? → Anthropic Agent SDK.
5. Need role-based specialist agents? → CrewAI.
6. Need self-evolving modular skills with Google infrastructure? → Google ADK.

> Deep dives: [AI Agents Overview — Common Frameworks](./ai-agents-overview.md) · [Google ADK](./self-evolving-agents-google-adk.md) · [Microsoft Agent Framework](../05-tools/microsoft-agent-framework.md) · [LangChain Deep Agents](../05-tools/langchain-deep-agents.md) · [N8N vs LangGraph](../05-tools/n8n-vs-langgraph.md) · [Anthropic Agent SDK](./claude-managed-agents-tutorial.md)

---

## Step 4 — Connect Tools

**An agent without tools is an expensive chatbot.**

Tools are what convert language into action. Connect them in this order: local functions first, then external APIs, then MCP servers, then other agents.

### The four tool layers

```
Local functions   →  Math, string ops, code execution (deterministic, free, fast)
External APIs     →  Web search, CRM, SaaS platforms (stateful, authenticated)
MCP servers       →  Standardized access to files, databases, events, and actions
Agent-as-tool     →  Specialist sub-agents called like any other function
```

### Model Context Protocol (MCP)

MCP is the standard for connecting models to real-world data without bespoke integration code. Think of it as a USB-C port for AI — any MCP-compliant client can use any MCP server without custom glue.

**Twelve MCP servers worth knowing:**

| Server | What it exposes |
|---|---|
| FileSystem | Read/write local or remote files |
| GitHub | Repos, issues, PRs, CI status |
| PostgreSQL | SQL queries and schema introspection |
| Slack | Channels, messages, user presence |
| Notion | Pages, databases, blocks |
| Stripe | Payment records and subscriptions |
| Datadog | Metrics, logs, alert history |
| Google Drive | Docs, Sheets, search |
| Jira | Tickets, sprints, boards |
| Linear | Issues and project state |
| Brave Search | Web search |
| Puppeteer | Browser automation |

Build MCP servers for your core domains first — identity, documents, transactions, analytics. Every agent you add later gets those capabilities for free.

### Agent-to-Agent (A2A) protocol

When one agent needs to call another agent that may live on a different system or be built by a different team, use A2A. Each agent publishes an **Agent Card** (a JSON manifest of capabilities, input schema, and authentication) so other agents can discover and invoke it without manual integration.

> Deep dives: [MCP Guide](./mcp-guide.md) · [A2A Protocol Guide](./a2a-protocol-guide.md) · [Claude Managed Agents Tutorial](./claude-managed-agents-tutorial.md)

---

## Step 5 — Divide Memory

**Memory is what separates a stateless chatbot from an agent that actually learns.**

All agent memory falls into five types. Use multiple types in the same system — they serve different time horizons and retrieval needs.

| Memory type | What it stores | Implementation |
|---|---|---|
| **Graph Memory** | Relationship-based facts (entity A relates to entity B) | Neo4j, NetworkX, knowledge graph |
| **Cache Memory** | Current conversation turns and recent tool outputs | In-process dictionary, Redis |
| **Procedural Memory** | How the agent should perform recurring tasks | System prompt, SKILL.md files |
| **Episodic Memory** | Past experiences and interaction history | Vector database (ChromaDB, Pinecone) |
| **File System Memory** | Structured data and documents | SQLite, object storage, NOTES.md |

### Practical layering

```
Short-lived    Cache Memory      →  Current task context (window)
Medium-lived   Episodic Memory   →  Semantic search across past sessions
Long-lived     File System       →  Facts, decisions, documents
Relational     Graph Memory      →  Who knows what, what caused what
Behavioral     Procedural        →  Skills and operating rules (system prompt)
```

Start with Cache + File System Memory for most agents. Add Episodic (vector search) when users expect continuity across sessions. Add Graph Memory when the domain has complex relationships (org charts, dependency graphs, knowledge graphs).

**MemPalace** is a free, fully local memory system achieving 96.6% R@5 on LongMemEval using raw verbatim storage + semantic search, with no cloud dependency. It is a practical starting point for Episodic + File System memory before you need a managed vector database.

> Deep dives: [MemPalace AI Memory Tutorial](./mempalace-ai-memory-tutorial.md) · [AI Knowledge Base Tutorial](./ai-knowledge-base-tutorial.md)

---

## Step 6 — Manage Context

**Context management is the difference between a demo and a production agent.**

Agents use roughly 15× more tokens than standard chat. Poor context management creates two failure modes: running out of window mid-task, or paying for tokens that do not contribute to the answer.

### The four context engineering principles

| Principle | What to do |
|---|---|
| **Compress old context** | Summarize completed task phases instead of carrying raw transcripts forward |
| **Monitor effectiveness** | Track token spend, context hit rate, and task success per context configuration |
| **Add context just-in-time** | Retrieve data when the plan requires it, not at session start |
| **Use a structured loop** | Perceive → Decide → Act → Observe → Compress |

### The 5-layer context hierarchy

```
Layer 1   System Identity     Core role, capabilities, prohibited actions (stable)
Layer 2   Task Instructions   Current objective and success criteria (per run)
Layer 3   Tool Definitions    Only the tools relevant to this task (dynamic)
Layer 4   Working Memory      Recent turns, tool outputs, draft artifacts (ephemeral)
Layer 5   Retrieved Context   Just-in-time facts pulled from memory (on demand)
```

Load only what each layer needs. Replace Layer 4 with a summary when it grows beyond ~20% of your token budget.

### The 3-agent context loop

For complex pipelines, a three-agent structure handles context pressure cleanly:

- **Planner agent** — decomposes the goal, maintains the task graph.
- **Executor agent** — runs the current sub-task with a lean, focused context.
- **Compressor agent** — distills executor output into a compact summary and updates the shared state.

The executor never sees the full history. The planner never sees raw tool outputs. This cuts token usage dramatically and prevents context rot from cascading.

> Deep dives: [Context Engineering](./context-engineering.md) · [Agent Context Window Performance](./agent-context-window-performance.md) · [Cursor Dynamic Context Discovery](./cursor-dynamic-context-discovery.md) · [Ultimate 2026 Implementation Guide](./ultimate-2026-ai-software-implementation-guide.md)

---

## Step 7 — Test and Evals

**An agent that works in the demo and fails in production was never tested for production.**

Evals are not optional. They are the mechanism that lets you ship changes with confidence.

### Four evaluation layers

| Layer | What it catches | Tool |
|---|---|---|
| **Unit tests** | Broken tool schemas, malformed outputs, prompt regressions | promptfoo, pytest |
| **Edge case discovery** | Inputs the agent mishandles at volume | Red-teaming, fuzzing |
| **Cost-per-task tracking** | Runaway token usage, model tier mismatches | Telemetry on orchestrator |
| **Observability & tracing** | Latency, tool failure rate, context hit rate end-to-end | Langfuse, LangSmith |

### What to assert in unit tests

- **Structure**: does the output match the expected JSON schema?
- **Content**: does the answer contain the required fields and stay within constraints?
- **Safety**: does the agent refuse prohibited actions?
- **Tool selection**: does the agent call the right tool with the right arguments?

### Prompt versioning and A/B testing

Version system prompts in source control alongside code. When changing a prompt, run the new version against a golden dataset and compare eval metrics before deploying. For high-traffic agents, route a percentage of traffic to the new prompt and compare cost and accuracy in production before full rollout.

### Cost-per-task as a KPI

Track cost per successful task, not just cost per token. An agent that is 20% more expensive per token but succeeds on the first attempt is cheaper than one that retries three times. Build this metric into your orchestrator from day one.

### Recommended eval stack

```
promptfoo        →  Prompt regression and structure smoke tests
Langfuse         →  Tracing, spans, and session-level cost attribution
LangSmith        →  LangChain-native observability and dataset management
Custom dashboard →  Cost-per-task KPI, tool failure rate, context hit rate
```

> Deep dives: [Models & Evaluations](../06-models-and-evaluations/README.md) · [Ultimate 2026 Implementation Guide — Measure & Harden](./ultimate-2026-ai-software-implementation-guide.md)

---

## End-to-End Checklist

Use this before declaring an agent production-ready.

### Goal & Design
- [ ] Business goal defined with a measurable success metric
- [ ] Agent type chosen (retrieval / task / autonomous) and justified
- [ ] HITL gates placed before all irreversible or high-stakes actions
- [ ] Explicit constraint list written and ready for the system prompt

### Model
- [ ] Model tier matched to the job (LRM / LLM / SLM)
- [ ] Routing SLM identified for tool dispatch if applicable
- [ ] Fallback model named per region
- [ ] Cost and latency benchmarked on representative inputs

### Framework
- [ ] Framework chosen and justified against the state management requirements
- [ ] Routing logic (state machine, DAG, role-based) defined before coding

### Tools
- [ ] MCP servers deployed for all core data domains
- [ ] Function schemas typed and validated
- [ ] A2A Agent Cards published for any cross-system agent calls
- [ ] Tool call logs stored with trace IDs

### Memory
- [ ] Cache memory handles current task window
- [ ] Episodic memory (vector search) configured for cross-session recall if needed
- [ ] File system memory defined for structured facts and documents
- [ ] Retention and deletion policies set

### Context
- [ ] Token budget per run defined
- [ ] Summarization trigger set (e.g., working memory > 20% of budget)
- [ ] Just-in-time retrieval replacing preloaded context
- [ ] Constraint injection in place before each tool call

### Evals
- [ ] Unit tests covering structure, content, safety, and tool selection
- [ ] Tracing and spans live (Langfuse or LangSmith)
- [ ] Cost-per-task metric instrumented
- [ ] Prompt versions tracked in source control
- [ ] Red-team session completed on adversarial inputs

---

## References

| Guide | What it covers |
|---|---|
| [AI Agents Overview](./ai-agents-overview.md) | Agent types, workflow patterns, 7-step build, framework comparison table |
| [Models for AI Agents 2026](./models-for-ai-agents-2026.md) | 15+ providers, model selection checklist, SLM tool-calling research |
| [Claude Managed Agents Tutorial](./claude-managed-agents-tutorial.md) | Anthropic Agent SDK, built-in tools, function calling |
| [MCP Guide](./mcp-guide.md) | MCP architecture, 12 servers to try, security setup |
| [A2A Protocol Guide](./a2a-protocol-guide.md) | Agent Cards, cross-system agent collaboration |
| [Context Engineering](./context-engineering.md) | 5-layer hierarchy, summarization strategies, token budgeting |
| [Agent Context Window Performance](./agent-context-window-performance.md) | Performance benchmarks and context configuration tradeoffs |
| [Cursor Dynamic Context Discovery](./cursor-dynamic-context-discovery.md) | Practical context engineering example end-to-end |
| [MemPalace AI Memory Tutorial](./mempalace-ai-memory-tutorial.md) | Free local memory system, 96.6% LongMemEval benchmark |
| [AI Knowledge Base Tutorial](./ai-knowledge-base-tutorial.md) | 3-layer knowledge architecture for persistent agent memory |
| [Self-Evolving Agents — Google ADK](./self-evolving-agents-google-adk.md) | Google ADK, modular skills, dynamic capability discovery |
| [Microsoft Agent Framework](../05-tools/microsoft-agent-framework.md) | Semantic Kernel + AutoGen, enterprise Azure patterns |
| [LangChain Deep Agents](../05-tools/langchain-deep-agents.md) | LangChain orchestration, dual-agent research patterns |
| [N8N vs LangGraph](../05-tools/n8n-vs-langgraph.md) | No-code vs code-first workflow comparison |
| [Ultimate 2026 Implementation Guide](./ultimate-2026-ai-software-implementation-guide.md) | MCP-first stack, 30-60-90 rollout, production hardening |
| [Models & Evaluations](../06-models-and-evaluations/README.md) | promptfoo configs, evaluation strategy overview |
