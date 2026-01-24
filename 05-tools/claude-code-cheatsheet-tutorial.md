# Claude Code Cheatsheet Transcription and Tool Tutorial

## Claude Code Cheatsheet (Text Transcription)

### Claude Code Cheatsheet

#### Slash Commands
- /clear — Clears chat history
- /agents — Access and manage agents
- /model — Select the AI model
- /mcp — Manage MCP servers
- /cost — Show token usage
- /permissions — View permissions
- /bashes — List background tasks
- /hooks — Hook configs for tools
- /memory — Edit CLAUDE.md files
- /plugin — Manage Code plugins
- /init — Initialize project
- /review — Request code review
- /config — Clears chat history
- /sandbox — Enable sandbox bash tool

#### Keyboard Shortcuts
- ! — Run commands directly
- Shift + Tab — Auto-Accept
- @ — File path mention
- Shift + Tab + Tab — Planning mode
- Esc — Interrupt Claude process
- Cmd + Esc — Quick launch in IDE
- / + Esc — Quick Escape
- Ctrl + T — Toggle syntax highlighting
- Ctrl + R — Reverse search history
- Ctrl + U — Delete entire line
- Ctrl + V — Paste Image from clipboard
- Alt + T — Toggle Extended Thinking
- Esc + Esc — Rewind the code
- Ctrl + B — Background running tasks

#### Best Plugins
- Superpowers — Claude Code core super skills library — github.com/obra/superpowers
- Context-7 — Up-to-date code documentation — github.com/upstash/context7
- Exa Search — Web search and web crawling! — github.com/exa-labs/exa-mcp-server
- Playright — End-to-end testing for web apps — github.com/lackeyjb/playwright-skill
- Beads — A memory upgrade for your coding agent — github.com/steveegge/beads
- Front-end design — Improve agents’ design skills — github.com/anthropics/claude-code/blob/main/plugins/frontend-design
- PR Review Toolkit — App PR Automation agents — github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit
- Code Simplifier — Simplifies large code bases — claude plugin install code-simplifier

#### Essential Commands
- claude -p --max-turns 3 "query" — Limit conversation turns (In this example 3)
- claude --continue — Continue the current session
- claude --add-dir /path/to/project — Validate directory paths
- claude -p "query" --output-format json — Print output in different output formats
- claude -r — Resume a previous conversation
- claude --version — Check the current version
- claude update — Update the Claude into its latest version
- claude config set -g theme dark

#### Best Practices to use Claude code

**Parallel Execution**
- Run 5 claudes in parallel in numbered terminal tabs
- Use System notifications (iTerm2) for input alerts
- Run 5–10 or more on claude.ai/code alongside local
- Hand off with & or --teleport

**Slash Commands**
- /aggregatel for aggregating logs (example not real)
- /visualz for creating webpage from images (example not real)
- Create Commands for repeated workflows
- Store in .claude/commands/, check into git
- Example: /commit-push-pr used dozens of times daily
- Use inline bash to pre-compute for speed

**Permissions**
- Don’t use --dangerously-skip-permissions
- Use /permissions to pre-allow safe commands
- Store in .claude/settings.json, share with team
- For sandboxed: --permission-mode=onAsk

**Operating on Claude.md**
- Share single Claude.md per repo, checked into git
- Whole team contributes to add mistakes on multiple times/week

**Verification**
- Use Chrome extension to test UI changes for your apps
- Verify according to your domain: bash, tests, browser, simulators

**Long-Running tasks**
- Use Bg Agent to very when done
- Stop hook for deterministic verification
- Use Ralph Wiggum for autonomous task execution

**Plan Mode**
- Start most sessions in Plan mode
- Iterate until you like the plan
- Switch to auto-accept edits (Claude will 1-shot it)

#### Key File Locations
- .claude/settings.json — Project Settings
- .claude/agents/ — Your subagents for your projects
- .claude/managed-settings.json — Your enterprise managed settings
- .claude/commands/ — Your custom claude commands
- .claude-plugin/plugin.json — Data about your plugins

## Claude Code Tool Tutorial

### 1) Define the outcome and constraints
Start with a crisp goal, then add guardrails so Claude Code can act decisively.

**Prompt template**
```text
TASK: [one-sentence goal]
CONTEXT: [feature area, repo path, or bug symptoms]
CONSTRAINTS: [no new deps, keep API stable, time/size limits]
FILES TO TOUCH: [paths or "unknown"]
DEFINITION OF DONE:
- [expected behavior or test]
- [docs or edge case requirement]
REQUEST: Provide a short plan, then implement.
```

### 2) Initialize the workspace
- Open the repo root in your terminal before launching Claude Code.
- Use `claude --add-dir /path/to/project` when the CLI needs to validate the workspace.
- If you work with multiple repos, create a separate CLAUDE.md per repo to store stable context.

### 3) Plan before edits
Ask for a plan first so you can approve the approach before Claude Code changes files.

**Example**
```text
Please propose a 3-step plan and confirm before editing any files.
```

### 4) Use slash commands to manage context
- `/memory` to edit CLAUDE.md and lock in project conventions.
- `/permissions` to pre-allow safe commands.
- `/review` to request a post-change code review.

### 5) Execute in small, reviewable batches
- Ask for a short diff summary after each batch.
- Keep tasks scoped to 1–3 files when possible.
- If the change is large, split it into checkpoints ("Phase 1: refactor", "Phase 2: features").

### 6) Validate outputs
- Require tests or verification steps in the response.
- If tests are skipped, ask for the reason and a manual verification alternative.

**Verification checklist**
- Unit tests or local checks run
- UI or integration behavior validated
- Any warnings or TODOs captured

### 7) Capture reusable commands
Turn frequent tasks into custom commands stored at `.claude/commands/`.

**Example**
```text
/commit-push-pr
```

### 8) Extend with plugins
- Use plugin installs to scale specialist workflows (reviews, testing, design).
- Keep a short list of approved plugins so teams stay consistent.

### 9) Troubleshooting quick hits
- **Claude misses context** → add a short repo summary in CLAUDE.md.
- **Too many changes at once** → ask for smaller batches or a plan checkpoint.
- **Permissions blocked** → open `/permissions` and pre-allow the safe commands.

### 10) Example end-to-end session
```text
TASK: Add a dry-run flag to scripts/deploy.sh.
CONTEXT: scripts/deploy.sh handles prod deploys.
CONSTRAINTS: Do not change default behavior; keep bash only.
FILES TO TOUCH: scripts/deploy.sh
DEFINITION OF DONE:
- --dry-run prints actions without executing
- help text documents the flag
REQUEST: Provide a short plan, then implement.
```

**Expected response outline**
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
```

## References
- Claude Code official website: <https://claude.com/product/claude-code>
