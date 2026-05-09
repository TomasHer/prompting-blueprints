---
title: "Claude Skills Design Patterns"
tags: ["agents", "claude-agent", "skills"]
last_updated: "2026-05-09"
---

# Claude Skills Design Patterns

## Intent

Use this guide to choose and implement the right structural pattern for a Claude Agent Skill. Each pattern includes a decision rule, a concrete pseudocode example, and the key techniques that make it work.

For skill anatomy and technical requirements see [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md). For testing guidance see [Skills Testing and Iteration](./skills-testing-iteration.md).

---

## Choosing your approach

Before selecting a pattern, decide your framing:

- **Problem-first** — users describe an outcome ("set up a project workspace") and the skill orchestrates the right tool calls. Best when users know what they want but not how to get it.
- **Tool-first** — users already have a service connected via MCP ("I have Notion MCP") and the skill teaches Claude the optimal workflows. Best when users know the tool but not the best practices.

Most skills lean one direction. The five patterns below cover both framings.

---

## Pattern 1: Sequential Workflow Orchestration

**Use when:** The task requires multiple steps in a fixed order, where each step depends on the output of the previous one.

**Example — customer onboarding:**

```
## Workflow: Onboard New Customer

### Step 1: Create account
Call MCP tool: create_customer
Parameters: name, email, company

### Step 2: Set up payment
Call MCP tool: setup_payment_method
Wait for: payment method verification confirmed

### Step 3: Create subscription
Call MCP tool: create_subscription
Parameters: plan_id, customer_id (from Step 1 result)

### Step 4: Send welcome email
Call MCP tool: send_email
Template: welcome_email_template
```

**Key techniques:**
- Number each step explicitly — Claude will not reorder numbered steps.
- Pass output from one step as named input to the next.
- Add a validation check before each irreversible action.
- Include rollback instructions for failure at each stage.

---

## Pattern 2: Multi-MCP Coordination

**Use when:** The workflow spans multiple services that each hold part of the data or action surface.

**Example — design-to-development handoff:**

```
### Phase 1: Export from Figma (Figma MCP)
1. Export design assets
2. Generate design specifications
3. Create asset manifest

### Phase 2: Store assets (Drive MCP)
1. Create project folder
2. Upload all assets
3. Generate shareable links

### Phase 3: Create tasks (Linear MCP)
1. Create development tasks
2. Attach asset links
3. Assign to engineering team

### Phase 4: Notify team (Slack MCP)
1. Post handoff summary to #engineering
2. Include asset links and task references
```

**Key techniques:**
- One phase per MCP service — keeps responsibilities clear.
- Validate the output of each phase before calling the next service.
- Handle the case where one MCP service is unavailable without failing the entire workflow.
- Use centralized error handling rather than per-step try/catch logic.

---

## Pattern 3: Iterative Refinement

**Use when:** Output quality improves with review-and-revise cycles, and a single pass is not reliable enough.

**Example — report generation:**

```
### Initial draft
1. Fetch data via MCP
2. Generate first draft
3. Save to temporary file

### Quality check
1. Run validation: scripts/check_report.py
2. Identify issues:
   - Missing required sections
   - Inconsistent formatting
   - Data values that do not match source

### Refinement loop
1. Address each identified issue
2. Regenerate affected sections
3. Re-run validation
4. Repeat until all checks pass (maximum 3 iterations)

### Finalisation
1. Apply final formatting
2. Generate executive summary
3. Save final version
```

**Key techniques:**
- Define explicit quality criteria — do not rely on Claude's judgement alone.
- Set a maximum iteration count to prevent infinite loops.
- Use validation scripts in `scripts/` where checks must be deterministic.
- Distinguish between "fix and retry" issues and "escalate to human" issues.

---

## Pattern 4: Context-Aware Tool Selection

**Use when:** The same end goal requires different tools depending on the characteristics of the input.

**Example — smart file storage:**

```
### Decision tree
1. Check file type and size:
   - Large files (> 10 MB): use cloud storage MCP
   - Collaborative documents: use Notion/Docs MCP
   - Code files: use GitHub MCP
   - Temporary files: use local storage

### Execute storage
- Call the selected MCP tool
- Apply service-specific metadata
- Generate access link

### Inform the user
- Explain which storage was chosen and why
```

**Key techniques:**
- Make decision criteria explicit and unambiguous — avoid vague conditions like "large files" without a defined threshold.
- Always provide a fallback for the case where the preferred tool is unavailable.
- Tell the user which path was taken and why, so they can override if needed.

---

## Pattern 5: Domain-Specific Intelligence

**Use when:** The skill adds specialist knowledge or compliance logic that goes beyond what the tool itself enforces.

**Example — payment processing with compliance:**

```
### Pre-processing compliance check
1. Fetch transaction details via MCP
2. Apply compliance rules:
   - Check against sanctions lists
   - Verify jurisdiction allowances
   - Assess fraud risk level
3. Document the compliance decision

### Processing
IF compliance passed:
  - Call payment processing MCP tool
  - Apply fraud-check parameters
  - Record transaction ID
ELSE:
  - Flag transaction for manual review
  - Create compliance case with reason code

### Audit trail
- Log all compliance checks with timestamps
- Record every processing decision
- Generate audit report for the session
```

**Key techniques:**
- Run compliance or safety checks *before* taking any irreversible action.
- Make every decision auditable — log both the check and the outcome.
- Embed the "when to escalate to a human" rule explicitly in the instructions.
- Keep long domain rules in a `references/` sibling file so `SKILL.md` stays under 5 000 tokens.

---

## Pattern selection guide

| Situation | Recommended pattern |
|---|---|
| Steps must happen in strict order | Sequential Workflow Orchestration |
| Workflow touches more than one service | Multi-MCP Coordination |
| First-pass output is often imperfect | Iterative Refinement |
| Same goal, multiple valid tool paths | Context-Aware Tool Selection |
| Embedded rules, compliance, or expertise | Domain-Specific Intelligence |

---

## References

- [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md)
- [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md)
- [Skills Testing and Iteration](./skills-testing-iteration.md)
- [Anthropic – The Complete Guide to Building Skills for Claude (PDF)](../assets/guides/anthropic-claude-skills-guide.pdf)
- [GitHub — anthropics/skills repository](https://github.com/anthropics/skills)
