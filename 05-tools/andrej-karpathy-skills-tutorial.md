---
title: "Andrej Karpathy Skills: Karpathy's Coding Rules as a Claude Skill"
tags: ["tools", "skills", "claude-code", "cursor", "ai-coding"]
last_updated: "2026-08-18"
---

# Andrej Karpathy Skills: Karpathy's Coding Rules as a Claude Skill

> [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) is an MIT-licensed repository that turns [Andrej Karpathy's](https://github.com/karpathy) public observations about LLM coding pitfalls into an installable guardrail for coding agents: **four behavioral principles** — Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution — shipped as a Claude Code plugin, a single-file `CLAUDE.md`, and a Cursor project rule. Created by Forrest Chang ([@jiayuan_jy](https://x.com/jiayuan_jy)) and now maintained under the [multica-ai](https://github.com/multica-ai/multica) org, it is one of the most-starred agent-instruction repos on GitHub — **~204k stars and ~20.9k forks at the time of writing** (August 2026).

## Intent
- Explain what the skill does and the failure modes it targets, in Karpathy's own words.
- Walk through the four principles, including the self-tests and the imperative-to-goal transformations that make them enforceable rather than aspirational.
- Install it three ways — Claude Code plugin, per-project `CLAUDE.md`, Cursor rule — and pick the right one for your setup.
- Show what "it's working" looks like in your diffs, and how this baseline relates to this repo's [12 Rules for AI Coding Tools](../04-guides/ai-coding-rules-senior-engineers.md) and [CLAUDE.md design tutorial](claude-md-design-tutorial.md).

## Use when
- Your coding agent keeps **guessing instead of asking**, gold-plating simple requests, or "improving" code you never asked it to touch — and you want the lowest-friction fix that exists (one file, zero configuration).
- You are rolling out AI coding discipline to a team and need a **credible, widely adopted baseline** before writing your own rules file.
- You want a case study in **packaging one set of instructions for multiple harnesses** (plugin, `CLAUDE.md`, Cursor `.mdc` rule) before [building your own skill](../04-guides/claude-building-skills-guide.md).

## The problem, per Karpathy

The repo is derived from [a January 2026 post on X](https://x.com/karpathy/status/2015883857489522876) in which Karpathy catalogued what LLMs reliably get wrong when coding:

- They *"make wrong assumptions on your behalf and just run along with them without checking"* — without surfacing confusion or inconsistencies.
- They *"really like to overcomplicate code and APIs, bloat abstractions, don't clean up dead code."*
- They sometimes alter or remove comments and code they don't fully grasp, even when unrelated to the task.

None of these are capability failures — they are *behavioral* failures, which is exactly what standing instructions can fix. The repo's answer is four principles, each mapped to one of the complaints:

| Principle | Addresses |
| :--- | :--- |
| **Think Before Coding** | Wrong assumptions, hidden confusion, missing tradeoffs |
| **Simplicity First** | Overcomplication, bloated abstractions |
| **Surgical Changes** | Orthogonal edits, touching code you shouldn't |
| **Goal-Driven Execution** | Leverage through tests-first, verifiable success criteria |

## The four principles

### 1. Think Before Coding
**"Don't assume. Don't hide confusion. Surface tradeoffs."** Before implementing: state assumptions explicitly and ask rather than guess; present multiple interpretations when the request is ambiguous instead of silently picking one; push back when a simpler approach exists; and stop when confused — name what's unclear and request clarification.

### 2. Simplicity First
**"Minimum code that solves the problem. Nothing speculative."** No features beyond what was requested, no abstractions for single-use code, no unrequested "flexibility" or "configurability," no handling of impossible error scenarios — and if 200 lines can become 50, make it 50. The built-in test: *would a senior engineer call this overcomplicated? If yes, simplify.*

### 3. Surgical Changes
**"Touch only what you must. Clean up only your own mess."** Don't "improve" adjacent code, comments, or formatting; don't refactor working code; match existing style even when you'd prefer otherwise; mention unrelated dead code rather than deleting it. The one cleanup obligation: remove imports, variables, and functions that *your* change orphaned — but leave pre-existing dead code alone unless asked. The test: *every changed line should directly connect to the user's request.*

### 4. Goal-Driven Execution
**"Define success criteria. Loop until verified."** The principle that turns the other three from etiquette into leverage. Imperative tasks become verifiable goals:

| Instead of... | Transform to... |
| :--- | :--- |
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |

This encodes the repo's key insight, again from Karpathy: *"LLMs are exceptionally good at looping until they meet specific goals."* Don't tell the agent what to do — give it success criteria and let it iterate. That is the same verification-loop thinking covered in this repo's [Loop Engineering primer](../02-ai-agents/01-foundations/loop-engineering.md); here it's compressed into a standing instruction the agent applies to every task on its own.

## Installation

Three paths, per the README. The install commands still reference the original `forrestchang/andrej-karpathy-skills` path — GitHub redirects it to the `multica-ai` org, so both work.

**Option A — Claude Code plugin (recommended):** inside Claude Code, add the marketplace and install:

```text
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

This delivers the guidelines as the `karpathy-guidelines` skill (`skills/karpathy-guidelines/SKILL.md`), whose description triggers it *"when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria"* — i.e., on essentially every coding task, by design. See the [Claude Code plugins tutorial](claude-code-plugins-tutorial.md) for how marketplaces and plugins fit together.

**Option B — per-project `CLAUDE.md`:** copy the single ~65-line file into a new project, or append it to an existing memory file:

```bash
# new project
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md

# existing project (append)
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

Claude Code reads it automatically at session start; put it in `~/.claude/CLAUDE.md` instead for a global default.

**Option C — Cursor:** the repo ships a committed project rule at `.cursor/rules/karpathy-guidelines.mdc`; [CURSOR.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CURSOR.md) covers setup and integration details.

The whole payload is small enough to read before installing — `CLAUDE.md`, `CURSOR.md`, `EXAMPLES.md`, the skill folder, and plugin/rule config — and you should: the same install hygiene applies as for any third-party skill (see [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md)).

### Which install path?

| | **Plugin** | **`CLAUDE.md`** | **Cursor rule** |
| :--- | :--- | :--- | :--- |
| Scope | Everywhere Claude Code runs, once installed | One project (or global via `~/.claude/`) | One Cursor project |
| Updates | `/plugin` update pulls upstream changes | Frozen copy you own and edit | Frozen copy you own and edit |
| Customization | Layer project rules in your own `CLAUDE.md` on top | Edit the file directly | Edit the `.mdc` directly |
| Best for | Individuals who want it on all repos | Teams committing shared rules to the repo | Cursor-first teams |

The `CLAUDE.md` variant is the one to commit to a team repository: everyone (and every harness that reads memory files) gets it, and project-specific rules live in the same file.

## The examples file: principles applied

`EXAMPLES.md` is the most instructive file in the repo — before/after pairs showing each principle against a realistic prompt. A sampler:

- **Think Before Coding — "Make the search faster":** the failure mode is silently picking one meaning of "faster" and building caches. The guideline forces the split: response latency (add indexes, ~2h) vs. throughput (async + pooling, ~4h) vs. perceived speed (progressive results, ~3h) — diagnose, then ask which dimension matters.
- **Simplicity First — "Add a function to calculate discount":** the anti-pattern is an abstract base class + strategy pattern + config system for one calculation. The compliant answer is a three-line function; the abstraction waits until multiple discount types actually exist.
- **Surgical Changes — "Fix the bug where empty emails crash the validator":** fix exactly the empty-email path; leave the username validation, comments, and docstring style untouched. *One commit = one concern.*
- **Goal-Driven Execution — "Add rate limiting to the API":** instead of one big Redis-backed system, four independently verifiable steps — in-memory limiting on one endpoint (test with curl) → middleware for all endpoints (existing tests pass) → Redis for multi-server (test persistence across restarts) → per-endpoint config (verify different rates apply).

The file's closing insight is worth quoting: *"Effective code solves today's requirements with clarity, not tomorrow's hypothetical needs with architecture."*

## How to know it's working

The README defines effectiveness by what your diffs look like, which makes it checkable in review:

- **Fewer unnecessary changes in diffs** — only requested modifications appear.
- **Fewer rewrites due to overcomplication** — code comes out simple the first time.
- **Clarifying questions precede implementation** — not after mistakes.
- **Clean, minimal PRs** — no drive-by refactoring or "improvements."

News coverage of the project cites an AI coding accuracy jump from **65% to 94%** after adding the file — treat that figure as anecdotal (it depends on task mix and model), but the direction matches the mistake-rate evidence in the [12 Rules guide](../04-guides/ai-coding-rules-senior-engineers.md#real-world-implementation-multica-aiandrej-karpathy-skills), which maps these four rules 1:1 onto its rules 1–4.

## Customization and the tradeoff

The guidelines are designed to be **merged, not adopted verbatim**: append your project-specific rules (stack, test requirements, error-handling conventions) below them in the same `CLAUDE.md`, using the [WHAT / WHY / HOW structure](claude-md-design-tutorial.md) — the Karpathy file is the WHY layer, your project supplies the WHAT and HOW.

The README is also honest about the cost: the guidelines **prioritize caution over speed**, and both `CLAUDE.md` and `SKILL.md` explicitly carve out trivial tasks — for typo fixes and obvious one-liners, judgment beats full rigor. The goal is fewer costly mistakes on meaningful work, not ceremony on simple work.

## Key takeaways

- **Four principles, each pinned to a documented failure mode:** Think Before Coding (no silent assumptions), Simplicity First (minimum code, nothing speculative), Surgical Changes (every changed line traces to the request), Goal-Driven Execution (verifiable success criteria, then loop).
- **Goal-Driven Execution is the leverage rule.** "Fix the bug" → "write a test that reproduces it, then make it pass" converts an instruction the agent can fake into a goal it can verify — the essence of loop engineering, embedded as a standing instruction.
- **One instruction set, three packagings** — Claude Code plugin, single-file `CLAUDE.md`, Cursor `.mdc` rule — is why adoption costs under a minute and why the repo works as a template for shipping your own team rules across harnesses.
- **Success is measured in diffs**: only requested changes, simpler first drafts, questions before code, minimal PRs. If your reviews don't feel different, it isn't working.
- **It's a baseline, not a destination**: layer project-specific rules on top, and graduate to the fuller [12-rule set](../04-guides/ai-coding-rules-senior-engineers.md) (token budgets, read-before-write, fail-loud) as your codebase's specific failure modes appear.

## References
- multica-ai – [andrej-karpathy-skills (GitHub)](https://github.com/multica-ai/andrej-karpathy-skills) (README: problems, four principles, install options, effectiveness signals, customization, tradeoff note)
- multica-ai – [andrej-karpathy-skills: CLAUDE.md (raw)](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) (the ~65-line guidelines file itself)
- multica-ai – [andrej-karpathy-skills: karpathy-guidelines skill (SKILL.md)](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md) (the plugin-delivered skill variant and its trigger description)
- multica-ai – [andrej-karpathy-skills: EXAMPLES.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/EXAMPLES.md) (before/after scenarios for all four principles)
- multica-ai – [andrej-karpathy-skills: CURSOR.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CURSOR.md) (Cursor rule setup)
- Andrej Karpathy – [observations on LLM coding pitfalls (X)](https://x.com/karpathy/status/2015883857489522876) (the post the guidelines are derived from)
- multica-ai – [Multica (GitHub)](https://github.com/multica-ai/multica) (the maintainers' open-source platform for running coding agents with reusable skills)
- Related in this repo: [12 Rules for AI Coding Tools](../04-guides/ai-coding-rules-senior-engineers.md) · [CLAUDE.md Design Tutorial](claude-md-design-tutorial.md) · [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) · [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) · [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) · [Claude Code Plugins Tutorial](claude-code-plugins-tutorial.md) · [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md) · [Prompt Master Skill Tutorial](prompt-master-skill-tutorial.md) · [Superpowers Tutorial](superpowers-tutorial.md)
