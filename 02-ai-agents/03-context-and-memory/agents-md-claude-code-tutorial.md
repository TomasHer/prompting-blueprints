---
title: "AGENTS.md for Claude Code Tutorial"
tags: ["tools", "claude-code", "agents-md"]
last_updated: 2026-05-29
---

# AGENTS.md for Claude Code Tutorial

How to write an `AGENTS.md` operating manual for a brand-new repository and wire it up so **Claude Code** loads it automatically at the start of every session.

> *An `AGENTS.md` is not a README for humans. It is onboarding docs for your AI teammate — the rules, constraints, and workflows an agent cannot infer from the code alone.*

---

## Use When

You are starting a **new repository** and want any coding agent — Claude Code first, but also Codex, Copilot, or Cursor — to work inside it with consistent conventions, safe boundaries, and a known workflow. This guide shows how to author the file once and connect it to Claude Code as persistent memory.

If you instead want a deep dive on the file's internal design (scopes, the WHAT/WHY/HOW framework, the 5 rules), read [How to Design a CLAUDE.md That Actually Works](./claude-md-design-tutorial.md). This tutorial focuses on the **new-repo setup and the Claude Code connection**.

---

## 1. AGENTS.md vs. CLAUDE.md — what connects to what

These are the same *idea* with two different names:

| File | What it is | Who reads it |
| :--- | :--- | :--- |
| **`AGENTS.md`** | The open, tool-agnostic standard ([agents.md](https://agents.md)) for repo-level agent instructions. | Codex, Copilot, Cursor, and other agents. |
| **`CLAUDE.md`** | Claude Code's **native** memory file, loaded automatically at session start. | Claude Code. |

Claude Code loads `CLAUDE.md` by default — not `AGENTS.md`. So if you want a single `AGENTS.md` as your source of truth **and** want Claude Code to honour it, you have to connect the two. There are two reliable ways (covered in [Section 4](#4-connect-agentsmd-to-claude-code)):

1. **Symlink** `CLAUDE.md` → `AGENTS.md` (one file, two names).
2. **Import** `AGENTS.md` from inside a thin `CLAUDE.md` using an `@AGENTS.md` line.

> This very repository is a live example: it ships an [`agents.md`](https://github.com/TomasHer/prompting-blueprints/blob/main/agents.md) for cross-tool agents and uses `CLAUDE.md`-style conventions for Claude Code. You can study its `agents.md` as a real-world template.

---

## 2. Prerequisites — create the new repo

```bash
# 1. Create and enter your new project
mkdir my-project && cd my-project
git init

# 2. Install Claude Code (if you haven't)
npm i -g @anthropic-ai/claude-code

# 3. Launch it in the project root
claude
```

You will author `AGENTS.md` at the **repository root** so it covers the whole project. (Claude Code also supports folder-scoped files for modules with distinct rules — see [Section 6](#6-scope-it-global-project-folder).)

---

## 3. Write AGENTS.md — the WHAT / WHY / HOW framework

Don't start from a blank page. Run `/init` inside Claude Code first — it reads your actual project structure and scaffolds a baseline, which is faster and more accurate than guessing. Then **curate** that output into the structure below.

Structure the file around three questions ([source](./claude-md-design-tutorial.md)):

- **WHAT** — Give context: project purpose, tech stack & versions, repository map, key dependencies, environment variables.
- **WHY** — Set principles: architecture decisions, code style, naming conventions, anti-patterns to avoid, error-handling approach.
- **HOW** — Define workflows: build / test / lint commands, commit format, branch strategy, deploy & CI steps.

> The **WHY** section is the most commonly omitted and the most valuable — it is what prevents agent drift on a fresh codebase.

### Copy-ready starter template

```markdown
# AGENTS.md — <Project Name>

> Operating manual for AI coding agents (Claude Code, Codex, Copilot, Cursor).
> It explains the project's intent, the boundaries for automated changes,
> and the workflow expected for high-quality pull requests.

## TL;DR for agents
- One-line description of what this project is.
- The single most important rule (e.g. "Never touch the billing module without a linked issue").
- The command that MUST pass before any PR (e.g. `npm test && npm run lint`).

## 1. Project overview
- **Purpose**: what the project does and for whom.
- **Tech stack**: Next.js 14, TypeScript, Supabase, Tailwind.
- **Repository map**:
  | Path | Purpose |
  | --- | --- |
  | `src/components/` | React components |
  | `src/services/`   | Business logic |
  | `src/utils/`      | Shared helpers |
  | `tests/`          | Unit, integration, e2e |

## 2. Allowed vs. restricted changes
### You may
- Add/edit code under `src/` and tests under `tests/`.
- Fix typos, broken links, and obvious bugs.
### You must not
- Commit secrets, API keys, or `.env` files.
- Introduce new top-level directories without approval.
- Modify `LICENSE`, auth/billing config, or CI credentials.

## 3. Code style & conventions
- Variables: `camelCase`. Components: `PascalCase`. Files: `kebab-case`.
- App Router only — no `pages/` directory.
- All DB access via the Supabase client — never raw SQL.
- MUST validate all user input. MUST NOT log secrets.

## 4. Commands
- Build: `npm run build`
- Test:  `npm test -- --watch` (min 80% coverage for `utils/`)
- Lint:  `eslint . --fix`

## 5. Workflow & PR checklist
- Branch naming: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`.
- Conventional commits: `feat: add login form`.
- [ ] Change is focused (< ~400 lines diff).
- [ ] `npm test` and `npm run lint` pass.
- [ ] No secrets committed.

## 6. Safety & escalation
- Never commit secrets — use environment variables.
- When unsure about scope or architecture, pause and ask before acting.
```

---

## 4. Connect AGENTS.md to Claude Code

Pick **one** of these. Both make Claude Code load your `AGENTS.md` automatically.

### Option A — Symlink (single source of truth)

Best when you want exactly one file and zero duplication:

```bash
# From the repo root — CLAUDE.md becomes an alias for AGENTS.md
ln -s AGENTS.md CLAUDE.md
git add AGENTS.md CLAUDE.md
git commit -m "docs: add AGENTS.md and link CLAUDE.md to it"
```

Now editing `AGENTS.md` updates what Claude Code reads. Commit the symlink so teammates get it too. (On Windows, enable symlink support in Git or use Option B instead.)

### Option B — Import (thin CLAUDE.md)

Best when you want Claude-specific notes on top of the shared standard. Claude Code supports `@path` imports inside memory files:

```markdown
# CLAUDE.md

@AGENTS.md

## Claude Code specifics
- Prefer Plan Mode (Shift+Tab+Tab) for multi-file changes.
- Run /compact at ~70% context.
```

Claude Code expands the `@AGENTS.md` line into the full contents of your standard, then appends the Claude-only section.

### Verify the connection

```text
claude          # launch in the repo
/memory         # shows every memory file Claude Code loaded, in order
```

If `AGENTS.md` (or the `CLAUDE.md` that imports it) appears in the `/memory` list, the connection works.

---

## 5. Be specific — vague vs. precise

Claude Code follows instructions **literally**, so precision is the difference between an enforced rule and an ignored suggestion.

| Vague | Precise |
| :--- | :--- |
| ❌ "Write clean code" | ✅ "Use `camelCase` for variables, `PascalCase` for components" |
| ❌ "Test everything" | ✅ "`npm test -- --watch`, min 80% coverage for `utils/`" |
| ❌ "Follow security best practices" | ✅ "MUST NOT store card numbers; use Stripe token references only" |

For constraints that must never be violated, use RFC 2119 keywords (`MUST`, `SHOULD`, `MAY`). They signal severity and improve instruction-following compliance.

---

## 6. Scope it — global, project, folder

`AGENTS.md`/`CLAUDE.md` is a **hierarchy**, not one file. The last scope wins on conflicts:

| Scope | Path | Use for |
| :--- | :--- | :--- |
| **Global** | `~/.claude/CLAUDE.md` | Your personal defaults across every project. |
| **Project** | `./AGENTS.md` (+ linked `CLAUDE.md`) | Team-shared rules, checked into git. |
| **Folder** | `./src/api/AGENTS.md` | Module-level overrides (e.g. strict OpenAPI rules for the API). |

Add folder-level files only when a module genuinely differs from the rest of the project. Subfolder files **append** scoped context — they should not restate the root file.

---

## 7. Keep it lean — what to include vs. omit

Research from ETH Zurich ([arXiv 2602.11988](https://arxiv.org/abs/2602.11988)) found that **developer-written, minimal context files improve task success by ~+4 percentage points**, while bloated or LLM-generated files *reduce* success and raise inference costs by 19–23%. So:

| Include | Omit |
| :--- | :--- |
| Non-obvious build/test commands | General best practices the model already knows |
| Custom test flags & env setup | Anything already in the README |
| Architecture constraints to enforce | Content that duplicates `package.json` / config |
| Codebase-specific anti-patterns | LLM-generated boilerplate |

Rules of thumb:
- **Stay under ~500 lines** (aim for <200 at the start). Too long = ignored.
- **Reference, don't duplicate** — point to `package.json`, `tsconfig.json`, `.eslintrc` by path instead of pasting them.
- **Never paste an LLM-generated file as-is.** Curate it.
- **Use Hooks for 100% enforcement.** A memory file is followed ~70% of the time — it is guidance, not a guarantee. For absolute rules (no secrets in commits, always lint before push) use [Claude Code Hooks](./claude-code-project-structure-tutorial.md#6-configuring-hooks-and-mcp), which run deterministically.
- **Update it monthly.** It is a living document; prune stale rules as the project evolves.

---

## 8. Optional — layer a knowledge base on top

If your new project is research- or documentation-heavy, your `AGENTS.md` can double as the **schema** for an LLM-maintained knowledge wiki. In the [LLM Wiki pattern](../02-ai-agents/03-context-and-memory/ai-knowledge-base-tutorial.md), the schema file (`AGENTS.md` / `WIKI.md`) defines page types, naming conventions, cross-reference rules, and a contradiction protocol — turning Claude Code into a disciplined wiki maintainer that compounds knowledge across sessions instead of re-reading raw sources each time.

This is purely additive: keep the agent-operations sections above, and append a `## Wiki Schema` block when the project warrants it.

---

## Quick-start checklist

- [ ] `git init` the new repo and launch `claude` in its root.
- [ ] Run `/init` to scaffold a baseline from the actual code.
- [ ] Rewrite it into WHAT / WHY / HOW sections using the starter template.
- [ ] Replace vague instructions with precise, measurable rules (RFC 2119 where it matters).
- [ ] Connect to Claude Code via symlink (Option A) **or** `@AGENTS.md` import (Option B).
- [ ] Verify with `/memory` that the file is loaded.
- [ ] Trim under 500 lines; reference config files instead of duplicating them.
- [ ] Add Hooks for rules that must hold 100% of the time.
- [ ] Commit `AGENTS.md` (and the link/import) so teammates inherit it.
- [ ] Schedule a monthly review.

---

## Related Resources

- **[How to Design a CLAUDE.md That Actually Works](./claude-md-design-tutorial.md)** — The deep dive on scopes, WHAT/WHY/HOW, and the 5 rules.
- **[Claude Code Project Structure Tutorial](./claude-code-project-structure-tutorial.md)** — The 4-layer architecture, `.claude/` layout, Hooks, MCP, and skills.
- **[AI Knowledge Base for Agents: The LLM Wiki Pattern](../02-ai-agents/03-context-and-memory/ai-knowledge-base-tutorial.md)** — Use your schema file to maintain a compounding wiki.
- **[Agent Context Window Performance](../02-ai-agents/03-context-and-memory/agent-context-window-performance.md)** — Why context-file size and quality affect instruction following.
- **[Claude Code Cheatsheet Tutorial](./claude-code-cheatsheet-tutorial.md)** — `/init`, `/memory`, `/compact`, and friends.

## References

- agents.md — the open standard for agent instruction files: <https://agents.md>
- Claude Code quickstart: <https://code.claude.com/docs/en/quickstart>
- [arXiv 2602.11988 — Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988)
- [arXiv 2601.20404 — On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents](https://arxiv.org/abs/2601.20404)
</content>
</invoke>
