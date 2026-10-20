---
title: "Harness Improvement Loop for Copilot Agents"
tags: ["research", "github-copilot", "harness-engineering"]
last_updated: 2026-10-20
---

# Harness Improvement Loop for Copilot Agents

## Intent
Improve a GitHub Copilot agent's harness (instructions, tool guidance, agents, skills, hooks) in small, evidence-based rounds, without retraining a model and without a ground-truth answer key. The loop is a manual, Copilot-only adaptation of the **Propose–Probe–Compose** step and the experience library from Google Research's Harness² framework.

## Use when
- You have a working Copilot agent, such as the [Copilot Backlog Agent](./copilot-backlog-agent-blueprint.md), and want it to make fewer mistakes.
- You can't run Harness² itself: it drives only OpenCode or Codex agents and sends task data to the model provider you configure. This loop stays inside Copilot.
- The agent's tasks have no single correct answer, so you compare behaviour instead of scoring against expected outputs.

## How Harness² works, in one paragraph
Harness² treats everything around the model as editable components. For one task it **proposes** edits (some general, some specific to the task's domain), **probes** each edit by re-running the same task, then **composes** a refined harness from the behavioural differences between runs. It never sees the correct answer during this step. After each task it saves the adopted harness and an evidence-backed lesson in a per-domain **experience library**, which guides the next round. The authors report gains of up to 11.5 points on WorkBuddy-Bench from a single step.

## Before you start: make runs safe to repeat
The loop runs the same requests several times. Against a live ADO project that means duplicate items and repeated edits. Pick one:

| Option | Effort | Notes |
|---|---|---|
| **Plan-only mode** | Low | Create `.backlog-plan-only` so the guard hook from [Step 7 of the blueprint](./copilot-backlog-agent-blueprint.md) blocks writes. The change table becomes the output you compare. |
| **Sandbox project** | Medium | A copy of your process template with ~50 representative items. Reset it between rounds. |

Start with plan-only mode. Reads still hit your real backlog, so make sure that is allowed for the data involved.

## Setup (once)
Create this folder structure in the repo that holds your agent files:

```text
harness-loop/
  tasks.md              # 10-15 test requests, grouped by request type
  runs/<round>/<variant>/<task-id>.md   # saved transcripts
  LESSONS.md            # the experience library
```

`tasks.md` example:

```markdown
## triage
- T1: Triage this week's new bugs for the Mobile area.
- T2: Find stories in New without acceptance criteria and flag them.
## refinement
- R1: Split Epic #4100 into Features and User Stories.
- R2: Check Feature #4320 for missing child stories against its description.
## reporting
- P1: Summarise what changed in the current sprint since Monday.
```

Pick requests that represent real work and include at least one you know the agent currently gets wrong.

## The loop (one round)

### 1. Baseline
Run every task with the current harness in a fresh chat each time. Save each transcript (right-click the chat > Copy All, or export the chat) to `runs/r1/base/`. Note tool calls, errors, and the final change table.

### 2. Propose
Open a new chat in **Ask** mode, attach the harness files and baseline transcripts, and use this prompt:

```text
You are improving the harness of a Copilot agent. The harness files are attached:
copilot-instructions.md, backlog-context.md, ado-tools.instructions.md, the agent files, and skills.
Baseline transcripts are attached. There is no answer key; reason only from observed behaviour.

Propose exactly two harness edits:
A) GENERAL: an edit that would help on every request type.
B) DOMAIN: an edit for the request type "<triage | refinement | reporting>" only.

For each edit give:
- Evidence: the transcript lines that show the problem (quote them).
- Component: which file changes (c1-c8).
- Diff: the exact text to add, change, or remove.
- Prediction: what should look different in the next run.
Prefer removing or sharpening text over adding more. Do not mention tests or scoring.

Lessons from earlier rounds (may be empty):
<paste the matching sections of LESSONS.md>
```

### 3. Probe
Apply each edit on its own git branch (`loop/r1-general`, `loop/r1-domain`). Re-run the same tasks on each branch in fresh chats and save the transcripts to `runs/r1/general/` and `runs/r1/domain/`.

### 4. Compose
In a new Ask chat, attach all three transcript sets and the two diffs:

```text
Compare three runs of the same tasks: base, general edit, domain edit.
For each task, list the behavioural differences that matter:
wrong or missing fields, unnecessary tool calls, invented IDs, ignored conventions,
writes attempted without approval, clarity of the change table.

Then produce one composed harness:
- Keep an edit only where the transcripts show it helped and did not break another task.
- Merge kept edits into the minimal diff.
- Output the final diff and a decision note: for each edit, kept / dropped / merged, with the evidence.
```

Apply the composed diff on `main` through a normal pull request so the change is reviewed.

### 5. Record the lesson
Append the decision to `LESSONS.md`, grouped by request type. Each lesson needs a cue, the lesson, and the evidence (the three fields Harness² stores):

```markdown
## triage
### 2026-10-20 — round 1
- Cue: Bug titles mention a crash but repro steps are empty.
- Lesson: Check repro steps before duplicate detection; tag first, link second.
- Evidence: T1 base proposed linking #4915 as a duplicate of an item with no repro steps; domain edit avoided it.
```

Paste the matching section into the Propose prompt next round, as in Harness²'s per-domain library.

## Going deeper or wider
Harness² scales the loop in two ways; both work by hand too.

| Mode | What you do | When to use |
|---|---|---|
| **Wider (parallel)** | Ask for 2–3 general and 2–3 domain edits per round, probe them all, compose once | Early rounds, many obvious problems |
| **Deeper (sequential)** | Use the composed harness as the next round's baseline, repeat | Later rounds, fine-tuning one request type |

Stop when two rounds in a row produce no kept edit for a request type.

## Rules that keep the loop honest
- **Same tasks, fresh chats.** Old chat history leaks the previous harness into the next run.
- **One variable per probe.** Never probe two edits on one branch.
- **Evidence or it doesn't ship.** Every kept edit quotes a transcript line.
- **Prefer deleting.** A harness that only grows gets slower and less predictable.
- **Keep a holdout.** Leave 2–3 tasks out of the Propose step and run them only after composing, to catch edits that fit the test set too closely.

## Failure modes
- **Composing on noise.** One run per variant can differ by chance. Re-run a task once more when the difference between two runs is small.
- **The proposer games the tasks.** Edits that name a specific task or work item ID are overfitting; drop them.
- **Lessons go stale.** When `backlog-context.md` changes, review `LESSONS.md` for lessons that no longer apply.

## Related
- [Copilot Backlog Agent Blueprint (Azure DevOps MCP)](./copilot-backlog-agent-blueprint.md)
- [PDCA Skill Improvement from Agent Sessions](../02-ai-agents/02-skills/pdca-skill-improvement-from-sessions.md)
- [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md)

## References
- [Google Research – Harness²: Recursive Agent Harnessing for an Open World (GitHub)](https://github.com/google-research/harness2)
- [arXiv 2610.14224 — Harness²: Recursive Agent Harnessing for an Open World](https://arxiv.org/abs/2610.14224)
- [VS Code – Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
