# Microsoft Agent Framework Quickstart

## Intent
- Accelerate enterprise-ready agentic applications on Azure using Microsoft's open-source framework.
- Bridge rapid experimentation with reliable production deployments by unifying Semantic Kernel orchestration with AutoGen multi-agent patterns.
- Capture repeatable setup, integration, and governance practices for teams adopting the framework.

## Use when
- You need to connect conversational, workflow, and tool-calling agents to Microsoft 365, Azure data, or line-of-business systems.
- You want to reuse Semantic Kernel skills while taking advantage of AutoGen's cooperative reasoning and planning loops.
- You must satisfy enterprise expectations for observability, security, and responsible AI guardrails before launch.

## Prerequisites
1. **Azure foundation**:
   ```bash
   az login
   az account set --subscription <SUBSCRIPTION_ID>
   az provider register --namespace Microsoft.CognitiveServices
   az provider register --namespace Microsoft.App
   ```
2. **Local environment** (Python 3.10+, Node 18+, Azure Developer CLI):
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash  # if Azure CLI missing
   npm install -g @azure/azure-dev
   python -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   ```
3. **Clone the framework repo and install dependencies**:
   ```bash
   git clone https://github.com/microsoft/agent-framework.git
   cd agent-framework
   pip install -r python/requirements.txt
   npm install --prefix dashboards
   ```
4. **Responsible AI and resource access**: confirm you can provision Azure OpenAI, Azure AI Search, Azure Storage, and Microsoft Graph application permissions as required by your scenario.

## 1. Map the framework foundations
- Microsoft Agent Framework unifies the enterprise-ready foundations of Semantic Kernel with the innovative orchestration of AutoGen, so teams no longer have to choose between experimentation and production.
- The announcement highlights four pillars you should align with your architecture from day one:
  - **Build**: Starter templates, SDKs, and an **OpenAPI-first design** accelerate agent prototyping while enforcing strong prompt hygiene and predictable tool contracts.
  - **Connect**: Native connectors expose Microsoft 365, Azure data sources, and third-party APIs through the **Model Context Protocol (MCP)** so your agents can reuse skills and data sources consistently.
  - **Operate**: Built-in observability, evaluation harnesses, and deployment automation sit on top of a **cloud-agnostic runtime** that can land on Azure, Kubernetes, or your preferred infrastructure.
  - **Govern**: Responsible AI policies, content filters, policy packs, and **Agent-to-Agent (A2A)** collaboration patterns ensure compliance, escalation, and human oversight for sensitive workloads.
- Review the [official overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview) for architectural diagrams, deployment topologies, and platform prerequisites before customizing anything.

## 2. Bootstrap a local agent workspace
1. Scaffold configuration files from the repository samples:
   ```bash
   cp samples/quickstart/appsettings.json.example appsettings.json
   cp samples/quickstart/.env.example .env
   ```
2. Populate secrets for Azure OpenAI (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`), Azure AI Search, storage accounts, and Microsoft Graph OAuth credentials.
3. Run the developer setup scripts to validate the environment:
   ```bash
   azd auth login
   azd config set default.subscription <SUBSCRIPTION_ID>
   make bootstrap
   pytest
   ```
4. Start the local orchestrator to exercise the default agent loop and inspect structured traces:
   ```bash
   python samples/quickstart/run_agent.py --debug
   ```

## 3. Compose cooperative agents
1. Reuse Semantic Kernel skills or planners by registering them inside your agent manifest:
   ```python
   from agent_framework.orchestration import AgentOrchestrator
   from sk import Kernel

   kernel = Kernel()
   kernel.import_skill("/skills/calendar")

   orchestrator = AgentOrchestrator.from_yaml("configs/support.yaml", kernel=kernel)
   ```
2. Attach AutoGen-style collaborators to handle specialized workflows:
   ```python
   from agent_framework.autogen import ConversableAgent

   support_specialist = ConversableAgent(
       name="support_specialist",
       system_message="Own complex troubleshooting, escalate when human review required.",
   )

   orchestrator.register_collaborator(support_specialist)
   ```
3. Inject tool definitions with clear JSON schemas so the runtime can surface deterministic outputs to downstream systems.
4. Capture traces with OpenTelemetry exporters (`OTEL_EXPORTER_OTLP_ENDPOINT`) and push them into Azure Monitor or Application Insights for inspection.

## 4. Integrate enterprise systems
- **Microsoft Graph**: Use the provided OAuth helper scripts in `integrations/graph` to provision app registrations, then enable delegated permissions (Calendars.ReadWrite, Files.ReadWrite.All) for contextual grounding.
- **Azure AI Search**: Follow the ingestion notebooks under `samples/search` to chunk, embed, and publish authoritative documents. Register the search skill in your agent manifest for retrieval-augmented responses.
- **Line-of-business APIs**: Wrap REST or SOAP endpoints as Semantic Kernel skills or AutoGen tools with retry logic, secrets pulled from Azure Key Vault, and structured error messaging.
- **Workflow connectors**: Leverage Azure Functions or Logic Apps triggers to turn agent outcomes into tickets, notifications, or orchestrated processes.

## 5. Evaluate, harden, and ship
1. Run quality gates before production:
   ```bash
   promptfoo test -c evaluations/agent-framework.yml
   python scripts/safety_checks.py
   ```
2. Configure deployment pipelines:
   ```bash
   azd up --environment prod
   az containerapp revision set \
       --name <APP_NAME> \
       --resource-group <RG> \
       --image <ACR_LOGIN>/<IMAGE_TAG>
   ```
3. Enable continuous evaluations using scenario decks stored in Azure DevOps or GitHub Actions workflows so regressions in tool calling or policy compliance are caught early.
4. Document human-in-the-loop processes, escalation paths, and policy waivers for audit readiness.

## 6. Operational checklist
- [ ] Rotate Azure OpenAI, Key Vault, and Graph secrets on an automated schedule.
- [ ] Baseline evaluation prompts and expected outputs; rerun after every prompt or skill change.
- [ ] Configure Application Insights alerts for latency spikes, tool-call failures, and policy violations.
- [ ] Publish runbooks covering agent restart, throttling, and safe-mode fallbacks for operations teams.
- [ ] Maintain an internal changelog for prompt, skill, and connector updates shared with stakeholders.

## References
- Microsoft Foundry, *Introducing Microsoft Agent Framework: the open-source engine for agentic AI apps*. https://devblogs.microsoft.com/foundry/introducing-microsoft-agent-framework-the-open-source-engine-for-agentic-ai-apps/
- Microsoft Learn, *Microsoft Agent Framework overview*. https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview
- Microsoft, *agent-framework GitHub repository*. https://github.com/microsoft/agent-framework
