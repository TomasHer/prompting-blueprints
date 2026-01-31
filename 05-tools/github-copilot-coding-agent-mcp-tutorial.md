<img src="../assets/microsoft/github-copilot.png" alt="GitHub Copilot" width="80%">

# Intent
Explain how to extend the GitHub Copilot coding agent with the Model Context Protocol (MCP) so the agent can call your custom tools, data sources, and workflows directly from a repository.

## Use when
- You want the Copilot coding agent to query internal systems, APIs, or knowledge bases.
- You need consistent, auditable tooling across repositories and teams via MCP servers.
- You’re standardizing agent workflows by exposing reusable MCP tools, resources, and prompts.

## Prerequisites
- **Copilot coding agent enabled** for the repository or organization.
- **An MCP server** you control (local command or hosted endpoint) that exposes tools/resources/prompts.
- **Access to repo settings** so you can add MCP configuration and (optionally) secrets.

## What you’ll build
A repository-level MCP configuration that registers one or more MCP servers, plus a short prompt you can give the coding agent to verify the integration.

---

# Step 1: Stand up or pick an MCP server
You can use any MCP server that implements the MCP spec and exposes tools, resources, and prompts. The server can be:
- **Local/command-based** (stdio transport) for development and testing.
- **Hosted/remote** (HTTP/SSE or WebSocket transport) for production use.

**Checklist before you connect it to Copilot:**
- [ ] Server lists clear **tool names** with descriptions.
- [ ] Server has **least-privilege** credentials for any external system.
- [ ] Server logs requests so you can audit tool calls.

---

# Step 2: Add the MCP configuration to the repo
Create an MCP configuration file in your repository (as described in the GitHub Docs). The coding agent reads this file to discover available MCP servers.

**Example: MCP server definitions**
```json
{
  "servers": {
    "internal-search": {
      "command": "node",
      "args": ["./mcp/servers/internal-search.js"],
      "env": {
        "INTERNAL_SEARCH_TOKEN": "${{ secrets.INTERNAL_SEARCH_TOKEN }}"
      }
    },
    "ticketing-api": {
      "url": "https://mcp.example.com/ticketing",
      "headers": {
        "Authorization": "Bearer ${{ secrets.MCP_TICKETING_TOKEN }}"
      }
    }
  }
}
```

**Notes:**
- Keep tokens in **GitHub repository or organization secrets**, not in the file.
- Prefer **read-only scopes** until you’ve validated the workflow end-to-end.
- If you run multiple servers, name them after the domain they represent (e.g., `crm`, `billing`, `observability`).

---

# Step 3: Test the integration with a short Copilot task
Ask the coding agent to use the tools you exposed. Example prompt:

```text
Use the internal-search MCP tool to find our latest API error-rate metrics for the past 7 days. Summarize the top three error categories and suggest the most likely root cause.
```

**Expected outcome:**
- The agent discovers the MCP servers, calls your tool, and returns a short summary with the result.
- If tool discovery fails, verify the MCP config file location, the server command or URL, and secrets.

---

# Step 4: Add guardrails to keep the agent safe
Before rolling out to teams, add these guardrails:
- **Scope tools by environment** (staging vs. prod) with separate MCP servers.
- **Use read-only tools** for data retrieval and require explicit approval for mutations.
- **Log and monitor tool calls** to detect unusual usage patterns.
- **Document tool behavior** in a `README` inside the MCP server repo.

---

# Copy-ready checklist for rollout
- [ ] MCP server is available and exposes tools/resources/prompts.
- [ ] MCP config file added to the repo (per GitHub Docs).
- [ ] Secrets stored in GitHub (not committed to code).
- [ ] Copilot coding agent successfully calls a tool in a test prompt.
- [ ] Guardrails and monitoring are in place.

## References
- GitHub Docs — “Extend the GitHub Copilot coding agent with MCP.” https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp
