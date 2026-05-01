---
title: "Claude Code Plugins Tutorial"
tags: ["tools", "claude-code", "plugins", "mcp"]
last_updated: "2026-05-01"
---

# 10 Claude Code Plugins That Give You Superpowers

A practical guide to the plugins worth installing — and the CLI commands to add them.

---

## The Standalone Five

These five plugins work independently and are not replaced by IJFW (see below).

---

### 1. Context7 (Upstash)

**Category:** Documentation / Accuracy

Pulls live, version-specific docs from source repos and injects them into your prompts. Keeps Claude from hallucinating outdated APIs.

**Install via Marketplace or CLI:**

```bash
claude /plugin install context7
```

**Or add as an MCP server in your project config:**

```bash
claude mcp add context7 npx @upstash/context7-mcp
```

**Source:** [github.com/upstash/context7](https://github.com/upstash/context7)

---

### 2. Ralph Loop

**Category:** Autonomous Development

Autonomous self-referential development loop. Claude iterates using files and git history until the task is complete — no hand-holding required.

```bash
claude /plugin install ralph-loop
```

**Source:** [github.com/anthropics/claude-code/tree/main/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)

---

### 3. GitHub MCP

**Category:** Repo Management

Create issues, manage PRs, review code, and search repos — all from the terminal without switching to a browser.

```bash
claude /plugin install github-mcp
```

**Or add via MCP directly:**

```bash
claude mcp add github-mcp npx @modelcontextprotocol/server-github
```

Set your token:

```bash
export GITHUB_TOKEN=your_token_here
```

**Source:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

---

### 4. Playwright (Microsoft)

**Category:** Testing / Browser Automation

Browser automation and end-to-end testing. Claude launches real Chrome, navigates pages, fills forms, and verifies UI behaviour.

```bash
claude /plugin install playwright
```

**Source:** [github.com/anthropics/claude-code/tree/main/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)

---

### 5. Chrome DevTools MCP

**Category:** Debugging

Full debugging access to a live Chrome session — network requests, console errors, DOM inspection — without leaving Claude Code.

**Add as MCP server:**

```bash
claude mcp add chrome-devtools npx @anthropic/chrome-devtools-mcp
```

Then launch Chrome with the remote debugging port open:

```bash
google-chrome --remote-debugging-port=9222
```

**Source:** [github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts)

---

## The Five That IJFW Replaces

These five are solid plugins on their own. IJFW (see below) bundles them into a single connected system where the engines share context with each other.

---

### 6. Superpowers

**Category:** Brainstorming / Orchestration / TDD

Adds skill authoring, subagent orchestration, code review, debugging, and test-driven development workflows to Claude Code.

```bash
claude /plugin install superpowers
```

**Source:** [github.com/obra/superpowers](https://github.com/obra/superpowers)

---

### 7. GSD — Get Sh*t Done

**Category:** Spec-Driven Development

Orchestrates sub-agents through structured specifications using a plan → execute → verify → ship spine.

```bash
claude /plugin install gsd
```

**Source:** [github.com/anthropics/claude-code/tree/main/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)

---

### 8. MemClaw

**Category:** Persistent Memory

Stores architecture decisions, coding conventions, task progress, and session history across conversations. Imports from `claude-mem`.

```bash
claude /plugin install memclaw
```

**Or import existing claude-mem data:**

```bash
claude /plugin install memclaw --import claude-mem
```

---

### 9. Frontend Design

**Category:** UI / Design Quality

Generates production-grade UI — bold typography, real colour palettes, creative layouts — avoiding the generic "AI aesthetic".

```bash
claude /plugin install frontend-design
```

**Source:** [github.com/anthropics/claude-code/blob/main/plugins/frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design)

---

### 10. PR Review Toolkit

**Category:** Code Review

Runs multiple specialised review agents in parallel covering bugs, tests, error handling, type design, and code quality, then produces a consolidated report.

```bash
claude /plugin install pr-review-toolkit
```

**Source:** [github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit](https://github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit)

---

## The All-in-One: IJFW (It Just F*cking Works)

One install. Seven connected engines. Replaces plugins 6–10 and does each job better because the engines share context.

| Engine | Replaces |
|---|---|
| Token Economy | Six compounding cost levers, 97% cache efficiency |
| Disciplined Workflow | Superpowers + GSD |
| Connected Memory | MemClaw |
| Multi-AI Trident | PR Review Toolkit |
| Design Contract | Frontend Design |
| Custom Agent Teams | Auto-generated per project |
| Always-On Updates | Cross-platform status card |

**Install:**

```bash
npm install -g @ijfw/install && ijfw-install
```

**Privacy:** Zero telemetry, zero cloud, zero account. All memory is plain markdown. MCP server is stdio only — no sockets, no daemon.

**Cost:** Free. MIT License. Bring your own AI keys. Cross-agent budget cap: $2/session (configurable).

**Source:** [github.com/TheRealSeanDonahoe/ijfw](https://github.com/TheRealSeanDonahoe/ijfw)

---

## Quick Reference

| # | Plugin | Install Command | Category |
|---|---|---|---|
| 1 | Context7 | `claude /plugin install context7` | Documentation |
| 2 | Ralph Loop | `claude /plugin install ralph-loop` | Autonomous Dev |
| 3 | GitHub MCP | `claude /plugin install github-mcp` | Repo Management |
| 4 | Playwright | `claude /plugin install playwright` | Testing |
| 5 | Chrome DevTools MCP | `claude mcp add chrome-devtools npx @anthropic/chrome-devtools-mcp` | Debugging |
| 6 | Superpowers | `claude /plugin install superpowers` | Orchestration |
| 7 | GSD | `claude /plugin install gsd` | Spec-Driven Dev |
| 8 | MemClaw | `claude /plugin install memclaw` | Memory |
| 9 | Frontend Design | `claude /plugin install frontend-design` | UI Quality |
| 10 | PR Review Toolkit | `claude /plugin install pr-review-toolkit` | Code Review |
| — | IJFW (replaces 6–10) | `npm install -g @ijfw/install && ijfw-install` | All-in-One |

---

## Managing Plugins

```bash
# List installed plugins
claude /plugin list

# Remove a plugin
claude /plugin remove <plugin-name>

# Update all plugins
claude /plugin update

# View plugin details
claude /plugin info <plugin-name>

# Manage MCP servers
claude /mcp
```
