# AGENTS.md — `models/`

## Scope
Applies to content in `models/` and its subdirectories unless a deeper `AGENTS.md` overrides it.

## Purpose
Document model-specific guidance (capabilities, limits, formatting tips) that helps practitioners adapt patterns and prompts.

## Content expectations
- Begin each file with a quick facts table (context window, modalities, ideal tasks, pricing cues if relevant).
- Highlight **Strengths**, **Limitations**, and **Do/Don't** lists tailored to the model.
- Provide structured **Prompting tactics** such as system prompt scaffolds, sampling defaults, and output formatting notes.
- Include **Migration tips** comparing the model to neighboring options (e.g., GPT-4.1 vs GPT-5 vs Gemini 2.0).
- Surface any **Safety considerations** or compliance constraints.

## Style guidance
- Keep tone pragmatic and vendor-neutral.
- Use subsections for different capability areas (reasoning, generation, agents, function calling).
- When sharing command-line samples, confirm that tools are already documented elsewhere or provide a brief setup note.

## Quality checklist
- Verify that statistics (context, rate limits) cite a dated source or note "as of <month year>".
- Cross-link to relevant patterns, prompts, or use cases that benefit from the model.
- Add/update evaluations if new structured-output advice requires validation.
