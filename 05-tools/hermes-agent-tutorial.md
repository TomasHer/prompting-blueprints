---
title: "Hermes Agent Tutorial"
tags: ["tools", "hermes-agent", "nous-research"]
last_updated: "2026-06-02"
---

# Hermes Agent Tutorial

> [Hermes Agent](https://hermes-agent.nousresearch.com) is Nous Research's open-source, self-improving AI assistant — billed as "the agent that grows with you." Unlike a static assistant, it ships with a built-in learning loop: it writes its own skills after completing tasks, refines them with use, and carries memory across sessions. This tutorial covers what it is, how to set it up, and how to get productive quickly.

## Intent
- Explain what makes Hermes Agent different from a one-shot chat assistant or a typical coding agent.
- Walk through installation and first-run setup on Linux, macOS, WSL2, and Windows.
- Show the day-to-day commands you need for model selection, tools, and the multi-platform messaging gateway.

## Use when
- You want a personal agent that **persists state** — skills, memories, and a user model — instead of starting cold every session.
- You need one agent reachable from the **terminal and messaging apps** (Telegram, Discord, Slack, WhatsApp, Signal, Email) through a single process.
- You want to stay **model-agnostic**, switching between 200+ models (OpenRouter, Nous Portal, OpenAI, Anthropic, custom endpoints) without touching code.

## What Hermes Agent is

Hermes Agent is a CLI-first assistant from [Nous Research](https://nousresearch.com) ([GitHub repo](https://github.com/nousresearch/hermes-agent)). Its defining feature is the **learning loop**:

- **Autonomous skill creation** — after finishing a complex task, the agent can package the procedure into a reusable skill.
- **Self-improving skills** — skills get refined as they're used again, rather than requiring manual maintenance.
- **Persistent memory** — full-text search across past conversations with LLM-powered summarization, plus a user model that carries across sessions.

Around that core it bundles a practical toolbox:

- **40+ built-in tools** with an extensible toolset system and **MCP** (Model Context Protocol) server integration.
- **Multi-platform gateway** — a single process serves terminal + messaging platforms simultaneously, with voice transcription and cross-platform continuity.
- **Cron-based scheduling** — recurring tasks with delivery to any connected platform.
- **Subprocess isolation** for parallel subagent execution, and **batch trajectory generation** for producing training data.
- **Flexible deployment** — personal VPS, GPU clusters, or serverless platforms like Daytona and Modal.

## Requirements

The installer pulls in most of this for you, but it's good to know what's involved:

- **Python 3.11+**
- **uv** (package/environment manager)
- **Node.js**
- **ripgrep** and **ffmpeg** (optional but recommended — needed for fast search and audio/voice features)
- **Git** (bundled by the Windows installer if missing)

On Windows the PowerShell installer bundles Python 3.11, uv, Node.js, ripgrep, ffmpeg, and a portable Git Bash — **no admin rights required**.

## Setup

### 1. Install

**Linux, macOS, WSL2, Termux:**
```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

**Windows (native PowerShell):**
```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

> **Heads-up:** these commands pipe a remote script straight into your shell. That's the vendor's documented install path, but it's worth reading the script first (`curl -fsSL <url> | less`) if you're installing on a machine you care about.

After it finishes, reload your shell and launch:
```bash
source ~/.bashrc    # or: source ~/.zshrc
hermes              # start chatting
```

### 2. Run the setup wizard

The wizard handles provider keys, model defaults, and tool configuration in one pass:
```bash
hermes setup
```

If you have a **Nous Portal** subscription, run the portal variant instead — it does OAuth login, sets Nous as your provider, and turns on the Tool Gateway (web search, image generation, TTS, browser automation), with a single subscription covering 300+ models:
```bash
hermes setup --portal
```

### 3. Pick a model and tools

```bash
hermes model                 # interactive model picker
hermes model openai:gpt-5    # or set one directly, provider:model
hermes tools                 # enable/disable individual tools
hermes config set            # adjust any individual setting
```

Switching models requires **no code changes** — the same `hermes model provider:model` form works everywhere.

### 4. Verify the install

```bash
hermes doctor                # diagnose environment / config issues
```

## Core commands

| Purpose | Command |
|---------|---------|
| Interactive chat | `hermes` |
| Complete setup wizard | `hermes setup` |
| Select LLM provider/model | `hermes model` |
| Enable/disable tools | `hermes tools` |
| Adjust a single setting | `hermes config set` |
| Start the messaging gateway | `hermes gateway` |
| Diagnose problems | `hermes doctor` |
| Import from OpenClaw | `hermes claw migrate` |

## Slash commands (work in CLI and messaging)

- `/new` or `/reset` — start a fresh conversation
- `/model [provider:model]` — switch the LLM mid-session
- `/personality [name]` — set a persona
- `/retry`, `/undo` — reverse the last action
- `/compress`, `/usage` — context management and accounting
- `/skills` or `/<skill-name>` — browse or invoke procedural memory
- `Ctrl+C` — interrupt the current operation

## Connecting messaging platforms

Hermes runs one **gateway** process that fronts every platform at once:

```bash
hermes gateway
```

Configure the individual platform tokens (Telegram, Discord, Slack, WhatsApp, Signal, Email) through `hermes setup` or `hermes config set`. Once running, the same agent — with the same memory and skills — answers from your terminal and your chat apps interchangeably.

## Configuration files

- `~/.hermes/` — primary config directory (state, memory, skills)
- `.env.example` — environment variable template
- `cli-config.yaml.example` — CLI configuration template

## Migrating from OpenClaw

If you're coming from OpenClaw, Hermes imports personas, memories, skills, allowlists, platform settings, and API keys:

```bash
hermes claw migrate                    # interactive migration
hermes claw migrate --dry-run          # preview changes without writing
hermes claw migrate --preset user-data # import data but exclude secrets
```

## Building from source (contributors)

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
./setup-hermes.sh
```

## Getting-started checklist
- [ ] Run the install script for your OS, then `source` your shell profile.
- [ ] Run `hermes setup` (or `hermes setup --portal`) to add provider keys and defaults.
- [ ] Pick a model with `hermes model` and trim tools with `hermes tools`.
- [ ] Confirm the environment with `hermes doctor`.
- [ ] Start a chat with `hermes`; let it create a skill after your first multi-step task and check `/skills`.
- [ ] (Optional) Wire up messaging platforms and launch `hermes gateway`.

## References
- Hermes Agent — [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com)
- GitHub — [nousresearch/hermes-agent](https://github.com/nousresearch/hermes-agent)
- Documentation hub — [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)
- Nous Research — [nousresearch.com](https://nousresearch.com)
