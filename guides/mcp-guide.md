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

## 12 MCP servers to try in 2025
| MCP server | What it does | Learn more |
| --- | --- | --- |
| File System Server | Gives the LLM direct access to the local file system to read, write, and create directories. | https://modelcontextprotocol.io/servers/file-system |
| GitHub MCP Server | Connects assistants to GitHub repositories so they can create files and folders. | https://modelcontextprotocol.io/servers/github |
| Slack MCP Server | Uses the Slack API to automate tasks within Slack workspaces. | https://modelcontextprotocol.io/servers/slack |
| Google Maps MCP Server | Wraps the Google Maps API for map search and retrieval. | https://modelcontextprotocol.io/servers/google-maps |
| Docker MCP Server | Integrates with Docker to run containers and manage networks, volumes, and images. | https://modelcontextprotocol.io/servers/docker |
| Web Search MCP Server | Provides web and local search that assistants can call directly. | https://modelcontextprotocol.io/servers/web-search |
| PostgreSQL MCP Server | Lets an LLM manage PostgreSQL database tables for CRUD operations. | https://modelcontextprotocol.io/servers/postgresql |
| Google Drive MCP Server | Retrieves files and metadata from Google Drive. | https://modelcontextprotocol.io/servers/google-drive |
| Redis MCP Server | Manages Redis database tables through MCP tools. | https://modelcontextprotocol.io/servers/redis |
| Notion MCP Server | Connects to the Notion API to work securely with Notion workspaces. | https://modelcontextprotocol.io/servers/notion |
| Stripe MCP Server | Surfaces Stripe APIs as MCP tools for payments and billing automation. | https://modelcontextprotocol.io/servers/stripe |
| Perplexity MCP Server | Calls the Perplexity Search API through MCP for retrieval-augmented answers. | https://modelcontextprotocol.io/servers/perplexity |

## References
- Replit. “Everything you need to know about MCP.” https://blog.replit.com/everything-you-need-to-know-about-mcp
