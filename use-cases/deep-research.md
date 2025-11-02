# Deep Research Tools Playbook

## Intent
Help researchers and strategists choose and operationalize deep research modes in Perplexity, Gemini, and ChatGPT. Summarize core capabilities, when to deploy each workflow, and how to enable the relevant tooling.

## When to Use
- You need multi-step reasoning that goes beyond quick fact lookups.
- The task requires synthesizing multiple sources with traceability.
- You want to compare deep research offerings before granting team access or building SOPs.

## Quick Comparison
| Capability | Perplexity Deep Research | Gemini Deep Research | ChatGPT Deep Research |
| --- | --- | --- | --- |
| Ideal strengths | Iterative web-scale investigations with auto-expanding search branches. | Multi-modal (text + imagery) insights grounded in Google corpus and Workspace context. | Structured research briefs with custom criteria and up-to-date browsing. |
| Best for | Exploratory market sweeps, literature dives, “unknown unknowns.” | Cross-format intelligence, Workspace-native projects, multilingual needs. | Executive summaries, product requirement deep-dives, configurable deliverables. |
| Key controls | Adjustable duration, focus areas, citation harvesting. | Research focus selection, Workspace integration, output tone guidance. | Prompt-level guardrails, deliverable templates, follow-up query queue. |
| Typical output | Threaded findings with citations, recommended next steps. | Multi-section briefs with evidence highlights, image-rich insights. | Tailored reports (slides, briefs) with inline references and follow-up tasks. |
| Pricing / access (Mar 2026) | Paid add-on for Pro/Enterprise; time-boxed runs. | Gemini Advanced subscription; rolling Workspace rollout. | ChatGPT Enterprise / Pro add-on; availability varies by org policy. |

## Workflow Highlights

### Perplexity Deep Research
1. Frame the research objective with explicit target audience, scope, and deliverable.
2. Use focus areas to steer the crawler (e.g., “competitive pricing,” “founder interviews”).
3. Let the run complete; harvest citations and recommended follow-ups for action plans.
4. Export summaries to your knowledge base and set review cadence for updates.

> _Screenshot placeholder: Insert Perplexity Deep Research activation image here._

**Enablement tips**
- Ensure the Deep Research add-on is toggled in workspace settings for eligible seats.
- Establish run-length defaults (e.g., 5 or 10 minutes) to balance depth vs. cost.
- Create tagging conventions for outputs so future runs can build on prior work.

### Gemini Deep Research
1. Start from a clear “What you’re researching” brief and note expected artifacts.
2. Select relevant focus cards (market, technology, strategy) and attach Workspace docs for grounding.
3. Iterate on section summaries, using follow-up prompts to add visuals or data tables.
4. Export to Google Docs or Slides for stakeholder review.

> _Screenshot placeholder: Insert Gemini Deep Research enablement image here._

**Enablement tips**
- Verify Gemini Advanced access and the Deep Research beta toggle in Admin Console.
- Connect Google Drive folders with curated source material to boost grounding quality.
- Align on tone presets (executive, technical, academic) to speed downstream editing.

### ChatGPT Deep Research
1. Define the research scope, desired deliverable (brief, memo, FAQ), and success criteria.
2. Add custom instructions for citation style, data freshness, and exclusion zones.
3. Launch Deep Research; review interim findings and queue follow-up questions inline.
4. Package the final report using ChatGPT’s export or copy-ready markdown block.

> _Screenshot placeholder: Insert ChatGPT Deep Research activation image here._

**Enablement tips**
- Confirm Deep Research access in the ChatGPT organization settings (Pro or Enterprise).
- Create reusable prompt templates for recurring investigations (e.g., competitor teardowns).
- Pair Deep Research with File Search or custom GPTs to ground against proprietary data.

## Operational Guidance
- **Intake**: Standardize research brief templates with objective, audience, scope, and must-have sources.
- **Governance**: Track which tool ran the analysis, source age, and reviewer sign-off to maintain audit trails.
- **Handoffs**: Embed outputs into project hubs (Notion, Confluence, Workspace) with clear owner and refresh cadence.
- **Quality loops**: Schedule human spot-checks for critical decisions; log discrepancies to refine prompts.

## Related Blueprints
- [Research Notes Workflow](./research-notes.md)
- [Program Delivery Manager Copilot Playbook](./program-delivery-manager-copilot-playbook.md)

## References
- [Perplexity: Introducing Deep Research](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)
- [Gemini Deep Research overview](https://gemini.google/gb/overview/deep-research/?hl=en-GB)
- [ChatGPT Deep Research announcement](https://openai.com/index/introducing-deep-research/)
