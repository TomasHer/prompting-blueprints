# Agent-to-Agent (A2A) Protocol Guide

## Intent
Provide a concise, copy-ready overview of the A2A protocol, including the core concepts, quick-start flow, and official SDK links.

## Why A2A exists
A2A is a protocol for **agent-to-agent collaboration** so that autonomous agents can discover each other, exchange structured messages, and delegate tasks reliably. It standardizes how agents describe their capabilities and how tasks move through a shared lifecycle, making cross-team and cross-vendor agent workflows more interoperable.

## Core building blocks
- **Agent Card**: A machine-readable profile that advertises an agent’s identity, capabilities, and endpoints so other agents can discover and route tasks.
- **Tasks**: Units of work submitted to an agent. Tasks typically include inputs, requested outcomes, and lifecycle state updates.
- **Messages**: Structured exchanges between agents that carry instructions, context, and updates tied to a task.
- **Artifacts**: Outputs (files, data, or results) produced by an agent during task execution.
- **Transport**: A2A defines how requests and responses are exchanged so agents can communicate in a consistent, toolable way.

## Get started with A2A (quick path)
1. **Pick an SDK**
   - Use an official SDK to scaffold an A2A server and handle protocol primitives.
2. **Define your Agent Card**
   - Describe what your agent can do, what inputs it expects, and where it can be reached.
3. **Implement task handlers**
   - Map A2A task requests to your agent’s internal workflows, tools, or orchestrations.
4. **Run an A2A server**
   - Expose the agent card and task endpoints so other agents can discover and call your agent.
5. **Test agent-to-agent flows**
   - Create a client or use another agent to send tasks, observe lifecycle updates, and validate outputs.

## Download the official SDKs
- **.NET SDK**: https://github.com/a2aproject/a2a-dotnet
- **Python SDK**: https://github.com/a2aproject/a2a-python

> Check the official A2A documentation for additional SDKs, examples, and versioned protocol details.

## When to use A2A
- You need **multi-agent workflows** with consistent task and message exchange.
- Teams want **interoperability** between internal agents or third-party agent services.
- You want a **standard agent discovery** mechanism rather than bespoke integrations.

## Practical implementation tips
- Start with a narrow capability set in the agent card and expand as you validate reliability.
- Keep task payloads explicit: inputs, expected outputs, and constraints should be clear and structured.
- Log task lifecycle events so you can troubleshoot handoffs and retries between agents.
- Treat artifacts as durable outputs that downstream agents can verify and reuse.

## References
- A2A Protocol Documentation (Get Started). https://a2a-protocol.org/latest/#get-started-with-a2a
- A2A .NET SDK. https://github.com/a2aproject/a2a-dotnet
- A2A Python SDK. https://github.com/a2aproject/a2a-python
