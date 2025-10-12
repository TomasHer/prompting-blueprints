# AGENTS.md — `patterns/`

## Scope
These instructions apply to Markdown files inside `patterns/`.

## Purpose
Patterns capture reusable prompt templates with clear intent, structured instructions, and copy-ready examples.

## Authoring checklist
- Start with front-matter style metadata table or bullets covering **Intent**, **Use when**, and **Audience**.
- Provide a **Pattern** section that includes:
  - Required variables/placeholders with guidance on how to fill them.
  - Step-by-step instructions or call structure for the assistant.
  - Optional guardrails (refusals, safety, tone) when relevant.
- Add an **OUTPUT FORMAT** section whenever the response must follow a schema. Prefer fenced code blocks.
- Include at least one **Worked example** with sample input and expected assistant output. Use realistic but safe data.
- Link to related patterns, prompt packs, or use cases in a **Related resources** section.

## Style notes
- Aim for skimmable headings and bullet lists; keep paragraphs short.
- Favor imperative language for steps ("Do X"), and second-person voice for guidance ("You should").
- Keep files under ~200 lines when possible. Split large concepts into multiple patterns.

## Quality gates
- Validate examples against the described output format.
- Ensure placeholders render in `{SNAKE_CASE}` or `<UPPER-CASE>` consistently within the file.
- If the pattern introduces a new evaluation scenario, add or update a `promptfoo` suite under `evaluations/`.
