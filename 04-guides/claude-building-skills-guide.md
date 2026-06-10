---
title: "Claude Building Skills Guide"
tags: ["guides", "claude-building"]
last_updated: "2026-03-15"
---

# Claude Building Skills Guide

**Source:** [Anthropic – The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) · [Announcement post](https://claude.com/blog/complete-guide-to-building-skills-for-claude)

## Why this guide matters
Skills have effectively replaced classic prompt engineering for AI agents. Instead of rewriting long prompts every time, you can package reusable task intelligence once and apply it across Claude.ai, Claude Code, and API workflows.

If you are building AI agents or working with MCP integrations, skills are now a practical competitive advantage: they improve consistency, reduce token usage, and scale expert workflows across teams.

For a foundational companion, read **[Claude Agent Skills Playbook](../02-ai-agents/02-skills/claude-agent-skills.md)**.

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

## Planning your skill: use-case methodology

Before writing any instructions, define 2–3 concrete use cases your skill must handle. A good use case has four parts:

| Part | What to define |
|---|---|
| **Trigger** | The exact phrase or intent that should activate the skill |
| **Steps** | The ordered actions Claude must take |
| **Tools needed** | Built-in Claude capabilities or specific MCP tools |
| **Result** | What a successful completion looks like |

**Example:**

```
Trigger: "help me plan this sprint" or "create sprint tasks"
Steps:
  1. Fetch current project status from Linear (via MCP)
  2. Analyse team velocity and capacity
  3. Suggest task prioritisation
  4. Create tasks with proper labels and estimates
Result: Fully planned sprint with tasks created in Linear
```

Ask yourself before building:
- What does a user want to accomplish?
- What multi-step workflow does this require?
- Which tools are needed (built-in Claude capabilities or MCP)?
- What domain knowledge or best practices should be embedded?

---

## Defining success criteria

Set measurable targets before testing so you know when to stop iterating.

**Quantitative:**
- Skill triggers on ≥ 90% of relevant queries — run 10–20 representative prompts and count automatic loads vs. manual invocations.
- Target tool call count per workflow — compare with and without the skill to confirm it reduces back-and-forth.
- Zero failed API calls per run — monitor MCP server logs during testing for retry rates and error codes.

**Qualitative:**
- Users do not need to prompt Claude for next steps during the workflow.
- Workflow completes without user correction across 3–5 repeated runs.
- A new user can accomplish the task on first try with minimal guidance.

---

## Critical technical requirements

### File structure
- Skill folder name must be **kebab-case** (example: `my-skill-name`)
- File name must be exactly **`SKILL.md`** (case-sensitive)
- Do **not** use `README.md` inside a skill folder

### Required YAML frontmatter
- `name`: must be in **kebab-case** (lowercase letters, numbers, and hyphens only)
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

## Distribution essentials

### Installing a skill

**Claude.ai / Claude Code (individual):**
1. Zip the skill folder: `zip -r my-skill.zip my-skill/`
2. Claude.ai → Settings → Capabilities → Skills → Upload skill
3. For Claude Code: place the unzipped folder in `.claude/skills/`

**Organisation-wide:** Admins can deploy skills workspace-wide from the Anthropic console. Skills update automatically for all users without manual reinstallation.

### Using skills via the API

Add the `container.skills` parameter and the required beta headers to any Messages API request:

```python
headers = {
    "anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02,files-api-2025-04-14"
}
```

Up to 8 skills per request. Skills require the Code Execution Tool beta for their sandboxed runtime environment.

| Use case | Best surface |
|---|---|
| End users interacting directly | Claude.ai / Claude Code |
| Manual testing during development | Claude.ai / Claude Code |
| Applications using skills programmatically | API |
| Automated pipelines and agent systems | API |

---

## Practical takeaway
If prompt engineering helped you get one-off results, skills help you operationalize those results at scale. Start by creating one narrowly scoped skill with strong triggers and clear step-by-step instructions, then compose it with others as your workflows grow.

## References
- [Anthropic – The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- [Anthropic — Skills for Claude Agents](https://www.anthropic.com/news/skills)
- [Anatomy of a Claude Agent Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md)
- [Claude Agent Skills Playbook](../02-ai-agents/02-skills/claude-agent-skills.md)
