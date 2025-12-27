# n8n Vibe Research Workflow Tutorial

## Intent
Enable academic researchers and n8n developers to co-design a vibe research automation during a 60-minute brainstorming lab, resulting in a shareable n8n workflow template that conference participants can reuse in 2026 workshops.

## Use when
- You are convening cross-functional research and automation teams to test-drive vibe research patterns before investing in production tooling.
- You need a structured, time-boxed format to translate speculative sensemaking into an actionable automation brief.
- You want to capture insight loops, guardrails, and data provenance directly inside an n8n workflow for later publication on the [n8n templates gallery](https://n8n.io/workflows/).

## Audience and roles
| Role | Responsibilities during session | Post-session ownership |
| --- | --- | --- |
| Academic researchers | Define the vibe research focus area, surface open questions, and validate ethics constraints. | Supply data sources, annotate insight clusters, and prepare references for deep research follow-up. |
| n8n developers | Map prompts and data sources into nodes, evaluate trigger + execution constraints, and prototype branching logic. | Harden credentials, add error handling, and package the workflow for the template gallery submission. |
| Facilitator | Keep the agenda on track, mediate decisions, and document unresolved risks. | Compile session notes, publish recap, and maintain alignment with conference workshop goals. |

## Pre-session checklist (sent 48 hours ahead)
1. Share the [Vibe Research Playbook](../07-use-cases-and-research/vibe-research.md) to align on terminology and guardrails.
2. Provide a 3-question form capturing the research theme, must-have data feeds (RSS, APIs, spreadsheets), and compliance flags.
3. Set up a shared n8n cloud workspace or self-hosted instance with demo credentials plus a sandbox Slack or email endpoint for output testing.
4. Prepare a whiteboard (Miro, FigJam) with three lanes: "Signals", "Automation opportunities", and "Risks & follow-ups".
5. Export an n8n starter workflow skeleton containing trigger, HTTP Request, and Set nodes; ensure participants can import JSON locally.

## 60-minute agenda
| Minute | Segment | Objectives | Facilitation tips |
| --- | --- | --- | --- |
| 0–5 | Welcome & framing | Reiterate session intent, desired template deliverable, and vibe research mindset. | Show example n8n template to anchor expectations. |
| 5–15 | Vibe pulse download | Researchers summarize emerging narratives, metaphors, and priority questions. | Capture each signal on sticky notes tagged with "evidence strength" from the vibe playbook matrix. |
| 15–25 | Workflow opportunity sketch | Developers translate signals into potential triggers, inputs, and automations. | Use n8n node cards (Trigger, HTTP Request, OpenAI, Code, Merge) to mock the flow live. |
| 25–40 | Prototype pathing | Build a draft n8n workflow: connect trigger → data fetch → clustering → insight brief. | Pair-build in n8n with screenshare; freeze every 5 minutes to confirm guardrails and data lineage. |
| 40–50 | Output & review | Generate a sample "Vibe Brief" output and evaluate against vibe playbook handoff checklist. | Annotate gaps in formatting, ethics considerations, and follow-up research tasks. |
| 50–60 | Template packaging | Agree on next steps, ownership, and submission requirements for n8n workflow templates. | Assign owners to documentation, changelog, and conference workshop integration. |

## Proposed n8n workflow architecture
1. **Trigger node** – Schedule (hourly) or Webhook (manual start during workshop) to kick off the exploration.
2. **Context loader** – Read core research context from Google Sheets or Notion Database; include prior vibe briefs.
3. **Signal gatherers** – Parallel HTTP Request nodes hitting APIs (news, social listening, academic RSS) filtered to the session theme.
4. **Sensemaking agent** – OpenAI or other LLM node using the vibe research prompt pattern (role + constraints + format) to cluster narratives and metaphors.
5. **Evidence matrix builder** – Code node formatting insights into a 4x2 evidence-strength × novelty matrix, mirroring the playbook guidance.
6. **Insight router** – Merge node combining clustered signals with researcher annotations pulled from a shared Google Doc.
7. **Brief publisher** – Markdown generator (Set node) plus Email/Slack nodes to distribute the vibe brief and archive in knowledge base.
8. **Audit trail** – Data Store node logging prompts, timestamps, source URLs, and reviewer decisions for post-session compliance checks.

## Sample prompt scaffold for the LLM node
```
System: You are an insight analyst translating vibe research signals into actionable briefs for conference workshops.
User: <<Paste aggregated signals from HTTP nodes>>
Assistant task: Cluster signals into 3 themes, name the metaphors in play, and score each theme on Evidence Strength (1-4) and Novelty (1-4). Return JSON with keys `theme`, `metaphor`, `evidence_strength`, `novelty`, `sources`, `follow_up_research`.
```
> Tip: Save this prompt as an n8n credential to reuse across workshop iterations.

## Capturing workshop decisions inside n8n
- **Annotations:** Use the Set node to append facilitator decisions (approved sources, ethics notes) to the workflow execution data.
- **Branching for risks:** Insert If nodes to halt automation when a source lacks consent or fails credibility checks; route flagged items to a manual review queue.
- **Versioning:** Commit the exported workflow JSON to version control with session tags (`vibe-lab-2025-11`), mirroring changelog expectations from this repository.

## Template packaging checklist
- [ ] Replace sandbox credentials with environment variables and document setup in the workflow description.
- [ ] Include a "How to run" markdown note referencing vibe research guardrails and deep research handoff steps.
- [ ] Add two demo executions (JSON) demonstrating successful clustering and a halted-risk path.
- [ ] Submit to the n8n template gallery with clear licensing, audience tags, and conference workshop context.
- [ ] Schedule a dry run before the 2026 conference to confirm API availability and update prompts with latest vibe insights.

## Related resources
- [Vibe Research Playbook](../07-use-cases-and-research/vibe-research.md) – foundational mindset, tooling, and guardrails.
- [Deep Research Tools Playbook](../07-use-cases-and-research/deep-research.md) – plan rigorous follow-up once vibe hypotheses are validated.
- [n8n Workflow Templates Gallery](https://n8n.io/workflows/) – distribution channel for the finalized automation.
