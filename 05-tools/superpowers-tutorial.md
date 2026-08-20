---
title: "Superpowers: A Complete Development Methodology as Claude Skills"
tags: ["tools", "skills", "claude-code", "agents", "tdd", "workflows"]
last_updated: "2026-08-20"
---

# Superpowers: A Complete Development Methodology as Claude Skills

> [Superpowers](https://github.com/obra/superpowers) is an MIT-licensed repository by [Jesse Vincent](https://github.com/obra) (obra) and the Prime Radiant team that packages *"a complete software development methodology for your coding agents, built on top of a set of composable skills."* Instead of one rules file, it ships **14 skills** that chain into a seven-stage workflow — brainstorm → isolate in a git worktree → write a plan → implement via subagents → test-driven development → code review → finish the branch — and installs as a plugin on **14+ agent platforms** (Claude Code, Cursor, Codex, Gemini CLI, Copilot CLI, Devin, and more). It is one of the most-starred skill libraries on GitHub — **~274.6k stars and ~24.6k forks at the time of writing** (August 2026).

## Intent
- Explain what Superpowers is: not a grab-bag of skills but a *methodology* — skills designed to trigger automatically and hand off to each other across the whole development lifecycle.
- Tour the 14 skills and the seven-stage workflow they compose into.
- Install it on Claude Code (two marketplace paths) and know where to find the commands for the other 13 platforms.
- Show how it differs from single-file rule sets like [Andrej Karpathy Skills](andrej-karpathy-skills-tutorial.md), and how its `writing-skills` meta-skill turns the library into a template for your own.

## Use when
- Your agent writes code before understanding the problem, declares victory without running the tests, or "fixes" bugs by symptom-patching — and per-task prompting hasn't fixed it.
- You want **process discipline end-to-end** (design → plan → TDD → review → merge), not just behavioral guardrails on individual edits.
- You run **parallel or subagent-heavy workflows** (worktrees, dispatched agents) and need a shared methodology all of them follow.
- You want a widely adopted, readable reference for **how skills compose and enforce workflows** before [building your own](../04-guides/claude-building-skills-guide.md).

## The idea: skills as a methodology, not suggestions

Most instruction repos give the agent *rules* ("don't overcomplicate", "ask before assuming"). Superpowers goes a step further: each skill is a **mandatory workflow** the agent must check for and invoke before acting. The gatekeeper is the `using-superpowers` skill, whose description wires it to *"any conversation"* and whose body is unambiguous:

> *"If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill."*

It even lists the rationalizations agents use to skip process — "this question is simple", "let me get context first", "the skill is overkill here", "just one thing first" — and flags them as red flags. The hierarchy is explicit: **user instructions override skills, skills override default behavior** — the human can always opt out, but the agent can't quietly do so on its own.

When several skills apply, *process* skills (brainstorming, systematic-debugging) take precedence over *implementation* skills: methodology is established first, then the work is executed inside it. This is the same skills machinery covered in [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) — Markdown files with YAML frontmatter whose `description` drives triggering — but pushed to its logical conclusion: the frontmatter doesn't just *offer* a capability, it *enforces* a process.

## The 14 skills

| Group | Skill | What it enforces |
| :--- | :--- | :--- |
| Testing | `test-driven-development` | RED–GREEN–REFACTOR: failing test → minimal code → passing test → commit, with an anti-patterns reference |
| Debugging | `systematic-debugging` | Four-phase root-cause analysis instead of symptom-patching |
| Debugging | `verification-before-completion` | Evidence that the fix works *before* declaring success |
| Collaboration | `brainstorming` | Socratic design refinement — clarifying questions and digestible design specs before any code |
| Collaboration | `writing-plans` | Task breakdown into 2–5 minute chunks with exact file paths and verification steps |
| Collaboration | `executing-plans` | Batch execution with checkpoints |
| Collaboration | `subagent-driven-development` | Fresh agent per task with two-stage review (spec compliance, then quality) |
| Collaboration | `dispatching-parallel-agents` | Concurrent subagent workflows |
| Collaboration | `using-git-worktrees` | Isolated branch workspaces, project setup, baseline verification |
| Collaboration | `finishing-a-development-branch` | Merge/PR decision workflow and cleanup |
| Collaboration | `requesting-code-review` | Pre-review checklist; issues reported by severity |
| Collaboration | `receiving-code-review` | How to respond to feedback (not all of it is right) |
| Meta | `writing-skills` | Creating new skills that follow the library's own best practices |
| Meta | `using-superpowers` | The gatekeeper: find and invoke relevant skills before any response |

## The seven-stage workflow

The skills are designed to hand off to each other, so a feature request flows through a pipeline without you steering:

1. **`brainstorming`** — before writing code, the agent refines the idea through questions, presents the design in digestible sections, and validates it with you.
2. **`using-git-worktrees`** — creates an isolated workspace on a new branch, runs project setup, verifies a clean baseline.
3. **`writing-plans`** — decomposes the design into small tasks (2–5 minutes each) with exact file paths and per-task verification steps.
4. **`subagent-driven-development`** (or `executing-plans`) — dispatches a fresh subagent per task; each result passes a two-stage review — first against the spec, then for quality.
5. **`test-driven-development`** — every task follows RED–GREEN–REFACTOR; no production code without a failing test first.
6. **`requesting-code-review`** — the finished work is reviewed against the plan, with issues categorized by severity.
7. **`finishing-a-development-branch`** — tests verified, merge/PR options presented, workspace cleaned up.

Two threads from this repo's foundations pages run through the whole design. The plan-then-verify loop per task is [loop engineering](../02-ai-agents/01-foundations/loop-engineering.md) made concrete: each 2–5 minute task ships with its own success criteria, so subagents iterate against something checkable. And stages 1–3 are a lightweight form of [spec-driven development](spec-driven-development-tutorial.md) — the design and plan are artifacts you review before implementation begins.

## Installation

**Claude Code** has two paths. The official marketplace:

```text
/plugin install superpowers@claude-plugins-official
```

or Jesse Vincent's own marketplace, which tracks the repo directly:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Skills trigger automatically from then on — *"you don't need to do anything special."* A session-start hook injects the `using-superpowers` gatekeeper so the skill check happens from the first message.

The same payload installs on 13 other platforms, each documented in the README — a sampler:

| Platform | Command |
| :--- | :--- |
| Cursor | `/add-plugin superpowers` |
| Devin CLI | `devin plugins install obra/superpowers` |
| GitHub Copilot CLI | `copilot plugin marketplace add obra/superpowers-marketplace` then `copilot plugin install superpowers@superpowers-marketplace` |
| Gemini CLI | `gemini extensions install https://github.com/obra/superpowers` |
| Factory Droid | `droid plugin marketplace add https://github.com/obra/superpowers` then `droid plugin install superpowers@superpowers` |
| Hermes Agent | `hermes plugins install obra/superpowers --enable` |

Also supported: Antigravity, Codex (app and CLI), Grok Build, Kimi Code, OpenCode, and Pi. That breadth makes the repo a working case study in **one skill library, many harnesses** — the platform adapters live in per-platform directories (`.claude-plugin/`, `.cursor-plugin/`, `.opencode/`, …) around a single shared `skills/` core.

Two pre-install notes:

- **Read it first.** The payload is 14 skill folders of plain Markdown plus hooks and scripts — auditable in one sitting, and you should: the same hygiene applies as for any third-party skill (see [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md)).
- **Telemetry is on by default** (anonymous, version-only — no project details) via the logo fetch in brainstorming's visual companion. Disable with `SUPERPOWERS_DISABLE_TELEMETRY=true`; it also respects `DISABLE_TELEMETRY` and `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`.

## `writing-skills`: the library that grows itself

The most consequential meta-choice in the repo: it includes a skill for **writing new skills** that follow its own conventions — triggering descriptions, enforced workflows, anti-pattern references. In practice that means the methodology is extensible from inside a session: hit a recurring failure mode Superpowers doesn't cover, and the agent can draft a new skill for it using the house style, which you then review and commit.

That makes the repo double as a **skills-engineering reference**: even if you never install it, `skills/` is 14 worked examples of the patterns covered in [Skills Design Patterns](../02-ai-agents/02-skills/skills-design-patterns.md) and the [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) — including the hardest one, making a skill *binding* rather than advisory. Test any skill you author the same way you'd test the library's own: see [Skills Testing & Iteration](../02-ai-agents/02-skills/skills-testing-iteration.md).

## Superpowers vs. single-file rule sets

How does this relate to [Andrej Karpathy Skills](andrej-karpathy-skills-tutorial.md), the other mega-starred agent-instruction repo?

| | **Karpathy Skills** | **Superpowers** |
| :--- | :--- | :--- |
| Shape | Four principles in one ~65-line file | 14 composable skills + hooks |
| Governs | *How the agent behaves* while coding | *What process the work goes through* |
| Footprint | Near zero — read in a minute | A full methodology — changes how sessions feel |
| Enforcement | Self-tests the agent applies | Mandatory skill invocation, gatekeeper skill, staged handoffs |
| Ceremony cost | Minimal | Real — brainstorming and planning precede code even for mid-size tasks |
| Best for | A behavioral baseline on any task | Feature work you want designed, planned, tested, and reviewed |

They're complementary, not competing: Karpathy-style rules govern each edit; Superpowers governs the pipeline the edits happen in. The cost is honest, though — Superpowers front-loads questions and planning, which is overhead on trivial fixes. The escape hatch is built into the hierarchy: your instructions override the skills, so you can tell the agent to skip the ceremony when a one-liner really is a one-liner.

## Key takeaways

- **Superpowers is a methodology shipped as skills**: 14 composable Markdown skills that chain into a seven-stage pipeline — brainstorm, worktree, plan, subagent implementation, TDD, review, finish — rather than a list of standing rules.
- **The gatekeeper is the trick.** `using-superpowers` triggers on every conversation and makes skill invocation mandatory ("even a 1% chance a skill might apply"), with named red-flag rationalizations — that's what turns advisory documentation into enforced process.
- **Verification is everywhere**: plans carry per-task verification steps, TDD requires the failing test first, `verification-before-completion` blocks premature success claims — loop engineering embedded as standing process.
- **One skill core, 14+ harnesses**: a single `skills/` library with per-platform plugin adapters is the current best worked example of packaging skills portably.
- **It grows itself**: the `writing-skills` meta-skill lets the library extend in-session in its own house style — and makes the repo a top-tier reference for authoring your own skills, installed or not.
- **Budget for the ceremony**: design questions and plans before code are the point, and also the cost; use your override authority for trivial tasks, or pair a lighter rule set for quick edits.

## References
- obra – [superpowers (GitHub)](https://github.com/obra/superpowers) (README: skills library, seven-stage workflow, per-platform install commands, telemetry notes)
- obra – [superpowers: skills library (GitHub)](https://github.com/obra/superpowers/tree/main/skills) (the 14 skill folders)
- obra – [superpowers: using-superpowers SKILL.md (GitHub)](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) (the gatekeeper skill: mandatory invocation, red flags, override hierarchy)
- obra – [superpowers-marketplace (GitHub)](https://github.com/obra/superpowers-marketplace) (the author-maintained Claude Code / Copilot CLI marketplace)
- Jesse Vincent – [Superpowers announcement (blog.fsck.com)](https://blog.fsck.com/2025/10/09/superpowers/) (the October 2025 launch post)
- Prime Radiant – [Superpowers release announcements](https://primeradiant.com/superpowers/)
- Related in this repo: [Andrej Karpathy Skills Tutorial](andrej-karpathy-skills-tutorial.md) · [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) · [Skills Design Patterns](../02-ai-agents/02-skills/skills-design-patterns.md) · [Skills Testing & Iteration](../02-ai-agents/02-skills/skills-testing-iteration.md) · [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) · [Claude Code Plugins Tutorial](claude-code-plugins-tutorial.md) · [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) · [Spec-Driven Development Tutorial](spec-driven-development-tutorial.md) · [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md)
