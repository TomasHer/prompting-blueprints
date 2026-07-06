---
title: "AI Job Search Framework (Claude Code)"
tags: ["use-case", "claude-code", "agents", "drafter-reviewer", "job-search", "latex", "skills", "slash-commands"]
last_updated: "2026-07-06"
---

# AI Job Search Framework (Claude Code)

## Intent
Show how the open-source [`MadsLorentzen/ai-job-search`](https://github.com/MadsLorentzen/ai-job-search) framework turns Claude Code into an end-to-end job-application agent — evaluating job fit, tailoring a CV, drafting a cover letter, and prepping for interviews — so prompt engineers can reuse its **slash-command workflow, drafter–reviewer split, and visual PDF-verification loop** in their own document-generation agents.

> "AI-powered job application framework built on Claude Code. Fork it, fill in your profile, and let Claude evaluate jobs, tailor CVs, write cover letters, and prepare you for interviews."

## Use when
- You want a concrete, working example of a **fork-and-fill Claude Code project** where the user's data lives in Markdown skill files and the automation lives in slash commands.
- You are designing an agent that must **generate polished documents (PDF, LaTeX, slides)** and want a pattern that inspects the *rendered* output rather than trusting the source.
- You need a reusable **drafter–reviewer (dual-agent) pattern** for anything where a single pass tends to miss company/context-specific relevance.
- You are building **portal/tool integrations per market or region** and want a template for generating new integrations on demand.

## How the framework is structured
The candidate's profile is split into seven numbered Markdown "skill" files that Claude reads as context on every run — data and prompts are kept separate so the same automation works for any user who forks the repo:

| File | Purpose |
| --- | --- |
| `01-candidate-profile.md` | Education, experience, and skills. |
| `02-behavioral-profile.md` | Personality / behavioural (e.g. DISC) profile. |
| `03-writing-style.md` | Tone and voice rules for generated prose. |
| `04-job-evaluation.md` | Fit-scoring criteria and career goals. |
| `05-cv-templates.md` | CV tailoring and template rules. |
| `06-cover-letter-templates.md` | Cover-letter structure and rules. |
| `07-interview-prep.md` | STAR examples and interview material. |

## Slash-command workflow
The framework's behaviour is exposed as Claude Code slash commands, each a self-contained sub-workflow:

| Command | What it does |
| --- | --- |
| `/setup` | Onboarding — ingest career data from a documents folder, a CV import, or a guided interview. |
| `/scrape` | Search across job portals and rank results by fit. |
| `/apply` | "Evaluate fit, draft CV + cover letter (LaTeX, tailored)" for a specific listing. |
| `/expand` | "Enriches your profile by scanning public sources you've already linked" (GitHub, portfolio, etc.). |
| `/upskill` | "Analyzes the gap between your profile and tracked job postings" and proposes a learning plan. |
| `/add-template` | "Registers your own LaTeX CV or cover letter template". |
| `/add-portal` | "Generates a job-portal search skill for a job board in your market". |

The happy path chains them:

```
/setup → profile files → /scrape → ranked job matches → /apply <URL> → tailored PDFs
```

## Patterns worth stealing

### Drafter–reviewer split
The most reusable idea is a two-agent separation of concerns:

> "The drafter writes; a second Claude agent, spawned with a fresh context, researches the company and critiques the drafts."

Spawning the reviewer with a **fresh context** is deliberate — it avoids the single-pass blindspot where the same agent that produced the draft rationalises its own weak spots. The reviewer researches the target company independently and critiques for relevance before anything is finalised, mirroring the researcher ↔ critique loop in the [LangChain Research Agent Tutorial](./langchain-research-agent.md).

### Visual PDF-verification loop
Instead of trusting the LaTeX source, the workflow renders and *looks at* the result:

> "the workflow compiles and visually inspects every PDF and applies targeted fixes until the layout is clean."

Claude compiles the LaTeX, inspects the rendered pages, and iterates layout fixes (spacing, font matching, page breaks) until the CV lands at its target length and the cover letter fits on one page. Closing the loop on the *observed* artifact — not the code that produced it — is the same "verify the real output" discipline that separates robust agents from ones that pass their own checks but fail in reality.

### Relevance-weighted trimming
When a CV runs long, the framework does not simply drop the oldest entries. It scores each line by relevance to the target role, uniqueness, and whether the cover letter depends on it, then removes the lowest-value lines first — a small, transferable heuristic for length-constrained generation.

### Fork-and-fill + generate-your-own-integration
Portal integrations (Jobindex, Jobnet, Akademikernes Jobbank, Jobdanmark for Denmark; LinkedIn as a country-agnostic, dependency-free integration) demonstrate a replicable pattern: rather than hard-coding every market, `/add-portal` has Claude *generate* a new search skill for whatever job board the user needs. The framework itself is language- and country-agnostic; the Danish portals are just the reference implementation.

## Hands-on walkthrough
1. **Prerequisites:** Claude Code (CLI), Python 3.10+, [Bun](https://bun.sh/), and a LaTeX distribution with `lualatex` and `xelatex`.
2. **Fork and clone** the repository, then install the portal tooling (`bun install` inside the relevant skill directories).
3. **Run `/setup`** and choose an onboarding mode (interview, CV import, or documents folder). This populates the numbered profile files.
4. **Run `/scrape`** to pull and rank matching listings across the configured portals.
5. **Run `/apply <job-url>`** on a listing — Claude evaluates fit, drafts a tailored CV and cover letter, has the reviewer agent critique them, then compiles and visually verifies the PDFs.
6. **Review and download** the final PDFs; optionally `/upskill` to see and close skill gaps against tracked roles.

## Adaptation ideas
- Reuse the **drafter–reviewer** pair for proposals, RFP responses, or release notes — anything where an independent, company/context-aware critique pass raises quality.
- Port the **visual PDF-verification loop** to any pipeline that emits rendered output (slides, reports, dashboards): compile → screenshot → critique → fix, until the rendered artifact passes.
- Copy the **numbered skill-file convention** to keep user data separate from automation in your own fork-and-fill Claude Code projects.
- Generalise `/add-portal` into an **`/add-integration`** pattern that has the agent scaffold new data-source skills on demand instead of shipping them all up front.

## References
- [ai-job-search — GitHub repository (MadsLorentzen)](https://github.com/MadsLorentzen/ai-job-search) — MIT-licensed.
- [LangChain Research Agent Tutorial](./langchain-research-agent.md) — related researcher ↔ critique dual-agent pattern.
