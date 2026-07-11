---
title: "Open Knowledge Format (OKF): Portable Knowledge for AI Agents"
tags: ["agents", "knowledge-base", "context-engineering", "okf"]
last_updated: 2026-07-11
---

# Open Knowledge Format (OKF): Portable Knowledge for AI Agents

> **TL;DR** — Google released the **Open Knowledge Format (OKF)**, an open, vendor-neutral spec for representing the knowledge AI agents need. It is *just Markdown files with YAML frontmatter, linked together like a wiki*. No SDKs, no proprietary software, no special runtime. The files live in your Git repository next to your code: humans read them in any editor, and agents parse them directly without a middleman.

**Related:** [AI Knowledge Base for Agents (LLM Wiki Pattern)](./ai-knowledge-base-tutorial.md) · [Context Engineering](./context-engineering.md) · [AGENTS.md for Claude Code](./agents-md-claude-code-tutorial.md) · [Model Context Protocol (MCP) Guide](../04-protocols/mcp-guide.md)

---

## Use When

You are building AI agents and your context is scattered — data schemas, metrics, and business logic buried in code comments, Confluence, wikis, or people's heads. OKF gives you a **portable format** (not another platform) so you write the knowledge once and *any* agent can use it.

## Why It Matters

Right now, building AI agents is difficult because context is fragmented. Because every team has to build its own way to connect that context, they often get locked into specific tools. OKF's approach is different:

- **Format, not platform.** Instead of another complex service, OKF provides a format. There is no required cloud provider, database, model provider, or SDK.
- **Lives next to your code.** Files sit in your Git repo. Humans read them in any editor; agents parse them directly.
- **Write once, reuse everywhere.** The same knowledge serves any agent, search index, or human reader.

A common framing: **MCP for tools, OKF for knowledge** — MCP standardizes how agents *act*, OKF standardizes what agents *know*. *Boring usually wins.*

> **A format doesn't solve everything.** Markdown files in a repo won't stay accurate on their own — you still need the discipline to review and update them. But OKF removes the *technical excuse* for not documenting your knowledge. When your agent answers wrong, you know exactly which file to fix, instead of that knowledge living in someone's head.

---

## Core Concepts

| Concept | Meaning |
| :--- | :--- |
| **Bundle** | A directory of Markdown files representing knowledge. Shippable as a tarball, hostable in a Git repo, mountable on a filesystem. |
| **Concept** | One Markdown file = one concept (a table, dataset, metric, playbook, runbook, API, …). The **file path is the concept's identity**. |
| **Frontmatter** | A YAML block at the top of each file for structured, queryable fields. |
| **Links** | Concepts link to each other via normal Markdown links `[text](path)`, forming a knowledge graph richer than the folder hierarchy. |
| **`index.md`** | Reserved filename. Optional per-directory entry point for progressive disclosure as an agent navigates the hierarchy. |
| **`log.md`** | Reserved filename. Optional chronological history of changes. |

### Design principles (OKF v0.1)

1. **Minimally opinionated** — only the `type` field is required. Everything else (which types exist, which other fields, which body sections) is left to the producer.
2. **Producer/consumer independence** — a clean separation between who *writes* knowledge and who *consumes* it. The format is the contract.
3. **Format, not platform** — no vendor lock-in. The full v0.1 spec fits on a single page.

---

## Frontmatter fields

Only `type` is mandatory. The rest are agreed-upon conventions:

| Field | Required | Description |
| :--- | :--- | :--- |
| `type` | ✅ | What the concept is, e.g. `BigQuery Table`, `Dataset`, `Metric`. |
| `title` | | Human-readable concept name. |
| `description` | | Brief explanation. |
| `resource` | | URL to the actual underlying resource. |
| `tags` | | Array of labels for categorization. |
| `timestamp` | | ISO 8601 timestamp of the last update. |

---

## Bundle layout example

```text
sales/
├── index.md
├── datasets/
│   ├── index.md
│   └── orders_db.md
├── tables/
│   ├── index.md
│   ├── orders.md
│   └── customers.md
└── metrics/
    ├── index.md
    └── weekly_active_users.md
```

## Example `okf.md` file

The example below follows the Google OKF v0.1 conventions — YAML frontmatter for structured fields, Markdown body for the human- and agent-readable content, and Markdown links to related concepts. See the companion file [`examples/okf.md`](./examples/okf.md) for a copy you can drop into your own bundle.

```markdown
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---

# Overview

The `orders` table is the source of truth for completed customer purchases.
Each row represents one order that reached the `completed` state. Use it for
revenue reporting, cohort analysis, and order-level joins.

# Schema

| Column         | Type      | Description                                        |
|----------------|-----------|----------------------------------------------------|
| `order_id`     | STRING    | Globally unique order identifier.                  |
| `customer_id`  | STRING    | FK to [customers](/tables/customers.md).           |
| `status`       | STRING    | Order state. This table only contains `completed`. |
| `total_amount` | NUMERIC   | Order total in USD, tax included.                  |
| `created_at`   | TIMESTAMP | When the order was placed (UTC).                   |

# Joins

Joined with [customers](/tables/customers.md) on `customer_id`.

# Notes

- Refreshed hourly from the production replica.
- Refunds are tracked separately in [refunds](/tables/refunds.md), not here.
- For the revenue metric definition, see
  [weekly active revenue](/metrics/weekly_active_users.md).
```

Because the concept links to `customers`, `refunds`, and a metric via plain
Markdown links, an agent (or a human) can traverse the knowledge graph from any
starting point without a proprietary catalog API.

---

## How to adopt OKF

1. **Read the spec** — it fits on a single page.
2. **Write a producer** for your source system (e.g. a script that walks a database and drafts one OKF file per table).
3. **Write a consumer** — a viewer, a search index, or an agent that reads the bundle.
4. **Try a reference implementation** on your own data.

Google ships reference implementations alongside the spec: an **enrichment agent** that walks a BigQuery dataset and drafts OKF documents (schemas, descriptions, join paths) for every table and view; a **static HTML visualizer** that renders a bundle as an interactive graph with no backend; and **sample bundles** (GA4 e-commerce, Stack Overflow, Bitcoin public datasets).

## OKF vs. RAG vs. MCP

| | What it standardizes | Where it lives |
| :--- | :--- | :--- |
| **OKF** | Curated knowledge (schemas, metrics, playbooks) | Markdown + YAML in your Git repo |
| **RAG** | Retrieval of raw documents on demand | Vector store / index |
| **MCP** | How agents call tools and fetch live data | Server exposing tools/resources |

These are complementary: OKF is the durable, human-curated knowledge layer; RAG retrieves supporting documents; MCP connects agents to tools. See the [LLM Wiki pattern](./ai-knowledge-base-tutorial.md) for how curated knowledge compounds over time, and the [MCP Guide](../04-protocols/mcp-guide.md) for the tool side.

---

## Sources

- Google Cloud Blog — [How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)
- Reference implementation & spec — [GoogleCloudPlatform/knowledge-catalog (`/okf`)](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)
- Andrej Karpathy — [LLM Wiki concept (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
