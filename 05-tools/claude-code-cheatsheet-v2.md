---
title: "Claude Code Cheat Sheet v2.81"
tags: ["tools", "claude-code"]
last_updated: "2026-04-22"
---

# Claude Code Cheat Sheet v2.81

> **Version:** Claude Code v2.81 — as of **March 24, 2026**
>
> Available on: macOS · Windows · Linux

---

## Recent Changes

- `--bare` flag — minimal headless mode (no hooks/LSP/plugins)
- `--channels` — permission relay & MCP push messages (preview)
- `effort` frontmatter for skills & slash commands
- `/fork` renamed to `/branch` (alias kept)
- `SendMessage` auto-resumes stopped agents

---

## Keyboard Shortcuts

### General Controls

| Shortcut | Action |
|---|---|
| `Ctrl C` | Cancel input/generation |
| `Ctrl D` | Exit session |
| `Ctrl L` | Clear screen |
| `Ctrl G` | Toggle verbose output |
| `Ctrl R` | Reverse search history |
| `Ctrl G` | Open prompt in editor |
| `Ctrl B` | Background running task |
| `Ctrl T` | Toggle task list |
| `Ctrl V` | Paste image |
| `Ctrl F` | Kill background agents (×2) |
| `Esc Esc` | Rewind / undo |

### Mode Switching

| Shortcut | Action |
|---|---|
| `⇥ Tab` | Cycle permission modes |
| `⌥ P` | Switch model |
| `⌥ T` | Toggle thinking |

### Input

| Shortcut | Action |
|---|---|
| `\ Enter` | Newline (quick) |
| `Ctrl J` | Newline (control seq) |

### Prefixes

| Prefix | Action |
|---|---|
| `/` | Slash command |
| `!` | Direct bash |
| `@` | File mention + autocomplete |

### Session Picker

| Key | Action |
|---|---|
| `↑ ↓` | Navigate |
| `→ ←` | Expand/collapse |
| `P` | Preview |
| `R` | Rename |
| `/` | Search |
| `A` | All projects |
| `B` | Current branch |

---

## MCP Servers

### Add Servers

```bash
--transport http    # Remote HTTP (recommended)
--transport stdio   # Local process
--transport sse     # Remote SSE
```

### Scopes

- **Local** — `.claude.json` (per project)
- **Project** — `mcp.json` (shared/VCS)
- **User** — `~/.claude.json` (global)

### Manage

- `/mcp` — Interactive UI
- `claude mcp list` — List all servers
- `claude mcp serve` — CC as MCP server
- **Elicitation** — Servers request input mid-task **NEW**

---

## Slash Commands

### Session

| Command | Description |
|---|---|
| `/clear` | Clear conversation |
| `/compact [focus]` | Compact context |
| `/resume` | Resume/switch session |
| `/rename [name]` | Name current session |
| `/branch [name]` | Branch conversation (`/fork` alias) |
| `/cost` | Token usage stats |
| `/context` | Visualize context (grid) |
| `/diff` | Interactive diff viewer |
| `/copy` | Copy last response |
| `/export` | Export conversation |

### Config

| Command | Description |
|---|---|
| `/config` | Open settings |
| `/model [model]` | Switch model (← → effort) |
| `/fast [on\|off]` | Toggle fast mode |
| `/vim` | Toggle vim mode |
| `/theme` | Change color theme |
| `/permissions` | View/update permissions |
| `/effort [level]` | Set effort (low/med/high/max/auto) **NEW** |
| `/color [color]` | Set prompt-bar color |
| `/keybindings` | Customize keyboard shortcuts |
| `/terminal-setup` | Configure terminal keybindings |

### Tools

| Command | Description |
|---|---|
| `/init` | Create CLAUDE.md |
| `/memory` | Edit CLAUDE.md files |
| `/mcp` | Manage MCP servers |
| `/hooks` | Manage hooks |
| `/skills` | List available skills |
| `/agents` | Manage agents |
| `/chrome` | Chrome integration |
| `/reload-plugins` | Hot-reload plugins |
| `/add-dir <path>` | Add working directory |

### Special

| Command | Description |
|---|---|
| `/btw <question>` | Side question (no context) |
| `/plan [desc]` | Plan mode (+ auto-start) |
| `/loop [interval]` | Schedule recurring task |
| `/voice` | Push-to-talk voice (20 langs) |
| `/doctor` | Diagnose installation |
| `/pr-comments [PR]` | Fetch GitHub PR comments |
| `/stats` | Usage streaks & prefs |
| `/insights` | Analyze sessions report |
| `/desktop` | Continue in Desktop app |
| `/remote-control` | Bridge to claude.ai/code (rc) **NEW** |
| `/usage` | Plan limits & rate status |
| `/schedule` | Cloud scheduled tasks |
| `/security-review` | Security analysis of changes |
| `/help` | Show help + commands |
| `/feedback` | Submit feedback (alias: `/bug`) |
| `/release-notes` | View full changelog |
| `/stickers` | Order stickers! |

---

## Workflows & Tips

### Plan Mode

```
⇥ Tab    Normal → Auto-Accept → Plan
/permission-mode plan    Start in plan mode
```

### Thinking & Effort

| Action | Shortcut/Command |
|---|---|
| Toggle thinking on/off | `⌥ T` |
| Max effort for turn | `"ultrathink"` |
| See thinking (verbose) | `Ctrl 0` |
| Set effort | `/effort` O low · M med · H high **NEW** |

### Git Worktrees

| Flag/Command | Description |
|---|---|
| `--worktree name` | Isolated branch per feature |
| `isolation: worktree` | Agent in own worktree |
| `sparsePaths` | Checkout only needed dirs **NEW** |
| `--batch` | Auto-creates worktrees |

### Voice Mode

- `/voice` — Enable push-to-talk
- `Space (hold)` — Record, release to send
- **20 languages**: EN, ES, FR, DE, CZ, PL…

### Context Management

| Command | Description |
|---|---|
| `/context` | Usage + optimization tips |
| `/compact [focus]` | Compress with focus |
| **Auto-compact** | ~95% capacity |
| **1M context** | Opus 4.6 (Max/Team/Ent) |
| **CLAUDE.md** | Survives compaction! |

### Session Power Moves

| Command | Description |
|---|---|
| `claude -c` | Continue last conv |
| `claude -r "name"` | Resume by name |
| `/btw question` | Side Q, no context cost |
| `--background: true` | Background task |

---

## Skills & Agents

### Built-in Skills

| Skill | Description |
|---|---|
| `/simplify` | Code review (3 parallel agents) |
| `/batch` | Large parallel changes (5–30 worktrees) |
| `/debug [desc]` | Troubleshoot from debug log |
| `/loop [interval]` | Recurring scheduled task |
| `/claude-api` | Load API + SDK reference |

### Custom Skill Locations

- `.claude/skills/<name>/` — Project skills
- `~/.claude/skills/<name>/` — Personal skills

### Skill Frontmatter

| Key | Purpose |
|---|---|
| `description` | Auto-invocation trigger |
| `allowed-tools` | Skip permission prompts |
| `model` | Override model for skill |
| `context: fork` | Run in subagent |
| `effort` | Override effort level **NEW** |
| `$ARGUMENTS` | User input placeholder |
| `${CLAUDE_SKILL_DIR}` | Skill's own directory |
| `!'cmd'` | Dynamic context injection |

### Built-in Agents

| Agent | Description |
|---|---|
| **Explore** | Fast read-only (Haiku) |
| **Plan** | Research for plan mode |
| **General** | Full tools, complex tasks |
| **Bash** | Terminal separate context |

### Agent Frontmatter

| Key | Description |
|---|---|
| `permissionMode` | default/acceptEdits/plan/dontAsk/bypass |
| `isolation: worktree` | Run in git worktree |
| `memory: user\|project` | Persistent memory |
| `background: true` | Background task |
| `maxTurns` | Limit agentic turns |
| `SendMessage` | Resume agents (replaces resume) **NEW** |

---

## Memory & Files

### CLAUDE.md Locations

| Path | Scope |
|---|---|
| `./CLAUDE.md` | Project (team-shared) |
| `~/.claude/CLAUDE.md` | Personal (all projects) |
| `/etc/claude-code/` | Managed (org-wide) |

### Rules & Import

| Syntax | Purpose |
|---|---|
| `.claude/rules/*.md` | Project rules |
| `~/.claude/rules/*.md` | User rules |
| `paths:` frontmatter | Path-specific rules |
| `@path/to/file` | Import in CLAUDE.md |

### Auto Memory

```
~/.claude/projects/<proj>/memory/
MEMORY.md + topic files, auto-loaded
```

---

## Config & Environment

### Config Files

| File | Scope |
|---|---|
| `~/.claude/settings.json` | User settings |
| `.claude/settings.json` | Project (shared) |
| `.claude/settings.local.json` | Local only |
| `~/.claude.json` | OAuth, MCP, state |
| `.mcp.json` | Project MCP servers |

### Key Settings

| Setting | Description |
|---|---|
| `modelOverrides` | Map model picker → custom IDs |
| `autoMemoryDirectory` | Custom memory dir |
| `worktree.sparsePaths` | Sparse checkout dirs **NEW** |

### Key Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | API key |
| `ANTHROPIC_MODEL` | Model override |
| `CLAUDE_CODE_EFFORT_LEVEL` | low/med/high |
| `MAX_THINKING_TOKENS` | 0=off |
| `ANTHROPIC_CUSTOM_MODEL_OPTION` | Custom model entry |
| `CLAUDE_CODE_PLUGIN_SEED_DIR` | Multiple plugin seed dirs |
| `CLAUDECODE` | Detect CC shell (=1) |
| `IS_DEMO` | Demo mode (hide email/org) |

---

## CLI & Flags

### Core Commands

```bash
claude                  # Interactive
claude "q"              # With prompt
claude -p "q"           # Headless
claude -c               # Continue last
claude -r "n"           # Resume
claude update           # Update
```

### Key Flags

| Flag | Description |
|---|---|
| `--model` | Set model |
| `-w` | Git worktree |
| `-n / --name` | Session name |
| `--add-dir` | Add dir |
| `--agent` | Use agent |
| `--allowedTools` | Pre-approve |
| `--output-format` | json/stream |
| `--json-schema` | Structured output |
| `--max-turns` | Limit turns |
| `--max-budget-usd` | Cost cap |
| `--console` | Auth via Anthropic Console |
| `--verbose` | Verbose |
| `--bare` | Minimal headless (no hooks/LSP) **NEW** |
| `--channels` | Permission relay & MCP push **NEW** |
| `--effort` | low/med/high/max |
| `--permission-mode` | plan/default/… |
| `--dangerously-skip-permissions` | Skip all prompts ⚠ |
| `--chrome` | Chrome |

---

## References

The following pages from this repository are relevant to this cheat sheet:

### Claude Code Guides

- [Claude Code Tool Guide](./claude-code-tool-guide.md) — Comprehensive guide to Claude Code capabilities and usage
- [Claude Code Cheatsheet Tutorial](./claude-code-cheatsheet-tutorial.md) — Earlier cheatsheet reference (pre-v2.81)
- [Claude Code Project Structure Tutorial](./claude-code-project-structure-tutorial.md) — Best practices for organizing projects in Claude Code
- [Claude Code Certification Guide](./claude-code-certification-guide.md) — Certification path for Claude Code proficiency
- [Claude Code NotebookLM Integration Tutorial](./claude-code-notebooklm-integration-tutorial.md) — Guide for integrating Claude Code with NotebookLM
- [Claude.ai vs Code vs Cowork](./claude-ai-vs-code-vs-cowork.md) — Comparison of Claude.ai, Claude Code, and Cowork tools
- [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) — Guide for building custom skills with Claude

### AI Agents & MCP

- [MCP Guide](../02-ai-agents/mcp-guide.md) — Model Context Protocol guide for building tool integrations
- [AI Agents Overview](../02-ai-agents/ai-agents-overview.md) — Foundational overview of agent design, capabilities, types
- [Claude Agent Skills](../02-ai-agents/claude-agent-skills.md) — Playbook for building and deploying Claude agent skills
- [Context Engineering](../02-ai-agents/context-engineering.md) — Techniques for designing and managing context in agents
- [A2A Protocol Guide](../02-ai-agents/a2a-protocol-guide.md) — Agent-to-Agent communication protocol documentation
- [Models for AI Agents 2026](../02-ai-agents/models-for-ai-agents-2026.md) — 2026 model landscape guide for agent implementations

### Coding & Spec-Driven Development

- [Spec-Driven Development Tutorial](./spec-driven-development-tutorial.md) — Tutorial for spec-driven development approach
- [Spec-Driven Development AI Tutorial](./spec-driven-development-ai-tutorial.md) — AI-specific spec-driven development guide
- [Coding AI Agent Selection Tutorial](./coding-ai-agent-selection-tutorial.md) — Framework for selecting appropriate coding AI agents
- [AI Tool Chaining](./ai-tool-chaining-oct-2025.md) — Chaining multiple AI tools together

### Prompt Patterns

- [Role-Constraint-Format](../03-prompts-and-patterns/role-constraint-format.md) — Core prompting pattern for structured outputs
- [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md) — Catalog of established prompt patterns
