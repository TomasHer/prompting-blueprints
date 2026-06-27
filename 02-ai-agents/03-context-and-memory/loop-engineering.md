---
title: "Loop Engineering"
tags: ["agents", "loop-engineering", "context-engineering"]
last_updated: "2026-06-27"
---

# Loop Engineering

Loop engineering is the discipline of designing the autonomous control loops that drive coding agents — instead of hand-writing a prompt for each task, you build a system that *prompts the agent for you*, runs it on a cadence, verifies the result, and decides whether to continue, escalate, or stop.

This tutorial is based on [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering). For the deeper treatment of the failure modes ("loopmaxxing") and the wider prompt → context → harness → loop → fleet stack, see [Loop Engineering (and How to Avoid Loopmaxxing)](../01-foundations/loop-engineering.md).

## Anatomy of a Loop

A well-formed loop is a repeatable cycle, not an open-ended `while(true)`. Each stage hands off to the next, and the loop only exits through a verifiable gate:

1.  **Schedule / Automation:** A trigger starts the cycle — a cron schedule, a CI webhook, a `/goal` command.
2.  **Triage Skill:** A skill decides *what* the loop should work on this run.
3.  **Read + Write STATE / Memory:** The loop loads durable state, then records progress back to it.
4.  **Isolated Worktree:** Work happens on an isolated branch so parallel runs can't clobber each other.
5.  **Implementer Sub-agent:** A "maker" agent drafts the change.
6.  **Verifier Sub-agent:** A *separate* "checker" agent runs tests and gates against the goal.
7.  **MCP / Git / Tickets:** The loop reaches into real tools to act on the result.
8.  **Human Gate:** A decision point — safe/allowlisted actions proceed; risky or ambiguous ones stop.
9.  **Commit / PR / Action — or escalation:** Safe work is committed or a PR is opened; risky work is handed back to a human *with context*.

The verifier and the human gate are what make the loop terminate. A loop that can't objectively tell whether it succeeded has no reason to ever stop.

## Why a Loop, Not a Prompt

The leaders building coding agents have declared one-shot prompting a dead end:

> "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."
> — **Peter Steinberger**

> "I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."
> — **Boris Cherny**, Head of Claude Code at Anthropic

The highest-leverage skill shifts from crafting one perfect prompt to engineering the loop that wraps the agent. Prompt engineering and [context engineering](./context-engineering.md) don't disappear — they become *components inside each iteration* of the loop.

## The Building Blocks

Loop engineering composes a small set of primitives — five building blocks plus memory:

| Block | What it provides |
| :--- | :--- |
| **Automations / Scheduling** | Discovery and triage on a cadence. |
| **Worktrees** | Safe parallel execution, isolated per run. |
| **Skills** | Persistent project knowledge the agent reloads each time. |
| **Plugins & Connectors** | Reach into real tools (Jira, GitHub, databases) via MCP. |
| **Sub-agents** | A maker/checker split — the doer never grades itself. |
| **+ Memory / State** | A durable spine that outlives any single conversation window. |

Memory is what separates a loop from a one-shot call: because an agent's context window eventually clears, progress must live *outside* it — a board, a state file, a ticket — so the next iteration knows where the last one left off. This is the same just-outside-the-window principle covered in [Context Engineering](./context-engineering.md).

## Production Patterns

The repository catalogues seven loops that teams run in production, each with its own cadence and readiness level:

1.  **Daily Triage** — surface and sort what needs attention.
2.  **PR Babysitter** — shepherd pull requests through review and CI.
3.  **CI Sweeper** — pick up and fix failing builds.
4.  **Dependency Sweeper** — keep dependencies current and safe.
5.  **Changelog Drafter** — draft release notes from merged work.
6.  **Post-Merge Cleanup** — tidy branches and artifacts after merge.
7.  **Issue Triage** — label, route, and prioritize incoming issues.

The recommended progression is to start report-only, advance to assisted fixes, then graduate to unattended operation — automating each step only once the agent gets it right *consistently*.

## Key Takeaways

*   **You design the loop, not the prompt.** Loop engineering is the execution-layer craft that wraps prompt and context engineering inside a repeatable cycle.
*   **Anatomy first:** schedule → triage → state → worktree → implementer → verifier → tools → human gate → action.
*   **The exit condition is the whole game.** A verifiable check (passing tests, clean compile) plus a human gate is what stops a loop from drifting forever.
*   **Memory lives outside the window.** Durable state is the spine that lets successive iterations build on each other.

## Reference

*   Source repository: [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) — building blocks, anatomy of a loop, and production patterns.
*   Related in this repo: [Context Engineering](./context-engineering.md) · [Loop Engineering (and How to Avoid Loopmaxxing)](../01-foundations/loop-engineering.md)
