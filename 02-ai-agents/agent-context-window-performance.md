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

Researchers Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, and Martin Vechev (ETH Zurich, SRI Lab) conducted the first rigorous empirical study on whether `AGENTS.md` context files actually help coding agents. They tested four agents — **Claude Code (Sonnet-4.5)**, **Codex (GPT-5.2)**, **Codex (GPT-5.1 mini)**, and **Qwen Code (Qwen3-30b-coder)** — against two benchmarks:

- **SWE-bench Lite** — 300 tasks from 11 popular Python repositories, paired with LLM-generated context files
- **AGENTbench** (their new benchmark) — 138 tasks from 12 repositories, drawn from 5,694 real GitHub pull requests, all containing developer-committed context files

**Key results:**

| Context file type | Effect on task success rate |
| :--- | :--- |
| LLM-generated (SWE-bench Lite) | −0.5 pp on average |
| LLM-generated (AGENTbench) | −2 to −3 pp (5 of 8 evaluation settings degraded) |
| Developer-written, minimal (AGENTbench) | +4 pp on average |

**Cost impact:** Inference costs increase by **19–23%** regardless of file quality — both LLM-generated and human-written context files trigger this overhead.

**The "too obedient" trap:** Agents closely follow every instruction in context files, even when those instructions are irrelevant to the task at hand. This produces more test runs, more file traversals, more grep searches, and longer reasoning chains — none of which translate to higher task success. Agents do more work and solve fewer problems. This is not a failure of instruction following; it is instruction following working exactly as designed, applied to the wrong instructions.

---

## Why This Happens

There are two distinct but related failure modes. Both lead to the same outcome: agents that don't do what you expect.

### Failure mode 1 — Attention degradation at long contexts

Transformer attention is not distributed evenly across the context. Models attend most strongly to the **beginning** (primacy) and **end** (recency) of the context window. Instructions buried in the middle are systematically under-attended, and this effect worsens as context grows.

Models also see far fewer long sequences during pre-training than short ones, so reliability at extreme context lengths is not well-supported by the training distribution — regardless of the technical context limit.

As a session fills with tool results, file reads, and reasoning steps, the ratio of *instruction tokens* to *total tokens* falls sharply. Rules the agent followed at turn 3 may be silently dropped by turn 30.

### Failure mode 2 — Over-instruction compliance ("too obedient" agents)

The ETH Zurich paper identifies a subtler problem: agents that follow instructions *too well*. When a context file contains bloated or redundant guidance, a well-trained coding agent executes every line of it — even when those instructions add no value for the specific task. The agent becomes thorough in the wrong direction.

LLM-generated context files are the worst offenders because they largely restate information already present in README files or inferable from the codebase structure. They consume context budget and trigger extra agent work without providing actionable signal.

The two modes can compound: a bloated `AGENTS.md` exhausts context budget early, pushing critical later instructions into the low-attention middle zone.

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

- **Aim for under ~300 lines.** Shorter, more targeted files correlate with better (or at least non-degraded) agent performance.
- Include only what is **non-inferable from the codebase itself**: specific build commands, custom test invocation, non-obvious environment setup.
- Omit general best practices — the model already knows them and following redundant reminders wastes tokens and agent steps.
- **Never use LLM-generated context files** as-is. They restate README content and inflate cost without improving task success.
- Treat the file as a delta from defaults, not a complete specification.

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
