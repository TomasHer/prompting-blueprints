# Models & Evaluations

This folder hosts model guides alongside a small suite of `promptfoo` configurations that keep key blueprints honest.

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
