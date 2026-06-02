---
title: "Codex TDD Workflow and Skills Guide"
tags: ["guides", "codex-agent", "testing", "skills"]
last_updated: "2026-05-21"
---

# Codex TDD Workflow and Skills Guide

## Intent
- Run reliable, reviewable Codex sessions by anchoring implementation to failing tests.
- Package recurring workflows as Codex Skills so every team member (and every agent) executes them the same way.

---

## Part 1 — Test-Driven Codex Workflow

### Why tests first
Without tests, Codex verifies its own work using internal judgment. A failing test is an unambiguous, machine-readable exit condition: Codex knows exactly when it is done, and so do you. The red-to-green cycle also gives you a safe rollback point — if Codex goes off-track, you revert to the committed failing-test checkpoint and try a tighter prompt.

### The four-step loop

```
1. Write failing test(s)   →   commit as checkpoint
2. Prompt Codex to implement   (do NOT let it modify tests)
3. Confirm green           →   review diff
4. Refactor if needed      →   re-run tests
```

#### Step 1 — Write and commit failing tests
Write the tests yourself (or ask Codex to write tests only, with no implementation). Confirm they all fail before any implementation starts.

```bash
# Confirm red
pytest tests/test_payments.py        # or: npm test, go test ./..., etc.
git add tests/
git commit -m "test: add failing tests for webhook retry logic"
```

The commit is your checkpoint. If the session goes wrong, `git checkout HEAD` returns you here.

#### Step 2 — Prompt Codex to implement
Use the standard context template and add an explicit constraint against test modification:

```text
Goal: Make all tests in tests/test_payments.py pass.
Scope: src/payments/webhooks.py — do NOT edit tests/.
Context: Tests were added in the previous commit; they cover retry back-off and idempotency key handling.
Constraints: Follow AGENTS.md style. No new dependencies without discussion.
Done when: pytest tests/test_payments.py exits 0, no test files modified.
Tools/Notes: Use pnpm, not npm. Run linter with ruff check src/.
```

The `Done when` line is the exit condition. Codex stops when it is satisfied, not when it runs out of ideas.

#### Step 3 — Confirm green and review
Before accepting the task:

```bash
pytest tests/test_payments.py        # must be green
git diff HEAD~1 -- tests/            # must show zero changes to test files
ruff check src/                      # linter clean
```

Review the diff as you would a human PR. If Codex quietly modified a test to make it pass, reject the session and tighten the `Scope` constraint.

#### Step 4 — Refactor with confidence
Because the tests are intact, you can ask Codex to clean up:

```text
Goal: Refactor the implementation in src/payments/webhooks.py for readability.
Scope: src/payments/webhooks.py only.
Done when: pytest tests/test_payments.py still exits 0 and the file is < 120 lines.
```

### Anti-patterns to avoid

| Anti-pattern | Why it hurts | Fix |
|---|---|---|
| No test checkpoint commit | No safe rollback point | Always commit before prompting for implementation |
| Letting Codex write tests and implementation together | Codex can write tests that match its own bugs | Separate the two steps |
| Vague `Done when` (e.g., "looks good") | Codex keeps iterating or stops too early | Use a runnable command as the exit condition |
| Skipping diff review on test files | Codex may modify assertions to make them pass | Always run `git diff HEAD~1 -- tests/` |

---

## Part 2 — Codex Skills

### What a Skill is
A Codex Skill packages a reusable workflow — instructions, resource references, and optional setup scripts — into a named unit that Codex loads on demand. Instead of re-explaining a recurring procedure in every prompt, you define it once and invoke it by name.

**Skills are ideal for:**
- Release checklists (tag, changelog, publish)
- Code review workflows (lint, test, summarise diff, post comment)
- Database migration sequences
- Recurring content generation pipelines (e.g., changelog → newsletter)

### Skill anatomy

```
~/.codex/skills/
└── <skill-name>/
    ├── skill.md          # Human-readable instructions Codex follows
    ├── setup.sh          # Optional: install deps, set env vars (runs once per session)
    └── resources/        # Optional: reference files, templates, schema examples
        └── template.md
```

`skill.md` is the core. Write it like a concise AGENTS.md section: what the skill does, step-by-step instructions, and what "done" looks like.

### Writing skill.md

```markdown
# Skill: webhook-release

## Purpose
Cut a release for the payments webhook service: bump version, update changelog, tag, push.

## Steps
1. Run `pytest` — abort if any test fails.
2. Bump the patch version in `pyproject.toml` using `bump2version patch`.
3. Update `CHANGELOG.md` — move items from **Unreleased** to the new version heading.
4. Commit: `chore(release): bump to <new-version>`.
5. Tag: `git tag v<new-version>`.
6. Push branch and tag: `git push && git push --tags`.

## Done when
- `git tag` lists the new version.
- `CHANGELOG.md` has no items under **Unreleased**.
- CI passes (check with `gh run watch`).

## Abort conditions
- Any test failure in step 1.
- `pyproject.toml` version already matches the target.
```

### Invoking a Skill

In the Codex chat interface, prefix the skill name with `/`:

```
/webhook-release
```

Or compose it with additional context:

```
/webhook-release — but skip the git push, I'll do that manually after review.
```

### Layering Skills with AGENTS.md

Register frequently-used skills in your project `AGENTS.md` so Codex knows they exist without being told:

```markdown
## Available Skills
- `/webhook-release` — cut a patch release for the payments service.
- `/pr-review` — lint, test, summarise diff, and post a review comment draft.
- `/changelog-to-newsletter` — convert the latest CHANGELOG section to a newsletter draft.
```

This turns Skills into a team API: new contributors see what's available, and Codex can suggest the right skill when a task matches.

### Sharing Skills across a team
Store shared skills in the repo under `.codex/skills/` and commit them. Each developer's local `~/.codex/skills/` holds personal overrides; the repo-level directory holds canonical team workflows.

```
repo-root/
└── .codex/
    └── skills/
        ├── pr-review/
        │   └── skill.md
        └── webhook-release/
            └── skill.md
```

Point Codex at the repo-level directory by adding to `~/.codex/config.toml`:

```toml
extra_skills_dirs = [".codex/skills"]
```

---

## Part 3 — Combining TDD and Skills

The TDD loop and Skills compose naturally. Define a skill that encodes your team's full red-green cycle so every developer runs it identically:

```markdown
# Skill: tdd-implement

## Purpose
Implement a feature using the TDD red-green-refactor loop.

## Pre-conditions
- Failing tests already written and committed.

## Steps
1. Read the most recent commit message to understand the feature under test.
2. Implement only in the `src/` files referenced by the failing tests.
3. Do NOT modify any file under `tests/`.
4. Run the test suite: `pytest` (or the command in AGENTS.md).
5. If green: run linter (`ruff check src/`), then summarise the diff.
6. If still red after 3 attempts: stop and report the blocker.

## Done when
- Test suite exits 0.
- No changes to `tests/` in the diff.
- Linter clean.
```

Invoke it after committing your failing tests:

```
/tdd-implement
```

---

## Quick-reference checklist

```
TDD loop
[ ] Write tests — confirm they fail
[ ] git commit tests as checkpoint
[ ] Prompt Codex with explicit Done when and no-test-edit constraint
[ ] Verify green: pytest / npm test / go test
[ ] Verify no test file changes: git diff HEAD~1 -- tests/
[ ] Linter clean
[ ] Review diff before accepting

Skills
[ ] Create skill.md with Purpose, Steps, Done when, Abort conditions
[ ] Add optional setup.sh for one-time deps
[ ] Register skill in AGENTS.md ## Available Skills section
[ ] Commit shared skills under .codex/skills/
[ ] Add extra_skills_dirs to config.toml
```

---

## References
- https://developers.openai.com/codex/learn/best-practices
- https://developers.openai.com/codex/skills
- https://developers.openai.com/codex/guides/agents-md
