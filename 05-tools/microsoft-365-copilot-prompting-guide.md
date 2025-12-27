# Microsoft 365 Copilot Prompting Guide

## Intent
Provide practitioners with Microsoft-sourced prompt starters, guardrails, and evaluation tactics so they can maximize Microsoft 365 Copilot across chat, apps, and specialized agents without hunting through slide decks.

## Getting started with Copilot
- **Choose the right toggle.** Use the **Work** toggle in Copilot Chat to ground prompts in your Microsoft 365 data. Use the **Web** toggle for internet-only research. If you are not signed in with your work account, enterprise data protection does not apply.
- **Launch from the right surface.** Start in the Microsoft 365 Copilot app or at [M365copilot.com](https://www.m365copilot.com), then open Copilot inside Outlook, Teams, Word, Excel, or PowerPoint to unlock task-specific capabilities tailored to the current prompt.
- **Pair with GPT-5 when available.** Microsoft recommends enabling GPT-5 for deeper reasoning and richer output quality.
- **Review every answer.** Copilot uses large language models that can produce variability or inaccuracies. Validate facts, especially before executive handoffs.

## Prompt building essentials
Microsoft summarizes high-performing Copilot prompts with four elements:

| Element | Guiding question | Example from the guide |
| --- | --- | --- |
| **Context** | Why do you need the response and who is involved? | “I work in marketing and focus on competitor research.” |
| **Goal** | What do you want Copilot to produce? | “Give me a concise summary of recent news about [company name].” |
| **Source** | Which information should Copilot use? | “Focus on web articles from the last 2 months.” |
| **Expectations** | How should Copilot respond? | “Provide the answer in two to three paragraphs and use a business tone.” |

## Prompt guidance: do’s and don’ts
**Do:**
- Be clear and specific about topic, purpose, tone, and length.
- Keep it conversational and give feedback so Copilot can refine results.
- Supply examples or precise keywords when requesting writing support.
- Ask Copilot for feedback to surface blind spots or improvement areas.
- Write legibly with proper punctuation and grammar.
- Check outputs for accuracy, relevance, and alignment to your standards.
- Provide contextual details such as audience, genre, or constraints.
- Stay polite to reinforce collaborative tone.

**Don’t:**
- Be vague or rely on minimal context.
- Request unethical, inappropriate, or non-compliant content.
- Lean on slang, jargon, or informal shorthand that may confuse the model.
- Deliver conflicting instructions in a single request.
- Abruptly change topics mid-thread—close a task before starting a new one and say “New task” when switching.

## Prompt gallery
Explore the [Copilot Prompt Gallery](https://m365.cloud.microsoft/copilot-prompts) to browse curated examples, save personal favorites, and share reusable prompts with colleagues directly inside Copilot Chat.

## Prompt starters by surface

### Copilot Chat (Work toggle)
| Scenario | Prompt |
| --- | --- |
| Get ready for the day | “What are my top priorities today?” |
| Settle meeting conflicts | “Recommend how to resolve conflicts on my calendar for tomorrow.” |
| Analyze time allocation | “Look at the last 5 work days, identify all the meetings where I was working on [project], add up all the time I spent (broken down by time with my manager versus colleagues), and recommend how I should better focus my time.” |
| Organize your priorities | “Identify all tasks or action items assigned to me in this week’s emails, Teams chats, and meeting notes, and compile them into a checklist with due dates.” |
| Prepare for a customer meeting | “Create a 360 overview of my customer for an upcoming meeting based on recent emails, meetings, status reports, and company news. Include meeting recommendations and suggested questions.” |
| Develop an interview guide | “Create an interview guide for a new Product Marketing role in my team. Draft questions in line with company values, my organization’s charter, and the job description [upload interview guide dataset].” |
| Review manager requests | “Summarize messages from my manager in the last [timeframe]. Bold each subject line or chat title and follow it with bullet points of key takeaways or action items.” |
| Improve professionally | “Read through my recent emails and chats and provide an analysis of my communication style—core values, strengths, weaknesses, skills, and areas to improve.” |
| Create a job description | “Build a role-specific job description and onboarding plan by analyzing internal performance reviews, department KPIs, and our company values.” |
| Focus search on specific files | “What’s the timeline and status of [project name where files are confidential]?” |
| Identify experts | “Identify colleagues with expertise in [topic]. Summarize their current role, key skills, and how their experience aligns.” |

### Researcher and Analyst agents
**Researcher agent prompt starters**
| Scenario | Prompt |
| --- | --- |
| Develop comprehensive research reports | “Based on the internal meeting discussion on [topic], draft a comprehensive research report evaluating the ideas proposed. Incorporate insights from web-based research on [topic] and solutions.” |
| Supercharge project management | “Create an action-item tracker based on all communication channels and information from the past 7 days. Split it into actions pending on me (sorted by urgency and relevance) and actions I requested from others (with follow-up status and elapsed time). Recommend who needs a follow-up.” |
| Create a product launch campaign | “Using our internal knowledge base, previous campaign data, and customer insights, create a launch content package for the new product update. Include a customer announcement email, blog post, LinkedIn and Twitter captions, internal team update, and help center entry.” |
| Research competitive landscape | “Draft a research report identifying market gaps based on internal stakeholder discussions (sales, R&D, support) plus competitive insights and sales data.” |
| Summarize project progress | “Draft a project update based on our last [meeting series]. Include KPI performance, major wins/losses, risks, competitive moves, tough questions to expect, and suggested answers. Flag any major metric changes.” |

**Analyst agent prompt starters**
| Scenario | Prompt |
| --- | --- |
| Analyze new markets | “Help me identify the best market to launch a new [product/service] using the fastest-growing markets in this [upload dataset].” |
| Analyze sales performance | “Identify our highest and lowest performing stores using [upload dataset].” |

### Copilot in Microsoft 365 apps
| Scenario | Copilot in… | Prompt |
| --- | --- | --- |
| Schedule a meeting | Outlook | “Help me schedule a meeting with [name] this week.” |
| Summarize key discussions | Outlook | “Write a recap email for my team based on this email thread.” |
| Stay on top of meetings | Teams meeting | “Summarize what’s been discussed so far and list any open questions or unresolved items.” |
| Jumpstart an email based on a meeting | Teams meeting | “Draft a follow-up email based on the action items from today’s [meeting].” |
| Create precise questions | Teams meeting | “Create a list of follow-up questions from the [meeting].” |
| Recap action items | Teams meeting | “Recap the meeting before I joined and list any action items where I was mentioned.” |
| Draft a document | Word | “Create an intro paragraph with [file].” |
| Visualize data | Excel | “Share the top insights and trends in this data and create a visualization.” |
| Summarize data | Excel | “Build a PivotTable on a new sheet aggregating [variable 1], [variable 2], [variable 3].” |
| Collect data | Excel | “Find public data about [topic].” |
| Create speaker notes | PowerPoint | “Write speaker notes for this slide with context on how our strategy differentiates us.” |

### Copilot Chat (Web toggle)
| Scenario | Prompt |
| --- | --- |
| Strategize next steps | “Get me up to speed on the latest plans related to [project]. Help me think through what to do next.” |
| Develop a project plan | “Review the attached project plan and give me five substantive ways to improve it. Include rationale and specific text to insert.” |
| Prepare an executive report | “Use the attached spreadsheet with customer feedback to create an executive report that guides where to prioritize resources next cycle. [upload file]” |
| Improve a document draft | “We have a draft press release [document]. Find similar recent announcements on the web and suggest how to make ours stand out.” |
| Gain subject-matter knowledge | “Act as a financial compliance analyst and compare the Dodd-Frank, Basel III, and MiFID II capital adequacy and reporting requirements.” |
| Visualize data quickly | “Create a pie chart showing the U.S. smartphone market share in 2024.” |
| Understand the main point | “Recap the findings of this research paper: [upload file]. Highlight surprising or controversial results.” |
| Stand out on socials | “Craft an engaging LinkedIn post based on [upload file].” |
| Calculate ROI | “How much value will a $450,000 investment have after 5 years with an 8% annual return? Show your work.” |
| Improve your writing | “Rewrite my draft so it sounds more professional and less verbose [upload file].” |
| Code faster | “Write a Python script to perform binary search.” |
| Generate ideas | “Suggest 10 compelling titles for this document: [upload file].” |
| Compare files | “Compare the latest [file name] with its version from [previous date]. Summarize the changes and include relevant email feedback.” |
| Get writing recommendations | “Analyze the following text and suggest how to improve it: [insert text].” |
| Visualize a scene | “Create an image of a running sneaker standing upright in a modern studio with minimalist gradients. [add an image]” |

## Tips for long documents
- Split lengthy reports into smaller segments before uploading so Copilot can process each part accurately.
- Summarize long manuscripts in sections, then stitch together the partial results.
- Reference only the most relevant passages—treat the interaction like a focused conversation with a colleague.

## Evaluation rubric: ACRUE
Use the ACRUE rubric to benchmark Copilot responses against other AI systems. Score each dimension from 1 (very poor) to 5 (excellent).

| Dimension | Definition | 1 | 3 | 5 |
| --- | --- | --- | --- | --- |
| **Accurate** | Are the facts correct? | Contains clear factual errors | Mostly correct with minor inaccuracies | Fully accurate and trustworthy |
| **Comprehensive** | Does it cover the important points? | Misses major elements or is overly brief | Covers most relevant points | Thorough and complete |
| **Relevant** | Is it aligned with the prompt? | Off-topic or misinterprets the request | Mostly relevant with slight drift | Directly addresses the prompt with precision |
| **Useful** | Does it help achieve the goal? | Unhelpful or confusing | Moderately helpful | Clearly actionable and insightful |
| **Exceptional** | Does it exceed expectations? | Generic or uninspired | Meets expectations | Surpasses expectations with creativity or depth |

## References
- Microsoft. *Recommended Prompts for Microsoft 365 Copilot.* August 2025. Internal slide deck stored at `assets/guides/microsoft-m365-copilot-prompting-guide.pptx`.
- Microsoft. *Copilot Prompt Gallery.* https://m365.cloud.microsoft/copilot-prompts
