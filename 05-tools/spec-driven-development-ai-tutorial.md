---
title: "Spec-Driven Development with AI Tools"
tags: ["tools", "spec-driven"]
last_updated: "2026-03-25"
---

# Spec-Driven Development with AI-Native Tools (2026 Tutorial)

## Intent
- Use this tutorial to move from fast **vibecoding prototypes** to production-grade delivery with a **spec-driven development** workflow.
- Combine AI-native IDEs, CLI agents, and SOP-based orchestration so humans approve decisions while agents execute repeatable work.

## Why this approach matters
A practical framing from recent conference material is:

> **Vibe coding ships the prototype, traditional SDLC practices ship the product.**

Spec-driven development closes the gap between those two speeds:
- Keep the creativity and speed of vibecoding during early implementation.
- Add explicit specs, quality gates, and operational steps so teams can ship and maintain production systems.

A simple lifecycle to adopt:
1. Planning & design
2. Implementation (high-speed vibecoding)
3. Issues found
4. Testing & QA
5. Deployment
6. Maintenance

## Core principles for AI-assisted spec execution
The SOP-oriented model maps well to modern AI agents:

- **Structured steps**
  - Define explicit, ordered steps with RFC 2119 language (**MUST**, **SHOULD**, **MAY**) for precision.
- **Parameterized inputs**
  - Use templates with variables instead of hardcoded values (environment, region, model, repo path, risk level).
- **AI-assisted authoring**
  - Create and refine SOPs/specs from natural language quickly.
- **Progress tracking**
  - Require agents to report progress, assumptions, blockers, and outputs at each phase.

## The actor model (human + agents)
Use a 3-actor operating model:

1. **SOP / Spec (the blueprint)**
   - Stores architecture decisions, security constraints, delivery steps, and acceptance criteria.
   - Acts as a reusable, versioned execution contract.

2. **AI executor (the builder)**
   - Reads the spec/SOP.
   - Generates and edits code/infrastructure.
   - Runs commands, tests, and checks.
   - Adapts based on failures and logs rationale.

3. **Human reviewer (the approver)**
   - Sets constraints and risk boundaries upfront.
   - Reviews plans, checkpoints, and artifacts.
   - Approves or blocks production rollout.

## Tool stack for spec-driven development

### 1) AI-native IDE layer: Kiro and Google Antigravity
- **Kiro IDE**: Use its native **Specs** workflow to formalize problem, scope, requirements, and acceptance criteria before large implementation changes.
- **Google Antigravity**: Use as an AI-native coding environment for delegated implementation tasks and rapid execution loops.

### 2) CLI execution layer: Claude Code CLI
- Use **Claude Code CLI** for terminal-first, repo-aware execution:
  - apply multi-file code edits,
  - run tests/lint/build checks,
  - draft and refine implementation from spec sections.

### 3) Agent orchestration layer: Strands Agents SDK + SOP templates
- Use **Strands Agents SDK** to create agent workflows around explicit SOPs/specs.
- Reuse patterns from **agent-sop** examples for structured, parameterized, and traceable agent execution.

## Step-by-step tutorial workflow

## Step 1 — Write a product-facing spec first
Create a short spec document before coding:

```markdown
# Feature Spec: <name>

## Problem
## User outcomes
## Constraints (security, compliance, cost)
## Acceptance criteria
## Non-goals
## Test plan
## Rollout + rollback plan
```

Tips:
- Keep acceptance criteria testable.
- Include operational constraints (latency/SLA/cost ceilings).
- Add a rollback trigger.

## Step 2 — Convert spec into an executable SOP
Transform each acceptance criterion into stepwise tasks with RFC 2119 language:

```markdown
1. The agent MUST implement endpoint X with schema Y.
2. The agent SHOULD add integration tests for scenarios A/B/C.
3. The agent MUST fail the run if coverage is below threshold Z.
4. The agent MAY propose refactors, but MUST not merge without approval.
```

## Step 3 — Use Kiro Specs for planning and decomposition
Inside Kiro:
- break the feature into milestones,
- define implementation sequence,
- map each milestone to concrete checks (tests, lint, security scans),
- review generated plan before execution.

## Step 4 — Add Kiro Hooks for quality gates
Use Hooks to enforce policy and consistency during execution, for example:
- before file write: check architecture boundaries,
- before commit: run tests + static checks,
- before deploy: require approval summary + risk checklist.

## Step 5 — Execute implementation in CLI loops
Run implementation loops with AI CLI tooling (for example Claude Code CLI):
- provide one SOP step at a time,
- require a short progress report after each step,
- capture failed commands and required remediations,
- re-run until acceptance criteria pass.

## Step 6 — Add Strands orchestration for repeatability
Use Strands Agents SDK when the workflow becomes multi-agent or recurrent:
- planning agent → coding agent → validation agent → reporting agent,
- shared context via parameterized inputs,
- progress logs persisted for audits and retrospectives.

## Step 7 — Human approval gates
Before production:
- review evidence (test output, diff summary, risk notes),
- approve/reject with explicit reason,
- if rejected, update spec/SOP parameters and re-run.

## Example prompt pack for spec-driven vibecoding

### Prompt A — Build plan from spec
```text
You are the implementation planner.
Given this feature spec, produce:
1) milestone plan,
2) ordered task list,
3) risk list,
4) validation checklist.
Use MUST/SHOULD/MAY language and include stop conditions.
```

### Prompt B — Execute one SOP step
```text
Execute only SOP Step <N>.
Before writing code, restate assumptions.
After changes, run required checks and report:
- files changed
- commands run
- pass/fail
- open risks
If checks fail, propose minimal fix and retry once.
```

### Prompt C — Gate for human approval
```text
Prepare release gate summary for human approver:
- acceptance criteria status
- evidence table (criterion -> proof)
- rollback plan
- unresolved risks
Output in concise Markdown.
```

## Practical rollout advice
- Start with one team and one feature class (e.g., internal APIs).
- Keep SOP/spec templates in version control.
- Track lead time, escaped defects, and rework rate before/after adoption.
- Treat vibecoding as an ideation/acceleration phase, not a substitute for production controls.

## Related guides
- [AI Coding Spectrum](../02-ai-agents/ai-coding-spectrum.md)
- [Context Engineering](../02-ai-agents/context-engineering.md)
- [Claude Code Tool Guide](./claude-code-tool-guide.md)
- [Coding AI Agent Selection Tutorial](./coding-ai-agent-selection-tutorial.md)

## References
- Kiro Specs documentation: <https://kiro.dev/docs/specs/>
- Kiro Hooks documentation: <https://kiro.dev/docs/hooks/>
- Strands Agents SDK quickstart: <https://strandsagents.com/docs/user-guide/quickstart/overview/>
- Strands agent-sop examples: <https://github.com/strands-agents/agent-sop/tree/main>
- Google Antigravity quickstart codelab: <https://codelabs.developers.google.com/getting-started-google-antigravity#0>
- Claude Code quickstart: <https://code.claude.com/docs/en/quickstart>
