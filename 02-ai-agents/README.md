---
title: "AI Agents"
tags: ["agents", "overview"]
last_updated: 2026-06-14
---

# AI Agents

A curated collection of guides, tutorials, and reference material for building production AI agents.

## Structure

### [01-foundations](./01-foundations/)
What AI agents are, how to think about AI-assisted coding, and which models to use.

| File | Description |
|------|-------------|
| [ai-agents-overview.md](./01-foundations/ai-agents-overview.md) | Agent taxonomy, core capabilities, and a 7-step build framework |
| [ai-coding-spectrum.md](./01-foundations/ai-coding-spectrum.md) | Vibe-coding vs. AI-assisted vs. agentic coding — when to use each |
| [models-for-ai-agents-2026.md](./01-foundations/models-for-ai-agents-2026.md) | 2026 model provider landscape and selection checklist |
| [open-models.md](./01-foundations/open-models.md) | Strategic case for open models in agentic AI |
| [google-5-day-ai-agents-course.md](./01-foundations/google-5-day-ai-agents-course.md) | Index of Google's 5-day AI agents intensive course |

### [02-skills](./02-skills/)
How to design, build, test, and reuse agent skills as composable capability modules.

| File | Description |
|------|-------------|
| [anatomy-of-a-skill.md](./02-skills/anatomy-of-a-skill.md) | Technical breakdown of SKILL.md structure and progressive disclosure |
| [claude-agent-skills.md](./02-skills/claude-agent-skills.md) | Anthropic skills playbook: authoring, curation, activation, iteration |
| [skills-design-patterns.md](./02-skills/skills-design-patterns.md) | Five reusable skill patterns (Sequential, Multi-MCP, Iterative Refinement, …) |
| [skills-testing-iteration.md](./02-skills/skills-testing-iteration.md) | Three-tier testing framework for validating and improving skills |
| [self-evolving-agents-google-adk.md](./02-skills/self-evolving-agents-google-adk.md) | Google ADK's modular skill architecture and token-reduction patterns |
| [copilot-custom-skills-integration.md](./02-skills/copilot-custom-skills-integration.md) | Porting Claude Agent Skills to VS Code GitHub Copilot |

### [03-context-and-memory](./03-context-and-memory/)
Managing what the agent sees (context engineering) and what it remembers (memory systems).

| File | Description |
|------|-------------|
| [context-engineering.md](./03-context-and-memory/context-engineering.md) | Context as a strategic design discipline: JIT retrieval, chunking, hierarchy |
| [agent-context-window-performance.md](./03-context-and-memory/agent-context-window-performance.md) | Empirical data on how large context windows degrade instruction-following |
| [cursor-dynamic-context-discovery.md](./03-context-and-memory/cursor-dynamic-context-discovery.md) | Cursor's filesystem-as-memory and dynamic tool discovery model |
| [ai-knowledge-base-tutorial.md](./03-context-and-memory/ai-knowledge-base-tutorial.md) | LLM Wiki pattern for a persistent, compounding agent knowledge base |
| [mempalace-ai-memory-tutorial.md](./03-context-and-memory/mempalace-ai-memory-tutorial.md) | Open-source local memory system achieving 96.6% R@5 on LongMemEval |

### [04-protocols](./04-protocols/)
How agents communicate with tools (MCP) and with each other (A2A), plus the Anthropic Agents API.

| File | Description |
|------|-------------|
| [mcp-guide.md](./04-protocols/mcp-guide.md) | Model Context Protocol: primitives, security, and 12 servers to try |
| [a2a-protocol-guide.md](./04-protocols/a2a-protocol-guide.md) | Agent-to-Agent protocol: Agent Cards, task lifecycle, SDK links |
| [claude-managed-agents-tutorial.md](./04-protocols/claude-managed-agents-tutorial.md) | Anthropic Managed Agents API: sessions, built-in tools, custom tools |

### [05-production](./05-production/)
End-to-end frameworks for shipping agents to production.

| File | Description |
|------|-------------|
| [how-to-build-ai-agents-production.md](./05-production/how-to-build-ai-agents-production.md) | 7-step framework: goal → model → framework → tools → memory → context → evals |
| [ultimate-2026-ai-software-implementation-guide.md](./05-production/ultimate-2026-ai-software-implementation-guide.md) | Unified MCP + Skills + Agents stack with 30-60-90 day rollout plan |
