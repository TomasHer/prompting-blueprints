# LinkedIn Post Draft — Claude Code Tutorials (with workshop photo)

> Draft for a LinkedIn post. Attach the workshop photo (role-playing Claude Code / effective token usage).
> Fill in the DAiTA placeholder before publishing.

---

Yes, that's really me in the photo. 😄

At a recent workshop I got to role-play Claude Code — I was the agent, and my colleagues' job was to burn through my context window as fast as possible.

Silly? Absolutely. But it made one point stick better than any slide deck: **for AI coding agents, tokens are attention — and attention is the scarcest resource in the loop.**

A few token optimization strategies we keep coming back to:

🔹 Keep your CLAUDE.md lean — every line gets loaded into every single session
🔹 Scope the context: point the agent at the right files instead of letting it search blindly
🔹 Use /compact before long sessions drift, and /cost to see where tokens actually go
🔹 Move repeatable know-how into skills that load on demand, not into the base prompt

I've collected the tutorials behind all of this in my open repo, Prompting Blueprints:

📌 Claude Code Cheat Sheet — commands, shortcuts, env vars:
https://github.com/TomasHer/prompting-blueprints/blob/main/05-tools/claude-code-cheatsheet-v2.md

📌 How to design a CLAUDE.md that actually works:
https://github.com/TomasHer/prompting-blueprints/blob/main/05-tools/claude-md-design-tutorial.md

📌 Claude Code MCP setup (Perplexity, Firecrawl, Chrome DevTools):
https://github.com/TomasHer/prompting-blueprints/blob/main/05-tools/claude-code-mcp-setup-tutorial.md

📌 Context engineering for AI agents:
https://github.com/TomasHer/prompting-blueprints/blob/main/02-ai-agents/03-context-and-memory/context-engineering.md

Full collection (MIT / CC BY, fork it for your team):
https://github.com/TomasHer/prompting-blueprints

[PLACEHOLDER — DAiTA promo: 2–3 sentences on how we apply these agentic patterns to Intelligent Document Processing with the DAiTA platform at Post Business Solutions + link to the use case]

What's the one token-saving habit that made the biggest difference for you? 👇

#ClaudeCode #AIAgents #ContextEngineering #PromptEngineering #GenAI #TokenOptimization
