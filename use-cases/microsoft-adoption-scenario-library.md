# Microsoft Adoption Scenario Library Prompts

## Intent
Help adoption leads and change managers turn the [Microsoft Adoption Scenario Library](https://adoption.microsoft.com/en-us/scenario-library/) into actionable prompt workflows across Microsoft 365 applications. The goal is to accelerate planning, stakeholder comms, and enablement deliverables for common productivity scenarios.

## Use when
- You are preparing a rollout or enablement plan using scenarios from the Microsoft Adoption Scenario Library.
- You need structured prompts to brief Copilot, generative AI, or automation tools for Microsoft 365 workloads.
- You want to translate business outcomes into day-to-day tasks for Champions, IT admins, or business units.

## Key inputs
| Input | Source | Notes |
| --- | --- | --- |
| Scenario summary | Scenario Library page | Start with the "Why" and "Get started" sections. |
| Target roles | Stakeholder list | Champions, executives, IT, HR, frontline, etc. |
| M365 workload focus | Scenario tags | Teams, SharePoint, Viva, Power Platform, Outlook, Loop. |
| Success metrics | Adoption KPIs | Meeting attendance, campaign reach, workflow automation, etc. |

## Output format
Provide structured outputs in Markdown with sections for:
1. **Scenario overview**
2. **Stakeholder actions** (per role)
3. **Communication plan** (channels + cadence)
4. **Enablement assets** (linked to templates or files)
5. **Metrics & follow-up**

## Workflow blueprint
1. **Discover** – Review the chosen scenario page, capture the business outcome, core capabilities, and featured resources.
2. **Align** – Map stakeholders and identify required Microsoft 365 apps or integrations.
3. **Prompt** – Use the prompt templates below to generate plans, campaigns, and training content.
4. **Validate** – Inspect generated outputs for policy alignment, security requirements, and regional considerations.
5. **Launch & iterate** – Publish communications, track KPIs, and refine prompts with feedback.

## Prompt examples

### 1. Teams Town Hall Rollout
**Use for:** Scenarios highlighting Microsoft Teams events, webinars, or town halls.

```text
You are an adoption lead preparing a Microsoft Teams town hall rollout based on the Microsoft Adoption Scenario Library.
Scenario summary: {{paste key bullet points}}
Target audience: {{executives, people managers, all employees, etc.}}
Key outcomes: {{e.g., increase live event participation, capture feedback}}
Constraints: {{brand guidelines, accessibility standards, translation needs}}

Produce a Teams town hall launch kit that includes:
- Stakeholder briefing (IT, communications, event moderators).
- Communication plan with Teams announcements, Viva Engage posts, and email reminders.
- Checklist for rehearsal, live event management, and post-event surveys.
Format the response using the defined output structure.
```

**Add-ons:** Ask Copilot in Teams to generate invitation drafts or follow-up polls, and loop in Viva Amplify for campaign distribution.

### 2. SharePoint Knowledge Base Refresh
**Use for:** Knowledge management or intranet modernization scenarios.

```text
Act as a knowledge manager using the Microsoft Adoption Scenario Library for SharePoint.
Scenario: {{name and link}}
Existing pain points: {{outdated content, low search satisfaction, duplicative sites}}
Stakeholders: {{content owners, champions, support agents}}
Required integrations: {{Viva Connections, Microsoft Search, Power Automate}}

Generate a refresh plan covering:
- Information architecture updates (hubs, site hierarchy, metadata).
- Content governance with roles, review cadences, and approval workflows.
- Enablement materials for page authors and champions.
- KPI dashboard outline leveraging SharePoint usage analytics and Power BI.
Follow the standard output format.
```

**Add-ons:** Use Copilot in SharePoint to draft page updates and Power Automate to schedule review reminders.

### 3. Power Platform Automation Sprint
**Use for:** Business process transformation scenarios featuring Power Automate, Power Apps, or Copilot Studio.

```text
You are coaching a departmental team through a Power Platform automation sprint inspired by the Microsoft Adoption Scenario Library.
Scenario name: {{copy from library}}
Department focus: {{finance, HR, operations, frontline}}
Process to automate: {{expense approvals, onboarding, inventory tracking}}
Governance requirements: {{DLP policies, maker guardrails, solution template reuse}}

Create a two-week sprint plan including:
- Discovery workshop agenda with intake questions.
- Backlog of candidate automations with impact vs. effort scoring.
- Training path for makers (Learning Pathways, Instructor-led sessions, Office Hours).
- Success metrics aligned to time saved, error reduction, or satisfaction scores.
Return the answer in the defined output structure.
```

**Add-ons:** Pair with Copilot in Power Automate for flow drafting and leverage the Center of Excellence (CoE) Starter Kit for governance.

## Adoption tips
- Reuse scenario storytelling assets (presentations, playbooks) as context for AI prompts to preserve messaging.
- Tag prompts with the scenario category (e.g., "Hybrid Meetings", "Frontline Communications") to make retrieval easier in prompt libraries.
- Capture generated artifacts in a central SharePoint or Loop workspace for cross-team visibility.
- Iterate on prompts after each rollout to codify lessons learned and feed back into the Scenario Library alignment.

## References
- Microsoft Adoption Scenario Library. https://adoption.microsoft.com/en-us/scenario-library/
