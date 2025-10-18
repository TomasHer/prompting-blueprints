> _Hero image placeholder — maintainers will upload final artwork._

# Microsoft SharePoint Knowledge Agent Blueprint

## Intent
Help SharePoint owners and knowledge managers turn scattered intranet content into governed, searchable answers by orchestrating the SharePoint Knowledge Agent’s metadata enrichment, content quality checks, and AI-assisted responses.

## When to use this blueprint
Use when you want SharePoint Knowledge Agent to:
- **Normalize metadata and site structures** so libraries stay aligned to taxonomies, Viva Topics, and retention standards.
- **Summarize, compare, and answer questions** about documents, news posts, and meeting notes directly inside the SharePoint canvas.
- **Detect stale or broken experiences**—from expired links to outdated policies—and propose actions before employees stumble onto them.
- **Accelerate migrations and redesigns** by applying modern templates, layout suggestions, and content snippets across sites and hubs.

### Agent profile quick reference
- **Type of task:** Knowledge management and intranet governance inside SharePoint.
- **Depth of reasoning:** Context-aware summarization, metadata inference, and proactive insights grounded in site content.
- **Output format:** Inline answers, metadata updates, remediation checklists, and guided prompts for site owners.
- **Ideal use case:** Corporate intranet refreshes, HR/IT knowledge bases, policy libraries, merger integrations.
- **Example prompts:**
  - “Knowledge Agent, audit this benefits site for outdated enrollment links and recommend fixes.”
  - “Compare last year’s security policy with the current draft and highlight what changed for end users.”
  - “Generate a Viva Topic summary card for this project archive and suggest subject matter experts to tag.”

## Workflow overview for SharePoint Knowledge Agent
1. **Confirm access and licensing.** Ensure site owners and knowledge managers have Microsoft 365 Copilot entitlements; Knowledge Agent is in Public Preview for Copilot users with worldwide availability targeted for early 2025.
2. **Scope the library or site.** Identify which SharePoint site, list, or page library needs enrichment. Pin the location in the agent instructions so it focuses on the correct scope when responding.
3. **Run metadata enrichment.** Ask the agent to apply or suggest properties (content type, audience, lifecycle stage) and to surface gaps such as missing owners, outdated review dates, or inconsistent tags.
4. **Remediate quality issues.** Direct the agent to detect broken links, stale content, or duplicate files and generate actionable remediation tasks for the responsible owners.
5. **Publish answers and updates.** Use the agent to produce page summaries, Q&A snippets, or change logs and confirm the results inside SharePoint before publishing to employees.
6. **Track follow-through.** Log requests to content owners (e.g., “update this policy by Friday”) and capture the agent’s reasoning in a governance tracker for auditing.

## Core capability plays
- **Metadata enrichment:** Automatically set site and file properties, flag stale assets, and recommend lifecycle actions (archive, refresh, redirect). Pair with term store policies to keep taxonomy consistent.
- **Content migration & modernization:** Align classic pages to new templates, migrate knowledge into Viva, and apply layout suggestions when rolling out hub redesigns.
- **Content answers:** Summarize long-form documents, compare versions, break down meeting notes, and convert insights into draft announcements or FAQs.
- **Knowledge intelligence:** Surface subject matter experts, identify duplicate materials, connect related projects, and inform knowledge gap analyses.

## Configuration checklist for site owners
- **Enable SharePoint web experiences.** Knowledge Agent currently lives inside the SharePoint canvas; confirm modern pages are in use and that the agent is enabled for your tenant during preview.
- **Map authoritative sources.** List critical libraries (HR policies, IT support, product knowledge) so the agent prioritizes accurate content when answering questions.
- **Decide on governance cadence.** Set review intervals (quarterly policy reviews, monthly link checks) and log them in Planner/Loop so the agent can remind owners when content is due for updates.
- **Prep migration scripts.** For site modernization projects, upload existing templates, style guides, and sample pages so the agent can reuse them when refactoring layouts.
- **Align with Viva & Copilot.** Connect knowledge outputs to Viva Topics or Copilot experiences so employees can surface the same answers across Microsoft 365.

## Prompt patterns and usage scenarios
- **HR resources:** “Identify duplicate parental leave articles, consolidate them, and draft an updated benefits summary for 2025 enrollment.”
- **IT support portals:** “Triage the top ‘VPN access’ tickets, surface missing KB articles, and highlight broken links in the troubleshooting section.”
- **Legal & compliance hubs:** “Summarize the latest policy update, tag the compliance owner, and request acknowledgement from regional leads.”
- **Sales enablement centers:** “Compare competitor battlecards, note what’s outdated, and propose refresh tasks for the field marketing owner.”

## Guardrails and best practices
- **Review before publishing.** Even when metadata and summaries look correct, require a human approval step for regulated content (e.g., HR, legal, compliance). Document the approver inside the page details panel.
- **Capture feedback loops.** Encourage employees to rate answers or submit corrections through SharePoint forms; feed the responses back into the agent to prioritize fixes.
- **Respect data residency.** Keep sensitive libraries restricted to the correct groups and review tenant-wide policies before enabling Knowledge Agent on confidential sites.
- **Educate content owners.** Provide quick tips on invoking the agent, interpreting suggested actions, and closing loops on assigned updates so improvements stick.

## Alignment with Microsoft guidance
Microsoft’s official Knowledge Agent overview stresses its availability within SharePoint, focus on metadata enrichment, and preview timeline for Microsoft 365 Copilot customers. Mirror those recommendations by enabling the agent in modern SharePoint sites, pairing it with governance policies, and planning for global rollout as preview capabilities mature.

## References
- Microsoft. “Knowledge Agent: An overview.” https://support.microsoft.com/en-gb/topic/knowledge-agent-an-overview-c0b1efc3-81d0-4981-8be9-7ba3a75fae15
- Microsoft. “SharePoint Knowledge Agent Cheatsheet” (2025).
