---
title: "PDCA Skill Improvement from Agent Sessions"
tags: ["agents", "skills", "pdca"]
last_updated: 2026-10-03
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

GitHub's changelog *Gain insights across your agent sessions with /chronicle* (2 June 2026) starts from one observation: every Copilot session you run (fixing a bug, reviewing code, building a feature) adds to a history that only you can query. `/chronicle` turns that history into *"standup summaries, personalized tips, and custom instructions that make Copilot work better for you over time."* That sentence is the idea behind this tutorial.

What the release changes:

| Change | Detail |
|---|---|
| **Wider session coverage** | Chronicle now sees sessions from **Copilot cloud agent, Copilot code review, the GitHub Copilot app, VS Code, and JetBrains**, not only the CLI. GitHub's stated goals: understand what you worked on, pick up context from earlier tasks, and turn session history into *"a practical source of guidance."* |
| **More entry points** | Chronicle insights are available from the GitHub Copilot app, github.com, VS Code, and JetBrains. Run `/chronicle` wherever you work, or just ask Copilot a question about your sessions. |
| **Local session sync** | Local sessions sync to your GitHub account and appear next to other agent sessions in the repository's **Agents** tab. Combined with Copilot's recently released remote control, this makes it easier to continue local work from another device. |
| **Admin opt-in** | **Copilot Business / Enterprise:** an administrator must enable local session syncing before you can use it. |
| **Private by default** | Sessions are private to you. To share a view-only copy, run `/share gist` in the CLI, or on github.com open **`...` → Sharing settings** at the top right of a session view. |

### `/chronicle` command reference

Typing `/chronicle` on its own opens a picker of subcommands. You can also add a free-form question or a focus area after any of them.

**Insight and analysis commands**

| Command | What it does | Scope / defaults | PDCA role |
|---|---|---|---|
| `/chronicle standup` | Builds a standup-style status report of recent work, grouped by completion status. Checks the current status of linked pull requests and links to them in Markdown. | Last **24 hours** by default; change it in plain language, e.g. `/chronicle standup for the last 3 days` | **Check** — what actually got done |
| `/chronicle tips` | Reviews your recent prompts, message patterns, and tool use, then gives **3–5** personalised, actionable tips (tools you rarely use, prompting patterns that work better, workflow changes). | Recent sessions. Add context to focus it, e.g. `/chronicle tips for test writing` | **Plan** — habits and gaps to target |
| `/chronicle cost-tips` | Analyses token spend: prompt length, tool-call frequency, continuation steps. Points out redundant instructions or skills loaded more than needed, and suggests savings such as running `/compact` manually. | Recent sessions | **Plan / Check** — the cost of your instructions and skills |
| `/chronicle search <keyword>` | Direct keyword search across all session content, for finding past explanations, implementations, or discussions. Example: `/chronicle search authentication` | All sessions | **Plan / Check** — collect evidence and examples |
| `/chronicle <question>` | Free-form question about your history: success rates, iteration patterns, cost, productivity timing, recalling past work | All sessions unless you add "in this repository" | **Plan / Check** — your own metrics |

**System and management commands**

| Command | What it does | Scope / defaults | PDCA role |
|---|---|---|---|
| `/chronicle improve` | Scans your history for places where Copilot misunderstood your intent or needed a lot of back-and-forth, then proposes **3–5** recommendations. Each names the problem and the instruction that would fix it. It **asks which ones to apply** before creating or updating `.github/copilot-instructions.md`. | Current repository / working directory only | **Do** — generate the change |
| `/chronicle reindex` | Rebuilds the local session store from your session history and syncs session data to your GitHub account | Local store | Housekeeping — run before a baseline if results look incomplete |

> **Note.** The `cost-tips` details about redundant instructions, extra skill loading, and `/compact` come from community write-ups. GitHub Docs lists prompt length, tool-call frequency, and continuation steps.

**Related session commands** (Copilot CLI, from the same Docs page)

| Command | Use |
|---|---|
| `copilot --continue` / `copilot --resume` | Resume the most recent session, or pick one from a list |
| `/resume`, `/session` | Switch to an earlier session; show the current session ID |
| `/rename NEW_NAME` | Give a session a name you can find later (useful for tagging PDCA cycles) |
| `/share gist`, `/share file [PATH]`, `/share html [PATH]` | Share a view-only copy or export a session, e.g. as evidence in a PR |
| `/session delete`, `/session delete-all` | Delete sessions you don't want kept or analysed |

### What `/chronicle improve` looks for

According to GitHub Docs, `improve` deep-dives your history for **friction signals**:

- repeated test failures,
- build errors that needed several attempts,
- user messages that **corrected or redirected** the agent,
- patterns that **recur across sessions**.

Two more signals appear in GitHub's own example output (§2): **turn count** (sessions with 20+ turns) and **`/undo` calls**. Both are useful baseline metrics.

`improve` is scoped to the **current repository**. `standup`, `tips`, `cost-tips`, `search`, and free-form questions cover **all** recorded sessions unless you narrow them. Keep this in mind when you compare a baseline with a later measurement.

Session data lives locally in `~/.copilot/session-state/` (session history) and `~/.copilot/session-store.db` (the store that Chronicle queries).

---

## 2. Worked example: the tips in GitHub's announcement

The announcement's hero screenshot shows the `/chronicle` subcommand picker (Standup, Search, Tips, Cost-tips, Improve) and a sample `/chronicle tips` output. Each tip already contains evidence, a proposed change, and in most cases a metric, which is what a PDCA *Plan* needs:

| # | Tip | Evidence | Where the fix goes | Check metric |
|---|---|---|---|---|
| 1 | *You're under-using subagents* | In 9 sessions this month you searched one part of the codebase, then the other, by hand (partly hidden in the screenshot) | Your workflow / a custom agent that delegates the exploration | Sessions with sequential manual searches |
| 2 | *Your custom instructions are missing a convention* | You explained the team's error-handling convention (`Result<T, AppError>` with domain-specific variants) in **7 separate sessions**, across the CLI, desktop chats, and cloud agent issue descriptions | `.github/copilot-instructions.md`, added once and then applied in CLI sessions, desktop chats, cloud agent PRs, **and** Code Review | Times you re-explain the convention → 0 |
| 3 | *Use `/plan` before migration tasks* | Your longest sessions (20+ turns) are all schema migrations: you start editing, hit cascading type errors, backtrack, and try again. The `add-team-billing` session took **23 turns with two `/undo` calls** | A migration **skill** that starts with a plan: schema → types → service layer → handlers → tests | Turns per migration session; `/undo` count. GitHub: sessions that start with a plan finish **3× faster** on average |
| 4 | *You're doing review work Code Review already handles* | In 6 PRs you spent 10+ minutes in the CLI checking null guards, unused imports, and inconsistent error responses, which Code Review then flagged on its own | Drop that step from your workflow; leave mechanical checks to Code Review | Manual-review minutes per PR |
| 5 | *Use `#` issue references to auto-scope implementation work* | (cut off in the screenshot) | Your prompting habit | Corrections caused by unclear scope |

Takeaways for your own cycles:

- **Not every fix is an instruction.** Only tip 2 changes `copilot-instructions.md`. Tip 3 calls for a skill, tips 1 and 4 change how work is split between agents and tools, and tip 5 changes how *you* prompt. Use the routing table in §4 to decide.
- **Repeated explanations are the strongest signal.** If you typed the same convention 7 times, the instruction file is missing it.
- **Turn count and `/undo` are objective.** Prefer them over impressions when you set the baseline.

---

## 3. Why this is a PDCA loop

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

## 4. The cycle, step by step

### PLAN — find the friction and pick one target

1. Get the broad picture (run `reindex` first if sessions from other tools seem to be missing):

   ```text
   /chronicle reindex
   /chronicle tips
   /chronicle cost-tips
   /chronicle improve      # review the proposals; don't apply any yet
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

- When `improve` asks which recommendations to apply, choose only the one(s) for this cycle.
- Optionally `/rename` the sessions that test the change (e.g. `pdca-3-release`) so you can find them again with `/resume` in the Check step.
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

## 5. PDCA log template

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

## 6. Applying the loop without Chronicle

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

## 7. Guardrails

- **Privacy.** Sessions are private by default, but they contain code, paths, and sometimes secrets. Review a session before you share it, use view-only `/share gist` or *Sharing settings* links, and never paste raw transcripts into committed files.
- **Enterprise setup.** On Copilot Business/Enterprise, ask an admin to enable local session syncing. Without it, Chronicle only sees part of your history and your baseline will be wrong.
- **One change per cycle.** Batch edits make Check meaningless.
- **Prune as well as add.** Every cycle, ask `/chronicle` which instructions were *never* relevant — dead rules cost context and can mis-trigger skills.
- **Small samples lie.** Wait for enough sessions to compare; 2 vs 1 corrections is noise.
- **Scope matters.** `improve` is repo-scoped; free-form questions span all sessions unless you say "in this repository".
- **Humans in the loop.** `improve` proposes, you decide. Review its diff like any other PR.

---

## 8. Quick-start checklist

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
- [daninacan.com – 10 cool things you can do with GitHub Copilot CLI](https://daninacan.com/10-cool-things-you-can-do-with-github-copilot-cli/)
- [Stefano Demiliani – GitHub Copilot sessions: obtaining tips for better usage](https://demiliani.com/2026/06/23/github-copilot-sessions-obtaining-tips-for-better-usage/)
- [GitHub Blog – 5 tips for writing better custom instructions for Copilot](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/)
