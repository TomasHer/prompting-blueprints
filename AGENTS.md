# AGENTS.md — Prompting Blueprints

> This is the operating manual for AI coding agents (ChatGPT Codex, Copilot Agent, etc.). It explains the repo's intent, the
> boundaries for automated changes, and the workflow expected for high-quality pull requests.

---

## TL;DR for agents
- Focus on **prompt-engineering content**: patterns, prompt packs, use-case walkthroughs, model/tool guidance, and evaluations.
- Keep changes **scoped, reversible, and copy-ready**; check for nested `AGENTS.md` files before editing.
- Run `mkdocs build` (docs) and relevant `promptfoo test` configs before opening a PR.
- Update `CHANGELOG.md` under **Unreleased** and register new pages in `mkdocs.yml` when needed.

---

## 1. Project overview
**Prompting Blueprints** is a playbook for LLM prompt engineers. It contains reusable templates, prompt packs, use-case walkthroughs,
evaluation harnesses, and model/tool notes. The content powers the public documentation site (MkDocs Material) and hands-on
workshops.

### Repository map
| Area | Purpose | Typical changes |
| --- | --- | --- |
| `patterns/` | Reusable prompting templates with intent, pattern text, output formats, sample I/O. | Add/update blueprints; keep structure aligned with the nested guide. |
| `prompts/` | Prompt packs grouped by workflow or audience. | Add packs, refine prompts, document adaptation tips per the nested guide. |
| `use-cases/` | End-to-end walkthroughs for specific scenarios. | Add domain/task guides, wire inputs/outputs to patterns following the nested guide. |
| `models/` | Model-specific nuances (GPT-5, Gemini, etc.). | Expand capabilities, context limits, formatting tips. |
| `tools/` | Tactics for NotebookLM, Perplexity Comet, Microsoft Copilot Agents, etc. | Add setup steps, guardrails, sample outputs. |
| `evaluations/` | `promptfoo` configs to validate structure and outputs. | Add assertions and datasets for new content; follow nested guide. |
| `assets/` | Static images/social previews. | Only add lightweight assets (<10 MB, CC-friendly). |
| Root docs (`README.md`, `CONTRIBUTING.md`, etc.) | Contributor and project documentation. | Fix typos, links, metadata when necessary. |

> Avoid creating new top-level directories unless absolutely required and approved.

---

## 2. Allowed vs. restricted changes
### ✅ You may
- Add/edit Markdown content in `patterns/`, `prompts/`, `use-cases/`, `models/`, `tools/`.
- Add/edit evaluation configs under `evaluations/` and lightweight supporting assets.
- Update `mkdocs.yml` **only** to register new or renamed pages you introduce.
- Fix typos, broken links, headings, anchors, or front matter across the repo.

### 🚫 You must not
- Modify licensing files, author credits, or `CITATION.cff` identity.
- Commit secrets, API keys, analytics scripts, or privacy-sensitive content.
- Add heavy binaries (>10 MB) or non-free assets.
- Introduce backend services, build pipelines, or unrelated tooling.

---

## 3. Content & style guidelines
### Writing style
- Crisp, actionable, and skimmable prose. Prefer bullet lists, tables, and short paragraphs.
- Default language is **English**. Note locale-specific guidance explicitly.
- Provide **copy-ready** examples with clear inputs and expected outputs.
- Attribute external ideas with URLs in a final **References** block when applicable.

### Structure & formatting
- Use **kebab-case** for file and directory names (`role-constraint-format.md`).
- Prefer one concept per file; aim for < ~250 lines each.
- Start each new resource with an **Intent** or **Use when** section.
- Include an **OUTPUT FORMAT** section (JSON or Markdown) when structure matters.
- Reference related patterns/prompts/use-cases to keep navigation cohesive.
- Respect any additional structure defined in nested guides inside each directory.

### Patterns & prompts specifics
- Provide guidance on variables/placeholders and guardrails.
- Show at least one example conversation or completion, including expected structure.

### Use cases & tool tactics
- Outline scenario, prerequisites, agent steps, and sample outputs.
- Link back to foundational patterns or prompt packs where relevant.

### Evaluations (`promptfoo`)
- Place configs in `evaluations/`. Use deterministic inputs.
- Add assertions for structure (`contain-json`, schema checks) or keywords.
- Keep provider IDs generic (`openai:gpt-5`) and omit credentials. Use environment variables locally.

---

## 4. Quality checklist
- [ ] File passes markdown lint basics: proper headings, fenced code blocks, no trailing whitespace.
- [ ] Examples render without private data and reflect the stated output format.
- [ ] Cross-links resolve (relative paths) and referenced assets exist.
- [ ] Changelog and navigation entries updated when adding/moving files.

---

## 5. Local setup & commands
> Agents and humans should use a clean environment. Prefer Python 3.11+ and Node 18+.

```bash
# Python tooling for docs
python -m pip install --upgrade pip
python -m pip install mkdocs mkdocs-material

# Promptfoo CLI (choose one)
npm install -g promptfoo
# or: pnpm add -g promptfoo
```

### Common commands
```bash
mkdocs serve         # Local docs preview (auto reload)
mkdocs build         # Build the static site (should pass before PR)
promptfoo test -c "evaluations/**/*.yml"  # Run all evaluations (adjust scope if needed)
mdformat .           # Optional Markdown formatting if installed
```

If a command fails, capture the error, suggest a minimal fix, and avoid broad dependency changes without discussion.

---

## 6. Workflow expectations
### Branch naming
- `feat/<area>-<slug>` for new content/features (e.g., `feat/patterns-critique-loop`).
- `docs/<area>-<slug>` for documentation-only updates.
- `fix/<area>-<slug>` for fixes or refactors.

### Conventional commits
- `feat: add critique loop pattern`
- `docs(models): expand gpt-5 context tips`
- `test(evaluations): add role+constraints assertions`

### Changelog policy
- Update `CHANGELOG.md` under **Unreleased** with a one-line summary of your change.
- Follow the existing Keep-a-Changelog structure.

### Pull request checklist
- [ ] Change is focused (prefer < ~400 lines diff).
- [ ] Problem statement or linked issue included in the PR body.
- [ ] Screenshots provided if navigation changes or visual assets added.
- [ ] `mkdocs build` succeeds locally.
- [ ] Relevant `promptfoo test` suites pass, or failures are explained with follow-ups created.
- [ ] `CHANGELOG.md` updated under **Unreleased**.
- [ ] Labels added (`area:*`, `type:*`).

> When in doubt, pause and ask: Who is the audience? Should this be a new page or an update? Are there tone/length constraints?

---

## 7. Navigation & documentation site
- The documentation site uses **MkDocs Material**. Only adjust `mkdocs.yml` to add or rename pages you touch.
- Use relative links inside Markdown. Prefer fenced code blocks for commands.
- Provide screenshots or sample outputs when altering navigation or visual assets.

---

## 8. Safety & sourcing
- Never commit secrets or private data. Redact or mock API keys.
- Cite public sources in a **References** section when adapting external material.
- Keep quotes short and properly attributed. Ensure assets comply with CC BY 4.0 or similar licenses.

---

## 9. Backlog (maintainers only)
> Agents should not start these without explicit approval via issue or request.
- [ ] Add pattern: **Critique-Refine Loop**
- [ ] Refresh prompt pack: **Research-to-Newsletter**
- [ ] Expand `models/gpt-5/` with structured output recipes
- [ ] Add `evaluations/structure-validators.yml` for JSON shape checks

---

## 10. Stewardship
- Default reviewer & maintainer: **@TomasHer** (project owner).
- Follow `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for collaboration standards.

Keep changes intentional, traceable, and well-documented. Happy prompting!
