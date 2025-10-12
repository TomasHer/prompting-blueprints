# NotebookLM Audio Overviews Blueprint

## Intent
Help NotebookLM creators turn curated source packets into focused, source-grounded audio overviews without hallucinations or off-topic tangents.

## Use when
- You are assembling an audio overview for teammates, clients, or learners inside Google NotebookLM.
- Your audience expects a concise explainer that stays anchored to the uploaded sources.
- You need to emphasize (or exclude) specific terms while keeping the narration listener-friendly.

## Source prep checklist
- Curate source docs; smaller, high-signal sets work best.
- Ask for **source-grounded** citations or highlights.
- Use **follow-ups** to progressively refine outputs.
- Upload transcripts, briefs, or outlines that clearly define the "topic X" focus for the audio.
- Note down disallowed terms ("Y"), phrases you want to throttle ("Z"), and the full expansion for any acronym ("W").

## Prompt blueprint (from Tomas Herdan's LinkedIn playbook)
Paste this into an Audio Overview prompt or pin it as a persistent instruction inside the Notebook. Replace the placeholders before running:

```
Focus on topic {TOPIC_X}.
Don’t discuss things you are not sure about based on your sources.
Don’t mention {TERM_Y_TO_AVOID}.
Don’t repeat {PHRASE_Z} too often.
Don’t use abbreviation of {TERM_W}; instead say the full version: {TERM_W_FULL}.
```

### Why it works
- Keeps the narrator centered on the chosen theme while honoring NotebookLM's source attribution.
- Explicit guardrails reduce the risk of speculative or repetitive narration.
- Forces clarity by expanding acronyms that might confuse listeners in audio form.

## Delivery tips inside NotebookLM
1. Run a first pass with the blueprint, then review the generated outline and citations.
2. Ask follow-up questions such as "Highlight the strongest supporting quote" or "Suggest a tighter intro" to polish the script before rendering audio.
3. Use NotebookLM's highlight playback to confirm that every point traces back to your uploaded materials.
4. Share the finished overview with collaborators and note any additional guardrails for future revisions.

## References
- Prompt adapted from Tomas Herdan's LinkedIn post on NotebookLM audio strategies: <https://www.linkedin.com/posts/herdatom_notebooklm-google-aiandagile-activity-7323293140201709569-mBAU>
- Additional Google guidance on Audio Overviews: <https://notebooklm.google/audio>
