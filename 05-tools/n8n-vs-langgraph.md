# n8n vs LangGraph: Tool Comparison

## Intent
Help prompt engineers and product teams decide when to use n8n, LangGraph, or both by clarifying workflows, strengths, and decision criteria.

## Use when
- You need a crisp comparison between visual automation and graph-based agent orchestration.
- You are deciding how much state, looping, and multi-agent coordination your system needs.
- You want a layered stack that separates business integrations from agent logic.

## Quick comparison
| Dimension | n8n | LangGraph |
| --- | --- | --- |
| Primary focus | Visual workflow automation and tool integration | Graph-based agent orchestration and control flow |
| Typical flow | Trigger -> AI agent -> tools/APIs -> action | State -> agents -> conditional logic -> state (cycles) |
| Strengths | Integration breadth, rapid deployment, no/low-code setup | Stateful workflows, complex reasoning, multi-agent coordination |
| Best fit | Business process automation, support ops, integration-heavy flows | Enterprise-grade agent apps, reasoning loops, fine-grained state |
| Ecosystem | Workflow nodes, self-hosting, automation community | LangChain stack, LangSmith observability, state persistence |

## Positioning in plain language
- **n8n** is the visual orchestrator that connects AI to your business stack.
- **LangGraph** is the reasoning brain that manages complex agent decision-making.

## When to use n8n
- You need fast integrations with SaaS tools, CRMs, support desks, or internal APIs.
- You want a visual builder for non-developers or mixed business/engineering teams.
- You are automating customer support, notifications, or data handoffs.
- You want quick deployment across a large set of prebuilt integrations.

## When to use LangGraph
- You are building stateful, cyclical agent workflows with branching logic.
- You need multi-agent collaboration, retries, or fine-grained state control.
- You are shipping enterprise-grade agent apps with deep reasoning chains.
- You need strong observability and persistence for agent state.

## When to use both (layered stack)
- Use **n8n** for triggers, integrations, and business automations.
- Use **LangGraph** for the agent logic, tool routing, and stateful loops.
- Think in layers: integration orchestration on top, agent reasoning underneath.

## Decision checklist
- **Integration surface**: Do you need many SaaS/tool connectors quickly? -> n8n.
- **State complexity**: Do you need cyclical state machines or multi-agent routing? -> LangGraph.
- **User mix**: Are non-developers expected to edit workflows? -> n8n.
- **Control depth**: Do you need deterministic routing, retries, or state checkpoints? -> LangGraph.
- **Stack strategy**: Do you want both integration speed and deep reasoning? -> Combine them.

## OUTPUT FORMAT (Markdown)
```
## Tool Selection Brief
- Use case:
- Primary users:
- Integration surface:
- Orchestration depth:
- State requirements:
- Recommended tool:
- Rationale:
- Risks:
- Next step:
```

## Example decision prompt and completion
**Input**
```
We need to automate customer support triage across Slack, Zendesk, and email.
We also want a second-stage agent that reasons about escalations and retries.
The support ops team will own the workflows with light engineering help.
```

**Expected output**
```
## Tool Selection Brief
- Use case: Customer support triage with escalation reasoning
- Primary users: Support ops with engineering support
- Integration surface: Slack, Zendesk, email
- Orchestration depth: Two-stage flow with agent escalation logic
- State requirements: Track ticket status and escalation decisions across steps
- Recommended tool: n8n + LangGraph
- Rationale: n8n handles integrations and routing; LangGraph manages stateful escalation loops
- Risks: Split ownership across tools; define handoff contracts early
- Next step: Prototype the n8n trigger flow, then stub the LangGraph escalation graph
```

## Related resources
- [n8n Vibe Research Workflow Tutorial](../05-tools/n8n-research-workflow-tutorial.md)
- [LangChain Deep Agents Playbook](../05-tools/langchain-deep-agents.md)
- [LangChain Research Agent Tutorial](../07-use-cases-and-research/langchain-research-agent.md)
- [AI Agents Overview](../02-ai-agents/ai-agents-overview.md)
- [AI Coding Spectrum](../02-ai-agents/ai-coding-spectrum.md)

## References
- [n8n](https://n8n.io/)
- [LangGraph](https://www.langchain.com/langgraph)
