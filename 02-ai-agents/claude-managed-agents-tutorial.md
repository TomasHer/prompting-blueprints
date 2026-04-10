# Claude Managed Agents Tutorial

## Intent
Give developers and product teams a practical, copy-ready guide to Claude Managed Agents — Anthropic's cloud-hosted suite of APIs that cuts months of agent infrastructure work down to days.

> **Read the announcement:** [Claude Managed Agents — Anthropic blog](https://claude.com/blog/claude-managed-agents)  
> **Watch in action:** [How Notion built with Claude Managed Agents](https://youtu.be/45hPRdfDEsI)

---

## Why This Matters

Building production-grade AI agents from scratch means solving hard infrastructure problems before you can ship a single feature: sandboxed code execution, secure tool orchestration, permission management, session state, and safety guardrails. Historically that work took months.

**Claude Managed Agents flips that model.** Developers define what the agent should do and what tools it can use. Anthropic's cloud handles everything else — sandboxing, orchestration, and permissions. Early adopters like **Notion** and **Asana** are already shipping coding agents, AI teammates, and enterprise workflows on top of the platform.

| What you own | What Anthropic manages |
|---|---|
| Agent goals and task definitions | Compute sandboxing |
| Tool selection and configuration | Tool orchestration |
| Business logic and prompts | Permission enforcement |
| UI and integration points | Safety and compliance layer |

---

## Core Concepts

### Agents API
The `/v1/agents` endpoint lets you create a named agent with a system prompt, a set of built-in tools, and optional custom tools. Once created, the agent can be invoked repeatedly without re-specifying its configuration.

### Sessions API
The `/v1/sessions` endpoint manages multi-turn, stateful conversations with an agent. Anthropic stores session history server-side, so you do not need to replay the full message thread on every turn.

### Built-in Tools
Anthropic provides a curated set of pre-built, sandboxed tools that agents can use out of the box:

| Tool | What it does |
|---|---|
| `computer_use` | Controls a sandboxed browser and desktop environment |
| `bash` | Executes shell commands in an isolated container |
| `text_editor` | Reads and writes files in the sandbox |
| `web_search` | Issues safe, rate-limited web searches |

### Custom Tools
Beyond built-ins, you can register your own tools as function definitions (JSON Schema). The agent calls your tool endpoint; you execute the logic and return the result. Anthropic enforces the permission boundary so the agent cannot exceed the declared scope.

---

## Quick-Start: Create and Run an Agent

### 1. Install the SDK

```bash
pip install anthropic
```

### 2. Define your agent

```python
import anthropic

client = anthropic.Anthropic()

# Create a reusable agent with a system prompt and built-in tools
agent = client.beta.agents.create(
    name="coding-assistant",
    model="claude-opus-4-6",
    instructions="""You are an expert software engineer.
When given a coding task, write clean, tested code.
Use the bash tool to run tests and verify your solution before responding.""",
    tools=[
        {"type": "bash_20250124"},
        {"type": "text_editor_20250124"},
    ],
)

print(f"Agent created: {agent.id}")
```

### 3. Start a session and send a message

```python
# Create a session (Anthropic stores history server-side)
session = client.beta.agents.sessions.create(agent_id=agent.id)

# Send a task to the agent
response = client.beta.agents.sessions.messages.create(
    agent_id=agent.id,
    session_id=session.id,
    messages=[
        {
            "role": "user",
            "content": "Write a Python function that checks if a string is a palindrome, then run it with three test cases."
        }
    ],
)

print(response.content)
```

### 4. Continue the same session

```python
# Follow-up in the same conversation — no need to replay history
followup = client.beta.agents.sessions.messages.create(
    agent_id=agent.id,
    session_id=session.id,
    messages=[
        {
            "role": "user",
            "content": "Now make it handle Unicode characters correctly."
        }
    ],
)

print(followup.content)
```

---

## Adding Custom Tools

Register your own tools so the agent can call your business logic securely.

```python
import anthropic
import json

client = anthropic.Anthropic()

# Define a custom tool (JSON Schema)
jira_tool = {
    "name": "create_jira_ticket",
    "description": "Creates a Jira ticket for a bug or feature request.",
    "input_schema": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "description": "One-line ticket title."
            },
            "description": {
                "type": "string",
                "description": "Full description of the issue."
            },
            "priority": {
                "type": "string",
                "enum": ["Low", "Medium", "High", "Critical"],
                "description": "Ticket priority level."
            }
        },
        "required": ["summary", "description", "priority"]
    }
}

agent = client.beta.agents.create(
    name="dev-ops-assistant",
    model="claude-opus-4-6",
    instructions="You are a DevOps assistant. When a developer reports a bug, create a Jira ticket with accurate details.",
    tools=[jira_tool],
)
```

When the agent invokes `create_jira_ticket`, your application receives a `tool_use` event with the structured arguments. Execute the logic on your side and return the result — the agent picks up the response and continues.

---

## Architecture Patterns

### Pattern 1: Coding Agent (Notion-style)
Notion uses Claude Managed Agents to power an AI coding assistant that can read codebases, write new code, and run tests — all inside a managed sandbox.

```
User prompt
    │
    ▼
Agent (claude-opus-4-6 + bash + text_editor)
    │
    ├─► text_editor: read relevant files
    ├─► bash: run existing tests
    ├─► text_editor: write new code
    └─► bash: run updated tests → return result
```

**Key design decisions:**
- Use `text_editor` to scope file access to the project directory.
- Use `bash` to validate output; let the agent iterate until tests pass.
- Store sessions per user per repository for continuity across conversations.

### Pattern 2: Enterprise Workflow Agent (Asana-style)
Asana uses Managed Agents to build AI teammates that handle project management tasks across tools like calendars, docs, and task trackers.

```
User intent (e.g., "Prepare the Q3 review")
    │
    ▼
Orchestrator agent
    │
    ├─► custom tool: fetch_asana_tasks(project_id)
    ├─► custom tool: get_calendar_events(week)
    ├─► custom tool: read_docs(doc_ids)
    └─► generate consolidated briefing → send to user
```

**Key design decisions:**
- Register each integration (Asana, Calendar, Docs) as a named custom tool.
- Keep the orchestrator agent's instructions focused on goal decomposition.
- Use a single session per user to maintain context across working days.

### Pattern 3: Minimal Retrieval + Action Agent
For teams just starting out: a simple agent that searches internal docs and takes one action.

```python
agent = client.beta.agents.create(
    name="support-agent",
    model="claude-sonnet-4-6",   # Cost-efficient for high-volume support
    instructions="""You are a customer support specialist.
1. Search the knowledge base to find a relevant answer.
2. If no answer exists, escalate by creating a support ticket.
3. Always respond in a friendly, concise tone.""",
    tools=[
        {"type": "web_search_20250305"},  # Search public docs
        escalate_tool,                    # Custom tool: create ticket
    ],
)
```

---

## Choosing the Right Model

| Use case | Recommended model | Reason |
|---|---|---|
| Complex coding or reasoning tasks | `claude-opus-4-6` | Highest capability for multi-step tool use |
| Balanced productivity agents | `claude-sonnet-4-6` | Strong capability at lower cost |
| High-volume, simple tasks | `claude-haiku-4-5-20251001` | Fastest and most cost-efficient |

---

## Managed vs. Self-Hosted Agents

| Dimension | Claude Managed Agents | Self-hosted (LangGraph, CrewAI, etc.) |
|---|---|---|
| **Time to first agent** | Hours | Days to weeks |
| **Sandbox security** | Managed by Anthropic | Your responsibility |
| **Orchestration** | Built-in | Build your own DAGs / state machines |
| **Permissions model** | Declarative, enforced server-side | Custom implementation required |
| **Cost model** | API + compute usage | Infrastructure + API costs |
| **Customization ceiling** | High (custom tools + prompts) | Unlimited |
| **Best for** | Shipping fast, enterprise compliance | Highly specialized pipelines |

Use Managed Agents when you want to ship in days, not months, and when you trust Anthropic's infrastructure for compliance and security. Use self-hosted orchestration when you need custom DAGs, local models, or infrastructure-level control.

---

## Production Checklist

- [ ] Agent `instructions` are versioned in source control alongside your code.
- [ ] Custom tools validate all inputs at your endpoint before executing.
- [ ] Sessions are scoped per user (never share session IDs across users).
- [ ] You log `session_id` and `agent_id` in every request for traceability.
- [ ] You handle `tool_use` events asynchronously for long-running custom tools.
- [ ] You have evaluated agent output quality on a representative prompt set before shipping.
- [ ] Rate limits and retry logic are implemented in your integration layer.
- [ ] Sensitive data (API keys, PII) is never injected directly into agent instructions.

---

## Real-World Deployments

### Notion — AI Coding Agent
Notion integrated Claude Managed Agents to ship a coding assistant that reads their codebase, writes new features, and runs tests inside a managed sandbox. The team cut infrastructure setup from months of custom tooling to days of configuration.  
Watch the full walkthrough: [How Notion built with Claude Managed Agents](https://youtu.be/45hPRdfDEsI)

### Asana — AI Teammate
Asana uses Managed Agents to power an AI teammate that handles project management tasks — drafting briefs, organizing work, and surfacing blockers — without engineers needing to build their own orchestration or sandboxing layer.

---

## References
- [Anthropic – Claude Managed Agents announcement](https://claude.com/blog/claude-managed-agents)
- [YouTube – How Notion built with Claude Managed Agents](https://youtu.be/45hPRdfDEsI)
- [Anthropic – Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Anthropic API – Agents reference](https://docs.anthropic.com/en/api/agents)
- [Anthropic API – Sessions reference](https://docs.anthropic.com/en/api/sessions)
- [02-ai-agents/ai-agents-overview.md](./ai-agents-overview.md)
- [02-ai-agents/claude-agent-skills.md](./claude-agent-skills.md)
- [02-ai-agents/mcp-guide.md](./mcp-guide.md)
