---
title: "From Prompt to Context to Harness Engineering"
tags: ["agents", "harness-engineering", "context-engineering"]
last_updated: "2026-06-15"
---

# From Prompt to Context to Harness Engineering

## Intent
Explain how AI engineering has moved through three overlapping generations — **prompt engineering**, **context engineering**, and **harness engineering** — plus an emerging fourth, **loop engineering**, and give you a practical mental model for which layer a problem actually lives in. Use this as a teaching primer or onboarding deck for teams shipping agents in 2026.

> **One-line summary:** Prompt engineering is *how you talk to the model*, context engineering is *what the model sees*, harness engineering is *the execution environment the model operates within*, and the newly emerging loop engineering is *the iteration cycle that runs that environment over and over*. Each generation subsumes the previous one rather than replacing it.

## Why a third generation appeared

Prompt engineering got teams off the ground. Context engineering made agents smarter. Neither, on its own, made agents *reliable* enough to trust on long, autonomous tasks — and that gap is what harness engineering addresses.

The shift is driven by a concrete change in what models are asked to do. A single clever prompt and good retrieval are enough for a one-shot answer. They are not enough when a model has to make hundreds of sequential decisions, call real tools, edit real files, and run for hours. At that scale, two failure modes show up that no prompt can fully fix:

- **Context anxiety.** When Cognition rebuilt Devin on Claude Sonnet 4.5, they observed the model behaving as if it were "anxious" about its context window: it took shortcuts and left work unfinished when it *believed* it was near the end of the window — even with plenty of room left — and it consistently (and confidently) *underestimated* how many tokens it had remaining ([Inkeep](https://inkeep.com/blog/context-anxiety)).
- **Unreliable self-evaluation.** Agents are poor judges of their own work. Left to grade themselves, they tend to declare a task complete without objective proof. Reliability requires validation that comes from *outside* the model — a passing test suite, a linter, a type check — not the model's own say-so.

These aren't prompt bugs or context bugs. They're properties of letting a stateless next-token predictor run a long, stateful process unsupervised. Fixing them means engineering the *environment* around the model — which is exactly what a harness is.

## The generations at a glance

| | Generation 1 — **Prompt Engineering** | Generation 2 — **Context Engineering** | Generation 3 — **Harness Engineering** | Generation 4 — **Loop Engineering** *(emerging)* |
| :--- | :--- | :--- | :--- | :--- |
| **Focus** | Expression: the single instruction | Information: what fills the context window | Execution: the environment the agent runs in | Iteration: the act→observe→verify cycle and the feedback that drives it |
| **Unit of work** | One message / one turn | One session | The whole agent lifecycle, across sessions | The loop itself — many iterations, run unattended over time |
| **Era** | ~2022–2024 | ~2025 | 2026+ | 2026+ (frontier, still settling) |
| **Core moves** | Phrasing, role-play, few-shot examples | RAG, memory, schemas, just-in-time retrieval | Tool orchestration, state persistence, verification loops, constraints | Agentic-loop design (discover→plan→execute→verify→iterate), feedback gates, termination criteria, nested inner/outer loops, cron-driven unattended runs |
| **Analogy** | Writing the perfect email to delegate a task | Attaching the right files and schematics to that email | Architecting the office, the SOPs, and the QA checkpoints around the work | Designing the self-running assembly line — QA at every station and a clear stop signal |
| **Failure mode it fixes** | "I didn't understand the question" | "I had the wrong information at the wrong time" | "I had everything I needed and still went off the rails" | "It ran once and stopped" — or looped forever / quit arbitrarily, with no feedback to push against and no definition of done |

Each column is additive. A good loop still depends on a good harness, which depends on good context, which depends on good prompts. The generations *nest*: prompt and context engineering operate inside the harness, and loop engineering is the outermost, *temporal* layer — it governs how the harness is run **again and again** over time, not just how it runs once.

Generation 4 is genuinely nascent, and it overlaps the harness rather than cleanly replacing it: the harness already contains verification loops, learning loops, and scheduling (see *Core subsystems* below). Loop engineering is the move that promotes "the loop" from one subsystem among several to the *primary design object* — you stop hand-prompting each run and instead engineer the cycle that prompts the agent for you.

### Generation 1 — Prompt Engineering (Expression)

The art of the single instruction. You optimize wording, assign a role, give few-shot examples, and constrain the output format to coax the best possible one-time response out of the model.

This layer never goes away — it just becomes a *component* of the larger system. The system prompt that boots an agent, the instructions inside each sub-agent, and the format contract for a tool call are all still prompt engineering. For the underlying patterns, see the [Prompt Pattern Catalogue](../../03-prompts-and-patterns/prompt-pattern-catalogue.md) and [Role + Constraints + Format](../../03-prompts-and-patterns/role-constraint-format.md).

**Analogy:** Writing the perfect email to delegate a task.

### Generation 2 — Context Engineering (Information)

The realization that models need *dynamic* information, not just clever phrasing. This generation is about information architecture: retrieval (RAG), memory systems, structured knowledge (schemas, repository maps), and deciding — at every step — what deserves a slot in a finite, attention-scarce context window.

The discipline has its own deep playbook in this repo: see [Context Engineering](../03-context-and-memory/context-engineering.md) for the failure modes (context rot, position bias), strategies (just-in-time retrieval, structured note-taking), and leader tips. The [Model Context Protocol (MCP)](../04-protocols/mcp-guide.md) is the connective tissue that lets agents pull this context from external systems in a standard way.

**Analogy:** Attaching all the correct background files and schematics to that email.

### Generation 3 — Harness Engineering (Execution)

The harness is **every piece of code, configuration, constraint, and execution logic that isn't the model itself**. It operates at a higher level of abstraction than the previous two and subsumes them: it decides what context to feed in at each step (context engineering), what to say in each system/tool prompt (prompt engineering), what tools are allowed, when to stop, and what counts as "done."

The one-line test for what the harness adds: **without it you have a very smart chatbot; with it you have an operator** — something that can act, learn, and run autonomously across sessions, tools, and goals. Or, as practitioners increasingly put it: *the model is the engine, the harness is the car.* The most powerful engine in the world goes nowhere without a chassis, drivetrain, and steering around it.

Anthropic's own framing makes the lineage concrete: the **Claude Agent SDK is described as a general-purpose agent harness** that uses techniques like context compaction to let an agent make progress on tasks spanning many context windows, while handling tool dispatch, session management, and progress tracking ([search overview](https://parallel.ai/articles/what-is-an-agent-harness)). Claude Code itself is a harness wrapped around a model.

**Analogy:** Architecting the entire office building — standard operating procedures, specialized departments, and quality-assurance checkpoints.

### Generation 4 — Loop Engineering (Iteration)

The emerging frontier. Once a harness exists, the next leverage point is no longer *what* you say to the agent on any single run — it's the **cycle** the agent runs in. Loop engineering treats that cycle as the primary design object: you stop prompting the agent directly and instead *write the loop that prompts it for you*, then let it run — often unattended, on a cron schedule, "while you sleep" ([MindStudio](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents), [explainx](https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026)).

The canonical shape is **discover → plan → execute → verify → iterate**: if verification passes, the loop stops; if it fails, the agent feeds the failure back in and goes again. Three design choices separate a reliable loop from a runaway one:

- **Feedback gates.** The loop is not the magic — the *feedback inside it* is. A loop with nothing to push back is just the agent agreeing with itself. Tests, type checks, and brutal review gates are what make iteration trustworthy.
- **Termination criteria.** The loop has to know what "done" looks like, and it needs caps — max iterations, no-progress detection, and a dollar/token budget — so it neither runs forever nor quits arbitrarily.
- **Nested loops.** Real systems layer loops: a tight inner verify-and-retry loop sits inside a broader outer loop that improves the process across runs (the learning loop), which in turn sits inside a human loop that bounds the agent's authority.

This layer overlaps the harness on purpose — verification loops, the learning loop, and scheduling are all listed as harness subsystems below. The distinction is one of *emphasis*: harness engineering builds the machinery; loop engineering is the discipline of composing that machinery into a self-sustaining, self-correcting cycle that produces value on repeat without a human re-prompting it each time.

**Analogy:** Designing a self-running assembly line — QA at every station, a clear stop signal, and a foreman (you) who tunes the line rather than placing each part by hand.

## Core subsystems of an AI harness

A robust harness bridges the gap between a "smart model" and *reproducible* output. Six subsystems do most of the work:

1. **State management & session persistence.** Raw models are stateless. The harness persists progress to the filesystem (or a store) so an agent can pause, save intermediate results, and resume exactly where it left off — across days, tasks, and even model switches — without cramming the entire history back into the context window. This is the structural answer to context anxiety: the window stops being the agent's only memory.

2. **Verification loops.** The harness enforces *objective* validation. An agent can't simply declare success; the harness demands runnable proof — a passing test suite, a green linter, a successful type check, a build — before a change is allowed through. This is the structural answer to unreliable self-evaluation: truth comes from the environment, not the model.

3. **Workflow orchestration.** Instead of one generalist agent doing everything in one window, the harness routes work through a graph of specialized steps and sub-agents — one maps repository impact, a human-in-the-loop checkpoint reviews the plan, another writes the code. (See [How to Build AI Agents for Production](../05-production/how-to-build-ai-agents-production.md).)

4. **Scope & constraints.** The more you constrain the solution space, the more predictable the output. The harness locks the agent into specific file paths, a defined task, or an allow-list of tools — preventing it from inventing new requirements or wandering into an unrelated refactor.

5. **Execution environment (toolchain & sandbox).** A harness has to be *rooted in a real environment*, not an abstract chat box. It gives the model hands and eyes — a tool ecosystem (web search, browser control, code execution, file operations, APIs) — and a place to run them: locally, inside Docker, over SSH, or in a serverless cloud sandbox. Sandboxing is also a safety boundary: it contains what a tool call can touch.

6. **Learning loop (self-improvement).** Advanced harnesses close the loop — capturing outcomes from completed tasks and feeding them back so the agent improves over time. In practice this means an agent that writes its own reusable skills after finishing a task, refines them as they're used again, and carries that procedural memory forward instead of relearning every session.

A practical extension of state and orchestration is **scheduling**: a built-in scheduler (e.g. cron-style triggers) lets the harness run recurring or condition-triggered tasks unattended — operating for hours or days without a human in the loop. This is what turns an interactive assistant into a background operator.

## The whitepaper's lens: `Agent = Model + Harness`

The Kaggle/Google whitepaper **[The New SDLC with Vibe Coding](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding)** (Addy Osmani, Shubham Saboo, and Sokratis Kartakis, May 2026) devotes a section — *"Harness Engineering: What surrounds the model"* — to exactly this layer, and its framing is worth lifting wholesale.

The whitepaper opens by naming a tempting but wrong intuition: *treating the model as the system.* A new model ships and the agent gets smarter; an older model and it gets worse — so the model becomes the explanation for everything good and bad. That instinct leads to the wrong investments. The model is **one input** into a running agent; everything else — the prompts, tools, context policies, hooks, sandboxes, sub-agents, and observability — is the **harness**, the scaffolding wrapped around the model that lets it actually *finish* something. The whitepaper compresses this into an equation:

> **Agent = Model + Harness**

A raw model is not an agent; it becomes one once a harness gives it state, tool execution, feedback loops, and enforceable constraints. The behaviour developers experience with **Claude Code, Cursor, Codex, Antigravity, Aider, or Cline** is dominated by what the harness does, not just by which model is underneath. The whitepaper attaches a rough budget to this — roughly **~10% model, ~90% harness** — and a memorable line: *the model is the engine; the harness is the car, the road, and the traffic laws.* Crucially, that surface area is **the team's responsibility, not the model provider's.**

### What's in the harness

The whitepaper itemizes six components. Mapped against the six subsystems above, they line up closely — and add two the list above doesn't name explicitly (**observability** and the **instructions/rule-files** layer):

- **Instructions and rule files** — the text defining who the agent is, what it cares about, and what it is forbidden from doing: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, skill files, and sub-agent prompts.
- **Tools** — the functions, MCP servers, and APIs the agent can call, *plus the prose around them* that tells the model when and how to call them.
- **Sandboxes and execution environments** — where the agent's code actually runs, what it can access, and what it cannot reach.
- **Orchestration logic** — sub-agent spawning, model routing, hand-offs between specialists, and the rules governing when each fires.
- **Guardrails / hooks** — *deterministic* code that runs at specific lifecycle points (before a tool call, after a file edit, before a commit). Hooks are the place for things the agent should never forget but often does.
- **Observability** — logs, traces, evaluations, and cost/latency metering. Without it there is no way to tell whether the agent is doing well or quietly drifting.

### The harness operates in every SDLC phase

The whitepaper's core SDLC claim is that the harness is not a one-time setup — it is active in **every phase** an agent works in:

1. **Requirements, planning & architecture — *configuring* the harness.** Before any production code, the developer writes the instructions/rule files (e.g. `AGENTS.md`, architectural constraints), wires up the tools the agent may use, and sets the rules it cannot break.
2. **Implementation — *running* the harness.** Generated code executes inside the harness's isolated sandbox; when the model needs to read a file or search the web, it does so through harness-provided tools.
3. **Testing & QA — the *feedback loop*.** The harness's execution environment runs the automated tests; when one fails, the **orchestration logic** captures the error output and routes it back to the model to try again. This is what creates the autonomous **think → act → observe** loop.
4. **Review, deployment & maintenance — *observing* the harness.** Deterministic **hooks** enforce safety (e.g. block a commit that pushes a hard-coded password), while the **observability** layer tracks token cost, latency, and drift so engineers can audit exactly why an agent made a given decision.

### Vibe coding vs. agentic engineering

The whitepaper draws a sharp line that reframes this whole repo's subject: the move from "vibe coding" to **agentic engineering** is *not* about which tools you use — the same agent can do either. It is defined by **how deliberately you configure and apply the harness.** Vibe coding leans on minimal, implicit scaffolding aimed at rapid implementation; agentic engineering uses clear, extensive harness abstractions that guide the AI from the first planning document through to production monitoring.

### The harness effect is measurable

Two benchmarks the whitepaper cites make the size of the effect concrete:

- On **Terminal Bench 2.0**, one team moved a coding agent **from outside the Top 30 to the Top 5 by changing only the harness** — no model change at all.
- A **LangChain** study raised an agent's score on the same benchmark by **13.7 points** by tweaking only the system prompt, tools, and middleware around a *fixed* model.

The everyday corollary is the most useful sentence in the section: when an agent misbehaves, the first instinct is to blame the model, but the failure usually traces back to a missing tool, a vague rule, an absent guardrail, or a context window stuffed with noise. **Most agent failures, examined honestly, are configuration failures** — which is the practical case for the [practitioner checklist](#practitioner-checklist) below.

## How the layers nest

```text
╔═══════════════════════════════════════════════════════════════════╗
║ LOOP ENGINEERING  (iteration over time) ↻ discover→…→verify→repeat ║
║  feedback gates · termination criteria · nested loops · cron runs  ║
║                                                                    ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │ HARNESS ENGINEERING  (execution environment)                 │  ║
║  │  state · verification · orchestration · scope ·              │  ║
║  │  sandboxed toolchain · learning loop · scheduling           │  ║
║  │                                                              │  ║
║  │   ┌───────────────────────────────────────────────────┐     │  ║
║  │   │ CONTEXT ENGINEERING  (what the model sees)         │     │  ║
║  │   │  retrieval · memory · schemas · just-in-time data  │     │  ║
║  │   │                                                    │     │  ║
║  │   │   ┌─────────────────────────────────────────┐      │     │  ║
║  │   │   │ PROMPT ENGINEERING  (the instruction)    │      │     │  ║
║  │   │   │  role · constraints · format · examples  │      │     │  ║
║  │   │   └─────────────────────────────────────────┘      │     │  ║
║  │   └───────────────────────────────────────────────────┘     │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════════════════════╝
```

Reading it inside-out: a prompt is one instruction; context is the information environment that instruction runs in; the harness is the operating environment that the whole session runs in, across many instructions and many sessions; and the loop is the *temporal* wrapper that runs that harness over and over — feeding each run's verified result back into the next — until a termination condition says "done."

## A worked example: "fix this failing bug"

The same task lands very differently depending on which generation you stop at.

- **Prompt only:** You paste the stack trace and ask for a fix. You get a plausible patch you have to verify and apply by hand. Works for a one-liner; fragile for anything real.
- **+ Context:** The agent can retrieve the failing file, related modules, and the test that's red. The patch is now grounded in the actual codebase instead of a guess.
- **+ Harness:** The agent edits the file *and* runs the test suite, sees it's still red, iterates, re-runs, confirms green, runs the linter, and only then opens a pull request — with its scope locked to the relevant paths so it can't "helpfully" rewrite half the repo. State is persisted, so if it runs out of window mid-fix, it resumes instead of restarting.

The model is identical in all three. The reliability difference is entirely the harness.

## Implementations you can look at

- **Claude Code / Claude Agent SDK** — Anthropic's general-purpose harness: compaction, tool dispatch, sub-agents, session and permission management. See [Claude Managed Agents](../04-protocols/claude-managed-agents-tutorial.md).
- **Hermes Agent (Nous Research)** — a CLI-first harness built around a persistent learning loop: it persists memory and skills across sessions, isolates sub-agents in subprocesses, supports MCP, runs anywhere (local, Docker, SSH, serverless), and ships a built-in cron scheduler for unattended automations. It's a clean, open-source illustration of all six subsystems in one place. Walkthrough: [Hermes Agent Tutorial](../../05-tools/hermes-agent-tutorial.md).

## Every major lab is building one

Harness engineering isn't a fringe idea — it's where the frontier labs are spending R&D. The model differs; the harness pattern is the same.

- **OpenAI** — the browser-using **Computer-Using Agent** (originally shipped as *Operator*, since folded into ChatGPT's **agent mode** and the Agents SDK) wraps the model in a live browser and terminal so it can navigate, fill forms, and complete purchases autonomously.
- **Google** — **Gemini** in Workspace acts as a harness that chains multiple apps (Gmail, Docs, Sheets, Calendar) into a multi-step workflow kicked off from a single prompt.
- **Anthropic** — **Claude Code / Claude Agent SDK** drives the full software-engineering loop on SWE-bench — **read → patch → test → submit** — with the harness (a bash terminal and a file editor, plus compaction and verification) doing the orchestration. **Claude Managed Agents** packages that as a pre-built, configurable harness on managed infrastructure.

The takeaway practitioners keep landing on: **the 2026 agent race isn't about who has the smartest model — it's about who builds the most reliable harness around it.** The same open-source harness pattern (memory, tools, orchestration, sandboxed execution, a learning loop) is now reproducible outside the big labs, which is exactly why a project like Hermes matters.

## Practitioner checklist

When an agent misbehaves, diagnose *which layer* the problem lives in before reaching for a fix:

- [ ] **Did it misunderstand the ask?** → Prompt layer. Tighten role, constraints, and format; add an example.
- [ ] **Did it act on missing or stale information?** → Context layer. Fix retrieval, memory, or what you're putting in the window.
- [ ] **Did it have everything and still go wrong** — claimed success without proof, ran out of window, edited the wrong files, never stopped? → Harness layer. Add verification, persist state, constrain scope, or split the workflow.

Most "the model is bad" complaints in production are actually harness gaps wearing a prompt costume.

## Key takeaways

- The three generations are **additive and nested**, not a sequence of replacements. You still write prompts and engineer context — inside a harness.
- Harness engineering exists because **autonomy exposes failure modes prompts can't reach**: context anxiety and unreliable self-evaluation are environment problems with environment-level fixes.
- Treating the model as **a bounded component in a structured environment**, rather than an unpredictable magic box, is what makes agent results reliable enough to scale.
- **The model is the engine; the harness is the car.** Every major lab is building one, and in 2026 the differentiator is harness reliability, not raw model IQ.

## References
- Kaggle / Google — [The New SDLC with Vibe Coding](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding) (whitepaper by Addy Osmani, Shubham Saboo, and Sokratis Kartakis; section *"Harness Engineering: What surrounds the model"* — [Google Drive mirror](https://drive.google.com/file/d/1wNEl8FMpTso8aXlb_joxgzparxi-0ciM/view))
- Addy Osmani — [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) (the whitepaper co-author's companion post on the harness components, the ratchet principle, and `AGENTS.md`)
- Inkeep — [Context Anxiety: How AI Agents Panic About Their Perceived Context Windows](https://inkeep.com/blog/context-anxiety)
- Parallel — [What is an agent harness?](https://parallel.ai/articles/what-is-an-agent-harness)
- Firecrawl — [What Is an Agent Harness?](https://www.firecrawl.dev/blog/what-is-an-agent-harness)
- Daily Dose of DS — [The Anatomy of an Agent Harness](https://blog.dailydoseofds.com/p/the-anatomy-of-an-agent-harness)
- MindStudio — [What Is Loop Engineering? The New Meta for AI Coding Agents](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents)
- explainx.ai — [Loop Engineering: How to Design Coding Agent Loops That Run While You Sleep (2026 Guide)](https://explainx.ai/blog/loop-engineering-coding-agents-claude-code-guide-2026)
- Oracle Developers — [The Agent Loop Decoded: Three Levels Every Agent Engineer Must Know](https://blogs.oracle.com/developers/the-agent-loop-decoded-three-levels-every-agent-engineer-must-know)
- Rakesh Gohel — "The AI Agent Harness: Your Production Control Plane" (infographic + post on the eight harness components, the engine/car framing, and how the big labs apply it)
- OpenAI — [Introducing Operator](https://openai.com/index/introducing-operator/) / [ChatGPT agent](https://openai.com/index/introducing-chatgpt-agent/) (Computer-Using Agent; Operator folded into agent mode in 2025)
- Anthropic — [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview) (pre-built, configurable agent harness)
- Related in this repo: [Context Engineering](../03-context-and-memory/context-engineering.md) · [Prompt Pattern Catalogue](../../03-prompts-and-patterns/prompt-pattern-catalogue.md) · [MCP Guide](../04-protocols/mcp-guide.md) · [Hermes Agent Tutorial](../../05-tools/hermes-agent-tutorial.md)
