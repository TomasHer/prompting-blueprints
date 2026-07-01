# Content Ideas Backlog

> Forward-looking **content** ideas for new pages — distinct from `BACKLOG.md`
> (which tracks remediation/maintenance of existing material) and from the short
> maintainer list in `agents.md §8`. Each idea below is self-contained: it states
> the gap and the evidence for it, where the page should live, what to research,
> a suggested outline, sources to consult, cross-links to existing pages, and a
> done-check. Work them one at a time (e.g. "start idea C1 from IDEAS-BACKLOG.md").
>
> These ideas came out of a June 2026 coverage review: each topic currently
> appears only as **passing mentions** scattered inside other docs — none has a
> dedicated page. Priority order is a suggestion, not a mandate.
>
> When you start an idea, follow the repo conventions before opening a PR:
> - Add YAML front-matter (`title`, `tags`, `last_updated`); first tag must equal
>   the directory category. Run `python3 scripts/check-frontmatter.py`.
> - Add any new sources to `external-sources.md` (alphabetical) and regenerate
>   `source-index.md` via `python3 scripts/build-source-index.py`.
> - Add the new page to `mkdocs.yml` nav and confirm `mkdocs build --strict` passes.
> - Follow the Intent / Constraints / Output-format / Example structure from
>   `CONTRIBUTING.md` where the page is a pattern or playbook.
> - When an idea is delivered, delete its entry here in the same PR — the PR
>   history is the record. If only partly done, rewrite the entry to describe
>   just the remaining work.

---

## C1 — Agent & Prompt Security Playbook (highest priority)

**The gap.** The repo is heavily agentic — MCP, A2A, fleet governance, agents
that touch tools and data — yet there is no dedicated *defensive* page. "Security"
appears only as asides across ~50 files; `04-guides/ai-gone-wrong-stories.md`
covers *failures and embarrassments*, not *threat models and defenses*. The
closest infrastructure pages (`02-ai-agents/04-protocols/mcp-guide.md`,
`02-ai-agents/01-foundations/agent-fleet-governance.md`) assume the reader
already knows how agents get attacked.

**Target location.** New page under `02-ai-agents/05-production/`
(e.g. `agent-security-playbook.md`). Only create a new `06-security/` subfolder
if the topic grows past one page — avoid new directories per `agents.md §1`.
First tag: `agents`.

**What to research.**
- OWASP Top 10 for LLM Applications (current 2025 edition) — map each item to a
  concrete agentic scenario.
- Indirect / cross-domain prompt injection: malicious instructions arriving via
  retrieved documents, web pages, tool outputs, MCP server responses, email, or
  issue/PR text — not just the user prompt.
- The "lethal trifecta" framing (access to private data + exposure to untrusted
  content + ability to exfiltrate) and why combining all three is the danger.
- MCP-specific risks: untrusted/over-permissioned servers, tool-description
  poisoning, confused-deputy via tool chaining.
- Defenses: input/output guardrails, allowlisting tool calls, human-in-the-loop
  approval gates, least-privilege tool scoping, sandboxing, output filtering,
  dual-LLM / quarantine patterns, and provenance/trust labeling of context.
- **Case study: Anthropic – "Redeploying Fable 5"** (30 Jun 2026, see
  `external-sources.md`). Real-world example of provider-side misuse defenses
  worth folding into the attack catalogue / defense-patterns table: safety
  classifiers that block potentially harmful cybersecurity requests at
  inference time; the "defense in depth" idea (no single mechanism is perfect,
  layering them is); the "safety margin" concept (deliberately over-blocking
  borderline-benign requests to raise the bar against jailbreaks, trading
  false positives for missed true positives); a jailbreak-severity taxonomy
  (minor / narrow-harmful / universal) scored on four axes — capability gain,
  breadth of capability gain, ease of weaponization, discoverability — which
  is a reusable rubric for triaging any jailbreak finding; and the role of
  external red-teaming / bug-bounty channels (HackerOne) and government
  pre-release evaluation in catching what classifiers miss.

**Suggested outline.**
1. Intent + one-line summary (threat model first, then defenses).
2. Why agents change the threat surface vs. plain chat (tools, autonomy, memory).
3. The attack catalogue (direct injection, indirect injection, tool poisoning,
   data exfiltration, jailbreaks, supply-chain via MCP) — each with a short
   concrete example.
4. The lethal-trifecta decision check: "do you have all three? then add a gate."
5. Defense patterns table (control → what it stops → cost/UX tradeoff).
6. A practical checklist for shipping an agent to production.
7. References.

**Cross-links.** `mcp-guide.md`, `agent-fleet-governance.md`,
`how-to-build-ai-agents-production.md`, `ai-gone-wrong-stories.md`,
`loop-engineering.md`.

**Done-check.** A reader can identify whether their agent has the lethal trifecta
and name at least three concrete defenses; OWASP LLM Top 10 is mapped to agent
scenarios; page is in nav and `mkdocs build --strict` passes.

---

## C2 — RAG & Retrieval Patterns

**The gap.** `02-ai-agents/03-context-and-memory/ai-knowledge-base-tutorial.md`
and the memory tutorials exist, but no page teaches **retrieval itself**. "RAG"
appears as a passing term in ~20 files and is never explained as a how-to:
chunking, embeddings, hybrid search, reranking, and retrieval evaluation are
absent. This is arguably the most common production LLM pattern and the biggest
under-explained foundation in the repo.

**Target location.** New page under `02-ai-agents/03-context-and-memory/`
(e.g. `rag-retrieval-patterns.md`). First tag: `agents`.

**What to research.**
- The decision frame: RAG vs. long-context vs. fine-tuning vs. tool/API lookup —
  when each wins, and how they combine.
- Chunking strategies (fixed, recursive, semantic, structure-aware) and their
  failure modes; metadata and citations.
- Embeddings + vector stores at a conceptual level; hybrid (keyword + vector)
  retrieval; reranking (cross-encoders).
- Retrieval quality as the real bottleneck: recall@k, precision, faithfulness /
  groundedness, and how to measure them (ties into C3).
- Failure modes: lost-in-the-middle, stale indexes, over-chunking, retrieval of
  near-duplicates, context dilution.

**Suggested outline.**
1. Intent + when NOT to use RAG.
2. The RAG pipeline at a glance (ingest → chunk → embed → retrieve → rerank →
   generate) with a diagram or ASCII flow.
3. Decision table: RAG vs. long-context vs. fine-tune.
4. Chunking and retrieval patterns with tradeoffs.
5. Evaluating retrieval (link to C3 for judging the generation).
6. Common failure modes and fixes.
7. References.

**Cross-links.** `ai-knowledge-base-tutorial.md`, `context-engineering.md`,
`agent-context-window-performance.md`, `mempalace-ai-memory-tutorial.md`,
`claude-fine-tune-llm.md` (RAG-vs-fine-tune decision).

**Done-check.** A reader can choose RAG vs. alternatives for a given task, pick a
chunking strategy with stated tradeoffs, and name how to measure retrieval
quality. Page in nav; strict build passes.

---

## C3 — LLM-as-a-Judge & Evaluation Harness Guide

**The gap.** Strong infra signal already exists — `06-models-and-evaluations/promptfoo.yml`,
`pattern-catalogue-smoke.yml`, `facts-benchmark-overview.md` — but there is **no
narrative guide on how to actually evaluate outputs**. `agents.md §8` already
backlogs a `structure-validators.yml`, so this is on the radar. The page should
turn the existing config artifacts into a teachable, repeatable method.

**Target location.** New page under `06-models-and-evaluations/`
(e.g. `llm-evaluation-guide.md`). First tag: `models` (or the directory's
established first-tag — verify against neighbors). Consider shipping the
`structure-validators.yml` from `agents.md §8` alongside it.

**What to research.**
- Eval taxonomy: offline vs. online; reference-based (exact/embedding) vs.
  reference-free (rubric, LLM-judge); unit-style assertions vs. holistic scoring.
- Building golden datasets: sourcing cases, covering edge cases, avoiding leakage,
  sizing.
- LLM-as-a-judge: pairwise vs. single-answer rubric grading; known biases
  (position bias, verbosity bias, self-preference) and mitigations; when a judge
  is trustworthy vs. when to use deterministic checks.
- Regression gating in CI: thresholds, flakiness, how to wire promptfoo into a
  pass/fail gate (connect to the Phase-3 CI work in `BACKLOG.md`).
- Metrics for RAG/agents: groundedness, faithfulness, answer relevance, task
  success rate.

**Suggested outline.**
1. Intent: why "it looks good" doesn't scale.
2. The eval pyramid (cheap deterministic checks → structured assertions →
   LLM-judge → human review).
3. Building a golden set.
4. LLM-as-a-judge done well (rubric design, bias mitigation, validating the
   judge against humans).
5. Wiring it into CI with the existing `promptfoo.yml` (worked example).
6. Metrics cheat-sheet for chat / RAG / agents.
7. References.

**Cross-links.** `promptfoo.yml`, `facts-benchmark-overview.md`,
`pattern-catalogue-smoke.yml`, `llm-lifecycle-monitoring.md`,
`requirements-engineering-dataset-experiments.md`, and C2 (retrieval metrics).

**Done-check.** A reader can stand up a small golden set, write rubric + assertion
checks against the existing promptfoo config, and explain two LLM-judge biases and
their mitigations. Page in nav; strict build passes.

---

## C4 — Token Economics & Cost / Latency Optimization

**The gap.** Only ~6 files touch cost, all in passing. There is no single page on
**making agents affordable** — a top operational concern as agentic loops multiply
token usage. The repo teaches how to build loops (`loop-engineering.md`) and manage
context (`agent-context-window-performance.md`) but not how to keep them cheap.

**Target location.** New page under `06-models-and-evaluations/` (cost framed as a
model/eval concern, e.g. `token-economics-cost-optimization.md`) or
`02-ai-agents/05-production/` if framed as an ops concern. Pick one and cross-link
the other. First tag matches the chosen directory.

**What to research.**
- Token mechanics: input vs. output pricing asymmetry, why output tokens dominate
  agent loops, reasoning-token costs.
- Prompt caching: how it works across major providers, what is cacheable, and the
  savings/latency impact (verify current provider docs — do not quote prices from
  memory; link to official pricing pages and use illustrative ratios instead).
- Model routing / cascades: small-model-first with escalation, classifier-routing,
  speculative patterns.
- Context-window budgeting: trimming, summarizing memory, retrieval instead of
  stuffing (link to C2).
- Batching, parallelization, and when reasoning models are/aren't worth it.
- Measuring cost-per-task and building a simple cost estimator (a table or
  worksheet readers can copy).

**Suggested outline.**
1. Intent: why agent loops blow up cost.
2. Where the tokens actually go (a worked breakdown of one agent run).
3. Lever 1: prompt caching. Lever 2: model routing/cascades. Lever 3: context
   budgeting. Lever 4: batching/parallelism. Lever 5: stop conditions.
4. Cost-vs-quality decision table (when paying more is right).
5. A copy-ready cost-per-task estimator worksheet.
6. References (link to live pricing pages, not hard-coded numbers).

**Cross-links.** `agent-context-window-performance.md`, `loop-engineering.md`,
`models-for-ai-agents-2026.md`, `prompt-context-harness-engineering.md`, and C2.

**Done-check.** A reader can estimate cost-per-task for an agent and name at least
three levers to cut it, with the caching/routing tradeoffs stated. Page links to
official pricing (no stale hard-coded prices). In nav; strict build passes.

---

## C5 — "Start Here" Learning Path / Reader Roadmap

**The gap.** The repo has 150+ pages and grows weekly, but no guided entry point.
`overview.md` files are per-folder; "roadmap / learning path / start here" only
match incidentally. New readers hit a wall of breadth. This is the cheapest
high-impact win and directly serves the README's "fork for your team" pitch.

**Target location.** Top-level `START-HERE.md` linked prominently from the README
hero (and added to nav as the first item). Avoid a new top-level directory unless
it clearly grows; a single file is enough to start. Front-matter first tag should
match whatever convention root-level docs use (verify, or treat as `guides`).

**What to research / assemble (mostly curation, not new prose).**
- Reuse the existing persona pages in `03-prompts-and-patterns/`
  (`managers-`, `researchers-`, `writers-`, `presentations-prompting-blueprints.md`)
  as the basis for role tracks.
- Audit which existing pages are genuinely beginner-friendly vs. advanced, and
  sequence them.

**Suggested outline.**
1. "If you have 30 minutes" quickstart — 3–5 must-read pages.
2. Role-based tracks, each an ordered 8–12 page reading path:
   - **Practitioner / individual contributor**
   - **Team lead / adopter** (ties to `ai-adoption-guide.md`)
   - **Researcher** (ties to `07-use-cases-and-research/` and persona page)
   - (optional) **Builder / engineer** (agents, MCP, evals, security → C1/C3)
3. "Where to go next" map linking the section overviews.
4. A short "how this repo is organized" orientation.

**Cross-links.** README hero, all `overview.md` files, persona pages,
`ai-adoption-guide.md`, `genai-basics-glossary.md`.

**Done-check.** A first-time visitor can pick a role and follow an ordered path
without guessing; README links to it above the fold; every linked page exists and
resolves (link check clean); in nav; strict build passes.

---

## Notes on sequencing

- **C1** and **C5** are the two highest-leverage: C1 closes the most glaring gap
  relative to how agent-heavy the repo is; C5 is the cheapest win for engagement.
- **C2 → C3 → C4** form a natural cluster (retrieval, then how to evaluate it,
  then how to make it cheap) and cross-reference each other; doing them in that
  order lets each link forward to the next.
