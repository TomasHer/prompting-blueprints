---
title: "12 Rules for Using AI Coding Tools — Senior Engineer Edition"
tags: ["guides", "ai-coding", "best-practices"]
last_updated: "2026-05-20"
---

# 12 Rules for Using AI Coding Tools — Senior Engineer Edition

> "90% of Claude's mistakes come from missing context, not a weak model."
> — Andrej Karpathy

## Intent

Translate hard-won team experience into a concise rules file so every developer on a project gets consistent, high-quality results from AI coding assistants (Claude Code, Copilot, Codex, Cursor, and similar tools).

## Use when

- You are onboarding a team to AI-assisted development and want shared ground rules.
- You keep seeing the same failure modes — bloated diffs, duplicate helpers, silent data loss — and want a checklist to cite in code review.
- You are writing a `CLAUDE.md`, `AGENTS.md`, or equivalent context file and need a battle-tested baseline.

## Why rules matter

Three data points from teams that measured the impact of a rules file on AI mistake rate:

| Setup | Mistake rate |
| --- | --- |
| No rules file | 41% |
| 4-rule baseline | 11% |
| 12-rule version (below) | 3% |

The model is not the bottleneck. Missing context is.

---

## The 12 rules

### 1. Think before coding — state assumptions, don't guess

The model cannot read your mind. Write down your intent, constraints, and assumptions before sending a task. If you skip this step, the model fills the gaps with plausible-sounding guesses.

**In practice:** Open every task with a one-paragraph brief that names the goal, the files in scope, and what "done" looks like.

---

### 2. Simplicity first — minimum code, no speculative abstractions

The moment you let an AI add "for future flexibility," you've added 200 lines you'll delete next quarter. Optimise for the smallest change that satisfies the current requirement.

**In practice:** Append "no speculative abstractions, no future-proofing" to any request that touches shared utilities or core data structures.

---

### 3. Surgical changes — touch only what you must

AI assistants will improve adjacent code if you let them. Each unsolicited cleanup is a scope expansion and a review risk.

**In practice:** Specify exact files and symbols. Add "do not refactor anything outside the listed scope" to the prompt.

---

### 4. Goal-driven execution — define success criteria upfront, loop until verified

Without a clear definition of done, the model either loops forever or declares victory too early. Neither is acceptable in a CI pipeline.

**In practice:** State the test command and expected outcome at the start of every task. The model should not stop until that command passes.

---

### 5. Use the model only for judgment calls

AI excels at classification, drafting, summarisation, and extraction. It is not the right tool for routing, retries, status-code handling, or any deterministic transform. If code can answer, code answers.

**In practice:** When reviewing an AI-generated PR, flag any logic that a simple `if/switch` could handle and replace it with deterministic code.

---

### 6. Token budgets are not advisory

Per-task budget: ~4,000 tokens. Per-session budget: ~30,000 tokens. By message 40 of a long debug session, the model is re-suggesting fixes you rejected at message 5.

**In practice:** Break long tasks into fresh sessions with a summary handoff. Start a new conversation for each distinct sub-problem rather than piling context onto a single thread.

---

### 7. Surface conflicts, don't average them

Two patterns in the codebase? Pick one. If the model blends them, errors get swallowed twice — once in the code and once in the test that mirrors it.

**In practice:** When the codebase has inconsistencies, tell the model which pattern to follow before asking it to write anything. Never let it decide on its own.

---

### 8. Read before you write

Read exports, callers, and shared utilities before generating new code. An AI assistant will happily add a duplicate function next to an identical one it never read.

**In practice:** Always include a read step in any task that introduces a new helper: "First list all existing functions in `<module>`, then decide whether a new one is needed."

---

### 9. Tests verify intent, not just behavior

A test that cannot fail when business logic changes is wrong. All twelve of an AI's generated tests can pass while the function returns a constant.

**In practice:** Review AI-generated tests for a failing case that exercises the actual business rule. If no such case exists, the test suite is incomplete.

---

### 10. Checkpoint every significant step

An AI can finish steps 5 and 6 on top of a broken state from step 4 with nobody noticing for an hour. State machines accumulate errors silently.

**In practice:** After each meaningful step, run a build or test gate before proceeding. Treat a green checkpoint as a prerequisite, not a nice-to-have.

---

### 11. Match the codebase conventions

Class components? Don't silently fork to hooks. If the existing testing patterns assume `componentDidMount`, a quiet switch to hooks breaks them without surfacing a failure.

**In practice:** Include a conventions summary in your context file. Before generating code, remind the model: "Match the existing pattern — do not introduce a new style."

---

### 12. Fail loud

"Completed successfully" with 14% of records silently skipped is the worst class of bug. Surface uncertainty; don't hide it.

**In practice:** Require the model to flag any record it cannot process rather than skipping it. Treat silent omissions as bugs in code review.

---

## What actually compounds

These disciplines compound over time. A framework does not.

| Compounding practice | What to avoid |
| --- | --- |
| `CLAUDE.md` as institutional memory across sessions | Starting every session from scratch |
| Eval-driven changes | Vibe-driven "it feels right" changes |
| Checkpoints over speed | Racing through multi-step tasks without gates |
| Explicit conflicts over silent blending | Letting the model decide between two patterns |
| Discipline over framework | Swapping tools instead of improving habits |
| One repo, one rules file — no exceptions | Diverging per-team configurations |

## Starter rules file (copy-ready)

Paste this into your `CLAUDE.md` or `AGENTS.md` and customise the brackets.

```text
# AI Coding Rules — <TEAM / PROJECT>

1. State assumptions before every task. No guessing.
2. Minimum code only. No speculative abstractions.
3. Scope: touch only <FILES / DIRS IN SCOPE>. Nothing else.
4. Success criterion: <TEST COMMAND> must pass before stopping.
5. Use the model for judgment calls only. Deterministic logic goes in code.
6. Start a new session after 30,000 tokens or 40 messages.
7. Resolve codebase conflicts before generating code — follow <PATTERN NAME>.
8. Read all callers and exports before introducing any new helper.
9. Every generated test must have at least one case that can fail on a logic change.
10. Run <BUILD / LINT / TEST COMMAND> after each significant step.
11. Follow existing conventions: <NAMING / COMPONENT / TESTING PATTERN>.
12. Flag, don't skip. Any uncertainty or skipped record must be surfaced explicitly.
```

## Related resources

- [Context Engineering](../02-ai-agents/03-context-and-memory/context-engineering.md) — principles for managing what the model sees
- [Codex Agent Prompting Guide](codex-agent-prompting-guide.md) — prompt templates for OpenAI Codex
- [Claude Code Tool Guide](../05-tools/claude-code-tool-guide.md) — setup and workflow for Claude Code CLI
- [Vibe Coding Tech Stack Tutorial](vibe-coding-tech-stack.md) — recommended stack for AI-assisted projects
- [AI Coding Spectrum](../02-ai-agents/01-foundations/ai-coding-spectrum.md) — from autocomplete to autonomous agents
- [Agent Context Window Performance](../02-ai-agents/03-context-and-memory/agent-context-window-performance.md) — why context length affects instruction following

## References

- https://karpathy.ai — Andrej Karpathy, source of the opening quote and original 12-rule framework
