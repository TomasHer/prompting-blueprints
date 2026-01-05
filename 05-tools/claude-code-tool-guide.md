# Claude Code Tool Guide

## Intent
- Use this guide to run developer tasks with Claude Code in a structured, repeatable way.
- Focus on scoping, context handoff, and output structure so reviews stay fast.

## Use when
- You want a coding agent to implement or refactor features in a real repo.
- You need a reusable prompt template for plans, diffs, and tests.
- You are onboarding teammates and want a curated learning path.

## Quick orientation
- Official product page: <https://claude.com/product/claude-code>
- Claude Code works best when you provide goals, constraints, and a clear definition of done.

## Setup checklist
- Follow the official install and login instructions on the product page.
- Open the repo root and gather your build/test commands and style rules.
- Decide your guardrails (no new dependencies, keep public APIs stable, avoid specific paths).

## Core workflow (repeatable loop)
1) Write a short task brief with constraints and acceptance criteria.
2) Provide high-signal context (file paths, architecture notes, tests).
3) Ask for a plan and confirm before edits.
4) Request changes in small batches and review the diff summary.
5) Capture tests run (or skipped) and any open questions.

## Task brief template (copy-ready)
```text
TASK: [one sentence goal]
CONTEXT: [feature area, repo path, or bug symptoms]
CONSTRAINTS: [no new deps, keep API stable, time/size limits]
FILES TO TOUCH: [paths or "unknown"]
DEFINITION OF DONE:
- [expected behavior or test]
- [docs or edge case requirement]
REQUEST: Provide a short plan, then implement.
```

## OUTPUT FORMAT (Markdown)
Use this as an explicit instruction for Claude Code responses:
```text
### Plan
- [step 1]
- [step 2]

### Changes
- [file]: [summary]

### Tests
- [command] (status or "not run")

### Risks / Questions
- [risk or question]
```

## Example session (copy-ready)

**User**
```text
TASK: Add a dry-run flag to the deployment script.
CONTEXT: scripts/deploy.sh handles prod deploys.
CONSTRAINTS: Do not change default behavior; keep bash only.
FILES TO TOUCH: scripts/deploy.sh
DEFINITION OF DONE:
- --dry-run prints actions without executing
- help text documents the flag
REQUEST: Provide a short plan, then implement.
```

**Expected response shape**
```text
### Plan
- Inspect scripts/deploy.sh for argument parsing and deploy steps.
- Add a --dry-run flag and guard execution blocks.
- Update the help output.

### Changes
- scripts/deploy.sh: parse --dry-run and conditionally skip execution
- scripts/deploy.sh: document the new flag in usage text

### Tests
- manual: run `./scripts/deploy.sh --help`
- manual: run `./scripts/deploy.sh --dry-run`

### Risks / Questions
- Should dry-run still validate environment variables?
```

## Guardrails and quality tips
- Keep tasks atomic and time-boxed.
- Name specific files or directories to reduce search time.
- Add "do not touch" paths when needed.
- Ask for a file list and change summary before merging.
- Always record tests run or explicitly state "not run".

## Top Claude Code Resources 2026

### Long courses
- [Claude Code: A Highly Agentic Coding Assistant](https://www.deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant/)
- [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)
- [Claude Code for Everyone](https://dair-ai.thinkific.com/courses/claude-code)
- [Claude Code: Software Engineering with AI Agents](https://www.coursera.org/learn/claude-code)

### GitHub repos
- [Claude-code-cheat-sheet](https://github.com/Njengah/claude-code-cheat-sheet)
- [Claude-code-templates](https://github.com/davila7/claude-code-templates)
- [Awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
- [Awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [Awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows)
- [Vibe-coding-playbook](https://github.com/RiyaParikh0112/vibe-coding-playbook)

### YouTube tutorials
- [Claude Code Setup and Installation](https://www.youtube.com/watch?v=SUysp3sJHbA&list=PL4cUxeGkcC9g4YJeBqChhFJwKQ9TRiivY)
- [Claude Code is crazy good in 2026](https://www.youtube.com/watch?v=smMC1W-Mjt4)
- [My Claude Code Workflow for 2026](https://www.youtube.com/watch?v=sy65ARFI9Bg)
- [Claude Code Skills: Automate Everything You Do](https://youtu.be/vOW1xAVbuNI?si=W2sCy-YUBAATWXyL)
- [Build with Multiple AI Agents using Claude Code](https://www.youtube.com/watch?v=Z_iWe6dyGzs)
- [Build an AI Life Co-Pilot with Claude Code](https://www.youtube.com/watch?v=D0nDWQdN3F4)

### Creators to follow
- [Ray Amjad](https://www.youtube.com/@RAmjad)
- [Joe Njenga](https://medium.com/@joe.njenga/list/claude-code-bd02c285e37f)
- [Daniel Avila](https://medium.com/@dan.avila7)
- [Alex Finn](https://www.youtube.com/@AlexFinnOfficial/videos)
- [Thariq](https://x.com/trq212)
- [Boris Cherny](https://x.com/bcherny)

### Newsletters
- [THE CODE](https://codenewsletter.ai/subscribe?utm_source=linkedin_profile_om)
- [Every / Source Code](https://every.to/source-code)
- [JP](https://jpcaparas.medium.com/)
- [Joe Njenga](https://medium.com/@joe.njenga)
- [Why Senior Engineers Who Master Claude Code Will Leave Their Competition Behind](https://agiinprogress.substack.com/p/the-100000-productivity-multiplier)
- [A Guide to Claude Code 2.0 and getting better at using coding agents](https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents/)

## Related guides
- [AI Coding Spectrum](../02-ai-agents/ai-coding-spectrum.md)
- [Context Engineering](../02-ai-agents/context-engineering.md)
- [Claude Agent Skills Playbook](../02-ai-agents/claude-agent-skills.md)

## References
- Claude Code product page: <https://claude.com/product/claude-code>
