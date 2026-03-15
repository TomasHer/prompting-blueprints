# Claude Code Certification Guide (Claude Certified Architect Foundations)

## Intent
Use this page to prepare for the **Claude Certified Architect Foundations** exam and turn the exam domains into practical Claude Code workflows.

## Certification access
- Access request page: <https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request>
- Exam format: **60 questions** across five core competency areas.

## What you'll be tested on

| Competency area | Weight | What to focus on in practice |
| --- | ---: | --- |
| Agentic Architecture & Orchestration | 27% | Design agentic loops, orchestrate coordinator-subagent systems, decompose tasks, and enforce stateful workflows. |
| Claude Code Configuration & Workflows | 20% | Configure `CLAUDE.md` hierarchies, create slash commands, apply path-specific rules, use plan mode intentionally, and fit workflows into CI/CD. |
| Prompt Engineering & Structured Output | 20% | Write prompts with explicit criteria, use few-shot examples, enforce JSON schema outputs, and add validation + retry loops. |
| Tool Design & MCP Integration | 18% | Design clear tool boundaries, return structured errors, integrate MCP servers, and allocate tools across agents correctly. |
| Context Management & Reliability | 15% | Preserve critical context in long sessions, define escalation patterns, handle error propagation across agents, and calibrate confidence. |

## Domain-by-domain preparation blueprint

### 1) Agentic Architecture & Orchestration (27%)
**Study goals**
- Distinguish when to use a single agent vs. coordinator + specialist subagents.
- Design loop boundaries (plan → execute → verify → refine).
- Store and enforce session state so tasks remain deterministic.

**Practice checklist**
- Build a coordinator prompt that assigns work to 2-3 subagents with explicit contracts.
- Add a completion protocol ("done only if tests + checks pass").
- Simulate task decomposition on a multi-file change and review handoff quality.

### 2) Tool Design & MCP Integration (18%)
**Study goals**
- Define input/output contracts for each tool.
- Standardize error categories (validation, auth, timeout, dependency).
- Integrate MCP servers with clear ownership per agent role.

**Practice checklist**
- Design one tool contract with JSON input schema and typed output.
- Add structured error examples for failure modes.
- Map which tools are global vs. subagent-specific.

### 3) Claude Code Configuration & Workflows (20%)
**Study goals**
- Use `CLAUDE.md` at repo + path levels to enforce coding standards.
- Create repeatable slash command workflows for frequent tasks.
- Know when plan mode is better than immediate execution.

**Practice checklist**
- Draft root `CLAUDE.md` plus one path-scoped `CLAUDE.md` override.
- Define at least three slash commands (e.g., `/plan`, `/verify`, `/ship`).
- Run a "plan-first" session and compare quality vs. direct execution.

### 4) Prompt Engineering & Structured Output (20%)
**Study goals**
- Write prompts with measurable acceptance criteria.
- Use few-shot demonstrations to control style/structure.
- Enforce machine-readable outputs and validate them.

**Practice checklist**
- Create one prompt that must return JSON matching a schema.
- Add a retry policy for malformed outputs.
- Include confidence and rationale fields when uncertainty is high.

### 5) Context Management & Reliability (15%)
**Study goals**
- Persist key context across long, multi-step sessions.
- Define escalation rules for ambiguity and high-risk actions.
- Prevent silent failures in multi-agent pipelines.

**Practice checklist**
- Maintain a session summary block (goals, constraints, open risks).
- Add an escalation trigger list ("ask user before destructive action").
- Add confidence calibration labels (`high`, `medium`, `low`) tied to evidence quality.

## Suggested 2-week study plan

### Week 1: architecture + tools
- Day 1-2: Agentic loops and orchestration patterns.
- Day 3-4: Tool design contracts and structured errors.
- Day 5: MCP integration and tool distribution across roles.
- Day 6-7: Mini mock exam (30 mixed questions) + error review log.

### Week 2: workflows + prompting + reliability
- Day 8-9: `CLAUDE.md` hierarchy and slash command workflows.
- Day 10-11: Structured output prompting, schema validation, retry loops.
- Day 12-13: Context persistence, escalation, confidence calibration.
- Day 14: Full mock exam (60 questions) with domain-level score breakdown.

## Rapid self-assessment prompts
Use these prompts in your own prep sessions:

```text
Create 10 multiple-choice questions on coordinator-subagent orchestration.
After each answer, explain why the correct option is best and why the distractors are wrong.
```

```text
Given this tool spec, identify contract flaws, propose structured error responses,
and suggest where this tool should live in a multi-agent architecture.
```

```text
Evaluate this prompt for schema reliability. Return:
1) failure modes, 2) stricter prompt rewrite, 3) JSON schema, 4) retry policy.
```

## Exam-day strategy
- Start with strongest domains first to secure early points.
- Mark uncertain questions and revisit after a full pass.
- Watch for wording about **when** to orchestrate, escalate, or enforce schema validation.
- Prefer answers with explicit guardrails, deterministic outputs, and clear ownership boundaries.

## Related pages
- [Claude Agent Skills Playbook](../02-ai-agents/claude-agent-skills.md)
- [Model Context Protocol (MCP) Quick Start](../02-ai-agents/mcp-guide.md)
- [Claude Code Tool Guide](./claude-code-tool-guide.md)
- [Claude Code Cheatsheet Tutorial](./claude-code-cheatsheet-tutorial.md)

## References
- Anthropic Skilljar — Claude Certified Architect Foundations Access Request: <https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request>
