---
title: "Agent Skills: Engineering Workflows for AI Coding Agents"
tags: ["agents", "skills", "tools", "software-engineering"]
last_updated: "2026-07-11"
---

# Agent Skills: Engineering Workflows for AI Coding Agents

## Intent

Help developers give their AI coding agents the workflows, quality gates, and
judgment that senior engineers bring to real software — so agents stop
defaulting to the shortest path and start shipping production-quality code.
This tutorial covers [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills),
an open-source, tool-agnostic collection of 24 engineering skills.

## Use when

- Your AI agent skips the spec, the tests, or the review — the exact things
  that separate production code from a prototype.
- You want a repeatable process an agent follows consistently across every
  phase of the lifecycle, not one-off prompting.
- You use one (or several) of Claude Code, Cursor, Codex, Copilot, Gemini CLI,
  Antigravity, Windsurf, OpenCode, or Kiro and want the same standards to apply
  everywhere.

---

## The problem: agents default to the shortest path

An AI coding agent, left to its own devices, optimizes for "make the task
disappear." That usually means writing code first, skipping the specification,
skipping the tests, and skipping the review. It produces something that *looks*
done — a demo that runs — but carries none of the rigour that makes software
maintainable, secure, and safe to extend.

Agent Skills exists to stop that. It encodes the workflows, quality gates, and
best practices senior engineers already use, packaged so agents follow them
consistently across every phase of building software:

```
define → plan → build → verify → review → ship
```

The design philosophy is **"process, not prose"**: each skill is an executable
workflow the agent *runs*, not reference documentation it reads. Skills embed
hard-won engineering judgment — Hyrum's Law for API design, the Beyoncé Rule
for testing, Chesterton's Fence for simplification, trunk-based development for
git, Shift Left for CI/CD, and treating code as a liability for deprecation.

---

## Quick start

Agent Skills ships a universal CLI that works across 70+ agents. The fastest
path is:

```bash
# Add all 24 skills
npx skills add addyosmani/agent-skills

# Browse the catalogue before installing
npx skills add addyosmani/agent-skills --list

# Install a single skill
npx skills add addyosmani/agent-skills --skill test-driven-development
```

Then:

1. **Invoke a slash command** that matches your current phase (`/spec`,
   `/plan`, `/build`, `/test`, `/review`, `/ship`).
2. **Skills activate automatically** based on context — designing an API pulls
   in `api-and-interface-design`; building UI pulls in `frontend-ui-engineering`.
3. **Use `/build auto`** to generate a plan and implement every task
   autonomously after a single approval, pausing only for failures.
4. **Every step is verifiable** — tests, builds, runtime data. "Seems right" is
   rejected.

---

## Tool-specific setup

| Tool | Setup |
| --- | --- |
| **Universal CLI** (70+ agents) | `npx skills add addyosmani/agent-skills` |
| **Claude Code** | `/plugin marketplace add addyosmani/agent-skills` |
| **Cursor** | Add skills to the `.cursor/skills/` directory |
| **Codex** | `codex plugin marketplace add addyosmani/agent-skills` |
| **Gemini CLI** | `gemini skills install https://github.com/addyosmani/agent-skills.git --path skills` |
| **Antigravity CLI** | `agy plugin install https://github.com/addyosmani/agent-skills.git` |
| **Windsurf, OpenCode, GitHub Copilot, Kiro** | Configuration-based setup (see repo docs) |

Because every skill is plain Markdown, it runs on **anything that reads
Markdown** — the list above is convenience, not a requirement.

---

## The map: one skill for every phase

24 structured workflows, organized by the lifecycle senior engineers already
follow. Slash commands are the entry points; skills are the process.

| Phase | Command | Skills |
| --- | --- | --- |
| **Define** | `/spec` | `interview-me`, `idea-refine`, `spec-driven-development` |
| **Plan** | `/plan` | `planning-and-task-breakdown` |
| **Build** | `/build` | `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design` |
| **Verify** | `/test` | `browser-testing-with-devtools`, `debugging-and-error-recovery` |
| **Review** | `/review` | `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` |
| **Ship** | `/ship` | `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch` |

Two more commands cut across phases: `/webperf` (measure performance) and
`/code-simplify` (clarity over cleverness).

The 24th skill is the meta-skill: **`using-agent-skills`**. It is injected at
session start and routes every incoming task to the right phase and skill above,
so the developer rarely has to remember which command to run.

---

## What each phase gives your agent

### Define — decide what to build before writing code
- **interview-me** — extracts requirements one question at a time.
- **idea-refine** — divergent/convergent thinking that lands on a concrete proposal.
- **spec-driven-development** — write the PRD before the code.

### Plan — turn the spec into verifiable work
- **planning-and-task-breakdown** — decompose specs into small, atomic,
  verifiable tasks.

### Build — implement one slice at a time
- **incremental-implementation** — thin vertical slices behind feature flags.
- **test-driven-development** — Red-Green-Refactor with an 80/15/5 test pyramid.
- **context-engineering** — feed the agent the right information at the right time.
- **source-driven-development** — ground decisions in official documentation.
- **doubt-driven-development** — adversarial in-flight review for high-stakes changes.
- **frontend-ui-engineering** — components, design systems, WCAG 2.1 AA.
- **api-and-interface-design** — contract-first design, mindful of Hyrum's Law.

### Verify — prove it works
- **browser-testing-with-devtools** — runtime inspection via Chrome DevTools MCP.
- **debugging-and-error-recovery** — five-step triage: reproduce, localize,
  reduce, fix, guard.

### Review — improve code health
- **code-review-and-quality** — five-axis review with ~100-line change sizing.
- **code-simplification** — Chesterton's Fence; reduce complexity while
  preserving behavior.
- **security-and-hardening** — OWASP Top 10, auth patterns, secrets management.
- **performance-optimization** — Core Web Vitals with a measurement-first approach.

### Ship — get it to production safely
- **git-workflow-and-versioning** — trunk-based development, atomic commits.
- **ci-cd-and-automation** — Shift Left, feature flags, quality-gate pipelines.
- **deprecation-and-migration** — code-as-liability mindset; remove zombie code.
- **documentation-and-adrs** — Architecture Decision Records and API docs.
- **observability-and-instrumentation** — structured logging, RED metrics, OpenTelemetry.
- **shipping-and-launch** — pre-launch checklists, staged rollouts, rollback procedures.

---

## Specialist personas

Beyond the phase skills, four personas can be summoned to review work from a
specific point of view:

| Persona | Role | Perspective |
| --- | --- | --- |
| **code-reviewer** | Senior Staff Engineer | Five-axis review standard |
| **test-engineer** | QA Specialist | Test strategy and coverage |
| **security-auditor** | Security Engineer | Threat modeling; OWASP assessment |
| **web-performance-auditor** | Web Performance Engineer | Core Web Vitals; Quick/Deep modes |

---

## Anatomy of a skill

Each skill is a self-contained Markdown file with a consistent structure — the
same pattern covered in [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md):

- **Frontmatter** — `name`, `description`, and usage triggers.
- **Overview** — what the skill does.
- **When to Use** — the triggering conditions.
- **Process** — the step-by-step workflow the agent executes.
- **Rationalizations** — common excuses paired with documented rebuttals
  (anti-rationalization tables), so an agent can't talk itself out of the rigour.
- **Red Flags** — warning signs that something is off.
- **Verification** — evidence requirements; "seems right" is not acceptable.

Skills pull in shared reference checklists as needed, including:
`definition-of-done.md`, `testing-patterns.md`, `security-checklist.md`,
`performance-checklist.md`, `accessibility-checklist.md`,
`observability-checklist.md`, and `orchestration-patterns.md`.

---

## Why it works

- **The process is the guardrail.** Because skills are executable workflows with
  built-in verification, the agent can't quietly skip the spec, the tests, or
  the review — the shortest path is closed off.
- **Anti-rationalization is explicit.** Documented rebuttals stop the agent from
  talking itself out of doing the hard-but-correct thing.
- **It is tool-agnostic.** The same 24 skills apply whether the developer is in
  Claude Code today and Cursor tomorrow, so standards travel with the team, not
  the tool.
- **It encodes judgment, not just steps.** Hyrum's Law, the Beyoncé Rule,
  Chesterton's Fence, Shift Left, and trunk-based development are baked into the
  relevant skills rather than left to the agent to rediscover.

## Failure modes

- **Installing all 24 and never invoking a command.** Skills activate on context
  and on slash commands — if the agent is never pointed at a phase, it falls back
  to shortest-path behavior. Start each task with the matching command.
- **Running `/build auto` without reading the plan.** Autonomous mode implements
  every task after one approval; approve the *plan*, not just the idea.
- **Treating skills as docs.** They are process. Reading them isn't the point —
  running them, and honoring the verification step, is.
- **Skipping verification.** If you let the agent declare victory on "seems
  right," you've defeated the purpose. Demand the tests, builds, or runtime data.

---

## Related in this repo

- [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md)
- [Claude Agent Skills Playbook](./claude-agent-skills.md)
- [Skills Design Patterns](./skills-design-patterns.md)
- [Skills Testing and Iteration](./skills-testing-iteration.md)
- [Spec-Driven Development Tutorial](../../05-tools/spec-driven-development-tutorial.md)
- [The 10X Developer in the Agentic Era](../../04-guides/10x-developer-agentic-era.md)

## Source

- Repository: <https://github.com/addyosmani/agent-skills> (MIT licensed)
