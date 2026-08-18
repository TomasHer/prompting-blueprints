---
title: "Prompt Master: A Claude Skill That Writes Your Prompts"
tags: ["tools", "skills", "prompt-engineering", "claude"]
last_updated: "2026-08-18"
---

# Prompt Master: A Claude Skill That Writes Your Prompts for Any AI Tool

> [Prompt Master](https://github.com/nidhinjs/prompt-master) is an MIT-licensed Claude skill by [nidhinjs](https://github.com/nidhinjs) that turns Claude into a dedicated prompt engineer: describe what you want and which AI tool it's for, and it returns one paste-ready, token-efficient prompt tuned to that tool's quirks. Its guiding philosophy, straight from the README: **"The best prompt is not the longest. It's the one where every word is load-bearing."** At the time of writing the repo sits at ~11.3k stars, version 1.7.0.

## Intent
- Explain what Prompt Master does and the re-prompting problem it attacks: *"Write vague prompt → get wrong output → re-prompt → get closer → re-prompt again → finally get what you wanted on attempt 4."*
- Walk through its pipeline: tool routing, nine-dimension intent extraction, template selection, anti-pattern checks, and the token-efficiency audit.
- Get it installed in claude.ai or Claude Code and show how to invoke it well.
- Position it against writing prompts by hand with this repo's blueprints and against the [OpenAI GPT-5 Prompt Optimizer](openai-gpt-5-prompt-optimizer.md).

## Use when
- You (or your team) burn credits iterating toward a prompt that should have worked on attempt one — especially on metered tools like Cursor, Midjourney, or API-billed models.
- You hop between many AI tools and don't want to memorize each one's prompt dialect (Midjourney parameter flags vs. Claude XML tags vs. reasoning-model minimalism).
- You want a working, widely-used example of a **single-purpose Claude skill done well** — a tight scope, hard rules, and reference files — to study before [building your own](../04-guides/claude-building-skills-guide.md).

## The problem: the re-prompting tax

Every vague prompt is paid for twice — once for the wrong output, and again (and again) for the retries. Prompt Master's premise is that most retries trace back to a handful of predictable omissions: no success criteria, no output shape, no scope boundary, missing context from earlier turns. Instead of teaching you a framework, it operationalizes the frameworks as a skill: Claude interrogates your request against a checklist, fills the gaps (asking you at most three questions), and emits a prompt engineered for the *specific* target tool.

The success metric in `SKILL.md` is refreshingly blunt: **"User pastes. It works. Zero re-prompts."**

## Installation

Two paths, per the README:

**claude.ai (recommended):** Download the repository as a ZIP, then upload it under **Sidebar → Customize → Skills → Upload a Skill**. The skill then activates automatically in any conversation where you ask for a prompt.

**Claude Code:** clone it straight into your personal skills directory:

```sh
mkdir -p ~/.claude/skills && \
git clone https://github.com/nidhinjs/prompt-master.git ~/.claude/skills/prompt-master
```

The skill folder is the standard shape described in [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md): a `SKILL.md` with name/description frontmatter and the core instructions, plus a `references/` directory (`templates.md`, `patterns.md`) that Claude loads only when needed — progressive disclosure keeping the always-loaded core small.

As with any third-party skill, skim `SKILL.md` before installing so you know exactly what instructions you're handing Claude — the same install hygiene applies as for [marketplace plugins](pm-skills-marketplace-tutorial.md).

## Usage

Invoke it naturally — the skill's description makes it trigger on prompt-writing requests:

```text
Write me a prompt for Cursor to refactor my auth module
```

```text
Fix this Midjourney prompt — I keep getting cluttered backgrounds
```

Or explicitly in Claude Code:

```text
/prompt-master a prompt for o3 to analyze this quarter's churn data
```

Scoping is deliberate: it *"activates only when the user explicitly asks to write, fix, improve, or adapt a prompt"* — for anything else, Claude behaves normally. That single-trigger design is a big part of why it works reliably (compare the description-writing guidance in [Skills Design Patterns](../02-ai-agents/02-skills/skills-design-patterns.md)).

## How the pipeline works

Under the hood, every request runs through six stages:

1. **Tool detection and routing** — identify the target AI system and load its profile. Hard rule #1: *confirm the target tool first; ask if ambiguous, do not guess.*
2. **Intent extraction across nine dimensions** — see the table below.
3. **Clarify** — at most **three** questions, and only for critical gaps; otherwise proceed.
4. **Template selection** — pick the right prompt architecture automatically (you never see framework names, just the result).
5. **Anti-pattern and efficiency audit** — check the draft against the credit-killing patterns and strip every non-load-bearing word.
6. **Deliver** — one copyable prompt block, a one-line strategy note (`🎯 Target: [tool] | 💡 rationale`), and setup instructions only if genuinely needed.

### The nine intent dimensions

| Dimension | What it captures | When it's critical |
| :--- | :--- | :--- |
| Task | The specific operation (vague verbs replaced) | Always |
| Target tool | Which AI system runs the prompt | Always |
| Output format | Shape, length, structure | Always |
| Constraints | MUST / MUST NOT boundaries | Complex tasks |
| Input | What the user will provide | If applicable |
| Context | Domain, session history | If relevant |
| Audience | Who reads the output; technical level | User-facing output |
| Success criteria | A binary pass/fail definition | Complex tasks |
| Examples | Input/output pairs | Format-critical tasks |

This is essentially the [Role–Constraint–Format pattern](../03-prompts-and-patterns/role-constraint-format.md) generalized into a full extraction checklist — the difference is that the skill runs it *for* you on every request.

### The template library

`references/templates.md` catalogs 13 architectures the skill selects from, keyed to task type:

| Template | Structure | Chosen for |
| :--- | :--- | :--- |
| RTF | Role, Task, Format | Fast one-shot tasks |
| CO-STAR | Context, Objective, Style, Tone, Audience, Response | Business and professional writing |
| RISEN | Role, Instructions, Steps, End Goal, Narrowing | Multi-step sequenced projects |
| CRISPE | Capacity, Role, Insight, Statement, Personality, Experiment | Creative work with iteration |
| Chain of Thought | Explicit reasoning steps | Logic, math, debugging — on standard models only |
| Few-Shot | 2–5 formatted examples | Pattern replication, structured output |
| File-Scope | Path + function + boundaries | Cursor, Windsurf, Copilot edits |
| ReAct + Stop Conditions | Reasoning/action with pause points | Autonomous agents; prevents runaway loops |
| Visual Descriptor | Subject → style → mood → parameters | Midjourney, DALL-E, Stable Diffusion, Sora |
| Reference Image Editing | Change-only specification | Editing existing images |
| ComfyUI | Model-aware syntax | Checkpoint-specific node workflows |
| Prompt Decompiler | Analyze / adapt / simplify / split | Reworking existing prompts |
| Opus Task Brief | Front-loaded full specification | Complex agentic tasks on Claude Opus |

Many of these overlap with the classic frameworks in this repo's [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md) — the value here is automated *selection*, not novelty.

## Tool routing: one prompt dialect per tool

The most practically useful part of the skill is its per-tool profiles — 30+ systems spanning reasoning LLMs, code editors, image/video generators, and automation platforms (Zapier, Make). Highlights from `SKILL.md`:

- **Claude:** explicit and literal; front-load intent, scope, constraints, and acceptance criteria in one turn. Use natural-language depth cues ("think carefully") rather than hardcoded thinking budgets.
- **Reasoning-native models (o3, o4-mini, DeepSeek-R1, Qwen3 thinking):** *short, clean instructions only.* State the goal and format; the model reasons internally.
- **GPT-5.x / ChatGPT:** compact structured output contracts — format, length, explicit "done" criteria.
- **Gemini:** lean on the large context and multimodality, and add citation guardrails: *"Cite only sources you are certain of; say [uncertain] if in doubt."*
- **Claude Code / Cursor / Windsurf / Cline:** file path + function name + current behavior + desired change + do-not-touch list, with `Done when:` criteria and stop conditions before destructive actions.
- **Midjourney:** comma-separated descriptors — subject first, then style, mood, lighting, composition — ending in parameters (`--ar 16:9 --v 6 --style raw`), negatives via `--no`.
- **Bolt / v0 / Lovable:** scope down hard to prevent feature bloat: stack, versions, component boundaries, and an explicit *"Do not add authentication, dark mode, or unlisted features."*

### The hard rules

Five non-negotiables govern every generation; two are worth internalizing even if you never install the skill:

1. **Never add Chain-of-Thought to reasoning-native models.** o3, o4-mini, DeepSeek-R1, and Qwen3 in thinking mode reason internally across thousands of tokens; bolting "think step by step" onto them degrades output. The diagnostic checklist is blunt: *"CoT on reasoning-native models → REMOVE IT."*
2. **Skip fabrication-prone techniques by default.** Tree of Thought, Graph of Thought, Mixture of Experts, and Universal Self-Consistency are excluded in single-prompt contexts unless you explicitly ask — the skill sticks to five safe techniques: role assignment, few-shot examples, XML tags, grounding anchors, and CoT (on standard models).

For prompts targeting agentic tools with real system access (Claude Code, Devin, Cursor, SWE-agent, …), the skill appends a standing warning to review scope locks, forbidden actions, and stop conditions before pasting — a small built-in guardrail against the failure modes cataloged in [AI Gone Wrong Incident Stories](../04-guides/ai-gone-wrong-stories.md).

## Credit-killing anti-patterns and the memory block

`references/patterns.md` catalogs **37 token-wasting anti-patterns across six categories** — task (vague verbs, bundled requests), context (missing prior decisions), format (no output shape), scope (unbounded edits), reasoning (CoT misuse), and agentic (no checkpoints, silent agents). Each has a concrete fix, e.g. *"help me with my code"* → *"Refactor `getUserData()` to use async/await and handle null returns,"* or scope locks like *"Fix only the login form validation in `src/auth.js`. Touch nothing else."*

The **memory block** is the skill's answer to multi-session drift. When a request references prior decisions, the generated prompt gets a carry-forward block:

```text
## Context (carry forward)
- Stack and tool decisions established
- Architecture choices locked
- Constraints from prior turns
- What was tried and failed
```

Placement is deliberate: in the **first 30% of the prompt**, to survive attention decay in long contexts. Before delivery, a six-point verification runs — tool matched, critical constraints front-loaded, strongest signal words used (MUST over should), no fabricated techniques, every sentence load-bearing, and *"Would this produce the right output on the first attempt?"*

## How it compares

| | **Prompt Master** | **OpenAI GPT-5 Prompt Optimizer** | **Hand-written from blueprints** |
| :--- | :--- | :--- | :--- |
| **Form** | Claude skill (claude.ai or Claude Code) | Web tool in the OpenAI Playground | You + this repo's patterns |
| **Targets** | 30+ tools across text, code, image, video, automation | OpenAI models | Anything |
| **Strength** | Per-tool routing, anti-pattern audit, memory blocks | Model-specific tuning from the model's maker | Full control; you learn the craft |
| **Cost** | Free, MIT | Free with OpenAI account | Your time |
| **Sweet spot** | Cross-tool daily driver inside Claude | Prompts that will run on GPT-5.x | Prompts you'll reuse and maintain long-term |

They compose: let Prompt Master draft, then sanity-check the result against the [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md) and keep the winners in your own blueprint library.

## Key takeaways

- **Prompt Master turns prompt engineering into a pipeline**: tool routing → nine-dimension intent extraction → max three clarifying questions → auto-selected template → anti-pattern and token audit → one paste-ready block. The metric is zero re-prompts.
- **Tool dialects are the real payload.** The same intent becomes a front-loaded task brief for Claude, a three-line instruction for o3, a file-scoped edit with stop conditions for Cursor, and a descriptor chain with `--ar`/`--no` flags for Midjourney — encoded once, applied automatically.
- **Its hard rules are portable wisdom**: never add CoT to reasoning-native models, avoid fabrication-prone techniques (ToT/GoT) in single prompts, put critical constraints in the first 30%, and define binary success criteria before sending anything.
- **The memory block pattern** — carrying locked decisions forward at the top of every prompt — is worth stealing for any long-running AI collaboration, skill or not.
- **It's also a model skill to study**: single trigger, hard rules, progressive-disclosure references, and a one-line success metric — a compact case study for the [skill-building guide](../04-guides/claude-building-skills-guide.md).

## References
- nidhinjs – [prompt-master (GitHub)](https://github.com/nidhinjs/prompt-master) (README and `SKILL.md` — the source for the pipeline, hard rules, tool profiles, and output format quoted here)
- nidhinjs – [prompt-master: templates reference (GitHub)](https://github.com/nidhinjs/prompt-master/blob/main/references/templates.md) (the 13 prompt architectures)
- nidhinjs – [prompt-master: credit-killing patterns reference (GitHub)](https://github.com/nidhinjs/prompt-master/blob/main/references/patterns.md) (37 anti-patterns in six categories)
- Related in this repo: [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) · [Claude Agent Skills Playbook](../02-ai-agents/02-skills/claude-agent-skills.md) · [Skills Design Patterns](../02-ai-agents/02-skills/skills-design-patterns.md) · [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) · [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md) · [Role–Constraint–Format](../03-prompts-and-patterns/role-constraint-format.md) · [OpenAI GPT-5 Prompt Optimizer](openai-gpt-5-prompt-optimizer.md) · [PM Skills Marketplace Tutorial](pm-skills-marketplace-tutorial.md)
