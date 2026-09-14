---
title: "GPT-6 Astra: Rethinking Skills, AGENTS.md, and Task Prompts"
tags: ["models", "openai-gpt", "skills", "agents-md"]
last_updated: "2026-09-14"
---

# GPT-6 Astra: Rethinking Skills, AGENTS.md, and Task Prompts

> "If you've been running coding agents for the last year, your skills, `AGENTS.md` files, and task prompts have accumulated handholding that a weaker model needed and a stronger one does not." — the core claim of OpenAI's *Rethinking skills and prompts for GPT-6 Astra* (Eric Provencher, Codex developer experience, September 2026)

## Intent
- Digest OpenAI's guidance on what changes for **skills**, **`AGENTS.md`**, and **task prompts** when you move a coding agent (Codex or any harness that reads the same files) to **GPT-6 Astra**.
- Turn the eight recommendations into an audit checklist, before/after rewrites, and copy-ready prompts you can run against your own repo today.

## Use when
- You are switching a Codex, Claude Code, or other agent setup from GPT-5.x (including GPT-5.6 Sol) to GPT-6 Astra and results got *worse* or the agent keeps stopping early.
- Your `AGENTS.md` has grown past a screen, or your skill catalogue fires on tasks it should ignore.
- You want a model-agnostic checklist for pruning instruction bloat — most of the advice transfers to Claude and Gemini agents as well.

---

## Why the old scaffolding now hurts

GPT-6 Astra shipped on 3 September 2026. OpenAI's post argues that instructions written to steer weaker models can now **degrade** Astra in four ways:

| Failure mode | What it looks like |
| --- | --- |
| **Consumes context** | Mandatory pre-reads and long skills fill the window and bring compaction closer. |
| **Triggers irrelevant skills** | Broad skill descriptions fire on adjacent work. |
| **Prompts redundant work** | "Run the tests after every change" makes the model re-run what it already runs on its own. |
| **Causes unnecessary pauses** | Rigid approval rules and conflicting guidance make a more *aligned* model stop and ask. |

Two model traits drive this. Astra is **more sensitive to instructions in contextual files** (skills, `AGENTS.md`): when sources disagree it may pause, change direction, or follow a rule you forgot you wrote. And Astra is **more tentative about stopping**: it may reach a first implementation and return for review while there is still work to do — earlier than GPT-5.6 Sol would.

The fix is not to add more instructions. It is to make authority explicit, tie guidance to specific tasks, and define what *done* means.

---

## The eight tips

### 1. Make skill triggers specific
Every skill's `name` and `description` are loaded into context so the model knows when to use it. Put the actual job near the beginning, keep the description as short as possible, and scope it to the **specific trigger, not the general category**.

```yaml
# Before — fires on anything that touches a database
description: Database helper. Use for schema design, queries, migrations,
  connection pooling, ORM setup, seeding, backups and performance tuning.

# After — fires only on the workflow it actually covers
description: Postgres schema migrations. Use when creating or modifying a
  migration file or checking its rollout. Not for queries or ORM setup.
```

### 2. Treat skills as routers, not textbooks
Reading a skill costs context and moves the session closer to compaction, and it can inject guidance that does not apply to the task. For skills with several workflows, keep the **root `SKILL.md` a minimal router** that points to supporting docs and scripts; the model loads the detailed instructions only when the task requires them.

```
skills/release/
  SKILL.md          # 20 lines: when to use, which sub-guide to open
  hotfix.md         # detailed steps for hotfix releases
  major.md          # detailed steps for major releases
  scripts/verify.sh # run instead of describing the checks in prose
```

### 3. Keep requirements, cut procedures
Preserve requirements, constraints, and **unusual project behaviour** the model cannot infer. Cut step-by-step sequencing it can work out itself: itinerary-style recipes that used to help can now block a valid approach the model would have found on its own.

### 4. Turn `AGENTS.md` into a table of contents
Separate **permanent rules** from **contextual guidance**, and strip anything that forces pre-reads or nags the model to do what it already does.

```markdown
# Before
Before every change, read ARCHITECTURE.md, DATABASE.md and DEPLOYMENT.md.
After every change: 1. run unit tests 2. run lint 3. run the full test suite.

# After
- Read `docs/database.md` before touching a schema or migration.
- Read `docs/deployment.md` before changing anything under `infra/`.
- Tests: `make test` (unit) and `make e2e` (needs the local stack running).
```

Astra works out what it needs to read; prompting it to read files before every edit burns context and slows work down. Pointing to docs still helps **when the pointer is conditional**.

### 5. Rewrite approval rules around a reviewable result
Astra asks for permission only after it has prepared a **concrete, reviewable result** (a diff, a plan, a staged deploy). Rules that make it pause at every step now stall work it could have finished. Where a workflow is known to be safe, grant it explicitly:

```markdown
The local test suite is safe to run. Run it, fix failures caused by the
requested change, and rerun the affected tests without asking for approval
at each step.
```

When an agent keeps pausing, **inspect the rules around it before adding another rule to force it forward**.

### 6. Define *done* before the task starts
Because Astra can stop early, the task prompt has to state the finish line. If the job includes getting the implementation running, inspecting the result, and fixing what fails, put that in the request.

```text
# Before
Fix the flaky retry logic in the payments webhook.

# After
Fix the flaky retry logic in services/payments/webhooks.
Done when: `make test-payments` passes three times in a row, the webhook
handles a simulated 429 without duplicate charges, and you have reviewed
the diff for leftover debug output. Keep going until all three hold.
```

### 7. Make instruction authority explicit
When the task prompt, `AGENTS.md`, and a skill contradict each other, Astra might stall, abort, or obey the wrong rule. The user's instruction in the session takes precedence over guidance in skills and external files, so say so where it matters, and delete obsolete or contradictory rules rather than layering new ones on top.

### 8. Specify output style — Astra defaults to long and formatted
OpenAI's model guidance notes that Astra tends toward detailed, formatted responses, so state prose style, structure, and verbosity when the default is wrong. OpenAI's own Codex instructions ship a **blocklist of "AI slop"** worth borrowing for any writing task:

- Words and phrases: *delve*, *foster*, *leverage*, *it's worth noting*, *importantly*, *genuinely*, "Bottom Line:" in conclusions.
- Structures: "Question? Answer.", "This isn't about X. It's about Y.", contrastive framing ("X, not Y") that introduces an alternative nobody asked about.
- Closers: "In short: …", "The simplest mental model is …".
- Invented hyphenated compounds such as "exact-head checks" or "editorial-row layouts", vague qualifiers, and canned transitions.
- Style asks: plain words, concrete examples, precise verbs, active voice; state what you *are* doing instead of what you won't do.

---

## Migration audit checklist

Run this once per repo when you switch models. Each row is a yes/no; a "no" is a line to delete or rewrite.

| Area | Check |
| --- | --- |
| **Skill files** | Does every description name a specific trigger, not a topic area? |
| | Is the root `SKILL.md` a router, with detail in sibling files or scripts? |
| | Does the body carry requirements and constraints rather than a step recipe? |
| **`AGENTS.md`** | Are pre-read rules conditional ("read X before Y") instead of blanket? |
| | Is every rule still true, and stated only once across all instruction files? |
| | Are test instructions limited to non-obvious commands and flags? |
| **Decision boundaries** | Are safe workflows explicitly pre-approved? |
| | Do approval rules ask for a reviewable result rather than a pause per step? |
| **Completion criteria** | Does the task prompt say what *done* means (run, inspect, fix)? |
| | Does it say to keep going until those criteria hold? |

---

## Copy-ready prompts

### Audit an existing setup

```text
You are reviewing this repository's agent instructions for GPT-6 Astra.
Read AGENTS.md and every SKILL.md under .agents/ and .codex/.
For each instruction, classify it as one of:
  (a) permanent requirement or constraint the model cannot infer — keep
  (b) contextual guidance — keep, but make the trigger conditional
  (c) procedure or habit the model performs on its own — delete
  (d) duplicate or contradiction of another instruction — delete or merge
Output a table with file, line, instruction, class, proposed rewrite.
Then propose a trimmed AGENTS.md (table-of-contents style) and one-line
descriptions for every skill, scoped to its specific trigger.
```

### Task prompt template with a finish line

```text
Goal: <what to ship>
Scope: <files to edit / files to avoid>
Context: <symptoms, logs, related PRs>
Constraints: <requirements the model cannot infer>
Done when: <runnable check + expected outcome>; <observable behaviour>;
           <review step>. Keep going until all of these hold.
Approvals: <workflows pre-approved for this task, e.g. local tests, lint>
```

---

## How this maps to the rest of the repo

Most of the advice is not Astra-specific; it lines up with the evidence already collected here.

| OpenAI tip | Same idea elsewhere in this repo |
| --- | --- |
| Specific triggers, skills as routers | [Evidence-Based Skill Design](../02-ai-agents/02-skills/evidence-based-skill-design.md) (Rule 5: gate by domain, then by trigger) and [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) (progressive disclosure) |
| Trim `AGENTS.md`, conditional pointers | [AGENTS.md for Claude Code Tutorial](../02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md) (keep it lean) and [Agent Context Window Performance](../02-ai-agents/03-context-and-memory/agent-context-window-performance.md) |
| Define *done*, pre-approve safe workflows | [Codex Agent Prompting Guide](../04-guides/codex-agent-prompting-guide.md) (prompt template) and [Codex TDD Workflow and Skills Guide](../04-guides/codex-tdd-and-skills.md) (`Done when` / `Abort conditions` sections) |
| Skills route to scripts | [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) |
| Output style and slop blocklist | [Writers Prompting Blueprints](../03-prompts-and-patterns/writers-prompting-blueprints.md) |

## Sourcing note
The tips, failure modes, and examples above are adapted from OpenAI's post and its coverage; the rewrites are this repo's illustrations of the guidance rather than examples copied from the post. The slop-word list and output-style notes come from OpenAI's model guidance page and the Codex writing-style instructions as reported by The Decoder.

## References
- OpenAI Developers — Rethinking skills and prompts for GPT-6 Astra (Eric Provencher): <https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra>
- OpenAI Developers on X — announcement of the post: <https://x.com/OpenAIDevs/status/2098480213244117065>
- Eric Provencher on X — article version of the post: <https://x.com/pvncher/article/2095991462416490862>
- OpenAI — Model guidance (latest model: GPT-6 Astra): <https://developers.openai.com/api/docs/guides/latest-model>
- OpenAI — GPT-6 Astra: A new generation of intelligence: <https://openai.com/index/gpt-6-astra/>
- OpenAI Codex — AGENTS.md guide: <https://developers.openai.com/codex/guides/agents-md>
- OpenAI Codex — Skills: <https://developers.openai.com/codex/skills>
- The Decoder — GPT-6 Astra needs leaner prompts and fewer guardrails, OpenAI recommends: <https://the-decoder.com/gpt-6-astra-needs-leaner-prompts-and-fewer-guardrails-openai-recommends/>
- The Decoder — OpenAI shares prompting tips for GPT-6 Astra including a blocklist of slop words: <https://the-decoder.com/openai-shares-prompting-tips-for-gpt-6-astra-including-a-blocklist-of-slop-words/>
