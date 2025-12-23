<img src="assets/prompting_blueprints_herda.png" alt="Prompting Blueprints" width="100%">

# Prompting Blueprints

Reusable prompt patterns, copy‑ready prompt packs, model‑specific tips (GPT‑5, Gemini), and tool playbooks (NotebookLM, Perplexity Comet, Copilot Agents). Includes example evaluations with **promptfoo**.

<p align="left">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/code-MIT-green.svg"></a>
  <a href="./docs/LICENSE-CC-BY-4.0.txt"><img alt="Docs License: CC BY 4.0" src="https://img.shields.io/badge/docs-CC%20BY%204.0-blue.svg"></a>
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
- **Guides:** AI Agents Overview, Context Engineering, deep-dive primers, and a PDF library (Gemini Prompting Guide 101, Google Startup AI Agents) → `./guides` (see `./guides/overview.md`)
- **Use cases:** applied flows (e.g., research notes) → `./use-cases`
- **Research:** tutorials, reusable blueprints, and collaboration signals for academic researchers → `./research` and `./about-author/research`
- **Speaking:** keynote decks, talk outlines, and submission notes → `./about-author/speaking`
- **Evaluations:** `promptfoo` assertions & samples (aggregated suite + prompt pattern catalogue smoke tests) → `./evaluations`
- **External sources:** curated references cited across guides and playbooks → `./external-sources.md`

Quick links: [AI agents overview](./guides/ai-agents-overview.md) · [context engineering](./guides/context-engineering.md) · [patterns](./patterns) · [prompts](./prompts) · [models](./models) · [tools](./tools) · [guides overview](./guides/overview.md) · [use‑cases](./use-cases) · [research](./research) · [author research](./about-author/research) · [speaking](./about-author/speaking) · [evaluations](./evaluations) · [external sources](./external-sources.md) · [changelog](./CHANGELOG.md)

> Want more? Browse the publicly accessible [Google NotebookLM notebook](https://notebooklm.google.com/notebook/c486e20f-f02a-439c-8168-853472335263) for extended context, references, and drafts.

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
- **Research tutorials**: academic-ready walkthroughs and blueprints for researchers exploring prompting workflows

[🎥 Watch the Prompting Blueprints introduction video](https://youtu.be/5ZxBHNKWJYs?si=7eJwo2Iy0FfNRm0U) for a guided tour of the repo purpose.

[🧠 View the repository mind map](assets/prompting_blueprints_mindmap.png) for a visual overview of key folders and resources.

---

## Repository structure
```text
assets/                 # social previews and supporting images
docs/                   # documentation site extras (e.g., licenses)
evaluations/            # promptfoo configs and fixtures
guides/                 # long-form prompting guides & PDFs
models/                 # model guides (gpt‑5, gemini, ...)
patterns/               # pattern catalog & templates
prompts/                # copy‑ready prompt packs
about-author/           # maintainer background (speaking, research)
  research/             # research focus areas & collaboration signals
  speaking/             # keynote outlines and talk prep
tools/                  # NotebookLM, Perplexity Comet, Copilot Agents
use-cases/              # applied workflows
website/                # static HTML experiments (e.g., AI toolkit preview)
CHANGELOG.md            # updates (Keep a Changelog)
CONTRIBUTING.md         # how to contribute
CODE_OF_CONDUCT.md      # community expectations
CITATION.cff            # how to cite
LICENSE                 # MIT (code)
docs/LICENSE-CC-BY-4.0.txt  # CC BY 4.0 (docs & prompts)
external-sources.md     # curated references & attributions
mkdocs.yml              # documentation site navigation
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

- **Code:** MIT — see [`LICENSE`](./LICENSE).
- **Documentation & non-code content:** CC BY 4.0 — see [`docs/LICENSE-CC-BY-4.0.txt`](./docs/LICENSE-CC-BY-4.0.txt).

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
<br>
<img src="./assets/prompting_blueprints_herda_square.JPG" alt="Tomas Herda" width="50%" height="50%">
<br>
Repository social preview image: [Image](./assets/prompting_blueprints_herda_social.png)

---

## Speaking & Keynotes & Organization
Explore Tomas Herda’s upcoming appearances, talk topics, and booking details on the dedicated [Speaking & Keynotes overview](./about-author/speaking/index.md).

For conference organization work - including program committees and track leadership see the [Program Committee & Track Leadership overview](./about-author/program-committee/index.md).

## Research
Review ongoing investigations, experiment logs, and calls for collaboration in the [Research overview](./about-author/research/overview.md).

---

## FAQ
**Q: Can I use these prompts commercially?**  
A: Yes. Code is MIT; docs/prompts are CC BY 4.0 (attribution required).

**Q: Which models are supported?**  
A: Patterns are model‑agnostic; guides cover GPT‑5 and Gemini explicitly.

**Q: How do I run evaluations without exposing secrets?**  
A: Use environment variables and a local `.env` file that is git‑ignored.
