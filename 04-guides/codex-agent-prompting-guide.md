---
title: "Codex Agent Prompting Guide"
tags: ["guides", "codex-agent"]
last_updated: "2026-01-10"
---

# Codex Agent Prompting Guide

## Intent
- Give Codex requests that are fast to execute, easy to review, and grounded in the repo’s own instructions.
- Standardize how you seed Codex with context (prompts + AGENTS.md) so every run starts with the same guardrails.

## Quick prompting checklist
- Point to code directly: include file paths, symbols, stack traces, or snippets so Codex searches narrowly.
- Add verification steps: reproduction commands, linters/tests to run, and what “passing” looks like.
- Specify how to work: tools to prefer/avoid, logging expectations, escalation/approval rules, and PR format.
- Shrink the task: ask Codex to stage work into small steps (plan → edit → test → summarize).
- Default to debugging mode: paste failing logs first; invite hypotheses and fixes.
- Invite exploration: let Codex propose alternatives (cleanups, simplifications) after the main request is done.

## Codex-ready prompt template
Use this single message when kicking off a run. Swap placeholders with your task details.

```text
Goal: <what you want shipped>
Scope: <files/dirs to edit + files to avoid>
Context: <symptoms, logs, stack traces, upstream tickets, related PRs>
Constraints: <style guides, approvals, rollout rules, security limits>
Done when / Tests: <runnable command + expected outcome, e.g. "pytest exits 0, no test files modified">
Tools/Notes: <specific commands to prefer/avoid, feature flags, feature toggles>

Plan first, then execute. Narrate major decisions. Ask before risky actions.
OUTPUT FORMAT: Markdown with sections → Plan, Changes, Tests, Next steps.
```

### Example usage
- **User → Codex**: “Refactor the payments webhook retry logic. Scope: `services/payments/webhooks/*`. Avoid touching `services/payments/legacy/*`. Failing test: `make test-payments` reproduces flake `RetryableError`. Prefer `pnpm` over `npm`. Follow AGENTS.md guidance.”
- **Codex → User (expected)**: Shares a short plan, edits targeted files, runs `make test-payments`, reports results, and proposes any extra cleanups.

## Layering instructions with AGENTS.md
- **Global defaults** live in `~/.codex/AGENTS.md`; temporary overrides in `~/.codex/AGENTS.override.md`. Switch profiles with `CODEX_HOME=/path/to/.codex`.
- **Project guidance**: Codex walks from repo root to your current directory, loading at most one file per folder in this order: `AGENTS.override.md`, `AGENTS.md`, then any `project_doc_fallback_filenames` (e.g., `TEAM_GUIDE.md`, `.agents.md`).
- **Precedence**: Files nearer to your working directory override earlier guidance. Codex stops when combined instructions hit `project_doc_max_bytes` (32 KiB by default).

### Starter snippets
- `~/.codex/AGENTS.md`
  - Working agreements, default tool preferences, approval rules, logging expectations.
- `./AGENTS.md`
  - Repo onboarding: setup commands, required tests, code style, release checklist, observability links.
- `subdir/AGENTS.override.md`
  - Team-specific overrides: service-specific tests, forbidden commands, data-handling rules.

## Running tasks in parallel
Codex can handle multiple independent tasks simultaneously. When work items don't share files or state, submit them in separate sessions at the same time rather than sequentially.

- Open one Codex session per independent task (e.g., fix auth bug / add search endpoint / update docs).
- Each session gets its own branch; merge when both are green.
- Avoid parallel sessions on the same files — merge conflicts cost more than the time saved.
- Use a parent task to coordinate: "Run sessions A, B, and C in parallel; do D only after all three merge."

## Validation and troubleshooting
- Run `codex --ask-for-approval never "Summarize the current instructions."` from the repo root to confirm which files Codex loaded and in what order.
- If guidance is missing, check for higher-level `AGENTS.override.md` files or bump `project_doc_max_bytes`.
- Align fallback names via `~/.codex/config.toml` (e.g., add `project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]`), then relaunch Codex.

## References
- https://developers.openai.com/codex/prompting
- https://developers.openai.com/codex/guides/agents-md
- https://agents.md
- [Codex TDD Workflow and Skills Guide](./codex-tdd-and-skills.md)
