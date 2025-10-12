# AGENTS.md — `prompts/`

## Scope
Applies to Markdown files within `prompts/`.

## Goal of this area
Document curated prompt packs for specific roles or workflows, highlighting adaptation knobs and success metrics.

## Structure checklist
- Begin with a **Pack overview** covering purpose, target users, and prerequisites.
- Provide a **Quick start** section with a ready-to-copy master prompt.
- Break down the pack into numbered **Prompt cards** or stages. For each card include:
  - When to deploy it.
  - Input variables and guidance for customizing.
  - Expected assistant behavior and guardrails.
- Add a **Tuning & variants** section describing optional modifications (tone, depth, localization, channels).
- Close with **Success signals** (what good outputs look like) and **Failure modes** (what to watch out for).
- Link to relevant patterns, use-cases, or evaluations.

## Style preferences
- Use tables for summarizing prompt cards when more than three exist.
- Highlight placeholders using `{BRACES}` and emphasize copy-ready text with fenced code blocks.
- Keep file length approachable (< ~220 lines). Split large packs into multiple files if necessary.

## Quality requirements
- Ensure every prompt card has an accompanying example exchange or output snippet.
- Cross-check that referenced assets or evaluations exist.
- Mention any recommended `promptfoo` suites that cover the pack, or suggest adding one when introducing entirely new prompts.
