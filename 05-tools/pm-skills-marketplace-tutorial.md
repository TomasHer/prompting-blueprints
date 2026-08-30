---
title: "PM Skills Marketplace: Turn Claude into a Product Management Copilot"
tags: ["tools", "claude-code", "claude-cowork", "plugins", "skills", "product-management"]
last_updated: "2026-07-20"
---

# PM Skills Marketplace: Turn Claude into a Product Management Copilot

An extensive tutorial for [phuryn/pm-skills](https://github.com/phuryn/pm-skills) — a free,
MIT-licensed marketplace of **68 product-management skills and 42 chained workflows across
9 Claude plugins**, curated by Paweł Huryn of *The Product Compass* newsletter. Instead of
explaining your process to Claude every time, the methodology ships pre-installed: each skill
encodes a proven PM framework (Teresa Torres, Marty Cagan, Ash Maurya, Strategyzer, …) and
walks you through it step by step.

This tutorial covers what the marketplace actually is, how skills and commands work under the
hood, installation in Claude Cowork and Claude Code, which plugins to install for your role,
and three end-to-end worked examples — from raw idea to red-teamed PRD.

---

## TL;DR — install in two minutes

**Claude Cowork (desktop app, recommended for non-developers):**

1. Open **Customize** (bottom-left) → **Browse plugins** → **Personal** → **+**
2. Choose **Add marketplace from GitHub**
3. Enter: `phuryn/pm-skills`

All nine plugins install automatically, providing both slash commands and auto-loading skills.

**Claude Code (CLI or desktop app):**

```bash
# 1. Register the marketplace once
claude plugin marketplace add phuryn/pm-skills

# 2. Install the plugins you need (full list below — you probably don't need all nine)
claude plugin install pm-product-discovery@pm-skills
claude plugin install pm-execution@pm-skills
claude plugin install pm-product-strategy@pm-skills
```

Then start a new session and type `/` — the PM commands (`/discover`, `/write-prd`,
`/strategy`, …) appear in the autocomplete. Or just describe your problem in plain language
and the relevant skill loads automatically.

The rest of this tutorial explains what you just installed and how to get real work out of it.

---

## What PM Skills actually is (and is not)

**The repo:** [github.com/phuryn/pm-skills](https://github.com/phuryn/pm-skills) — MIT
license, ~24k stars, active development (v2.1.0 as of July 2026). It is a **Claude plugin
marketplace**: a Git repository that Claude Code and Claude Cowork can subscribe to, exposing
a catalog of installable plugins.

**What it is not:** an app, an API, or an agent you run separately. There is nothing to
deploy. The plugins are folders of markdown instructions that Claude reads — the "AI
Operating System for Better Product Decisions" framing means *methodology as configuration*,
not new software.

Four terms to keep straight:

| Concept | What it is | How you use it |
|---|---|---|
| **Marketplace** | The `phuryn/pm-skills` repo itself — a catalog of 9 plugins | Add once: `claude plugin marketplace add phuryn/pm-skills` |
| **Plugin** | A themed bundle (e.g. `pm-execution`) of skills + commands | Install per bundle: `claude plugin install pm-execution@pm-skills` |
| **Skill** | One framework as a `SKILL.md` instruction file (e.g. `create-prd`) | Loads **automatically** when relevant; force with `/pm-execution:create-prd` |
| **Command** | A user-triggered workflow that **chains several skills** | Invoke explicitly: `/discover`, `/write-prd`, `/plan-launch` |

The mental model: *skills are the knowledge, commands are the workflows.* Mention "I need to
prioritize these feature requests" in conversation and the prioritization skill quietly loads.
Type `/discover` and Claude runs a fixed multi-skill discovery process from start to finish.

> New to Claude skills as a concept? Read
> [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) and the
> [Claude Agent Skills Playbook](../02-ai-agents/02-skills/claude-agent-skills.md) first —
> PM Skills is a large, well-executed instance of exactly that mechanism.

---

## How it works under the hood

### A skill is a framework in a file

Every skill is a folder with a `SKILL.md`: YAML frontmatter (name + a description Claude uses
to decide when to load it) followed by step-by-step instructions. Example — the `create-prd`
skill in `pm-execution`:

- **Description:** "Create a Product Requirements Document using a comprehensive 8-section
  template covering problem, objectives, segments, value propositions, solution, and release
  planning."
- **Process:** gather context from your files and web research → think through the problem
  space (What problem? For whom? How measured? What constraints?) → fill an 8-section
  template → save as `PRD-[product-name].md`.
- **Template sections:** Summary · Contacts · Background · Objective (with SMART OKR
  metrics) · Market Segment(s) · Value Proposition(s) · Solution · Release.
- **Style rule baked in:** "Write for a primary school graduate. Avoid jargon. Use clear,
  short sentences."

That is the whole trick: the skill doesn't make Claude smarter, it makes Claude *consistent* —
same structure, same questions, same output format, every time, for everyone on the team.

### A command is a pipeline of skills

Commands chain skills into an end-to-end process. Example — `/discover` in
`pm-product-discovery` runs a seven-step continuous-discovery workflow:

```text
/discover "AI-powered expense categorization for our SMB accounting app"

1. Context        → existing vs. new product? gather background from chat or files
2. Ideation       → brainstorm-ideas skill: 10+ ideas from multiple perspectives
3. Assumptions    → identify-assumptions skill: value / usability / feasibility /
                    viability / go-to-market risks
4. Prioritization → prioritize-assumptions skill: impact × evidence matrix,
                    find the "leap of faith" assumptions
5. Experiments    → brainstorm-experiments skill: 1–2 cheap tests per critical
                    assumption, with success criteria
6. Document       → compiles everything into a markdown discovery plan
7. Next steps     → suggests follow-on commands (/write-prd, /interview, /setup-metrics)
```

Step 7 matters more than it looks: every command ends by suggesting the next logical
command, so the workflows chain into a connected operating system rather than 42 isolated
scripts.

---

## Installation in detail

### Option A — Claude Cowork (no terminal required)

Cowork is the Claude desktop app's agentic workspace, and the marketplace is tagged
`claude-cowork-plugin` for a reason — this is the intended home for non-developer PMs:

1. Open Cowork and click **Customize** in the bottom-left.
2. Go to **Browse plugins** → **Personal** tab → **+**.
3. Select **Add marketplace from GitHub** and enter `phuryn/pm-skills`.
4. All 9 plugins install automatically.

Point Cowork at a folder with your product docs (see [the workspace section](#set-up-a-pm-workspace-folder)
below) and the skills can read your PRDs, transcripts, and feedback exports directly, and
save their outputs as files next to them. If you're unsure whether Cowork or Claude Code
fits you better, see [Claude AI vs Claude Code vs Claude Cowork](claude-ai-vs-code-vs-cowork.md).

### Option B — Claude Code (CLI, desktop app, IDE)

```bash
# Register the marketplace (once)
claude plugin marketplace add phuryn/pm-skills

# Install plugins individually — each is independent
claude plugin install pm-product-discovery@pm-skills
claude plugin install pm-product-strategy@pm-skills
claude plugin install pm-execution@pm-skills
claude plugin install pm-market-research@pm-skills
claude plugin install pm-data-analytics@pm-skills
claude plugin install pm-go-to-market@pm-skills
claude plugin install pm-marketing-growth@pm-skills
claude plugin install pm-toolkit@pm-skills
claude plugin install pm-ai-shipping@pm-skills
```

Verify with `/plugin` inside a session (lists installed plugins) and `/help` (shows the new
commands). Remove a bundle with `claude plugin uninstall pm-execution@pm-skills`.

### Don't install all nine blindly

Every installed plugin adds skill descriptions to Claude's context and commands to the
namespace. Nine plugins ≈ 68 skills is fine, but if you know your lane, a starter set keeps
things focused:

| Your situation | Install first | Add later |
|---|---|---|
| PM on an existing product | `pm-product-discovery`, `pm-execution` | `pm-data-analytics` |
| Founder / new product | `pm-product-strategy`, `pm-product-discovery` | `pm-go-to-market` |
| Growth / marketing-leaning PM | `pm-marketing-growth`, `pm-go-to-market` | `pm-market-research` |
| PM shipping AI-built features | `pm-execution`, `pm-ai-shipping` | `pm-product-discovery` |
| Job hunting / ops paperwork | `pm-toolkit` | — |

The same principle as with MCP servers applies: install what you use, uninstall what you
don't.

### Option C — other AI assistants (skills only)

The skills are plain markdown, so they port. OpenAI's Codex CLI supports the marketplace
directly (`codex plugin marketplace add phuryn/pm-skills`, then `codex plugin add
pm-execution@pm-skills`) — note Codex runs the *skills* but not `/slash` commands natively;
describe the workflow in plain language instead. For Gemini CLI, OpenCode, Cursor, or Kiro,
copy skill folders into the assistant's skills directory (`.gemini/skills/`,
`.opencode/skills/`, `.cursor/skills/`, `.kiro/skills/`).

---

## The nine plugins, mapped to the PM job

| Plugin | Skills | Commands | Covers |
|---|---|---|---|
| `pm-product-discovery` | 13 | 5 | Ideation, assumption testing, Opportunity Solution Trees, customer interviews, feature prioritization |
| `pm-product-strategy` | 12 | 5 | Vision, business models, Lean Canvas, pricing, SWOT, PESTLE, Porter's Five Forces, Ansoff |
| `pm-execution` | 16 | 11 | PRDs, OKRs, outcome roadmaps, sprints, retros, user/job stories, pre-mortems, red-teaming |
| `pm-market-research` | 7 | 3 | Personas, segmentation, journey maps, market sizing, competitor and sentiment analysis |
| `pm-data-analytics` | 3 | 3 | SQL query generation, cohort/retention curves, A/B test analysis |
| `pm-go-to-market` | 6 | 3 | GTM strategy, beachhead segments, ICPs, growth loops, competitive battlecards |
| `pm-marketing-growth` | 5 | 2 | Marketing ideas, positioning, value-prop statements, product naming, North Star metrics |
| `pm-toolkit` | 4 | 5 | Resume review & tailoring, NDA drafts, privacy policies, grammar checking |
| `pm-ai-shipping` | 2 | 5 | Shipping AI-built apps: docs, derived tests, static security & performance audits, intended-vs-implemented checks |

Highlights worth knowing about beyond the table:

- **`pm-product-discovery`** is the Teresa Torres wing: `opportunity-solution-tree`,
  `interview-script` / `summarize-interview`, and separate brainstorm/assumption skills for
  *existing* vs. *new* products (the framing questions genuinely differ).
- **`pm-execution`** is the largest plugin and the daily driver: `/write-prd`,
  `/plan-okrs`, `/transform-roadmap` (feature-list → outcome roadmap), `/pre-mortem`, and
  the standout `/red-team-prd` — a `strategy-red-team` skill that attacks your PRD, roadmap,
  or strategy doc looking for holes *before* your stakeholders do.
- **`pm-product-strategy`** encodes the classic MBA toolkit (SWOT, PESTLE, Porter,
  Ansoff, Lean Canvas, business model + monetization + pricing) so you get a structured
  `/market-scan` instead of a generic essay.
- **`pm-ai-shipping`** (new in 2.x) targets the vibe-coding era: you had Claude build a
  prototype, now `/ship-check`, `/document-app`, `/derive-tests`,
  `/security-audit-static`, and `/performance-audit-static` help a non-engineer PM ship it
  responsibly. Pairs naturally with the [Vibe Coding Tech Stack](../04-guides/vibe-coding-tech-stack.md)
  guide.
- **`pm-toolkit`** is the odd one out — career and paperwork utilities (`/tailor-resume`,
  `/draft-nda`, `/privacy-policy`, `/proofread`). Useful, but treat AI-drafted legal
  documents as first drafts for a lawyer, not final instruments.

---

## Which command do I run? (entry points)

The README's own quick-start map, extended into a decision table:

| Situation | Start with | Then typically |
|---|---|---|
| "I have a new idea" | `/discover` | `/write-prd`, `/interview` |
| "I need strategic clarity" | `/strategy` | `/business-model`, `/pricing` |
| "I have to write a PRD" | `/write-prd` | `/red-team-prd`, `/write-stories` |
| "We're planning a launch" | `/plan-launch` | `/battlecard`, `/market-product` |
| "We need metrics" | `/north-star` | `/setup-metrics`, `/write-query` |
| "The feature-request backlog is a mess" | `/triage-requests` | `/discover` on the winners |
| "Big meeting, lots of notes" | `/meeting-notes` | `/stakeholder-map` |
| "Interviews scheduled next week" | `/interview` | `summarize-interview` per session |
| "Quarterly planning" | `/plan-okrs` | `/transform-roadmap`, `/sprint` |
| "Claude built my prototype, now what?" | `/ship-check` | `/derive-tests`, `/security-audit-static` |

You never *have* to use commands — every underlying skill also triggers from natural
language. Commands are for when you want the full guided workflow; skills are for when you
want one framework applied inside an ongoing conversation.

---

## Three end-to-end walkthroughs

### Walkthrough 1 — from raw idea to red-teamed PRD

The flagship chain, using `pm-product-discovery` + `pm-execution`:

```text
1. /discover
   "Feature idea: automatic expense categorization for our SMB accounting
   product. Context files are in ./context/ — see product-overview.md and
   the last two quarters of feature requests in requests.csv."

   → Claude classifies it (existing product), brainstorms 10+ variants,
     surfaces assumptions ("SMBs trust auto-categorization enough to stop
     reviewing every transaction" — value risk), prioritizes them on an
     impact/evidence matrix, proposes experiments (fake-door test, Wizard-of-Oz
     categorization on 5 design partners), and writes discovery-plan.md.

2. /interview
   → generates a non-leading customer interview script targeting the top
     assumption. After each call, paste the transcript and ask for the
     summarize-interview skill → structured insights, quotes, disconfirming
     evidence.

3. /write-prd
   "Write the PRD for the winning concept from discovery-plan.md, informed
   by the interview summaries in ./interviews/."
   → 8-section PRD saved as PRD-auto-categorization.md, with SMART success
     metrics in the Objective section.

4. /red-team-prd
   → the strategy-red-team skill attacks the PRD: unvalidated assumptions,
     fuzzy metrics, missing non-goals, edge cases, stakeholder objections.
     Fix what it finds — this is the cheapest review you'll ever get.

5. /write-stories
   → converts the PRD into user stories / job stories with acceptance
     criteria, ready for the tracker.
```

Time cost: an afternoon. What you'd normally get from a week of scattered docs, but every
artifact is consistent and each step feeds the next.

### Walkthrough 2 — strategy day for a founder

Using `pm-product-strategy` + `pm-marketing-growth`:

```text
1. /strategy        → guided product strategy (vision, target market, moat)
2. /market-scan     → PESTLE + Porter's Five Forces on your segment
3. /business-model  → Lean Canvas / business model, monetization options
4. /value-proposition → customer jobs, pains, gains → value map
5. /pricing         → pricing strategy options with trade-offs
6. /north-star      → pick the North Star metric that ties it together
```

Run it in one session so each output builds on the previous. Save each artifact to a
`strategy/` folder as you go, then finish with the red-team skill pointed at the whole
folder: "Red-team this strategy as a skeptical investor."

### Walkthrough 3 — launch week

Using `pm-go-to-market` + `pm-marketing-growth` + `pm-market-research`:

```text
1. /research-users        → personas + segments for targeting
2. /plan-launch           → GTM strategy: beachhead segment, ICP, motions
3. /battlecard            → competitive battlecard for sales
4. /market-product        → positioning, value-prop statements, launch copy angles
5. /competitive-analysis  → verify claims against actual competitor features
```

---

## Set up a PM workspace folder

The skills read and write **files**, which is where this beats chat-based prompting. A layout
that works well (in Cowork, select this folder; in Claude Code, `cd` into it):

```text
product-workspace/
├── context/
│   ├── product-overview.md      # what the product is, for whom, current state
│   ├── strategy.md              # current strategy, OKRs
│   └── glossary.md              # internal terms Claude should use correctly
├── research/
│   ├── interviews/              # transcripts in, summaries out
│   └── feedback/                # support exports, NPS verbatims, requests.csv
├── prds/                        # /write-prd outputs land here
├── roadmaps/
└── CLAUDE.md                    # standing instructions (see below)
```

A minimal `CLAUDE.md` so every skill starts with your context instead of asking:

```markdown
# Product context
- Product: <name>, a <category> for <segment>.
- Read ./context/product-overview.md before any discovery or PRD work.
- Save PRDs to ./prds/, discovery plans to ./research/.
- Our metrics stack is Amplitude; SQL dialect is BigQuery.
```

That last line matters for `pm-data-analytics` — `/write-query` produces much better SQL
when it knows the dialect and your table names (paste a schema, or keep one in
`context/schema.md`).

Paweł Huryn's companion project **PM Brain** takes this idea further — a full
markdown-based "second brain" repo structure for PMs designed to pair with these skills.
Worth a look once the workspace habit sticks.

---

## Getting better output: five habits

1. **Feed real inputs.** The difference between a generic PRD and a useful one is the
   context you attach: feedback exports, interview transcripts, analytics screenshots,
   the old strategy doc. Skills explicitly look for files before asking questions.
2. **Answer the questions honestly.** These are *guided* workflows — the skill asks "What
   evidence do you have for this?" because the framework demands it. "None yet" is a
   valid, useful answer; it changes what the workflow recommends.
3. **Force-load when it matters.** If Claude is answering from general knowledge instead of
   the framework, invoke the skill explicitly: `/pm-execution:create-prd` or
   `/pm-product-discovery:opportunity-solution-tree`.
4. **Chain deliberately.** Accept the "next command" suggestions when they fit, but you own
   the sequence. `/red-team-prd` after every major artifact is the single highest-value
   habit in the whole marketplace.
5. **You are still the PM.** The skills encode frameworks, not judgment. Validate market
   sizes, check competitor claims, and never ship an AI-drafted NDA or privacy policy
   without legal review. The output is a strong first draft produced fast — that's the
   product, and it's plenty.

---

## Security and hygiene before you install

A plugin marketplace is instructions you invite into your agent, so apply the same habit as
with any third-party skill — see
[Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md).
For this repo specifically, the trust signals are good:

- **Everything is inspectable.** Each plugin is a folder of markdown in the open repo —
  read any `SKILL.md` on GitHub before installing. No binaries, no network calls baked in.
- **CI validation.** The repo ships `validate_plugins.py` and GitHub Actions tests that
  lint plugin structure; releases are tagged (v2.1.0 at the time of writing).
- **MIT license**, ~24k stars, an identifiable maintainer with a public track record, and
  a real `CONTRIBUTING.md` / `CHANGELOG.md`.
- Still: pin your expectations — marketplace updates change skill behavior. In Claude Code,
  `claude plugin marketplace update pm-skills` pulls updates *when you choose*, which is the
  right time to skim the changelog.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Commands don't appear after install | Start a **new** session/conversation — plugins load at session start. Check `/plugin` shows the bundle as installed |
| `/discover` etc. collides with another plugin's command | Use the namespaced form: `/pm-product-discovery:discover` |
| Skill doesn't trigger from natural language | Descriptions drive auto-loading; be explicit ("use the opportunity-solution-tree skill") or force with `/plugin:skill-name` |
| Claude answers generically, ignoring the framework | Same fix — force-load the skill; also check the right plugin is actually installed (skills live in specific bundles) |
| Output asks questions you already answered in files | Point at the files explicitly ("context is in ./context/product-overview.md") — and add a `CLAUDE.md` so it's standing instruction |
| Cowork can't see your documents | The skills read files from the folder you selected for the session — reselect the workspace folder |
| Marketplace add fails in Claude Code | Check the exact spelling `phuryn/pm-skills`; corporate networks may need proxy config for GitHub access |
| Codex runs skills but slash commands do nothing | Expected — Codex supports skills, not commands. Describe the workflow in prose |

---

## Key takeaways

1. **Methodology as configuration.** PM Skills is not an app — it's 68 proven PM frameworks
   packaged as Claude skills plus 42 commands that chain them into guided workflows, MIT
   licensed and fully inspectable.
2. **Skills load themselves; commands you invoke.** Mention a PM problem and the framework
   loads; type `/discover` or `/write-prd` for the full end-to-end process, with each
   command suggesting the next.
3. **Install by role, not wholesale.** Nine plugins exist so you can pick your lane —
   discovery + execution covers most working PMs; strategy + GTM covers founders.
4. **Files in, files out.** The step-change over chat prompting is a workspace folder:
   skills read your transcripts and feedback exports and write PRDs, discovery plans, and
   roadmaps as durable markdown artifacts.
5. **`/red-team-prd` is the killer feature.** An adversarial review of every major artifact,
   on demand, before any stakeholder sees it — the cheapest quality gate in product
   management.

---

## Related

- [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) — the
  `SKILL.md` mechanism PM Skills is built on.
- [Claude Agent Skills Playbook](../02-ai-agents/02-skills/claude-agent-skills.md) — writing
  and organizing your own skills.
- [Claude Code Plugins Tutorial](claude-code-plugins-tutorial.md) — the plugin/marketplace
  ecosystem beyond PM.
- [Claude AI vs Claude Code vs Claude Cowork](claude-ai-vs-code-vs-cowork.md) — choosing the
  right surface to run PM Skills in.
- [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md) —
  the audit habit for third-party skills and plugins.
- [Vibe Coding Tech Stack](../04-guides/vibe-coding-tech-stack.md) — pairs with the
  `pm-ai-shipping` plugin when PMs ship AI-built prototypes.

---

## Sources

- [Paweł Huryn – PM Skills Marketplace (GitHub, phuryn/pm-skills)](https://github.com/phuryn/pm-skills)
- [The Product Compass – PM Skills Marketplace: An AI Operating System for Better Product Decisions](https://www.productcompass.pm/p/pm-skills-marketplace-claude)
- [The Product Compass – PM Skills 2.0: Free Claude Skills for PMs (Red-Team + Ship)](https://www.productcompass.pm/p/pm-skills-2-red-team-ship)
- [The Product Compass – PM Brain OS: The Second Brain for Product Managers](https://www.productcompass.pm/p/pm-brain-os)
- [Claude Code docs – Plugins](https://code.claude.com/docs/en/plugins)
- [Claude Code docs – Agent Skills](https://code.claude.com/docs/en/skills)
