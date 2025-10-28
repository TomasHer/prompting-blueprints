# Experiment with AI on Requirements Engineering Datasets

## Intent
Equip AI researchers and requirements engineers with a repeatable path for using open datasets to prototype, benchmark, and iterate on AI-assisted requirements engineering workflows.

## Use when
- You want to validate a new prompting technique or agent workflow for requirements engineering tasks.
- You need reproducible corpora to compare AI-assisted requirement analysis, classification, or synthesis approaches.
- You plan to report experimental results and require transparent dataset sourcing.

## Prerequisites
- Access to the [LLM4RE Requirements Engineering Datasets collection](https://nlp4se.github.io/LLM4RE-Datasets/).
- Tooling to run or call your AI models (e.g., Python notebooks, evaluation harnesses, or hosted LLM APIs).
- Clear research questions covering tasks such as requirement classification, ambiguity detection, or traceability recovery.

## Step 1 — Select a dataset and task focus
1. Review the LLM4RE catalog for datasets that align with your research topic (e.g., user stories, regulatory requirements, or issue trackers).
2. Note the licensing and attribution requirements for each dataset to ensure downstream publication compliance.
3. Map each dataset to AI capabilities you want to probe, such as fine-tuning foundations, RAG over requirements repositories, or zero-shot prompting baselines.

## Step 2 — Frame AI experimentation goals
- Identify measurable outcomes (precision/recall, defect discovery rate, reviewer agreement) that demonstrate AI impact on requirements work.
- Draft a baseline workflow that mirrors current human processes to serve as a comparison point.
- Document hypotheses about how AI assistance should change the workflow (faster triage, higher-quality requirement rewrites, clearer trace links).

## Step 3 — Prepare prompts, agents, and evaluation harnesses
1. Curate representative requirement samples that match your chosen dataset split (train/validation/test) or create cross-validation folds.
2. Design prompts or agent instructions that specify role, constraints, and expected output format for the requirement task.
3. Configure automated evaluations (e.g., `promptfoo`, custom scripts) to score outputs for structure, coverage, or stakeholder alignment.

## Step 4 — Run experiments and capture evidence
- Iterate on prompts or model parameters while logging dataset version, configuration, and runtime environment.
- Collect both quantitative scores and qualitative reviewer notes to surface edge cases that need manual adjudication.
- Store generated artifacts (prompt revisions, confusion matrices, synthesized requirements) alongside dataset identifiers for reproducibility.

## Step 5 — Summarize findings and next actions
1. Highlight which datasets best surfaced strengths or gaps in your AI approach.
2. Outline follow-up experiments, such as cross-dataset validation or human-in-the-loop reviews, to mature the workflow.
3. Capture open questions or dataset limitations so future collaborators can extend the study.

## References
- LLM4RE. *Requirements Engineering Datasets*. https://nlp4se.github.io/LLM4RE-Datasets/
