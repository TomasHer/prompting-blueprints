---
title: "Mapping the AI-Native SDLC to DX (Core 4 + AI Measurement)"
tags: ["guides", "sdlc", "metrics"]
last_updated: "2026-10-15"
---

# Mapping the AI-Native SDLC to DX (Core 4 + AI Measurement)

## Intent

Connect the lifecycle this repo teaches — the
[AI-Native SDLC](./ai-native-sdlc-playbook.md), where every stage commits an
artifact and humans spend judgment at gates — to the measurement model of
[DX](https://getdx.com), the developer-intelligence platform Atlassian acquired
in 2025.

The two answer different questions and need each other:

- **The SDLC playbook** says *where the work should wait* — at `intent.md`,
  `spec.md`, `plan.md`, review, and the release gate.
- **DX** says *whether the system got better* — speed, effectiveness, quality,
  impact, and what AI adoption actually changed.

This page maps one onto the other, stage by stage, names the metrics DX does not
cover, and gives an **Azure DevOps** setup that makes the mapping measurable.

## Use when

- You are rolling out coding agents and leadership asks "how will we know it worked?"
- Your organization already uses (or is evaluating) DX and you want its dashboards to reflect an agentic workflow, not a 2019 one.
- Your delivery stack is **Azure DevOps** — Boards, Repos (git), Pipelines — rather than GitHub + Jira.
- You read the [10X Developer](./10x-developer-agentic-era.md) metrics section and need to know which of those metrics a vendor platform gives you for free.

---

## The two models in brief

### DX Core 4 — the outcome layer

| Dimension | Key metric | Secondary metrics (examples) |
| --- | --- | --- |
| **Speed** | Diffs per engineer (merged PRs / developer, bot PRs excluded) | Lead time for changes, deployment frequency |
| **Effectiveness** | Developer Experience Index (DXI, survey-based) | Ease of delivery, engagement |
| **Quality** | Change fail percentage | Failed deployment recovery time, perceived quality |
| **Impact** | Time spent on new capabilities | Initiative progress and ROI, revenue per engineer |

### DX AI Measurement Framework — the adoption layer

| Dimension | What it tracks |
| --- | --- |
| **Utilization** | AI tool daily/weekly active users, % of PRs that are AI-assisted, % of committed code that is AI-generated, tasks assigned to agents |
| **Impact** | Direct: AI-driven time savings. Indirect: Core 4 trends before vs. after adoption |
| **Cost** | Licences, usage-based consumption, training — the full ROI picture |

DX's own guidance: **baseline before you roll out**, and combine direct and
indirect measures rather than trusting any single number. Much of the "AI-generated
code" signal is self-reported, so treat it as directional.

---

## Why the mapping matters: the bottleneck moved

The playbook's premise is that agents collapse coding time to hours while
planning, review, and deployment still run at human speed. DX's own 2026 data
points the same way: across 400+ companies, AI adoption rose about **65%** while
median PR throughput rose only about **8%**.

Read together: **if you measure only the Build stage, you will see AI adoption
climb and delivery stay flat.** The mapping below puts a signal on every stage,
so you can see *where* the time went.

---

## The stage-by-stage map

| SDLC stage → artifact / gate | DX signal | Azure DevOps source | Add yourself |
| --- | --- | --- | --- |
| **Plan** → `intent.md` | Impact: time on new capabilities; initiative progress | Boards work-item types and tags (feature vs. bug / maintenance / KTLO) | DXI or custom survey items on requirements clarity — Borg's *intent debt* |
| **Design** → `spec.md` | — (not measured directly) | Commit timestamps of `spec.md` and its approval | Spec-approval wait time |
| **Build** → `plan.md`, diff | Speed: diffs per engineer. AI Utilization: % AI-assisted PRs, tasks assigned to agents | Repos PRs, linked to work items via `AB#<id>` | Split human vs. agent-authored PRs; plan-approval wait time |
| **Test** → tests + evals | Quality: change fail % | Pipelines build and test results | Verification coverage; committed eval scores |
| **Review** → findings + human approval | PR cycle time and review latency | Repos PR timeline (opened → first review → approved → merged) | Share of agent findings resolved vs. waived in `review.md` |
| **Deploy** → release gate | Lead time, deployment frequency | Pipelines runs + Environment approvals and checks | Approval wait time at the release gate |
| **Maintain** → incident record → next `intent.md` | Failed deployment recovery time | An incident source (Azure Monitor, PagerDuty, ServiceNow); Boards bugs as fallback | Count of production-originated intents — does the loop actually close? |

### Cross-cutting rows

| Concern | DX signal | Add yourself |
| --- | --- | --- |
| **Cost** | AI Cost: licences and usage | Cost and latency per agent task (see [Agent Evaluation Metrics](../06-models-and-evaluations/ai-agent-evaluation-metrics-tutorial.md)) — the early warning for [loopmaxxing](../02-ai-agents/01-foundations/loop-engineering.md) |
| **People** | Effectiveness: DXI; AI time savings | Survey items on codebase understanding — Borg's "understanding as a KPI" (*cognitive debt*) |
| **Fleet** | Segmentation by author | One managed identity per agent, so attribution is possible at all — see [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) |

---

## What DX does not give you (and this repo does)

These are the agentic-era metrics from the
[10X Developer guide](./10x-developer-agentic-era.md) and the
[playbook](./ai-native-sdlc-playbook.md). As far as public documentation shows,
none is a native DX metric — ask DX whether they can be ingested as custom data,
or track them alongside.

| Metric | Definition | Why it matters |
| --- | --- | --- |
| **Code survival rate** | % of agent-authored lines still present after 30 / 90 days | Catches generate-then-delete churn that inflates diffs per engineer |
| **Verification coverage** | % of agent output that passes automated gates before a human reviews it | Measures whether quality is enforced by the harness or by tired reviewers |
| **Gate wait times** | Time from `intent.md` / `spec.md` / `plan.md` commit to approval | Locates the moved bottleneck precisely — the automated version of the playbook's ten-PR histogram |
| **Compounding assets** | Count and change rate of rules files, skills, hooks, and evals | The highest-leverage work, invisible to every activity metric |
| **AI leverage ratio** | Verified output shipped per human-hour of direction + review | The closest proxy for "one engineer + agents doing a team's work" |

> **The division of labour:** DX measures the *outcomes* of the lifecycle. The
> committed artifact chain measures the *gates*. You need both to explain why an
> outcome moved.

---

## Making it measurable in Azure DevOps

DX connects to Azure DevOps through separate connectors for **Boards, Repos,
Pipelines, and Pull Commits**, each with its own service account and PAT
(read-only scopes; DX states it does not read source code). The connectors only
see what your conventions put into the data. Five conventions do most of the work:

1. **Give agents their own identities.** One Entra service identity per agent (or at minimum a PR tag such as `agent-authored` and a branch prefix such as `agent/`). Without this, DX cannot split human from agent work and diffs per engineer becomes meaningless.
2. **Link every PR to a work item.** Require `AB#<id>` in PR descriptions via a branch policy. "Time on new capabilities" is computed from work-item classification; unlinked PRs fall out of it.
3. **Classify work items consistently.** Agree which types and tags count as *new capability* vs. *maintenance / KTLO / bug*. This single decision defines the Impact metric.
4. **Commit the artifact chain.** Keep `docs/changes/<id>/intent.md | spec.md | plan.md | review.md` in the repository being changed, as the playbook recommends. Their commit and approval timestamps give you gate wait times from `git log` — no extra tooling.
5. **Make the release gate an Environment approval.** Use Azure Pipelines *Environments → Approvals and checks* for production. The approval record is both the audit trail and the release-gate wait time. See the Azure DevOps section of [CI/CD for AI Agents on Microsoft Foundry](../02-ai-agents/05-production/cicd-ai-agents-microsoft-foundry.md#azure-devops-equivalent).

Before scaling agent use: **take a DX baseline snapshot.** Without one, every
later comparison is a guess.

---

## A dashboard that survives agentic work

Build it in this order — each layer guards against the failure of the one above.

1. **Core 4 at team level, trended** — throughput and stability together (the throughput × quality grid from the [10X guide](./10x-developer-agentic-era.md#the-recommended-scorecard)).
2. **AI Utilization, split by human vs. agent authorship** — adoption without attribution is a vanity number.
3. **PR cycle time broken into wait states** — where the moved bottleneck shows up first.
4. **Gate wait times from the artifact chain** — the upstream half DX cannot see.
5. **Code survival and verification coverage** — the honesty check on Speed.
6. **DXI plus understanding questions** — so the system does not get faster by hollowing out the team.

---

## Copy-ready prompt: draft your measurement plan

```text
You are helping an engineering lead design a measurement plan for an AI-native
software lifecycle, using DX (Core 4 + AI Measurement Framework) on Azure DevOps.

Context:
- Teams: <number and size>
- Agents in use: <e.g., GitHub Copilot agent, Claude Code, Codex>
- Lifecycle stages we run: <e.g., intent.md → spec.md → plan.md → PR → release>
- Current pain: <e.g., review queue, unclear requirements, change failures>

Produce:
## Baseline — which Core 4 metrics to snapshot now, and over what window
## Stage map — for each lifecycle stage: DX metric, Azure DevOps data source, custom metric if DX has none
## Conventions — the identity, tagging, and work-item rules needed for the data to be trustworthy
## Risks — which metrics agents will inflate, and the paired metric that exposes it
## Review cadence — what is looked at weekly, monthly, quarterly, and by whom

Measure teams, not individuals. Flag any metric that is self-reported.
```

---

## Failure modes

| Symptom | Root cause | Fix |
| --- | --- | --- |
| Diffs per engineer jumps, lead time flat | Optimised the stage that was never the bottleneck | Read PR wait states and gate wait times; move effort to planning and review |
| Speed up, change fail % up | Fast-but-fragile quadrant | Pair Speed with Quality on the same chart; add verification coverage |
| "AI-assisted %" high, nobody trusts it | Self-reported or untagged | Enforce agent identities and PR tags; treat surveys as directional |
| Impact metric swings month to month | Inconsistent work-item classification | Fix the type/tag taxonomy before reading the trend |
| Individual leaderboards appear | Activity metrics used for people | Report at team level only, as DX and the 10X guide both recommend |
| No idea what changed after rollout | No baseline | Snapshot before scaling; compare cohorts, not anecdotes |

---

## Related reading in this repo

- [AI-Supported SDLC — Overview and Reading Path](./ai-sdlc-overview.md) — the map of the whole topic; this page is its measurement track.
- [The AI-Native SDLC Playbook](./ai-native-sdlc-playbook.md) — the stages, artifacts, and gates mapped above.
- [The 10X Developer in the Agentic Era](./10x-developer-agentic-era.md) — DORA, SPACE, DX Core 4, and the agentic-era metrics.
- [AI Agent Evaluation Metrics](../06-models-and-evaluations/ai-agent-evaluation-metrics-tutorial.md) — per-task cost, latency, and tool-use metrics.
- [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) — identity and audit, the precondition for attribution.
- [GAISE 2026](../09-conferences/gaise-2026.md) — KPI trees for agentic value (Kuivalainen) and three layers of debt (Borg).

## References

- [DX — A guide to the DX Core 4 metrics](https://help.getdx.com/en/articles/10336040-a-guide-to-the-dx-core-4-metrics)
- [DX — AI Measurement Framework](https://getdx.com/ai-measurement-framework/)
- [DX — Measuring AI code assistants and agents](https://getdx.com/research/measuring-ai-code-assistants-and-agents/)
- [DX — Measuring engineering productivity in the AI era](https://getdx.com/blog/measuring-engineering-productivity-in-the-ai-era/)
- [DX — Azure DevOps connector documentation](https://docs.getdx.com/connectors/azure-devops/)
- [SiliconANGLE — Atlassian acquires developer productivity startup DX](https://siliconangle.com/2025/09/18/atlassian-acquires-developer-productivity-startup-dx-1b/)
- [Anthropic — The AI-Native SDLC playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)
