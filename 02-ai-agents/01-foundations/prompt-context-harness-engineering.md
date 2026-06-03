---
title: "From Prompt to Context to Harness Engineering"
tags: ["agents", "harness-engineering", "context-engineering"]
last_updated: "2026-06-03"
---

# From Prompt to Context to Harness Engineering

## Intent
Explain how AI engineering has moved through three overlapping generations — **prompt engineering**, **context engineering**, and **harness engineering** — and give you a practical mental model for which layer a problem actually lives in. Use this as a teaching primer or onboarding deck for teams shipping agents in 2026.

> **One-line summary:** Prompt engineering is *how you talk to the model*, context engineering is *what the model sees*, and harness engineering is *the execution environment the model operates within*. Each generation subsumes the previous one rather than replacing it.

## Why a third generation appeared

Prompt engineering got teams off the ground. Context engineering made agents smarter. Neither, on its own, made agents *reliable* enough to trust on long, autonomous tasks — and that gap is what harness engineering addresses.

The shift is driven by a concrete change in what models are asked to do. A single clever prompt and good retrieval are enough for a one-shot answer. They are not enough when a model has to make hundreds of sequential decisions, call real tools, edit real files, and run for hours. At that scale, two failure modes show up that no prompt can fully fix:

- **Context anxiety.** When Cognition rebuilt Devin on Claude Sonnet 4.5, they observed the model behaving as if it were "anxious" about its context window: it took shortcuts and left work unfinished when it *believed* it was near the end of the window — even with plenty of room left — and it consistently (and confidently) *underestimated* how many tokens it had remaining ([Inkeep](https://inkeep.com/blog/context-anxiety)).
- **Unreliable self-evaluation.** Agents are poor judges of their own work. Left to grade themselves, they tend to declare a task complete without objective proof. Reliability requires validation that comes from *outside* the model — a passing test suite, a linter, a type check — not the model's own say-so.

These aren't prompt bugs or context bugs. They're properties of letting a stateless next-token predictor run a long, stateful process unsupervised. Fixing them means engineering the *environment* around the model — which is exactly what a harness is.

## The three generations at a glance

| | Generation 1 — **Prompt Engineering** | Generation 2 — **Context Engineering** | Generation 3 — **Harness Engineering** |
| :--- | :--- | :--- | :--- |
| **Focus** | Expression: the single instruction | Information: what fills the context window | Execution: the environment the agent runs in |
| **Unit of work** | One message / one turn | One session | The whole agent lifecycle, across sessions |
| **Era** | ~2022–2024 | ~2025 | 2026+ |
| **Core moves** | Phrasing, role-play, few-shot examples | RAG, memory, schemas, just-in-time retrieval | Tool orchestration, state persistence, verification loops, constraints |
| **Analogy** | Writing the perfect email to delegate a task | Attaching the right files and schematics to that email | Architecting the office, the SOPs, and the QA checkpoints around the work |
| **Failure mode it fixes** | "I didn't understand the question" | "I had the wrong information at the wrong time" | "I had everything I needed and still went off the rails" |

Each row is additive. A good harness still depends on good context, which still depends on good prompts. The generations *nest* — harness engineering is the outermost layer, with context and prompt engineering operating inside it.

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

Anthropic's own framing makes the lineage concrete: the **Claude Agent SDK is described as a general-purpose agent harness** that uses techniques like context compaction to let an agent make progress on tasks spanning many context windows, while handling tool dispatch, session management, and progress tracking ([search overview](https://parallel.ai/articles/what-is-an-agent-harness)). Claude Code itself is a harness wrapped around a model.

**Analogy:** Architecting the entire office building — standard operating procedures, specialized departments, and quality-assurance checkpoints.

## Core subsystems of an AI harness

A robust harness bridges the gap between a "smart model" and *reproducible* output. Four subsystems do most of the work:

1. **State management.** Raw models are stateless. The harness persists progress to the filesystem (or a store) so an agent can pause, save intermediate results, and resume exactly where it left off — without cramming the entire history back into the context window. This is the structural answer to context anxiety: the window stops being the agent's only memory.

2. **Verification loops.** The harness enforces *objective* validation. An agent can't simply declare success; the harness demands runnable proof — a passing test suite, a green linter, a successful type check, a build — before a change is allowed through. This is the structural answer to unreliable self-evaluation: truth comes from the environment, not the model.

3. **Workflow orchestration.** Instead of one generalist agent doing everything in one window, the harness routes work through a graph of specialized steps and sub-agents — one maps repository impact, a human-in-the-loop checkpoint reviews the plan, another writes the code. (See [How to Build AI Agents for Production](../05-production/how-to-build-ai-agents-production.md).)

4. **Scope and constraints.** The more you constrain the solution space, the more predictable the output. The harness locks the agent into specific file paths, a defined task, or an allow-list of tools — preventing it from inventing new requirements or wandering into an unrelated refactor.

## How the layers nest

```text
┌─────────────────────────────────────────────────────────────┐
│ HARNESS ENGINEERING  (execution environment)                 │
│  state · verification · orchestration · scope & constraints  │
│                                                              │
│   ┌───────────────────────────────────────────────────┐     │
│   │ CONTEXT ENGINEERING  (what the model sees)         │     │
│   │  retrieval · memory · schemas · just-in-time data  │     │
│   │                                                    │     │
│   │   ┌─────────────────────────────────────────┐      │     │
│   │   │ PROMPT ENGINEERING  (the instruction)    │      │     │
│   │   │  role · constraints · format · examples  │      │     │
│   │   └─────────────────────────────────────────┘      │     │
│   └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

Reading it inside-out: a prompt is one instruction; context is the information environment that instruction runs in; the harness is the operating environment that the whole session runs in, across many instructions and many sessions.

## A worked example: "fix this failing bug"

The same task lands very differently depending on which generation you stop at.

- **Prompt only:** You paste the stack trace and ask for a fix. You get a plausible patch you have to verify and apply by hand. Works for a one-liner; fragile for anything real.
- **+ Context:** The agent can retrieve the failing file, related modules, and the test that's red. The patch is now grounded in the actual codebase instead of a guess.
- **+ Harness:** The agent edits the file *and* runs the test suite, sees it's still red, iterates, re-runs, confirms green, runs the linter, and only then opens a pull request — with its scope locked to the relevant paths so it can't "helpfully" rewrite half the repo. State is persisted, so if it runs out of window mid-fix, it resumes instead of restarting.

The model is identical in all three. The reliability difference is entirely the harness.

## Implementations you can look at

- **Claude Code / Claude Agent SDK** — Anthropic's general-purpose harness: compaction, tool dispatch, sub-agents, session and permission management. See [Claude Managed Agents](../04-protocols/claude-managed-agents-tutorial.md).
- **Hermes Agent (Nous Research)** — a CLI-first harness built around a persistent learning loop: it persists memory and skills across sessions, isolates sub-agents in subprocesses, supports MCP, and runs on real backends rather than an abstract chat box. It's a clean illustration of state management + orchestration + a closed learning loop. Walkthrough: [Hermes Agent Tutorial](../../05-tools/hermes-agent-tutorial.md).

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

## References
- Inkeep — [Context Anxiety: How AI Agents Panic About Their Perceived Context Windows](https://inkeep.com/blog/context-anxiety)
- Parallel — [What is an agent harness?](https://parallel.ai/articles/what-is-an-agent-harness)
- Firecrawl — [What Is an Agent Harness?](https://www.firecrawl.dev/blog/what-is-an-agent-harness)
- Daily Dose of DS — [The Anatomy of an Agent Harness](https://blog.dailydoseofds.com/p/the-anatomy-of-an-agent-harness)
- Related in this repo: [Context Engineering](../03-context-and-memory/context-engineering.md) · [Prompt Pattern Catalogue](../../03-prompts-and-patterns/prompt-pattern-catalogue.md) · [MCP Guide](../04-protocols/mcp-guide.md) · [Hermes Agent Tutorial](../../05-tools/hermes-agent-tutorial.md)
