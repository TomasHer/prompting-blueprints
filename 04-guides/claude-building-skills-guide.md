# Claude Building Skills Guide

## Why this guide matters
Skills have effectively replaced classic prompt engineering for AI agents. Instead of rewriting long prompts every time, you can package reusable task intelligence once and apply it across Claude.ai, Claude Code, and API workflows.

If you are building AI agents or working with MCP integrations, skills are now a practical competitive advantage: they improve consistency, reduce token usage, and scale expert workflows across teams.

For a foundational companion, read **[Claude Agent Skills Playbook](../02-ai-agents/claude-agent-skills.md)**.

---

## What are Skills?
A Claude skill is:

- A folder containing YAML frontmatter and Markdown instructions
- A reusable unit that teaches Claude a specific task or workflow
- Portable across Claude surfaces (Claude.ai, Claude Code, API)
- Designed with progressive disclosure to minimize token usage while preserving depth when needed

---

## Three core design principles

### 1) Progressive Disclosure
Use layered loading so Claude pulls only what is needed:

- **Level 1:** YAML frontmatter (always loaded)
- **Level 2:** `SKILL.md` body (loaded when relevant)
- **Level 3:** linked files (loaded only as needed)

### 2) Composability
- Multiple skills can run together.
- Your skill should complement other skills, not conflict with them.

### 3) Portability
- Build once, use everywhere.
- The same skill should work across Claude interfaces.

---

## Three common skill categories

### 1) Document & Asset Creation
- Produces consistent outputs for docs, presentations, or apps
- Includes style guides and templates
- Example: `frontend-design`

### 2) Workflow Automation
- Encodes multi-step processes with repeatable methodology
- Uses ordered steps and validation gates
- Example: `skill-creator`

### 3) MCP Enhancement
- Adds workflow guidance on top of MCP tool access
- Coordinates multiple MCP calls in sequence
- Example: `sentry-code-review`

---

## Critical technical requirements

### File structure
- Skill folder name must be **kebab-case** (example: `my-skill-name`)
- File name must be exactly **`SKILL.md`** (case-sensitive)
- Do **not** use `README.md` inside a skill folder

### Required YAML frontmatter
- `name`: should be in **UPPER-CASE**
- `description`: must explain
  - what the skill does,
  - when to use it,
  - and trigger phrases the agent can detect

---

## Writing effective skill descriptions

✅ **Good**

> "Analyzes Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for 'design specs' or 'design-to-code handoff'."

❌ **Bad**

> "Helps with projects"

Why bad: too vague and lacks triggers.

---

## Five popular design patterns

### 1) Sequential Workflow Orchestration
- Runs a process in a strict step order

### 2) Multi-MCP Coordination
- Spans multiple services and toolchains

### 3) Iterative Refinement
- Improves quality through repeated review-and-revise loops

### 4) Context-Aware Tool Selection
- Chooses different tools for the same objective based on context

### 5) Domain-Specific Intelligence
- Encodes specialized expertise beyond basic tool usage

---

## Practical takeaway
If prompt engineering helped you get one-off results, skills help you operationalize those results at scale. Start by creating one narrowly scoped skill with strong triggers and clear step-by-step instructions, then compose it with others as your workflows grow.

## Source context
This guide is based on your provided summary of Anthropic’s skill-building framework and aligned with your existing **[Claude Agent Skills Playbook](../02-ai-agents/claude-agent-skills.md)**.
