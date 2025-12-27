<img src="../assets/microsoft/microsoft_copilot_program_delivery_manager.png" alt="Copilot Program Delivery Manager" width="80%">

# Program Delivery Manager Copilot Playbook

**Intent:** Help program delivery managers use Microsoft 365 Copilot to orchestrate daily operations, build actionable project plans, and run data-backed project reviews.

## When to Use
- Your nonprofit or operations team wants a repeatable Copilot workflow to keep multi-workstream initiatives on schedule.
- You need structured prompts that translate meeting noise, scattered documents, and team updates into trackable work items.
- Stakeholders expect crisp summaries, risk visibility, and proactive follow-ups without adding another PM tool to their stack.

## Scenario Overview
Adapted from Microsoft's "A day in the life of a Program Delivery Manager" journey, this playbook blends Outlook, Teams, Loop, Planner, and Microsoft 365 Copilot chat experiences. It adds two critical scenarios for program leaders:

1. **Morning command center** – digest inbox, meetings, and blockers before the stand-up.
2. **Create a project plan** – convert charter notes into a Loop table, Planner board, or backlog with milestones, owners, and key risks.
3. **Midday coordination** – capture decisions, action items, and dependencies from cross-functional syncs.
4. **Execute a project review** – generate a concise executive narrative, risk log, and next-step commitments from telemetry and notes.

> 💡 **Tip:** Pair this playbook with the [Role + Constraints + Format pattern](../03-prompts-and-patterns/role-constraint-format.md) when you need Copilot to return tables or JSON for downstream tools.

## Prerequisites
- Microsoft 365 Copilot enabled for Outlook, Teams, Loop, Word, and Excel.
- Shared project repository (SharePoint or OneDrive) that stores scope documents, status reports, and risk logs.
- Teams channel or Loop workspace dedicated to the program with agreed naming conventions for files and meetings.

## Copilot Workflow

### 1. Morning Command Center (Outlook + Copilot)
Purpose: Clear the inbox, surface blockers, and prep the daily stand-up in under 15 minutes.

**Prompt template:**
```text
You are my program operations chief of staff.
Analyze the unread emails tagged "Program X" and today's calendar.
Return:
- Top 3 issues requiring escalation (include sender, summary, proposed next step).
- Meetings I should join live vs. delegate (with reason).
- Missing updates or documents due today.
```

**Suggested follow-up prompts:**
- "Draft a Teams post summarizing these escalations with owners and due dates."
- "List any decisions pending my approval from yesterday's thread." 

**Output format:**
- Markdown list with bolded owners, due dates, and hyperlinks to source messages.

### 2. Create a Project Plan (Loop + Planner + Copilot Chat)
Purpose: Translate charter notes into a structured plan, aligned owners, and risk mitigations.

**Inputs to gather:**
- Problem statement, success metrics, target launch date.
- Resource constraints, external partners, and compliance checkpoints.
- Draft scope or discovery notes from kickoff meetings.

**Prompt template:**
```text
You are a senior program planner.
Based on the project charter below, build a 6-week execution plan.
Organize it into phases with tasks, accountable owners, dependencies, and success metrics.
Flag key risks with mitigation owners.
Return the plan as a markdown table with columns: Phase, Task, Owner, Dependency, Metric, Risk/Mitigation.

Charter:
[Paste summarized charter or notes]
```

**Loop + Planner hand-off:**
1. Paste the markdown table into Loop to co-edit owners and due dates.
2. Ask Copilot in Loop: "Convert this table into Planner tasks with due dates aligned to the Metric column milestones."
3. In Planner, run Copilot again to "Group tasks by phase and highlight those blocked by external dependencies."

**Quality checks:**
- Ensure each task has a singular accountable owner (not a team).
- Cross-verify dependencies with your roadmap or vendor timelines.
- Document risk triggers and early warning indicators inside Loop comments.

### 3. Midday Coordination (Teams Meetings + Copilot Notes)
Purpose: Capture meeting insights, decisions, and new work items without manual note taking.

**Meeting prep prompt:**
```text
You are my meeting producer.
Summarize the open questions and risks from the latest status report.
Highlight which stakeholders must be consulted in today's coordination call.
Suggest three probing questions to uncover hidden blockers.
```

**During the meeting:**
- Enable Teams meeting recap with Copilot for auto-generated notes and action items.
- Use Copilot to "Summarize decision points and owners for action items tagged 'critical'."
- Post-meeting, ask Copilot: "Draft a follow-up email confirming commitments and linking to the Loop workspace."

**Data hygiene:**
- Tag action items in Loop/Planner immediately with due dates.
- Archive meeting recordings and recaps in the project SharePoint folder.

### 4. Execute a Project Review (Excel/Word/Teams + Copilot)
Purpose: Deliver an executive-ready review narrative backed by metrics, risks, and next steps.

**Inputs to compile:**
- Latest OKR/KPI dashboard export or Excel tracker.
- Risk and issue log from Loop or Planner.
- Highlights from customer feedback or partner updates.

**Prompt template for Copilot in Excel or Word:**
```text
You are an executive program reviewer.
Using the attached status data and risk log, produce a project review brief.
Include sections: Achievements, KPI/Metric Trends, Risk & Issue Heatmap, Upcoming Milestones, Decisions Needed.
Highlight any schedule variance greater than 10% and propose mitigation owners.
Return in markdown with bullet lists for each section.
```

**Teams briefing prompt:**
```text
Generate a 3-slide storyline for the steering committee:
1. Impact achieved this period (tie to metrics).
2. Risks/issues requiring leadership support.
3. Next sprint priorities and asks.
Format as slide titles with 3 bullet points each.
```

**Follow-through:**
- Log leadership decisions back in Loop with timestamps and responsible leaders.
- Ask Copilot: "Draft individual follow-ups to each owner summarizing their commitments and due dates."

## Deliverables Checklist
- Daily command center summary with escalations and delegated meetings.
- Loop-based execution plan synced to Planner tasks and monitored metrics.
- Meeting recap repository with tagged action items and decision logs.
- Executive project review brief and steering committee storyline.

## References
- [Microsoft Adoption: A day in the life of a Program Delivery Manager](https://adoption.microsoft.com/en-us/scenario-library/nonprofit/a-day-in-the-life-of-a-program-delivery-manager/)
- [Microsoft Adoption: Create a project plan with Microsoft 365 Copilot](https://adoption.microsoft.com/en-us/scenario-library/information-technology/create-a-project-plan/)
- [Microsoft Adoption: Executing a project review with Microsoft 365 Copilot](https://adoption.microsoft.com/en-us/scenario-library/operations/executing-a-project-review/)
