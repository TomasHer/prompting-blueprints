---
title: "AI Knowledge Base for Agents: The LLM Wiki Pattern"
tags: ["agents", "knowledge-base", "context-engineering"]
last_updated: 2026-05-01
---

# AI Knowledge Base for Agents: The LLM Wiki Pattern

## Use When

You want AI agents to retain, synthesize, and build on knowledge across sessions — without re-reading raw sources every time. This pattern replaces one-shot RAG retrieval with a living, LLM-maintained wiki that compounds value over time.

## The Problem with Traditional RAG

Standard Retrieval-Augmented Generation has a fundamental flaw: it treats knowledge as static retrieval. Every query re-reads raw documents, re-synthesizes context, and throws it all away. There is no compounding. The agent learns nothing.

Andrej Karpathy identified this gap and proposed a different model:

> "LLMs should incrementally build and maintain a persistent wiki — a structured, interlinked collection of markdown files — rather than re-synthesizing raw documents on each query."

The wiki becomes a **persistent, compounding artifact**. Each ingested source makes it richer. Each query teaches the agent what gaps exist.

## Three-Layer Architecture

| Layer | Contents | Who manages it |
| :--- | :--- | :--- |
| **Raw Sources** | Immutable articles, PDFs, notes, code | Human |
| **The Wiki** | LLM-generated markdown: summaries, entities, cross-references | LLM |
| **The Schema** | `CLAUDE.md` / `WIKI.md` — conventions, workflows, structure rules | Human + LLM |

The schema is the key innovation. It turns the LLM into a disciplined wiki maintainer by defining exactly how pages should be structured, how cross-references work, and when to flag contradictions.

## Core Operations

### Ingest

The LLM reads a new source and:

1. Extracts key entities, concepts, and claims
2. Writes or updates 10–15 wiki pages simultaneously
3. Creates cross-references automatically
4. Flags if new content contradicts existing pages

```
# Example ingest prompt pattern
You are a wiki maintainer. Read the source below and:
- Update or create pages in the wiki for each entity and concept
- Add cross-references to related existing pages
- Note any contradictions with prior claims, with citations
- Do not delete existing content without flagging it first

Source: [document]
Wiki index: [current page list]
```

### Query

The LLM searches the wiki index first, retrieves relevant pages, then synthesizes an answer with citations back to original sources.

```
# Example query prompt pattern
You are a wiki query agent. Answer the question below by:
1. Searching the wiki index for relevant pages
2. Reading those pages in full
3. Synthesizing an answer with inline citations ([PageName])
4. Noting any gaps in the wiki that the question reveals

Question: [user question]
Wiki index: [page titles + one-line descriptions]
```

### Lint

Periodic health checks keep the wiki accurate:

- Orphaned pages with no inbound links
- Contradictions between pages (same claim, different values)
- Stale claims marked `[needs update]`
- Missing cross-references between related topics

## Why LLMs Excel at This

Humans abandon wikis because the maintenance burden grows faster than the value. LLMs handle the tedious bookkeeping naturally:

- Updating cross-references across dozens of pages in one pass
- Detecting when new information contradicts prior claims
- Writing consistent summaries at scale
- Reorganizing pages as the ontology evolves

The human provides curation direction. The LLM handles everything else.

## Implementation: claude-obsidian

The [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) project by Daniel Agrici implements this pattern using **Obsidian** as the vault and **Claude Code** as the wiki maintainer. It provides a ready-to-use skill set that requires zero manual filing.

### Repository Structure

| Path | Purpose |
| :--- | :--- |
| `skills/wiki/` | Orchestrator with schema reference and 7 helper files |
| `skills/wiki-ingest/` | Source ingestion operation |
| `skills/wiki-query/` | Query and synthesis |
| `skills/wiki-lint/` | Health checks (8-category lint system) |
| `skills/autoresearch/` | Autonomous research loops with gap-filling |
| `agents/` | Parallel ingestion and lint agents |
| `WIKI.md` | Full schema reference |
| `CLAUDE.md` | Operating instructions for the wiki agent |

### Six Primary Commands

| Command | What it does |
| :--- | :--- |
| `ingest [file]` | Reads a source and updates the wiki |
| `/wiki` | Setup, vault management, index rebuild |
| `/save` | Saves current conversation to a wiki page |
| `/autoresearch [topic]` | Runs autonomous research with 3 rounds of gap-filling |
| `/canvas` | Creates a visual Obsidian canvas from wiki pages |
| lint (built-in) | Runs 8-category health check |

### Quick Start (2 minutes)

```bash
# Clone as your Obsidian vault
git clone https://github.com/AgriciDaniel/claude-obsidian.git my-wiki

# Open the folder as an Obsidian vault
# Then open Claude Code in the same directory
claude

# Ingest your first source
ingest path/to/document.pdf

# Query the wiki
/wiki query "What are the main themes across my sources?"
```

### Adding to an Existing Vault

```bash
# Copy the skills and schema files into your vault
cp -r claude-obsidian/skills/ your-vault/skills/
cp claude-obsidian/WIKI.md your-vault/WIKI.md
cp claude-obsidian/CLAUDE.md your-vault/CLAUDE.md
```

## Schema Design: The Most Important Part

The schema (`WIKI.md` / `CLAUDE.md`) is what separates a well-maintained wiki from a dumping ground. It should define:

**Page types** — what categories exist (entity, concept, source summary, comparison, timeline)

**Naming conventions** — how pages are titled (`Concept: Retrieval-Augmented Generation` vs `RAG` vs `rag`)

**Required sections** — what every entity page must contain (definition, related pages, sources, open questions)

**Cross-reference rules** — when to link, how to handle synonyms

**Contradiction protocol** — how to flag and resolve conflicting claims

**Freshness markers** — `[last updated: YYYY-MM-DD]` and `[needs update]` tags

### Minimal Schema Template

```markdown
# Wiki Schema

## Page Types
- **Entity**: People, organizations, products, papers
- **Concept**: Ideas, techniques, frameworks
- **Source**: Summary of an ingested document
- **Comparison**: Side-by-side analysis of related entities

## Required Sections (Entity pages)
1. One-sentence definition
2. Key properties (table)
3. Related pages (links)
4. Source citations

## Naming Convention
Title case. Use full names, not acronyms.
Synonyms go in a `## Aliases` section.

## Contradiction Protocol
Flag with: > ⚠️ Contradiction: [Page A] claims X, [Page B] claims Y. Source: [citations]
```

## Practical Tips

- **Start with the schema**, not the content. A good schema prevents 80% of maintenance headaches.
- **Use a flat file structure** — one page per entity or concept, named consistently. Avoid deep nesting.
- **Ingest incrementally** — add one source at a time, then query to verify cross-references formed correctly before ingesting the next.
- **Let the LLM create the index** — ask it to maintain a single `INDEX.md` with one-line descriptions of every page. This is what makes queries fast.
- **Run lint weekly** — stale and orphaned pages are normal. Budget 15 minutes per week for LLM-assisted cleanup.
- **Session memory with a hot cache** — store the current session's active pages in a `HOT_CACHE.md` so the LLM does not have to re-read the full index on every turn.

## When to Use This Pattern

| Scenario | Fit |
| :--- | :--- |
| Research projects with many sources | Excellent |
| Personal knowledge management | Excellent |
| Team shared knowledge base | Good (with role conventions) |
| Real-time data (live prices, breaking news) | Poor — use RAG instead |
| Single-document Q&A | Overkill — use direct context instead |

## References

- Andrej Karpathy – LLM Wiki pattern (GitHub Gist): https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- claude-obsidian (Daniel Agrici, GitHub): https://github.com/AgriciDaniel/claude-obsidian
- Obsidian (note-taking app used as vault): https://obsidian.md
