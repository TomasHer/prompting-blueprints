---
title: "CI/CD for AI Agents on Microsoft Foundry"
tags: ["guides", "microsoft-foundry", "cicd", "github-actions", "azure-devops", "agentops", "evals"]
last_updated: "2026-05-25"
---

# CI/CD for AI Agents on Microsoft Foundry

## Intent
Show platform and AI engineering teams how to ship AI agents to production on **Microsoft Foundry** with the same rigour they use for application software: source control, evaluation-driven quality gates, multi-environment promotion (Dev → Test → Prod), and enterprise governance — implemented as either a GitHub Actions workflow or an Azure DevOps pipeline.

## Use when
- You have built an agent (hosted container or declarative prompt) and need a repeatable, reviewable path to production.
- You need to enforce **eval thresholds** (hallucination, task completion, latency) as merge/deploy gates, not just dashboards.
- You want one pipeline shape that works for **containerised hosted agents** and **declarative prompt-based agents**.
- You operate in an enterprise that requires approval gates, OIDC-based federated identity, and auditable artifacts.

## Why this matters
Building an AI agent is the easy half. Shipping it reliably is where most teams stall: prompts drift, models version-shift, regressions land in production silently, and there is no single artifact to roll back to. Microsoft Foundry is Microsoft's AI app and agent factory — a managed platform with a first-class agent runtime and built-in lifecycle management — so the missing piece is a pipeline that treats an agent version like any other deployable artifact, with evaluation as the merge gate.

This guide adapts the reference architecture published in the Microsoft Tech Community post [*CI/CD for AI Agents on Microsoft Foundry*](https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218) and the companion repository [`leestott/foundry-cicd`](https://github.com/leestott/foundry-cicd).

---

## Agent types you can ship with this pattern

| Agent type | What it is | CI/CD implication |
|---|---|---|
| **Containerised hosted agent** | Custom code packaged as a Docker image, hosted in Foundry. Full control over tools, frameworks, memory. | Adds a Docker build + push to Azure Container Registry (ACR) step before deployment. |
| **Declarative prompt-based agent** | An `agent.yaml` + prompt definition deployed to the Foundry runtime — no container. | Skip the Docker build step. The "artifact" is the validated YAML/prompt set plus the evaluation report. |

The pipeline shape is the same. Only the build step differs.

---

## Reference architecture (five layers)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Source             GitHub / Azure Repos                  │
│    └─ agent.yaml, prompts, src/, tests/, eval/, Bicep IaC   │
├─────────────────────────────────────────────────────────────┤
│ 2. CI Build & Validate                                      │
│    ├─ lint (ruff)  ├─ security (bandit)                     │
│    ├─ validate agent.yaml + prompts                         │
│    ├─ pytest unit/ + tools/                                 │
│    └─ az acr build  →  ACR (hosted agents only)             │
├─────────────────────────────────────────────────────────────┤
│ 3. CI Evaluation Gate                                       │
│    ├─ run golden_set.jsonl against Foundry endpoint         │
│    └─ enforce thresholds (hallucination, task, p95 latency) │
├─────────────────────────────────────────────────────────────┤
│ 4. CD Promotion        Dev  →  Test/QA  →  Production       │
│    ├─ deploy agent version per environment                  │
│    ├─ tighter eval thresholds at each stage                 │
│    └─ approval gates + smoke tests                          │
├─────────────────────────────────────────────────────────────┤
│ 5. Runtime & Observability                                  │
│    Foundry project + Azure Monitor / App Insights traces    │
└─────────────────────────────────────────────────────────────┘
```

Each layer is owned by a different role in practice: developers commit to layer 1, the CI system handles layers 2–3, release managers approve layer 4 transitions, and SRE owns layer 5.

---

## Repository layout

Mirror this layout so the pipeline scripts have predictable paths:

```text
.
├── agent.yaml                  # declarative agent definition (prompts, tools, model)
├── Dockerfile                  # hosted agents only
├── requirements.txt
├── requirements-eval.txt
├── src/                        # agent source (tools, handlers)
├── tests/
│   ├── unit/                   # pytest unit tests
│   ├── tools/                  # tool-level integration tests
│   └── smoke/                  # post-deploy smoke tests
├── eval/
│   ├── datasets/
│   │   ├── golden_set.jsonl    # CI gate dataset
│   │   └── scenario_set.jsonl  # Test/QA scenario + safety dataset
│   └── results/                # artifacts written by the pipeline
├── scripts/
│   ├── validate_agent_config.py
│   ├── run_evaluations.py
│   ├── check_eval_gates.py
│   ├── deploy_agent.py
│   ├── promote_agent.py
│   └── enable_agent_endpoint.py
└── .github/workflows/  OR  azure-pipelines.yml
```

---

## Authentication: federate, don't store keys

Both pipelines use **OIDC / Workload Identity Federation** to obtain short-lived Azure tokens — no long-lived client secrets in CI. The minimum setup is:

1. Create an Entra ID **app registration** (or user-assigned managed identity).
2. Add a **federated credential** trusting the GitHub repo + branch/environment (or the Azure DevOps service connection).
3. Assign Azure RBAC: `AcrPush` on the registry, `Azure AI Developer` on each Foundry project, plus read on the resource group.
4. Store only **non-secret IDs** (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`) — no secret value is needed for OIDC.

For Foundry SDK calls you still need a per-environment **`FOUNDRY_CONNECTION_STRING_*`** stored in the secret vault of the platform you use (GitHub Environments / Azure DevOps variable groups).

---

## GitHub Actions: the four-stage pipeline

Place the file at `.github/workflows/foundry-cicd.yml`. The four jobs (`ci-build-validate` → `ci-evaluate` → `cd-deploy-dev` → `cd-deploy-test` → `cd-deploy-prod`) share variables defined once at the top.

### Triggers and top-level configuration

```yaml
name: AI Agent CI/CD - Microsoft Foundry

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      target_env:
        description: 'Target environment (dev / test / prod)'
        required: true
        default: 'dev'
        type: choice
        options: [dev, test, prod]

permissions:
  id-token: write   # required for OIDC / Workload Identity Federation
  contents: read

env:
  AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
  AZURE_RESOURCE_GROUP:  ${{ vars.AZURE_RESOURCE_GROUP }}
  ACR_REGISTRY:          ${{ vars.ACR_REGISTRY }}
  FOUNDRY_ENDPOINT:      ${{ vars.FOUNDRY_ENDPOINT }}
  AGENT_NAME:            ${{ vars.AGENT_NAME }}
```

`id-token: write` is the line that makes OIDC work — without it, `azure/login@v2` cannot exchange the workflow token for an Azure access token.

### Stage 1 — CI Build & Validate

```yaml
jobs:
  ci-build-validate:
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.tag.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: tag
        run: echo "tag=${{ github.sha }}" >> "$GITHUB_OUTPUT"

      - uses: actions/setup-python@v5
        with: { python-version: '3.12', cache: pip }
      - run: pip install -r requirements.txt

      - run: pip install ruff && ruff check .
      - run: pip install bandit && bandit -r src/ -ll
      - run: python scripts/validate_agent_config.py --config agent.yaml

      - run: pytest tests/unit/  -v --tb=short
      - run: pytest tests/tools/ -v --tb=short
        env:
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_API_KEY:  ${{ secrets.AZURE_OPENAI_API_KEY }}

      # ---- Hosted agents only: build + push image to ACR ----
      - uses: azure/login@v2
        with:
          client-id:       ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id:       ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}
      - run: |
          az acr build \
            --registry ${{ env.ACR_REGISTRY }} \
            --image    "${{ env.AGENT_NAME }}:${{ steps.tag.outputs.tag }}" \
            --file     Dockerfile .
```

For a declarative prompt-based agent, omit the last two steps — the validated `agent.yaml` is your artifact.

### Stage 2 — Evaluation gate

The evaluation step is what makes this an *agent* pipeline rather than a generic app pipeline. The job runs a curated dataset against a fresh Foundry deployment and **fails the build if quality drops below the threshold**.

```yaml
  ci-evaluate:
    needs: ci-build-validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12', cache: pip }
      - run: pip install -r requirements-eval.txt

      - uses: azure/login@v2
        with:
          client-id:       ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id:       ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Run evaluation suite
        run: |
          python scripts/run_evaluations.py \
            --dataset  eval/datasets/golden_set.jsonl \
            --output   eval/results/results.json \
            --endpoint ${{ env.FOUNDRY_ENDPOINT }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING }}

      - name: Enforce quality gates
        run: |
          python scripts/check_eval_gates.py \
            --results eval/results/results.json \
            --max-hallucination   0.05 \
            --min-task-completion 0.90 \
            --max-latency-p95     4000

      - uses: actions/upload-artifact@v4
        with:
          name: eval-report-${{ github.sha }}
          path: eval/results/
```

The eval report is uploaded on every run, pass or fail — when the gate fails you need the report to triage.

### Stage 3 — Deploy to Dev (auto)

```yaml
  cd-deploy-dev:
    needs: ci-evaluate
    runs-on: ubuntu-latest
    environment: dev
    outputs:
      agent_version: ${{ steps.deploy.outputs.agent_version }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12', cache: pip }
      - run: pip install azure-ai-projects azure-identity
      - uses: azure/login@v2
        with:
          client-id:       ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id:       ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - id: deploy
        run: |
          VERSION=$(python scripts/deploy_agent.py \
            --env              dev \
            --image            "${{ env.ACR_REGISTRY }}/${{ env.AGENT_NAME }}:${{ needs.ci-build-validate.outputs.image_tag }}" \
            --foundry-endpoint ${{ vars.FOUNDRY_ENDPOINT_DEV }} \
            --agent-config     agent.yaml)
          echo "agent_version=$VERSION" >> "$GITHUB_OUTPUT"
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_DEV }}

      - run: |
          pytest tests/smoke/ -v \
            --endpoint ${{ vars.FOUNDRY_ENDPOINT_DEV }} \
            --agent-version ${{ steps.deploy.outputs.agent_version }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_DEV }}
```

The `agent_version` returned by `deploy_agent.py` is the single ID promoted unchanged through Test and Production — no rebuilds.

### Stage 4 — Test/QA (approval + tighter gates)

```yaml
  cd-deploy-test:
    needs: cd-deploy-dev
    runs-on: ubuntu-latest
    environment: test           # required reviewers configured in GitHub Environments
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12', cache: pip }
      - run: pip install azure-ai-projects azure-identity
      - uses: azure/login@v2
        with:
          client-id:       ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id:       ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - run: |
          python scripts/promote_agent.py \
            --from-env       dev \
            --to-env         test \
            --agent-version  ${{ needs.cd-deploy-dev.outputs.agent_version }} \
            --foundry-endpoint ${{ vars.FOUNDRY_ENDPOINT_TEST }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_TEST }}

      - run: |
          python scripts/run_evaluations.py \
            --dataset  eval/datasets/scenario_set.jsonl \
            --output   eval/results/test-results.json \
            --endpoint ${{ vars.FOUNDRY_ENDPOINT_TEST }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_TEST }}

      - run: |
          python scripts/check_eval_gates.py \
            --results             eval/results/test-results.json \
            --max-hallucination   0.03 \
            --min-task-completion 0.95 \
            --max-latency-p95     3000
```

Notice the **thresholds tighten** in Test: 3 % hallucination ceiling, 95 % task completion, 3 s p95 — and a richer `scenario_set.jsonl` that includes safety prompts the golden set does not cover.

### Stage 5 — Production (manual approval, no eval re-run)

```yaml
  cd-deploy-prod:
    needs: cd-deploy-test
    runs-on: ubuntu-latest
    environment: production    # required reviewers + wait timer in GitHub Environments
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12', cache: pip }
      - run: pip install azure-ai-projects azure-identity
      - uses: azure/login@v2
        with:
          client-id:       ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id:       ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - run: |
          python scripts/promote_agent.py \
            --from-env       test \
            --to-env         prod \
            --agent-version  ${{ needs.cd-deploy-dev.outputs.agent_version }} \
            --foundry-endpoint ${{ vars.FOUNDRY_ENDPOINT_PROD }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_PROD }}

      - run: |
          python scripts/enable_agent_endpoint.py \
            --agent-version ${{ needs.cd-deploy-dev.outputs.agent_version }} \
            --foundry-endpoint ${{ vars.FOUNDRY_ENDPOINT_PROD }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_PROD }}

      - run: |
          pytest tests/smoke/ -v \
            --endpoint ${{ vars.FOUNDRY_ENDPOINT_PROD }} \
            --agent-version ${{ needs.cd-deploy-dev.outputs.agent_version }}
        env:
          AZURE_AI_PROJECTS_CONNECTION_STRING: ${{ secrets.FOUNDRY_CONNECTION_STRING_PROD }}
```

Production does **not** re-run the full eval suite — that already passed in Test. Instead, it runs smoke tests against the live endpoint to confirm the deployment succeeded and traffic flows.

---

## Azure DevOps equivalent

The same lifecycle maps to four stages in `azure-pipelines.yml`: `CI`, `DeployDev`, `DeployTest`, `DeployProd`. Three things change relative to GitHub:

- **Variable groups** replace GitHub Environments for per-environment secrets (`foundry-global`, `foundry-dev`, `foundry-test`, `foundry-prod`).
- **Environments + Approvals and Checks** replace GitHub's required reviewers.
- **`AzureCLI@2`** with a service connection replaces `azure/login@v2`. Use a *Workload Identity Federation* service connection so you stay credential-less.

The skeleton:

```yaml
trigger:
  branches: { include: [main, develop] }
  paths:    { exclude: ['**/*.md'] }

variables:
  - group: foundry-global
  - name: pythonVersion
    value: '3.12'
  - name: imageTag
    value: $(Build.SourceVersion)

stages:
- stage: CI
  jobs:
  - job: Build
    pool: { vmImage: ubuntu-latest }
    steps:
      - task: UsePythonVersion@0
        inputs: { versionSpec: $(pythonVersion) }
      - script: pip install -r requirements.txt
      - script: pip install ruff && ruff check .
      - script: pip install bandit && bandit -r src/ -ll
      - script: python scripts/validate_agent_config.py --config agent.yaml
      - script: pytest tests/unit/ tests/tools/ --junitxml=junit/results.xml
      - task: PublishTestResults@2
        inputs: { testResultsFormat: JUnit, testResultsFiles: 'junit/*.xml' }
      - task: AzureCLI@2
        inputs:
          azureSubscription: $(AZURE_SERVICE_CONNECTION)
          scriptType: bash
          scriptLocation: inlineScript
          inlineScript: |
            az acr build --registry $(ACR_REGISTRY) \
              --image "$(AGENT_NAME):$(imageTag)" --file Dockerfile .

  - job: Evaluate
    dependsOn: Build
    steps:
      - script: pip install -r requirements-eval.txt
      - task: AzureCLI@2
        inputs:
          azureSubscription: $(AZURE_SERVICE_CONNECTION)
          scriptType: bash
          scriptLocation: inlineScript
          inlineScript: |
            python scripts/run_evaluations.py \
              --dataset eval/datasets/golden_set.jsonl \
              --output  eval/results/results.json \
              --endpoint $(FOUNDRY_ENDPOINT)
        env: { AZURE_AI_PROJECTS_CONNECTION_STRING: $(FOUNDRY_CONNECTION_STRING) }
      - script: |
          python scripts/check_eval_gates.py \
            --results eval/results/results.json \
            --max-hallucination 0.05 --min-task-completion 0.90 --max-latency-p95 4000

- stage: DeployDev
  dependsOn: CI
  variables: [{ group: foundry-dev }]
  jobs:
  - deployment: DeployAgentDev
    environment: 'foundry-dev'
    strategy:
      runOnce:
        deploy:
          steps:
            - task: AzureCLI@2
              name: DeployAgent
              inputs:
                azureSubscription: $(AZURE_SERVICE_CONNECTION)
                scriptType: bash
                scriptLocation: inlineScript
                inlineScript: |
                  VERSION=$(python scripts/deploy_agent.py \
                    --env dev \
                    --image "$(ACR_REGISTRY)/$(AGENT_NAME):$(imageTag)" \
                    --foundry-endpoint $(FOUNDRY_ENDPOINT_DEV) \
                    --agent-config agent.yaml)
                  echo "##vso[task.setvariable variable=agentVersion;isOutput=true]$VERSION"
            - script: |
                pytest tests/smoke/ -v \
                  --endpoint $(FOUNDRY_ENDPOINT_DEV) \
                  --agent-version $(DeployAgent.agentVersion)
```

`DeployTest` and `DeployProd` follow the same `deployment` + `environment` pattern with progressively stricter gates. Configure required approvers on the `foundry-test` and `foundry-production` environments in the ADO UI; the YAML doesn't enforce approvals on its own.

The full ADO file is in [`leestott/foundry-cicd/azure-devops-pipeline.yml`](https://github.com/leestott/foundry-cicd/blob/main/azure-devops-pipeline.yml).

---

## Evaluation-driven quality gates

This is the part most teams skip. Without it, a pipeline is a deployment pipeline, not an AI agent pipeline.

### Three metrics, three thresholds, three datasets

| Metric | What it catches | Typical Dev gate | Typical Test gate |
|---|---|---|---|
| **Hallucination rate** | Outputs unsupported by retrieved context or tool results. | ≤ 5 % | ≤ 3 % |
| **Task completion rate** | The agent reached the user-visible goal without manual intervention. | ≥ 90 % | ≥ 95 % |
| **Latency p95** | Tail responsiveness — the failure mode users actually feel. | ≤ 4 000 ms | ≤ 3 000 ms |

`check_eval_gates.py` is the enforcer — it returns a non-zero exit code when any threshold is breached, which fails the pipeline.

### Dataset hygiene

- **Golden set** (`golden_set.jsonl`) — small (50–200 items), versioned, hand-curated. Runs on every CI build. Cheap and fast.
- **Scenario set** (`scenario_set.jsonl`) — larger, includes adversarial and safety prompts. Runs only after deployment to Test.
- Both datasets are committed to the repo and reviewed in PRs. A change to the golden set is a change to your acceptance criteria; treat it that way.

### Why thresholds tighten across environments
Dev catches obvious regressions cheaply. Test catches the long tail. Loosening gates in Dev lets developers iterate fast; tightening them in Test prevents quietly-degraded agents from reaching users.

---

## Multi-environment promotion: one artifact, three projects

The cardinal rule: **build once, evaluate, then promote the same artifact**.

- For a hosted agent, the artifact is the **ACR image tag** (`agent_name:<git-sha>`).
- For a declarative agent, the artifact is the **agent version ID** returned by Foundry's deploy API.

`promote_agent.py` does not rebuild — it copies the existing version into the next Foundry project and registers it under the same version ID. This is what makes rollbacks trivial: redeploy any previous version ID, no rebuild required.

Each environment is a **separate Foundry project** with its own connection string, RBAC, and budget. Treat them as you would dev/staging/prod resource groups.

---

## Required secrets and variables

| Name | Type | Scope | Notes |
|---|---|---|---|
| `AZURE_CLIENT_ID`, `AZURE_TENANT_ID` | Secret | Repo / Vault | OIDC app registration. No client secret needed. |
| `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP` | Variable | Repo / Vault | Non-secret. |
| `ACR_REGISTRY`, `AGENT_NAME` | Variable | Repo / Vault | Used to tag images. |
| `FOUNDRY_ENDPOINT_DEV` / `_TEST` / `_PROD` | Variable | Per environment | Foundry project endpoint URLs. |
| `FOUNDRY_CONNECTION_STRING_DEV` / `_TEST` / `_PROD` | Secret | Per environment | Used by the Azure AI SDK. |
| `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY` | Secret | CI only | Only if tool tests depend on Azure OpenAI directly. |

Never commit any of these. The pipeline files in the reference repo intentionally reference them through `${{ secrets.* }}` and `$(var)` so the YAML itself stays publishable.

---

## Step-by-step setup checklist

1. **Provision Foundry projects** (Dev/Test/Prod) — usually via Bicep or Terraform, in separate resource groups. Capture each connection string.
2. **Create the Entra ID app registration** and add federated credentials for the GitHub repo (subject `repo:<org>/<repo>:environment:dev` etc.) or the ADO service connection.
3. **Grant RBAC**: `AcrPush` on the registry, `Azure AI Developer` on each Foundry project.
4. **Configure environments**:
   - GitHub: create `dev`, `test`, `production` Environments. Add required reviewers and a wait timer on `production`. Store per-env secrets here, not at repo scope.
   - Azure DevOps: create `foundry-dev`, `foundry-test`, `foundry-production` Environments and `foundry-{global,dev,test,prod}` Variable Groups. Add Approvals and Checks to the Test and Prod environments.
5. **Commit the agent skeleton** with the layout above, including a small `golden_set.jsonl` (start with 20–50 hand-curated items).
6. **Drop in the workflow file** (`.github/workflows/foundry-cicd.yml` or `azure-pipelines.yml`) from the reference repo.
7. **Push a branch** and verify the CI stage runs green. Tune linting and eval thresholds *before* enabling auto-deploy to Dev.
8. **Enable promotion** by merging to `main` — the first end-to-end run will surface any missing secrets or RBAC gaps.

---

## Governance and audit

What the pipeline gives compliance and risk owners for free:

- **One immutable artifact per release** (image tag or agent version ID) — auditable in ACR and the Foundry project.
- **Eval report artifact** uploaded on every CI run, retained per the platform's artifact retention policy. This is the evidence that "version X met thresholds Y on date Z".
- **Approval logs** for Test and Production transitions (GitHub Environments / ADO Environments both record approver and timestamp).
- **No standing credentials**: OIDC means there are no long-lived secrets to rotate or leak.
- **Branch protections** on `main` plus required status checks (`ci-build-validate`, `ci-evaluate`) ensure no agent version reaches Dev without a passing eval.

Bicep / ARM templates for the Foundry project, ACR, and Log Analytics workspace should live in the same repo so the runtime topology is version-controlled alongside the agent.

---

## Limitations and pitfalls

- **Flaky model behaviour can flap your gates**. Use deterministic settings (`temperature=0`, fixed seed where supported) in eval runs. If non-determinism is intrinsic, switch to N-of-M thresholds rather than absolute pass/fail on a single run.
- **Eval datasets rot**. Schedule a quarterly review — the team that wrote them six months ago has different expectations now.
- **Smoke tests are not eval tests**. They assert "the endpoint responds and the version ID matches", not quality. Don't conflate them.
- **Containerised agents accumulate image bloat**. Add an ACR retention policy; the SHA-tagged images otherwise grow without bound.
- **Connection strings are environment-scoped secrets**. A single shared connection string across environments collapses the whole promotion model — do not take that shortcut.

---

## When you don't need this

If you are shipping a single declarative prompt-based agent to a single environment, a manual `az` CLI deploy on merge to main is probably enough. Adopt this pipeline when you have at least two environments, a team of more than one, or any compliance requirement that asks "how do you know this version is good?".

---

## References
- [CI/CD for AI Agents on Microsoft Foundry — Microsoft Tech Community](https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218)
- [`leestott/foundry-cicd` — reference pipelines and architecture](https://github.com/leestott/foundry-cicd)
- [GitHub Actions workflow YAML](https://github.com/leestott/foundry-cicd/blob/main/github-actions-pipeline.yml)
- [Azure DevOps pipeline YAML](https://github.com/leestott/foundry-cicd/blob/main/azure-devops-pipeline.yml)
- [What is Microsoft Foundry Agent Service? — Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)
- [Baseline Microsoft Foundry Chat Reference Architecture — Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/baseline-microsoft-foundry-chat)
- [From Zero to Hero: AgentOps — End-to-End Lifecycle Management for Production AI Agents](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/from-zero-to-hero-agentops---end-to-end-lifecycle-management-for-production-ai-a/4484922)
- Related in this repo: [How to Build AI Agents That Work in Production](./how-to-build-ai-agents-production.md) · [LLM Lifecycle Monitoring Guide](../../04-guides/llm-lifecycle-monitoring.md) · [Microsoft Agent Framework Quickstart](../../05-tools/microsoft-agent-framework.md)
