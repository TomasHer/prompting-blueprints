---
title: "OpenSpec & BMAD Method: Two Spec-Driven Development Frameworks"
tags: ["tools", "spec-driven", "agents", "workflows", "claude-code"]
last_updated: "2026-08-20"
---

# OpenSpec & BMAD Method: Two Spec-Driven Development Frameworks

> Two of the most popular open-source frameworks for [spec-driven development](spec-driven-development-tutorial.md) take opposite bets on how much process an AI coding workflow needs. [OpenSpec](https://github.com/Fission-AI/OpenSpec) (Fission-AI, MIT, ~65.6k stars at the time of writing) is a **lightweight change-management layer**: every change starts as a reviewable proposal with spec deltas, and archiving the change merges those deltas into the living spec. [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, MIT, ~52.1k stars) — the *Breakthrough Method for Agile AI Driven Development* — is a **full agile lifecycle methodology**: named agent personas (Analyst, PM, Architect, Developer, UX) walk you through four phases from brainstorming to retrospective, producing briefs, PRDs, architecture docs, epics, and stories along the way. Both are npm-installed, tool-agnostic, and work with 30+ AI coding assistants including Claude Code, Cursor, and Codex.

## Intent

- Explain what each framework actually does: OpenSpec's proposal → apply → archive loop with spec deltas, and BMAD's four-phase, agent-persona delivery pipeline.
- Get you from zero to a first spec-driven change in each tool, with exact install and slash commands.
- Give you a decision framework for choosing between them (and against [GitHub spec-kit and Kiro](spec-driven-development-tutorial.md), covered elsewhere in this repo).

## Use when

- Your AI assistant ships code that works but nobody agreed on *what* it should do — requirements live in chat scrollback instead of reviewable artifacts.
- You maintain a **brownfield codebase** and want specs that evolve change-by-change rather than a big up-front rewrite (OpenSpec's home turf).
- You are starting a **larger product effort** and want AI to carry you through analysis, PRD, architecture, and story-by-story implementation with explicit human gates (BMAD's home turf).
- You already read the [Spec-Driven Development Tutorial](spec-driven-development-tutorial.md) and want a deep dive on the two most-starred community frameworks in the space.

## Why another layer on top of your coding agent?

Raw AI coding fails predictably on non-trivial work: the agent guesses at unstated requirements, silently encodes assumptions into code, and loses context between sessions. Both frameworks attack the same root cause — **alignment before implementation** — but at different altitudes:

| | **OpenSpec** | **BMAD Method** |
| :--- | :--- | :--- |
| Core unit | A *change* (proposal + spec deltas + tasks) | A *story* inside an epic, derived from a PRD |
| Ceremony | Minutes per change | Hours up front for a full plan, then per-story |
| Best scale | Any — single fix to feature | Feature to full product |
| Greenfield/brownfield | Explicitly "built for brownfield" | Both; scale-adaptive planning depth |
| Metaphor | Version control for requirements | An agile team in a box |

---

## OpenSpec: change proposals with spec deltas

OpenSpec's philosophy is *"fluid not rigid, iterative not waterfall, easy not complex."* Requirements are plain Markdown — no special syntax — and the AI writes them for you to review before any code exists.

### Setup

Requires Node.js 20.19.0+ (pnpm, yarn, bun, and nix also supported):

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init        # scaffolds openspec/ and installs slash commands for your AI tools
```

`openspec update` refreshes the generated agent instructions after upgrades, and `openspec config profile` switches between the default and expanded command profiles.

### The directory model: current truth vs. proposed truth

```text
openspec/
├── specs/               # current truth: requirements with WHEN/THEN scenarios
├── changes/             # proposed truth: one folder per in-flight change
│   └── add-dark-mode/
│       ├── proposal.md  # why, what, scope
│       ├── specs/       # spec DELTAS: ADDED / MODIFIED / REMOVED requirements
│       ├── design.md    # technical approach
│       └── tasks.md     # implementation checklist
└── changes/archive/     # completed changes, by date and name
```

The trick that makes OpenSpec brownfield-friendly is the **delta system**: a change doesn't rewrite the spec, it declares `ADDED`, `MODIFIED`, and `REMOVED` requirements, each backed by scenarios in WHEN/THEN form ("WHEN the user clicks the theme toggle THEN the app switches to dark mode and persists the choice"). When you archive the change, the deltas merge into `openspec/specs/` — the spec stays current without ever blocking on a full rewrite, the same way commits update a codebase without retyping it.

### The workflow loop

The slash commands (prefix `/opsx:` in Claude Code; `/opsx-propose` in Cursor and GitHub Copilot, `@opsx-propose` in Amazon Q, `$openspec-propose` in Codex) drive a four-step loop:

1. **`/opsx:explore`** — thinking-partner mode: the AI reads the codebase and weighs options *before* committing to a plan.
2. **`/opsx:propose <description>`** — creates the change folder with proposal, spec deltas, design, and tasks. You review and edit the Markdown — this is the human gate.
3. **`/opsx:apply`** — the AI implements the task checklist against the agreed spec.
4. **`/opsx:archive`** — moves the change to the archive and merges its deltas into the main specs.

The expanded profile adds `/opsx:new`, `/opsx:continue`, `/opsx:ff` (fast-forward), `/opsx:verify`, `/opsx:bulk-archive`, and `/opsx:onboard` (generate specs for an existing codebase — the brownfield entry point).

### Notes before adopting

- **Stores (beta)** put the `openspec/` planning tree in a dedicated repo that multiple code repos reference via Git — cross-repo features with one shared set of requirements.
- **Model choice matters**: the README recommends high-reasoning models (it names Codex 5.5 and Opus 4.7).
- **Telemetry** is anonymous (command names and version only) and on by default; disable with `openspec config set telemetry.enabled false`, `OPENSPEC_TELEMETRY=0`, or `DO_NOT_TRACK=1`. It is off automatically in CI.

---

## BMAD Method: an agile team as agent skills

Where OpenSpec manages *changes*, BMAD manages the *whole delivery lifecycle*. Its loop is Clarify → Plan → Build & Verify → Learn & Adjust, sized adaptively — "minor changes proceed directly to build" while complex work gets proportional planning depth, from weekend prototype to legacy system.

### Setup

Prerequisites are Node.js 20.12+, Python 3.10+, and `uv`:

```bash
npx bmad-method install   # interactive: pick modules, generates skills for your IDE
```

The installer generates **skills** into your agent's skill directory (`.claude/skills/` for Claude Code, `.agents/skills/` for Cursor and Windsurf) — BMAD rides the same skills machinery covered in [Claude Agent Skills](../02-ai-agents/02-skills/claude-agent-skills.md). Planning agents also ship as web bundles for Google Gemini Gems and ChatGPT Custom GPTs, so you can do heavy planning in a cheap web UI and switch to the IDE for implementation. Rerun the installer after adding or removing modules.

Two skills orient you at any point:

- **`bmad-help`** — inspects the project state and recommends the next required or optional step; accepts natural language ("`bmad-help` I have a SaaS idea").
- **`bmad-build`** — the primary implementation skill all paths converge on.

### The agents

BMAD's signature is role-played **agent personas**, each an invokable skill with a menu of trigger codes:

| Agent | Persona | Skill | Handles |
| :--- | :--- | :--- | :--- |
| Analyst | Mary | `bmad-agent-analyst` | Brainstorming, market/domain/technical research, product brief, PRFAQ challenge |
| Product Manager | John | `bmad-agent-pm` | Create/validate PRD, epics & stories, implementation-readiness gate, correct course |
| Architect | Winston | `bmad-agent-architect` | Architecture, implementation-readiness gate |
| Developer | Amelia | `bmad-agent-dev` | Build, QA test generation, code review, sprint planning, epic retrospective |
| UX Designer | Sally | `bmad-agent-ux-designer` | UX design |

You can load a persona and drive it through its menu, or invoke the underlying workflow skills directly (`bmad-prd`, `bmad-architecture`, …) without the character wrapper.

### The four phases

Each phase produces documents the next phase consumes — context engineering by artifact, not by chat history:

| Phase | Key workflows | Key outputs |
| :--- | :--- | :--- |
| **1. Analysis** (optional) | `bmad-brainstorming`, `bmad-forge-idea`, `bmad-deep-recon`, `bmad-product-brief`, `bmad-prfaq` | `brief.md`, research packs, `prfaq-{project}.md` |
| **2. Planning** | `bmad-prd`, `bmad-ux`, `bmad-spec` | `prd.md`, `DESIGN.md`, `SPEC.md` |
| **3. Solutioning** | `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning` | `ARCHITECTURE-SPINE.md`, epic files with nested stories, PASS/CONCERNS/FAIL verdict + `sprint-status.yaml` |
| **4. Implementation** | `bmad-build`, `bmad-code-review`, `bmad-correct-course`, `bmad-retrospective` | Implemented code, review findings and patches, retro document |

Three details are worth calling out:

- **Story files are the context carrier.** Epics decompose into story files that embed the decisions and context a fresh dev session needs — the answer to "my agent forgot everything between sessions."
- **`bmad-sprint-planning` is a hard gate**: it issues a PASS/CONCERNS/FAIL readiness verdict before implementation begins, and `sprint-status.yaml` tracks progress across sessions.
- **Project-wide rules live in `AGENTS.md`** (via `bmad-project-context`), so every workflow makes consistent decisions on greenfield and brownfield code alike — the same pattern as the [AGENTS.md tutorial](../02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md).

For hands-off execution, **`bmad-build-auto`** runs one unattended build iteration, and the **BMad Loop** module chains them into autonomous epic execution — [loop engineering](../02-ai-agents/01-foundations/loop-engineering.md) with BMAD artifacts as the success criteria.

### Modules

The core method (BMM) is one module among several picked at install time: **BMad Builder** (`bmb` — build your own agents, workflows, and modules), **Creative Intelligence Suite** (`cis` — ideation frameworks like SCAMPER), **Game Dev Studio** (`gds` — Unity/Unreal/Godot workflows and GDD generation), and **Test Architect** (`tea` — enterprise test strategy via the Murat agent, with P0–P3 prioritization). A community-module marketplace is planned.

---

## Choosing between them

| Question | Pick |
| :--- | :--- |
| "I want lightweight specs on an existing codebase, change by change" | **OpenSpec** — `/opsx:onboard`, then propose → apply → archive |
| "I'm starting a product and want AI to run discovery → PRD → architecture → stories" | **BMAD** — the four phases are the product |
| "My team needs requirements review before any code, with minimal ceremony" | **OpenSpec** — `proposal.md` is the review artifact |
| "I want role separation (PM vs. architect vs. dev) with human gates between phases" | **BMAD** — agents + the sprint-planning PASS/CONCERNS/FAIL gate |
| "Requirements shared across several repos" | **OpenSpec Stores** (beta) |
| "I want to extend the methodology itself (own agents, own workflows)" | **BMAD Builder** module |

They also compose: nothing stops you from planning a product with BMAD's Analyst/PM/Architect phases and then managing post-launch evolution as OpenSpec changes — the artifacts are all Markdown in your repo either way. And both sit in the wider landscape mapped in the [Spec-Driven Development Tutorial](spec-driven-development-tutorial.md): OpenSpec positions itself as lighter than GitHub's spec-kit (no rigid phase gates, no Python toolchain) and more tool-agnostic than Kiro (any IDE, any model), while BMAD is closest in spirit to [Superpowers](superpowers-tutorial.md) — a full methodology shipped as skills — but aimed at the product lifecycle rather than the coding session.

## Key takeaways

- **Both frameworks move requirements out of chat and into reviewable repo artifacts** — the defining move of spec-driven development. The human gate shifts from "review the diff" to "review the spec."
- **OpenSpec is version control for requirements**: changes carry ADDED/MODIFIED/REMOVED spec deltas with WHEN/THEN scenarios, and archiving merges them into the living spec — iterative by construction, and built for brownfield.
- **BMAD is an agile team in a box**: five named agent personas, four scale-adaptive phases, and artifacts (brief → PRD → architecture → epics → stories) that carry context between sessions so a fresh dev agent never starts cold.
- **Ceremony is the price signal.** OpenSpec costs minutes per change; BMAD front-loads hours of planning that pay off on larger efforts. Match the framework to the size of what you're building — or use BMAD to plan and OpenSpec to evolve.
- **Both are tool-agnostic by design** (30+ assistants, plain Markdown artifacts, MIT-licensed), so the spec layer survives even if you switch coding agents — the whole point of putting truth in the repo instead of the tool.

## References

- Fission-AI – [OpenSpec: Spec-driven development for AI coding assistants (GitHub)](https://github.com/Fission-AI/OpenSpec) (README: workflow loop, delta system, directory structure, CLI/slash commands, comparisons, telemetry)
- Fission-AI – [OpenSpec: supported tools (GitHub)](https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md)
- bmad-code-org – [BMAD-METHOD: Breakthrough Method for Agile AI Driven Development (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD)
- BMad Method – [documentation site](https://docs.bmad-method.org/)
- bmad-code-org – [BMAD-METHOD docs: agents reference (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/reference/agents.md)
- bmad-code-org – [BMAD-METHOD docs: workflow map (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/reference/workflow-map.md)
- bmad-code-org – [BMAD-METHOD docs: commands reference (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/reference/commands.md)
- bmad-code-org – [BMAD-METHOD docs: official modules (GitHub)](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/reference/modules.md)
- Related in this repo: [Spec-Driven Development Tutorial](spec-driven-development-tutorial.md) · [Superpowers Tutorial](superpowers-tutorial.md) · [Claude Agent Skills](../02-ai-agents/02-skills/claude-agent-skills.md) · [AGENTS.md for Claude Code Tutorial](../02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md) · [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) · [Context Engineering](../02-ai-agents/03-context-and-memory/context-engineering.md)
