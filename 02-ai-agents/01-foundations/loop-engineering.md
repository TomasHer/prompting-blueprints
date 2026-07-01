---
title: "Loop Engineering (and How to Avoid Loopmaxxing)"
tags: ["agents", "loop-engineering", "harness-engineering"]
last_updated: "2026-06-14"
---

# Loop Engineering (and How to Avoid Loopmaxxing)

## Intent
Explain **loop engineering** — the practice of designing the autonomous control loops that drive coding agents, rather than hand-writing prompts for them — and give you the guardrails that keep a loop from degenerating into **"loopmaxxing,"** the anti-pattern that burns through API budgets and fills your repo with code nobody understands. Use this as a primer for teams moving past one-shot prompting into background, self-running agents in 2026.

> **One-line summary:** Loop engineering is *writing the loop that prompts the agent* instead of prompting the agent yourself. The whole skill is in the exit conditions — a loop without deterministic checks doesn't iterate toward a goal, it drifts toward your invoice.

## Why a loop, not a prompt

The biggest names in coding agents have publicly declared prompting itself a dead end. As OpenClaw creator **Peter Steinberger** put it: *"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."* **Boris Cherny**, the Anthropic engineering lead behind Claude Code, said the same thing from the inside: *"I don't prompt Claude anymore. I have loops that are running. They're the ones prompting Claude and figuring out what to do. My job is to write loops."*

The highest-leverage AI engineering skill is no longer crafting one perfect prompt — it's engineering loops with LLMs at their heart. This is the same lineage covered in [From Prompt to Context to Harness Engineering](prompt-context-harness-engineering.md): loop engineering is the *execution-layer* discipline of building the harness's control loop, where prompt and context engineering operate as components inside each iteration.

## What loop engineering is

Loop engineering shifts a model from a static call-and-response tool into an **active participant in an event loop**. Instead of feeding an agent step-by-step instructions, you give the system a *verifiable goal*. The loop then runs an agent that:

1. **Observes** the current state,
2. **Chooses** an action,
3. **Executes** it,
4. **Checks** the result against the goal, and
5. **Decides** whether to continue, retry, or stop.

The decision in step 5 is the crux. A loop that can't objectively tell whether it has succeeded has no reason to ever stop.

### The primitives of an AI loop

There are competing definitions of what an AI loop needs. A practical set, adapted (and simplified) from Google engineer **Addy Osmani**:

| Primitive | What it does |
| :--- | :--- |
| **Automations** | The trigger that starts the loop — a scheduled cron job, a CI failure webhook, a `/goal` command. |
| **Worktrees** | Isolated branch environments so parallel sub-agents don't overwrite each other's code. |
| **Skills & external tools** | Markdown files of persistent project guidelines plus integrations (e.g. [MCP](../04-protocols/mcp-guide.md) servers) that reach Jira, GitHub, or internal databases. |
| **Sub-agents** | Specialized models that divide labor — one drafts the code, a *separate* evaluator grades it against a strict rubric. |
| **Memory** | External tracking (a Linear board, a progress file) because LLMs eventually clear their context windows. |

A minimal version: a loop reads yesterday's CI failures, assigns an agent to draft a fix, runs the tests, and — only if they pass — opens a pull request.

![Anatomy of a well-formed AI loop: an initiator triggers a cycle through state and context, an AI agent, execution, and an evaluator, with a retry loop back to state and clean exits to success (opens a PR) or human handoff (stuck or over budget)](../../assets/other/loop-engineering-anatomy.jpeg)

Done well, the pattern delivers. An early public example was **Andrej Karpathy's autoresearch** project — a lightweight Python loop that ran machine-learning experiments overnight, unattended, and produced real results.

## The trap: loopmaxxing is the new tokenmaxxing

AI loops come with a sharp failure mode. Just as **"tokenmaxxing"** brute-forces quality by throwing massive inference budgets or thousands of samples at a problem, **"loopmaxxing"** replaces software architecture with open-ended `while(true)` iteration. The hidden assumption is that *an agent will eventually figure it out if it runs long enough.*

It won't — not without a way to verify success (a passing test suite, a clean compile, a specific zero-exit status). Two things go wrong:

- **Agent drift.** Hand the loop a fuzzy goal — *"refactor this feature to be better,"* *"optimize the layout"* — and the agent drifts forever, optimizing for hallucinated metrics it invented.
- **The flawed evaluator.** An agent grading its own sub-agents' output spins into endless retries, reinforcing its own mistakes instead of catching them. (This is the same *unreliable self-evaluation* failure that motivates harness verification loops.)

The combination has no exit. The loop churns through retries, failed tool calls, and context reconstruction, **burning millions of tokens** — you end up billing for the memory and context a human engineer simply retains.

![The loopmaxxing trap: a fuzzy goal feeds an agent that drifts in an endless cycle with a flawed evaluator, producing a cost explosion and no exit](../../assets/other/loopmaxxing-trap.jpeg)

There's a slower-burning cost too: **comprehension debt.** As an autonomous loop ships code in the background, the gap widens between the repo's actual state and the engineer's understanding of it. When something breaks in production, debugging the loop's output is an observability nightmare — thousands of lines of unfamiliar logic, with no mental model of *why* the agent chose that path after dozens of iterations.

## The pragmatic path: control loops, not open-ended cycles

The most effective loop engineers don't write open-ended agentic cycles. They build **strict control loops**: the developer writes the *desired state* and the *observation mechanism*, while **deterministic code handles execution and API calls**. The LLM step is reserved only for the dynamic decisions ordinary code can't make. Wrapping the repetitive or risky parts of a workflow in memory and hard-coded checks limits the blast radius of a hallucinating model.

Building all those checks up front is tiresome, especially early in a project. So the path that works:

1. **Start with a minimal loop and human verification.** Run it several times by hand. You'll quickly learn what works, what to improve with [prompt](../../03-prompts-and-patterns/prompt-pattern-catalogue.md) and [context engineering](../03-context-and-memory/context-engineering.md), and what needs deterministic guardrails baked into the loop.
2. **Automate gradually, once the workflow is proven.** As you identify the steps the agent gets right *consistently*, replace those LLM prompts with standard code.
3. **Separate the doer from the checker.** Keep distinct agents for performing the task and validating it. An agent looping over its own flawed logic reinforces mistakes rather than fixing them.
4. **Instrument for control.** Production loops need trace-logging of agent reasoning, progress detection that terminates a stuck run, and strict iteration caps. Decide *explicitly* when control hands over to a human.

> **Rule of thumb:** allow a maximum of **two or three retries**, then fail gracefully and hand the error back to a human developer.

## Control-loop checklist

Before you let a loop run unattended, confirm every box:

- [ ] **Verifiable exit condition** — success is a passing test, a clean compile, or a specific exit code, *not* the agent's own opinion.
- [ ] **Hard iteration cap** — a maximum retry count (2–3) with graceful failure and human handoff.
- [ ] **Separate evaluator** — a different agent (or deterministic check) grades the output; the doer never grades itself.
- [ ] **Deterministic skeleton** — code owns execution, scheduling, and API calls; the LLM only makes the decisions code can't.
- [ ] **Trace logging** — agent reasoning and actions are recorded for post-hoc debugging.
- [ ] **Progress detection** — the loop can tell when it's stuck and stops itself.
- [ ] **Budget ceiling** — a token/cost cap that triggers human handoff before the bill explodes.
- [ ] **Isolation** — worktrees or sandboxes so parallel agents can't clobber each other or the main branch.

## Zooming out: the loops around the loop (Andrew Ng)

Everything above treats *one* loop — the agentic coding loop — as the object of engineering. In [*The Batch*, Issue 359](https://www.deeplearning.ai/the-batch/issue-359), **Andrew Ng** zooms out: a good 0-to-1 product is built by **three loops running at increasing timescales**, and the coding loop is only the fastest of them. He starts from the same closed-loop primitive the rest of this page is built on:

> "Given a product specification and optionally a set of evals (that is, a dataset against which to measure performance), we can have an AI agent write code, test its work, and keep iterating until the code is bug-free and meets its specification." — Andrew Ng, *The Batch* #359

The three loops aren't concentric — they're **chained through shared artifacts**. Each loop pivots on the output of the slower one outside it: external feedback shapes the *developer vision*, the vision drives the *product spec/evals*, and the spec drives the *coding agent*. Because each loop runs far faster than the one outside it, the coding agent cycles many times inside a single developer review, which cycles many times inside a single round of external feedback.

![Andrew Ng's 3 key product development loops: the Agentic Coding Loop (coding agent ⇄ product spec/evals, ~minutes) chains into the Developer Feedback Loop (product spec/evals ⇄ developer vision, ~hours), which chains into the External Feedback Loop (developer vision ⇄ external feedback, ~days)](../../assets/other/ng-three-product-development-loops.jpeg)

| Loop | Timescale | Pivots on | What it decides |
| :--- | :--- | :--- | :--- |
| **Agentic coding loop** (the "engineering loop") | ~minutes | coding agent ⇄ product spec/evals | Does the code build, pass tests, and meet the spec? |
| **Developer-feedback loop** | ~hours | product spec/evals ⇄ developer vision | Is this the *right* product? Steer the agent; update or clarify the spec. |
| **External feedback loop** | ~days | developer vision ⇄ external feedback | Does the market actually want this? Evolve the vision. |

In Ng's words:

> "The engineering loop executes quickly. Every few minutes, the coding agent might build and test a new version of the software."

> "The developer-feedback loop operates over time intervals between tens of minutes and hours — that's how frequently a developer might review a product and give feedback."

> "This includes a wide range of tactics like asking a few friends for feedback, launching to alpha testers, or putting the code into production with A/B testing. These tactics are usually slow, rarely taking less than hours and sometimes taking days or even weeks."

**The bottleneck moves outward.** Last year, developers acted as the QA function for their agents — manually finding bugs and asking the agent to fix them. Now that agents test their own code (the verifiable exit condition this page argues for), that burden shrinks and frees the developer for higher-level product decisions: which features to offer, where the UI needs work, how the spec should change once they've *seen* an implementation. So when the inner loop speeds up, the bottleneck doesn't disappear — it moves to the slower, human-facing loops. Ng's conclusion:

> "With coding agents speeding up software development, more engineers are starting to play a partial product management role. For many engineers who are growing into this role, the hardest part is shaping the product vision and striking a balance between building (bridging the gap between vision and spec) and getting user feedback to evolve the vision."

**Why the human loops can't be automated away.** Evals still matter here — "if you find that the system repeatedly runs into certain problems, building a set of evals for the agent becomes useful" — but the developer-feedback and external loops stay human-in-the-loop for a structural reason. Ng argues that humans hold a **context advantage** over the AI about users and the environment the product runs in:

> "Many people describe this human contribution as 'taste,' but I prefer to think of it as humans having a context advantage, since that gives us a clearer path to helping AI systems get better ... So long as the human knows something the AI does not, human-in-the-loop is needed to inject that knowledge into the system."

This reframes the [loopmaxxing](#the-trap-loopmaxxing-is-the-new-tokenmaxxing) warning too: an agent drifting on a fuzzy goal is a symptom of a missing *outer* loop — no developer vision or external feedback is closing the loop on *whether the work is worth doing at all*. The verifiable exit condition answers "is the code correct?"; the outer loops answer "is it the right code?" A loop engineer who optimizes only the inner loop is optimizing the part that was already fastest.

## Key takeaways

- **Loop engineering is the new top skill:** you design the loop that prompts the agent, not the prompt itself. It's the execution-layer craft of [harness engineering](prompt-context-harness-engineering.md).
- **There is more than one loop.** Andrew Ng chains the fast agentic coding loop (~minutes) into a developer-feedback loop (~hours) and an external feedback loop (~days), linked through shared artifacts (spec/evals, developer vision). Speeding up the inner loop pushes the bottleneck outward to product vision — so engineers increasingly own a partial product-management role, and stay in the loop because they hold a *context advantage* the AI doesn't.
- **The exit condition is the whole game.** A fuzzy goal with no verifiable check produces infinite drift; a verifiable goal with hard caps produces reliable work.
- **Loopmaxxing is tokenmaxxing's successor** — brute-force iteration that burns budget and accrues comprehension debt instead of solving the architecture.
- **Build control loops, not open-ended cycles:** deterministic code on the outside, LLM decisions on the inside, a separate evaluator, and a human handoff after a few retries.
- **Cognitive surrender is the real risk.** Agents run loudly and fail quietly. A system designed so you never have to think about your codebase again is a recipe for disaster — no amount of compute saves a poor architecture.

## The next layer up: fleet governance

Loop engineering makes a *single* autonomous loop reliable and persistent. The moment you run *many* loops concurrently across a team, a new problem appears that no per-loop guardrail solves: making the whole population accountable — identity, registry, permissions, audit, and a kill switch. That layer goes by **agent fleet governance** (Cobus Greyling frames it as **fleet engineering**, extending the prompt → context → harness → loop → fleet stack). See [Agent Fleet Governance (Fleet Engineering)](agent-fleet-governance.md).

## References
- Peter Steinberger (OpenClaw creator) — public post: *"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."*
- Boris Cherny (Anthropic, Claude Code lead) — *"I don't prompt Claude anymore… My job is to write loops."*
- Addy Osmani (Google) — primitives of an AI loop (automations, worktrees, skills/tools, sub-agents, memory).
- Andrej Karpathy — `autoresearch`, an overnight ML-experiment loop in Python.
- Andrew Ng — [*The Batch*, Issue 359](https://www.deeplearning.ai/the-batch/issue-359): the three nested loops (engineering / developer-feedback / external feedback) at different timescales, and the shift of engineers into a partial product-management role.
- Related in this repo: [From Prompt to Context to Harness Engineering](prompt-context-harness-engineering.md) · [Context Engineering](../03-context-and-memory/context-engineering.md) · [Prompt Pattern Catalogue](../../03-prompts-and-patterns/prompt-pattern-catalogue.md) · [MCP Guide](../04-protocols/mcp-guide.md)
