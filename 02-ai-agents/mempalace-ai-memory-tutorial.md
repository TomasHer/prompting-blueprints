# MemPalace: AI Memory System Tutorial

## Why Memory Is the Missing Layer of Intelligence

Modern AI assistants — ChatGPT, Claude, Gemini — forget everything between sessions. Every conversation starts from zero. There is no continuity, no accumulated knowledge, and no persistent understanding of who you are or what you have worked on together.

**MemPalace** changes that. Created by developer Ben Sigman (with advocacy from Milla Jovovich), MemPalace is a free, open-source, fully local AI memory system that stores your entire interaction history and organizes it into a structured "memory palace" for perfect recall.

Because memory is the missing layer of intelligence — and now AI might finally remember everything.

## What Is MemPalace?

MemPalace is an open-source AI memory system built in Python. Unlike cloud-based summarization approaches, it stores verbatim conversation records locally and retrieves them through semantic search. It achieves a **96.6% R@5 score on LongMemEval** in raw mode — the highest-ever benchmarked score for a free system.

### Key Properties

| Property | Details |
| :--- | :--- |
| **Cost** | Free — zero subscriptions, zero cloud |
| **Privacy** | Fully local, no data leaves your machine |
| **Deletion policy** | No data deletion by default |
| **Retrieval** | Semantic search across all past knowledge |
| **Storage** | ChromaDB (vectors) + SQLite (knowledge graph) |
| **License** | MIT |

## Repository

- **GitHub**: https://github.com/milla-jovovich/mempalace
- **Stars**: 26.2k | **Forks**: 3.2k
- **Version**: 3.0.0
- **Language**: Python 3.9+

## Core Architecture: The Palace Metaphor

MemPalace organizes memory using a hierarchy inspired by the ancient "memory palace" (method of loci) technique. Rather than a flat database, everything is spatially organized:

| Level | Name | Purpose |
| :--- | :--- | :--- |
| Top | **Wings** | Projects or people (e.g., "Project Orion", "Person Kai") |
| Mid | **Rooms** | Topics within a wing (auth, billing, deployment) |
| Corridor | **Halls** | Memory-type corridors (facts, events, discoveries, preferences, advice) |
| Summary | **Closets** | Summaries pointing to original records |
| Raw | **Drawers** | Verbatim original files |
| Link | **Tunnels** | Cross-references between related rooms across wings |

Structured searches using this hierarchy improve retrieval by **34% versus unfiltered searches**.

## Storage & Retrieval Modes

### Raw Mode (Default)
Verbatim text is stored in ChromaDB without summarization. This is what achieves the 96.6% benchmark score and should be the default for most use cases.

### AAAK Dialect (Experimental)
An abbreviation system using entity codes and structural markers for token density at scale. Currently scores **84.2% R@5** — lower than raw mode — so it is not the default. AAAK is lossy and is best understood as an experimental compression layer, not a production recommendation.

> **Note (April 2026):** The authors have acknowledged that "30x compression" marketing claims were overstated. AAAK doesn't save tokens at small scales. The 96.6% headline is from raw mode, not AAAK. The project values transparency about what each mode actually does.

## Installation

**Requirements**: Python 3.9+

```bash
pip install mempalace
```

### Initialize and Mine Memories

```bash
# Initialize a palace for a project
mempalace init ~/projects/myapp

# Mine project files (code and docs)
mempalace mine ~/projects/myapp

# Mine conversation exports
mempalace mine ~/chats/ --mode convos

# Search stored memories
mempalace search "your query here"
```

### Three Mining Modes

| Mode | Use case |
| :--- | :--- |
| `projects` | Code and documentation |
| `convos` | Conversation exports and transcripts |
| `general` | Auto-classifies into decisions, milestones, problems |

## Integration Options

### 1. Claude Code (Native Marketplace)
```
Claude plugin marketplace add milla-jovovich/mempalace
```

### 2. MCP Server (Claude, ChatGPT, Cursor, Gemini)
```bash
claude mcp add mempalace
```

### 3. Python API
```python
import mempalace

palace = mempalace.load("~/projects/myapp")
results = palace.search("authentication bug from last sprint")

for memory in results:
    print(memory.content)
```

## Key Features

- **Knowledge Graph**: Temporal entity-relationship triples with validity windows stored in SQLite. Tracks when facts were true, not just what they are.
- **Specialist Agents**: Multiple agents can maintain separate diaries and memories within the same palace.
- **Contradiction Detection**: A fact-checking utility exists but is not yet wired into core operations.
- **Session Splitting**: Separates concatenated transcripts into individual sessions automatically.

## Why It Matters: Cost Comparison

| Approach | Estimated Annual Cost |
| :--- | :--- |
| LLM summarization pipeline | ~$507/year |
| MemPalace wake-up (~170 tokens) | ~$0.70/year |
| MemPalace + 5 searches/day | ~$10/year |

Keeping memory local eliminates the ongoing LLM cost of summarizing and re-injecting context on every session.

## When to Use MemPalace

- You want AI agents that **remember past conversations, decisions, and facts** across sessions.
- You need **privacy-first memory**: nothing sent to cloud services.
- You are building **specialist agents** that each maintain their own long-term context.
- You want **semantic search** across months or years of interaction history.
- You are integrating memory into Claude, ChatGPT, Cursor, or Gemini via MCP.

## Practical Tips

- Start with **raw mode** — it outperforms AAAK and requires no extra configuration.
- Use **Wings** to separate work contexts (one wing per client, project, or person).
- Schedule nightly `mempalace mine` runs to keep memories current without interrupting workflow.
- Use **Tunnels** to link related information across wings (e.g., a bug in Project Orion that also affected Person Kai's work).
- Keep the knowledge graph queries specific — temporal filters dramatically improve precision.

## References

- MemPalace GitHub Repository: https://github.com/milla-jovovich/mempalace
- LongMemEval benchmark: https://github.com/xiaowu0162/LongMemEval
- ChromaDB (vector store used by MemPalace): https://www.trychroma.com
