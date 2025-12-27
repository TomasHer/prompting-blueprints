# Intent
Explain how to craft high-signal GitHub Copilot custom instructions using the five tips from the GitHub Blog article “5 tips for writing better custom instructions for Copilot.” The tutorial distills the guidance into copy-ready checklists and includes every prompt example from the article so you can paste them directly into your Copilot settings.

## Use when
- You want Copilot to align with your team’s stack, style, and constraints.
- You need ready-to-use text for the “About you” and “How should Copilot respond?” fields.
- You are iterating on instructions and want to keep them concise, testable, and easy to update.

## Quick-start template
Paste this into **About you** and edit the bracketed fields:
```
I’m a [role] working on [codebase/domain] using [languages, frameworks, tools]. I ship [architecture/testing preferences]. When Copilot suggests code, prioritize [style/performance/security], and ask for clarification if requirements are ambiguous.
```
Paste this into **How should Copilot respond?**:
```
Return the smallest working example with [docstring/test expectations]. Keep replies under [word/line limit], cite file paths when relevant, and default to [tabs vs. spaces, language flavor].
```

## Five tips + prompt examples (from the GitHub Blog)
Each tip below mirrors the article and preserves the original prompt examples.

### 1) Tell Copilot who you are and what you’re building
- **Guidance:** State your role, domain, stack, and constraints so Copilot adopts the right vocabulary and defaults.
- **Prompt example (About you):**
  - “I’m a backend engineer working on a payments API for a video streaming service, using TypeScript, Node.js, PostgreSQL, and Playwright for testing.”

### 2) Specify how you want answers formatted
- **Guidance:** Define the tone, brevity, and artifact types you expect (code-only, short explanation, tests).
- **Prompt examples (How should Copilot respond?):**
  - “Keep responses short and focus on code changes that follow the PEP 8 style guide.”
  - “When you suggest code, wrap it in markdown code blocks and include a brief comment explaining the approach.”

### 3) Add guardrails and avoidances
- **Guidance:** List banned libraries, patterns, or unsafe behaviors to prevent undesired suggestions.
- **Prompt example (How should Copilot respond?):**
  - “Do not hardcode secrets. Mask any example secrets with placeholder values.”

### 4) Share examples of good vs. bad outputs
- **Guidance:** Provide a quick rubric so Copilot favors concise, high-signal replies.
- **Prompt examples (How should Copilot respond?):**
  - Good example: “Return just the code snippets I need for unit tests using pytest.”
  - Not-so-good example: “Lengthy, multi-paragraph explanations without code.”

### 5) Refresh and iterate often
- **Guidance:** Revisit your instructions after workflow changes; experiment with variants and keep a changelog.
- **Prompt example (About you):**
  - “Update these instructions whenever the stack or coding standards change, and prefer the most recent conventions for our service.”

## Working session: tighten your own instructions in 10 minutes
1. Copy the quick-start template into Copilot **About you** and **How should Copilot respond?** fields.
2. Add project signals: repo name, languages, frameworks, testing tools, documentation style.
3. Paste at least one guardrail and one good/bad example pair from Tip 4.
4. Save, then ask Copilot to draft a small feature (e.g., “add search to the dashboard”). If it deviates, tweak wording and re-save.
5. Document your final text in `docs/copilot-instructions.md` (or a team wiki) so others can reuse it.

## Checklist for high-signal custom instructions
- [ ] Role and domain captured (who you are, problem space).
- [ ] Stack and tooling listed (languages, frameworks, test frameworks, package managers).
- [ ] Output expectations defined (code blocks, tests, word/line limits).
- [ ] Guardrails included (security, compliance, banned libraries).
- [ ] Examples of good vs. bad responses recorded.
- [ ] Reminder to refresh after major refactors or process changes.

## References
- GitHub Blog — “5 tips for writing better custom instructions for Copilot.” https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/
