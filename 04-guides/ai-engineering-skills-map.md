---
title: "The AI Engineering Skills Map — Software Engineering Fundamentals in the Agentic Era"
tags: ["guides", "ai-coding", "skills", "software-engineering", "career"]
last_updated: "2026-08-30"
---

# The AI Engineering Skills Map — Software Engineering Fundamentals in the Agentic Era

![AI Engineering Skills Map: the AI Engineering root splits into Building and deploying AI applications, Software engineering fundamentals (highlighted), Using coding agents, and Shaping the build; software engineering fundamentals splits further into Building full-stack applications, Managing data, Designing system architectures, Making systems secure and reliable, and Scaling and operating in production](../assets/other/ng-ai-engineering-skills-map-swe-fundamentals.jpeg)

*Andrew Ng's AI Engineering Skills Map, with the software engineering fundamentals branch expanded.*

> "Even when you use a coding agent to write all your code, understanding software
> fundamentals is important for steering your agent to make the tradeoffs you want
> — or to even know what tradeoffs exist to be made."
> — Andrew Ng, *AI Engineering Skills Map: Software engineering fundamentals*

## Intent

Digest Andrew Ng's **AI Engineering Skills Map** — specifically the
*software engineering fundamentals* branch — into something you can act on: what
each of the five sub-skills contains, what changes when an agent writes the code,
and the precise vocabulary that lets you steer a coding agent instead of
accepting its defaults.

The short version of the argument: agentic coding did **not** retire software
engineering fundamentals. It retired *memorizing syntax*. Fundamentals moved from
*how you type code* to *how you direct work and judge results* — they are now the
language of steering.

## Use when

- You are deciding **what to learn next** as a developer whose code is increasingly agent-produced.
- You are a hiring manager or team lead building a **skills rubric** for AI-era engineers.
- Your agents produce code that runs but is wrong in the expensive ways — wrong data model, wrong API shape, wrong consistency guarantee — and you want a checklist of the decisions you should have made yourself.
- You are designing internal training and want a **map**, not a reading list.

---

## The map at a glance

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

Ng's framing of the last one is the strategic point of the whole map:

> "Given a clear spec, coding agents are rapidly improving at delivering to it,
> thus our work as engineers is shifting toward deciding what should be in the spec."

This page zooms into the second branch. The other branches map onto material this
repo already covers — see [How this fits the rest of the repo](#how-this-fits-the-rest-of-the-repo).

---

## Why fundamentals matter *more*, not less

Ng gives two reasons to keep the fundamentals even when you write none of the code.

**1. You cannot steer a tradeoff you cannot name.** This is the argument the
article leads with, and it is stated as a concrete failure mode rather than a
principle:

> "A novice who vibe codes without understanding software fundamentals can create
> simple applications, but this often leads to the coding agent making bad
> tradeoffs in latency, availability, consistency, reliability, maintainability,
> simplicity, and/or cost. In such cases, the developer didn't know such tradeoffs
> even existed and therefore did not steer the agent to make the right decisions
> for their application context."

Note the shape of that list — **latency, availability, consistency, reliability,
maintainability, simplicity, cost**. Every one of them is a dimension an agent
resolves silently, on every task, using its priors. It will pick a consistency
model. It will pick a cache. It will pick how much abstraction to add. The
question is never whether the tradeoff gets made; it is whether *you* made it.

**2. The AI core ships inside an ordinary application.** Even on an AI product,
"the AI core is often expressed through a broader software application, which you
will want to help build or shape." The model is a component. The thing users
touch is software.

So fundamentals buy you three practical things:

1. **Recognition** — knowing which tradeoffs exist at all in a given task.
2. **Vocabulary** — being able to say "use optimistic concurrency with a version
   column, not a table lock" instead of "make it not break when two people click
   at once." Precise language is the highest-bandwidth channel you have into an agent.
3. **Judgment on review** — the code compiles and the tests pass; whether the
   design is right is still yours to decide.

**This branch is not only for AI products.** Worth stating plainly, because the
map's title invites the opposite reading: "coding agents have changed how we
build software, including software that does not contain any AI components." The
five sub-skills below are what it takes to build *software* well when an agent
writes it — whether or not a model appears anywhere in the finished product.

Ng's conclusion is blunt, and worth quoting because it cuts against the "learning
to code is obsolete" reading of agentic development:

> "Some parts of coding knowledge — like memorizing coding syntax — are becoming
> obsolete. But developers who deeply understand how software works vastly
> outperform those who vibe code without understanding."

This is the same claim the repo's
[10X Developer in the Agentic Era](10x-developer-agentic-era.md) guide makes from
the productivity side: when generation gets cheap, value moves to judgment,
verification and taste. Ng's map is the *curriculum* version of that claim.

> **The failure mode to hold in your head:** an agent's output is almost never
> "broken." It's plausible. Plausible-but-wrong architecture is expensive
> precisely because nothing fails loudly on the day you merge it.

---

## The five sub-skills

Each section has the same shape: **what Ng puts in it**, **what changes** when an
agent writes the code, and **how to steer** — with a copy-ready prompt fragment
for an agent brief. The first part is Ng's; the second and third are this repo's
commentary (see the [sourcing note](#sourcing-note)).

### 1. Building full-stack applications

**What Ng puts in it.** A role change first, a syllabus second:

> "Agentic coding enables many developers who previously played more specialized
> roles (like front-end developer or mobile developer) to play a broader,
> full-stack role. A coding agent can help with parts of the development process
> that you might be less familiar with. However, understanding how the full stack
> actually works is important."

The syllabus is what a skilled developer should be able to reason about across
front-end and back-end: **UI components, caching, page rendering, API choice and
design, authentication, state and session management, asynchronous processing,
data persistence, testing, security, and accessibility.**

**What changes.** The barrier to working outside your specialism used to be
*implementation fluency* — you didn't write the mobile client because you didn't
know the framework. Agents dissolve that barrier and leave the other one
standing: knowing what a good answer looks like in a layer you've never shipped
in. Specialists become generalists faster than they become *competent*
generalists, and the gap is closed by fundamentals, not by tutorials.

**How to steer.** Name the rendering strategy, the API style, and where state
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

**What Ng puts in it.** Data gets a section of its own for a structural reason:
it "is a foundation that software is built on top of, that is relatively hard to
change (even if agents help with migrations)." The skill decomposes into:

- **Access patterns first** — think them through, then use them "to decide what to store and for how long."
- **Data models and storage types** — relational tables, documents, key-value, or graphs — plus the infrastructure choice, "which in turn affects speed, scalability, availability, reliability, and cost."
- **Transactions and concurrency**, and keeping data "clean, consistent, and fresh."
- **Privacy, governance, and compliance** where they apply.
- **The data lifecycle**, and evolving the data architecture as the application evolves.

Then the part that makes this branch specifically an *AI engineering* skill:

> "Deciding how to manage data requires significant human-provided context. Your
> AI systems will get their own input context from your data source, so if data
> architecture is chosen poorly, the AI doesn't know what it doesn't know."

That is the sharpest sentence in the article. A badly chosen data architecture
does not produce a visible error — it produces an agent that is confidently
working from a partial view, with no signal that anything is missing. Ng adds
that building data infrastructure *for agents* (rather than for traditional
software or for humans) is "a rapidly evolving area," so treat your current best
practices here as provisional.

**What changes.** Everything else in the stack got cheap to redo — an agent will
rewrite your service layer in an afternoon. Migrations get easier too, but the
*decisions* don't: you still cannot un-collect data you shouldn't have stored,
and you still cannot retrofit a consistency guarantee onto three years of rows
without a project. Schema, storage type and retention remain the least reversible
things you own, which makes them the decisions least suitable for delegation.

This is also where agents are most confidently wrong: they will denormalize for a
read pattern you never described, add a nullable column instead of a proper state
machine, or store a full event payload "just in case."

**How to steer.** Give the agent the access patterns, not the tables. Then make
retention explicit — it is a privacy decision disguised as a storage decision.

```text
Before writing any migration, list the access patterns you are designing for
(query, expected cardinality, latency target, read/write ratio). Then propose
a data model and justify the storage type (relational / document / key-value /
graph) and each index against a named pattern.

Rules:
- No column exists without a query that reads it.
- State the transaction and concurrency model for any multi-row write.
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

**What Ng puts in it.** Architecture is the composition skill and sits on top of
the previous two by construction:

> "When you understand the major components of the full stack of software and
> data, you are then better positioned to decide how to put the pieces together."

Good system design starts from what the software is *intended to do* — how many
users, how much latency matters, how much cost matters — and from there you
choose: the application platform, the frontend/backend boundary, system
decomposition, where application state lives, and architectural granularity
(**monolith vs. microservices**). You also choose the stack — languages,
runtimes, component/frontend/backend frameworks, data technologies — "sometimes
by running experiments to evaluate options before settling on one."

And the point most architecture advice omits:

> "The right architecture is a moving target, depending on the phase of the
> project. The simple architecture you choose to build a quick prototype may not
> be the right architecture to build the first production system, and that too
> may change as the application scales."

**What changes.** Two things worth naming.

- **Prototype-to-production got faster than the architecture behind it.** When a
  prototype took six weeks, the rewrite before production was an obvious,
  budgeted event. When it takes an afternoon, the prototype's architecture tends
  to *become* the production architecture by default — nobody decided to keep it;
  it just never got revisited. Ng's "moving target" framing is the antidote:
  make the phase transition an explicit decision point.
- **Agents are excellent at local coherence and poor at global coherence.** Each
  file they write is reasonable; the system they accrete over twenty tasks often
  isn't, because no single prompt described the whole. Architecture drift —
  duplicate helpers, three ways to talk to the same service, a boundary that
  exists in your head but nowhere in the repo — is the characteristic decay mode
  of agent-heavy codebases.

The fix for drift is not reviewing harder. It is **writing the architecture down
where the agent reads it** — an `AGENTS.md` / `CLAUDE.md` section, an ADR
directory, a module-boundary lint rule — so the constraint is in context on every
task rather than in the memory of whoever reviews the PR.

**How to steer.**

```text
Architecture constraints (do not violate; flag if the task seems to require it):
- Phase: <prototype | first production system | scaling>. Optimise accordingly.
- <module A> may call <module B>; never the reverse.
- Cross-module communication goes through <the queue / the public interface>,
  never through shared tables.
- New third-party dependencies or new runtimes require my approval first.
- If your change needs a new module or a new boundary, stop and propose it
  as a short ADR instead of implementing it.
```

---

### 4. Making systems secure and reliable

**What Ng puts in it.** Reliability, concretely: knowing "how to develop testing
strategies to verify the correctness of your system — what mix of unit tests and
integration tests, what frameworks to use, and what level of coverage." Then
designing around failure: how to handle a failure such as "an API hitting a rate
limit," how to build in **graceful degradation**, and how to **minimize the blast
radius** of failures.

Security gets the "shift left" framing — moving security work earlier in the
lifecycle rather than bolting it on after the software exists — and a role change
that parallels the full-stack one:

> "Just as all developers are moving toward becoming full stack developers, many
> developers are now also partly security engineers. You can now use AI tools to
> scan your code for vulnerabilities, check dependencies for supply chain
> injections, and examine your cloud configuration for attack surfaces. But doing
> this well still requires some knowledge of security."

That last clause is the whole point: AI makes security work cheap to *run*, not
cheap to *judge*. A scanner that emits 400 findings has not secured anything
until someone can tell which twelve are reachable.

**What changes.** Agents will write the happy path convincingly and skip the
failure path unless told. **Timeouts, idempotency and retry semantics are the
three things most reliably missing from otherwise-good agent output** — and
they're exactly the "handle an API hitting a rate limit" case Ng names.

If your product itself embeds agents, this sub-skill also grows an
agentic-security surface classic software doesn't have: prompt injection through
untrusted content, tool permissions wider than the task, exfiltration through an
innocent-looking egress. That is repo commentary rather than Ng's text, but it
follows directly from "partly security engineers."

**How to steer.**

```text
Reliability requirements for anything that crosses a process boundary:
- Every outbound call has an explicit timeout and a defined behaviour on failure.
- Every write endpoint is idempotent; say how (key, dedupe window).
- Retries are bounded and jittered; no retry on non-idempotent operations.
- Degrade gracefully: say what the user sees when <dependency> is down.
- Untrusted input (including content fetched at runtime) is never treated as
  instructions. Name the trust boundary in a comment.
Add tests for the failure paths, not only the happy path, and tell me the
unit/integration split you chose and why.
```

Repo material that goes deeper:
[Test a Skill Before Installing It](../10-security/test-a-skill-before-installing.md)
and [AI Safety Classifiers & Jailbreak Severity](../10-security/ai-safety-classifiers-jailbreak-severity.md)
for agent-specific risks;
[OpenWorker Security Coworkers](../05-tools/openworker-security-tutorial.md) for
the "AI tools that scan your code, dependencies and cloud config" pattern in
practice; and
[Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md)
for permissions and accountability across many concurrent agents.

---

### 5. Scaling and operating in production

**What Ng puts in it.** Everything after "it works on my machine," in three
layers.

- **Executing the SDLC** — beyond building and testing: configuring the
  deployment environment, deciding on a release strategy, applying deployment
  automation (**CI/CD**), and understanding infrastructure as a service (**IaaS**).
- **Operating** — "putting in place observability tools, setting alerts, and
  managing incidents."
- **Scaling** — understanding the *real* load, then knowing how to scale servers,
  load-balance, and adapt the data infrastructure (**sharding, indexing,
  replication**) or change the architecture so the system can absorb the load.

Plus the maintenance fundamentals that let a system keep evolving: "version
control, code reviews, dependency maintenance, and how to manage technical debt."

**What changes.** Agentic coding compresses build time far more than it
compresses operate time, so **the share of engineering effort living after the
merge goes up**. If a quarter's work now takes an afternoon, the on-call
rotation, the dashboards and the cost curve become the dominant cost centre — and
they are the parts an agent cannot own, because they depend on production reality
it cannot see.

Two agentic-era additions worth budgeting for:

- **Change volume went up.** More merged PRs per week from the same team means
  deployment safety — feature flags, progressive rollout, fast rollback — matters
  more than it did when change rate was human-limited. Ng's inclusion of code
  reviews and technical debt under this sub-skill lands harder when the review
  queue is agent-fed.
- **If the product calls models, inference cost is an operating metric.** Cost
  per request sits alongside latency, and the levers (model choice, distillation
  or fine-tuning, simplifying an over-elaborate agentic workflow) are engineering
  decisions, not procurement ones.

**How to steer.**

```text
Before this ships, produce:
- The three metrics that would tell us this feature is broken in production,
  and where they are emitted.
- A structured log line per failure mode, with a correlation id.
- The alert (condition + threshold) that should page someone, and the one that
  should not.
- The rollback procedure, in one paragraph, that a stranger could follow.
- Expected cost per 1k requests (including any model calls).
```

Repo material that goes deeper:
[LLM Lifecycle Monitoring](llm-lifecycle-monitoring.md),
[How to Build AI Agents for Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md),
and [CI/CD for AI Agents on Microsoft Foundry](../02-ai-agents/05-production/cicd-ai-agents-microsoft-foundry.md).

---

## The one-page self-assessment

Rate yourself 0–3 per row (0 = couldn't specify it, 3 = could review an agent's
choice and argue it). The point is not the score; it is which row is lowest.

| Sub-skill | Can you specify it before the agent starts? | Can you spot it being done wrong in a diff? |
| --- | --- | --- |
| Full-stack applications | Rendering strategy, API style, where state lives, auth path | Accessibility gaps, state duplicated client-side, a second auth path |
| Managing data | Access patterns, data model and storage type, transactions, retention | Speculative columns, missing indexes, wrong consistency guarantee, data stored without a purpose |
| System architectures | Project phase, module boundaries, monolith vs. services, stack choice | Boundary violations, duplicate helpers, a prototype architecture quietly shipping to production |
| Security & reliability | Test mix and coverage, trust boundaries, timeouts, idempotency, degradation | Missing failure paths, over-broad tool/DB permissions, untriaged scanner output, untrusted input treated as instruction |
| Scale & operations | Signals and alerts, release and rollback strategy, sharding/indexing/replication, cost per request | Unobservable code paths, no rollback, unbounded fan-out, accruing dependency debt |

**How to read your result.** A low score in the left column means you are
delegating a *decision*, not a task — the agent is choosing your architecture. A
low score in the right column means you are merging on trust. Both are fixed by
the same thing: learning the fundamental well enough to write it down.

---

## How this fits the rest of the repo

Ng's four branches line up with material already here, which makes the map a
usable index rather than a competing framework:

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
inner loop produced. The skills map is the same argument as a curriculum: **the
loop got faster, so the value moved to the parts of the loop that are still
yours.**

Ng closes the article by pointing forward, and the link he draws is worth
keeping: understanding fundamentals "helps you figure out what software can and
cannot do," which is precisely what "makes them important context for how you use
coding agents and shape the build" — the two branches he says he will cover in
future posts. Feasibility judgment is the bridge. You cannot write a good spec
for a system you cannot tell is buildable, and you cannot tell an agent it has
gone somewhere impossible if you don't know where the edges are.

---

## Key takeaways

- **Fundamentals became a steering language.** Their value moved from writing
  code to naming tradeoffs precisely enough that an agent resolves them your way.
- **The specific tradeoffs a novice loses**, per Ng: latency, availability,
  consistency, reliability, maintainability, simplicity, and cost. An agent
  decides all seven on every task whether or not you participate.
- **Syntax knowledge is obsolete; structural knowledge is not.** "Developers who
  deeply understand how software works vastly outperform those who vibe code
  without understanding."
- **Specialists are becoming full-stack whether they planned to or not** — and
  many developers are now "partly security engineers" too. Agentic coding removed
  the implementation barrier to working outside your specialism, not the
  judgment barrier.
- **Bad data architecture fails silently.** "If data architecture is chosen
  poorly, the AI doesn't know what it doesn't know" — the most expensive kind of
  wrong, because nothing errors.
- **The right architecture is phase-dependent.** A prototype's architecture is
  not a production architecture; the risk in the agentic era is that the
  prototype ships before anyone re-decides.
- **Post-merge work grows as build time shrinks.** Observability, alerting,
  incident management, rollback and cost per request are a larger share of
  engineering than they were.
- **Someone still has to be right about the spec.** That job — "shaping the
  build" — is the one the map says is growing fastest.

---

## Sourcing note

Ng's skills map is published as a series: a map overview, then one installment
per branch. This page digests the **software engineering fundamentals**
installment (LinkedIn Pulse / X, August 2026) and takes the four-branch overview
and methodology from *The Batch*.

Quoted passages, the five sub-skills and their contents are Ng's. The "what
changes" analysis, the steering prompts, the self-assessment table and the repo
cross-references are this repo's commentary, written to be useful next to the
source rather than to restate it.

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
