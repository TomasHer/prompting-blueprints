# How to Use ChatGPT

## Intent
- Summarize the current ChatGPT modes, tools, and prompt tactics, then tie them to Prompting Blueprints resources.
- Provide a copy-ready overview you can scan for accessibility and quick lookup.

## ChatGPT snapshot
**How to use ChatGPT — Models, tools, and prompt patterns for daily work**

### Models and modes
| Model | Optimized for | Best for |
| --- | --- | --- |
| GPT-5.2 Instant | Speed and responsiveness | Fast answers, drafting, daily Q&A |
| GPT-5.2 Thinking | Higher precision reasoning | Deep research, planning, complex logic |
| GPT-4.1 | Multimodal work | Text plus images, longer context |
| GPT-4o | Tool-based problem solving | Web research, file analysis, Python workflows |
| o3-pro | Tool-based problem solving | Web research, file analysis, Python workflows |

### Features and tools
| Feature | What it does | Best for |
| --- | --- | --- |
| Projects | Group chats and notes in long-running workstreams | Analyses, writing |
| Deep Research | Multi-step web research with draft reporting | Verified facts, structured references |
| Memory | Save preferences and helpful answers | Personalized writing and habits |
| File uploads | Work with PDFs, docs, presentations | Table extraction, formulas |
| Data analysis | Work with CSVs and code notebooks | Python, charts, statistical reasoning |
| Connectors | Search or bring in data from other apps | Drive, GitHub, Slack research |

### Use cases and prompt tips
| Use case | Best mode | Prompt tips |
| --- | --- | --- |
| Card sort | Canvas | "Write a 1-page brief, then use generated topics to organize cards." |
| Idea sketch | Canvas | "Create a simple spec, then sequence steps in a user flow." |
| Debugging | Data analysis | "Paste error trace. Ask: root cause? reproduction? minimal test?" |
| Presentations | Data analysis | "Use Data Explorer to outline slides, then auto-format with Python." |
| Content draft | GPT-5.2 Instant | "Start with tone, target audience, key message. Ask for variants." |
| Meeting notes | GPT-5.2 Instant | "Paste log. Make 5 bullets. Add open questions and owners." |
| Deep research | GPT-5.2 Thinking | "Give scope, strict sources, and desired evidence. Ask for citations." |
| Email drafting | GPT-5.2 Instant | "Draft 3 versions. Keep subject, add clear call to action." |

## How to put this into practice
1) **Pick the right mode**
   - Start with **GPT-5.2 Instant** for quick drafting, then upgrade to **GPT-5.2 Thinking** when you need reasoning, constraints, or citations.
   - Switch to **GPT-4.1** for multimodal work (images + long docs) and to **GPT-4o/o3-pro** when you need code execution, file analysis, or web + connector workflows.
   - When unsure, default to Instant, then escalate based on accuracy/analysis needs.

2) **Frame the task with role + constraints**
   - Use the [Role + Constraints format](../03-prompts-and-patterns/role-constraint-format.md) to define the assistant role, success criteria, style, and guardrails.
   - Pull structures (e.g., JSON, bullet templates) from the [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md) so outputs are copy-paste ready.

3) **Set context and sources early**
   - Follow the [Context Engineering guide](../02-ai-agents/context-engineering.md) to chunk long inputs, prioritize evidence, and steer retrieval.
   - For research tasks, combine **Deep Research** with explicit source rules and verification steps; mirror the rigor shown in the [Researchers prompting blueprint](../03-prompts-and-patterns/researchers-prompting-blueprints.md).

4) **Use projects, memory, and connectors for continuity**
   - Create a Project per initiative, pin briefs, and reuse **Memory** for tone/format preferences (e.g., persona details from the [Managers prompting blueprint](../03-prompts-and-patterns/managers-prompting-blueprints.md)).
   - Attach connectors (Drive, GitHub, Slack) to pull canonical inputs before drafting. Pair with [AI Adoption readiness checklists](./ai-adoption-guide.md) when rolling out to teams.

5) **Choose a prompt starting point by use case**
   - **Content + comms:** Start with the [Writers prompting blueprint](../03-prompts-and-patterns/writers-prompting-blueprints.md) and the **Content draft** / **Email drafting** patterns above.
   - **Analysis + coding:** Combine **Data analysis** mode with the debugging steps here and the [AI coding spectrum](../02-ai-agents/ai-coding-spectrum.md) to decide between assistive vs. agentic workflows.
   - **Workshop & ideation:** Use **Canvas** cards for card sorts or sketches, then migrate outputs into the [Agent-to-Agent protocol](../02-ai-agents/a2a-protocol-guide.md) when you need multi-agent follow-up.

6) **Review, test, and iterate**
   - Keep outputs short, then expand with variants. Enforce structure using the patterns above.
   - For repeatable flows, codify prompts in a Project note and add evaluation criteria inspired by the [promptfoo configs](../06-models-and-evaluations/README.md) to keep quality consistent.

## Quick prompts you can reuse
- "You are a <role>. Follow these constraints: <style/length/sources>. Use this output format: <structure>." (Role + Constraints)
- "Analyze the attached file. Return a summary, risks, and 3 follow-up questions. Cite every claim with the file name." (File uploads + structure)
- "Research <topic>. Use Deep Research. Require 3 primary sources and show citations inline. Flag low-confidence claims." (Deep Research)
- "Convert these bullet points into a 5-slide outline. Keep titles under 8 words, add a takeaway per slide." (Presentations)
- "Debug this stack trace. Identify root cause, reproduction steps, and a minimal test." (Data analysis)

## References
- Link this page in navigation and keep it in sync with the latest ChatGPT release notes.
