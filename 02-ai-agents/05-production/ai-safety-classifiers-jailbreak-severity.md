---
title: "AI Safety Classifiers & Jailbreak Severity"
tags: ["agents", "production", "safety"]
last_updated: "2026-07-01"
---

# AI Safety Classifiers & Jailbreak Severity

## Intent

Explain how frontier model providers detect and block misuse of powerful AI capabilities (using classifiers, defense-in-depth, and a jailbreak-severity rubric), and show how the same thinking applies when you add your own guardrails to an agent built on top of these models.

## Who this is for

Anyone building or governing agents who needs to reason about misuse risk: what a "safety classifier" actually does, why it sometimes blocks legitimate work, and how to score how bad a given jailbreak really is instead of treating every bypass as equally urgent.

---

## Case study: Anthropic's Fable 5 export-control incident

On 9 June 2026 Anthropic released two models sharing the same underlying weights: **Fable 5** (general availability, heavily safeguarded) and **Mythos 5** (restricted to a small set of trusted partners for defensive cybersecurity, fewer safeguards). On 12 June the US government applied export controls after Amazon researchers found a way to prompt Fable 5 into identifying software vulnerabilities and, in one case, producing exploit code. Because the model provider had no reliable way to verify user nationality in real time, access to both models was suspended globally.

The notable finding, once Anthropic and outside researchers investigated: the bypassed behavior was **not unique to Fable 5**. Every model tested — including weaker ones like Claude Opus 4.8, GPT-5.5, and Kimi K2.7 — could reproduce the same vulnerability identification and exploit demonstration. The report had found a *borderline case in Fable 5's safety margin* (see below), not a uniquely dangerous capability. Anthropic shipped an improved classifier targeting that specific technique (blocking it in >99% of cases) and, after government review, access was restored on 30 June.

This incident is a useful worked example because it surfaces three concepts that generalize to any team shipping AI-powered products: **defense in depth**, the **safety margin**, and a **jailbreak-severity rubric**.

---

## Defense in depth

No single safety mechanism is perfect on its own. Providers layer several, so that a failure in one is caught by another:

| Layer | What it does | Where it fails alone |
|---|---|---|
| Training-time refusals | Model learns to decline dangerous requests | Can be prompted around (jailbroken) |
| Inference-time classifiers | A smaller model scores each request/response for harm and blocks matches | Can miss novel phrasing, or over-block benign requests |
| Retroactive misuse analysis | Pattern-of-use monitoring across many requests over time | Doesn't stop a single harmful request in the moment |
| External red-teaming / bounty programs | Outside researchers actively search for bypasses (e.g. HackerOne) | Only as good as who shows up and what they report |
| Government / partner pre-release evaluation | Independent testing of models and safeguards before wide release | Slow; only covers what's tested |

None of these is sufficient alone. Together, a successful jailbreak has to clear every layer to cause real harm — which is the entire point of stacking them.

**Applying this to your own agent:** if your agent wraps a foundation model with tool access, add your own layer on top of the provider's — e.g., an allowlist of tool calls, a human-approval gate before irreversible actions, and logging/alerting on suspicious request patterns. See the [Production Agent Framework](./how-to-build-ai-agents-production.md) for the full build-out.

---

## The safety margin

Classifiers don't just block clearly harmful requests — they're deliberately tuned to also catch **ambiguous** ones, and even some **probably-benign** ones, to reduce the chance that a real attack slips through:

| Zone | Example | Outcome |
|---|---|---|
| Clearly benign | "Explain what a buffer overflow is" | Allowed |
| Safety margin (probably benign, small harm chance) | "Here's my server code, does it have any auth bugs?" | May be blocked if the margin is wide |
| Ambiguous | "Find vulnerabilities in this codebase" (could be offensive or defensive) | Often blocked |
| Clearly harmful | "Chain these three exploits into a working attack" | Blocked |

Widening the safety margin (blocking more of the "probably benign" zone) catches more real attacks but also produces more **false positives** — legitimate users get refused. This is a deliberate tradeoff, not a bug: Fable 5 shipped with the widest safety margin Anthropic had used to date, accepting more friction on routine coding/debugging tasks in exchange for a much smaller chance a genuinely dangerous request gets through.

**Takeaway:** if you're tuning your own guardrails (prompt-level, classifier-level, or business logic), decide explicitly where you want to sit on the false-positive vs. false-negative tradeoff for each capability — don't let it be an accident of whatever the default threshold happens to be.

---

## Scoring jailbreak severity

Not every successful bypass is equally dangerous. Treating a minor jailbreak with the same urgency as a universal one either wastes response effort or under-reacts to a real threat. Anthropic, with Amazon, Microsoft, Google, and other Glasswing partners, proposed classifying jailbreaks along two dimensions first:

| Class | Definition |
|---|---|
| **Minor** | Breaches the safety margin only — the unlocked behavior is still low-risk |
| **Narrow harmful** | Unlocks one specific harmful behavior, nothing more |
| **Universal** | Unlocks a wide range of harmful behaviors across many prompts |

Then score any given jailbreak on four independent criteria:

| Criterion | Low score | High score |
|---|---|---|
| **Capability gain** | Same result reachable with existing widely available tools | Meaningfully accelerates even a domain expert |
| **Breadth of capability gain** | Works for one narrow target only | Same technique works across many distinct offensive tasks |
| **Ease of weaponization** | Needs skilled prompting and many retries | Works on the first or second try |
| **Discoverability** | Requires specialist knowledge to find | Already widely known/public |

A jailbreak that scores high on all four is the kind that warrants an immediate preliminary mitigation and rapid disclosure; one that scores low on most is a backlog item, not a fire drill.

**Applying this to your own systems:** the same four questions work for triaging *any* reported bypass of your agent's guardrails, not just cybersecurity ones — e.g., a prompt injection that leaks one user's data (narrow, low breadth) is not the same emergency as one that lets an attacker exfiltrate data from any tenant on the first try (universal, high ease of weaponization).

---

## Practical checklist

- [ ] Identify every layer of defense your agent stack actually has (model refusals, your own filters, human review, monitoring) — don't assume the provider's safeguards are your only line of defense.
- [ ] For each guardrail, decide explicitly whether you're optimizing for fewer false positives or fewer false negatives, and document why.
- [ ] When a bypass is reported, score it on capability gain, breadth, ease of weaponization, and discoverability before deciding how urgently to respond.
- [ ] Keep a channel (internal or public, e.g. a bug-bounty program) for people to report bypasses, and route findings to whoever owns that layer of defense.
- [ ] Re-test your own guardrails whenever the underlying model is upgraded — a bypass found on one model version may transfer to others, as the Fable 5 incident showed across completely different providers' models.

---

## References

| Source | What it covers |
|---|---|
| [Anthropic — Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5) | Full incident timeline, safety classifier design, jailbreak severity framework, government collaboration commitments |
| [How to Build AI Agents That Work in Production](./how-to-build-ai-agents-production.md) | HITL gates, guardrail placement, and the full production build-out this page's checklist plugs into |
