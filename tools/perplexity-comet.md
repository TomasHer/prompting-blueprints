# Perplexity Comet Tutorial: Multi‑Tab Synthesis → LinkedIn Article (XP2025 AI & Agile)

> A step‑by‑step guide showing how to use **Perplexity Comet** to synthesize multiple sources into a polished LinkedIn article—using the XP2025 AI & Agile workshop as a real example. Screenshots are marked as placeholders for you to replace.

---

## Overview

This tutorial demonstrates a reproducible workflow in **Perplexity Comet** to:
- Load and analyze multiple sources (tabs)
- Generate a cohesive article draft with a **copy‑paste prompt template**
- Move the result into **LinkedIn Articles** (title + body)
- Keep a **human‑in‑the‑loop** before publishing

**Outcome:** A well‑structured LinkedIn article that cites your sources and reflects your professional voice.

**Real result:** The article produced by this workflow achieved **1500+ impressions** and was the **top‑performing post** among 5 posts in the prior 90 days (indicative, your mileage may vary).

---

## Audience & Value

- **Who is this for?** Beginners to Comet, researchers, industry experts, Agile coaches, Scrum Masters, and prompt engineers who want to see an advanced, reusable prompt template.
- **What you’ll learn:** Multi‑tab synthesis, reproducible prompting, rapid drafting into LinkedIn, and a simple human‑review checklist.

---

## Prerequisites

- Access to **Perplexity Comet** (no special settings required)
- A LinkedIn account with access to **Write article**
- Your sources prepared as public links or files

---

## Sources Used in This Tutorial

- **@tab1**: <https://arxiv.org/pdf/2506.20159>
- **@tab2**: <https://arxiv.org/pdf/2508.20563>
- **@tab3**: <https://gpt-lab.eu/ai-agile-workshop-xp2025/>

**Final article (example outcome):**  
<https://www.linkedin.com/pulse/xp2025-ai-agile-software-development-workshop-insights-tomas-herda-5blye>

> ℹ️ This tutorial uses the starter prompt template as‑is. If you add or remove tabs, see the **Optional: 3‑tab variant** section for a quick adaptation.

---

## What You’ll Build (Key Moments / Screenshots)

1. **Consolidate 3 tabs into one summary** (citations visible).  
   _Screenshot placeholder:_ `images/01-comet-tabs.png`  
   **Alt text:** Perplexity Comet with @tab1, @tab2, @tab3 open and cited in the response.

2. **Navigate to LinkedIn → Write article** and create a **draft** with title + body.  
   _Screenshot placeholder:_ `images/02-linkedin-create-article.png`  
   **Alt text:** LinkedIn “Write article” screen with title and editor visible.

3. **Human‑in‑the‑loop review** before posting.  
   _Screenshot placeholder:_ `images/03-human-review-checklist.png`  
   **Alt text:** A short checklist verifying accuracy, citations, tone, and links before publishing.

> You can add more screenshots (e.g., running the prompt, refining sections, or verifying citations).

---

## Step‑by‑Step

### 1) Prepare sources in Comet
1. Open **Perplexity Comet**.  
2. Create **three tabs** and load your sources:  
   - @tab1 → `https://arxiv.org/pdf/2506.20159`  
   - @tab2 → `https://arxiv.org/pdf/2508.20563`  
   - @tab3 → `https://gpt-lab.eu/ai-agile-workshop-xp2025/`

> _Screenshot placeholder:_ `images/01-comet-tabs.png`

**Tip:** Ensure each tab opens and is readable (PDF viewer or webpage preview).

---

### 2) Run the starter prompt (copy‑paste block below)

Paste the **Starter Prompt Template** into Comet’s chat and run it. This template asks Comet to synthesize content into a LinkedIn article with a clear structure (hook → summary → sections → insights → CTA) and proper citations.

> _Screenshot placeholder:_ `images/04-run-starter-prompt.png`

---

### 3) Inspect and refine the draft inside Comet

- Check that **both (or all) tabs are referenced** and **citations** are present.
- Verify **flow**: hook → executive summary → main sections → professional insights → CTA.
- If something is missing, ask a **targeted follow‑up** in the same chat (e.g., “Tighten the executive summary to 2 sentences,” “Add explicit quotes from @tab2,” “Ensure @tab3 is cited in the second section”).

> _Screenshot placeholder:_ `images/05-review-draft.png`

---

### 4) Move the draft to LinkedIn (Articles)

1. On LinkedIn, go to **Write article**.  
2. Paste the **title** and **body** from Comet’s output.  
3. Add any images or formatting you want.  
4. Save as **draft**.

> _Screenshot placeholder:_ `images/02-linkedin-create-article.png`

**Tip:** If Comet provides multiple title options, pick the one that best matches your audience and keywords.

---

### 5) Human‑in‑the‑loop review (recommended)

Before publishing, run this checklist:

- **Accuracy:** Facts match the sources; quotes are faithful.  
- **Citations:** Each specific claim references the correct tab or original link.  
- **Clarity:** Section headings and bullet points improve readability.  
- **Tone:** Professional and conversational (fits LinkedIn).  
- **Call‑to‑Action:** Ends with a question or invitation to discuss.  
- **Links:** External links open correctly and are publicly accessible.

> _Screenshot placeholder:_ `images/03-human-review-checklist.png`

When satisfied, **publish** the article.

---

## Starter Prompt Template (Copy‑Paste)

```text
Analyze the content from @tab1 and @tab2, then create a comprehensive LinkedIn article following this structure:

**TASK:** Multi-tab content synthesis into LinkedIn article format

**CONTENT SOURCES:**
- Primary source: @tab1 
- Secondary source: @tab2

**ARTICLE REQUIREMENTS:**
1. **Hook**: Start with an attention-grabbing opening that connects both sources
2. **Executive Summary**: 2-3 sentences highlighting the key insights from both tabs
3. **Main Content**: 
   - Synthesize information from both sources into 3-4 key sections
   - Include specific examples, data points, or quotes from each tab
   - Create logical flow between insights from @tab1 and @tab2
4. **Professional Insights**: Add 2-3 actionable takeaways for LinkedIn audience
5. **Call-to-Action**: End with engagement question or discussion prompt

**FORMAT SPECIFICATIONS:**
- Length: 800-1200 words optimal for LinkedIn
- Use subheadings for readability
- Include bullet points where appropriate
- Add relevant hashtags (5-7 maximum)
- Mention any companies, tools, or people referenced in the tabs
- Maintain professional, conversational tone

**CITATION REQUIREMENTS:**
- Reference specific information from each tab
- Include links to original sources if available
- Credit any authors, companies, or research mentioned

**OUTPUT:** Complete LinkedIn article ready for posting with proper formatting and structure.
```

---

## Optional: 3‑Tab Variant (if you include @tab3)

When you want to include a third source, minimally adapt the prompt like this:

```text
Analyze the content from @tab1, @tab2, and @tab3, then create a comprehensive LinkedIn article following this structure:

**TASK:** Multi-tab content synthesis into LinkedIn article format

**CONTENT SOURCES:**
- Primary source: @tab1 
- Secondary sources: @tab2 and @tab3

**ARTICLE REQUIREMENTS:**
1. **Hook**: Start with an attention-grabbing opening that connects all three sources
2. **Executive Summary**: 2-3 sentences highlighting the key insights across tabs
3. **Main Content**: 
   - Synthesize insights into 3-4 key sections
   - Include specific examples, data points, or quotes from each tab
   - Create logical flow and explicitly knit together insights from @tab1, @tab2, @tab3
4. **Professional Insights**: Add 2-3 actionable takeaways for LinkedIn audience
5. **Call-to-Action**: End with engagement question or discussion prompt

**FORMAT SPECIFICATIONS:**
- Length: 800-1200 words optimal for LinkedIn
- Use subheadings for readability
- Include bullet points where appropriate
- Add relevant hashtags (5-7 maximum)
- Mention any companies, tools, or people referenced in the tabs
- Maintain professional, conversational tone

**CITATION REQUIREMENTS:**
- Reference specific information from each tab
- Include links to original sources if available
- Credit any authors, companies, or research mentioned

**OUTPUT:** Complete LinkedIn article ready for posting with proper formatting and structure.
```

---

## Tips & Pitfalls

- **Be explicit about sources.** Name the tabs in your prompt and ask Comet to attribute specific claims.  
- **Use short follow‑ups.** Iterate on sections (“tighten the hook,” “add two quotes from @tab2”).  
- **Mind PDFs.** If a PDF is long, ask for page‑anchored citations (e.g., “cite @tab1 pp. 3–5 when quoting results”).  
- **No logos needed.** Keep visuals simple; screenshots should focus on the workflow steps.  
- **Privacy.** Redact personal data in screenshots if any appear in your tabs or LinkedIn UI.

---

## Results & Measurement

- The real run of this workflow produced **1500+ impressions** on LinkedIn and ranked **#1** among 5 posts in the previous 90 days.  
- Track: impressions, reactions, comments, reshares. Consider A/B testing alternative hooks or titles in future posts.

---

## Useful Links

- **@tab1 (PDF):** <https://arxiv.org/pdf/2506.20159>  
- **@tab2 (PDF):** <https://arxiv.org/pdf/2508.20563>  
- **@tab3 (Workshop page):** <https://gpt-lab.eu/ai-agile-workshop-xp2025/>  
- **Example final article:** <https://www.linkedin.com/pulse/xp2025-ai-agile-software-development-workshop-insights-tomas-herda-5blye>

---

## How to Use This File

- Place this file at your repository root (e.g., `README.md`).  
- Add screenshots into an `images/` folder and update the file names if you choose different names.  
- Replace or extend the prompt blocks as you iterate on your workflow.

---

*No logos or proprietary assets are included. You control which screenshots and links you publish.*
