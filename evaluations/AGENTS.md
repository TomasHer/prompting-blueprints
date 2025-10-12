# AGENTS.md — `evaluations/`

## Scope
Applies to everything inside `evaluations/`.

## Objective
Maintain `promptfoo` test suites that validate patterns, prompt packs, and use-cases for structure and quality.

## File organization
- Store suite-level docs in `README.md` (already present); keep scenario-specific instructions near the configs.
- Use descriptive filenames (`pattern-critique.yml`) and group related suites in subdirectories when they share fixtures.

## Config guidelines
- Prefer YAML configs; keep JSON only when schema validation demands it.
- Declare providers via environment-variable-based IDs (e.g., `env:OPENAI_API_KEY`). Avoid hardcoding keys or org IDs.
- Capture deterministic prompts/examples. If randomness is required, pin `temperature: 0` where possible.
- Provide at least one assertion per expected behavior (structure, keywords, rating thresholds, etc.).
- Document pass/fail expectations in comments so maintainers can interpret results quickly.

## Workflow expectations
- Update the root `README.md` with any new suites or usage instructions.
- Reference evaluation coverage in the related content's Markdown (patterns/prompts/use-cases).
- When suites fail, capture output from `promptfoo test` and summarize remediation steps in the PR body.
