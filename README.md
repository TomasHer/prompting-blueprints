<img src="assets/prompting_blueprints_herda.png" alt="Prompting Blueprints" width="100%">

# Prompting Blueprints

Reusable prompt patterns, copy‑ready prompt packs, model‑specific tips (GPT‑5, Gemini), and tool playbooks (NotebookLM, Perplexity Comet, Copilot Agents). Includes example evaluations with **promptfoo**.

<p align="left">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/code-MIT-green.svg"></a>
  <a href="./LICENSE-DOCS"><img alt="Docs License: CC BY 4.0" src="https://img.shields.io/badge/docs-CC%20BY%204.0-blue.svg"></a>
  <a href="./CONTRIBUTING.md"><img alt="Contributions welcome" src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg"></a>
  <a href="https://github.com/TomasHer/prompting-blueprints/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/TomasHer/prompting-blueprints.svg?style=social"></a>
</p>

> Use this repo as your **prompting portfolio & playbook**: share highlights on LinkedIn, fork for your team, and adapt patterns to your use cases.

---

## TL;DR
- **Patterns:** reusable scaffolds (role + constraints + format) → `./patterns`
- **Prompts:** curated packs for common jobs and workflows → `./prompts`
- **Models:** specifics for GPT‑5 & Gemini (dos/don’ts, quickstarts) → `./models`
- **Tools:** tactics for NotebookLM, Perplexity Comet, Copilot Agents → `./tools`
- **Guides:** deep-dive primers and downloadable PDFs (e.g., Gemini Prompting Guide 101) → `./guides`
- **Use cases:** applied flows (e.g., research notes) → `./use-cases`
- **Research:** areas of focus, open questions, and collaboration signals → `./research`
- **Speaking:** keynote decks, talk outlines, and submission notes → `./speaking`
- **Evaluations:** `promptfoo` assertions & samples → `./evaluations`

Quick links: [patterns](./patterns) · [prompts](./prompts) · [models](./models) · [tools](./tools) · [guides](./guides) · [use‑cases](./use-cases) · [research](./research) · [speaking](./speaking) · [evaluations](./evaluations) · [changelog](./CHANGELOG.md)

---

## Who is this for?
- **Practitioners & teams** who want consistent, high‑quality outputs
- **Leads & educators** who need examples they can demo and share
- **Everyone** looking for opinionated, “just‑paste‑this” prompts with structure

## What’s inside
- A **pattern catalog**: role, constraints, format, guardrails
- **Copy‑ready prompt packs** organized by job/function
- **Model guides**: nuances, capabilities, and pitfalls
- **Tool playbooks**: tactical prompts and workflows for NotebookLM, Copilot, and more
- **Prompting guides**: long-form walkthroughs with downloadable references
- **Evaluation samples**: promptfoo assertions & runs

---

## Quick start
```bash
# 1) Clone
git clone https://github.com/TomasHer/prompting-blueprints.git
cd prompting-blueprints

# 2) Browse patterns & prompts
# (open folders in your editor and copy what you need)

# 3) Optional: run local docs site
pip install mkdocs-material
mkdocs serve  # http://127.0.0.1:8000
```

### Example pattern (Role + Constraints + JSON output)
```text
You are an exacting <ROLE>. Follow ALL constraints.

CONTEXT: <short context or pasted text>

CONSTRAINTS:
- Be concise (≤120 words).
- Use only the provided context.
- If unsure, say "insufficient information".

OUTPUT FORMAT (JSON):
{
  "summary": "<string>",
  "assumptions": ["<string>"],
  "confidence": "<low|medium|high>"
}
```

> Tip: Save reusable **roles** and **formats** in your editor snippets.

---

## Evaluations with promptfoo (optional)
This repo ships example assertions and configs under `./evaluations`.

```bash
# Install
npm -g i promptfoo  # or: npx promptfoo@latest

# Dry‑run an example config (edit paths as needed)
promptfoo eval -c evaluations/promptfoo.yml

# Open the dashboard
promptfoo view
```

> Keep your own API keys in `.env` (promptfoo supports env var substitution). Do **not** commit secrets.

---

## Publish as a website (MkDocs Material)
This repository is ready to build a static documentation site with MkDocs.

### 1) Local preview
```bash
pip install mkdocs-material
mkdocs serve
```

### 2) GitHub Pages deploy (GitHub Actions)
If you don’t already have a Pages workflow, add **`.github/workflows/gh-pages.yml`**:

```yaml
name: Deploy MkDocs to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      - name: Install deps
        run: |
          pip install mkdocs-material
      - name: Build site
        run: mkdocs build --strict
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then go to **Settings → Pages** and select “GitHub Actions” as the source.

> The site title, navigation, and theme are configured in [`mkdocs.yml`](./mkdocs.yml). This repo uses the root directory as `docs_dir`, so Markdown at the root appears in the site.

---

## Repository structure
```text
assets/                 # social preview, images
patterns/               # pattern catalog & templates
prompts/                # copy‑ready prompt packs
models/                 # model guides (gpt‑5, gemini, ...)
tools/                  # NotebookLM, Perplexity Comet, Copilot Agents
guides/                 # long-form prompting guides & PDFs
use-cases/              # applied workflows
research/               # research focus areas & collaboration signals
speaking/               # keynote outlines and talk prep
evaluations/            # promptfoo examples
CHANGELOG.md            # updates
CONTRIBUTING.md         # how to contribute
CODE_OF_CONDUCT.md      # community expectations
CITATION.cff            # how to cite
LICENSE                 # MIT (code)
LICENSE-DOCS            # CC BY 4.0 (docs & prompts)
```

---

## Contributing
Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the [Code of Conduct](./CODE_OF_CONDUCT.md). If you add a new pattern or prompt pack, include:
1. **Intent** (problem it solves)
2. **Constraints** (guardrails)
3. **Output format** (JSON/Markdown schema)
4. **Example input & output**

---

## License
- **Code:** MIT — see [LICENSE](./LICENSE)
- **Docs & prompts:** CC BY 4.0 — see [LICENSE‑DOCS](./LICENSE-DOCS)

If you share snippets publicly, please attribute: _“Tomas Herda, Prompting Blueprints (CC BY 4.0)”_.

---

## Cite this work
Researchers and educators can cite this repo via [CITATION.cff](./CITATION.cff).

```bibtex
@software{herda_prompting_blueprints,
  title = {Prompting Blueprints},
  author = {Herda, Tomas},
  year = {2025},
  url = {https://github.com/TomasHer/prompting-blueprints}
}
```

---

## Credits
**Author:** [Tomas Herda](https://www.linkedin.com/in/herdatom)

Social preview image: set it in **Repository → Settings → Social preview** (file: `assets/prompting_blueprints_herda_social.png`).

---

## Speaking & Keynotes
Explore Tomas Herda’s upcoming appearances, talk topics, and booking details on the dedicated [Speaking & Keynotes overview](./speaking/overview.md).

## Research
Review ongoing investigations, experiment logs, and calls for collaboration in the [Research overview](./research/overview.md).

---

## FAQ
**Q: Can I use these prompts commercially?**  
A: Yes. Code is MIT; docs/prompts are CC BY 4.0 (attribution required).

**Q: Which models are supported?**  
A: Patterns are model‑agnostic; guides cover GPT‑5 and Gemini explicitly.

**Q: How do I run evaluations without exposing secrets?**  
A: Use environment variables and a local `.env` file that is git‑ignored.
