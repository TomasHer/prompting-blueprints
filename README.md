# Prompting Blueprints

**Prompting Blueprints** is an LLM prompt engineering playbook: reusable patterns, model-specific tips (GPT-5, Gemini), and tool tactics (NotebookLM, Perplexity Comet).
Use it as a personal portfolio and a reference you can share on LinkedIn.

> ✅ **Ready for GitHub Pages** via MkDocs Material (see `.github/workflows/gh-pages.yml`).
> ✅ **Dual-license**: Code under MIT, content under CC BY 4.0.
> ✅ **Social preview** image included in `assets/social-preview.png` (set it in Repo → Settings → Social preview).

## What’s inside
- **Patterns** (`/patterns`): Reusable templates (Role + Constraints + Format, Few-shot scaffolds, Guardrails).
- **Models** (`/models`): Nuances and tips for GPT-5 and Gemini.
- **Tools** (`/tools`): Practical tactics for NotebookLM and Perplexity Comet.
- **Use cases** (`/use-cases`): Copy-paste prompts for common tasks.
- **Evaluations** (`/evaluations`): Example `promptfoo.yml` assertions and usage.

## Quick start
1. Browse [/patterns](./patterns) for model-agnostic scaffolds.
2. See [/models/gpt-5](./models/gpt-5) and [/models/gemini](./models/gemini) for model nuances.
3. Try [/tools](./tools) to get more from NotebookLM and Perplexity Comet.
4. Run evaluations (optional): see [/evaluations](./evaluations).

## Example Pattern (Role + Constraints + Output Format)
**Intent:** Reliable, structured outputs.
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

## Site docs
This repo uses **MkDocs Material**. GitHub Actions builds the site and deploys to GitHub Pages on every push to `main`.
- Config: [`mkdocs.yml`](./mkdocs.yml) (uses the repo root as `docs_dir`).
- Workflow: [`.github/workflows/gh-pages.yml`](.github/workflows/gh-pages.yml).

## License
- **Code**: MIT — see [LICENSE](./LICENSE)
- **Documentation & prompts**: CC BY 4.0 — see [LICENSE-DOCS](./LICENSE-DOCS)

---

**Author:** Tomas Herda
**LinkedIn:** https://www.linkedin.com/in/herdatom  
**Last updated:** 2025-09-06
