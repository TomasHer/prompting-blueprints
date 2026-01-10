# Cursor Dynamic Context Discovery (Context Engineering Guide)

## Overview
Cursor’s “Dynamic Context Discovery” reframes context engineering around a simple idea: the filesystem is the primary memory substrate for an agent. Instead of loading everything into the model up front, the agent discovers and retrieves just-in-time context from files and tools as it works. This guide summarizes the core concepts from Cursor’s blog post and translates them into practical patterns for designing context-aware agent workflows.

**Source:** https://cursor.com/blog/dynamic-context-discovery

**Related:** [Context Engineering](../02-ai-agents/context-engineering.md)

## Why dynamic context discovery matters
Traditional agent setups often stuff massive amounts of background material into the prompt—tool descriptions, docs, codebase summaries, logs, prior chats, etc. That strategy quickly burns the context window and still leaves the agent brittle when the task shifts.

Dynamic context discovery flips the model:
- **Keep the base prompt lean.** Store the bulk of knowledge externally (files, tool specs, logs, docs).
- **Let the agent fetch only what it needs.** The agent reads files or tool descriptions when the task demands them.
- **Scale without token bloat.** Repositories grow and tool catalogs expand without overwhelming the prompt.

In Cursor’s framing, the filesystem is not just storage—it is the interface for memory, tools, and prior work.

## Core idea: the filesystem is the memory layer
Cursor highlights the filesystem as a universal substrate for context. This enables:
- **Just-in-time retrieval:** The agent reads from the filesystem when a signal appears in the user request.
- **Task-specific focus:** The agent only loads the minimum relevant context.
- **Persistent recall:** Logs, terminal outputs, and prior conversations can live as files, ready to be retrieved later.

This framing aligns with context engineering goals: maximize relevance per token, minimize static overhead, and let agents actively search for what they need.

## Dynamic tool discovery
Instead of stuffing full tool specs into the prompt, Dynamic Context Discovery promotes a lighter approach:
- **Expose only tool names and short summaries at startup.**
- **Store full tool schemas or usage docs on disk.**
- **Let the agent load detailed tool info on demand.**

This approach preserves context budget while still allowing the agent to discover capabilities when needed.

## Skills as file-backed capabilities
Cursor also calls out “skills” as file-based artifacts (Markdown, scripts, instructions) that explain how to perform specific tasks. The agent:
- sees only a short description of each skill at startup
- reads the full file when the task requires it

This keeps the agent’s initial context small while enabling rich, reusable guidance.

## Implications for context engineering
Dynamic context discovery changes how you should structure agent workflows:

### 1. Treat files as first-class memory
Store the following in the repo or workspace:
- tool documentation
- skill guides
- prior run logs
- conversation summaries

### 2. Prefer “index + fetch” over “full load”
Use small indexes (e.g., file lists, manifest files, short tool descriptors) to guide the agent toward deeper context only when needed.

### 3. Design for retrieval paths
Make information easy to discover:
- clear filenames
- predictable directories
- short summaries at the top of files

### 4. Encourage active context discovery
Prompt the agent to scan the filesystem or search for files instead of assuming everything is preloaded.

## Practical workflow pattern
1. **Start lean.** Provide a concise system prompt with the task, constraints, and available tool names.
2. **Discover.** The agent searches the filesystem for relevant docs, code, or tool specs.
3. **Retrieve.** The agent reads only the files it needs.
4. **Execute.** The agent acts with the newly loaded context.
5. **Persist.** Save outputs, logs, or summaries back to the filesystem for future retrieval.

## Takeaways
Dynamic Context Discovery is a context engineering strategy that prioritizes runtime retrieval over upfront loading. By shifting memory and tool detail into the filesystem, agents become more scalable, more adaptable, and less constrained by static context limits. Cursor’s framing reinforces a simple principle: **context should be discovered, not dumped.**
