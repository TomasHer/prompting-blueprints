# Claude Code Project Structure Tutorial

This tutorial explains a practical repository layout for Claude Code projects so your team can scale context, automation, and reusable AI workflows without creating clutter.

## 1) Recommended Project Tree

```text
claude_code_project/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── architecture.md
│   ├── decisions/
│   └── runbooks/
├── .claude/
│   ├── settings.json
│   ├── hooks/
│   └── skills/
│       ├── code-review/
│       │   └── SKILL.md
│       ├── refactor/
│       │   └── SKILL.md
│       └── release/
│           └── SKILL.md
├── tools/
│   ├── scripts/
│   └── prompts/
└── src/
    ├── api/
    │   └── CLAUDE.md
    └── persistence/
        └── CLAUDE.md
```

## 2) Why this structure works

The layout is modular by design:
- **Shared AI memory at the root** (`CLAUDE.md`) for project-wide standards.
- **Scoped AI memory in modules** (`src/*/CLAUDE.md`) for local rules.
- **Reusable workflows** in `.claude/skills/`.
- **Automation guardrails** in `.claude/hooks/`.
- **Engineering documentation** in `docs/`.
- **Execution assets** (scripts + reusable prompts) in `tools/`.

This keeps AI context precise while still allowing strong team-level consistency.

## 3) Component-by-component walkthrough

### `CLAUDE.md` (root)
Use this as the source of truth for:
- coding conventions
- architecture constraints
- testing expectations
- repo-specific workflows

**Tip:** Keep this file focused. Put stable rules here, not temporary task notes.

### `.claude/skills/`
Store repeatable AI workflows as composable skills:
- `code-review/SKILL.md`
- `refactor/SKILL.md`
- `release/SKILL.md`

Each skill should define:
- when to use it
- required inputs
- expected outputs
- validation checklist

### `.claude/hooks/`
Hooks are great for:
- pre-flight checks
- formatting or lint gates
- policy enforcement
- reminders before risky operations

Think of hooks as lightweight automation guardrails for AI-assisted development.

### `docs/`
Use this to preserve human-readable engineering knowledge:
- `architecture.md` for system design
- `decisions/` for ADRs and tradeoffs
- `runbooks/` for operational procedures

This prevents core project rationale from living only in chat history.

### `tools/`
Split tooling into:
- `tools/scripts/` for task automation
- `tools/prompts/` for reusable prompt templates

Keeping prompts modular lets you iterate quickly and avoid bloated instructions.

### `src/` with local `CLAUDE.md`
Add localized context near each subsystem:
- `src/api/CLAUDE.md` for API-specific rules
- `src/persistence/CLAUDE.md` for data/storage conventions

This helps Claude apply the right rules in the right directory.

## 4) Getting started in 5 steps

1. **Clone and open the repo.**
2. **Configure `.claude/settings.json`.** Add baseline project defaults.
3. **Create a focused root `CLAUDE.md`.** Capture global constraints and standards.
4. **Add your first reusable skills.** Start with review + refactor + release.
5. **Build modules under `src/` with local context files as needed.**

## 5) Best practices checklist

- Keep `CLAUDE.md` minimal, explicit, and structured.
- Prefer reusable skills for repeated workflows.
- Add hooks for automation and safety checks.
- Record architecture decisions in `docs/decisions/`.
- Maintain modular boundaries between docs, tools, and source code.

## 6) Development tips

- Keep prompts modular and version-controlled.
- Avoid dumping excessive context; precision beats volume.
- Refine skills as the team repeats tasks.
- Update architecture docs whenever system boundaries change.
- Keep repository structure clean so humans and AI can navigate quickly.

## 7) Suggested first skill templates

If you are bootstrapping a new project, create these first:

- **Code Review Skill**
  - input: changed files or diff
  - output: findings by severity, plus fixes
- **Refactor Skill**
  - input: target module + constraints
  - output: staged refactor plan and low-risk edits
- **Release Skill**
  - input: release scope + version
  - output: checklist, notes, and verification steps

## Summary

A strong Claude Code project structure is not only about folders—it is about clean context boundaries, repeatable workflows, and documented decisions. This layout gives you a scalable foundation for AI-assisted software development.
