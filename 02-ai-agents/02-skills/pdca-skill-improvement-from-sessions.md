---
title: "PDCA Skill Improvement from Agent Sessions"
tags: ["agents", "skills", "pdca"]
last_updated: 2026-10-02
---

# PDCA Skill Improvement from Agent Sessions

## Intent

Use this tutorial to turn your **past agent chat sessions** into a repeatable improvement loop for custom instructions, skills, and custom agents. It takes GitHub's `/chronicle` release (June 2026) as the worked example and frames it as a **Plan → Do → Check → Act (PDCA)** cycle: mine friction from session history, change one artifact, measure whether the friction went away, then standardise or roll back.

**Use when**

- You have a skill, `AGENTS.md`, `copilot-instructions.md`, or custom agent that is "mostly fine" but you keep correcting the agent in the same ways.
- You have weeks of session history and no systematic way to learn from it.
- You want instruction changes to be **evidence-driven and reversible** instead of ad-hoc edits after a bad day.

Related: [Skills Testing and Iteration](./skills-testing-iteration.md) (pre-release validation) · [Evidence-Based Skill Design](./evidence-based-skill-design.md) (why distilled skills beat raw logs) · [Self-Evolving AI with Google ADK](./self-evolving-agents-google-adk.md) (fully automated variant).

---

## 1. What the article announced

GitHub's changelog *Gain insights across your agent sessions with /chronicle* (2 June 2026) extends `/chronicle` — first shipped in Copilot CLI — so it sees sessions across **Copilot cloud agent, Copilot code review, the GitHub Copilot app, VS Code, and JetBrains**. Local CLI sessions now sync to your GitHub account and appear in the repository's **Agents** tab. Sessions can be shared view-only (`/share gist` in the CLI, or *Sharing settings* on github.com).

The changelog's one-line pitch is the whole idea of this tutorial: `/chronicle` turns session history into *"standup summaries, personalized tips, and custom instructions that make Copilot work better for you over time."*

### `/chronicle` subcommands

| Subcommand | What it does | PDCA role |
|---|---|---|
| `/chronicle standup` | Report of recent work (default: last 24 h) | Check — what actually happened |
| `/chronicle tips` | 3–5 personalised tips from your usage patterns | Plan — habits to change |
| `/chronicle cost-tips` | Analyses token-spend patterns | Plan / Check — cost lens |
| `/chronicle search <terms>` | Keyword search across session content | Plan / Check — find evidence |
| `/chronicle improve` | Finds friction and proposes custom-instruction edits | Do — generate the change |
| `/chronicle reindex` | Rebuilds the local store and syncs | Housekeeping |
| `/chronicle <free-form question>` | Ask anything about your history | Plan / Check — targeted metrics |

### What `/chronicle improve` looks for

According to GitHub Docs, `improve` deep-dives your history for **friction signals**:

- repeated test failures,
- build errors that needed several attempts,
- user messages that **corrected or redirected** the agent,
- patterns that **recur across sessions**.

It returns **3–5 recommendations**, each naming the problem and the instruction that would fix it, targeted at `.github/copilot-instructions.md`. `improve` is scoped to the **current repository / working directory**; free-form questions span **all** recorded sessions unless you narrow them.

Session data lives locally in `~/.copilot/session-state/` and `~/.copilot/session-store.db`.

---

## 2. Why this is a PDCA loop

PDCA (Deming cycle) is a four-step continuous-improvement method: **Plan** a change from evidence, **Do** it at small scale, **Check** the result against the expectation, **Act** by standardising or abandoning it — then repeat. Chronicle supplies the two things most teams lack for agent tuning: a **measurement source** (session history) and a **change generator** (`improve`).

```text
        ┌──────────── PLAN ────────────┐
        │ mine friction from sessions  │
        │ pick ONE target + metric     │
        └──────────────┬───────────────┘
                       ▼
 ┌──── ACT ────┐              ┌──── DO ─────┐
 │ keep/revert │◀── CHECK ───▶│ one scoped  │
 │ promote     │  re-measure  │ edit, commit│
 └─────────────┘  same query  └─────────────┘
```

The rule that makes it PDCA rather than "tweak and hope": **ask the same measurement question before and after the change.**

---

## 3. The cycle, step by step

### PLAN — find the friction and pick one target

1. Get the broad picture:

   ```text
   /chronicle tips
   /chronicle improve
   ```

2. Turn vague tips into a **baseline metric** with a free-form question (copy-ready):

   ```text
   /chronicle Over the last 14 days in this repository, list every session where
   I corrected or redirected you. Group them by root cause (missing convention,
   wrong tool, wrong command, skipped verification, scope creep). For each group
   give: count, two example quotes from my messages, and which file would have
   prevented it (copilot-instructions.md, a skill, a custom agent, or a test/hook).
   ```

3. Route each friction cluster to the **right artifact** — not everything belongs in global instructions:

   | Friction pattern | Fix it in | Why |
   |---|---|---|
   | Same convention corrected in every session ("use pnpm", "tests live in `__tests__`") | Repo instructions (`copilot-instructions.md` / `AGENTS.md`) | Always-on, cheap, short rule |
   | Multi-step task fails mid-way (release, migration, DB seeding) | A **skill** (`SKILL.md` runbook) | Procedural anchor, loaded only when relevant |
   | Skill triggers on the wrong tasks, or not at all | The skill's **`description`** | Triggering is decided by the description |
   | Agent drifts out of role, uses tools it shouldn't | A **custom agent** profile (tools, scope, persona) | Constrains behaviour, not knowledge |
   | Repeated test/build retries for the same reason | A script, hook, or test the skill calls | Deterministic beats prose |
   | It's *your* prompting habit (vague asks, no acceptance criteria) | Your prompt templates, not the agent | `tips` targets the human too |

4. Write a one-line hypothesis and pick a single target for this cycle:

   > *If the `release` skill states "run `pnpm build` before `pnpm publish`", then corrections in release sessions drop from 5/2 weeks to ≤1.*

### DO — make one scoped, reviewable change

- Apply **at most one or two** of the 3–5 `improve` recommendations — otherwise you cannot attribute the result in Check.
- Rewrite the suggestion as a **rule + reason** (one line each), not a narrative. See [Evidence-Based Skill Design](./evidence-based-skill-design.md): distilled procedures beat pasted raw logs.
- Put the change where step 3 routed it. For skills/agents, adapt `improve` output with this prompt:

  ```text
  Here are friction findings from /chronicle improve and my baseline query:
  <paste findings>
  Target artifact: .github/skills/release/SKILL.md (pasted below).
  Propose a minimal diff: max 5 added lines, imperative steps, include the
  verification command. If a finding is better solved by a script or test,
  say so instead of adding prose. Do not touch the description unless a
  finding is about triggering.
  ```

- Commit it on its own with a message that names the cycle: `docs(skill-release): PDCA #3 – build before publish`.

### CHECK — re-measure with the same question

After a fixed window (e.g. 10 sessions or 1–2 weeks of normal work):

```text
/chronicle Since <commit date>, in this repository, how many times did I
correct you about <the friction>? Compare with the <N> corrections in the
14 days before. Quote any remaining cases and say whether the new rule
was followed, ignored, or not applicable.
```

Also check for regressions the new rule might have caused:

```text
/chronicle search <keyword from the new rule>
/chronicle standup          # did task completion/iterations change?
/chronicle cost-tips        # did the edit bloat context or token spend?
```

Record the result in the PDCA log (template below).

### ACT — standardise, adjust, or revert

| Outcome | Action |
|---|---|
| Friction gone, no regressions | Keep. Promote if useful elsewhere (org-level instructions, shared skill repo). Share an example session with `/share gist` in the PR. |
| Friction reduced, not gone | Keep, refine the wording, run another cycle on the same target. |
| No change | Revert. The rule was ignored or wrongly routed — revisit step 3 (maybe it needs a script, not prose). |
| New friction appeared | Revert or narrow scope (move from global instructions into a skill). |

Then start the next cycle with the **next-largest** friction cluster.

---

## 4. PDCA log template

Keep this next to the artifact (e.g. `.github/skills/release/CHANGELOG.md`) so every edit has evidence attached.

```markdown
## PDCA #3 — release skill — 2026-10-02
- **Plan:** 5 corrections / 14 days: "build before publish" (chronicle query, see below)
- **Hypothesis:** adding step 2 drops corrections to ≤1 per 14 days
- **Do:** commit abc1234 — +2 lines in SKILL.md "Steps"
- **Check (2026-10-16):** 0 corrections in 9 release sessions; cost-tips unchanged
- **Act:** keep; promoted to org skill repo (PR #42)
- **Next target:** changelog formatting (3 corrections)
```

---

## 5. Applying the loop without Chronicle

The pattern is tool-agnostic. Any agent that keeps transcripts can run it:

| Tool | Where history lives | "improve" equivalent |
|---|---|---|
| GitHub Copilot (CLI, VS Code, JetBrains, cloud agent, app) | `~/.copilot/session-state/`, synced to GitHub | `/chronicle improve` |
| Claude Code | JSONL transcripts under `~/.claude/projects/` | Ask Claude to analyse the transcripts with the prompt below |
| Any other agent | Exported chats / logs | Same prompt, pasted transcripts |

Copy-ready friction-mining prompt for exported transcripts:

```text
You are reviewing my past agent sessions to improve <ARTIFACT PATH>.
Read the transcripts in <PATH>. Find friction signals: (1) my messages that
correct or redirect you, (2) commands/tests retried more than twice,
(3) the same mistake in 2+ sessions, (4) skills that loaded but were
irrelevant, or were needed but did not load.

OUTPUT FORMAT (Markdown):
| # | Friction | Sessions (count) | Evidence quote | Fix location | Proposed rule (≤1 line) |
Then: "Top recommendation for this cycle" — exactly one, with the
baseline count I should re-measure next time.
Do not propose more than 5 rows. Do not paste raw logs into the rule.
```

---

## 6. Guardrails

- **Privacy.** Session history contains code, paths, and sometimes secrets. Review before sharing; prefer view-only `/share` links; never paste raw transcripts into committed files.
- **One change per cycle.** Batch edits make Check meaningless.
- **Prune as well as add.** Every cycle, ask `/chronicle` which instructions were *never* relevant — dead rules cost context and can mis-trigger skills.
- **Small samples lie.** Wait for enough sessions to compare; 2 vs 1 corrections is noise.
- **Scope matters.** `improve` is repo-scoped; free-form questions span all sessions unless you say "in this repository".
- **Humans in the loop.** `improve` proposes, you decide. Review its diff like any other PR.

---

## 7. Quick-start checklist

- [ ] Run `/chronicle tips` and `/chronicle improve` in the repo.
- [ ] Run the baseline friction query; save the counts.
- [ ] Route each cluster to instructions / skill / agent / script.
- [ ] Apply **one** change, commit with `PDCA #n`.
- [ ] After the window, run the **same** query; log the result.
- [ ] Keep, refine, or revert. Pick the next target.

---

## References

- [GitHub Changelog – Gain insights across your agent sessions with /chronicle (June 2026)](https://github.blog/changelog/2026-06-02-gain-insights-across-your-agent-sessions-with-chronicle/)
- [GitHub Docs – Using GitHub Copilot CLI session data (/chronicle)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle)
- [GitHub Blog – 5 tips for writing better custom instructions for Copilot](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/)
