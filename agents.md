# AGENTS.md — Prompting Blueprints

> Use this file as the operating manual for AI coding agents (ChatGPT Codex, Copilot Agent, etc.). It explains the repo's intent, the boundaries for automated changes, and the workflow expected for high-quality pull requests.

---

## TL;DR for agents
- Stay focused on **prompt-engineering content** (patterns, prompt packs, model/tool guides, evaluations).
- Keep contributions **scoped, reversible, and copy-ready**.
- Run `mkdocs build` (docs) and relevant `promptfoo test` configs before opening a PR.
- Update `CHANGELOG.md` under **Unreleased** and document new pages in `mkdocs.yml` when required.
- **Every new content file needs YAML front-matter.** Run `python3 scripts/check-frontmatter.py` before opening a PR.

---

## 1. Project overview
**Prompting Blueprints** is a playbook for LLM prompt engineers. It contains reusable templates, prompt packs, use-case walkthroughs, evaluation harnesses, and model/tool tips. The content powers the public documentation site (MkDocs Material) and hands-on workshops.

### Repository map
| Area | Purpose | Typical changes |
| --- | --- | --- |
| `02-ai-agents/` | Agent architectures, protocols, context engineering, and skills playbooks. | Add/refresh agent guides, protocols, and skills guidance. |
| `03-prompts-and-patterns/` | Prompt packs and reusable patterns with intent, output formats, sample I/O. | Add/refresh packs, pattern catalog entries, structured outputs. |
| `04-guides/` | Long-form guides, primers, and PDFs. | Add/refresh guides and overview entries. |
| `07-use-cases-and-research/` | End-to-end walkthroughs and research playbooks for specific scenarios. | Add domain/task guides, research playbooks, wire inputs/outputs to patterns. |
| `05-tools/` | Tactics for NotebookLM, Perplexity Comet, Microsoft Copilot Agents, etc. | Add setup steps, guardrails, sample outputs. |
| `06-models-and-evaluations/` | Model-specific nuances plus evaluation overviews and configs. | Expand capabilities, context limits, formatting tips, benchmark primers, and promptfoo configs. |
| `assets/` | Static images/social previews. | Only add lightweight assets (<10 MB, CC-friendly). |
| Root docs (`README.md`, `CONTRIBUTING.md`, etc.) | Contributor and project documentation. | Fix typos, links, metadata when necessary. |

> Avoid creating new top-level directories unless absolutely required and approved.

---

## 2. Allowed vs. restricted changes
### ✅ You may
- Add/edit Markdown content in `02-ai-agents/`, `03-prompts-and-patterns/`, `04-guides/`, `07-use-cases-and-research/`, `05-tools/`, `06-models-and-evaluations/`.
- Add/edit promptfoo configs under `06-models-and-evaluations/` and lightweight supporting assets.
- Update `mkdocs.yml` **only** to register new or renamed pages you introduce.
- Update `external-sources.md` **only** to register new external sources in alphabetical order.
- Fix typos, broken links, headings, anchors, or front-matter across the repo.

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
- Use **kebab-case** for file and directory names (`role-constraints-format.md`).
- Prefer one concept per file; aim for < ~250 lines each.
- Start each new resource with an **Intent** or **Use when** section.
- Include an **OUTPUT FORMAT** section (JSON or Markdown) when structure matters.
- Reference related patterns, prompt packs, and use cases to keep navigation cohesive.

### Front-matter (required for all new content files)
Every new `.md` file in `02-ai-agents/`, `03-prompts-and-patterns/`, `04-guides/`, `05-tools/`, and `07-use-cases-and-research/` must open with a YAML front-matter block.

**Tier A — `03-prompts-and-patterns/`** (full schema):
```yaml
---
title: "Pattern: Role + Constraints + Output Format"
intent: "One sentence describing what this pattern achieves"
model_tested: ["GPT-5", "Claude Sonnet 4.6"]
tags: ["patterns", "structure"]
last_updated: 2026-04-22
---
```

**Tier B — all other content directories** (operational schema):
```yaml
---
title: "MCP Guide"
tags: ["agents", "mcp"]
last_updated: 2026-04-22
---
```

Rules:
- `title`: use the exact nav label from `mkdocs.yml`, or the first `# Heading` if not yet registered.
- `tags`: first tag is always the directory category (`agents`, `patterns`, `guides`, `tools`, `research`); add 1–2 specific keywords after it.
- `last_updated`: ISO date (`YYYY-MM-DD`) of the commit that creates or significantly updates the file.
- `model_tested`: required for Tier A only; list every model you tested the prompt against.
- Run `python3 scripts/check-frontmatter.py` to verify before opening a PR. To generate stubs for new files in bulk, use `python3 scripts/add-frontmatter.py --dry-run` first.

### Patterns & prompts specifics
- Provide guidance on variables/placeholders and guardrails.
- Show at least one example conversation or completion, including expected structure.

### Use cases & tool tactics
- Outline scenario, prerequisites, agent steps, and sample outputs.
- Link back to foundational patterns or prompt packs where relevant.

### Evaluations (`promptfoo`)
- Place configs in `06-models-and-evaluations/`. Use deterministic inputs.
- Add assertions for structure (`contain-json`, schema checks) or keywords.
- Keep provider IDs generic (`openai:gpt-5`) and omit credentials. Use environment variables locally.

---

## 4. Local setup & commands
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
promptfoo test -c "06-models-and-evaluations/*.yml"  # Run all evaluations (adjust scope if needed)
mdformat .           # Optional Markdown formatting if installed
```

If a command fails, capture the error, suggest a minimal fix, and avoid broad dependency changes without discussion.

---

## 5. Workflow expectations
### Branch naming
- `feat/<area>-<slug>` for new content/features (e.g., `feat/prompts-and-patterns-critique-loop`).
- `docs/<area>-<slug>` for documentation-only updates.
- `fix/<area>-<slug>` for fixes or refactors.

### Conventional commits
- `feat: add critique loop pattern`
- `docs(models): expand gpt-5 context tips`
- `test(models-and-evaluations): add role+constraints assertions`

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
- [ ] All new content files have YAML front-matter (`python3 scripts/check-frontmatter.py` exits 0).
- [ ] Internal links use explicit relative paths (`./` or `../`), not bare filenames.

> When in doubt, pause and ask: Who is the audience? Should this be a new page or an update? Are there tone/length constraints?

---

## 6. Navigation & documentation site
- The documentation site uses **MkDocs Material**. Only adjust `mkdocs.yml` to add or rename pages you touch.
- Use relative links inside Markdown. Prefer fenced code blocks for commands.
- **Always use explicit relative paths for internal links.** Same-directory links must start with `./` (e.g. `[MCP Guide](./mcp-guide.md)`, not `[MCP Guide](mcp-guide.md)`). Cross-directory links use `../` as appropriate. Bare filenames are not resolved correctly by MkDocs and will produce broken links on the docs site.
- Provide screenshots or sample outputs when altering navigation or visual assets.

---

## 7. Safety & sourcing
- Never commit secrets or private data. Redact or mock API keys.
- Cite public sources in a **References** section when adapting external material.
- When creating a new Markdown file, add all external references to `external-sources.md` in alphabetical order.
- Keep quotes short and properly attributed. Ensure assets comply with CC BY 4.0 or similar licenses.

---

## 8. Backlog (maintainers only)
> Agents should not start these without explicit approval via issue or request.
- [ ] Add pattern: **Critique-Refine Loop**
- [ ] Refresh prompt pack: **Research-to-Newsletter**
- [ ] Expand GPT-5 guidance in `06-models-and-evaluations/` with structured output recipes
- [ ] Add `06-models-and-evaluations/structure-validators.yml` for JSON shape checks

---

## 9. Stewardship
- Default reviewer & maintainer: **@TomasHer** (project owner).
- Follow `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for collaboration standards.

Keep changes intentional, traceable, and well-documented. Happy prompting!
