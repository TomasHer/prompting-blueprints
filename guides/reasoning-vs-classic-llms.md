# Reasoning LLMs vs. Classic GPT-Style LLMs

## Intent
Help prompt engineers decide when to reach for multi-step reasoning models (e.g., OpenAI o3, DeepSeek R1, GPT-5) versus classic completion-focused models (e.g., GPT-4o, Claude 3.5 Sonnet) and adjust their prompting strategy accordingly.

## Quick comparison
| Dimension | Reasoning LLMs ("the planner") | Classic GPT LLMs ("the workhorse") |
| --- | --- | --- |
| Ideal tasks | Complex planning, document synthesis, data relationship analysis, logic-heavy problems | High-throughput drafting, Q&A, summaries, translation, style transfer |
| Strengths | Self-directed multi-step thought, chain-of-thought transparency, resilient to ambiguity | Speed, low latency, low cost, predictable format, stable tone |
| Prompt structure | Minimal scaffolding; invite deliberate reasoning and let model choose tools/steps | Detailed formatting instructions, explicit sections, step-by-step guidance |
| Role framing | Do **not** lock model into narrow roles; provide mission and leave latitude | Assign clear roles ("You are a technical writer…") to align tone and task |
| Output control | Ask for reasoning traces separately from final answer; defer formatting until the end | Specify headers, bullet usage, XML/JSON schema, length, and style requirements |
| Context | Provide background, objectives, and success criteria; model will infer plan | Keep context lean to reduce latency; provide only references necessary for output |

## Prompting reasoning-first models
- **Set objectives, not scripts.** Clarify the goal, constraints, and success definition, then invite the model to reason autonomously. Example: “Map the dependencies between these requirements and produce a project plan.”
- **Surface intermediate thinking.** Request structured deliberation (e.g., "Show a reasoning scratchpad before the final plan") or use tool calls if available.
- **Allow reflection loops.** Encourage the model to check its own plan and revise before delivering the final output.
- **Use fewer rigid tags.** Over-constraining with XML or section headers can interrupt the model’s planner behavior.
- **Leverage for multi-hop work.** Ideal for multi-document synthesis, analytical breakdowns, and math-heavy workflows.

## Prompting classic GPT models
- **Provide crisp instructions.** Outline role, tone, target audience, and deliverable format explicitly.
- **Front-load structure.** Use headings, bullet lists, templates, or XML/JSON schemas when predictable output is required.
- **Focus on single-pass delivery.** Assume the model will respond directly without lengthy deliberation; supply relevant context inline.
- **Optimize for speed.** Favor short prompts and targeted context to keep latency and cost low for high-volume tasks.
- **Great for production templates.** Ideal for customer support replies, marketing copy, drafting, translations, and summarization.

## Decision checklist
1. **Is the task multi-step or ambiguous?** Choose reasoning models when the workflow is unclear or needs planning.
2. **Do you need fast, repeatable formatting?** Choose classic GPT models for templated outputs.
3. **Will you inspect the thinking process?** Reasoning models can expose their chain-of-thought (or hidden scratchpad) for auditing.
4. **Are you cost-sensitive at scale?** Classic models typically deliver lower latency and cost per call.

## Prompt swap example
- **Reasoning model request**
  ```text
  Objective: Produce a remediation plan for the five most severe risks in the attached audit.
  Context: [bullet list of risk summaries]
  Instructions: Think step-by-step to rank risks by business impact, propose mitigation owners, and outline next actions. Provide a planning log, then the final plan.
  ```
- **Classic model request**
  ```text
  You are an IT compliance analyst. Draft a remediation summary email for the five most severe risks.
  Output format:
  - Greeting line
  - Table with columns: Risk, Impact, Owner, Next Step
  - Closing paragraph with timeline reminder
  Use a professional yet approachable tone.
  ```
