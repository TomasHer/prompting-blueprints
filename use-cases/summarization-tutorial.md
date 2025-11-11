# Summarization Playbook

## Intent
Help analysts, project managers, and policy teams produce tailored summaries that balance brevity with actionable insight across executive, research, and policy contexts.

## When to Use
- You must condense long-form content into role-specific briefings without losing nuance.
- Stakeholders require different formats (narrative vs. bullet lists) from the same source material.
- The downstream workflow depends on extracting implications, risks, and next steps, not just restating facts.

## Preparation Checklist
- Gather the full source material and confirm whether citations or word limits are mandatory.
- Clarify the target reader, their decision horizon, and the most valuable deliverable format.
- Identify any non-negotiables: required recommendations, policy positions, or implementation constraints.

## Workflow Overview
1. **Scoping interview**: Ask the requester for audience, purpose, and must-have insights.
2. **Highlight extraction**: Annotate critical data (figures, quotes, contradictions) before prompting the model.
3. **Prompt selection**: Match the source to one of the prompt patterns below—adjust tone, length, and output structure.
4. **Model run & review**: Generate the summary, verifying accuracy and compliance with length/format requirements.
5. **Refinement**: Iterate with follow-up prompts to add context, clarify uncertainties, or embed recommendations.

## Prompt Library
Use these prompts as starting points. Replace the bracketed section with the text or document notes you want summarized.

### 1. Extract strategic insights
"Analyze this text like a strategy consultant. Identify the key ideas, missed opportunities, and strategic implications I should act on immediately."

### 2. Extract what others overlook
"Read this text and point out the hidden assumptions, biases, or unspoken perceptions that most readers would overlook — but experts would notice."

### 3. Summary for complex research
"Analyze the methodology, key findings, and limitations of this academic paper step by step. Then, write a three-sentence summary focused on how the study’s findings can be applied in practice."

### 4. Executive summary with actionable elements
"As a project manager, summarize the key findings of this report in under 200 words, including at least three practical recommendations."

### 5. Policy brief in key points
"Provide a list-style summary of the following policy document, outlining the main objectives, proposed strategies, and potential challenges in under 100 words."

## Workflow Variations
- **Executive stakeholders**: Pair prompt #4 with a follow-up request for implementation timeline and owner assignments.
- **Academic reviewers**: Combine prompt #3 with explicit citation instructions and ask for confidence ratings on each claim.
- **Policy advocacy teams**: Use prompt #5, then request a risk/opportunity matrix keyed to stakeholder groups.

## Quality Assurance Tips
- Cross-check quoted figures and claims against the source to avoid hallucinated data.
- Ensure the final summary mirrors the requested tone (e.g., neutral policy brief vs. persuasive executive memo).
- Add a short "Next actions" block when the summary is meant to trigger decision-making.

## Related Blueprints
- [Role + Constraint Format](../patterns/role-constraint-format.md)
- [Researchers Prompting Blueprints](../prompts/researchers-prompting-blueprints.md)
- [Writers Prompting Blueprints](../prompts/writers-prompting-blueprints.md)

