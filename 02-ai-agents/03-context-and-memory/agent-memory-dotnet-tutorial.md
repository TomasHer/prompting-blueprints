---
title: "Agent Memory for .NET Tutorial"
tags: ["agents", "memory", "dotnet", "neo4j", "graphrag"]
last_updated: "2026-07-14"
---

# Agent Memory for .NET: Persistent, Graph-Native Memory for AI Agents

Most AI agents forget everything when a session ends — your stack, your
preferences, the decisions you made together. The interesting work on fixing
this (persistent, structured, queryable agent memory) had mostly landed in the
Python ecosystem first.

**Agent Memory for .NET** ([joslat/agent-memory-dotnet](https://github.com/joslat/agent-memory-dotnet))
is the missing .NET implementation: a persistent, graph-native memory engine
for AI agents, backed by [Neo4j](https://neo4j.com/). It stores conversations,
facts, preferences, and relationships as a **queryable knowledge graph** that
survives conversations, sessions, and process restarts.

It is a from-scratch .NET reimplementation — *not a port* — inspired by
[Neo4j Agent Memory](https://github.com/neo4j-labs/agent-memory) and verified
against that project's own compatibility kit (**178/178 Bronze, Silver, and
Gold tests passed**). It is an independent community project, built natively
for .NET and released under the **MIT licence**. It is not affiliated with,
endorsed by, or supported by Neo4j, Inc.

> This tutorial is based on the project's public README/docs and the author's
> release announcement by **José Luis Latorre** (AI Architect @ Swiss Life,
> creator of AgentEval). The announcement is transcribed at the end of this
> page.

---

## Why this matters

A vector store gives you *similar text*. A knowledge graph gives you
*connected knowledge* — and those are not the same thing. Agent Memory for .NET
is deliberately **not merely a vector store**. It combines vector, full-text,
hybrid, and graph-traversal retrieval, because answering "what does this user
prefer, and why do we believe that?" needs relationships and provenance, not
just nearest-neighbour text.

---

## The three forms of memory

Agent Memory gives agents three interconnected memory layers, each a
first-class citizen rather than an afterthought:

| Layer | Holds | Example |
|---|---|---|
| 🟣 **Short-term memory** | Conversations, messages, sessions, and context | The current chat turn-by-turn |
| 🟣 **Long-term memory** | Entities, facts, preferences, relationships, provenance, and temporal state | "Alice prefers dark mode" |
| 🟣 **Reasoning memory** | Execution traces, reasoning steps, tool calls, and prior task patterns | How a past task was solved |

Short-term memory is what happened; long-term memory is what it *means*; and
reasoning memory is *how the agent got there* — so past task patterns can
inform future ones.

---

## Retrieval: four strategies, not one

Because "similar text" and "connected knowledge" are different problems, Agent
Memory combines multiple retrieval strategies over the same graph:

- **Vector search** — semantic similarity via embeddings.
- **Full-text search** — exact/keyword matching.
- **Hybrid** — vector + full-text fused.
- **Graph traversal** — follow relationships between entities, facts, and
  their sources.
- **Optional GraphRAG-style** context assembly on top.

---

## Memory governance: the part most memory libraries skip

Persistence is easy; *trustworthy* persistence is not. Agent Memory bakes
governance into the persistence layer rather than bolting it onto the API edge:

| Concern | How it is handled |
|---|---|
| **Ownership** | Every long-term record carries an `owner_id` / `MemoryScope`; shared/global entries use null. |
| **Provenance** | Records keep `source_message_ids` and graph edges (`EXTRACTED_FROM`, `EXTRACTED_BY`) tracing every fact back to the message it came from. |
| **Temporality** | A **bitemporal** model separates valid-time (`valid_from` / `valid_until`) from transaction-time (`created_at` / `invalidated_at`). |
| **Audit** | Read/access logs capture who retrieved what, when, and how often. |
| **Invalidation** | Soft-invalidation by default (records stay recoverable); hard deletion is opt-in. |
| **Isolation** | Owner and store isolation is enforced deep in the persistence layer, so tenants can't leak into each other. |

The bitemporal model is what lets you ask **"what did we believe back then?"**
alongside **"what do we believe now?"** — non-destructive decay instead of
overwriting history.

### The Mnemonic Core

The project's identity is **The Mnemonic Core** — a continuous graph path
representing memory that survives conversations, sessions, and process
restarts. It is the through-line that ties short-term, long-term, and reasoning
memory into one durable graph rather than three disconnected stores.

---

## Ecosystem integrations

Agent Memory ships first-class adapters so you can wire it into whatever you
already build with, plus a direct .NET API for everything else:

- **Microsoft Agent Framework**
- **Semantic Kernel**
- **MCP** (Model Context Protocol) clients
- **Microsoft.Extensions.AI** (embeddings/LLM abstractions)
- **OpenTelemetry** (observability)
- **Neo4j Graph Data Science**
- **GraphRAG-style retrieval**

It multi-targets **.NET 8.0, 9.0, and 10.0**.

---

## Quick start

### 1. Prerequisites

- .NET 8, 9, or 10
- Neo4j 5.x
- Any [Microsoft.Extensions.AI](https://learn.microsoft.com/dotnet/ai/)-compatible
  embedding provider (for semantic search in production)

Spin up Neo4j locally with Docker:

```bash
docker run --name neo4j-memory -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password neo4j:5
```

### 2. Install

```bash
dotnet add package AgentMemory
```

`AgentMemory` is a meta-package pulling in the core components. If you prefer to
compose it yourself, the pieces are published individually
(`AgentMemory.Abstractions`, `AgentMemory.Core`, `AgentMemory.Neo4j`, plus
optional packages for LLM extraction, Agent Framework, Semantic Kernel, MCP,
and observability).

### 3. Register services and bootstrap the schema

```csharp
using AgentMemory;
using AgentMemory.Abstractions.Services;
using AgentMemory.Neo4j.Infrastructure;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;

builder.Services.AddNeo4jAgentMemory(options =>
{
    options.Uri      = "bolt://localhost:7687";
    options.Username = "neo4j";
    options.Password = "password";
});

builder.Services.AddAgentMemoryCore(_ => { });
builder.Services.AddSingleton<IClock, SystemClock>();
builder.Services.AddSingleton<IIdGenerator, GuidIdGenerator>();

// The core ships safe default *stubs*, not production embeddings.
// Register a real MEAI embedding generator in production:
builder.Services.AddSingleton<IEmbeddingGenerator<string, Embedding<float>>,
    StubEmbeddingGenerator>();

var host = builder.Build();

// Idempotent — safe to call on every startup.
var bootstrapper = host.Services.GetRequiredService<ISchemaBootstrapper>();
await bootstrapper.BootstrapAsync();
```

> ⚠️ **Production note:** the core includes safe default stubs so it runs
> out of the box, but semantic recall is only meaningful once you register a
> real `IEmbeddingGenerator<string, Embedding<float>>`.

### 4. Store, extract, and recall

```csharp
var memory = scope.ServiceProvider.GetRequiredService<IMemoryService>();

// Short-term: record a message
await memory.AddMessageAsync(
    sessionId: "session-01",
    conversationId: "conv-01",
    role: "user",
    content: "My name is Alice and I prefer dark mode.");

// Long-term: extract entities/facts/preferences into the graph
await memory.ExtractAndPersistAsync(new ExtractionRequest
{
    SessionId = "session-01"
});

// Recall relevant context (vector + full-text + graph)
var recall = await memory.RecallAsync(new RecallRequest
{
    SessionId = "session-01",
    Query     = "What does Alice prefer?"
});
```

### 5. Time-travel with bitemporal recall

Ask what the agent believed at a point in the past — without destroying the
current view:

```csharp
var snapshot = await memory.RecallAsOfAsync(
    new RecallRequest { SessionId = "session-01", Query = "What does Alice prefer?" },
    asOf: DateTimeOffset.UtcNow.AddDays(-7));
```

---

## Wiring it into an agent framework

**Microsoft Agent Framework** — memory becomes both a context provider and a
set of tools the agent can call:

```csharp
builder.Services.AddAgentMemoryFramework(options =>
{
    options.AutoExtractOnPersist = true;
});

var memoryProvider = sp.GetRequiredService<Neo4jMemoryContextProvider>();
var memoryTools    = sp.GetRequiredService<MemoryToolFactory>().CreateAIFunctions();

AIAgent agent = chatClient.AsAIAgent(new ChatClientAgentOptions
{
    Tools              = [.. memoryTools],
    AIContextProviders = [memoryProvider],
});
```

**Semantic Kernel** — register the memory plugin:

```csharp
builder.AddNeo4jMemoryPlugin();
```

For MCP clients or anything else, use the direct .NET API shown above.

---

## Key interfaces to know

| Interface / type | Role |
|---|---|
| `IMemoryService` | Primary facade for storing and recalling memories. |
| `ISchemaBootstrapper` | Creates the Neo4j schema — call once on startup. |
| `IEmbeddingGenerator<string, Embedding<float>>` | Produces vector embeddings (from Microsoft.Extensions.AI). |
| `Neo4jMemoryContextProvider` | Microsoft Agent Framework context provider. |
| `MemoryToolFactory` | Builds callable memory tools/AIFunctions for agents. |
| `IWritableMemoryStoreContext` | Sets the ambient tenant/application context. |

---

## When to reach for this

Agent Memory for .NET is a strong fit when you:

- Build agents in **.NET** and want memory that outlives a session.
- Already run **Neo4j**, or want graph-native relationships and provenance —
  not just a vector index.
- Need **multi-tenant isolation**, audit trails, and the ability to explain
  *why* the agent believes a fact.
- Care about **temporal correctness** ("what did we believe then vs. now").
- Use **Microsoft Agent Framework, Semantic Kernel, or MCP** and want a
  drop-in memory layer.

If you are in Python, the upstream [Neo4j Agent Memory](https://github.com/neo4j-labs/agent-memory)
project covers the same ground; this brings the pattern natively to .NET.

---

## Quick reference

| Task | API |
|---|---|
| Install | `dotnet add package AgentMemory` |
| Register (Neo4j) | `services.AddNeo4jAgentMemory(...)` |
| Register (core) | `services.AddAgentMemoryCore(...)` |
| Create schema | `ISchemaBootstrapper.BootstrapAsync()` |
| Record a message | `IMemoryService.AddMessageAsync(...)` |
| Extract facts | `IMemoryService.ExtractAndPersistAsync(...)` |
| Recall context | `IMemoryService.RecallAsync(...)` |
| Point-in-time recall | `IMemoryService.RecallAsOfAsync(..., asOf)` |
| Agent Framework | `services.AddAgentMemoryFramework(...)` |
| Semantic Kernel | `builder.AddNeo4jMemoryPlugin()` |

---

## Appendix: release announcement (transcribed)

*Transcribed from the original release post by José Luis Latorre on LinkedIn.*

> **AI agents for .NET can finally remember.**
>
> Today I am releasing AgentMemory for .NET: a persistent, graph-native memory
> engine for AI agents, backed by Neo4j.
>
> This started with a simple frustration. The emerging agent ecosystem was
> gaining increasingly sophisticated memory capabilities — but some of the most
> interesting work was still available only to Python developers. So I built
> the missing .NET implementation.
>
> AgentMemory gives agents three interconnected forms of memory:
> 🟣 **Short-term memory** — Conversations, messages, sessions, and context.
> 🟣 **Long-term memory** — Entities, facts, preferences, relationships,
> provenance, and temporal state.
> 🟣 **Reasoning memory** — Execution traces, reasoning steps, tool calls, and
> prior task patterns.
>
> It is not merely a vector store. It combines vector, full-text, hybrid, and
> graph traversal retrieval — because similar text and connected knowledge are
> not the same thing.
>
> It integrates with: Microsoft Agent Framework, Semantic Kernel, MCP,
> Microsoft.Extensions.AI, OpenTelemetry, Neo4j Graph Data Science, and
> GraphRAG-style retrieval.
>
> And because compatibility claims should be verifiable, not aspirational, the
> implementation is tested against the upstream Neo4j Agent Memory compatibility
> kit: **178/178 Bronze, Silver, and Gold tests passed.**
>
> It is an independent community project, built natively for .NET and released
> under the MIT licence. And now it also has an identity: **The Mnemonic Core**
> — a continuous graph path representing memory that survives conversations,
> sessions, and process restarts.
>
> I did it. 😄 — AgentMemory for .NET is now available.
>
> If you build AI agents with .NET, Neo4j, Microsoft Agent Framework, Semantic
> Kernel, or MCP:
> ⭐ Visit the repository and give it a star
> 🔁 Reshare this post so other .NET agent developers can find it
> ➕ Follow me for the next releases, examples, benchmarks, and integrations
>
> Most importantly, try it and tell me what is missing.
>
> Let's give .NET agents a memory that actually lasts. in .NET.
>
> `#dotnet #AIagents #Neo4j #KnowledgeGraphs #GraphRAG`
> `#MicrosoftAgentFramework #SemanticKernel #MCP #OpenSource`

---

## Sources

- [joslat/agent-memory-dotnet (GitHub)](https://github.com/joslat/agent-memory-dotnet)
- [Neo4j Agent Memory — upstream reference (GitHub)](https://github.com/neo4j-labs/agent-memory)
- Release announcement by José Luis Latorre (LinkedIn), transcribed above.

## Related pages

- [AgentMemory Tutorial](./agentmemory-tutorial.md) — a different, Python/SQLite memory tool for coding agents
- [MemPalace: AI Memory System Tutorial](./mempalace-ai-memory-tutorial.md)
- [AI Knowledge Base for Agents (LLM Wiki Pattern)](./ai-knowledge-base-tutorial.md)
- [Context Engineering](./context-engineering.md)
