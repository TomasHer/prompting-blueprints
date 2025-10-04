# Guide to High-Impact Prompting Patterns

This guide summarizes seven prompting patterns from Dr. Jules White's research on prompting blueprints and explains when and how to apply them in practice. Each section provides a quick diagnostic for when the pattern is useful, a step-by-step workflow, and an example scaffold you can adapt in your own prompts.

> **Reference:** Jules White et al., "A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT," 2023. <https://arxiv.org/pdf/2302.11382>

## 1. Flipped Interaction Pattern — “Ask Me Questions to Achieve X”

**Use it when**
- You only have a vague or underspecified objective but the model needs more detail to succeed.
- You want the model to drive the discovery process by interviewing you or another stakeholder.
- You can actively respond to follow-up questions in a multi-turn exchange.

**How to apply it**
1. State the end goal explicitly (e.g., “achieve X outcome”).
2. Instruct the model to ask clarifying questions before giving advice or output.
3. Commit to answering every question with concrete, actionable information.
4. Only after the questioning phase, request a final synthesis based on your answers.

**Prompt scaffold**
```text
I would like you to help me achieve <goal>. Do not provide solutions yet. 
Instead, ask me one question at a time that will help you understand the situation.
After I confirm that you have enough information, summarize my answers and present the plan.
```

## 2. Persona Pattern — “Act as Persona X”

**Use it when**
- You need the model to reason with a specific professional lens or communication style.
- Subject-matter expertise or tone (e.g., legal advisor, empathetic coach) impacts the output quality.
- You want consistent voice and constraints enforced by the assumed persona.

**How to apply it**
1. Define the persona’s role, expertise, and goals.
2. Describe constraints such as tone, level of detail, or audience.
3. Provide context or input data the persona will interpret.
4. Request outputs consistent with both the persona and constraints.

**Prompt scaffold**
```text
Act as <persona> who specializes in <domain>. Maintain a <tone> voice.
Given the following context, provide guidance aligned with this role.
CONTEXT: <insert details>
OUTPUT: <describe format, e.g., bullet recommendations, narrative, etc.>
```

## 3. Question Refinement Pattern — “Suggest a Better Question”

**Use it when**
- The initial question is ambiguous, broad, or likely to yield superficial results.
- You are unsure what to ask to get the most actionable answer.
- You want the model to improve the query before attempting to answer it.

**How to apply it**
1. Provide the original question and the scope or constraints (e.g., timeframe, industry).
2. Ask the model to produce an improved version that is specific, measurable, and context-aware.
3. Optionally, have the model explain why the refined question is superior.
4. Decide whether to accept the refined question or iterate further.

**Prompt scaffold**
```text
Within the scope of <domain or constraints>, suggest a better version of the following question:
"<original question>"
Explain why your revision will lead to a more useful answer.
```

## 4. Alternative Approaches Pattern — “List the Best Alternatives”

**Use it when**
- A task can be completed in multiple ways and you want to evaluate options.
- You need to compare trade-offs before committing to a single approach.
- You want to surface creative or less obvious solutions.

**How to apply it**
1. Specify the scope or constraints (e.g., budget, tools, timeline).
2. Request multiple approaches and criteria for comparison (pros/cons, risks, effort).
3. Ask for a recommendation or decision matrix if appropriate.
4. Follow up on promising options with deeper analysis or implementation steps.

**Prompt scaffold**
```text
Within the scope of <project or constraints>, list the top <N> alternative ways to accomplish <goal>.
For each approach, include: summary, key advantages, trade-offs, and required resources.
Conclude with guidance on when to choose each option.
```

## 5. Cognitive Verifier Pattern — “Generate Additional Questions”

**Use it when**
- You have a draft answer but want to stress-test its completeness or accuracy.
- The problem space is complex and you might have overlooked critical factors.
- You are preparing for stakeholder review and expect probing follow-up questions.

**How to apply it**
1. Provide the current answer, plan, or reasoning chain.
2. Ask the model to generate questions that would expose gaps or uncertainties.
3. Use the questions to revisit your analysis, gather data, or iterate on the solution.
4. Optionally, have the model answer each verifier question after additional research.

**Prompt scaffold**
```text
Here is my current answer on <topic>:
<insert answer>
Generate <N> additional questions a domain expert would ask to ensure the answer is complete and accurate.
Highlight any assumptions the questions reveal.
```

## 6. Fact Check List Pattern — “List the Facts in the Output”

**Use it when**
- You need traceability of claims for review, compliance, or citation.
- The output will inform decisions that require verified data.
- You plan to manually fact-check each statement or hand it to another reviewer.

**How to apply it**
1. Provide the generated output or summary you want to verify.
2. Ask the model to extract every factual assertion as discrete bullet points.
3. Optionally, request confidence levels or suggested sources for verification.
4. Use the checklist to confirm each fact before publication or implementation.

**Prompt scaffold**
```text
Given the following output, extract every factual claim into a checklist for verification.
For each fact, include a short label and the exact statement.
OUTPUT TO CHECK:
<insert text>
```

## 7. Template Pattern — “Follow This Output Template”

**Use it when**
- You need structured, repeatable output across similar tasks.
- Downstream processes (e.g., spreadsheets, APIs, reports) expect a fixed format.
- Consistency matters more than creativity in the presentation layer.

**How to apply it**
1. Design a template with placeholders for every required element.
2. Provide instructions on how to populate each placeholder and any validation rules.
3. Supply the necessary input data or context.
4. Enforce the template by instructing the model to only respond using it.

**Prompt scaffold**
```text
You must use the following template exactly:
<insert template>
Use the context below to fill every placeholder. If a field is unknown, write "TBD".
CONTEXT:
<insert context>
```

---

### Putting the Patterns Together
- **Discovery → Persona → Execution:** Start with the Flipped Interaction pattern to collect requirements, switch to a Persona for expert reasoning, and finish with the Template pattern for consistent deliverables.
- **Quality Control:** Apply Question Refinement before asking for answers, use Alternative Approaches to explore solutions, and combine Cognitive Verifier with Fact Check List to validate the final output.
- **Automation:** These patterns can be encoded as reusable prompt snippets or functions in agent frameworks, improving reliability and collaboration across teams.

For deeper theory, edge cases, and additional patterns, see Dr. White’s original catalog. It provides empirical context and design rationale for combining patterns effectively in real-world prompt engineering workflows.
