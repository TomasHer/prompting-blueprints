---
title: "Banking AI Governance Use-Case Tutorial (Santander AI Open Source)"
tags: ["use-case", "banking", "financial-services", "responsible-ai", "ai-governance", "guardrails", "fairness", "fraud", "agents"]
last_updated: "2026-06-23"
---

# Banking AI Governance Use-Case Tutorial (Santander AI Open Source)

## Intent
Help risk, compliance, model-governance, and ML platform teams in regulated banks stand up the **control layer** that has to exist *before* AI is allowed to touch real lending, fraud, and customer decisions. The tutorial is grounded in the **Santander AI Open Source** organization on GitHub — reportedly the first time a major global bank has open-sourced its AI governance and safety stack under Apache-2.0 — and uses four of its flagship repositories as concrete, runnable building blocks.

> "This is not the shiny chatbot layer. It's the boring, critical, high-stakes control layer banks need before AI can touch real decisions." — paraphrased from Linas Beliūnas' summary of the Santander AI release.

## Why this matters for banks
Most public bank-AI stories are about the front end: copilots, chat, marketing copy. The hard part of banking AI is the part nobody demos — the gates, fairness checks, audit trails, and synthetic data that let a regulated institution defend an automated decision to a customer, an auditor, and a regulator.

Santander's move is notable because:

- **Everything is open code**, released under Apache-2.0 (some assets under CC BY 4.0).
- **Everything uses synthetic or anonymised data only** — no real customer data leaves the bank.
- It targets the **high-stakes control plane** (governance, fairness, guardrails, fraud) rather than the conversational layer.
- It is **free for competitors, fintechs, and regulators** — an explicit bet that raising the floor on trustworthy banking AI benefits the whole sector.

The transcript that prompted this tutorial noted that the org launched with **11 governance and safety repositories**; the organization has since grown (14+ repositories at the time of writing). Treat the four below as the canonical starting set for a bank control layer.

## Use when
- You are introducing LLMs or ML models into **credit, lending, fraud, AML, onboarding, or collections** decisions.
- A model decision must be **explainable and defensible** to a second line of defence, internal audit, or a regulator (e.g., EBA, ECB, or national supervisor expectations).
- You need to demonstrate **fairness / non-discrimination** on protected attributes for credit decisions.
- You want to **stress-test guardrails** of an LLM assistant without crippling it into refusing every benign request.
- You need **realistic-but-safe data** to develop and benchmark fraud / AML graph models without exposing real accounts.

## The four building blocks

| Repo | Control problem it solves | Banking decision it protects |
| --- | --- | --- |
| **`autoguardrails`** | Stress-tests and *improves* LLM safety policies against jailbreaks and obfuscation, without "winning by refusing everything". | Customer-facing assistants, internal copilots. |
| **`mech-gov-framework` (`mech_gov`)** | Mechanical governance: hard gates, argument-quality checks, commit-reveal, and audit trails for high-stakes LLM decisions. | Approvals, lending, compliance adjudication. |
| **`mutatis-mutandis`** | Counterfactual / situation-testing fairness analysis on protected groups. | Credit and lending non-discrimination testing. |
| **`gen-fraud-graph`** | Generates synthetic fraud graphs (millions of accounts / tens of millions of transactions) with no real data. | Fraud / AML graph-ML development and benchmarking. |

---

### 1. `autoguardrails` — stress-test guardrails without breaking them
**Control problem:** A bank assistant must refuse genuinely harmful requests (data exfiltration, fraud enablement, jailbreaks) while *still* helping with legitimate banking questions. Over-tightening guardrails is itself a failure — "winning by refusing everything" degrades the product.

**How it works.** `autoguardrails` follows an *autoresearch* loop with three fixed components and one mutable surface:

- **Fixed:** an evaluation suite of adversarial attacks, a judge prompt, and a Python harness.
- **Mutable:** a single `policy.md` file — the only thing edited between runs.
- **Acceptance rule:** a candidate policy is kept only if it **lowers attack success rate** *without* dropping benign-pass performance by more than ~2 percentage points.

The bundled attack suite covers jailbreak phrasings ("ignore previous instructions", "developer mode") and obfuscation (base64, ROT13, translation, JSON-wrapping). It runs on Python's standard library, ships a deterministic offline stub for CI, and supports OpenAI-compatible endpoints. Every decision is appended to `results.tsv` for reproducibility.

**Banking application.** Use it as the **regression gate for your assistant's safety policy**: every change to the system prompt / policy must clear the attack suite *and* the benign suite before release. Treat the benign-pass floor as a product-quality SLA, not an afterthought.

**Prompt to adapt the benign suite to your bank:**
```text
You are extending the benign-case suite for a banking assistant guardrails harness.
Context: retail + SME banking, EU regulated.

Produce 25 benign user requests a real customer or banker would make that a
SAFE assistant MUST still answer (do not include anything harmful):
- account/product questions, fee explanations, dispute processes,
  regulatory disclosures, "how do I..." support flows.

For each, give: the user message, the expected-helpful behavior, and a
one-line rationale for why refusing it would be a product failure.
Output as a TSV compatible with the autoguardrails benign set.
```

### 2. `mech_gov` — mechanical governance for high-stakes decisions
**Control problem:** When an LLM is in the loop on an approval or a high-stakes adjudication, "the model said so" is not a defensible control. You need deterministic gates, a quality check on the *reasoning*, and an audit trail.

**How it works.** `mech_gov` is a vendor-neutral Python framework offering three governance regimes:

- **R1 — Text-Only:** the LLM interprets policy guidelines with no automated enforcement (baseline).
- **R2 — Mechanical:** a multi-stage pipeline — **hard gates → entropy commit → candidate freezing → argument-quality checks (I6Q metric) → ambiguity gate → reveal**.
- **R3 — Adaptive:** an experimental exploratory regime.

The R2 mechanics that matter for a bank:

1. **Hard gates** — non-overridable decision boundaries (policy red lines the model cannot talk its way past).
2. **Argument-quality checks** — score the *reasoning*, not just the output, before it counts.
3. **Commit-reveal (entropy commit)** — the decision is committed before it is revealed, so post-hoc rationalisation can't drift the outcome.
4. **Candidate freezing** — the option set is frozen during processing.
5. **Ambiguity gate** — uncertain cases are flagged for human escalation (deferral) rather than auto-decided.

It ships a synthetic banking dataset, governance + task metrics (accuracy, F1, **deferral rate**), audit-trail capabilities, and CLI tools for running experiments.

**Banking application.** Wrap your lending / approval / compliance LLM calls in **R2** and report the **deferral rate** alongside accuracy — a healthy control sends genuinely ambiguous cases to a human instead of guessing. The audit trail is your evidence pack for second-line review and supervisory questions.

**Workflow:**
1. Map your decision to a `mech_gov` case type (or extend the synthetic dataset).
2. Encode your non-negotiable policy red lines as **hard gates**.
3. Run R1 vs R2 on the same set; compare accuracy *and* deferral/audit quality.
4. Set the ambiguity-gate threshold from your risk appetite (higher threshold → more human review).
5. Persist the audit trail to your system of record for every production decision.

### 3. `mutatis-mutandis` — counterfactual fairness for credit
**Control problem:** Credit decisions must not discriminate on protected attributes. "We didn't use the protected attribute as a feature" is not proof of fairness — proxies leak.

**How it works.** `mutatis-mutandis` implements **situation testing**: it compares an individual's outcome against a neighbourhood (k-nearest) of similar individuals split into protected (control) and non-protected (test) groups. Its counterfactual variant (`cfST`) generates synthetic "twin" individuals as comparators, isolating discrimination from legitimate decision factors. Features:

- `SituationTesting` estimator with configurable protected attributes, target outcome, and k.
- **Mixed-attribute distances** (continuous, ordinal, nominal) so realistic applicant data works out of the box.
- Statistical rigour: Wald confidence intervals and **per-individual discrimination reports**.
- A reproducible pipeline (documented on the Law School dataset; the method generalises to lending).

**Banking application.** Run it as a **pre-deployment fairness gate** and a **periodic monitoring job** on your credit model's decisions. The per-individual reports give you named, defensible cases for a fair-lending review rather than a single aggregate number.

**Prompt to frame the audit:**
```text
You are setting up a counterfactual fairness audit for a credit-scoring model
using a situation-testing approach (k-NN factual + counterfactual comparators).

Given this feature schema: [paste columns + types + which are protected].

Produce:
1) The protected attribute(s) and any likely proxies to watch.
2) A distance/weighting plan across continuous, ordinal, and nominal features.
3) Recommended k and the decision threshold for flagging discrimination.
4) The exact tables/figures to include in a fair-lending review pack.
Do not propose using the protected attribute as a model feature.
```

### 4. `gen-fraud-graph` — synthetic fraud graphs at scale
**Control problem:** Fraud / AML graph models need realistic, large, network-structured data — but you cannot develop, share, or benchmark on real customer accounts.

**How it works.** `gen-fraud-graph` produces synthetic transaction networks with embedded fraud patterns via a three-phase pipeline:

1. **Account generation** — synthetic customers with balances and risk scores.
2. **Normal transactions** — legitimate flows between accounts.
3. **Fraud injection** — cyclic money-laundering rings, 4–7 hops deep.

It scales by a single factor (configurable from ~1,000 accounts up to **10M+ accounts and ~90M transactions**, extensible further), with parallel multi-core generation, optional vector embeddings (random / local SentenceTransformers / OpenAI), multiple export formats (including Neptune bulk-load), and resume support. **Entirely synthetic — no real financial data.**

| Scale factor | Accounts | Transactions |
| --- | --- | --- |
| 0.0001 | 1,000 | 9,000 |
| 0.01 | 100,000 | 900,000 |
| 1.0 | 10,000,000 | 90,000,000 |

**Banking application.** Use it to **benchmark graph neural networks and AML rules**, load-test your graph database, and share a reproducible fraud dataset across teams (and even with regulators) without a privacy review. Inject known fraud topologies, then measure whether your detector recovers them.

---

## Reference control-layer blueprint
Assemble the four repos into a layered control plane around any banking AI decision:

| Layer | Building block | Question it answers |
| --- | --- | --- |
| **Input safety** | `autoguardrails` | "Can this assistant be jailbroken into harmful or fraudulent behaviour — and is it still useful?" |
| **Decision governance** | `mech_gov` (R2) | "Is this high-stakes decision gated, reasoned, audited, and deferred when ambiguous?" |
| **Fairness assurance** | `mutatis-mutandis` | "Does this credit decision discriminate against protected groups?" |
| **Safe data substrate** | `gen-fraud-graph` | "Can we build and benchmark fraud/AML models without exposing real customers?" |

## Adoption workflow
1. **Pick one high-stakes decision** (e.g., SME credit pre-screen) — not the chatbot.
2. **Stand up the safe data substrate first** with `gen-fraud-graph` (for fraud/AML) or `mech_gov`'s synthetic banking dataset (for approvals).
3. **Wrap the decision in `mech_gov` R2**; encode policy red lines as hard gates; baseline R1 vs R2.
4. **Gate fairness with `mutatis-mutandis`** before any go-live and on a recurring schedule.
5. **If an LLM is customer-facing, gate every policy change through `autoguardrails`** (attack suite + benign floor).
6. **Wire audit trails into your system of record** and report deferral + fairness metrics to the second line.
7. **Roll out by decision, not by tool** — stabilise one end-to-end before adding the next.

## Deliverables checklist
- Decision inventory tagging each AI-touched decision as high- or low-stakes.
- `autoguardrails` attack + benign suites tuned to your products, run in CI.
- `mech_gov` hard-gate policy set, ambiguity threshold, and audit-trail schema.
- `mutatis-mutandis` fairness report (per-individual + aggregate) per credit model release.
- Synthetic fraud dataset(s) from `gen-fraud-graph` with documented injected topologies.
- A governance dossier per decision: gates, fairness evidence, audit trail, deferral rate.

## Operating tips
- **Govern the decision, not the chatbot.** The defensible-AI work is in gates, fairness, and audit — the conversational layer is the easy 10%.
- **Synthetic-or-anonymised by default.** Follow Santander's stance: develop and share on synthetic data; keep real customer data out of the dev loop.
- **Treat "refuse everything" as a failure.** A guardrail that kills benign requests is a product defect — hold the benign-pass floor.
- **Report deferral rate as a feature.** A control that escalates ambiguous cases to humans is working as designed.
- **Open-source is a baseline, not a finished control.** These repos are research-grade scaffolds — wire them to your real policies, data contracts, and second-line review.

## References
- Santander AI Open Source (GitHub organization) — https://github.com/SantanderAI
- `autoguardrails` — https://github.com/SantanderAI/autoguardrails
- `mech-gov-framework` (`mech_gov`) — https://github.com/SantanderAI/mech-gov-framework
- `mutatis-mutandis` — https://github.com/SantanderAI/mutatis-mutandis
- `gen-fraud-graph` — https://github.com/SantanderAI/gen-fraud-graph
- Related in this repo: [AI Use Case Identification](./ai-use-case-identification.md) · [Intelligent Document Processing Playbook (DAiTA)](./intelligent-document-processing-daita.md) · [LLM Lifecycle Monitoring](../04-guides/llm-lifecycle-monitoring.md)
