---
title: "Claude Code MCP Setup: Perplexity, Firecrawl, and Chrome DevTools"
tags: ["tools", "claude-code", "mcp", "perplexity", "firecrawl", "chrome-devtools"]
last_updated: "2026-07-15"
---

# The 3 MCP Servers Every Claude Code User Hears About — and How to Set Them Up

A step-by-step tutorial for connecting **Perplexity**, **Firecrawl**, and **Chrome DevTools**
to Claude Code (desktop app or CLI) via the Model Context Protocol.

---

## TL;DR — the three commands

If you already have Node.js, a Perplexity API key, and a Firecrawl API key, this is the
whole setup (run in a terminal, from any project folder):

```bash
# 1. Perplexity — real-time web search, deep research, reasoning
claude mcp add perplexity -s user --env PERPLEXITY_API_KEY=pplx-your_key_here \
  -- npx -y @perplexity-ai/mcp-server

# 2. Firecrawl — web scraping, crawling, structured extraction
claude mcp add firecrawl -s user --env FIRECRAWL_API_KEY=fc-your_key_here \
  -- npx -y firecrawl-mcp

# 3. Chrome DevTools — drive and inspect a real Chrome browser (no API key)
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest
```

Verify with `claude mcp list` (each server should show `✓ Connected`), then start a new
Claude Code session and type `/mcp` to see the connected servers and their tools.

The rest of this tutorial explains what each server actually adds, how to get the API keys,
what the flags mean, how the desktop app fits in, and how to troubleshoot.

---

## First, a naming disambiguation

Two similarly named apps confuse almost everyone setting up MCP:

| App | What it is | MCP config lives in |
|---|---|---|
| **Claude Code desktop app** (and CLI) | The agentic coding tool. Desktop app (Mac/Windows), CLI, and IDE extensions share one configuration | `~/.claude.json` (user/local scopes) and `.mcp.json` in a project root (project scope) |
| **Claude Desktop** | The general chat app | `claude_desktop_config.json` |

This tutorial targets **Claude Code**. The desktop app and the CLI read the same MCP
configuration, so you run the `claude mcp add` commands once in any terminal and the servers
are available in the desktop app, the CLI, and the IDE extensions alike. (If you already
configured servers in the *Claude Desktop chat app*, `claude mcp add-from-claude-desktop`
imports them — macOS and WSL only.)

---

## Do you actually need these three?

The "3 MCPs everyone should install" advice circulates widely, so here is the honest version.
Claude Code already ships with built-in `WebSearch` and `WebFetch` tools, so basic "look this
up online" works with zero setup. What each MCP server genuinely adds:

| Server | What it adds over the built-ins | Skip it if… |
|---|---|---|
| **Perplexity** | Multi-source *synthesized* research with citations via Sonar models: quick search, deep research reports, and search-grounded reasoning as separate tools | Built-in WebSearch already covers your lookup needs and you don't want another paid API |
| **Firecrawl** | Industrial-strength scraping: JavaScript-rendered pages, whole-site crawling, site mapping, structured data extraction to a JSON schema, batch operations | You only occasionally fetch single, mostly static pages (WebFetch handles those) |
| **Chrome DevTools** | Something the built-ins can't do at all: control and *inspect* a live Chrome — click, fill forms, read console errors, analyze network requests, record performance traces, take screenshots | You never do frontend work or browser-based verification |

A reasonable rule: **Chrome DevTools** is the clearest win for anyone building web apps
(it closes the loop of "Claude writes frontend code but can't see the result"). **Firecrawl**
earns its place when your work involves scraping or monitoring websites. **Perplexity** is
the most optional of the three — excellent for research-heavy workflows, redundant if you
rarely leave the codebase.

Also worth knowing: every connected MCP server adds tool definitions that consume context.
Claude Code mitigates this with on-demand tool search, but the principle stands — connect
servers you use, disconnect ones you don't.

---

## Prerequisites

1. **Claude Code** installed (desktop app or CLI) and signed in. Check the CLI is on your
   PATH with `claude --version` — the desktop app installs it alongside.
2. **Node.js** — a current LTS release (v22+ recommended; Chrome DevTools MCP targets
   current LTS). Check with `node --version`. All three servers run via `npx`, which ships
   with Node.
3. **Google Chrome** (current stable) — only needed for the Chrome DevTools server.
4. **API keys** for Perplexity and Firecrawl (walkthrough in each section below).
   Chrome DevTools MCP needs no key.

### Understand scopes before you add anything

`claude mcp add` stores configuration at one of three scopes (`-s` / `--scope`):

| Scope | Loads in | Shared with team | Stored in |
|---|---|---|---|
| `local` (default) | Current project only | No | `~/.claude.json` |
| `project` | Current project only | Yes — via `.mcp.json` in the repo | `.mcp.json` in project root |
| `user` | **All your projects** | No | `~/.claude.json` |

The commands in this tutorial use `-s user` because these three are general-purpose utility
servers you'll likely want everywhere. Drop the flag if you'd rather scope them to one
project, or use `-s project` to share the config with teammates via version control
(see [Team setup](#team-setup-share-via-mcpjson) below for how to do that *without*
committing your API keys).

One CLI syntax rule to internalize now: the `--` (double dash) separates Claude's own
options (`--env`, `--scope`, `--transport`) from the command that launches the server.
Everything after `--` is passed to the server untouched.

---

## MCP #1: Perplexity — search, research, and reasoning

The official server from Perplexity AI wraps their Sonar API family into four tools:

| Tool | Backing model | Use for |
|---|---|---|
| `perplexity_search` | Search API | Fast, direct web search results |
| `perplexity_ask` | `sonar-pro` | Conversational Q&A with real-time web grounding |
| `perplexity_research` | `sonar-deep-research` | Deep multi-source research reports with citations |
| `perplexity_reason` | `sonar-reasoning-pro` | Reasoning tasks that need current web knowledge |

### Step 1 — Get an API key

1. Sign in at [perplexity.ai](https://www.perplexity.ai/) and open the
   [API Portal](https://www.perplexity.ai/account/api/group).
2. Add a payment method and buy a small amount of pay-as-you-go credits (the API is
   prepaid — no subscription required; new accounts often receive trial credits).
3. Generate an API key and **copy it immediately** — it won't be shown again.

### Step 2 — Add the server

```bash
claude mcp add perplexity -s user --env PERPLEXITY_API_KEY=pplx-your_key_here \
  -- npx -y @perplexity-ai/mcp-server
```

Optional environment variables if you need them: `PERPLEXITY_TIMEOUT_MS` (request timeout,
default 5 min), `PERPLEXITY_PROXY` (corporate networks), `PERPLEXITY_LOG_LEVEL`.

Alternatively, Perplexity ships a Claude Code **plugin** that bundles the same server:

```text
/plugin marketplace add perplexityai/modelcontextprotocol
/plugin install perplexity
```

### Step 3 — Verify and test

```bash
claude mcp list        # expect: perplexity … ✓ Connected
```

Then in a Claude Code session, try:

> Use perplexity_research to summarize the current state of CSS container queries —
> browser support, common patterns, and gotchas. Include citations.

**Cost note:** every call bills your Perplexity API credits (per-token plus a per-request
search fee on some models). `perplexity_research` is the most expensive tool of the four —
point Claude at `perplexity_search` or `perplexity_ask` for routine lookups.

---

## MCP #2: Firecrawl — scraping, crawling, extraction

The official [Firecrawl MCP server](https://github.com/firecrawl/firecrawl-mcp-server)
turns "read this website" into a first-class capability. Headline tools:

| Tool | What it does |
|---|---|
| `firecrawl_scrape` | Extract one page as clean markdown/JSON — handles JavaScript rendering |
| `firecrawl_map` | Discover all URLs on a site |
| `firecrawl_crawl` | Multi-page extraction with depth control |
| `firecrawl_search` | Web search with optional page-content extraction |
| `firecrawl_extract` | Structured data extraction against a JSON schema |
| `firecrawl_agent` | Autonomous multi-step web research |
| `firecrawl_interact` | Browser interactions (click, type, navigate) on the scraped page |

### Step 1 — Get an API key

1. Sign up at [firecrawl.dev](https://www.firecrawl.dev/) — the free tier includes
   500 credits (roughly 500 scraped pages).
2. Copy your key (starts with `fc-`) from
   [firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys).

### Step 2 — Add the server

```bash
claude mcp add firecrawl -s user --env FIRECRAWL_API_KEY=fc-your_key_here \
  -- npx -y firecrawl-mcp
```

**No-key alternative:** Firecrawl also hosts a remote HTTP endpoint with a rate-limited
keyless tier (`scrape`, `search`, and `interact` only — `crawl`, `map`, `extract`, and
`agent` still need a key):

```bash
# Keyless (rate-limited)
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp

# Remote with your key baked into the URL
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/fc-your_key_here/v2/mcp
```

The remote option means no local Node process; the local `npx` option keeps your key out
of any URL. Pick one — don't register both under the same name.

Self-hosting Firecrawl? Point the local server at your instance with
`--env FIRECRAWL_API_URL=https://firecrawl.your-domain.com`.

### Step 3 — Verify and test

```bash
claude mcp list        # expect: firecrawl … ✓ Connected
```

Test prompt:

> Use firecrawl to scrape https://docs.firecrawl.dev/introduction and give me a
> three-bullet summary of what the service does.

**Cost note:** each operation consumes Firecrawl credits (a crawl of a large site can eat
many at once — ask Claude to `firecrawl_map` first and crawl selectively). Free tier is
500 credits; paid plans start around $16/month.

---

## MCP #3: Chrome DevTools — give Claude eyes on the browser

[`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) is Google's
official MCP server that exposes Chrome DevTools capabilities to coding agents via Puppeteer
and the Chrome DevTools Protocol. This is the one that changes frontend workflows the most:
Claude can open your dev server, click through the UI, read console errors, inspect network
requests, and record performance traces — instead of guessing whether its code worked.

Tool categories (30+ tools): input automation (click, drag, fill, upload), navigation,
screenshots and snapshots, console message reading, network request analysis, performance
tracing and insights, device/network emulation, and memory analysis.

### Step 1 — Prerequisites

- Node.js current LTS (v22+ recommended)
- Google Chrome, current stable (the server can also download Chrome for Testing)
- No API key needed

### Step 2 — Add the server

```bash
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest
```

Useful flags (append after `chrome-devtools-mcp@latest`):

| Flag | Purpose |
|---|---|
| `--headless` | Run Chrome without a visible window (CI, background checks) |
| `--isolated` | Temporary profile, auto-cleaned on exit — **recommended**: keeps your logged-in browsing profile away from the agent |
| `--channel canary\|beta\|dev` | Use a different Chrome channel |
| `--browser-url http://127.0.0.1:9222` | Attach to an already-running Chrome you started with a debugging port |
| `--no-usage-statistics` | Opt out of usage-statistics collection (on by default) |

Example with flags:

```bash
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest --isolated
```

Google also publishes it as a Claude Code **plugin** that bundles the MCP server plus
browser-automation skills:

```text
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
```

### Step 3 — Verify and test

Start a new session and try the official smoke test:

> Check the performance of https://developers.chrome.com

Chrome should launch, record a trace, and Claude reports the performance insights. Other
good first prompts:

> Open http://localhost:3000, click through the signup flow, and tell me about any
> console errors or failed network requests.

> Take a screenshot of the pricing page at 375px width and check for layout overflow.

### Security notes specific to this server

- The server **exposes browser content to the MCP client** — everything visible in that
  Chrome instance can be read (and modified) by the agent. Don't point it at a profile
  with sensitive logged-in sessions; prefer `--isolated`.
- Since Chrome 136, Chrome **blocks remote debugging on your default profile** (an
  anti-cookie-theft measure). The MCP server handles this by launching its own profile.
  If you specifically need your logged-in state (e.g. testing behind auth), start Chrome
  yourself with `--remote-debugging-port=9222 --user-data-dir=/path/to/separate-profile`
  and connect via `--browser-url` — never reuse your daily-driver profile.
- Pages the agent browses are untrusted input: a malicious page can attempt prompt
  injection against Claude. Keep permission prompts on for consequential actions and be
  deliberate about which sites you send the agent to.

---

## Managing your servers

Everyday commands:

```bash
claude mcp list                 # all servers + connection health
claude mcp get perplexity       # details for one server
claude mcp remove perplexity    # remove (from the scope it was added to)
```

Inside a session, `/mcp` shows each connected server, its tool count, and handles OAuth
authentication for remote servers that need it.

New servers connect when a session starts — if you added one while a session was open,
start a new session (or in the desktop app, a new conversation) to pick it up.

### Team setup: share via `.mcp.json`

To give your whole team the same servers, commit a `.mcp.json` at the project root
(that's what `--scope project` writes). Use `${VAR}` expansion so the *config* is shared
but each developer supplies their **own** key from their environment — never commit keys:

```json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": { "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}" }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--isolated"]
    }
  }
}
```

Each developer exports the keys in their shell profile
(`export PERPLEXITY_API_KEY=pplx-…`). Claude Code prompts each user to approve
project-scoped servers from `.mcp.json` on first use — a sensible safety check, since a
cloned repo shouldn't silently launch processes.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `✗ Failed to connect` in `claude mcp list` | Run the server manually (`npx -y firecrawl-mcp`) to see the real error; usually a missing/old Node (`node --version`) or a typo'd env var |
| Server never appears in `/mcp` | New servers connect at session start — open a new session. Also check you added it in the right scope for the project you're in (`claude mcp get <name>`) |
| Slow startup / timeout on first run | First `npx` run downloads the package. Start it once manually, or raise the startup timeout: `MCP_TIMEOUT=20000 claude` |
| Windows (native, not WSL): npx servers won't start | Wrap the command: `claude mcp add <name> -- cmd /c npx -y <package>` |
| Perplexity returns 401 | Key wrong/revoked, or your prepaid credits ran out — check the API portal |
| Firecrawl returns 402/429 | Out of credits or rate-limited (keyless tier is heavily rate-limited) — check [firecrawl.dev/app](https://www.firecrawl.dev/app) |
| Chrome doesn't launch | Ensure current stable Chrome is installed; try `--channel stable` explicitly, or `--headless` on servers/CI |
| Project `.mcp.json` server stuck at "Pending approval" | Run `claude` interactively in that folder and accept the approval dialog (and the workspace trust dialog on first open) |
| Server name rejected | Names may only contain letters, numbers, hyphens, underscores; some names (`workspace`, `computer-use`, …) are reserved by Claude Code |

---

## Key takeaways

1. **One config, every surface.** `claude mcp add` once in a terminal; the desktop app,
   CLI, and IDE extensions all share it. Use `-s user` for personal everywhere-tools,
   `.mcp.json` + `${VAR}` expansion for teams.
2. **The trio covers three distinct gaps:** synthesized research with citations
   (Perplexity), heavy-duty scraping and structured extraction (Firecrawl), and live
   browser control with real DevTools telemetry (Chrome DevTools).
3. **They're not all mandatory.** Claude Code's built-in WebSearch/WebFetch already covers
   casual lookups. Chrome DevTools is the biggest capability jump for web developers;
   the other two earn their context cost only if you research and scrape regularly.
4. **Mind the keys and the credits.** Perplexity and Firecrawl are metered APIs — keep
   keys out of version control, and know which tools are the expensive ones
   (`perplexity_research`, `firecrawl_crawl`).
5. **Treat the browser as an untrusted boundary.** Run Chrome DevTools MCP with
   `--isolated`, never against your logged-in daily profile, and remember that scraped or
   browsed pages are untrusted input to the model.

---

## Related

- [Claude Code Plugins Tutorial](claude-code-plugins-tutorial.md) — plugins are the other
  distribution channel for MCP servers (two of the three above ship as plugins too).
- [Claude Code Tool Guide](claude-code-tool-guide.md) — the broader Claude Code workflow
  this setup plugs into.
- [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md) —
  the same "audit before you install" habit applies to MCP servers from unknown authors.

---

## Sources

- [Claude Code docs — Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)
- [Perplexity — MCP Server documentation](https://docs.perplexity.ai/docs/getting-started/integrations/mcp-server)
- [Perplexity MCP server (GitHub, official)](https://github.com/perplexityai/modelcontextprotocol)
- [Firecrawl MCP server (GitHub, official)](https://github.com/firecrawl/firecrawl-mcp-server)
- [Firecrawl — MCP for AI agents](https://www.firecrawl.dev/use-cases/ai-mcps)
- [Chrome DevTools MCP (GitHub, official)](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome for Developers — Chrome DevTools for agents](https://developer.chrome.com/docs/devtools/agents)
- [Model Context Protocol — introduction](https://modelcontextprotocol.io/introduction)
