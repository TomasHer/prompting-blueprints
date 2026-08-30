---
title: "AI-Supported SDLC — Overview and Reading Path"
tags: ["guides", "sdlc", "spec-driven", "ai-coding"]
last_updated: "2026-08-30"
---

# AI-Supported SDLC — Overview and Reading Path

## Intent

Give one entry point to everything in this repo about **running a software
lifecycle when agents write most of the code** — spec-driven development, the
AI-native SDLC, and the methodologies competing to define the stages in between.

The pages exist; what was missing is the map. This one says what each page owns,
in what order to read them, and how the rival stage models line up — so you can
tell at a glance whether two pages compete or compose.

## Use when

- You want the topic end to end and don't know which of a dozen pages to open first.
- Your team is choosing between spec-driven frameworks (spec-kit, Kiro, OpenSpec, BMAD) and needs the comparison rather than four separate tours.
- You are writing an internal standard for "how we use coding agents" and want the artifact chain, the gates, and the governance model in one place.
- You keep meeting the same ideas — `spec.md`, plan approval, TDD loops, hooks — under different names in different guides.

---

## The 30-minute path

Read these four, in this order. They are the topic; everything else is depth.

1. **[AI Coding Spectrum](../02-ai-agents/01-foundations/ai-coding-spectrum.md)** — the taxonomy that positions everything else: vibe-coding → AI-assisted → agentic. Spec-driven development is what you reach for when the first mode stops scaling.
2. **[Spec-Driven Development Tutorial](../05-tools/spec-driven-development-tutorial.md)** — the method and its tool ecosystem: Kiro Specs/Hooks/Steering, GitHub spec-kit, Antigravity, Strands Agent SOPs, and a toolchain decision table.
3. **[The AI-Native SDLC Playbook](./ai-native-sdlc-playbook.md)** — the lifecycle rebuilt around the method: six stages, an artifact per stage, governance in two layers, and a review model where agents review everything and approve nothing.
4. **[OpenSpec & BMAD Method](../05-tools/openspec-bmad-tutorial.md)** — the two most-adopted community frameworks, taking opposite bets on how much process the workflow needs.

Then pick a depth track from the map below.

---

## The map: who owns what

Nothing here is a duplicate. Each page is anchored to a different source and sits
at a different altitude — the column on the right says what *not* to look for on
each page.

### Core

| Page | Owns | Don't look here for |
| --- | --- | --- |
| [AI Coding Spectrum](../02-ai-agents/01-foundations/ai-coding-spectrum.md) | The three modes and when each applies | Any workflow detail |
| [Spec-Driven Development Tutorial](../05-tools/spec-driven-development-tutorial.md) | The method + the commercial tool landscape | Governance, review, incident handling |
| [AI-Native SDLC Playbook](./ai-native-sdlc-playbook.md) | Stages, artifacts, gates, skills-vs-hooks, closing the loop from production | Tool-by-tool setup |
| [OpenSpec & BMAD Method](../05-tools/openspec-bmad-tutorial.md) | Two open-source frameworks, install-to-first-change | The wider tool ecosystem |

### Methodology — the same lifecycle, other lenses

| Page | Lens |
| --- | --- |
| [Superpowers](../05-tools/superpowers-tutorial.md) | The whole methodology shipped as 14 composable skills that hand off to each other |
| [Agent Skills: Engineering Workflows](../02-ai-agents/02-skills/agent-skills-engineering-workflows.md) | One skill per lifecycle phase, with slash commands as entry points |
| [Codex TDD Workflow and Skills](./codex-tdd-and-skills.md) | The inner loop: failing test as the agent's unambiguous exit condition |
| [12 Rules for AI Coding Tools](./ai-coding-rules-senior-engineers.md) | The habits *inside* the Build stage, as a rules file |
| [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) | The Kaggle/Google *New SDLC* whitepaper: `Agent = Model + Harness`, and the harness in every phase |
| [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) | Why an agent loop terminates — the mechanism under every "verify" step above |

### Adjacent tracks

| Track | Pages |
| --- | --- |
| **Upstream — requirements** | [Requirements Engineering overview](../08-requirements-engineering/overview.md), [Compare Specification With Source Code](../08-requirements-engineering/compare-specification-with-source-code.md), [Check Model Consistency](../08-requirements-engineering/check-model-consistency.md) — spec↔code traceability is the discipline SDD is rediscovering |
| **Downstream — production** | [CI/CD for AI Agents on Microsoft Foundry](../02-ai-agents/05-production/cicd-ai-agents-microsoft-foundry.md), [How to Build AI Agents That Work in Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md), [LLM Lifecycle Monitoring](./llm-lifecycle-monitoring.md) |
| **Measurement** | [The 10X Developer in the Agentic Era](./10x-developer-agentic-era.md) — DORA, SPACE, DX Core 4, and why PR counts stop meaning anything |
| **Judgment** | [AI Engineering Skills Map](./ai-engineering-skills-map.md) — the fundamentals you need to evaluate what the agent produced |
| **Tooling & setup** | [How to Design a CLAUDE.md](../05-tools/claude-md-design-tutorial.md), [Claude Code Project Structure](../05-tools/claude-code-project-structure-tutorial.md), [Claude Code Plugins](../05-tools/claude-code-plugins-tutorial.md), [Right Selection of a Coding AI Agent](../05-tools/coding-ai-agent-selection-tutorial.md) |
| **Prototyping** | [Vibe Coding Tech Stack](./vibe-coding-tech-stack.md), [Lovable Vibe Coding Tutorial](../05-tools/lovable-vibe-coding-tutorial.md) |
| **When it goes wrong** | [AI Gone Wrong Incident Stories](./ai-gone-wrong-stories.md) |
| **Field reports** | [GAISE 2026](../09-conferences/gaise-2026.md) — see [the practitioner evidence](#the-practitioner-evidence-gaise-2026) below |

---

## Four stage models, side by side

The most common source of confusion in this topic: four pages each teach a staged
workflow, with different names and different counts. They are not competing
methods — they are the same spine at different granularities.

| Model | Source | Stages | Unit of work |
| --- | --- | --- | --- |
| **AI-Native SDLC** | [Playbook](./ai-native-sdlc-playbook.md) | 6 — Plan · Design · Build · Test · Deploy · Maintain | A change, tracked as committed artifacts |
| **Agent Skills** | [Engineering Workflows](../02-ai-agents/02-skills/agent-skills-engineering-workflows.md) | 6 — Define · Plan · Build · Verify · Review · Ship | A task, routed to a skill by slash command |
| **Superpowers** | [Tutorial](../05-tools/superpowers-tutorial.md) | 7 — brainstorm · worktree · plan · implement · TDD · review · finish branch | A 2–5 minute task run by a fresh subagent |
| **OpenSpec** | [Tutorial](../05-tools/openspec-bmad-tutorial.md) | 3 — propose · apply · archive | A change proposal with spec deltas |
| **BMAD Method** | [Tutorial](../05-tools/openspec-bmad-tutorial.md) | 4 phases, agent personas (Analyst, PM, Architect, Dev, UX) | A story inside an epic, derived from a PRD |
| **Codex TDD** | [Guide](./codex-tdd-and-skills.md) | 4 steps — red · implement · green · refactor | One failing test |

Mapped onto a common spine:

```text
  UNDERSTAND        DESIGN          BUILD                VERIFY        SHIP
  ──────────────────────────────────────────────────────────────────────────
  Plan              Design          Build                Test          Deploy → Maintain
  Define            Plan            Build                Verify        Review → Ship
  brainstorm        writing-plans   subagent-driven      TDD           review → finish branch
  propose ─────────────────────────  apply ───────────────────────────  archive
                                    red → implement → green → refactor
```

The Codex TDD loop is not a peer of the others — it is the **inner loop** that
runs inside every Build cell in the rows above. Likewise, the OpenSpec loop is
deliberately flatter: it is change management, not a delivery method.

---

## The through-line: three artifacts

Strip the vocabulary away and every model above agrees on the same move —
**alignment before implementation, written to a file the next stage reads.** The
playbook's naming is the clearest:

| Artifact | Question it answers | Approved by |
| --- | --- | --- |
| `intent.md` | What problem, for whom, and what is out of scope | Human, before design starts |
| `spec.md` | What the system must do, as testable statements | Human, on the tradeoffs |
| `plan.md` | How it gets built, file by file | Human — the highest-leverage gate in the lifecycle |

Everything else is a variation: OpenSpec calls these a proposal with spec deltas,
BMAD calls them brief/PRD/architecture doc, spec-kit calls them constitution,
specification and plan, Superpowers calls them a design spec and a task plan. The
substrate is identical — Markdown in the repo, reviewed as a diff.

The reason this matters is stated most sharply in the playbook: **reading a
twenty-line plan and saying "not that way" costs a minute; discovering the same
objection in a 900-line diff costs an afternoon.**

---

## Debates worth knowing

The material is not settled. Four live disagreements run across these pages:

- **"Is spec-driven development just waterfall in disguise?"** Taken to its hard-core definition, pure SDD assumes you know almost everything about a feature before building it. The resolution offered at [GAISE 2026](../09-conferences/gaise-2026.md) is **strong bidirectional traceability** — specs and code stay linked in both directions, so a change to either surfaces in the other, and the process stays iterative.
- **Five stages or six?** The [playbook](./ai-native-sdlc-playbook.md#a-note-on-five-stages-vs-six) reconciles its own two framings. The six-stage version is the safer base for an internal standard, because it forces `spec.md` to exist as its own approved artifact instead of being absorbed into planning.
- **Skills or hooks?** Encoded policy versus deterministic enforcement. The playbook's rule is unambiguous: safety-critical invariants must be **hooks**, because prose is not a control. An agent that "agreed" to a rule and broke it was given the wrong mechanism.
- **How much process is enough?** OpenSpec's minutes-per-change against BMAD's hours-up-front is the same argument at framework scale, and the [comparison](../05-tools/openspec-bmad-tutorial.md#choosing-between-them) is the one to read before committing a team to either.

---

## The practitioner evidence (GAISE 2026)

The [GAISE 2026 recap](../09-conferences/gaise-2026.md) is the densest single
source in this repo on the topic and easy to miss inside a conference page. Three
sessions bear directly on it:

- **[Specification-Driven and AI-Powered Software Engineering in Regulated Environments](../09-conferences/gaise-2026.md#demo-spexant)** (Mika Torhola, Atostek) — SDD taken to IEC 62304 / ISO 13485 / ISO 14971, where every line of code traces to a requirement and every requirement to a risk control. Includes the waterfall provocation above and a "Product Health Board" that scores traceability coverage continuously rather than at submission.
- **Three layers of debt** (Markus Borg's keynote) — technical, **intent**, and cognitive. Intent debt is the one this whole topic exists to pay down: *capture intent before agents act* — requirements, spec-driven development, ADRs, TDD.
- **From vibes to engineering** (Tommi Mikkonen's keynote) — the curve-shape argument for why unmanaged AI coding plateaus, and [Sami Lahti's demo](../09-conferences/gaise-2026.md#demo-skills) on changing the core SDLC rather than bolting AI onto the old one.

---

## Related reading in this repo

- [Guides Overview](./overview.md) — the vendor guide library, including the Kaggle/Google *New SDLC with Vibe Coding* whitepaper.
- [AI Adoption Readiness Guide](./ai-adoption-guide.md) — the organizational side of the same change.
- [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) — what happens when it is not one agent but many.

## References

- [Anthropic — The AI-Native SDLC playbook](https://claude.com/blog/the-ai-native-sdlc-playbook) (August 2026)
- [Kaggle / Google — The New SDLC with Vibe Coding](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding) (Addy Osmani, Shubham Saboo, Sokratis Kartakis, May 2026)
- [GitHub spec-kit](https://github.com/github/spec-kit) · [OpenSpec](https://github.com/Fission-AI/OpenSpec) · [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) · [Superpowers](https://github.com/obra/superpowers)
