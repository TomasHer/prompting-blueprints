---
title: "Intelligent Document Processing Use-Case Playbook (DAiTA)"
tags: ["use-case", "intelligent-document-processing", "agents", "esg", "hr", "finance"]
last_updated: "2026-05-24"
---

# Intelligent Document Processing Use-Case Playbook (DAiTA)

## Intent
Help operations, finance, HR, and compliance leads turn high-volume, heterogeneous document inflows into structured, decision-ready data — without giving up human accountability. The playbook is grounded in the DAiTA platform from Post Business Solutions (Österreichische Post AG), a domain-configured Intelligent Document Processing (IDP) approach reported in *contentway.de — AI & Supply Chain*.

## Use when
- An average DACH organization moves ~500,000 documents per year and only a fraction is structured and usable.
- Invoices, applications, evidence, contracts, and CVs arrive across mail, upload, scanner, and inboxes in unstructured form.
- Manual rekeying creates media breaks (copy-paste, callbacks, lead-time) and exposes the company to data-protection, compliance, and audit risk.
- Leadership wants AI value *with* a reliable human control instance — the Post digitalization study cited in the article reports 94% of respondents consider human oversight essential.

## Why IDP, not just OCR
Classical OCR transcribes characters. IDP **decides**: it recognizes document type, extracts the relevant fields, checks plausibility, harmonizes values across formats and periods, and outputs structured results with transparent audit trail and quality grades. Humans stay in the loop on the actual decision; the AI removes the rekeying tax around it.

> "Companies don't look for technology, they look for orientation. Good decisions need reliable data — that's where intelligent document processes create the greatest added value."  
> — George Wallner, Managing Director, Post Business Solutions GmbH (paraphrased from the contentway.de feature)

## Reference architecture (DAiTA)
The DAiTA blueprint layers a domain-configured agent fabric over an enterprise AI infrastructure:

| Layer | What it contains | What it gives you |
| --- | --- | --- |
| **Branch-expert agents** | Accounting, Recruiting, Delivery Note, Real Estate, Fleet Management, ESG | Ready-to-use agents pre-shaped to a domain instead of a generic LLM call. |
| **Agent fabric** | Skills, Flows, Rules, Guard rails, Evals | Composable building blocks so each agent stays testable and policy-bound. |
| **Agent orchestration** | Process request → Approval? → Human review → Update record | An explicit loop with mandatory human checkpoints on sensitive decisions. |
| **AI capabilities** | VLMs, LLMs, Multi-Model Hub, RAG | Vision for scans/photos, retrieval for policy/master-data context, model routing. |
| **Infrastructure** | Cloud-native, Zero-trust, Containerized, Flexible LLM routing | An enterprise-grade substrate that lets you swap models without rewriting agents. |
| **Security instance** | Centralized validation and policy enforcement | Every step is validated and steered, end-to-end. |

Use this table as a checklist when you evaluate any IDP platform — not only DAiTA.

## Three high-value scenarios

### 1. ESG reporting — end the manual hunt for the right number
**Pain:** Energy and consumption data are buried in invoices, receipts, and attachments — sometimes as kWh, sometimes as m³, across mismatched periods.

**What good looks like:** AI extracts and harmonizes the values document-independently and context-aware. Teams get comparable figures for evaluations, reports, and sustainability decisions — without an Excel detective hunt.

**Prompting support:**
```text
You are an ESG data extraction agent.
Inputs: a batch of supplier invoices, utility bills, and PDF attachments.
Goal: produce a harmonized monthly consumption table.

For each document:
- Detect document type and supplier.
- Extract: metric name, raw value, raw unit, billing period start/end, site/cost-center.
- Normalize units to {kWh, m3, kg CO2e where derivable} and align to calendar months (pro-rata if the billing period spans months).
- Flag any value with low extraction confidence or missing period.

Output a JSON array of records and a separate "exceptions" array for human review.
Never invent missing values; mark them null and explain why.
```

### 2. Credit applications — structured overview, faster decisions
**Pain:** Loan officers wade through ID documents, income statements, and account excerpts before they can even start the decision.

**What good looks like:** The agent recognizes each supporting document, extracts the relevant fields, and presents a structured pre-pack so staff can move straight to judgement. The decision still belongs to a human.

**Prompting support:**
```text
You are a credit-application intake agent.
Inputs: a folder of supporting documents for one applicant.

For each document:
- Classify (ID, payslip, tax return, bank statement, employer letter, other).
- Extract canonical fields per type (e.g., payslip -> gross, net, employer, period).
- Verify internal consistency (name matches across docs, periods overlap, currency is consistent).
- Compute a completeness score against the required checklist.

Return:
1) Applicant summary card (markdown).
2) Per-document extraction table.
3) Open items the human reviewer must resolve before approval.
Do not make an approve/decline recommendation.
```

### 3. HR recruitment — time back for the actual selection
**Pain:** HR teams sift through large volumes of heterogeneous application packs to figure out *what is even there*.

**What good looks like:** The agent identifies which documents are present, which are missing, and how to file them — so HR can focus on the candidate, not the folder.

**Prompting support:**
```text
You are an HR application-intake agent.
Inputs: an application pack (CV, cover letter, certificates, references, work samples).

For each item:
- Classify and tag (CV, cover letter, degree certificate, language certificate, reference, portfolio, other).
- Extract a candidate profile: education, roles, durations, key skills, languages, certifications.
- Cross-check against the role's required-document checklist; list what's missing.
- Highlight items that need human verification (unclear scans, foreign credentials, gaps).

Return a structured candidate dossier in markdown plus a JSON "completeness" object.
Do not score, rank, or recommend candidates.
```

## Workflow blueprint
1. **Frame the document process.** Pick one inflow (invoices, applications, CVs) and map current sources, volumes, downstream systems, and the actual decision the document feeds.
2. **Pick the right agent.** Reuse a branch-expert agent (Accounting, Recruiting, ESG, …) instead of building from scratch where one exists.
3. **Codify rules and guard rails.** Define plausibility checks, mandatory fields, confidence thresholds, and the human-review trigger before connecting any model.
4. **Wire orchestration with explicit human checkpoints.** Map the *Process request → Approval needed? → Human review → Update record* loop to your system of record.
5. **Evaluate before scaling.** Run evals on a labeled sample (extraction accuracy, false-negative rate on plausibility checks, time-to-decision). Track per document type, not in aggregate.
6. **Roll out by domain, not by tool.** Start with one branch (e.g., ESG) end-to-end; add the next agent once the first one is stable in production.

## Deliverables checklist
- Document-type catalogue with target fields per type.
- Plausibility-check rule set and confidence thresholds.
- Human-in-the-loop policy: when AI auto-applies, when a reviewer must sign off.
- Eval set with ground truth per document type, refreshed quarterly.
- Audit log schema covering extraction, decisions, and reviewer actions.
- Rollout plan ordered by complexity × document intensity (the article's stated sweet spot for IDP).

## Operating tips
- **Treat "garbage in, garbage out" as a compliance risk**, not an IT slogan. False or incomplete inputs can put deadlines, data protection, and compliance at risk.
- **Keep the decision with the human** on credit, hiring, and ESG disclosures. Use the agent for structure and pre-checks.
- **Channel-agnostic ingestion.** Mail, upload, scanner — funnel everything through the same agent so quality rules apply uniformly.
- **Quality grades > raw extraction.** Surface a confidence/quality grade with every extracted field; route low-confidence fields to review automatically.

## References
- contentway.de — *AI & Supply Chain*: "Der Dokumentenflut souverän begegnen" (Partner Content, Business Solutions der Österreichischen Post AG).
- Post Business Solutions — https://www.post.at/businesssolutions
- Related in this repo: [AI Use Case Identification](./ai-use-case-identification.md) · [How to Build AI Agents That Work in Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md)
