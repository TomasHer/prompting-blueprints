# AI Agent Evaluation: Metrics That Actually Measure Agents

> "An agent can call every tool correctly and still fail the task. Grade the outcome **and** the path it took to get there."

## Intent
- Explain why classic ML metrics (accuracy, precision, recall, F1) don't capture agent quality on their own.
- Define the metrics teams actually ship agents on in 2026: **task completion, trajectory quality, tool-use correctness, tool-call error rate, tool-call recovery rate, and cost & latency per task**.
- Give copy-pasteable measurement recipes and a cheat-sheet so you can wire these into an eval harness (e.g. `promptfoo`) and a CI gate.

## Why it matters
A traditional classifier makes one prediction, so a single-number metric like F1 tells the whole story. An **agent** takes a *sequence* of actions — it reasons, picks tools, passes arguments, reads results, recovers from failures, and eventually produces an outcome. A single accuracy score hides where that sequence went wrong: an agent can reach the right answer through a wasteful, expensive, or unsafe path, or fail the task while every individual tool call looked "correct."

That's why the eval stacks that work in production measure **four things at once**: the *outcome* (did it succeed?), the *trajectory* (was the path good?), *tool use* (were the calls right?), and *cost* (what did it take?). This page covers the metrics under each.

## Why the classic metrics fall short
Accuracy / precision / recall / F1 still appear **inside** agent evals — they're the natural way to score a set of tool calls against a reference set (see *Tool-use correctness* below). What they can't do on their own:

| Classic metric assumes… | …but an agent… |
|---|---|
| One prediction per input | Emits a *multi-step trajectory* of decisions |
| A fixed label to compare against | Often has *many valid paths* to the same goal |
| The output is the whole result | Also incurs *tool errors, latency, and token cost* along the way |
| Deterministic behavior | Is *stochastic* — the same prompt can take different routes |

So keep them, but stop treating them as the scoreboard. The metrics below are the scoreboard.

---

## 1. Task completion (task success / goal accuracy)
**What it measures:** Did the agent actually accomplish the user's goal? This is the top-line, outcome-level metric.

**How to measure it:**
- **Deterministic check** when the goal has a verifiable end-state — a file was written, a row exists in the DB, the returned JSON matches a schema, a test suite passes.
- **LLM-as-a-judge with a rubric** when success is fuzzy ("did it answer the support question helpfully and correctly?"). Grade against the *user intent*, not the final message text.
- Report it as a **success rate** across a golden set of tasks: `tasks_succeeded / tasks_total`.

**Watch for:** partial credit. A binary pass/fail is honest and CI-friendly; a graded rubric (0–1) surfaces "almost there" regressions but needs a validated judge. Prefer deterministic checks wherever the task allows one.

---

## 2. Trajectory quality
**What it measures:** The quality of the *path* — the ordered sequence of reasoning steps and tool calls — not just the final answer. Two agents can both succeed while one takes 3 clean steps and the other flails through 15.

**Reference-based trajectory matching** compares the agent's sequence of tool calls to a ground-truth trajectory. The standard family (used by Google Vertex/Gen AI eval, LangSmith, Strands, and others):

| Metric | Score = 1 when… |
|---|---|
| **Exact match** | Predicted trajectory is identical to the reference — same tool calls, same order, no extras. Strictest. |
| **In-order match** | Contains all reference tool calls in the same relative order; extra calls allowed. |
| **Any-order match** | Contains all reference tool calls in *any* order; extra calls allowed. |
| **Precision** | Fraction of the agent's tool calls that appear in the reference (penalizes wasted/extra calls). |
| **Recall** | Fraction of reference tool calls the agent actually made (penalizes missing steps). |

**Reference-free trajectory scoring** (when there's no single golden path — the common case for open-ended agents): use an LLM judge with a rubric on the full trace — *logical progression, no redundant steps, no back-tracking loops, sound tool choices, efficient ordering*. Also track a plain **step count** / **wasted-step count** as a cheap proxy for efficiency.

**Rule of thumb:** start with any-order match + precision/recall for tasks with a known good path; fall back to a rubric judge for open-ended ones.

---

## 3. Tool-use (tool-call) correctness
**What it measures:** For each tool invocation — was it the **right tool**, with the **right arguments**, at the **right time**? This is where precision/recall/F1 do genuine work, scored over the *set of tool calls* rather than a single label.

Break it into three checks:
1. **Tool selection** — did it choose the correct tool for the sub-goal (vs. a plausible-but-wrong one)?
2. **Argument correctness** — are the parameters well-formed, correctly typed, and semantically right (right file path, right query, right units)?
3. **Timing / necessity** — was the call needed at that point, or redundant?

**How to measure it:**
- **Tool precision** = correct tool calls / all tool calls the agent made.
- **Tool recall** = correct tool calls / tool calls it *should* have made.
- **Tool F1** = harmonic mean of the two.
- For arguments, prefer **deterministic schema/type validation** first, then an LLM judge only for semantic correctness the schema can't catch.

---

## 4. Tool-call error rate
**What it measures:** How often tool invocations *fail* — malformed arguments, schema violations, API 4xx/5xx, timeouts, exceptions. This is an operational-health metric distinct from "was the call the *right* one."

**How to measure it:**
```
tool_call_error_rate = failed_tool_calls / total_tool_calls
```
Segment it by failure type — **agent-side** (bad/invalid arguments, wrong tool, hallucinated tool name) vs. **environment-side** (service down, rate-limited, timeout). Agent-side errors point at prompt/schema/tool-description problems you can fix; environment-side errors point at retry and fallback design.

---

## 5. Tool-call recovery rate
**What it measures:** When a tool call *does* fail, how often does the agent **recover** — retry with corrected arguments, pick a fallback tool, or route around the failure — and still complete the task? Resilience, not just correctness.

**How to measure it:**
```
tool_call_recovery_rate = recovered_failures / total_recoverable_failures
```
Best measured with **fault injection**: deliberately return errors/timeouts from a tool in your test harness and check whether the agent (a) notices the failure, (b) takes a sensible corrective action, and (c) reaches task success. A high error rate paired with a high recovery rate can still be an acceptable agent; a low recovery rate is a reliability red flag regardless of the error rate.

---

## 6. Cost & latency per task
**What it measures:** The operational price of a *completed task* — not per token or per call, but per user-goal, since a single agent task fans out into many model calls and tool calls.

Track per task:
- **Token cost** — input + output tokens (output usually dominates in agent loops), plus reasoning tokens if the model exposes them. Convert to currency using current provider pricing (check the official pricing page — don't hardcode stale numbers).
- **Wall-clock latency** — end-to-end time to task completion, and per-step latency to find bottleneck tools.
- **Step count / tool-call count** — a leading indicator of both cost and latency.

**Why per-task:** two agents with the same success rate can differ 5–10× in cost because one loops, retries, and over-calls tools. Cost and latency are first-class quality metrics for agents, not an afterthought — an agent that's correct but too slow or too expensive isn't shippable.

---

## Putting it together: a minimal eval loop
1. **Build a golden set** of representative tasks. For each, capture the user goal, a success check (deterministic where possible), and — if a good path exists — a reference trajectory.
2. **Run the agent** over the set and log the full trace: every reasoning step, tool call, arguments, tool result, tokens, and timing.
3. **Score each task** on the six metrics: task success, trajectory match/rubric, tool F1, error rate, recovery rate, cost & latency.
4. **Inject faults** on a subset (make a tool fail) to measure recovery rate specifically.
5. **Gate in CI:** set thresholds (e.g. success ≥ 0.9, no drop > 5% vs. baseline, cost per task within budget) and wire the run into a `promptfoo` config so regressions fail the build. See [`promptfoo.yml`](./promptfoo.yml) and the [Models & Evaluations overview](./README.md) for the config scaffolding this repo already ships.

## Metrics cheat-sheet

| Metric | Question it answers | Typical measurement |
|---|---|---|
| **Task completion** | Did it achieve the goal? | Deterministic check or rubric judge → success rate |
| **Trajectory quality** | Was the path good? | Exact / in-order / any-order match, precision/recall, or rubric on the trace |
| **Tool-use correctness** | Right tool, right args, right time? | Tool precision / recall / F1 + schema validation |
| **Tool-call error rate** | How often do calls fail? | `failed / total` calls, segmented by cause |
| **Tool-call recovery rate** | Does it bounce back from failure? | `recovered / recoverable` failures (fault injection) |
| **Cost & latency per task** | What did success cost? | Tokens → $, wall-clock, step count — per task |

## Key takeaway
> **Accuracy tells you *if* the agent was right. Agent metrics tell you *how* — and *at what cost*.**

Ship agents on the full picture: outcome (task completion), path (trajectory), actions (tool-use correctness, error and recovery rates), and economics (cost & latency). Measure all four, gate on them in CI, and you catch the failures a single accuracy number hides.

## Related pages
- [Models & Evaluations overview](./README.md) — the `promptfoo` configs this repo ships.
- [FACTS Benchmark Overview](./facts-benchmark-overview.md) — factuality evaluation dimensions.
- [LLM Lifecycle Monitoring](../04-guides/llm-lifecycle-monitoring.md) — observing models in production.
- [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) — the agent loops these metrics measure.
- [How to Build AI Agents for Production](../02-ai-agents/05-production/how-to-build-ai-agents-production.md) — where evals fit in the delivery path.

## References
- Google Cloud. "Evaluate Gen AI agents (trajectory metrics: exact_match, in_order_match, any_order_match, precision, recall)." [https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-agents)
- LangChain. "How to evaluate your agent with trajectory evaluations (LangSmith)." [https://docs.langchain.com/langsmith/trajectory-evals](https://docs.langchain.com/langsmith/trajectory-evals)
- Confident AI. "LLM Agent Evaluation Metrics: Tool Calling, Task Completion, Reasoning, and Trace-Based Evals." [https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide)
- Strands Agents SDK. "Trajectory Evaluator." [https://strandsagents.com/latest/documentation/docs/user-guide/evals-sdk/evaluators/trajectory_evaluator/](https://strandsagents.com/latest/documentation/docs/user-guide/evals-sdk/evaluators/trajectory_evaluator/)
