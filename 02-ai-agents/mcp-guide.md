# Model Context Protocol (MCP) Guide

## Intent
Equip builders with a quick, copy-ready reference for why MCP matters, how it works, and how to set up a secure MCP stack for assistants and agents.

## Why AI models need MCP
- Models alone cannot pull in fresh data, call external systems, or touch private sources without an intermediary layer.
- MCP lets the **same model** access up-to-date data, interact with external systems, perform real-world actions, and work safely with private data.
- It standardizes how assistants discover tools and data, preventing vendor lock-in while keeping secrets off the model.

## What MCP does
- MCP is an AI protocol introduced by Replit and Anthropic that acts like a USB port for AI apps, providing a universal way to connect AI models and services.
- It offers a standard way to use real-world data and tools through MCP servers (drivers for services) while keeping access secured and auditable.
- MCP clients (e.g., Claude Desktop, Replit AI, VS Code extensions) can load the same server manifests so assistants reuse tools across providers like Claude, GPT, or Llama.

## How MCP works
1. **The model (client)** – Any LLM-backed assistant (Claude, Llama, GPT, etc.) acts as the MCP client that initiates tool and data requests.
2. **The communication layer** – A JSON-based spec (JSON-RPC over stdio or WebSockets) handles structured messages between client and server, including authentication and capability discovery.
3. **The server side** – MCP servers expose tools, resources, and prompts that wrap services such as filesystems, databases, HTTP APIs, observability stacks, or development environments.

### MCP in action
- Make a filesystem or database available so the model can read or write files and table rows.
- Query projects and files for metadata, or make a database available for teaching your assistant.
- Automate system monitoring and alerting by retrieving entries from services like Datadog, then join data from multiple systems to generate insights.
- Access real-time data from a single source of truth; retrieve help desk tickets from Zendesk or Jira; search logs using SQL-like languages.
- Run commands inside Docker, send package manager or HTTP requests, track issues and IT support tasks, edit code, run tests, update dependencies, and clean up languages without leaving the agent.

## Build an MCP yourself
1. **Set up an MCP environment**
   - Replit provides MCP templates for every major language and offers local testing environments to simulate model interactions before deploying.
   - Built-in features support multi-agent development by default, and Claude 3.7 Sonnet Experimental has out-of-the-box MCP support via Replit AI.
2. **Add an MCP server**
   - Choose a template for the tool you want to expose (filesystem, database, HTTP endpoint) and connect it to your data sources.
   - Define available tools (SQL queries, file interactions, search actions, or custom functions) so the client can call them safely.
3. **Customize for your needs**
   - Add authentication and fine-grained permissions to lock down data access and audit usage.
   - Combine multiple servers to represent complex systems, and layer a UI so assistants are human-friendly, intuitive, and accessible.

## Additional MCP facts from the official guide
- **Primitives**: Servers can expose **tools** (actions), **resources** (readable artifacts like files, tables, or docs), and **prompts** (reusable prompt snippets) that the client can enumerate and call dynamically.
- **Portability**: Because MCP relies on manifests and JSON-RPC, the same servers can be shared across development environments, desktops, and cloud agent platforms without rewrites.
- **Security**: Secrets stay within the MCP server boundary; clients request capabilities instead of sending raw keys, supporting least-privilege access.
- **Extensibility**: Official templates cover common backends (Postgres, HTTP, Git, filesystem, browser automation), and the spec permits custom transports as long as they honor the JSON-RPC contract.

## Microsoft MCP for Beginners highlights
- **Lesson-based learning path**: The Microsoft MCP for Beginners repository structures MCP onboarding as short lessons that build from core concepts to hands-on builds.
- **Concept-to-practice flow**: Each lesson pairs the protocol fundamentals (clients, servers, tools/resources/prompts, transports) with practical lab-style exercises.
- **Multi-language samples**: Examples are provided in multiple programming languages so teams can adopt MCP in their existing stacks.
- **End-to-end workflows**: The guide walks through configuring servers, wiring clients, and validating interactions so newcomers can run MCP locally before deploying.
> Looking for a narrated walkthrough? Microsoft also offers a 2-hour **MCP for Beginners** YouTube playlist that complements the lesson-based guide with video explanations and demos.

> Prefer a narrated walkthrough before building? Watch Pamela Fox's three-part Microsoft Reactor series on **Python + MCP: Building MCP servers with FastMCP** (with a YouTube fallback link) to see FastMCP setup, manifest design, and end-to-end server testing.

## 12 MCP servers to try in 2025
| MCP server | What it does |
| --- | --- |
| File System Server | Gives the LLM direct access to the local file system to read, write, and create directories. |
| GitHub MCP Server | Connects Claude to GitHub repositories and allows creating files and directories. |
| Slack MCP Server | Uses the Slack API to automate tasks within Slack workspaces. |
| Google Maps MCP Server | MCP Server for the Google Maps API. |
| Docker MCP Server | Integrates with Docker to run commands and manage containers. |
| Brave MCP Server | MCP Server for the Brave browser with Brave's API. |
| PostgreSQL MCP Server | Lets an LLM manage PostgreSQL database tables for CRUD operations. |
| Google Drive MCP Server | Retrieves files and metadata from Google Drive. |
| Redis MCP Server | MCP Server integrates with Redis databases to store and retrieve data. |
| Notion MCP Server | MCP Server for the Notion API allowing you to work with Notion workspaces. |
| Stripe MCP Server | MCP Server to work with Stripe payment APIs to automate billing and management. |
| Perplexity MCP Server | MCP Server for the Perplexity Search API enabling RAG for answers. |

## References
- Replit. “Everything you need to know about MCP.” https://blog.replit.com/everything-you-need-to-know-about-mcp
- Microsoft. “MCP for Beginners.” https://github.com/microsoft/mcp-for-beginners
- Microsoft. “MCP for Beginners (2-hour course playlist).” https://m.youtube.com/playlist?list=PLlrxD0HtieHjYfVUpGl_-ai7D6FRBjV-d
- Microsoft Reactor (Pamela Fox). “Python + MCP: Building MCP servers with FastMCP” (3-part guided intro). https://developer.microsoft.com/en-us/reactor/events/26542/ and https://www.youtube.com/live/_mUuhOwv9PY
