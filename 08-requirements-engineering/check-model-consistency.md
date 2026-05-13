---
title: "Check Model Consistency"
tags: ["requirements-engineering", "model-consistency", "UML", "BPMN", "SysML", "IREB", "AI4RE"]
last_updated: "2026-05-13"
source: "IREB AI4RE Prompt Guide – Check Model Consistency"
source_url: "https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2585985025/Prompt+Guide+Check+Model+Consistency"
---

# Check Model Consistency

> **Source:** This tutorial is based on the IREB AI4RE Prompt Guide entry *"Prompt Guide: Check Model Consistency"*, published by the International Requirements Engineering Board (IREB).
> Original: [https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2585985025/Prompt+Guide+Check+Model+Consistency](https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2585985025/Prompt+Guide+Check+Model+Consistency)

---

## Why This Matters

Keeping multiple models aligned is one of the most persistent challenges in Requirements Engineering and model-based engineering. In practice, system descriptions are spread across several interconnected artefacts — a use case model, a domain class diagram, a BPMN process model, a SysML requirements diagram, and possibly a state machine or sequence diagrams. These models are rarely maintained in lockstep: changes in one artefact ripple silently into others, and inconsistencies accumulate over time.

Manual cross-model consistency checks are labour-intensive, error-prone, and often deferred until formal reviews — by which point the cost of fixing contradictions is high. AI can act as a rapid, tireless consistency checker that surfaces gaps and contradictions early in the development cycle.

If you work with UML, BPMN, SysML or any structured system models, this blueprint offers practical guidance on how to prompt AI for effective consistency validation.

---

## Intent

Use AI as a consistency reviewer to detect:

- **Semantic gaps** — elements defined in one model but absent or unnamed in another
- **Contradictions** — two models making conflicting claims about the same concept or behaviour
- **Naming mismatches** — the same real-world concept labelled differently across models
- **Orphaned elements** — requirements not traced to any design element; design elements with no covering requirement
- **Behavioural inconsistencies** — a process step in BPMN that contradicts the allowed transitions in a state machine

---

## When to Use

- You have two or more models that describe the same system or subsystem and need to cross-check them.
- You've updated one model (e.g., added a new use case) and want to quickly assess the downstream impact on other models.
- You're preparing for a requirements review or design milestone and want early-warning of inconsistencies.
- You are onboarding a new team member and need a structured summary of where the models diverge.

---

## Preparation Checklist

- [ ] Identify which two (or more) models you want to compare.
- [ ] Export or transcribe each model into a text-readable format — natural language descriptions, structured lists of elements, or a textual encoding such as PlantUML, BPMN XML snippets, or SysML text notation.
- [ ] Agree on the **scope of comparison**: are you checking all elements, or just a specific subset (e.g., only entities related to the "Order" domain)?
- [ ] Define the expected **output format**: a table, a prioritised list, or an executive summary.
- [ ] Keep each model excerpt focused — AI context windows are finite; large models should be broken into thematic slices.

---

## Core Prompt Template

This is the base template from the IREB AI4RE Prompt Guide, adapted with additional structural guidance:

```
You are an experienced Requirements Engineer specialising in model-based systems engineering.
Your task is to check consistency between two system models.

## Model A – [Label, e.g., "Use Case Model"]
[Paste or describe Model A here. Include all relevant elements: actors, use cases, relationships, 
system boundary, and any annotated constraints.]

## Model B – [Label, e.g., "Domain Class Diagram"]
[Paste or describe Model B here. Include all relevant elements: classes, attributes, associations,
multiplicities, and any annotated constraints.]

## Task
Systematically compare Model A and Model B. Identify every inconsistency, gap, or contradiction 
between them. For each finding, provide:

1. **Finding ID** – a short identifier (e.g., IC-01)
2. **Type** – one of: Semantic Gap | Contradiction | Naming Mismatch | Orphaned Element | Behavioural Inconsistency
3. **Affected Elements** – which specific elements in Model A and/or Model B are involved
4. **Description** – what the inconsistency is and why it matters
5. **Severity** – High | Medium | Low
6. **Recommendation** – a concrete suggestion for how to resolve it

Present your findings in a Markdown table. After the table, provide a brief executive summary 
(3–5 sentences) that characterises the overall consistency state of the two models.
```

---

## Prompt Walkthrough

| Prompt Section | Purpose |
|---|---|
| Role definition (*"You are an experienced Requirements Engineer…"*) | Grounds the AI in domain knowledge and sets the right reasoning mode |
| Model A / Model B labelled blocks | Keeps each model's content clearly scoped; prevents the AI from conflating content from both |
| Enumerated finding structure | Forces structured output; avoids free-form prose that is hard to action |
| Finding types taxonomy | Constrains the AI to a shared vocabulary that maps onto RE practice |
| Severity rating | Helps the team prioritise which inconsistencies to resolve first |
| Recommendation field | Moves the output from observation to action |
| Executive summary request | Provides a concise overview suitable for review meetings |

---

## Example

### Input

**Model A – Use Case Model (textual description)**

> The system supports three actors: Customer, Order Manager, and Payment Gateway. Use cases include: Browse Catalogue, Place Order, Cancel Order, Process Payment, and Issue Refund. The Customer initiates Browse Catalogue, Place Order, and Cancel Order. Process Payment and Issue Refund are initiated by Order Manager and involve the Payment Gateway.

**Model B – Domain Class Diagram (textual description)**

> Classes: Customer, Product, ShoppingCart, Order, Invoice, PaymentTransaction. Customer has a 1..* association with Order. Order has a 1..1 association with Invoice. Invoice has a 0..1 association with PaymentTransaction. No Refund class exists. Order Manager does not appear as a class.

### Output (excerpt)

| Finding ID | Type | Affected Elements | Description | Severity | Recommendation |
|---|---|---|---|---|---|
| IC-01 | Semantic Gap | Use Case: Issue Refund / Class Diagram: no Refund class | The UC model defines an "Issue Refund" use case, but no corresponding `Refund` or `CreditNote` class exists in the domain model to capture refund data. | High | Add a `Refund` class to the class diagram, associated with `PaymentTransaction` and `Order`. |
| IC-02 | Orphaned Element | Actor: Order Manager / Class Diagram | "Order Manager" is modelled as an actor in the UC model but has no corresponding class or role in the domain model. If Order Manager has persistent attributes (name, permissions), a class is needed. | Medium | Decide whether Order Manager is a system role (→ no class needed) or a managed entity (→ add a `Staff` or `OrderManager` class). |
| IC-03 | Naming Mismatch | Use Case: Browse Catalogue / Class: Product | The UC references "Catalogue" as a navigable concept, but the class diagram uses `Product` without a `Catalogue` container class or association. | Low | Either add a `Catalogue` class that aggregates `Product`, or rename the use case to "Browse Products" for alignment. |

**Executive Summary:** The two models are broadly aligned on the core order lifecycle, but reveal three noteworthy inconsistencies. The absence of a Refund entity (IC-01) is a high-severity gap that will impact data persistence design. The Order Manager actor (IC-02) requires a design decision on whether it represents a human role or a managed system entity. The Catalogue/Product naming divergence (IC-03) is cosmetic but should be resolved early to prevent terminology drift across the project. Overall, the models require targeted additions to the class diagram before they can be considered consistent.

---

## Prompt Variations

### Variation 1 – Three-Model Cross-Check

When comparing three models simultaneously, extend the template with a **Model C** block and adjust the task instruction:

```
## Task
Compare all three models pairwise: A vs B, B vs C, and A vs C. 
Group findings by model pair. Use the same finding structure as above.
```

### Variation 2 – Focus on a Specific Domain Slice

To limit scope and improve precision, add a scoping instruction before the task:

```
## Scope
Only compare elements related to the "Payment" subdomain. 
Ignore actors, use cases, and classes that are not payment-related.
```

### Variation 3 – BPMN vs. Requirements Specification

When comparing a BPMN process model against a textual requirements specification:

```
You are an experienced Requirements Engineer.
Check whether the following BPMN process model is consistent with the requirements specification.

## BPMN Process – [Process Name]
[Describe or paste the BPMN process: pools, lanes, tasks, gateways, events, sequence flows, 
message flows, and any data objects.]

## Requirements Specification (relevant excerpt)
[Paste the relevant requirements text or structured requirement statements (e.g., "REQ-042: 
The system shall allow a customer to cancel an order within 24 hours of placement.")]

## Task
Identify requirements that are not covered by any BPMN task or gateway, 
and BPMN tasks that have no traceable requirement. Present findings as above.
```

### Variation 4 – SysML Requirements Diagram vs. Test Case Specification

```
You are a Requirements Engineer reviewing traceability.
Check whether the following SysML requirements are adequately covered by the test case specification.

## SysML Requirements
[List requirements with IDs, e.g.:
REQ-001: The system shall respond within 200ms under normal load.
REQ-002: The system shall encrypt all data at rest using AES-256.]

## Test Case Specification
[List test cases with IDs and brief descriptions.]

## Task
For each requirement, identify which test cases cover it (if any). 
Flag requirements with no covering test case as HIGH severity gaps.
```

---

## Quality Assurance Tips

- **Chunk large models**: AI context windows are limited. If a model has more than ~50 elements, split the check into thematic slices (e.g., "Order management elements only").
- **Be explicit about notation**: If your class diagram uses UML multiplicities or OCL constraints, tell the AI which notation you are using so it interprets symbols correctly.
- **Iterate on findings**: After receiving the initial table, follow up with: *"For IC-01, draft the updated class diagram fragment that resolves this inconsistency."*
- **Validate AI output**: AI can miss subtle semantic gaps and occasionally hallucinate elements. Always have a domain expert review the findings before acting on them.
- **Use version-controlled model text**: Storing textual model representations (PlantUML, etc.) in version control makes it easy to re-run consistency checks after changes.

---

## Limitations

- AI cannot parse native tool formats (e.g., `.eap`, `.mdzip`, `.bpmnx`) directly — you must convert or transcribe model content into text first.
- Very large models will exceed context limits; results are only as complete as the model excerpt you provide.
- AI does not have access to your organisation's modelling conventions or glossary unless you include them in the prompt.
- Findings should be treated as a **first-pass review aid**, not a substitute for expert human judgement.

---

## Related Blueprints

- [Overview – Requirements Engineering Prompting](./overview.md)
- [Role + Constraint + Format Pattern](../03-prompts-and-patterns/role-constraint-format.md)
- [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md)
- [Use Cases & Research](../07-use-cases-and-research)

---

## Source & Attribution

> **IREB AI4RE Prompt Guide** — *Prompt Guide: Check Model Consistency*
> International Requirements Engineering Board (IREB)
> [https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2585985025/Prompt+Guide+Check+Model+Consistency](https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2585985025/Prompt+Guide+Check+Model+Consistency)
>
> This tutorial adapts and extends the original IREB template with additional context, examples, and prompt variations. The core prompt structure, domain framing, and use-case motivation originate from the IREB AI4RE community effort.
