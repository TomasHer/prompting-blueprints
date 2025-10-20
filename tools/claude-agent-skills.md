<img src="../assets/anthropic/claude-agent-skills.svg" alt="Claude Agent Skills" width="80%">

# Claude Agent Skills Playbook

## Intent
Help prompt engineers design, publish, and maintain Claude Agent Skills that extend the Anthropic Agent platform with reusable workflows and high-signal guidance.

## What Are Agent Skills?
- **Reusable capability modules** that bundle goals, instructions, tools, and guardrails for a repeatable task such as "qualify a lead" or "summarize a case."  
- **Attachable to Claude agents** in the Anthropic console so non-technical teams can add vetted behavior without editing the core agent instructions.  
- **Discoverable via the Skills Library,** where admins curate which skills appear for different teams or lines of business.

### Skill Anatomy
| Component | Purpose | Notes |
| --- | --- | --- |
| **Summary** | One-sentence positioning that appears in the skills browser. | Use action verbs and highlight the outcome. |
| **Detailed instructions** | Core logic, step-by-step flows, escalation rules, and output guidance. | Write in second person ("You are...") and keep paragraphs short. |
| **Input expectations** | Fields the skill requires from the invoking agent or end user. | Prompt the agent to confirm missing inputs before proceeding. |
| **Output format** | Structured Markdown or JSON to guarantee predictable downstream handling. | Include headings for status, recommendations, and follow-up tasks. |
| **Guardrails** | Compliance, privacy, or tone constraints. | Clarify when to hand off to a human or decline the request. |

## Skill Lifecycle in Anthropic's Platform
1. **Authoring:** Builders create skills inside the Anthropic console, supply instructions, define inputs/outputs, and attach optional tool integrations.  
2. **Curation:** Skills ship to a shared library where admins review, tag, and gate access by workspace or catalog.  
3. **Activation:** Claude agents pull approved skills into their configuration. The agent announces skill availability in chat and can recommend one when the user intent matches its trigger phrases.  
4. **Iteration:** Builders monitor telemetry (success rate, fallback usage, user satisfaction) and ship revisions while older versions stay available for rollback.

## Designing High-Value Skills
- **Solve scoped, repetitive work:** Skills should automate a bounded workflow (e.g., "triage refund requests"), not broad problem spaces.  
- **Document prerequisites up front:** List required data sources, CRM objects, or URLs so the agent can verify access.  
- **Anticipate escalation paths:** Spell out when to transfer to a human or route to another skill.  
- **Embed decision trees:** Use numbered steps with conditional bullet points to reduce hallucinations.  
- **Provide deterministic outputs:** Favor titled bullet lists, tables, or JSON dictionaries so downstream systems can parse results.

### Recommended Output Skeleton
```markdown
## Status
- success|blocked|needs-human

## Key Findings
- Bullet list of facts the skill verified

## Recommended Actions
1. Ordered list of next steps for the requester

## Follow-ups
- Any questions the agent still needs answered
```

## Skill Catalog Strategy
- **Group skills by business domain** (e.g., customer support, onboarding, marketing operations) so stakeholders can find what they need quickly.  
- **Share skills across agents** when the workflow is identical; avoid duplicating instructions per agent.  
- **Maintain version notes** explaining what changed in each release, especially when adding tool permissions or new outputs.  
- **Retire deprecated skills** by removing them from catalogs and annotating their replacements.

## Building a Skill Step by Step
1. **Interview subject-matter experts** to capture the canonical workflow and edge cases.  
2. **Draft instructions** using the anatomy table above; highlight required inputs, verification steps, and fail-safes.  
3. **Prototype in Claude** by pasting the instructions into a temporary skill and running representative test prompts.  
4. **Instrument the skill** with telemetry fields (success criteria, handoff counters) to measure adoption after release.  
5. **Package with supporting assets** such as SOP links or ticket templates, ensuring URLs are accessible to the agent.  
6. **Publish to the library** with clear tags and include onboarding notes in your internal change log.

## Example Skill Blueprint
| Field | Example |
| --- | --- |
| **Skill name** | SaaS Renewal Risk Scan |
| **Summary** | Identify high-risk renewals and surface mitigation steps. |
| **Instructions** | "You are a renewal analyst..." Gather ARR, term end date, usage metrics. Flag accounts with low usage or overdue invoices. Recommend outreach playbooks. Escalate to account manager if ARR > $100k or customer health < 40. |
| **Inputs** | Account name, ARR, renewal date, usage score, open support tickets. |
| **Outputs** | Markdown sections: Status, Risk Drivers, Mitigation Plan, Follow-up Owner. |
| **Guardrails** | Do not adjust financial records. Escalate if data is incomplete. |

## Validation Checklist
- [ ] Skill instructions include success criteria, decline scenarios, and escalation triggers.  
- [ ] Input requirements are enumerated and validated before the workflow runs.  
- [ ] Output template is deterministic and shared with downstream consumers.  
- [ ] Test prompts cover happy path, missing data, and compliance edge cases.  
- [ ] Telemetry or feedback loop is configured to monitor adoption.

## References
- [Anthropic — Skills for Claude Agents](https://www.anthropic.com/news/skills)
