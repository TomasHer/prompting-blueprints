---
title: "Evidence-Based Skill Design"
tags: ["agents", "claude-agent", "skills", "research"]
last_updated: "2026-08-23"
---

# Evidence-Based Skill Design

## Intent

Use this guide to design agent skills against measured evidence instead of intuition. It distils *Demystifying Agent Skills: Why They Work — Until They Don't* (arXiv 2608.14036, 8,135 trial records across Terminal-Bench 2, Terminal-Bench-Pro, and SkillsBench) into six design rules, a distillation runbook, and copy-ready prompts.

For skill anatomy and file structure see [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md). For structural patterns see [Skills Design Patterns](./skills-design-patterns.md). For validation see [Skills Testing and Iteration](./skills-testing-iteration.md).

---

## What the study actually measured

The researchers held the task and the source experience fixed, then varied only *how that experience was packaged*. Three arms, same 528 (task, setting) triples:

| Arm | What the agent receives | Success rate |
|---|---|---|
| **Raw** | No prior experience | 59.1% |
| **Workflow Memory** | Raw, noisy execution logs from past runs | 55.9% |
| **Skill** | A standardised `SKILL.md` distilled from those same runs | 61.9% |

Paired bootstrap deltas (95% CI, 1,000 iterations):

| Comparison | Mean delta | 95% CI | Significant? |
|---|---:|---|---|
| Skill vs Workflow Memory | **+6.06 pts** | [+0.76, +11.36] | **Yes** |
| Skill vs Raw | +2.84 pts | [−2.27, +7.95] | No |
| Workflow Memory vs Raw | −3.22 pts | [−8.14, +2.08] | No |

**Read this carefully before you build anything.** The proven result is that a distilled skill beats *dumping raw logs into the prompt*. Skills beating *no memory at all* did not reach significance. Raw log injection was, if anything, worse than nothing.

> **Rule 0 — Earn the skill.** If you are not already injecting prior experience, a skill is an unproven bet. If you *are* injecting raw traces, distilling them is the highest-confidence upgrade in the paper.

---

## Rule 1: Write runbooks, not tutorials

The authors coded 240 trajectories into twelve skill-use modes and labelled *how* each skill helped. The mechanism distribution for the skill arm:

| Mechanism | Count | Share |
|---|---:|---|
| Procedural anchor (which steps, in which order) | 347 | **65.7%** |
| Counterproductive | 87 | 16.5% |
| Failure warning | 64 | 12.1% |
| Explicit knowledge injection (facts the model lacked) | 24 | **4.5%** |
| No identifiable mechanism | 6 | 1.1% |

Skills stabilise *action*, they do not fill knowledge gaps. A 14× gap between procedural anchoring and knowledge injection means the content that pays is the ordered checklist — setup steps, tool sequence, intermediate checks, recurring pitfalls.

**Do**

```markdown
## Steps
1. Locate independent awaits: `rg "await fetch" app/`
2. Convert independent awaits to `Promise.all` — start promises early, await late.
3. Re-run the latency check before touching anything else.
```

**Don't**

```markdown
## Background
`Promise.all` accepts an iterable of promises and resolves when all of them
resolve. It is generally faster than sequential awaits because...
```

The model already knows what `Promise.all` is. It needs to be told to *reach for it here, now, in this order*.

---

## Rule 2: Optimise for execution robustness, not reasoning

Skills fixed a specific, narrow class of failures. Net mode deltas, skill vs raw (modes fixed minus modes introduced, out of 528 triples):

| Failure mode | Net effect | Verdict |
|---|---:|---|
| Environment / infrastructure failure | **+27** | Best case for a skill |
| Output-format or schema mismatch | **+22** | Strong |
| Background-service lifecycle failure | +8 | Strong |
| Shell / code corruption (heredocs, regex escaping) | +6 | Good |
| Algorithmic logic error | +3 | Negligible |
| Static verification without runtime | −6 | Skill does not help |
| Timeout / budget exhaustion | −18 | Skill makes it worse |
| Skill guidance misapplied or ignored | **−48** | Skill *causes* this |

Environment-infrastructure failures fell from 28/528 in the raw arm (5.3%) to 1/528 with skills (0.2%). But execution-and-verification modes still account for 23.5% of skill-arm labels — down from 37.3% raw, not eliminated.

> **Rule 2 in practice.** Scope skills at wiring, setup, tool invocation, output shape, and service lifecycle. Do not expect a skill to fix a wrong algorithm or a missing verification strategy — those are model-capability and harness problems.

---

## Rule 3: Annotate outcomes when you distil from traces

The paper's sharpest ablation. The same trajectory pools were distilled twice: once with success/failure labels visible to the skill generator ("normal"), once with them hidden ("no-hint"). For Gemini on Terminal-Bench 2 with three successful and two failed source traces (`3s2f`):

| Condition | Success rate |
|---|---:|
| Normal (outcome labels visible) | **74.62%** |
| No-hint (labels withheld) | 40.00% |

Without labels the generator cannot separate signal from noise, and hallucinations plus dead ends get baked permanently into the skill library.

The gap widens as failed traces enter the pool. At `0s5f` — five failures, zero successes — skills regress against raw in 28 of 88 settings (versus 13 fixed). **A skill distilled only from failures is worse than no skill.**

The two generator prompts differ by exactly two instructions. This is the entire ablation:

| | Normal | No-hint |
|---|---|---|
| Analysis instruction | "Failure modes that appeared (if any failed traces are included)" | "Failure signals and mitigations inferred from observable evidence in traces" |
| Rule | "If failed traces are included, extract their failure patterns into the *Common Failure Modes* section." | "Do not assume whether any trace is successful or failed unless the evidence supports it." |

> **Rule 3 in practice.** Never hand a distillation model an unlabelled trace pool. If your traces have no verdict attached, get one — a deterministic verifier if you have it, an LLM-as-a-judge if you don't — before distilling.

---

## Rule 4: Budget for the invocation failure you are creating

A skill is not self-executing. The agent must still decide whether it applies, which parts to follow, how to adapt it, and when to abandon it. That decision is a new failure surface:

| Arm | `skill_guidance_misapplied_or_ignored` |
|---|---:|
| Skill | **10.0%** |
| Raw | 0.8% |
| Workflow Memory | 0.4% |

Skills also *introduced* timeout/budget exhaustion 20 times while fixing it twice — an over-specific runbook makes agents grind through steps that no longer fit the task.

Mitigations that follow directly from the taxonomy:

- **State applicability, then non-applicability.** A `Use This Skill When` list is half the job; add the negative case.
- **Give an abandon condition.** "If the verification in step 4 fails twice, stop following this skill and report."
- **Keep steps adaptable.** Use placeholders, never task-specific paths or data — the study's own generator prompt enforces this rule.
- **Do not over-specify.** Every hard-coded step is a chance for the agent to follow it into a wall.

---

## Rule 5: Gate retrieval by domain, then by trigger

Growing the catalogue breaks retrieval long before it breaks success. Averaged across noise compositions:

| Pool size | Embedding top-1 precision | Actual-use precision (parsed from execution) |
|---:|---:|---:|
| 5 | 88.3% | 29.6% |
| 100 | 76.9% | **3.3%** |

Downstream success stayed roughly flat at 36–39%. Exact ground-truth invocation is "neither sufficient nor necessary" — a *related* skill still supplies useful procedural scaffolding, which is why success holds up while precision collapses.

The composition breakdown is the part the headline numbers hide. Embedding precision at pool size 100:

| Distractor composition | Precision |
|---|---:|
| Random noise | 84.1% |
| Dissimilar noise | 93.2% |
| **Semantically similar noise** | **53.4%** |

Pool size is not the problem — **semantic confusability** is. A hundred unrelated skills are cheap; ten near-duplicates are expensive.

**Two-level gating pattern:**

```text
Level 1 — domain bucket
  An LLM router assigns the task to one bucket (frontend / backend / data / infra).
  Only that bucket's skills become candidates.

Level 2 — strict trigger
  Inside the bucket, a skill is retrieved only when a rigid condition fires:
  an exact error string ("Connection refused"), a file glob, a failing check name.
```

Then audit the catalogue itself: if two descriptions would embed near-identically, merge them or make their trigger conditions mutually exclusive. See [Skills Testing and Iteration](./skills-testing-iteration.md) for the under/over-triggering fixes this feeds into.

---

## Rule 6: Price the skill

Skills are not free context. On 83 matched tasks:

| Arm | Success | Tokens per task |
|---|---:|---:|
| Skill | 69.6% | 521.5K |
| Workflow Memory | 64.8% | 426.2K |
| Raw | 64.1% | — |

Skills bought ~4.8 points over workflow memory for ~22% more tokens. They did, however, run *faster* (median 161s vs 173s workflow vs 259s raw) — the anchoring cuts wandering even as it adds prompt weight.

---

## The distillation runbook

A reproducible loop, mirroring the paper's pipeline:

1. **Collect traces with verdicts.** Run the agent on representative tasks; keep both successes and failures, each with its verifier outcome attached.
2. **Balance the mix.** Aim for mostly-success pools. The study's best results cluster at `5s0f`–`3s2f` (5:0 to 3:2 success:failure); everything degrades at `0s5f`.
3. **Distil with outcomes visible** (prompt below).
4. **Enforce the runbook shape** — ordered steps, failure modes, verification.
5. **Test triggering and function** per [Skills Testing and Iteration](./skills-testing-iteration.md).
6. **Measure against both baselines** — no-skill *and* raw-trace injection. The paper's own comparison is only meaningful because it ran all three arms.
7. **Re-audit the catalogue** for semantic confusability whenever you add a skill.

### Copy-ready distillation prompt

Adapted from the study's `skill_generator_system_prompt.txt`:

```text
You are a skill generator. Given one or more execution traces from an agent
completing a task — each labelled SUCCESS or FAILURE — produce a single
reusable skill file that captures the repeatable process.

Analyse the traces to identify:
- What repeatable process was performed
- The distinct steps, in order
- What tools, commands, and libraries were used
- Common patterns across traces
- Failure modes that appeared in the FAILURE traces

Write the skill in this format:

---
name: {skill-name}
description: {one-line description, including when NOT to use it}
---

# {Skill Name}

## Use This Skill When
- {condition}

## Do Not Use This Skill When
- {counter-condition}

## Preconditions
- {what must be true before starting}

## Steps
1. {concrete, actionable step}

## Common Failure Modes To Avoid
- {failure mode: signal and mitigation}

## If A Failure Happens
1. Stop and inspect the latest output.
2. Map the error to the failure modes above and apply the fix.
3. Re-run verification before finishing.
4. If verification fails twice, abandon this skill and report.

## Verify
- {how to confirm success}

Rules:
- Produce exactly ONE skill, not multiple.
- Generalise beyond the exact task in the traces.
- Steps must be concrete and actionable, not vague.
- If traces show different approaches, pick the most reliable one.
- Extract FAILURE-trace patterns into "Common Failure Modes".
- Do not include task-specific file paths or data — use placeholders.
```

---

## Audit checklist

Run this against any existing skill:

- [ ] Is it a **runbook** (ordered steps) rather than a tutorial (facts)?
- [ ] Does it target **setup, tool sequencing, output shape, or service lifecycle** — not algorithm choice?
- [ ] Were the source traces **labelled** success/failure before distillation?
- [ ] Was the source pool **majority-success**?
- [ ] Does it state when **not** to apply, and when to **abandon**?
- [ ] Are paths and data **placeholders**, not hard-coded?
- [ ] Does its description **embed distinctly** from every neighbouring skill?
- [ ] Is it reachable through a **domain bucket plus a strict trigger**, not a flat vector search?
- [ ] Has it been measured against **both** no-skill and raw-trace baselines?

---

## Key takeaways

- The demonstrated win is **distilled skill over raw log injection** (+6.06 pts). Skill over no-memory-at-all is not statistically established.
- Skills work as **procedural anchors** (65.7%), not knowledge stores (4.5%).
- **Outcome labels are load-bearing** when failed traces enter the pool: 74.62% vs 40.00%.
- Skills create a **new 10% invocation-failure surface** — write applicability and abandon conditions.
- **Semantic confusability**, not catalogue size, is what breaks retrieval (53.4% vs 93.2% precision at the same pool size).
- Skill use is a **lifecycle problem** — generation, retrieval, and adaptation — not a one-shot memory injection.

---

## References

- [Demystifying Agent Skills: Why They Work — Until They Don't (arXiv 2608.14036)](https://arxiv.org/abs/2608.14036)
- [Demystifying Agent Skills — code and artifacts (GitHub)](https://github.com/zhiyuanjiang04/demystify-agent-skills)
- [Demystifying Agent Skills — project website](https://zhiyuanjiang04.github.io/demystify-agent-skills/)
- [SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (arXiv 2602.12670)](https://arxiv.org/abs/2602.12670)
- [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md)
- [Skills Design Patterns](./skills-design-patterns.md)
- [Skills Testing and Iteration](./skills-testing-iteration.md)
- [Claude Building Skills Guide](../../04-guides/claude-building-skills-guide.md)
