# Weekly Newsletter Automation for [*TOPIC*] (ChatGPT + Web Browsing)

This guide shows you how to set up a **weekly, scheduled newsletter workflow** inside ChatGPT that searches the web every Thursday at **09:00 GMT**, selects the strongest stories, and produces three outputs you can share immediately: concise newsletter blurbs, a LinkedIn post, and a short SEO article.

> You’ll add one scheduled task and use the **copy‑paste prompt** below. A placeholder for your **Scheduled Tasks** screenshot is included; replace it after you’ve set things up.

---

## What runs every Thursday at 09:00 GMT

### At 09:00 GMT every Thursday, run a fresh web search to surface notable [*TOPIC*] developments published after the previous run.

### Deliverables

#### Newsletter blurbs (3 × ~100 words)
- Summarize the three strongest stories in clear, concise language.  
- Include the **publication date** and a **direct source link** to the original piece.  
- Each blurb should have a **short headline** and a **one-sentence takeaway**.

#### LinkedIn post (~200 words)
- Choose the **single story** most likely to spark conversation.  
- Write a platform-friendly post that **keeps my voice**, **opens with a hook**, **adds one sharp insight**, and **ends with a question** or call to discuss.  
- Avoid **AI clichés** and hype.

#### SEO article (~500 words)
- Expand on that same story **in my style**, using accessible language and a clear structure (**intro → context → analysis → practical implication → wrap‑up**).  
- Stay **opinionated but evidence‑based**, and include the **source link once**.  
- Optimize naturally for search **without keyword stuffing**.

> **Tip about time zones:** 09:00 GMT is typically **10:00 in winter / 11:00 in summer** for Europe/Vienna. Adjust if needed.

---

## Screenshot placeholder (replace later)
![Scheduled tasks in ChatGPT — placeholder](images/chatgpt-scheduled-tasks.png "All scheduled tasks — replace with your screenshot after setup")

---

## Quick Setup (5 minutes)

1) **Decide your scope for [*TOPIC*].**  
   - Primary keywords: `[*TOPIC*]`, key subtopics, notable people/organizations.  
   - Optional filters: regions, industries, filetypes (e.g., `site:.gov`, `site:nature.com`, `filetype:pdf`).  
   - Exclusions: hypey domains or low-trust sources you don’t want included.

2) **Create a scheduled task in ChatGPT (Automations).**  
   - **Title:** `Run weekly [*TOPIC*] scan + newsletter`  
   - **Prompt:** Use the **Copy‑Paste Automation Prompt** below.  
   - **Schedule:** Weekly on **Thursdays at 09:00 GMT**. If your Automations UI allows iCal/VEVENT syntax, use:
     ```
     BEGIN:VEVENT
     RRULE:FREQ=WEEKLY;BYDAY=TH;BYHOUR=9;BYMINUTE=0;BYSECOND=0
     END:VEVENT
     ```
   - **Start date:** Next Thursday (or today + 7d).

3) **Confirm it’s listed in your scheduled tasks.**  
   - Replace the screenshot placeholder above with your own.

4) **First run (optional).**  
   - Trigger the task manually once to generate an initial issue and confirm quality.

---

## Copy‑Paste Automation Prompt (edit the bracketed parts)

> Paste this into the **Prompt** field when creating your scheduled task. Keep the schedule separate in the Automations UI.

```text
Search for the most important, credible developments in [*TOPIC*] published since the previous run (or, if unavailable, within the past 7 days). Prioritize primary sources, authoritative outlets, and pieces with clear new facts or data. Avoid listicles, press releases with no substance, and speculative hype.

**What to return (in markdown):**

# Weekly [*TOPIC*] Update — {run_date}

## Newsletter blurbs (3 × ~100 words)
For each blurb, include:
- **Headline**
- **One-sentence takeaway**
- ~100-word summary
- **Publication date (ISO)**
- **Direct source link**

## LinkedIn post (~200 words)
- Select the single story most likely to spark conversation with my professional network (Agile/AI practitioners and industry leaders). 
- Keep my voice; open with a strong hook, add one sharp insight, and end with a question.
- Avoid AI clichés and hype.

## SEO article (~500 words)
- Expand on that same story in an opinionated but evidence-based style.
- Clear structure: intro → context → analysis → practical implication → wrap-up.
- Include the **source link once**.
- Optimize naturally for search; no keyword stuffing.

**Guardrails & criteria**
- Cite **publication dates** and ensure links work.
- Prefer sources with named authors, transparent methods, or reputable editorial processes.
- De-duplicate near-duplicates; note when multiple outlets report the same fact.
- If few high-quality items exist this week, include fewer blurbs and explain why.
- If a paywall prevents quoting, summarize and link, flagging the paywall.

**Notes**
- Audience includes beginners to tooling, researchers, industry experts, Agile coaches/Scrum Masters, and prompt engineers.
- If uncertainty is high, say so. Avoid definitive claims beyond the evidence.
```

---

## Optional query hints for [*TOPIC*]

Use these to guide the search logic (the automation prompt can imply them; adapt to your niche):

- Core query: `[*TOPIC*] (study OR benchmark OR release OR law OR standard OR outage OR update) after:last_run`
- Authority bias: `site:.gov OR site:.edu OR site:nature.com OR site:who.int` (replace with your domain list)
- Exclusions: `-rumor -speculation -press release -sponsored`
- Region filters: add country/region terms where relevant.
- PDF-heavy areas: add `filetype:pdf` for formal reports.

---

## Quality checklist before you publish

- **Recency:** Dates are current and beyond last week’s run.  
- **Signal over noise:** Each blurb is substantive; duplicates are removed.  
- **Accuracy:** Facts trace to credible sources; links open.  
- **Tone:** No hype; clear, conversational, professional.  
- **LinkedIn post:** Strong hook, one sharp insight, question at the end.  
- **SEO piece:** Structured, opinionated, evidence-based, one source link.

---

## Maintenance & tweaks

- **Adjust [*TOPIC*] scope** over time (keywords, sources, exclusions).  
- **Seasonality:** For holidays/conferences, widen or narrow date windows.  
- **Audience:** If your readers skew technical/non-technical, adjust depth and jargon.  
- **Metrics:** Track impressions, CTR, comments, reshares; iterate on hooks and titles.

---

## Troubleshooting

- **Too few credible stories:** Expand to 14 days, broaden sources, or include standards/regulatory updates.  
- **Paywalls:** Prefer alternative outlets; otherwise summarize and label paywalled.  
- **Over-hype:** Add stricter exclusions or require data/benchmarks.  
- **Time drift:** Re-check that the schedule is **09:00 GMT** (not local time).

---

## Example output skeleton (for reference)

```md
# Weekly [*TOPIC*] Update — 2025-09-25

## Newsletter blurbs (3 × ~100 words)
### 1) Headline
**Takeaway:** …  
**Date:** 2025-09-24  
**Source:** https://…  
Summary: …

### 2) Headline
**Takeaway:** …  
**Date:** 2025-09-23  
**Source:** https://…  
Summary: …

### 3) Headline
**Takeaway:** …  
**Date:** 2025-09-22  
**Source:** https://…  
Summary: …

## LinkedIn post (~200 words)
[hook] … [insight] … [question] …

## SEO article (~500 words)
[intro] … [context] … [analysis] … [implication] … [wrap‑up] … (source link)
```

---

### Notes
- This tutorial assumes your ChatGPT workspace supports **Automations**. If not, you can run the same prompt manually each Thursday or use a calendar reminder linking here.
- Replace every `[ *TOPIC* ]` with your chosen topic label (e.g., “Prompt Engineering,” “AI and Agile,” “LLM Safety”).

