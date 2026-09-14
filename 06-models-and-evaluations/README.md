# Models & Evaluations

This folder hosts model guides alongside a small suite of `promptfoo` configurations that keep key blueprints honest.

## Model guides

| Guide | Focus |
| --- | --- |
| [GPT-6 Astra: Rethinking Skills, AGENTS.md, and Task Prompts](./gpt-6-astra-skills-and-prompts.md) | OpenAI's guidance on trimming skills, `AGENTS.md`, and task prompts for GPT-6 Astra, with an audit checklist and rewrites. |
| [GLM-5 Setup & Serving Guide](./glm-5-guide.md) | Open-weight agentic model: specs, vLLM/SGLang serving, OpenClaw integration. |
| [Ornith-1.0 on DGX Spark Guide](./ornith-1-0-dgx-spark-guide.md) | Run an open-source agentic coding LLM locally. |
| [Gemini Nano Banana Pro Prompt Library](./nano-banana-pro-library.md) | Copy-ready image-generation prompts. |
| [Google Veo 3.1 Video Tutorial](./google-veo-3-1-video-tutorial.md) | Cinematic video prompting. |
| [The 8 Types of AI Models](./types-of-ai-models-tutorial.md) | Which model class fits which agent job. |

## Available configs

| Config | Focus | Quick run |
| --- | --- | --- |
| `promptfoo.yml` | Aggregates the JSON guardrail smoke test plus any linked configs in this folder. | `promptfoo test -c 06-models-and-evaluations/promptfoo.yml` |
| `pattern-catalogue-smoke.yml` | Spot-checks Persona, Question Refinement, and Template pattern scaffolds for structure compliance. | `promptfoo test -c 06-models-and-evaluations/pattern-catalogue-smoke.yml` |

## Run locally (optional)
1. Install promptfoo: `npm i -g promptfoo` (or use `npx`).
2. Configure your providers (see promptfoo docs). The configs assume a generic OpenAI-compatible model ID; set `OPENAI_API_KEY` before running.
3. Execute one of the quick run commands above depending on the scope you want to test.

> Keep the checks simple and fast. The goal is to **signal rigor**, not to benchmark models.
