# Spec-Driven Development Tutorial

## Intent

Show developers and engineering teams how to move beyond vibe-coding prototypes and into production-quality software by combining AI-native IDEs, CLI agents, and structured specification workflows — collectively called **spec-driven development**.

## Use when

- Your team ships fast with AI tools but struggles to maintain, extend, or harden the resulting code.
- You want to apply traditional SDLC rigour (planning, testing, deployment gates) without slowing down AI-assisted iteration.
- You are adopting AI-native tooling (Kiro, Claude Code CLI, Strands Agents) and need a repeatable framework to govern agent behaviour from a spec rather than ad-hoc prompting.

---

## The problem: vibe coding stops at the prototype

Vibe coding — using tools like [Lovable](https://lovable.dev/), [bolt.new](https://bolt.new/), or [V0](https://v0.dev/) to turn a natural-language description into working code — is powerful for rapid prototyping. An idea becomes a clickable demo in minutes. But vibe coding alone hits a ceiling:

- **No architecture decisions** are captured — the next developer (or AI agent) has no context.
- **Security constraints, deployment steps, and test strategies** are implicit or absent.
- **Agents drift** without a stable specification to anchor their reasoning.
- The result is a prototype that is expensive to productionise and fragile to extend.

---

## Solution: Spec-driven development

> *Vibe coding ships the prototype. Traditional SDLC practices ship the product.*

Spec-driven development grafts the discipline of a software specification onto the speed of AI generation. The lifecycle looks like this:

```
Planning & Design → Implementation → Issues Found → Testing & QA → Deployment → Maintenance
      │                    │
  Vibe coding ─────────────┘   (fast, exploratory, prototype)
  Spec-driven dev ─────────────────────────────────────────────────────────── (structured, auditable, production)
```

The key insight is that a **spec** — a machine-readable document that codifies architecture decisions, security constraints, acceptance criteria, and deployment steps — acts as the single source of truth that every AI tool reads before acting. Once written, a spec is reusable across every future run of the same workflow.

---

## The actors

Spec-driven development involves three roles that work together in each cycle:

| Actor | Role | Responsibilities |
|---|---|---|
| **SOP / Spec** | The blueprint | Architecture decisions, security constraints, deployment steps — codified once, reusable forever. |
| **AI Agent / CLI** | The builder | Reads the spec, generates code and infrastructure, executes commands, monitors results, adapts to failures. |
| **Human** | The approver | Sets parameters upfront, reviews the generated plan, gates production deployment. |

The human stays in control at the decision boundaries (approve / reject / adjust) while the agent handles the repetitive execution work.

---

## Core principles of Strands Agent SOPs

The [Strands Agents SDK](https://strandsagents.com/docs/user-guide/quickstart/overview/) introduces the concept of **Agent SOPs (Standard Operating Procedures)** as a first-class primitive for spec-driven development. The [Strands Agent SOP repository](https://github.com/strands-agents/agent-sop/tree/main) provides reference implementations and templates.

| Principle | What it means |
|---|---|
| **Structured Steps** | RFC 2119 keywords (`MUST`, `SHOULD`, `MAY`) give agents precise control without rigid scripting. Agents know what is mandatory, what is preferred, and what is optional. |
| **Parameterized Inputs** | Flexible templates accept customizable parameters instead of hardcoded values. The same SOP can deploy to staging or production simply by changing an input. |
| **AI-Assisted Authoring** | New SOPs are created in minutes from natural-language descriptions — no prompt engineering expertise required. Describe the workflow in plain English; the AI drafts the SOP. |
| **Progress Tracking** | Agents document progress as they work, enabling debugging, transparency, and resumability. If a run fails mid-way, the agent can pick up where it left off. |

### Writing your first SOP

```markdown
# SOP: Deploy Web Service to AWS

## Parameters
- `environment`: MUST be one of `staging`, `production`
- `image_tag`: MUST be a valid Docker image tag
- `approval_required`: SHOULD default to `true` for `production`

## Steps

### 1. Pre-flight checks
The agent MUST verify:
- [ ] All unit tests pass
- [ ] Security scan returns no critical findings
- [ ] Infrastructure plan reviewed by human approver

### 2. Infrastructure provisioning
The agent SHOULD generate Terraform from the architecture spec.
The agent MUST NOT apply changes to production without human gate approval.

### 3. Application deployment
The agent MAY retry up to 3 times on transient failures.
The agent MUST emit a deployment record with timestamp, image tag, and operator identity.
```

---

## AI-native IDEs

### Kiro IDE

[Kiro](https://kiro.dev/) is purpose-built for spec-driven development. Two of its most important primitives are **Specs** and **Hooks**.

#### Specs

[Kiro Specs](https://kiro.dev/docs/specs/) are structured specification documents that live inside your repository. When you create a Spec, you describe a feature in natural language; Kiro generates:

1. **Requirements** — acceptance criteria derived from your description.
2. **Design** — system design considerations and architecture notes.
3. **Tasks** — a prioritised task list the agent will work through.

The agent reads the Spec before writing any code, ensuring every implementation decision is grounded in the documented intent rather than an ad-hoc prompt. This makes handoffs between humans and agents explicit and auditable.

**Starter workflow:**
```
1. Open Kiro and create a new Spec for your feature.
2. Describe the feature in 2–4 sentences.
3. Review the generated requirements and adjust acceptance criteria.
4. Approve the Spec — Kiro begins implementation against the task list.
5. Review the plan before approving production changes.
```

#### Hooks

[Kiro Hooks](https://kiro.dev/docs/hooks/) are automation triggers that fire at key moments in the development lifecycle — for example, when a file is saved, when a pull request is opened, or when a test suite finishes. Hooks let you encode quality gates and workflow automations directly in the project:

- Run a linter automatically on every file save.
- Trigger a security scan when a dependency file changes.
- Post a summary comment to a PR whenever the test suite completes.
- Regenerate API documentation when an OpenAPI schema is modified.

Hooks complement Specs by enforcing the *how* of your SDLC while Specs define the *what*. Together they replace the patchwork of manual steps that typically fall between vibe-coding and a production-ready codebase.

### Google Antigravity

Google Antigravity is Google's AI-native IDE, designed to embed generative AI assistance directly into the development environment. Like Kiro, it supports steering agent behaviour through structured context rather than freeform prompting — meaning spec documents written for one tool can inform agent behaviour in another when stored in the repository.

---

## AI CLI tools

### Claude Code CLI

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) is Anthropic's terminal-based AI coding agent. It reads your codebase, understands context across files, and executes multi-step tasks from a single instruction. In a spec-driven workflow, Claude Code acts as the **builder** role:

- Point it at a Spec or SOP and it will work through the task list autonomously.
- It reads `CLAUDE.md` files in your repository for project-specific rules, acting as a lightweight spec layer that persists across sessions.
- Use it alongside Kiro Hooks: trigger `claude` commands as a hook action to automate code generation, refactoring, or documentation tasks.

**Example: running a spec-driven task from the CLI**
```bash
# Ask Claude Code to implement a feature described in a spec file
claude "Read the spec in docs/specs/auth-feature.md and implement the login flow. Follow all MUST requirements before marking tasks complete."
```

**CLAUDE.md as a lightweight spec:**
```markdown
# Project: Payment Service

## Architecture constraints
- MUST use PostgreSQL for all persistent state
- MUST NOT store card numbers; use Stripe token references only
- SHOULD emit structured logs for all payment events

## Deployment
- Staging deploys automatically on merge to `main`
- Production deploys REQUIRE a manual approval step
```

---

## Strands Agents SDK

The [Strands Agents SDK](https://strandsagents.com/docs/user-guide/quickstart/overview/) provides a Python framework for building agents that execute SOPs. It is the programmatic layer that sits below the IDE tools, giving you full control when you need to embed spec-driven agents in CI/CD pipelines, internal tools, or automation platforms.

Key capabilities relevant to spec-driven development:

- **SOP execution engine** — load an SOP document and run it step-by-step with progress checkpointing.
- **Tool integration** — connect agents to AWS services, GitHub APIs, databases, or any external system referenced in the SOP.
- **Human-in-the-loop gates** — pause execution at `MUST approve` steps and wait for a human signal before proceeding.
- **Resumability** — if an agent run fails, restart from the last completed checkpoint rather than from scratch.

**Quickstart example:**
```python
from strands import Agent
from strands_tools import file_read, shell

# Load the SOP from the repository
agent = Agent(
    system_prompt=file_read("docs/sops/deploy-web-service.md"),
    tools=[file_read, shell],
)

# Run the SOP with environment-specific parameters
agent("""
Deploy the web service using the SOP.
Parameters:
- environment: staging
- image_tag: v1.4.2
- approval_required: false
""")
```

See the [Strands Agent SOP repository](https://github.com/strands-agents/agent-sop/tree/main) for production-ready SOP templates covering deployment, incident response, and code review workflows.

---

## End-to-end workflow

The following steps show how all the pieces fit together in a single feature delivery cycle.

### Step 1 — Prototype with vibe coding

Use a vibe-coding tool (Lovable, bolt.new, Replit) to generate a working prototype from a plain-English description. The goal is speed and idea validation, not production code.

### Step 2 — Write the Spec

Open Kiro (or create a Markdown document) and write a Spec for the feature you want to productionise:

- Document acceptance criteria using RFC 2119 keywords.
- Capture architecture constraints (data stores, security boundaries, API contracts).
- List the deployment steps and quality gates.

### Step 3 — Implement with an AI agent

Point Claude Code CLI or Kiro's built-in agent at the Spec. The agent reads the requirements, generates a plan, and works through the task list. Review the plan before approving execution of any irreversible step.

### Step 4 — Enforce quality with Hooks

Configure Kiro Hooks (or CI pipeline steps) to run tests, security scans, and linters automatically. Failed gates block the agent from progressing until the issue is resolved.

### Step 5 — Automate operations with Strands SOPs

For recurring workflows (deployments, incident response, scheduled maintenance), encode the process as a Strands Agent SOP. The SOP becomes the durable, versioned record of how the system is operated — readable by both humans and agents.

### Step 6 — Human approves production

The human reviews the agent's execution log, confirms the plan matches the Spec, and approves the production gate. All decisions are recorded in the SOP progress log for audit purposes.

---

## Choosing your toolchain

| Need | Recommended tool |
|---|---|
| Fast prototype | Lovable, bolt.new, Replit |
| Feature spec with task list | Kiro Specs |
| Automated quality gates | Kiro Hooks |
| Terminal-based AI coding agent | Claude Code CLI |
| Repeatable operational SOPs | Strands Agents SDK |
| IDE with built-in AI | Kiro, Google Antigravity |
| Programmatic agent pipelines | Strands Agents SDK |

---

## Getting started checklist

- [ ] Install [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/overview) and add a `CLAUDE.md` to your project root.
- [ ] Create a `docs/specs/` directory and write your first Spec for an upcoming feature.
- [ ] Open the project in [Kiro](https://kiro.dev/) and configure at least one Hook (e.g. run tests on save).
- [ ] Browse the [Strands Agent SOP templates](https://github.com/strands-agents/agent-sop/tree/main) and adapt one for your deployment workflow.
- [ ] Run the Strands [quickstart](https://strandsagents.com/docs/user-guide/quickstart/overview/) to build your first SOP-driven agent locally.
- [ ] Review the [AI Coding Spectrum](../02-ai-agents/ai-coding-spectrum.md) guide to understand where spec-driven development sits relative to vibe coding and agentic coding.

---

## References

- Kiro IDE — Specs documentation: https://kiro.dev/docs/specs/
- Kiro IDE — Hooks documentation: https://kiro.dev/docs/hooks/
- Strands Agents SDK — Quickstart: https://strandsagents.com/docs/user-guide/quickstart/overview/
- Strands Agent SOP repository: https://github.com/strands-agents/agent-sop/tree/main
- Claude Code CLI overview: https://docs.anthropic.com/en/docs/claude-code/overview
- Prompting Blueprints — AI Coding Spectrum: ../02-ai-agents/ai-coding-spectrum.md
- Prompting Blueprints — Vibe Coding Tech Stack: ../04-guides/vibe-coding-tech-stack.md
