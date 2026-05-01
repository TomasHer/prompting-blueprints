---
title: "Agent Context Window Performance"
tags: ["agents", "context-engineering", "instruction-following"]
last_updated: "2026-05-01"
---

# Agent Context Window Performance

## Intent

Explain why a larger context window does not automatically improve agent performance, show how poor context engineering causes agents to ignore instructions in files like `AGENTS.md`, and provide actionable strategies for keeping each agent's context small, focused, and reliable.

---

## The Myth: Bigger Context = Smarter Agent

When labs extend a model's context window, they are not giving the agent a bigger brain. They are giving it a bigger desk.

The model's ability to find and follow the right instruction — its **instruction budget** — stays roughly constant regardless of how large the context window grows. What changes is the volume of noise the model must sort through to locate those instructions.

Think of it as needle-in-a-haystack:

- **Needle** = your instructions (system prompt, `AGENTS.md`, tool definitions, guardrails)
- **Hay** = tool results, file contents, reasoning traces, intermediate steps

A 500% bigger haystack with the same-size needle means the model is statistically *less* likely to find and follow every instruction, not more.

> "Everyone writes skills, hooks, and nested AGENTS.md files. Then folks start complaining their agents ignore half the rules anyway."

This is not a bug in agent design. It is a predictable consequence of context growth without context discipline.

---

## The Evidence

### GPT-5.4 — 1M Context Reality Check

OpenAI's own MRCR v2 (8-needle) evals, published March 5, 2026, show how retrieval accuracy collapses at scale:

| Context window range | Needle-in-haystack accuracy |
| :--- | :--- |
| 4–8K | 97.3% |
| 8–16K | ~93% |
| 16–32K | ~97% |
| 32–64K | ~91% |
| 64–128K | 86.0% |
| 128–256K | ~79% |
| 256–512K | 57.5% |
| 512K–1M | 36.6% |

The model loses **40+ percentage points** in the 256K–1M range. At 512K–1M context, the model finds only about one in three needles — a 60% failure rate on a retrieval task, from its own publisher's benchmark.

The "1M context" label is a ceiling, not a recommended operating range.

### ETH Zurich — Evaluating AGENTS.md (arXiv 2602.11988)

Researchers Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, and Martin Vechev (ETH Zurich) conducted the first rigorous empirical study on whether `AGENTS.md` context files actually help coding agents. Their benchmarks:

- **SWE-bench Lite** — 300 tasks from 11 popular Python repositories, paired with LLM-generated context files
- **AGENTbench** — 138 tasks from 12 repositories containing real developer-committed context files

**Key results:**

| Context file type | Effect on task success rate |
| :--- | :--- |
| LLM-generated context files (SWE-bench Lite) | −0.5 pp on average |
| LLM-generated context files (AGENTbench) | −2 to −3 pp depending on model |
| Developer-written minimal context files | Slight improvement |

**Cost impact:** Inference costs increase by **20–23%** when context files are present — agents execute more steps and produce longer reasoning traces, even when those files are hurting task success.

The finding that agents explore *more* while succeeding *less* is a clear signal: the added instructions are not being followed correctly. They are creating noise that triggers additional, often misdirected, exploration.

---

## Why This Happens

### Attention is not uniform

Transformer attention is not distributed evenly across the context. Models attend most strongly to the **beginning** (primacy) and **end** (recency) of the context window. Instructions buried in the middle — including large `AGENTS.md` files — are systematically under-attended at long contexts.

### Training distribution mismatch

Models see far fewer long sequences during pre-training than short ones. Reliability at extreme context lengths is not well-supported by the training distribution, regardless of the technical context limit.

### Instruction density drops

As context fills with tool results, file reads, and reasoning steps, the ratio of *instruction tokens* to *total tokens* falls sharply. The model's effective instruction signal weakens with every additional tool call.

### Conflicting signals compound

When an `AGENTS.md` file adds dozens of requirements and the conversation history adds dozens more constraints, the model resolves conflicts silently — often by ignoring lower-salience rules entirely.

---

## What to Do Instead

The antidote is not a longer `AGENTS.md`. It is **context isolation**.

### 1. Delegate to sub-agents that encapsulate context

Rather than one agent with a 500K-token context, use a hierarchy of focused agents. Each sub-agent receives only the information it needs for its specific task and returns only what matters to the parent.

```
Orchestrator (small, focused context)
    │
    ├─► Code-reading sub-agent  (file contents only)
    ├─► Testing sub-agent       (test runner output only)
    └─► Reporting sub-agent     (summary only)
```

Each agent's context stays small enough for reliable instruction following.

### 2. Use progressive disclosure

Do not dump all context at the start of a session. Inject information just-in-time, when the agent actually needs it.

- Fetch documentation only when a relevant tool is being used
- Load file contents on demand rather than pre-loading the entire repository
- Summarize completed steps before the next phase begins

### 3. Write minimal context files

Based on the ETH Zurich findings, if you maintain an `AGENTS.md` (or `CLAUDE.md`, `CURSOR.md`, etc.):

- Include only **minimal, concrete requirements**: specific tooling commands, test invocation patterns, repo-specific constraints
- Omit general best practices that the model already knows
- Omit LLM-generated boilerplate — it increases cost and decreases performance
- Treat the file as a delta from defaults, not a complete specification

### 4. Set aggressive context warnings

If your agent framework exposes context usage, treat thresholds as circuit breakers:

| Threshold | Action |
| :--- | :--- |
| ~100K tokens | Warn — you are at 10% of a 1M window, but already in degraded territory |
| ~200K tokens | Compact conversation history, summarize completed steps |
| ~400K tokens | Consider spawning a fresh sub-agent with a distilled brief |

The "smart zone" for reliable instruction following is roughly the bottom 10–15% of the technical context ceiling.

### 5. Position critical instructions at boundaries

Because of primacy and recency effects, place your most important constraints at the **very beginning** (system prompt) and **very end** (final user message). Do not rely on mid-context placement for critical rules.

---

## The Takeaway for Agent Builders

| Assumption | Reality |
| :--- | :--- |
| 1M context means 1M reliable tokens | Accuracy drops sharply past ~100K |
| More context = more capable agent | More context = more noise to ignore |
| Detailed `AGENTS.md` improves compliance | LLM-generated context files reduce success rates and raise costs by 20%+ |
| Bigger desk means better thinking | The brain (instruction budget) stays the same size |

The goal is not to fill the context window. It is to keep each context window small, focused, and inside the model's reliable operating range.

---

## References

- [arXiv 2602.11988 — Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988)
- [arXiv 2601.20404 — On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents](https://arxiv.org/abs/2601.20404)
- [DAIR.AI Academy — Does AGENTS.md Actually Help Coding Agents?](https://academy.dair.ai/blog/agents-md-evaluation)
- [InfoQ — New Research Reassesses the Value of AGENTS.md Files for AI Coding](https://www.infoq.com/news/2026/03/agents-context-file-value-review/)
- [OpenAI — GPT-5.4 MRCR v2 8-needle eval results (March 5, 2026)](https://openai.com)
- [02-ai-agents/context-engineering.md](./context-engineering.md)
- [02-ai-agents/ai-agents-overview.md](./ai-agents-overview.md)
- [02-ai-agents/anatomy-of-a-skill.md](./anatomy-of-a-skill.md)
