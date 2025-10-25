# GPT-5 Prompt Optimizer Tutorial: From Baseline Prompt to Production Ready Instructions

> A guided workflow for using the **GPT-5 Prompt Optimizer** to improve everyday prompts, plus advanced tips for complex retrieval-augmented generation (RAG) systems.

---

## Intent

Help practitioners turn rough prompt drafts into reliable instructions by leveraging OpenAI's GPT-5 Prompt Optimizer. The tutorial covers how to launch the optimizer, compare candidate prompts, and operationalize the results in both classic chat flows and multi-hop RAG pipelines.

---

## Use When

- Your prompt works occasionally but fails on edge cases or longer inputs.
- You want to stress-test a prompt against multiple scenarios quickly.
- You're building a RAG flow (e.g., vector search + GPT-5) and need the assistant to follow formatting contracts under noisy context windows.

---

## Prerequisites

- An OpenAI account with access to GPT-5 models and the **Prompt Optimizer** beta.
- Sample inputs or transcripts that represent success and failure cases for your task.
- (Optional) A workspace where you can paste optimized prompts into your application or agent configuration.

---

## Quick Links

- **Launch Prompt Optimizer:** <https://platform.openai.com/chat/edit?optimize=true>
- **Optimization Playbook:** <https://cookbook.openai.com/examples/gpt-5/prompt-optimization-cookbook>

---

## Workflow Overview

1. **Collect baseline prompts** and pick 3–5 representative test inputs.
2. **Open GPT-5 Prompt Optimizer** and load the baseline prompt with your test cases.
3. **Define success criteria** (desired tone, format, constraints, evaluation hints).
4. **Generate optimized variants** and review rationale, guardrails, and diffs.
5. **Export the optimized prompt** with acceptance tests or integrate it directly into your app.

---

## Step-by-Step

### 1) Capture the baseline prompt and edge cases

1. Copy your current prompt (instructions, variables, expected output format).
2. Gather 3–5 example inputs:
   - 2 "happy path" cases that already work.
   - 1–2 failure cases where hallucinations or formatting drift occur.
   - (For RAG) 1 case with conflicting or noisy retrieved passages.
3. Write down what "good" looks like—JSON schema, tone, citations, latency, etc.

### 2) Launch GPT-5 Prompt Optimizer

1. Visit the **Prompt Optimizer** interface.
2. Paste your baseline prompt into the **Prompt** panel.
3. Add test inputs under **Scenarios**. You can import CSV/JSON or paste freeform text.
4. (Optional) Provide **Reference Outputs** if you want the optimizer to compare exact strings or formats.

### 3) Configure optimization goals

- **Quality dimensions:** Choose clarity, adherence to instructions, safety, or factuality. For RAG, prioritize grounding and citation coverage.
- **Model target:** Select the GPT-5 variant you plan to use (e.g., `gpt-5.1` or `gpt-5.1-mini`).
- **Output style hints:** Add bullet requirements such as "respond in Markdown" or "return valid JSON".
- **Guardrails:** Specify banned content, tone limits, or max tokens per section.

### 4) Review optimizer suggestions

The optimizer proposes alternate prompt wordings with inline rationales. For each candidate:

- Check the **Diff** tab to understand how it reorganizes role, context, or formatting.
- Inspect **Scenario scores** to see which variants survive tricky cases.
- Validate **Output samples**—do they include citations, respect JSON schemas, or gracefully decline unsupported queries?
- Flag any regressions: if a variant breaks a critical case, you can down-rank it so the optimizer iterates further.

### 5) Lock in the optimized prompt

1. Promote the best-performing variant to **Saved Prompt**.
2. Export the prompt with inline comments or structured metadata (copy, JSON, or API snippet).
3. Back in your application:
   - Replace the baseline prompt with the optimized version.
   - Keep the optimizer's scenario list as a regression suite.
   - Schedule periodic re-optimization when requirements or knowledge bases change.

---

## Prompt Templates

### Baseline Collection Worksheet (copy → fill → paste into optimizer)

```text
# Task
Summarize internal research meeting notes into a stakeholder-ready update.

# Audience
Senior engineering leadership evaluating quarterly roadmap trade-offs.

# Constraints
- Highlight blockers, decisions, and action owners.
- Limit to 300 words.
- Include a confidence rating (High / Medium / Low).

# Failure Examples to Fix
1. Skips action owners when notes are noisy.
2. Omits conflicting viewpoints between squads.
3. Exceeds the word limit when multiple decisions are logged.
```

### Optimized Prompt Structure for RAG Agents

```text
SYSTEM ROLE
You are an enterprise change management analyst. Always read the retrieved context blocks before responding. Decline if critical facts are missing.

USER INSTRUCTIONS
1. Digest the provided meeting transcript excerpts and knowledge base passages.
2. Produce a briefing with the following JSON schema:
   {
     "summary": "<75 word executive summary>",
     "decisions": [
       {"topic": string, "owner": string, "due_date": string | null, "confidence": "High" | "Medium" | "Low"}
     ],
     "risks": [
       {"description": string, "mitigation": string, "source_passage_ids": [string]}
     ],
     "next_steps": [string]
   }
3. For each decision and risk, cite the `source_passage_id` values that support it.
4. If context conflicts, surface the disagreement and recommend follow-up questions instead of fabricating answers.

SAFETY + QUALITY BARS
- Never invent owners or due dates.
- If context is ambiguous, set `confidence` to "Low" and explain why.
- Keep responses under 900 tokens.
```

Use the optimizer to enforce schema validation and citation fidelity by pasting the RAG schema and adding the risk scenarios from your retrieval dataset.

---

## Operational Tips

- **Version control your prompts:** Store optimizer exports in Git alongside code changes to track improvements and rollbacks.
- **Automate regression checks:** Convert optimizer scenarios into unit tests (e.g., promptfoo, pytest) to guard against future changes.
- **Share with stakeholders:** The optimizer's rationales make it easier to explain why a new prompt version is safer or more reliable.
- **Iterate with telemetry:** Log production failures, replay them in the optimizer, and request fresh variants focused on the new failure mode.

---

## References

- OpenAI. “GPT-5 Prompt Optimization Cookbook.” <https://cookbook.openai.com/examples/gpt-5/prompt-optimization-cookbook>.
- OpenAI. “GPT-5 Prompt Optimizer.” <https://platform.openai.com/chat/edit?optimize=true>.
