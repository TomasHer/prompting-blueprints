<img src="../assets/google/google_cloud_platform.png" alt="Copilot Agent Builder" width="80%">

# Google Cloud Agent Development Kit (ADK) Quickstart

## Intent
- Rapidly prototype, evaluate, and deploy Google Cloud agentic workflows.
- Combine the Agent Development Kit with Google Cloud services (Vertex AI, Cloud Run, Firestore).
- Provide a repeatable recipe for adapting the official [ADK documentation](https://google.github.io/adk-docs/) to production use cases.

## Use when
- You want to orchestrate tool-calling agents that blend Gemini models with Google Cloud data and APIs.
- You need a guided path from local development to managed deployment.
- You are evaluating the [agent-starter-pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) or the official [ADK Python samples](https://github.com/google/adk-python).

## Prerequisites
1. **Project + billing**: Enable billing on a Google Cloud project with the Vertex AI, Cloud Run, Firestore, and Secret Manager APIs.
2. **CLI + auth**:
   ```bash
   gcloud auth login
   gcloud config set project <YOUR_PROJECT_ID>
   gcloud services enable aiplatform.googleapis.com run.googleapis.com firestore.googleapis.com secretmanager.googleapis.com
   ```
3. **Local environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install --upgrade google-generativeai google-cloud-aiplatform google-cloud-firestore google-cloud-secret-manager
   ```
4. **Repository clone** (pick one):
   ```bash
   # Starter pack with Terraform, Cloud Workflows, and CI helpers
   git clone https://github.com/GoogleCloudPlatform/agent-starter-pack.git

   # Lightweight Python SDK samples
   git clone https://github.com/google/adk-python.git
   ```

## 1. Understand the ADK building blocks
- **Agent**: A Vertex AI-enabled orchestrator that reasons about tasks and routes calls.
- **Tools**: Functions (Python or Cloud Functions) annotated with the ADK tool decorator so the agent can call them.
- **Sessions**: Persisted conversation state managed by the ADK runtime (in Firestore by default).
- **Runnables**: Building blocks in the Python SDK that let you sequence prompts, tool invocations, and evaluators.
- **Deployments**: Managed endpoints (Cloud Run or Vertex AI Endpoints) that host the agent for external callers.

Map these pieces before you start coding so your prompts, data sources, and guardrails align.

## 2. Scaffold a local agent
1. Change into the starter pack and copy the sample environment file:
   ```bash
   cd agent-starter-pack
   cp .env.sample .env
   ```
2. Populate required variables:
   - `PROJECT_ID`, `REGION`: Deployment target.
   - `VERTEX_AGENT_MODEL`: e.g., `gemini-1.5-pro-002`.
   - `FIRESTORE_COLLECTION`: Conversation storage collection name.
3. Install dependencies and run unit tests:
   ```bash
   pip install -r requirements.txt
   pytest
   ```
4. Start the local emulator to iterate quickly:
   ```bash
   python main.py --debug
   ```
   Use the debugger output to inspect tool calls and context.

## 3. Add custom tools with the ADK Python SDK
1. Create a `tools/weather.py` file in your repo:
   ```python
   from adk import tool

   @tool()
   def get_weather(city: str) -> str:
       """Return a short weather summary for the given city."""
       # Replace with a real API call.
       return f"Weather in {city}: 21°C, partly cloudy."
   ```
2. Register the tool inside your agent definition (for example `agents/support.py`):
   ```python
   from adk import Agent
   from tools.weather import get_weather

   support_agent = Agent(
       name="support_agent",
       instructions="You are a helpful support concierge.",
       tools=[get_weather],
   )
   ```
3. Run an interactive session:
   ```python
   from adk.session import LocalSession

   session = LocalSession(agent=support_agent)
   response = session.send("What's the weather in Berlin?")
   print(response.text)
   ```
4. Confirm that the debug logs show the tool call and the formatted response.

## 4. Deploy to Google Cloud Run
1. **Prepare artifacts**:
   - Dockerize the agent (`Dockerfile` provided in the starter pack).
   - Store secrets (API keys, service accounts) in Secret Manager.
2. **Build + push**:
   ```bash
   gcloud builds submit --tag gcr.io/${PROJECT_ID}/support-agent
   ```
3. **Deploy**:
   ```bash
   gcloud run deploy support-agent \
       --image gcr.io/${PROJECT_ID}/support-agent \
       --region=${REGION} \
       --set-env-vars=PROJECT_ID=${PROJECT_ID},REGION=${REGION} \
       --allow-unauthenticated
   ```
4. **Connect Firestore**: Run the included Terraform (`infra/main.tf`) or manual commands to create the database in Native mode.
5. **Smoke test**: Send a request to the deployed endpoint using the sample `curl` script or the provided Postman collection.

## 5. Add guardrails and evaluations
- **Prompt policies**: Encode safety rules and escalation triggers directly in the agent instructions.
- **Content filters**: Enable Vertex AI safety settings or integrate the Sensitive Content API.
- **Telemetry**: Use Cloud Logging + Cloud Monitoring dashboards from the starter pack to review latency and failure rates.
- **Regression tests**: Adapt the `tests/evaluations` examples to assert tool-call structure, safety disclaimers, and JSON schemas.

## 6. Operational checklist
- [ ] Rotate service account keys and secrets regularly.
- [ ] Back up Firestore data and set retention policies.
- [ ] Set up Error Reporting alerts for unhandled exceptions.
- [ ] Document each tool's quota usage and failure modes.
- [ ] Share prompt change logs with stakeholders before deployment.

## References
- Google, *Agent Development Kit Documentation*. https://google.github.io/adk-docs/
- Google Cloud Platform, *Agent Starter Pack Repository*. https://github.com/GoogleCloudPlatform/agent-starter-pack
- Google, *ADK Python Repository*. https://github.com/google/adk-python
