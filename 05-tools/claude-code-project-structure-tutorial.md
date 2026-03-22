# Claude Code Project Structure Tutorial

You won't need any other project structure for Claude Code. Just this one. This definitive guide covers where skills go, how to organize hooks and MCP servers, and explains the 6 extension types alongside memory file workflows.

---

## 1. Project Overview
Complete Claude Code workspace with skills, Hooks, MCP Servers, Subagents, and Plugins designed for production AI-assisted development.

### The 4-Layer Architecture
- **L1 - `CLAUDE.md`**: Persistent context and rules
- **L2 - Skills**: Auto-invoked knowledge packs
- **L3 - Hooks**: Safety gates and automation
- **L4 - Agents**: Subagents with their own context

---

## 2. Recommended Project File Structure
Here is the complete file tree for a production Claude Code workspace:

```text
my_project/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── settings.local.json
│   ├── commands/
│   │   ├── review.md
│   │   ├── deploy.md
│   │   ├── test-all.md
│   │   └── bootstrap.md
│   ├── skills/
│   │   ├── code-review/
│   │   │   ├── SKILL.md
│   │   │   ├── scripts/
│   │   │   ├── references/
│   │   │   └── assets/
│   │   ├── text-writer/
│   │   │   └── SKILL.md
│   │   ├── security-audit/
│   │   │   └── SKILL.md
│   │   └── refactor/
│   │       └── SKILL.md
│   ├── agents/
│   │   ├── code-reviewer.yml
│   │   ├── test-writer.yml
│   │   ├── security-auditor.yml
│   │   └── devops-sre.yml
│   └── plugins/
│       ├── manifest.json
│       └── my-plugin/
├── .mcp.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── database.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── onboarding.md
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── seed.db.sh
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── Dockerfile
└── README.md
```

### Key Components
- `CLAUDE.md`: Project memory
- `.claude/`: Config & extensions
- `commands/`: Slash commands
- `skills/`: Auto-activated skills
- `.mcp.json`: MCP server config
- `agents/`: Subagent definitions

---

## 3. Extension Types
- **Skills**: Auto-activate on task match
- **Hooks**: Lifecycle event scripts
- **MCP**: External tool connections
- **Subagents**: Isolated parallel work
- **Agent Teams**: Multi-agent coordination
- **Plugins**: Bundled distributable setups

---

## 4. Understanding Memory Hierarchy

### `CLAUDE.md` Essentials
`CLAUDE.md` serves as Claude's persistent memory, loaded automatically at the start of every session.
- **WHAT**: Tech stack, Directory map, Architecture
- **WHY**: Purpose of each module, Design decisions
- **HOW**: Build/test/lint commands, Workflows, Gotchas

Your project memory should capture:
1. Project conventions & style guide
2. Tech stack & architecture overview
3. Testing requirements & patterns
4. Git workflow & branch strategy
5. Security & compliance rules
6. File naming & folder conventions
7. Review checklist before commits

**Memory File Hierarchy Rules:**
- `~/.claude/CLAUDE.md`: Global - all projects
- `~/CLAUDE.md`: Parent - monorepo root
- `./CLAUDE.md`: Project - shared on git
- `./frontend/CLAUDE.md`: Subfolder - scoped context

*Keep each file <200 lines. Subfolder files append context. Never overwrite parent context.*

### CLAUDE.md Template Example
```markdown
# Project: MyApp

## Tech Stack
- Next.js 14, TypeScript, Tailwind
- Supabase for auth & database
- Prisma ORM, tRPC API layer

## Conventions
- Always write tests before code
- Use conventional commits
- Never commit directly to main
- Run lint + typecheck before PR

## Architecture
- src/components - React components
- src/services   - Business logic
- src/utils      - Shared helpers

## Security
- No secrets in code or logs
- Validate all user inputs
- Use parameterized queries only
```

---

## 5. Skills Structure (The Superpower)
Skills are markdown guides that Claude auto-invokes via natural language.

### Standard Skill Directory
- `SKILL.md`: Instructions & metadata
- `scripts/`: Executable automation
- `references/`: Docs loaded on demand
- `assets/`: Templates & static files

### Example `SKILL.md`
```markdown
---
name: testing patterns
description: Jest testing patterns
allowed_tools: Read, Grep, Glob
---

# Testing Patterns
Use describe + it + AAA pattern
Use factory mocks
```
*Tip: The `description` field is critical for auto-activation.*

### Skill Ideas for AI Engineers
- `code-review`
- `testing-patterns`
- `commit-messages`
- `docker-deploy`
- `codebase-visualizer`
- `api-design`

---

## 6. Configuring Hooks and MCP

### Hook Events
Hooks are deterministic callbacks that govern execution.
- `PreToolUse`: Block before execution (e.g., check safety)
- `PostToolUse`: Auto lint after writes
- `SessionStart`: Load context on launch
- `SessionEnd`: Save session summaries
- `PreCommit`: Secret detection
- `Notification`: Slack/webhook alerts

Exit codes dictate behavior: `0` -> allow, `2` -> block.

### `settings.json` Structure
```json
{
  "permissions": {
    "allow": ["Read:*", "Bash:git:*", "Write:*.md"],
    "deny": ["Read:env:*", "Bash:sudo:*"]
  },
  "hooks": {
    "PreToolUse": [{"matcher": "Book", "hooks": [{"type": "command", "command": "scripts/sec.sh", "timeout": 5}]}],
    "PostToolUse": [{"matcher": "Write", "hooks": [{"type": "command", "command": "npm run lint"}]}]
  },
  "env": {
    "MAX_THINKING_TOKENS": "18000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
```

### Popular MCP Servers
Configure via `.mcp.json`:
- **GitHub**: PRs, issues, repos
- **JIRA/Linear**: Ticket workflows
- **Slack**: Notifications & search
- **PostgreSQL**: Direct queries
- **Playwright**: Browser automation
- **Filesystem**: Scoped file access

**.mcp.json Example:**
```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

---

## 7. Daily Workflow & Cheatcodes

### Getting Started
1. `npm i -g @anthropic-ai/claude-code`
2. `cd your_project && claude`
3. Generate memory: `/init`
4. Add slash commands in `.claude/commands/`
5. Configure MCP in `.mcp.json`
6. Add skills as workflows grow

### Context Management
- **0-60% context**: Work freely
- **50-70%**: Monitor usage
- **70-80%**: Run `/compact`
- **80%+**: `/clear` mandatory

### Daily Workflow Pattern
1. `cd project && claude`
2. `Shift + Tab + Tab` -> Plan Mode
3. Describe feature intent
4. `Shift + Tab` -> Auto Accept
5. `/compact` periodically
6. `Esc Esc` -> rewind if needed
7. Commit frequently
8. Start new session per feature

### Quick Reference Commands
- `/init`: Generate `CLAUDE.md`
- `/doctor`: Check installation
- `/compact`: Compress context
- `Shift + Tab`: Change modes
- `Tab`: Toggle extended thinking
- `Esc Esc`: Rewind menu

---

## 8. Best Practices for Claude Code
- **Iterative Development**: Start small, test frequently
- **Clear Skill Documentation**: Describe skill purpose & usage
- **Modular Skill Design**: Break down complex tasks
- **Secure Secret Handling**: Use environment variables, not code
- **Regular Testing & Auditing**: Ensure skills remain reliable

---

## 9. Related Resources
- **[Claude Agent Skills Playbook](../02-ai-agents/claude-agent-skills.md)** — Dive deeper into building reusable workflows.
- **[Claude AI vs Claude Code vs Claude Cowork](claude-ai-vs-code-vs-cowork.md)** — Understand which tool fits your specific use case.
- **[Claude Code Tool Guide](claude-code-tool-guide.md)** — Explore additional automation commands and configurations.
- **[Claude Code Cheatsheet Tutorial](claude-code-cheatsheet-tutorial.md)** — Keep the essential commands handy.
- **[Model Context Protocol (MCP) Guide](../02-ai-agents/mcp-guide.md)** — Learn how to configure robust external tool connections.

## References
- Claude Code product page: <https://claude.com/product/claude-code>
- [Everything Claude Code (GitHub)](https://github.com/affaan-m/everything-claude-code)
