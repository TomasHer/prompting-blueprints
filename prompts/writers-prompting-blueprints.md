# Writer Prompting Blueprints

## Intent
Equip writers and editors with ready-to-use prompting scaffolds that enforce editorial standards while leveraging reasoning-capable LLMs for drafting, revising, and polishing long-form or short-form copy.

## Use when
- You need the model to produce publication-ready prose without manual cleanup loops.
- You are translating house style guidance into operational prompts for editors or content strategists.
- You want a copy-ready prompt that aligns with reasoning-heavy models without overloading them with extraneous detail.

## Blueprint: Avoiding double dashes
This instruction ensures manuscripts stay typographically clean by replacing the model's default `--` em dash substitution with an actual em dash or rephrased sentence.
```
LLMs should avoid using em dashes (—) when generating text. Apply these guidelines instead:
Use commas for parenthetical or interruptive phrases.
Use periods to separate independent clauses for clarity and emphasis.
Use colons to introduce lists or explanations.
Use ellipses (...) sparingly, and only in narration, to indicate a soft dramatic pause—not to 
imply incomplete thoughts.

Revisions:
“He arrived—unexpectedly—at the meeting.” → “He arrived, unexpectedly, at the meeting.”
“The storm passed—they were relieved.” → “The storm passed. They were relieved.”
“She packed three things—books, snacks, headphones.” 
→ “She packed three things: books, snacks, headphones.”
“I was about to reply—” → “I was about to reply...”
“If only they had listened—” → “If only they had listened.”
"Our neighbor—Mrs. Patel—moved away last month.” 
→ "Our neighbor, Mrs. Patel, moved away last month."
"He told me to head to—” → "He told me to head to..."
"She opened the gift—and smiled."
→ "She opened the gift. She smiled."
→ "She opened the gift and smiled."
→ "She opened the gift...and smiled." (Use sparingly)
```

## Blueprint: Writing styles instruction
Use this pattern to enforce a target tone or genre so the model mirrors a specific voice across drafts, newsletter blurbs, or academic abstracts.
```
Use simple language:
Write clearly using short, plain sentences.
Good example: "I need help with this issue."

Avoid AI-sounding phrases:
Skip clichés like “dive into” or “unleash your potential.”
Avoid: "Let's dive into this game-changing solution."
Good example: "Here's how it works."

Be direct and concise:
Get to the point. Cut unnecessary words.
Good example: "We should meet tomorrow."

Keep a natural tone:
Write like you talk. It’s fine to start with “and” or “but.”
Good example: "And that’s why it matters."

Skip marketing language:
Avoid hype or exaggerated claims.
Avoid: "This revolutionary product will transform your life."
Good example: "This product can help you."

Be honest and real:
Don’t force friendliness or enthusiasm.
Good example: "I don’t think that’s the best idea."

Simplify grammar:
Perfect grammar isn’t required. Use your natural style.
Good example: "I guess we can try that."

Cut the fluff:
Avoid unnecessary adjectives and adverbs.
Good example: "We finished the task."

Focus on clarity:
Make your message easy to understand.
Good example: "Please send the file by Monday."
```

### Adaptation tips for writers/editors
- Swap the style reference to match your publication (e.g., APA-style abstract, Substack essay, YA fantasy chapter).
- Extend the template with a "Forbidden elements" bullet to eliminate clichés or banned phrases.
- Combine with critique prompts to generate self-review notes before sending drafts to human editors.

## References
- Effective Prompts for Reasoning LLMs – GPT Lab. https://gpt-lab.eu/effective-prompts-for-reasoning-llms/
