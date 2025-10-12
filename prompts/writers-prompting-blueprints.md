# Writer Prompting Blueprints

## Intent
Equip writers and editors with ready-to-use prompting scaffolds that enforce editorial standards while leveraging reasoning-capable LLMs for drafting, revising, and polishing long-form or short-form copy.

## Use when
- You need the model to produce publication-ready prose without manual cleanup loops.
- You are translating house style guidance into operational prompts for editors or content strategists.
- You want a copy-ready prompt that aligns with reasoning-heavy models without overloading them with extraneous detail.

## Blueprint: Avoiding double dashes
This instruction ensures manuscripts stay typographically clean by replacing the model's default `--` em dash substitution with an actual em dash or rephrased sentence.

### Prompt structure
1. **Role framing** — Position the model as a meticulous copy editor applying a specific typography rule.
2. **Constraint** — Explicitly forbid the `--` pattern and explain the required replacement behavior.
3. **Revision steps** — Ask for a quick scan before rewriting to minimize cascading edits.
4. **Output format** — Return only the corrected passage so writers can paste the result into their document.

### Template
```
You are a professional copy editor specializing in long-form manuscripts.

Instruction: Read the supplied passage and revise it so there are no instances of the double hyphen sequence `--`. Replace each occurrence with an em dash `—` or rewrite the sentence if an em dash would be awkward. Preserve all other content and punctuation.

Steps:
1. Re-read the passage once to spot any `--` sequences.
2. For each occurrence, decide whether an em dash `—` is appropriate or whether the sentence should be split/rephrased.
3. Return the fully revised passage with no commentary.

Output format: Revised passage only, no bullet points, no explanations.
```

### Example (from the source)
```
Avoiding Double Dashes Instruction

Instruction: Replace double dashes (--) with em dashes (—).

Example Input: The research team -- comprised of linguists and engineers -- submitted the paper on time.
Example Output: The research team — comprised of linguists and engineers — submitted the paper on time.
```

### Adaptation tips for writers/editors
- Pair this blueprint with a second pass for house style (e.g., Oxford comma usage) when preparing manuscripts for publication.
- If your CMS strips em dashes, swap the replacement rule for spaced hyphens or parentheses instead.
- When collaborating with authors, include a short rationale explaining why double dashes are flagged to encourage consistent adoption.

## Blueprint: Writing styles instruction
Use this pattern to enforce a target tone or genre so the model mirrors a specific voice across drafts, newsletter blurbs, or academic abstracts.

### Prompt structure
1. **Role framing** — Identify the stylistic persona (e.g., "award-winning narrative nonfiction editor").
2. **Style guide bullets** — Provide crisp, scannable cues that capture pacing, diction, and perspective.
3. **Content brief** — Supply the core message or outline the model must work from.
4. **Quality bar** — Clarify revision loops or acceptance criteria so the model self-audits before finalizing.

### Template
```
You are an editor coaching an author to write in the <STYLE_REFERENCE> voice.

Context:
- Audience: <AUDIENCE_DETAILS>
- Key points to cover: <BULLET_LIST>

Style requirements:
- <RULE_1>
- <RULE_2>
- <RULE_3>

Task:
1. Draft the passage in the requested style while incorporating every key point.
2. Reread to confirm the style requirements are met.
3. Return the final draft as a single block of prose.
```

### Example (from the source)
```
Writing Styles Instruction

Instruction: Write in the style of the Economist.

Example Input: Summarize the latest AI policy updates in Europe.
Example Output: The Continent’s policymakers, never shy of regulation, have unfurled fresh strictures on artificial intelligence. The package tightens data-use disclosures, nudges labs toward watermarking, and hints at future audits—all delivered in prose as dry as Brussels paperwork.
```

### Adaptation tips for writers/editors
- Swap the style reference to match your publication (e.g., APA-style abstract, Substack essay, YA fantasy chapter).
- Extend the template with a "Forbidden elements" bullet to eliminate clichés or banned phrases.
- Combine with critique prompts to generate self-review notes before sending drafts to human editors.

## References
- Effective Prompts for Reasoning LLMs – GPT Lab. https://gpt-lab.eu/effective-prompts-for-reasoning-llms/
