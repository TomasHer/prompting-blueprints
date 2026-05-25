---
title: "How to Design a CLAUDE.md That Actually Works"
tags: ["tools", "claude-code"]
last_updated: "2026-05-25"
---

# How to Design a CLAUDE.md That Actually Works

The architecture behind your AI agent's memory — scopes, frameworks, and the rules that separate chaos from clarity.

> *"CLAUDE.md is not a README for humans. It's onboarding docs for your AI teammate."*

---

## Why CLAUDE.md Matters

CLAUDE.md is Claude Code's **persistent memory** — the one file that survives context compaction and is loaded automatically at the start of every session. Unlike a README written for human readers, CLAUDE.md is written for an AI teammate: it encodes the non-obvious rules, constraints, and workflows that Claude cannot infer from the codebase alone.

Research from ETH Zurich (arXiv 2602.11988) confirms that **developer-written, minimal context files improve task success rates by an average of +4 percentage points**, while bloated or LLM-generated files reduce success and raise inference costs by 19–23%. Design matters.

---

## 01 — The 3 Scopes

CLAUDE.md is not a single file — it is a hierarchy of files, each scoped to a different level:

| Scope | Path | Purpose |
|---|---|---|
| **Global** | `~/.claude/CLAUDE.md` | Personal defaults across all projects. Coding style, patterns, universal rules. |
| **Project** | `./CLAUDE.md` | Project-specific rules. Build commands, test setup, team conventions. |
| **Folder** | `./src/CLAUDE.md` | Module-level overrides. Scoped context for APIs, components, utils. |

Resolution order: **Global → Project → Folder** — the last scope wins on conflicts.

Use the global file for personal preferences that apply everywhere. Use the project file for team-shared conventions checked into git. Add folder-level files only when a module has genuinely different rules from the rest of the project (for example, a `src/api/CLAUDE.md` that enforces strict OpenAPI contract rules).

---

## 02 — The WHAT / WHY / HOW Framework

Structure your CLAUDE.md around three questions:

### WHAT — Give Context

What is this project and how is it built?

- Project name & purpose
- Tech stack & versions
- Repository structure map
- Key dependencies
- Environment variables

### WHY — Set Principles

Why are things done this way?

- Architecture decisions
- Code style & lint rules
- Naming conventions
- Anti-patterns to avoid
- Error handling approach

### HOW — Define Workflows

How does a developer (or agent) actually work on this project?

- Build: `npm run build`
- Test: `npm test`
- Lint: `eslint . --fix`
- Commit format
- Deploy & CI/CD steps

A complete CLAUDE.md answers all three questions. Most files only cover WHAT and HOW — the WHY section is the most commonly omitted and the most valuable for preventing agent drift.

---

## 03 — Example CLAUDE.md

```markdown
# Project: Pixels Connect

## Tech Stack
Next.js 14, Supabase, Tailwind CSS

## Build & Test
- Build: `npm run build`
- Test: `npm test -- --watch`

## Code Style
- Variables: camelCase
- Components: PascalCase
- Min 80% coverage for `utils/`

## Architecture Rules
- App Router only — no `pages/` directory
- Server Components by default
- All DB access via Supabase client, never raw SQL
```

---

## 04 — Be Specific: Vague vs Precise

Vague instructions produce inconsistent results. Claude Code follows instructions literally, so precision is the difference between enforced rules and ignored suggestions.

| Vague | Precise |
|---|---|
| ❌ "Write clean code" | ✅ "Use camelCase for variables, PascalCase for components" |
| ❌ "Test everything" | ✅ "`npm test -- --watch`, min 80% coverage for `utils/`" |
| ❌ "Follow security best practices" | ✅ "MUST NOT store card numbers; use Stripe token references only" |
| ❌ "Use a database" | ✅ "MUST use PostgreSQL for all persistent state" |

For architecture constraints that must never be violated, use RFC 2119 keywords (`MUST`, `SHOULD`, `MAY`). These signal the severity of each rule to the agent and have a track record of improving compliance in instruction-following tasks.

---

## 05 — 5 Rules That Make It Work

### 1. Run `/init` First

Let Claude scaffold the baseline from the existing codebase, then curate the result. Starting from `/init` output is faster and more accurate than writing from scratch — Claude reads your actual project structure rather than guessing.

### 2. Stay Under 500 Lines

Too long = ignored content. Research confirms that shorter, more targeted files correlate with better agent performance. Keep the file focused: if a section applies only to one module, move it to a folder-level CLAUDE.md instead.

### 3. Use Hooks for 100% Enforcement

CLAUDE.md instructions are followed approximately 70% of the time — they are guidance, not guarantees. For rules that must be absolute (no secrets in commits, always run lint before push), use Claude Code Hooks. Hooks execute deterministically and cannot be reasoned around.

### 4. Update It Monthly

CLAUDE.md is a living document. Evolve it as your architecture changes. Schedule a monthly review to remove stale rules, add newly discovered conventions, and update build commands when tooling changes.

### 5. Reference Files, Don't Duplicate

Point to `package.json`, `tsconfig.json`, `.eslintrc` — don't copy their contents into CLAUDE.md. Duplication creates drift: when the source file changes, CLAUDE.md becomes stale and gives Claude contradictory information.

---

## What to Include vs. Omit

Based on ETH Zurich research (arXiv 2602.11988), agent performance improves when CLAUDE.md contains only information Claude cannot infer from the codebase itself.

| Include | Omit |
|---|---|
| Non-obvious build or test commands | General best practices the model already knows |
| Custom test invocation flags | Information already present in the README |
| Non-standard environment setup | Content that duplicates `package.json` or config files |
| Architecture constraints that must be enforced | Generic style advice (use precise rules instead) |
| Anti-patterns specific to this codebase | LLM-generated boilerplate |

**Never use LLM-generated CLAUDE.md files as-is.** They restate README content, inflate inference costs by 19–23%, and reduce task success rates by 2–3 percentage points on average.

---

## Reference Implementation: `multica-ai/andrej-karpathy-skills`

If you want a baseline `CLAUDE.md` that is already proven in production, copy the ~65-line file from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (≈154k stars). It encodes four behavioural rules — Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution — derived from Andrej Karpathy's public observations about LLM coding pitfalls. Reported AI coding accuracy gains: **65% → 94%** when added to a project (figure cited in news coverage of the project; exact numbers depend on task mix and model).

Use it as the WHY layer of the WHAT / WHY / HOW framework above, then add your project-specific WHAT and HOW on top. See the [12 Rules for AI Coding Tools guide](../04-guides/ai-coding-rules-senior-engineers.md#real-world-implementation-multica-aiandrej-karpathy-skills) for a side-by-side mapping and adoption steps.

---

## Quick-Start Checklist

- [ ] Run `/init` to generate a baseline from the existing codebase
- [ ] Trim to under 500 lines, removing anything inferable from the code
- [ ] Structure content using the WHAT / WHY / HOW sections
- [ ] Replace vague instructions with precise, measurable rules
- [ ] Add folder-level CLAUDE.md files for modules with distinct rules
- [ ] Use Claude Code Hooks for rules that must be enforced 100% of the time
- [ ] Reference config files by path rather than duplicating their contents
- [ ] Schedule a monthly review as part of your team's development process

---

## Related Resources

- **[Claude Code Project Structure Tutorial](./claude-code-project-structure-tutorial.md)** — Memory hierarchy, skill structure, and the 4-layer architecture.
- **[Claude Code Cheat Sheet v2.81](./claude-code-cheatsheet-v2.md)** — Quick reference for `/init`, `/memory`, and all CLAUDE.md-related commands.
- **[Spec-Driven Development Tutorial](./spec-driven-development-tutorial.md)** — Using CLAUDE.md as a lightweight spec with RFC 2119 keywords.
- **[Agent Context Window Performance](../02-ai-agents/03-context-and-memory/agent-context-window-performance.md)** — Research-backed guidance on why context file size and quality matter.
- **[Claude Code Certification Guide](./claude-code-certification-guide.md)** — Exam preparation covering CLAUDE.md hierarchies and path-specific overrides.

## References

- [arXiv 2602.11988 — Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988)
- Brij Kishore Pandey — Claude Code Architecture Guide: How to Design a CLAUDE.md That Actually Works (2026)
- Claude Code documentation: <https://docs.anthropic.com/en/docs/claude-code/overview>
