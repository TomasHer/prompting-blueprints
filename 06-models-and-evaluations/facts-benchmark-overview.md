# FACTS Benchmark Overview

## Intent
- Summarize why the FACTS Benchmark matters for evaluating LLM factuality.
- Outline the four evaluation dimensions and how to apply them to prompt-engineering workflows.
- Provide quick tips for preparing prompts, evaluation harnesses, and guardrails aligned with the benchmark.

## Why it matters
The FACTS Benchmark is positioned as the industry's first comprehensive factuality test that measures LLM performance across four complementary dimensions—internal model knowledge, web search, grounding to provided sources, and multimodal inputs. It gives prompt engineers and product teams a shared yardstick for diagnosing hallucinations, tuning retrieval behavior, and validating safety policies before shipping models to production.

## Evaluation dimensions at a glance
- **Internal model knowledge**: Tests whether the model can answer fact-based questions from its parameters without external assistance. Use it to gauge baseline recall and to decide where retrieval augmentation is necessary.
- **Web search**: Measures how well the model incorporates up-to-date information found via search. Useful for prompts that rely on recent events or fast-changing data.
- **Grounding**: Checks if responses stay faithful to provided documents, datasets, or snippets. Essential when building retrieval-augmented generation (RAG) and citing workflows.
- **Multimodal inputs**: Evaluates factual accuracy when images, charts, or other media accompany the text prompt. Helps ensure multimodal agents do not over-claim or misinterpret visual cues.

## Applying FACTS in your workflow
1. **Pick the right dimension for your scenario**: Start with internal knowledge to set a baseline, then add web search or grounding tests where freshness or citations are required.
2. **Design prompts for verifiability**: Ask the model to cite sources, quote supporting spans, and separate retrieved facts from speculation to make grading clearer.
3. **Align evaluation data with production tasks**: Mirror your domain (e.g., product docs, policy pages, dashboards) in the grounding and multimodal sets so scores reflect real risk areas.
4. **Automate grading where possible**: Wrap FACTS-style questions into your `promptfoo` or unit-test harnesses so regressions surface early in CI.
5. **Track refusal and uncertainty cues**: Encourage the model to say "I don't know" when evidence is missing; score these separately to avoid pushing the model toward confident hallucinations.

## Prompt and system design tips for higher factuality
- Use **structured outputs** (e.g., bullet lists with citations, JSON fields for claim-evidence pairs) to make automated checks easier.
- **Constrain retrieval scope** by specifying which URLs, document collections, or images the model may reference.
- Include **freshness directives** ("use sources updated after <date>") for web-search prompts and verify timestamps in the answer.
- Add **guardrails for visual content**: request textual descriptions of critical visual features and disallow unstated inferences when handling multimodal inputs.
- Run a **pre-launch checklist**: baseline on internal knowledge, add web-search trials for time-sensitive facts, verify grounding on your corpus, and finish with a multimodal smoke test if your product accepts images.

## References
- DeepMind. "FACTS Benchmark suite: systematically evaluating the factuality of large language models." [https://deepmind.google/blog/facts-benchmark-suite-systematically-evaluating-the-factuality-of-large-language-models/](https://deepmind.google/blog/facts-benchmark-suite-systematically-evaluating-the-factuality-of-large-language-models/)
