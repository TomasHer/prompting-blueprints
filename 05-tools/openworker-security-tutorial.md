---
title: "OpenWorker Security Coworkers"
tags: ["tools", "openworker", "security"]
last_updated: "2026-08-26"
---

# OpenWorker Security Coworkers: Shift-Left Security on Your Own Laptop

> [OpenWorker](https://github.com/andrewyng/openworker) is Andrew Ng's MIT-licensed, local-first desktop AI coworker — an agent that "doesn't just chat but completes tasks on your laptop." Version **0.2.0 (24 August 2026)** turned it into a security tool: three built-in **security coworkers** that drive open-source scanners, triage findings against *your* codebase, and ship reviewable fix PRs. Joint work with [@rohitcprasad](https://x.com/rohitcprasad).

## Intent
- Explain what shipped in the security release and why an **open harness** matters differently for security teams than for everyone else.
- Walk the anatomy of a security coworker: persona manifest → skills → risk classes → permission modes → team.
- Get you running three concrete workflows — code review, dependency audit, cloud posture — with copy-ready prompts.
- Show you how to write your own security coworker for the checks your organisation actually cares about.

## Use when
- You have **no dedicated security team** and want a defensible first pass before code reaches production.
- You need scans to run on code that **cannot leave your machine**, or you hit refusals from hosted models on legitimate defensive work.
- You already run semgrep/gitleaks/osv-scanner/trivy in CI and are drowning in findings that nobody triages.
- You want to audit the harness itself — see [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md) for the same instinct applied to skills.

## Why this release matters

Ng's argument in the [announcement](https://x.com/andrewyng/status/2092315079576555806) has three parts, and each is worth separating from the marketing.

1. **Attackers already use AI; the harness is the asymmetry.** Running an agent needs *(i)* a model and *(ii)* a harness — the software around the model. Model access is roughly symmetric between attackers and defenders. The harness is not: a defender's harness can encode approval gates, evidence requirements, and audit trails that an attacker has no reason to build. That is the same ~10%-model / ~90%-harness framing from the [harness engineering primer](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md), applied to security.
2. **Open source is the audit story, not just the licence.** Ng's framing: because the harness is fully open, "security teams can audit it to make sure we haven't built any backdoors that exfiltrate your code and data." A security agent reads every secret, every config, and every private repo you point it at. "Trust us" is a poor answer; a readable `risk.py` is a better one.
3. **Model choice is a security control.** You can run open-weight models fully locally via Ollama, so sensitive code never leaves the machine. Ng also names the awkward part out loud: legitimate defensive work — reproducing a known exploit in order to defend against it — "can trigger refusals in leading closed models." Local weights are the escape hatch. Or bring your own key for OpenAI, Anthropic, Gemini, DeepSeek, GLM, Kimi, Qwen, MiniMax, Mistral, Grok, or Ark; **v0.2.1 (25 August 2026)** added the stealth-preview **Ox Alpha** (1M context, tool-calling) via OpenRouter.

The point of all three is **shift left**: more security work happens before deployment, done by the developers who wrote the code, on hardware they control.

## The three security coworkers

| Coworker | `id` | Scanners it drives | Deliverable |
| --- | --- | --- | --- |
| **Security Coworker** | `security` | semgrep, gitleaks | Triaged findings + focused fix branch/PR per theme |
| **Dependency Audit Coworker** | `dep-audit` | osv-scanner, `npm audit`, `pip-audit`, `trivy fs` | Reachability-ranked advisory table + minimal, test-verified upgrade PR per ecosystem |
| **Cloud Posture Coworker** | `cloud-posture` | trivy config, checkov + **read-only** cloud reads | Exposure-ranked findings + Terraform fix PR with `terraform plan` attached |

They appear in the coworker picker next to the general-purpose ones. All three share the same shape, and it is the shape — not the scanner list — that is the interesting part.

### They drive scanners, they don't replace them

Every one of the three system prompts says a version of the same sentence. From `security`:

> You DRIVE scanners; you don't replace them. Detection comes from proven open-source tools (semgrep, gitleaks); your value is everything a scanner can't do — understanding a finding in the context of this codebase, separating real risk from noise, and fixing it properly.

This is the right division of labour and worth stealing for your own agents. Deterministic tools do detection (reproducible, auditable, no hallucinated CVEs). The model does the three jobs a scanner is structurally bad at: **reachability**, **prioritisation**, and **a fix that matches the surrounding code**.

`dep-audit` states the prioritisation rule bluntly:

> Severity ≠ priority. A medium in a hot path beats a critical in an unused transitive dev dependency — read the code paths before ranking.

### The no-silent-skip rule

The single best idea in the release is an anti-pattern guard in the `security` prompt:

> NEVER silently skip a check because its tool is missing. A check either RUNS, or it is REPORTED as not run, with the reason. […] Dropping a check quietly turns "we couldn't look" into "nothing there" — the worst outcome a security report can produce.

Three fallbacks are prescribed, in order: ask for the tool with `request_tool`; do a manual equivalent and say so; or state plainly that the check was skipped and what that leaves uncovered. Every review then ends with a **Coverage** note — which checks ran, which tool ran them, which were degraded.

The gitleaks fallback is specified concretely: sweep the working tree *and the history* (`git log -p`, plus the contents of deleted env/config files), because "a secret removed from HEAD but alive in history is exactly what this check exists to catch."

And secrets are handled as radioactive: *never* print a discovered secret's value — in output, notes, commits, or PRs. Location and kind only.

## Anatomy of a security coworker

A persona is a directory with `manifest.md`, plus optional `skills/` and `media/`. The manifest is **YAML frontmatter + a Markdown body that is the system prompt** — the same shape as an Agent Skill (see [Anatomy of a Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md)). Personas ship **no executable code**: they can only reference vetted catalog capabilities, connectors, and MCP servers, and the app shows a consent summary before enabling one.

Here is the real `security` manifest frontmatter, unedited:

```yaml
group: security
id: security
name: Security Coworker
icon: shield
tagline: Find and fix security issues — scan, triage, PR
requires_folder: true
subagents: true
version: "1"
tools: [code_files, git, search, shell, todo]
connectors: [github]
skills: [semgrep-review, secret-scan, security-fix-pr]
recommended_models: [anthropic:claude-opus-4-8, openai:gpt-5.6-sol]
default_permission_mode: interactive
description: A code-security reviewer for teams without a security team. Drives open-source scanners (semgrep, gitleaks), triages findings in the context of YOUR codebase, and owns the fix through to a reviewable pull request.
recommends:
  - connector: github
    reason: open focused fix PRs and reference the findings they close
    tier: core
```

Read it as a **capability contract**, and note what is *absent*: no `web_fetch`, no messaging connectors. A code reviewer that cannot post to Slack cannot exfiltrate your findings to Slack. Deny-by-omission is the cheapest control in the file.

The full `PersonaManifest` field set: `id`, `name`, `system_prompt`, `icon`, `tagline`, `description`, `tools`, `requires_folder`, `subagents`, `scheduling`, `messaging`, `connectors`, `team`, `default_permission_mode`, `recommended_models`, `skills`, `mcp`, `version`, `recommends`, `ships`, `group`, `builtin`, `source`.

### Skills: the procedure, loaded on demand

Each security persona ships skills as folders containing a `SKILL.md` with `name` / `description` / `allowed-tools` frontmatter. Loading is **progressive disclosure**: only the catalog (name + description) is injected at session start; the full body arrives via the `load_skill` tool when needed.

The `dependency-audit` skill is a good template for your own — a numbered procedure with the ambiguity removed:

```markdown
---
name: dependency-audit
description: Scan lockfiles for vulnerable dependencies and triage by real reachability
---
1. Identify the ecosystems present (package-lock.json / pnpm-lock.yaml / yarn.lock,
   requirements*.txt / uv.lock / poetry.lock, go.sum, Cargo.lock, pyproject).
2. Pick scanners that are present (check first; ask before installing):
   - `osv-scanner --lockfile <each lockfile> --format json` (best cross-ecosystem)
   - `npm audit --json` / `pip-audit -f json` / `trivy fs --scanners vuln . -f json`
3. Deduplicate advisories across scanners (key on advisory id + package), then triage
   each one by reading the code:
   - Direct or transitive? (`npm ls <pkg>`, `pipdeptree -r -p <pkg>` or grep imports)
   - Is the vulnerable functionality actually used here? Grep for the affected API;
     an unreachable advisory in a dev-only tool is LOW no matter its CVSS.
   - Verdict per advisory: fix-now / fix-soon / accept-with-note, one line of why.
4. Map each fix-now to its smallest closing upgrade …
5. Deliver: an audit table (advisory · package · direct? · reachable? · verdict ·
   smallest fix) ordered by real priority — then hand off to `safe-upgrade-pr`.
```

Two details worth copying into any scanner-driving skill you write: **check the tool exists before invoking it**, and **specify the exact command and output format** so the parsing step is deterministic.

## The permission model

This is the layer you should audit before pointing any of this at a private repo.

### Five risk classes (`coworker/risk.py`)

| Class | Meaning |
| --- | --- |
| `READ` | No side effects — always allowed |
| `EGRESS` | Reaches the network — the request itself can carry data off-machine |
| `WRITE_LOCAL` | Mutates the workspace — path-scoped and mode-gated |
| `EXEC` | Runs commands — mode-gated |
| `EXTERNAL` | Side effects off the machine — routed to the unattended Inbox |

`EGRESS` as a class distinct from `EXTERNAL` is the detail that shows someone thought about agents specifically: a `web_fetch` with your secret in the query string is a data-exfiltration channel even though nothing "external" was written.

`classify()` resolves a tool's risk by precedence: built-in tools by name → connector-catalog floor → user overrides → `requires_approval` metadata → default `READ`. Crucially, **user overrides can relax third-party tools but cannot loosen built-in write/exec/egress tools or connector writes**. Anything not `READ` is "consequential" and goes to the permission engine.

### Six permission modes (`coworker/permissions.py`)

| Mode | Behaviour |
| --- | --- |
| `DISCUSS` | Read-only conversation: no edits, no planning workflow |
| `PLAN` | Read-only + the planning contract (explore → propose_plan → execute) |
| `INTERACTIVE` | Default — asks approval on every consequential action |
| `AUTO_APPROVE` | Interactive + an LLM reviewer that pre-filters routine calls |
| `BYPASS_APPROVALS` | Full access, minus the hard floors (protected settings files) |
| `CUSTOM` | Interactive + auto-allow the config's `auto_allow` tools |

All three security coworkers set `default_permission_mode: interactive`.

**On `AUTO_APPROVE`:** the reviewer "can only turn *ask* into *allow*, never *blocked* into *allow*." It is a convenience layer that keeps a long scan from stalling on approval prompts; it is not a security boundary and cannot widen the hard floors. Use it for a dependency audit that will run 200 read calls. Do not use it for the fix-and-push half.

**Practical stance:** run scans in `PLAN` or `INTERACTIVE`, flip to `AUTO_APPROVE` only for the read-heavy triage pass, and never grant `BYPASS_APPROVALS` to an agent pointed at production credentials.

### Cloud access is read-only by construction

`cloud-posture` is the strictest of the three, and the constraint is in the prompt, not just the UI:

> Maintain strict read-only cloud access — only describe/list/get operations. Never create, modify, delete resources, or execute `terraform apply`.
>
> Fix infrastructure-as-code, never cloud console changes. Code-based fixes prevent drift; console modifications are temporary and fragile.

It also ranks by **exposure**, not CVSS — internet-reachable > cross-account > internal — and is told to validate intent before "fixing" a deliberately public bucket.

## The team pattern: DevSecOps Lead

Beyond the three shipping coworkers, the repo contains an unshipped (`ships: false`) **DevSecOps Lead** persona with `team: lead`. It runs no scans itself. It scopes the attack surface, opens a persistent case file, decomposes work into **falsifiable acceptance criteria**, staffs worker coworkers — **AppSec** (code review + fixes), **Secrets** (working tree *and* git history), **Posture** (IaC + cloud reads) — and verifies evidence at review.

Its operating principle is a good one-liner for any multi-agent setup: **"instruction down, evidence up."** The lead steers only when scope changes; routine status stays on the shared work board. Its tool list is `[code_files, search, todo]` — a coordinator that cannot run a shell. See [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) for the wider pattern.

## Quickstart

**Install.** Download the signed, notarised macOS (Apple Silicon or Intel x64) build, or the Windows 10/11 x64 build (not yet code-signed) from [openworker.com](https://openworker.com). From source:

```bash
git clone https://github.com/andrewyng/openworker
cd openworker
bash packaging/setup_dev_env.sh

# terminal 1 — local agent server
.venv/bin/openworker-server --cwd ~/some/project --port 8765

# terminal 2 — desktop app
cd surfaces/gui
npm install
npm run tauri dev
```

Requires Python 3.10+, Node 20+, and the Rust toolchain.

**Pick a model.** For the fully local path (sensitive code, no refusals on defensive work):

```bash
ollama pull qwen3-coder:30b
```

then point OpenWorker at your Ollama endpoint. For hosted models, the personas recommend `anthropic:claude-opus-4-8` or `openai:gpt-5.6-sol`.

**Install the scanners** the coworkers expect — or don't, and watch the Coverage note tell you exactly what went unchecked:

```bash
brew install semgrep gitleaks trivy        # macOS
pipx install pip-audit checkov
go install github.com/google/osv-scanner/cmd/osv-scanner@latest
```

**Then open a folder** (all three set `requires_folder: true`), pick the coworker, and start.

## Three copy-ready workflows

### 1. Pre-merge code security review

```text
Review this repo for security issues before we ship the payments refactor.
Scope: the diff on branch feat/payments-v2 against main, plus anything it calls into.
Run semgrep and a secret sweep over the working tree AND git history.
Triage every finding for reachability with attacker-controlled input — I want
severity plus one line of why, and I want the noise called noise with a reason.
Fix critical and high only, matching our existing validation helpers.
One branch per theme, a test that fails without each fix, and a Coverage note at the end.
```

### 2. Dependency audit that won't drown you

```text
Audit our dependencies across every lockfile in this repo.
Rank by reachability, not CVSS — I only want to see advisories where the vulnerable
API is actually called from our code. For everything else give me a one-line
accept-with-note.
For each fix-now, find the smallest closing upgrade; only propose a major bump if
nothing smaller closes it, and tell me what the migration costs.
Verify every upgrade against our test suite before you call it done, and add an
osv-scanner CI step so the next batch surfaces on PRs instead of here.
```

### 3. Cloud posture review from Terraform

```text
Review our Terraform under infra/ plus the live AWS account, strictly read-only.
Rank findings by exposure: internet-reachable first, then cross-account, then internal.
Before flagging anything public, check whether it's deliberate — the assets bucket
is meant to be world-readable.
Fix in the IaC, never the console. Give me a branch with the terraform plan attached
and a separate list of what needs a human decision.
```

## The report page pattern

A detail worth stealing wholesale. All three personas are told that chat is a bad container for a long finding list — so **once triage is done and before writing the prose**, they ask with `ask_user` whether you want a report page, *with the headline counts already in the question*:

> "12 findings — 3 critical, 2 high, 5 medium, 2 low. Report page, or just here in chat?"

Say yes and you get one **self-contained HTML file** (inline CSS/JS, no CDN, works offline) written to the agent's scratch directory — never into the repo under review — linked as `[Security review](artifact:reports/security-review.html)`. The spec for the page is specific: a header count strip, collapsible sections by severity, a table filterable by file and severity, evidence behind a chevron rather than dumped inline, and a copy button on every fix.

`dep-audit` adds one sharp instruction: the count strip leads with **reachable**, not raw advisory count — "severity isn't priority." And the page obeys the same secrets rule as chat, for a better reason: "a file gets forwarded and hosted; a value leaked there travels further than one in chat."

## Build your own security coworker

The checks that matter to your organisation are rarely the ones in the box. A persona is a folder — copy this into your personas directory as `manifest.md`:

```markdown
---
group: security
id: pii-review
name: PII Review Coworker
icon: shield
tagline: Find personal data leaving the system — logs, events, exports
requires_folder: true
subagents: true
version: "1"
tools: [code_files, git, search, shell, todo]
connectors: [github]
skills: [pii-sweep]
recommended_models: [anthropic:claude-opus-4-8]
default_permission_mode: interactive
description: Finds personal data flowing into logs, analytics events, error reports,
  and data exports, and fixes it at the source with the codebase's own redaction helpers.
---

You are the PII Review Coworker. You find personal data leaving the system through
channels nobody reviews — log lines, analytics events, error payloads, CSV exports.

How you work:
- Start from the SINKS, not the models: every logger call, event emitter, error
  reporter, and export writer. Trace backwards to what reaches them.
- Classify each hit against our data taxonomy (direct identifier / quasi-identifier /
  special category / not personal) and say which, in one line.
- Fix with the codebase's OWN redaction helpers. If none exists, propose one and
  say so — never scatter ad-hoc masking.
- A field that is fine in a debug log is not fine in a retained analytics event.
  Judge by where the data lands and how long it lives.

Operate safely:
- ALWAYS begin tool-using tasks with todo_write and keep it current.
- NEVER print a real personal-data value you find — field name, file, and line only.
- NEVER inline multi-line scripts in shell commands: write a file, then run it.
- Every review ends with a Coverage note: which sinks were swept, which were skipped,
  and what that leaves uncovered.

Finish with a deliverable: a findings table (sink · field · classification · verdict ·
fix) and one focused branch per theme.
```

The four rules that make the built-in three work, and that you should keep: **narrow the `tools` list to what the job needs**, **name the deliverable**, **forbid printing sensitive values**, and **require a Coverage note**. The Coverage note is what converts an agent's silence from "clean" into "unchecked."

## Honest limits

- **v0.2.x is young.** The 0.2.0 notes bundle real hardening — restricted permissions on secret files, pinned web connections, updated MCP dependencies, fixes for approval handling and workspace trust. Read: bugs were found in exactly the layer you are trusting. Treat it as a strong first pass, not an assurance.
- **A triage verdict is a model's opinion.** "Not reachable" from an agent is a hypothesis with evidence attached, not a proof. The prompts are built to make the evidence checkable — that is the point of the finding tables — so check it on anything critical.
- **Windows builds are not yet code-signed.**
- **Enabling a persona is a supply-chain decision.** Personas ship no executable code and the app shows a consent summary — but a third-party persona still shapes what an agent with `shell` and `git` does inside your repo. Apply the same audit you would to a skill.
- **The privacy claim is only as local as your model.** Local weights via Ollama keep code on the machine. A hosted API key sends it to a vendor. Choose deliberately, per repo.

## Key takeaways

- The harness is the defender's asymmetry — approval gates, evidence requirements, and audit trails are things an attacker has no reason to build.
- **Deterministic tools detect; the model triages and fixes.** Never let an agent invent the finding list.
- **Severity ≠ priority.** Reachability from your own code is the ranking function.
- **A skipped check must be reported as skipped.** Silence is the most dangerous output a security agent can produce.
- Deny-by-omission: the shortest `tools:` list that does the job is a real control.
- `EGRESS` deserves its own risk class — a network read can carry data out.

## References

- [OpenWorker — GitHub repository](https://github.com/andrewyng/openworker)
- [OpenWorker — official site](https://openworker.com)
- [OpenWorker — releases](https://github.com/andrewyng/openworker/releases)
- [Andrew Ng — security release announcement (X, 25 Aug 2026)](https://x.com/andrewyng/status/2092315079576555806)
- [Andrew Ng — original OpenWorker announcement (X, 23 Jul 2026)](https://x.com/AndrewYNg/status/2080333504446108104)
- [MarkTechPost — Andrew Ng Just Released OpenWorker](https://www.marktechpost.com/2026/07/23/andrew-ng-just-released-openworker-an-open-source-local-first-desktop-ai-coworker-that-returns-finished-deliverables-instead-of-chat/)
- Related pages: [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) · [Anatomy of a Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) · [Agent Fleet Governance](../02-ai-agents/01-foundations/agent-fleet-governance.md) · [Test Any Skill Before Installing It](../10-security/test-a-skill-before-installing.md) · [DeepSeek Harness Tutorial](./deepseek-harness-tutorial.md)
