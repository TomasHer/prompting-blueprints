---
title: "Pattern: Role + Constraints + Output Format"
intent: "Get consistent, structured answers"
model_tested: ["GPT-5", "Gemini 1.5"]
tags: ["pattern","structure","json","guardrails"]
last_updated: 2025-09-06
---

### Why it works
- Forces **schema discipline** and **abstention** when uncertain.
- Separates **context**, **constraints**, and **output** to reduce drift.

### Prompt (copy/paste)
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

### Variations
- Add a “Refusal/ambiguity” section for compliance.
- Swap JSON for Markdown tables when readers prefer readability.

### Failure modes & fixes
- Hallucinations → tighten constraints, add “use only provided context”.
- Bloated answers → explicit word limit; summarize bullets.
