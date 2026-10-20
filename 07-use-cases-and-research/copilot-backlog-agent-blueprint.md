---
title: "Copilot Backlog Agent Blueprint (Azure DevOps MCP)"
tags: ["research", "github-copilot", "azure-devops"]
last_updated: 2026-10-20
---

# Copilot Backlog Agent Blueprint (Azure DevOps MCP)

## Intent
Give a GitHub Copilot agent in VS Code a complete, file-based **harness** for managing Azure DevOps (ADO) work items through the Azure DevOps MCP server. Every part of the harness is a plain file in git, so you can review it, version it, and improve it with the [Harness Improvement Loop](./copilot-harness-improvement-loop.md).

## Use when
- You use GitHub Copilot in VS Code and want an agent that triages, refines, and reports on ADO backlog items.
- You want guardrails that hold even when the model forgets an instruction (for example, "never write without approval").
- You want a starting point you can tune, instead of one long prompt pasted into chat.

## Prerequisites
- VS Code with GitHub Copilot Chat, using the default (**Local**) agent session.
- Node.js 20+ (for `npx`) and access to an ADO organization.
- Ask your Copilot admin whether MCP servers, custom agents, and hooks are allowed by your organization's policy. Admins can turn each of them off.

## The harness, component by component
The table maps the eight harness components from Google Research's Harness² framework to Copilot files. The rest of this page fills in each file.

| # | Harness component | Copilot file | Role in the backlog agent |
|---|---|---|---|
| c1 | System prompt | `.github/copilot-instructions.md` | Who the agent is and how it works |
| c2 | Guardrails | Same file + agent `tools` list | What it must never do |
| c3 | Memory | `docs/backlog/backlog-context.md` | Team conventions: area paths, tags, states |
| c4 | Tool guidance | `.github/instructions/ado-tools.instructions.md` | Which MCP tool to use for what |
| c5 | Subagents | `.github/agents/*.agent.md` | A read-only planner and a write-enabled executor |
| c6 | Skills | `.github/skills/<name>/SKILL.md` | Repeatable workflows (triage, refinement) |
| c7 | Scripts | `scripts/*.js` | Deterministic helpers, such as the hook below |
| c8 | Plugins | `.github/hooks/*.json` | `PreToolUse` hook that blocks writes in plan mode |

## Step 1 — Connect the Azure DevOps MCP server
Create `.vscode/mcp.json`. The `-d` flag loads only the domains the agent needs; always include `core`.

```json
{
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "<your-organization>", "-d", "core", "work", "work-items", "search"]
    }
  }
}
```

The server's work-item tools are split into read and write tools, which makes guardrails easy:

| Read (safe) | Write (needs approval) |
|---|---|
| `wit_work_item` (get, get_batch, list_comments, list_revisions, list_for_iteration) | `wit_work_item_write` (create, update, update_batch, add_child) |
| `wit_query` (saved queries, ad-hoc WIQL) | `wit_work_item_comment_write` |
| `wit_backlog` (list, list_work_items) | `wit_work_item_link_write` |
| `search_workitem`, `core_list_projects`, `work` (iterations, capacity) | `wit_backlog` action `reorder`, `work_iteration_write`, `work_capacity_write` |

Tool names change between server versions. Check the current list in the Copilot tools picker or in the server's `docs/TOOLSET.md`.

## Step 2 — System prompt and guardrails (c1, c2)
`.github/copilot-instructions.md`:

```markdown
# Backlog agent

You manage Azure DevOps work items for <team name> in project <project>.
Use the `ado` MCP server for all work-item data. Never invent IDs, fields, or states.

## How you work
1. Read before you write: fetch the current item(s) and their revisions first.
2. Plan every change as a table: ID | field | old value | new value | reason.
3. Wait for explicit approval ("apply") before calling any *_write tool.
4. After writing, re-read the items and report what actually changed.

## Never
- Close, remove, or change the state of items you were not asked about.
- Change Assigned To, Iteration Path, or Priority without a stated reason from the user.
- Write more than 20 items in one batch.
- Put credentials, customer names, or personal data into comments.

Team conventions live in docs/backlog/backlog-context.md. Read it at the start of every task.
```

## Step 3 — Memory (c3)
`docs/backlog/backlog-context.md` holds facts the agent cannot infer. Keep it short and factual.

```markdown
# Backlog conventions
- Area paths: <Project>\Platform, <Project>\Mobile, <Project>\Data
- Work item types: Epic > Feature > User Story > Task; Bug is a sibling of User Story
- Required on every User Story: Acceptance Criteria, Story Points, Area Path
- Tags: `needs-refinement`, `blocked`, `tech-debt` (no other tags)
- States: New > Active > Resolved > Closed (Bugs) / New > Active > Closed (Stories)
- A Bug without repro steps stays in New and gets the `needs-refinement` tag
```

## Step 4 — Tool guidance (c4)
`.github/instructions/ado-tools.instructions.md`. The `description` lets the agent load this file only when the task involves ADO.

```markdown
---
description: How to use the Azure DevOps MCP tools for work-item tasks
---
- Find items: prefer `wit_query` with WIQL over `search_workitem` when filtering by fields.
  Always include `[System.TeamProject] = @project` and `[System.State] <> 'Closed'`.
- Read many items: use `wit_work_item` with get_batch, not one call per ID.
- History questions ("who changed this?"): use list_revisions.
- Updates: one `wit_work_item_write` update_batch call per approved change table.
- Field reference names: System.Title, System.State, System.AreaPath, System.IterationPath,
  Microsoft.VSTS.Common.AcceptanceCriteria, Microsoft.VSTS.Scheduling.StoryPoints, System.Tags.
```

## Step 5 — Subagents: planner and executor (c5)
`.github/agents/backlog-planner.agent.md` can only read. It is the agent you use by default.

```markdown
---
name: Backlog Planner
description: Analyse ADO work items and propose changes without writing anything
tools: ['ado/wit_work_item', 'ado/wit_query', 'ado/wit_backlog', 'ado/search_workitem', 'ado/work', 'ado/core_list_projects', 'read']
---
Analyse the request against the backlog. Do not write to Azure DevOps.
Return: (1) a short finding summary, (2) the change table, (3) open questions.
```

`.github/agents/backlog-executor.agent.md` applies a change table that was already approved.

```markdown
---
name: Backlog Executor
description: Apply an approved change table to ADO work items
tools: ['ado/*', 'read']
---
Apply only the rows of the approved change table in this conversation. Nothing else.
Re-read every changed item afterwards and report old -> new values.
```

The `<server>/*` form grants all tools of a server. Confirm the single-tool names in the tools picker.

## Step 6 — Skills (c6)
`.github/skills/backlog-triage/SKILL.md`:

```markdown
---
name: backlog-triage
description: Triage new Bugs and User Stories in Azure DevOps. Use when asked to triage, clean up, or review new backlog items.
---
1. Query items in state New created in the last 14 days (WIQL).
2. For each item check the required fields from backlog-context.md.
3. Flag duplicates: same component and >70% title overlap -> propose a link, not a close.
4. Output the change table. Add `needs-refinement` where information is missing.
```

Add similar skills for `epic-refinement` (split an Epic into Features and Stories) and `sprint-report` (summarise an iteration).

## Step 7 — Plugin-level guardrail: block writes in plan mode (c8, c7)
Instructions can be ignored; a hook cannot. This `PreToolUse` hook denies every ADO write while a `.backlog-plan-only` file exists in the workspace root, for example during the improvement loop. Create or delete the file to switch modes.

`.github/hooks/backlog-guard.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "type": "command", "command": "node scripts/backlog-guard.js", "timeout": 10 }
    ]
  }
}
```

`scripts/backlog-guard.js`:

```js
// Deny Azure DevOps write tools while .backlog-plan-only exists in the workspace root.
const fs = require("fs");
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const event = JSON.parse(input);
  const name = event.tool_name || "";
  const action = (event.tool_input && event.tool_input.action) || "";
  const isWrite = /_write$/.test(name) || (name.endsWith("wit_backlog") && action === "reorder");
  if (fs.existsSync(".backlog-plan-only") && isWrite) {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Plan-only mode: Azure DevOps writes are blocked.",
        additionalContext: "Return the change table instead of writing."
      }
    }));
  }
});
```

Hooks need the `chat.useHooks` setting and a trusted workspace. The script assumes hooks run from the workspace root; use an absolute path to the flag file if yours do not. The tool name passed to the hook can include a server prefix, which is why the script matches on the suffix; check the exact names in the chat debug view.

## Example
**Prompt (Backlog Planner, `/backlog-triage`):** "Triage this week's new bugs for the Mobile area."

**Expected output structure:**

```markdown
Found 6 new Bugs in <Project>\Mobile. 2 are missing repro steps, 1 likely duplicates #4812.

| ID | Field | Old | New | Reason |
|---|---|---|---|---|
| 4907 | System.Tags | — | needs-refinement | No repro steps |
| 4911 | System.Tags | — | needs-refinement | No repro steps |
| 4915 | Link | — | Duplicate of #4812 | Same crash signature in title and stack trace |

Open questions: Should #4915 be closed after linking, or stay open for the Android team?
```

Reply "apply" and switch to **Backlog Executor** to make the changes.

## Failure modes
- **Agent writes without approval.** Use the Planner agent by default; it has no write tools.
- **Wrong field reference names.** Keep the field list in the tool guidance file and correct it when you see errors.
- **Huge result sets fill the context.** Always filter WIQL by project, state, and date.
- **Conventions drift.** Update `backlog-context.md` when the team changes a rule; the next loop round will test it.

## Related
- [Harness Improvement Loop for Copilot Agents](./copilot-harness-improvement-loop.md)
- [GitHub Copilot Custom Instructions Tutorial](../05-tools/github-copilot-custom-instructions-tutorial.md)
- [GitHub Copilot Coding Agent MCP Tutorial](../05-tools/github-copilot-coding-agent-mcp-tutorial.md)
- [Model Context Protocol (MCP) Guide](../02-ai-agents/04-protocols/mcp-guide.md)

## References
- [Microsoft – Azure DevOps MCP Server (GitHub)](https://github.com/microsoft/azure-devops-mcp)
- [Microsoft – Azure DevOps MCP Server toolset (GitHub)](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/TOOLSET.md)
- [VS Code – Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [VS Code – Agent hooks](https://code.visualstudio.com/docs/agent-customization/hooks)
- [VS Code – Agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [VS Code – Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Google Research – Harness²: Recursive Agent Harnessing for an Open World (GitHub)](https://github.com/google-research/harness2)
