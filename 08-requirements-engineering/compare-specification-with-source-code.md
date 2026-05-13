---
title: "Compare Specification With Source Code"
tags: ["requirements-engineering", "traceability", "consistency", "source-code", "IREB", "AI4RE", "compliance"]
last_updated: "2026-05-13"
source: "IREB AI4RE Prompt Guide – Compare Specification With Source Code"
source_url: "https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2556493825/Compare+Specification+With+Source+Code"
---

# Compare Specification With Source Code

> **Source:** This tutorial is based on the IREB AI4RE Prompt Guide entry *"Compare Specification With Source Code"*, published by the International Requirements Engineering Board (IREB) Special Interest Group #AIREB.
> Original: [https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2556493825/Compare+Specification+With+Source+Code](https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2556493825/Compare+Specification+With+Source+Code)

---

## Why This Matters

In real-world projects, implemented software often does not fully align with its specified requirements. Communication gaps, implicit assumptions, and undocumented changes accumulate over time and cause the codebase to drift from its specification. These inconsistencies are rarely caught early — they surface during testing, audits, or production incidents, at which point the cost of remediation is high.

The challenge is structural: specifications live in documents, wikis, or requirement management tools, while code lives in repositories. The two artefacts evolve independently, authored by different people with different vocabularies, and there is rarely an automated mechanism that keeps them in sync.

AI-based prompts offer a new approach. By providing both a specification excerpt and the relevant source code to an AI model, teams can obtain a structured comparison that surfaces deviations, missing implementations, and behaviours present in code but absent from the specification. This supports traceability, reduces manual review effort, and strengthens the evidence base for quality and compliance audits.

This is particularly relevant in regulated environments — medical devices, automotive systems, financial services, critical infrastructure — where traceability between requirements and implementation must be demonstrated and is subject to external scrutiny.

---

## Intent

Use AI to perform a structured comparison between a requirements specification (or a relevant excerpt) and the corresponding source code. The goal is to identify:

- **Missing implementations** — requirements stated in the specification that are not reflected in the code
- **Undocumented behaviour** — logic present in the code that has no corresponding requirement
- **Semantic deviations** — code that partially implements a requirement but with different logic, constraints, or boundary values
- **Naming and terminology drift** — concepts named differently in the specification and the code, obscuring traceability
- **Violated constraints** — non-functional requirements (e.g., performance, security, error handling) specified but not enforced in the code

---

## When to Use

- You are preparing for a requirements review, design review, or compliance audit and need to verify implementation completeness.
- A specification has been updated and you want to assess the impact on existing code.
- A codebase has been maintained over time without rigorous requirement tracking, and you need to reconstruct traceability.
- You are onboarding a new team and want a structured overview of where code and specification diverge.
- You are working in a regulated domain and need documented evidence that specified behaviour is implemented correctly.

---

## Preparation Checklist

- [ ] Select a focused, coherent excerpt from the specification — a single feature, user story, or functional requirement cluster works best.
- [ ] Identify the corresponding source code: a function, module, class, or service that implements the specified behaviour.
- [ ] Convert code to plain text (copy from your IDE or VCS). You do not need to include the entire codebase — only the implementation relevant to the specification excerpt.
- [ ] Decide on your **scope of analysis**: functional correctness only, or should non-functional requirements (error handling, performance constraints, security rules) also be checked?
- [ ] Define the expected **output format**: a findings table, a traceability matrix, or a narrative review.
- [ ] Keep both inputs within a manageable size. For large features, break the comparison into sub-features or modules.

---

## Core Prompt Template

```
You are an experienced Requirements Engineer and Software Quality Analyst.
Your task is to compare a requirements specification with the corresponding source code
and identify inconsistencies, deviations, and traceability gaps.

## Requirements Specification
[Paste the relevant specification excerpt here. Include requirement IDs if available,
acceptance criteria, constraints, and any relevant context or assumptions.]

## Source Code
[Paste the relevant source code here. Include the complete implementation of the feature
or function being checked — class definitions, method bodies, conditionals, error handling.]

## Task
Systematically compare the specification and the source code. For each finding, provide:

1. **Finding ID** – a short identifier (e.g., SC-01)
2. **Type** – one of: Missing Implementation | Undocumented Behaviour | Semantic Deviation | Naming Drift | Violated Constraint
3. **Specification Reference** – the requirement ID or quoted text from the specification
4. **Code Reference** – the function, class, method, or line range in the source code
5. **Description** – what the inconsistency is and why it matters
6. **Severity** – High | Medium | Low
7. **Recommendation** – a concrete suggestion for how to resolve it

Present your findings in a Markdown table. After the table, provide a brief executive summary
(3–5 sentences) that characterises the overall consistency state between the specification
and the implementation.
```

---

## Prompt Walkthrough

| Prompt Section | Purpose |
|---|---|
| Role definition (*"You are an experienced Requirements Engineer and Software Quality Analyst…"*) | Primes the AI to reason from both a specification and a software quality perspective |
| Requirements Specification block | Provides the authoritative source of intended behaviour; label with IDs where possible |
| Source Code block | Provides the actual implementation to be checked against the specification |
| Enumerated finding structure | Produces structured, actionable output rather than unstructured commentary |
| Finding types taxonomy | Constrains the AI to a shared vocabulary covering the most common specification-to-code deviation patterns |
| Specification Reference + Code Reference | Establishes explicit traceability links between findings and their evidence |
| Severity rating | Allows the team to prioritise findings by risk and impact |
| Recommendation field | Moves the output from observation to action |
| Executive summary request | Provides a concise overview suitable for review meetings or audit documentation |

---

## Example

### Input

**Requirements Specification (excerpt)**

> **REQ-101:** The system shall validate that a user's age is at least 18 years before completing registration.
>
> **REQ-102:** If the age validation fails, the system shall display the message: *"You must be 18 or older to register."*
>
> **REQ-103:** The system shall log all failed registration attempts, including the timestamp and the reason for rejection.

**Source Code (excerpt — Python)**

```python
def register_user(name, email, birth_date):
    age = calculate_age(birth_date)
    if age < 18:
        return {"error": "Age requirement not met."}
    user = create_user(name, email, birth_date)
    return {"success": True, "user_id": user.id}
```

### Output (excerpt)

| Finding ID | Type | Specification Reference | Code Reference | Description | Severity | Recommendation |
|---|---|---|---|---|---|---|
| SC-01 | Semantic Deviation | REQ-102: error message text | `register_user` → return statement | The specification mandates the message *"You must be 18 or older to register."* but the code returns `"Age requirement not met."` — a different message that does not meet the specified wording. | High | Update the error string in the return statement to match REQ-102 exactly. |
| SC-02 | Missing Implementation | REQ-103: logging of failed attempts | `register_user` — entire function | The function does not log failed registration attempts. No logging call is present when `age < 18`. The timestamp and rejection reason are not recorded anywhere. | High | Add a logging call inside the `if age < 18` block, capturing the current timestamp and `"age_below_minimum"` as the rejection reason. |
| SC-03 | Undocumented Behaviour | — | `register_user` → `create_user` call | The code calls `create_user` which presumably creates a database record, but no specification requirement covers the persistence behaviour, the fields stored, or the returned `user_id`. | Medium | Add requirements covering the user creation and persistence logic, or document these as implementation details in the specification. |

**Executive Summary:** The implementation covers the core age-check logic of REQ-101, but fails on two high-severity points. The error message (REQ-102) does not match the specified wording, which may be a compliance issue in regulated contexts where exact user-facing text is mandated. The required audit logging (REQ-103) is entirely absent, representing a significant gap if the system is subject to access or registration auditing. Additionally, the code's persistence behaviour is undocumented in the specification. The implementation requires targeted fixes to REQ-102 and REQ-103 before it can be considered compliant.

---

## Prompt Variations

### Variation 1 – Traceability Matrix Output

When the goal is to produce a traceability artefact rather than a deviation report, request a matrix:

```
## Task
For each requirement in the specification, identify the corresponding code element
(function, class, method) that implements it. If no implementation exists, mark it as "NOT IMPLEMENTED".
Present the result as a Markdown table with columns:
Requirement ID | Requirement Summary | Implementing Code Element | Coverage Status (Full / Partial / None) | Notes
```

### Variation 2 – Non-Functional Requirements Check

To focus on non-functional constraints such as performance, security, or error handling:

```
## Scope
Focus only on non-functional requirements: performance constraints, security rules,
error handling requirements, and logging obligations.
Ignore functional correctness of business logic.
```

### Variation 3 – Audit Evidence Generation

For regulated environments where audit documentation is required:

```
## Task
For each requirement, state whether the source code provides sufficient evidence of implementation.
For each requirement, provide:
- Requirement ID and text
- Verdict: Implemented | Partially Implemented | Not Implemented
- Evidence: the specific code element or line that implements the requirement
- Gap description (if Partially Implemented or Not Implemented)

Format the output as a numbered list suitable for inclusion in a compliance audit report.
```

### Variation 4 – Change Impact Analysis

When a specification has been updated and you want to assess the impact on existing code:

```
You are an experienced Requirements Engineer.
The following requirement has been changed. Assess whether the existing source code
still satisfies the updated requirement, or whether code changes are needed.

## Original Requirement
[Paste the old requirement text.]

## Updated Requirement
[Paste the new requirement text. Highlight or describe what changed.]

## Source Code
[Paste the current implementation.]

## Task
Identify every place in the code that must change to satisfy the updated requirement.
Describe the required change and its severity.
```

---

## Quality Assurance Tips

- **Use requirement IDs wherever possible**: Prompts that reference `REQ-042` rather than paraphrased text produce more precise findings and easier-to-trace outputs.
- **Keep scope narrow**: A single user story or a single module at a time yields more accurate results than dumping an entire specification and codebase.
- **Include error handling and edge cases**: Explicitly ask the AI to check boundary conditions, null handling, and exception paths — these are common sources of deviation.
- **Iterate on high-severity findings**: After receiving the table, follow up with: *"For SC-02, draft the logging code that resolves this finding."*
- **Validate AI output**: AI can miss subtle deviations and may misread complex logic. Have a developer or QA engineer review findings involving intricate conditional logic before acting on them.
- **Re-run after changes**: Treat the prompt as a repeatable check — run it again after fixes are applied to confirm findings are resolved.

---

## Limitations

- AI cannot access your repository, issue tracker, or requirement management tool directly — you must paste the relevant content manually.
- Very long specifications or code modules will exceed context limits; split large features into smaller, cohesive slices.
- AI may misinterpret domain-specific conventions or abbreviations in code unless you provide a brief glossary or context note.
- Findings should be treated as a **first-pass review aid**, not a substitute for expert human judgement or formal verification.
- In regulated environments, AI-generated findings must be reviewed and signed off by a qualified engineer before being included in compliance documentation.

---

## Related Blueprints

- [Overview – Requirements Engineering Prompting](./overview.md)
- [Check Model Consistency](./check-model-consistency.md)
- [Role + Constraint + Format Pattern](../03-prompts-and-patterns/role-constraint-format.md)
- [Prompt Pattern Catalogue](../03-prompts-and-patterns/prompt-pattern-catalogue.md)
- [Use Cases & Research](../07-use-cases-and-research)

---

## Source & Attribution

> **IREB AI4RE Prompt Guide** — *Compare Specification With Source Code*
> International Requirements Engineering Board (IREB) Special Interest Group #AIREB
> [https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2556493825/Compare+Specification+With+Source+Code](https://ireb.atlassian.net/wiki/spaces/airebpromptguide/pages/2556493825/Compare+Specification+With+Source+Code)
>
> This tutorial adapts and extends the original IREB template with additional context, examples, and prompt variations. The core prompt structure, domain framing, and use-case motivation originate from the IREB AI4RE community effort.
