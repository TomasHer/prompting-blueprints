# AGENTS.md — Prompting Blueprints

> Think of this file as a README for AI coding agents (e.g., ChatGPT Codex, Copilot Agent). It tells you what this repo is for, what you’re allowed to change, how to run checks, and how to open high‑quality pull requests.

---

## Project intent
Prompting Blueprints is an LLM prompt‑engineering playbook with reusable patterns, copy‑ready prompt packs, model‑specific tips (GPT‑5, Gemini), tool tactics (NotebookLM, Perplexity Comet, Microsoft Copilot Agents), applied use cases, and example evaluations.

**Primary goals**
- Maintain a clean library of **patterns**, **prompts**, **use‑cases**, **model guides**, **tool tactics**, and **evaluations**.
- Keep examples **copy‑pasteable** and outputs **structured**.
- Ship small, well‑scoped PRs that improve clarity, coverage, and quality.

**Non‑goals / boundaries**
- Don’t add private keys, credentials, or proprietary data.
- Don’t change repo licensing or author attribution.
- Don’t introduce heavyweight build steps or server code.

---

## Repository map (authoritative)
- `patterns/` — reusable prompting templates and catalog guides.
- `prompts/` — curated prompt packs (e.g., manager workflows, newsletter flows).
- `use-cases/` — scenario‑specific walkthroughs with inputs/outputs.
- `models/` — model nuances & quickstarts (e.g., `gpt-5/`, `gemini/`).
- `tools/` — tactics for NotebookLM, Perplexity Comet, Copilot Agents, etc.
- `evaluations/` — `promptfoo` examples/configs and assertions.
- `assets/` — images/social preview/etc.
- Root docs (e.g., `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CITATION.cff`).
- Site config: `mkdocs.yml` (site built via GitHub Pages workflow on `main`).

> If you add new content, prefer placing it under these folders. Avoid introducing new top‑level folders unless necessary.

---

## Local setup & commands
> Agents: use a clean ephemeral environment. Humans: run locally the same way.

### Prerequisites
- **Python 3.11+** (for MkDocs site work)
- **Node 18+** (for `promptfoo` CLI)

### Install
```bash
# MkDocs & theme
python -m pip install --upgrade pip
python -m pip install mkdocs mkdocs-material

# promptfoo (choose one)
# npm (preferred)
npm install -g promptfoo
# or: pnpm add -g promptfoo  # if pnpm preinstalled
```

### Common tasks
```bash
# Serve docs locally (auto-reload)
mkdocs serve

# Build docs
mkdocs build

# Run all promptfoo evaluations (convention)
promptfoo test -c "evaluations/**/*.yml"

# Lint Markdown (optional if you have mdformat installed)
python -m pip install mdformat
mdformat .
```

> Agents: If a command fails, print the full error and propose the minimal fix (e.g., add a missing `devDependencies` or pin a compatible version). Avoid changing `mkdocs.yml` unless you’re adding navigation entries for **new** docs.

---

## Style & content rules
**Writing style**
- Crisp, actionable, and skimmable. Prefer lists, tables, and short paragraphs.
- Defaults to **English**. If a section targets a locale, indicate it explicitly.
- Examples should be **copy‑ready**; show *inputs* and *expected outputs*.

**File naming**
- Use **kebab‑case** for files and directories (e.g., `role-constraints-format.md`).
- Prefer one concept per file. Keep files focused and < ~250 lines where possible.

**Patterns & prompts**
- When possible, include an **OUTPUT FORMAT** section (JSON or Markdown) to promote structure and evaluability.
- Add a short **Intent** line explaining when to use the pattern.

**Attribution & licensing**
- Code: MIT. Documentation & prompts: CC BY 4.0.
- Cite sources (URLs) in a final “References” block when adapting external ideas.

---

## Allowed changes (agents)
You **may**:
- Add or edit `.md` files in `patterns/`, `prompts/`, `use-cases/`, `models/`, `tools/`.
- Add or edit `evaluations/*.yml` and small helper assets.
- Tweak `mkdocs.yml` *only* to register new pages you add.
- Fix typos, broken links, headings, and anchors anywhere.

You **must not**:
- Modify `LICENSE` files, remove author credits, or change `CITATION.cff` identity.
- Add tracking, analytics, or external scripts.
- Commit large binaries (>10 MB) or non‑free assets.

---

## Branching, commits, and PRs
**Branch naming**
- `feat/<area>-<slug>` — new content/features (e.g., `feat/patterns-critique-loop`)
- `docs/<area>-<slug>` — documentation only
- `fix/<area>-<slug>` — fixes & refactors

**Conventional Commits**
- `feat: add critique loop pattern`
- `docs(models): expand GPT‑5 context window tips`
- `test(evaluations): add promptfoo checks for role+constraints`

**PR checklist (agents fill in)**
- [ ] Scope: one logical change; PR < ~400 lines diff where possible
- [ ] Linked issue or clear problem statement
- [ ] Screenshots (if docs nav changed) or sample outputs
- [ ] `mkdocs build` succeeds locally
- [ ] `promptfoo test` passes or failures explained + follow‑ups opened
- [ ] Updated `CHANGELOG.md` under **Unreleased** with a bullet summary

**Review & labels**
- Add labels: `area:patterns`, `area:prompts`, `area:use-cases`, `area:models`, `area:tools`, `area:evaluations`, `type:docs`, `type:feat`, `type:fix` (create if missing).

---

## Evaluations (promptfoo)
**Purpose**: ensure patterns and prompts produce stable, structured results.

**Conventions**
- Place configs under `evaluations/` (e.g., `evaluations/role-constraints.yml`).
- Prefer **assertions** for structure/content (e.g., JSON schema, keywords).
- Keep test inputs small and deterministic.

**Example skeleton**
```yaml
# evaluations/example.yml
prompts:
  - label: role+constraints summary
    prompt: |
      You are an exacting <ROLE>... (trimmed)
      OUTPUT FORMAT (JSON): { "summary": "<string>", ... }
providers:
  - id: openai:gpt-5
      # model/provider keys are not committed if they include secrets
      # prefer environment variables in local runs
assertions:
  - type: contain-json
    expected:
      keys: [summary, assumptions, confidence]
```

> Agents: If adding evaluations, keep providers generic. Do **not** commit secrets or paid API configs.

---

## Doc site (MkDocs)
- The site is built with **MkDocs Material**. Local preview with `mkdocs serve`.
- Only add to `mkdocs.yml` when you introduce **new pages**. Keep nav concise.
- Internal links: use relative paths. Prefer fenced code blocks for commands.

---

## Task recipes (agent playbooks)

### 1) Add a new **pattern**
1. Create `patterns/<kebab-name>.md` with: Intent, When to use, Pattern text, Output format, Example I/O.
2. Add a minimal `evaluations/<kebab-name>.yml` (optional but preferred).
3. Register page in `mkdocs.yml` if the docs site should surface it.
4. Open a PR with examples + evaluation summary.

### 2) Add a **prompt pack**
1. Create `prompts/<pack-name>/README.md` with an overview.
2. Add one file per prompt or a single file with clear headings and copy blocks.
3. Include “How to adapt” notes (variables, role, guardrails).
4. (Optional) Add `evaluations/<pack-name>.yml` with at least one assertion.

### 3) Expand a **model guide** (e.g., GPT‑5, Gemini)
1. Edit or add under `models/<model>/`.
2. Include: context length, output formatting tips, tool‑use nuances, pitfalls.
3. Provide 2–3 canonical examples with expected outputs.

### 4) Add a **tool tactic**
1. Add `tools/<tool>/<topic>.md` (e.g., `tools/perplexity/comet-checks.md`).
2. Cover: setup, prompt scaffolds, do/don’t, sample outputs.

### 5) Add an **applied use case**
1. Create `use-cases/<domain>-<task>.md` with: scenario, inputs, agent steps, outputs.
2. Keep it end‑to‑end but concise. Link back to the base pattern(s).

---

## Safety, privacy, and sourcing
- Never commit secrets. Redact or mock API keys.
- Prefer public, citable sources. Add a "References" section when relevant.
- If reproducing non‑original text, limit to short quotes and provide links.

---

## Asking for clarification (agents)
If requirements are ambiguous or a change risks breaking navigation, **pause and ask** by commenting in the PR:
- What is the intended audience and outcome?
- Should this be a new page or an edit to an existing one?
- Any constraints on length, tone, or examples?

---

## Owner & stewardship
- Default reviewer: **@TomasHer** (or project owner)
- Follow `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

---

## Quick self‑review (agents)
Before opening a PR, confirm:
- The change is **scoped**, **reversible**, and **well‑documented**.
- Docs build locally; evaluations pass (or failures are explained with follow‑ups).
- You updated navigation only if needed and kept it tidy.

---

## Backlog (editable by maintainers)
> Agents: don’t start these unless explicitly assigned in an issue.
- [ ] Add pattern: **Critique‑Refine Loop**
- [ ] Add prompt pack: **Research‑to‑Newsletter** refresh
- [ ] Expand `models/gpt-5/` guide with structured output recipes
- [ ] Add `evaluations/structure-validators.yml` for JSON shape checks

---

## Changelog policy
- Use `CHANGELOG.md` (Keep‑a‑Changelog style). Add entries under **Unreleased**.
- Summarize changes in one line per PR.