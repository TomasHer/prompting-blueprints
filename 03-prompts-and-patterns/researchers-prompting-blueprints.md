# Researchers Prompting Blueprints

## Intent
Provide academic researchers with ready-to-use prompting patterns that improve clarity, rigor, and collaboration when working with reasoning-focused language models.

## Persona Pattern — "Act as Persona X"

**Use when**
- You need the model to adopt a disciplinary perspective (e.g., ethnographer, statistician) to frame findings accurately.
- Peer-review expectations or venue norms demand a specific voice and level of evidence.
- You want the assistant to maintain methodological guardrails while interpreting your data.

**How to apply it**
1. State the scholarly persona, domain expertise, and research goals that should guide the response.
2. Set boundaries on tone, citation style, or methodological assumptions.
3. Share relevant study context, datasets, or preliminary analyses.
4. Ask for outputs that align with both the persona and your target deliverable (e.g., abstract, reviewer response).

**Blueprint**
```text
Act as <persona> who specializes in <domain>. Maintain a <tone> voice.
Given the following context, provide guidance aligned with this role.
CONTEXT: <insert details>
OUTPUT: <describe format, e.g., bullet recommendations, narrative, etc.>
```

**Example**
```text
From now on, act as a senior academic journal reviewer in the field of computer science. 
When I share my research abstract or methodology, provide feedback as a reviewer would, 
focusing on clarity, novelty, and methodological rigor.
```

## Question Refinement Pattern — "Suggest a Better Question"

**Use when**
- Your initial research question is overly broad or mixes multiple constructs.
- You want help translating a high-level curiosity into a testable hypothesis or study aim.
- You need a clearer prompt before planning data collection, analysis, or literature review.

**How to apply it**
1. Provide the current question, scope, and any methodological or population constraints.
2. Instruct the model to refine the question for specificity, measurability, and theoretical alignment.
3. Request a short rationale for the revision to ensure it fits your research design.
4. Iterate with follow-up refinements until the question is publication-ready.

**Blueprint**
```text
Within the scope of <domain or constraints>, suggest a better version of the following question:
"<original question>"
Explain why your revision will lead to a more useful answer.
```

**Example**
```text
Whenever I ask a question related to designing a research experiment or selecting a methodology, 
suggest a better version of the question that includes relevant variables, constraints, 
or assumptions. Then ask me if I’d like to proceed with your refined version.
```

**Another Example**
```text
Whenever I share a new research idea, ask me 10 detailed questions that will help refine and 
clarify the idea. These questions should cover aspects such as the research problem, objectives, 
methodology, data sources, expected outcomes, and potential limitations. After I answer them, 
use my responses to suggest a more focused and well-structured version of my original research idea.
```

## Alternative Approaches Pattern — "List the Best Alternatives"

**Use when**
- You are comparing experimental designs, sampling strategies, or analytical techniques.
- Funding, data access, or ethical requirements push you to weigh multiple methodological paths.
- You want to surface non-obvious approaches before committing to a protocol.

**How to apply it**
1. Outline the research goal, resources, and guardrails (budget, timeline, IRB constraints).
2. Ask the model to provide several methodological alternatives with comparable metrics.
3. Request pros, cons, risks, and required expertise for each option.
4. Follow up by stress-testing the top candidates with deeper analysis or pilot considerations.

**Blueprint**
```text
Within the scope of <project or constraints>, list the top <N> alternative ways to accomplish <goal>.
For each approach, include: summary, key advantages, trade-offs, and required resources.
Conclude with guidance on when to choose each option.
```

**Example**
```text
Whenever I ask how to analyze my research data, suggest at least two alternative statistical or 
computational methods, compare their strengths and weaknesses in terms of accuracy, 
interpretability, and suitability for small sample sizes, and then ask me which one I’d like to 
explore further.
```

## Fact Check List Pattern — "List the Facts in the Output"

**Use when**
- You are drafting manuscripts, systematic reviews, or grant narratives that require precise sourcing.
- Collaborators need a verification checklist before approving claims or statistics.
- You want to prevent hallucinated citations or unsupported assertions.

**How to apply it**
1. Paste the model-generated section (e.g., literature synthesis, discussion paragraph) you plan to verify.
2. Ask the assistant to extract each factual assertion as a discrete checklist item.
3. Optionally, request confidence levels or suggested primary sources to confirm the facts.
4. Use the list to drive manual verification, annotation, or citation management workflows.

**Blueprint**
```text
Given the following output, extract every factual claim into a checklist for verification.
For each fact, include a short label and the exact statement.
OUTPUT TO CHECK:
<insert text>
```

**Example**
```text
When you generate a literature review summary or suggest related work, include a list of key 
factual claims or references that should be verified for accuracy and relevance to my research 
topic in machine learning. 
```

## Flipped Interaction Pattern — "Ask Me Questions to Achieve X"

**Use when**
- You have a loosely defined research goal (e.g., draft a grant aims page) and need help structuring it.
- The project’s success depends on surfacing tacit knowledge about datasets, collaborators, or constraints.
- You can iterate in real time, supplying clarifications that lead to a rigorous research plan.

**How to apply it**
1. State the scholarly deliverable you are targeting and why it matters (e.g., "develop an NSF-style Broader Impacts section").
2. Direct the assistant to interview you for missing details before drafting any content.
3. Respond to each question with concrete methodological, logistical, or theoretical information.
4. When all questions are answered, request a synthesized output tailored to your target audience (e.g., reviewers, lab team).

**Blueprint**
```text
I am preparing an academic manuscript on <research topic>. Ask me one question at a time to clarify the study's objectives, data, methods, and theoretical framing before writing anything.
After I confirm you have enough detail, draft a structured outline that includes research questions, methodology, expected contributions, and follow-up experiments.
```

**Example**
```text
I would like to create a prompt suitable for reasoning LLM. Topic is suggestions about effective 
prompt engineering techniques for Intent Classification within Customer Service questions. Give me 
a simple list of 10 questions that will help to get enough context to build the right prompt.
```

## References
- Effective Prompts for Reasoning LLMs, GPT Lab. <https://gpt-lab.eu/effective-prompts-for-reasoning-llms/>
