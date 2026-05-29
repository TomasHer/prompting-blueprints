---
title: "AgentMemory Tutorial"
tags: ["tools", "claude-code", "memory", "mcp", "agents"]
last_updated: "2026-05-18"
---

# AgentMemory: Persistent Memory for AI Coding Agents

Your AI coding agent has a memory problem. Every session ends, and it forgets everything — your stack, your preferences, your architecture decisions. You re-explain the same context every time.

**agentmemory** fixes this. It runs silently in the background, records what your agent does each session, compresses it with AI, and injects the right context when the next session starts. No manual effort. No copy-pasting.

- **95.2%** retrieval accuracy (R@5 on LongMemEval-S)
- **92% fewer tokens** per session vs. loading full context (~$10/year vs. $500+)
- **0 external databases** — SQLite only, fully self-hosted
- **53 MCP tools**, works with Claude Code, Codex, Cursor, Cline, Windsurf, Gemini CLI, and more
- **Apache-2.0**, free to use

**Source:** [github.com/rohitg00/agentmemory](https://github.com/rohitg00/agentmemory)

---

## The LLM Wiki Pattern — Implemented

Andrej Karpathy proposed that LLMs should incrementally build and maintain a persistent, structured knowledge base rather than re-synthesizing raw context on every query. The idea: ingest sources, write and update interlinked pages, compound value over time instead of forgetting everything.

agentmemory is the practical implementation of that pattern for coding agents — extended with four things the original sketch left open:

| Extension | What it adds |
|---|---|
| **Confidence scoring** | Memories carry a reliability score that decays (Ebbinghaus curve) and strengthens with reuse |
| **Lifecycle management** | Working → Episodic → Semantic → Procedural consolidation; stale memories auto-evict |
| **Knowledge graphs** | Entities and relationships extracted per session, queryable across all history |
| **Hybrid search** | BM25 keyword + vector similarity + graph traversal fused via Reciprocal Rank Fusion |

See [AI Knowledge Base for Agents: The LLM Wiki Pattern](./ai-knowledge-base-tutorial.md) for the conceptual foundation this builds on.

---

## The Problem It Solves

Every AI coding agent today has ephemeral memory. When a session ends, context is gone. CLAUDE.md files help, but they are manually maintained, grow without bound, and load 22,000+ tokens of static context even when most of it is irrelevant.

agentmemory replaces that pattern with dynamic, relevance-ranked retrieval. It captures what actually happened, compresses it into structured facts, and injects only what is relevant to the current session — typically around 2,000 tokens.

---

## Quick Start (30 Seconds)

```bash
# Run without installing
npx @agentmemory/agentmemory

# Or install globally
npm install -g @agentmemory/agentmemory
agentmemory
```

Then connect your agent.

---

## Connecting to Claude Code

The fastest path is the plugin marketplace:

```
/plugin marketplace add rohitg00/agentmemory
/plugin install agentmemory
```

This registers **12 hooks**, **4 skills**, and **53 MCP tools** automatically.

**Hooks installed:**

| Hook | What it captures |
|---|---|
| SessionStart | Project path, session ID, injects relevant memory |
| UserPromptSubmit | User prompts (privacy-filtered) |
| PreToolUse | File access patterns |
| PostToolUse | Tool name, input, output |
| PostToolUseFailure | Error context |
| SubagentStart / Stop | Lifecycle events |
| Stop / SessionEnd | End-of-session summary |

**Skills added:**

```
/recall          — Search your memory manually
/remember        — Save something explicitly
/session-history — Browse past sessions
/forget          — Delete a memory entry
```

---

## Connecting Other Agents

For **Codex CLI:**

```bash
codex plugin marketplace add rohitg00/agentmemory
codex plugin install agentmemory
```

For **Cursor, Cline, Windsurf, Gemini CLI**, and any MCP-compatible agent, add this to your MCP config (`mcpServers`):

```json
{
  "agentmemory": {
    "command": "npx",
    "args": ["-y", "@agentmemory/mcp"],
    "env": {
      "AGENTMEMORY_URL": "http://localhost:3111"
    }
  }
}
```

Start the agentmemory server first, then restart your agent.

---

## How Memory Works

### The Pipeline

Every tool call your agent makes flows through this pipeline:

```
PostToolUse hook fires
  → SHA-256 dedup (5-minute window, no duplicate writes)
  → Privacy filter (strips secrets, API keys)
  → Store raw observation
  → LLM compression → structured facts + concepts
  → Vector embedding
  → Index in BM25 + vector + knowledge graph

Stop / SessionEnd hook
  → Session summary generated
  → Knowledge graph extraction (optional)

SessionStart hook (next session)
  → Load project profile
  → Hybrid search (BM25 + vector + graph)
  → Inject into conversation (~2,000 token budget)
```

### 4-Tier Memory Structure

| Tier | Stores | Analogy |
|---|---|---|
| Working | Raw observations | Short-term memory |
| Episodic | Session summaries | "What happened" |
| Semantic | Extracted facts and patterns | "What I know" |
| Procedural | Workflows and decisions | "How to do it" |

Memories decay over time following the Ebbinghaus curve. Frequently accessed memories strengthen; stale ones are evicted automatically.

### Retrieval: Triple-Stream Fusion

Search combines three engines using Reciprocal Rank Fusion (k=60):

1. **BM25** — Stemmed keyword matching with synonym expansion
2. **Vector** — Cosine similarity over dense embeddings
3. **Graph** — Knowledge graph entity traversal

Results are diversified (max 3 per session) and ranked by relevance.

---

## Embedding Providers

agentmemory works offline by default. No API key required to start.

| Provider | Model | Cost | Notes |
|---|---|---|---|
| **Local** (default) | `all-MiniLM-L6-v2` | Free | Fully offline, +8pp recall boost |
| OpenAI | `text-embedding-3-small` | $0.02/1M tokens | Highest quality |
| Gemini | `gemini-embedding-001` | Free tier | 100+ languages |
| Voyage AI | `voyage-code-3` | Paid | Code-optimized |
| Cohere | `embed-english-v3.0` | Free trial | General purpose |

Install local embeddings:

```bash
npm install @xenova/transformers
```

---

## Configuration

Configuration lives in `~/.agentmemory/.env`:

```bash
# LLM provider (pick one — used for compression and summarization)
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
OPENAI_API_KEY=...

# Embedding provider
EMBEDDING_PROVIDER=local        # default, no key needed

# Token budget injected at session start
TOKEN_BUDGET=2000

# Search weights
BM25_WEIGHT=0.4
VECTOR_WEIGHT=0.6

# Ports
III_REST_PORT=3111              # REST API
# Viewer runs on 3113

# Optional features (off by default)
AGENTMEMORY_AUTO_COMPRESS=false
GRAPH_EXTRACTION_ENABLED=false
CONSOLIDATION_ENABLED=true
LESSON_DECAY_ENABLED=true

# MCP tool visibility
AGENTMEMORY_TOOLS=core          # or "all" for 53 tools

# Auth (for shared/team setups)
AGENTMEMORY_SECRET=your-secret
TEAM_ID=
USER_ID=
```

---

## Real-Time Viewer

Open `http://localhost:3113` while agentmemory is running to see:

- **Live observation stream** — watch memory being captured in real time
- **Session explorer** — replay sessions with play/pause and speed control (0.5×–4×)
- **Memory browser** — search and inspect stored memories
- **Knowledge graph** — visualize entity relationships
- **Health dashboard** — status and diagnostics

### Import Existing Claude Code Transcripts

If you have past Claude Code sessions, import them:

```bash
# Import all transcripts for current project
npx @agentmemory/agentmemory import-jsonl

# Import a specific transcript
npx @agentmemory/agentmemory import-jsonl ~/.claude/projects/-my-project/abc123.jsonl
```

---

## Benchmarks

### Retrieval Accuracy (LongMemEval-S, 500 questions)

| System | R@5 | MRR |
|---|---|---|
| **agentmemory** | **95.2%** | **88.2%** |
| BM25-only fallback | 86.2% | — |
| mem0 | 68.5% | — |
| Letta/MemGPT | 83.2% | — |

### Token Usage Per Year

| Approach | Tokens/year | Cost/year |
|---|---|---|
| Paste full context | 19.5M+ | Exceeds window |
| LLM-summarized | ~650K | ~$500 |
| **agentmemory** | **~170K** | **~$10** |
| agentmemory + local embeddings | ~170K | **$0** |

### Feature Comparison

| Feature | agentmemory | mem0 | Letta/MemGPT | CLAUDE.md |
|---|---|---|---|---|
| R@5 retrieval | **95.2%** | 68.5% | 83.2% | N/A |
| Auto-capture | 12 hooks | Manual | Agent self-edits | Manual |
| External dependencies | None | Qdrant / pgvector | Postgres | None |
| Multi-agent support | MCP + REST | API only | Letta-only | Per-agent |
| Tokens per session | ~1,900 | Varies | Core in context | 22K+ |

---

## MCP Tools Reference

**Core tools** (available by default):

| Tool | What it does |
|---|---|
| `memory_recall` | Retrieve memories by query |
| `memory_smart_search` | Hybrid search across all tiers |
| `memory_save` | Explicitly store a memory |
| `memory_sessions` | List past sessions |
| `memory_profile` | View project memory profile |
| `memory_patterns` | Detect recurring patterns |
| `memory_timeline` | Chronological memory view |
| `memory_export` | Export memories to JSON |
| `memory_relations` | Graph relationship queries |
| `memory_compress_file` | Compress a file into memory |
| `memory_file_history` | File access history |
| `memory_graph_query` | Raw knowledge graph query |

Set `AGENTMEMORY_TOOLS=all` to unlock the full 53-tool set including consolidation, team sharing, governance, snapshots, and diagnostics.

---

## REST API

agentmemory exposes 124 endpoints on port 3111. Protected endpoints require `Authorization: Bearer <secret>` when `AGENTMEMORY_SECRET` is set.

**Key endpoints:**

```
GET  /agentmemory/health
POST /agentmemory/session/start
POST /agentmemory/session/end
POST /agentmemory/observe
POST /agentmemory/smart-search
POST /agentmemory/context
POST /agentmemory/remember
POST /agentmemory/forget
POST /agentmemory/enrich
GET  /agentmemory/profile
GET  /agentmemory/export
POST /agentmemory/import
POST /agentmemory/graph/query
POST /agentmemory/team/share
GET  /agentmemory/audit
```

---

## Programmatic Access

Use the iii SDK to call agentmemory functions directly over WebSocket from Python, Node, or Rust:

```python
from iii import register_worker

iii = register_worker("ws://localhost:49134")
iii.connect()

iii.trigger({
    "function_id": "mem::smart-search",
    "payload": {"project": "my-project", "query": "how do tokens refresh"},
})
```

---

## Extending with iii Workers

agentmemory is built on iii-engine. Add capabilities with one command:

```bash
iii worker add iii-pubsub         # Multi-instance memory sharing
iii worker add iii-cron           # Scheduled consolidation and decay
iii worker add iii-queue          # Durable retries for async jobs
iii worker add iii-observability  # OpenTelemetry traces (enabled by default)
iii worker add iii-sandbox        # Isolated microVM for recalled code execution
iii worker add iii-database       # SQL-backed state adapter
iii worker add mcp                # Generic MCP host
```

---

## Self-Hosting and Deployment

agentmemory is fully self-hosted — SQLite only, no external databases.

**One-click cloud deploy:**

- [Deploy to fly.io](https://fly.io/launch?repo=https://github.com/rohitg00/agentmemory&path=deploy/fly)
- [Deploy to Railway](https://railway.com/new/template?template=https%3A%2F%2Fgithub.com%2Frohitg00%2Fagentmemory&rootDirectory=deploy%2Frailway)
- Self-host with [Coolify](https://coolify.io/self-hosted) using the bundled `docker-compose.yml`

The real-time viewer (port 3113) stays bound to loopback inside containers — use an SSH tunnel for remote access.

---

## Quick Reference

| Task | Command |
|---|---|
| Start agentmemory | `npx @agentmemory/agentmemory` |
| Install globally | `npm install -g @agentmemory/agentmemory` |
| Connect Claude Code | `/plugin marketplace add rohitg00/agentmemory` then `/plugin install agentmemory` |
| Install local embeddings | `npm install @xenova/transformers` |
| Open viewer | `http://localhost:3113` |
| Import transcripts | `npx @agentmemory/agentmemory import-jsonl` |
| Search memory | `/recall <query>` |
| Save memory | `/remember <text>` |
| Browse history | `/session-history` |
| Delete memory | `/forget <id>` |
