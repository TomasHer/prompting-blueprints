---
title: "The AI Engineering Skills Map — Software Engineering Fundamentals in the Agentic Era"
tags: ["guides", "ai-coding", "skills", "software-engineering", "career"]
last_updated: "2026-08-30"
---

# The AI Engineering Skills Map — Software Engineering Fundamentals in the Agentic Era

> "Even when you use a coding agent to write all your code, understanding software
> fundamentals is important for steering your agent to make the tradeoffs you want
> — or to even know what tradeoffs exist to be made."
> — Andrew Ng, *AI Engineering Skills Map*

## Intent

Digest Andrew Ng's **AI Engineering Skills Map** — specifically the
*software engineering fundamentals* branch — into something you can act on: what
each of the five sub-skills means when an agent writes the code, what you are
still on the hook for, and the precise vocabulary that lets you steer a coding
agent instead of accepting its defaults.

The short version of the argument: agentic coding did **not** retire software
engineering fundamentals. It moved them from *how you type code* to *how you
direct work and judge results*. Fundamentals are now the language of steering.

## Use when

- You are deciding **what to learn next** as a developer whose code is increasingly agent-produced.
- You are a hiring manager or team lead building a **skills rubric** for AI-era engineers.
- Your agents produce code that runs but is wrong in the expensive ways — wrong data model, wrong API shape, wrong caching layer — and you want a checklist of the decisions you should have made yourself.
- You are designing internal training and want a **map**, not a reading list.

---

## The map at a glance

![AI Engineering Skills Map: the AI Engineering root splits into Building and deploying AI applications, Software engineering fundamentals (highlighted), Using coding agents, and Shaping the build; software engineering fundamentals splits further into Building full-stack applications, Managing data, Designing system architectures, Making systems secure and reliable, and Scaling and operating in production](../assets/other/ng-ai-engineering-skills-map-swe-fundamentals.jpeg)

Ng's map names **four top-level skills** of AI engineering. It was built from an
analysis of **over 10,000 job postings**, dozens of structured interviews with AI
experts, hiring managers and recruiters, plus survey data — so it describes the
market's revealed preferences, not just one person's taste.

| Top-level skill | What it covers | Why it survives agentic coding |
| --- | --- | --- |
| **Building and deploying AI applications** | LLM foundations, grounding models with data, building agentic systems, evaluation-driven development, operating in production, ML foundations | The AI-specific craft: the part of the stack agents are least able to specify for you |
| **Software engineering fundamentals** ← *this page* | Full-stack applications, data, architecture, security & reliability, scale & operations | Lets you name the tradeoffs — and therefore steer them |
| **Using coding agents** | Context management, plan-vs-execute tradeoffs, verifiers/evals, specs, multi-agent orchestration, avoiding pitfalls (e.g. an agent wrecking your production database) | The new baseline skill for every developer |
| **Shaping the build** | Product sense, business context, customer goals — deciding *what should be in the spec* | Agents deliver against a spec; someone still has to be right about the spec |

Ng's framing of the last one is the whole strategic point of the map:

> "Given a clear spec, coding agents are rapidly improving at delivering to it,
> thus our work as engineers is shifting toward deciding what should be in the spec."

This page zooms into the second branch. The other branches map cleanly onto
material this repo already covers — see
[How this fits the rest of the repo](#how-this-fits-the-rest-of-the-repo).

---

## Why fundamentals matter *more*, not less

The intuitive read of agentic coding is that fundamentals depreciate: if the
agent writes the JOIN, why learn about indexes? Ng's argument runs the other way,
and it rests on one observation.

**Engineering is a tradeoff activity.** Software requires trading off cost,
scalability, reliability and speed against each other, with security and privacy
adding further complexity. A coding agent will resolve every one of those
tradeoffs — silently, using its priors, on every task you give it. If you cannot
name the tradeoff, you cannot notice that it was made, let alone make it
differently.

So fundamentals buy you three things in the agentic era:

1. **Recognition** — knowing which tradeoffs exist at all in a given task.
2. **Vocabulary** — being able to say "use optimistic concurrency with a version
   column, not a table lock" instead of "make it not break when two people click
   at once." Precise language is the highest-bandwidth channel you have into an agent.
3. **Judgment on review** — the code compiles and the tests pass; whether the
   design is right is still yours to decide.

This is the same claim the repo's
[10X Developer in the Agentic Era](10x-developer-agentic-era.md) guide makes from
the productivity side: when generation gets cheap, value moves to judgment,
verification and taste. Ng's map is the *curriculum* version of that claim.

> **The failure mode to hold in your head:** an agent's output is almost never
> "broken." It's plausible. Plausible-but-wrong architecture is expensive
> precisely because nothing fails loudly on the day you merge it.

---

## The five sub-skills

Each section below has the same shape: **what Ng puts in it**, **what changes
when an agent writes the code**, and **how to steer** — with a copy-ready prompt
fragment you can paste into an agent brief.

### 1. Building full-stack applications

**What it covers.** Ng's point here is a role change first and a syllabus second:

> "Agentic coding enables many developers who previously played more specialized
> roles (like front-end developer or mobile developer) to play a broader,
> full-stack role."

The syllabus is the set of concepts a skilled developer should be able to reason
about across front-end and back-end: **UI components, caching, page rendering,
API choice and design, authentication, state and session management,
asynchronous processing, data persistence, testing, security, and accessibility.**

**What changes.** The barrier to working outside your specialism used to be
*implementation fluency* — you didn't write the mobile client because you didn't
know the framework. Agents dissolve that barrier and leave the other one
standing: knowing what a good answer looks like in a layer you've never shipped
in. Specialists become generalists faster than they become *competent*
generalists, and the gap is filled by fundamentals, not by tutorials.

**How to steer.** Say which rendering strategy, which API style, and where state
lives — before the agent picks for you.

```text
Constraints for this feature:
- Rendering: server-rendered, no client-side data fetching on first paint.
- API: REST with cursor pagination; no GraphQL, no new endpoint per screen.
- State: server-owned; the client holds no derived copies of it.
- Auth: reuse the existing session middleware; do not add a second auth path.
- Accessibility: keyboard-operable and labelled; no div-as-button.
Ask me before deviating from any of these.
```

---

### 2. Managing data

**What it covers.** Ng singles data out for a structural reason: it is the
foundation software gets built on top of, and it is **relatively hard to change**.
The core skill is reasoning about **access patterns** — and using them to decide
what to store, in what shape, and for how long.

**What changes.** Everything else in the stack got cheap to redo. An agent will
rewrite your service layer in an afternoon. It will not migrate three years of
production rows in an afternoon, and it cannot un-collect data you shouldn't have
stored. **Schema and retention decisions are now the least reversible thing you
own** — which makes them the decisions least suitable for delegation.

This is also where agents are most confidently wrong: they will happily
denormalize for a read pattern you never described, add a nullable column instead
of a proper state machine, or store a full event payload "just in case."

**How to steer.** Give the agent the access patterns, not the tables. Then make
retention explicit — it is a privacy decision disguised as a storage decision.

```text
Before writing any migration, list the access patterns you are designing for
(query, expected cardinality, latency target, read/write ratio). Then propose
a schema and justify each index against a named pattern.

Rules:
- No column exists without a query that reads it.
- Every table has an explicit retention rule; say what it is.
- Store no personal data we haven't named a purpose for.
- Show me the plan before you touch a migration file.
```

> **Guardrail worth writing into your rules file:** agents should never run
> destructive migrations or touch production data stores unattended. Ng lists
> "an agent messing up your production database" as a named pitfall of the
> *using coding agents* branch for a reason.

---

### 3. Designing system architectures

**What it covers.** In Ng's words:

> "When you understand the major components of the full stack of software and
> data, you are then better positioned to decide how to put the pieces together."

Architecture is the composition skill — it sits *on top of* the previous two by
construction. Service boundaries, synchronous vs. asynchronous coupling,
failure domains, where the queue goes, what is allowed to call what.

**What changes.** Agents are excellent at local coherence and poor at global
coherence. Each file they write is reasonable; the system they accrete over
twenty tasks often isn't, because no single prompt ever described the whole.
Architecture drift is the characteristic decay mode of agent-heavy codebases:
duplicate helpers, three ways to talk to the same service, a boundary that exists
in your head but nowhere in the repo.

The fix is not to review harder. It is to **write the architecture down where the
agent reads it** — an `AGENTS.md` / `CLAUDE.md` section, an ADR directory, a
module-boundary lint rule — so the constraint is in context on every task rather
than in the memory of whoever reviews the PR.

**How to steer.**

```text
Architecture constraints (do not violate; flag if the task seems to require it):
- <module A> may call <module B>; never the reverse.
- Cross-module communication goes through <the queue / the public interface>,
  never through shared tables.
- New third-party dependencies require my approval first.
- If your change needs a new module or a new boundary, stop and propose it
  as a short ADR instead of implementing it.
```

---

### 4. Making systems secure and reliable

**What it covers.** Ng's top-level framing puts security and privacy on top of
the cost/scalability/reliability/speed tradeoff space as an additional layer of
complexity — they are not a separate phase at the end. Under this sub-skill sits
the usual, still-load-bearing material: input validation and trust boundaries,
authentication and authorization, secret handling, dependency risk, error
budgets, timeouts and retries, graceful degradation.

**What changes.** Two things, in opposite directions.

- **The attack surface grew.** Agentic systems introduce failure modes classic
  software doesn't have: prompt injection through untrusted content, tool
  permissions that are wider than the task, data exfiltration through an
  innocent-looking egress. If your product embeds agents, this sub-skill now
  includes *agent* security, not just application security.
- **The reviewer got faster than the writer.** The same agents also make
  security work cheaper to run continuously — scanners driven by an agent that
  triages findings against your codebase and opens fix PRs, rather than a
  quarterly report nobody reads.

Reliability shifts similarly: agents will write the happy path convincingly and
skip the failure path unless told. Timeouts, idempotency and retry semantics are
the three things most reliably missing from otherwise-good agent output.

**How to steer.**

```text
Reliability requirements for anything that crosses a process boundary:
- Every outbound call has an explicit timeout and a defined behaviour on failure.
- Every write endpoint is idempotent; say how (key, dedupe window).
- Retries are bounded and jittered; no retry on non-idempotent operations.
- Untrusted input (including content fetched at runtime) is never treated as
  instructions. Name the trust boundary in a comment.
Add tests for the failure paths, not only the happy path.
```

Repo material that goes deeper:
[Test a Skill Before Installing It](../10-security/test-a-skill-before-installing.md)
and [AI Safety Classifiers & Jailbreak Severity](../10-security/ai-safety-classifiers-jailbreak-severity.md)
for agent-specific risks, and
[Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md)
for permissions and accountability across many concurrent agents.

---

### 5. Scaling and operating in production

**What it covers.** Everything after merge: deployment, observability, capacity,
cost, and incident response. Knowing how to build observability that tells you
how the system behaves under *real* usage — tracking performance, detecting
drift, and responding quickly when something regresses — rather than under the
load you imagined.

**What changes.** Agentic coding compresses build time far more than it
compresses operate time, so **the share of engineering effort that lives after
the merge goes up**. If it takes an afternoon to build what took a quarter, the
on-call rotation, the dashboards and the cost curve become the dominant cost
centre — and they are exactly the parts an agent cannot own, because they depend
on production reality it can't see.

Two agentic-era additions worth budgeting for:

- **Token and inference cost is now a production cost line.** If the product
  itself calls models, cost per request is an operating metric alongside latency
  — and the levers (model choice, distillation or fine-tuning, simplifying an
  over-elaborate agentic workflow) are engineering decisions.
- **Volume of change went up.** More PRs per week from the same team means
  deployment safety — feature flags, progressive rollout, fast rollback — matters
  more than it did when change rate was human-limited.

**How to steer.**

```text
Before this ships, produce:
- The three metrics that would tell us this feature is broken in production,
  and where they are emitted.
- A structured log line per failure mode, with a correlation id.
- The rollback procedure, in one paragraph, that a stranger could follow.
- Expected cost per 1k requests (including any model calls).
```

Repo material that goes deeper:
[LLM Lifecycle Monitoring](llm-lifecycle-monitoring.md) and
[How to Build AI Agents for Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md).

---

## The one-page self-assessment

Rate yourself 0–3 per row (0 = couldn't specify it, 3 = could review an agent's
choice and argue it). The point is not the score; it is which row is lowest.

| Sub-skill | Can you specify it before the agent starts? | Can you spot it being done wrong in a diff? |
| --- | --- | --- |
| Full-stack applications | Rendering strategy, API style, where state lives, auth path | Accessibility gaps, state duplicated client-side, a second auth path |
| Managing data | Access patterns, schema shape, retention | Speculative columns, missing indexes, data stored without a purpose |
| System architectures | Module boundaries, sync vs. async, failure domains | Boundary violations, duplicate helpers, a new dependency you didn't approve |
| Security & reliability | Trust boundaries, timeouts, idempotency, permissions | Missing failure paths, over-broad tool/DB permissions, untrusted input treated as instruction |
| Scale & operations | Signals to emit, rollback plan, cost per request | Unobservable code paths, no rollback, unbounded fan-out |

**How to read your result.** A low score in the left column means you are
delegating a decision, not a task — the agent is choosing your architecture. A
low score in the right column means you are merging on trust. Both are fixable
by the same thing: learning the fundamental well enough to write it down.

---

## How this fits the rest of the repo

Ng's four branches line up with material already here, which makes the map a
usable index rather than a separate framework:

| Ng's branch | Where this repo goes deeper |
| --- | --- |
| Building and deploying AI applications | [AI Agents Overview](../02-ai-agents/01-foundations/ai-agents-overview.md), [How to Build AI Agents for Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md), [LLM Lifecycle Monitoring](llm-lifecycle-monitoring.md) |
| Software engineering fundamentals | *this page* + [12 Rules for AI Coding Tools](ai-coding-rules-senior-engineers.md) |
| Using coding agents | [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md), [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md), [AI Coding Spectrum](../02-ai-agents/01-foundations/ai-coding-spectrum.md) |
| Shaping the build | [The 10X Developer in the Agentic Era](10x-developer-agentic-era.md), [Requirements Engineering](../08-requirements-engineering/overview.md) |

It also rhymes with Ng's earlier *three loops* letter, already digested in
[Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md#zooming-out-the-loops-around-the-loop-andrew-ng):
speeding up the inner coding loop pushes the bottleneck outward — to the spec,
the product vision, and the fundamentals you need in order to judge what the
inner loop produced. The skills map is the same argument expressed as a
curriculum: **the loop got faster, so the value moved to the parts of the loop
that are still yours.**

---

## Key takeaways

- **Fundamentals became a steering language.** Their value moved from writing
  code to naming tradeoffs — cost, scalability, reliability, speed, security,
  privacy — precisely enough that an agent resolves them your way.
- **The map has four branches:** building and deploying AI applications,
  software engineering fundamentals, using coding agents, and shaping the build.
  Only the third is new; the other three got re-weighted.
- **Specialists are becoming full-stack whether they planned to or not.** Agentic
  coding removed the implementation barrier to working outside your specialism,
  not the judgment barrier.
- **Data is the least reversible layer**, so it is the worst thing to delegate.
  Specify access patterns and retention before any migration is written.
- **Architecture drift is the decay mode of agent-heavy codebases.** Write
  boundaries where the agent reads them, not only where reviewers remember them.
- **Post-merge work grows as build time shrinks.** Observability, rollback and
  cost per request are a larger share of engineering than they were.
- **Someone still has to be right about the spec.** That job — "shaping the
  build" — is the one the map says is growing fastest.

---

## Sourcing note

Ng's skills map is published as a series: a map overview, then one installment
per branch. This page digests the **software engineering fundamentals**
installment (LinkedIn Pulse / X, August 2026) and cross-references the map
overview in *The Batch*.

Quoted passages and the sub-skill lists are Ng's. The "what changes" analysis,
the steering prompts, the self-assessment table and the repo cross-references are
this repo's synthesis, written to be useful next to the source rather than to
restate it — treat them as commentary, not as claims about what Ng wrote.

## Related resources

- [The 10X Developer in the Agentic Era (Skills + Metrics)](10x-developer-agentic-era.md) — the same shift, measured
- [12 Rules for AI Coding Tools — Senior Engineer Edition](ai-coding-rules-senior-engineers.md) — the review discipline that catches plausible-but-wrong output
- [Loop Engineering (and How to Avoid Loopmaxxing)](../02-ai-agents/01-foundations/loop-engineering.md) — Ng's three loops, and verifiable agent loops
- [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) — the Prompter → System Architect maturity scale
- [AI Coding Spectrum](../02-ai-agents/01-foundations/ai-coding-spectrum.md) — vibe → assisted → agentic coding modes
- [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) — permissions and accountability at fleet scale
- [LLM Lifecycle Monitoring Guide](llm-lifecycle-monitoring.md) — observability for AI in production
- [AI People to Follow](../01-about-author/ai-people-to-follow.md) — including Andrew Ng

## References

- [Andrew Ng — AI Engineering Skills Map: Software engineering fundamentals (LinkedIn Pulse)](https://www.linkedin.com/pulse/ai-engineering-skills-map-software-fundamentals-andrew-ng-7lnac) — the article this page digests
- [Andrew Ng on X — software engineering fundamentals installment](https://x.com/AndrewYNg/status/2093388974194872781)
- [DeepLearning.AI — The AI Engineering Skills Map (overview)](https://www.deeplearning.ai/the-batch/the-ai-engineering-skills-map) — the four top-level skills and the methodology (10,000+ job postings, expert interviews, survey data)
- [Andrew Ng on X — the AI Engineering Skills Map announcement](https://x.com/AndrewYNg/status/2088302050706686198)
- [Andrew Ng on X — AI Engineering Skills Map: Building and Deploying AI Applications](https://x.com/AndrewYNg/article/2090840747738374568) — the sibling installment with its six sub-skills
- [DeepLearning.AI — The Batch, Issue 359](https://www.deeplearning.ai/the-batch/issue-359) — Ng's three key loops, digested in [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md)
- [Forbes — Andrew Ng Maps The AI Skills That Decide Which Teams Ship Efficiently](https://www.forbes.com/sites/josipamajic/2026/08/16/andrew-ng-maps-the-ai-skills-that-decide-which-startups-ship/) — independent coverage of the map
