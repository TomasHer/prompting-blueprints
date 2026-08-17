---
title: "DeepSeek Harness Tutorial"
tags: ["tools", "deepseek-harness", "agent-harness"]
last_updated: "2026-08-17"
---

# DeepSeek Harness: Everything Is a Plugin

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) is DeepSeek AI's open-source agent harness, released in **developer preview on August 13, 2026** under the MIT license. It is built on the [Cordis](https://github.com/cordiverse/cordis) meta-framework around one core idea: **everything is a plugin**. Models, tools, skills, sessions, sandboxes, filesystems, loops, orchestration, and even the UI are all plugins that can be mixed, matched, replaced, and extended — from configuration, without patching the source.

## Intent
- Explain why a frontier lab open-sourcing its agent harness matters, and how `dsh` fits the [harness engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) story.
- Walk through the architecture: Cordis plugins, services, typed events, profiles, bundles, and the agent turn flow.
- Get you running: Web UI, headless one-shot mode, the Python SDK, and your first custom plugin and tool.

## Use when
- You want to **study or build an agent harness** and prefer an open, production-grade reference over a black box.
- You need a harness where **any layer is swappable** — a different model provider, a remote sandbox, a custom tool policy, or a whole different UI — without forking the core.
- You benchmark models and want the **same harness DeepSeek uses**, configurable down to individual plugins.

## Why this release matters

The announcement ([@deepseek_ai on X](https://x.com/deepseek_ai/status/2087887408440164663)) is short, but the significance is bigger than a product launch:

1. **A frontier lab opened its harness, not just its weights.** The 2026 consensus — captured in the [harness engineering primer](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) — is that agent behavior is roughly *~10% model, ~90% harness*. Labs have open-sourced models for years; the harness — the scaffolding that turns a model into a reliable operator — mostly stayed proprietary. DeepSeek releasing theirs under MIT makes the "car around the engine" inspectable end to end.
2. **"Everything is a plugin" is an architectural answer to a real problem.** Harnesses are model-specific and rot fast (see the Self-Harness findings in the same primer): what helps one model hurts another, and new models ship monthly. A harness where the model adapter, tool registry, agent loop, sandbox, and UI are *all* replaceable rows in a config tree is built for exactly that churn.
3. **It's a composability experiment with a theory behind it.** The underlying Cordis framework has a design paper — [*A Programming Paradigm for Spatiotemporal Composability*](https://github.com/cordiverse/paper) — arguing that components should compose in *space* (which plugins are active) and *time* (when they mount and unmount, with effects that unwind cleanly). `dsh` is that theory shipped as a working coding agent.
4. **It's an ecosystem play.** Third-party plugins are a first-class distribution channel (the [`dsh-plugin`](https://github.com/topics/dsh-plugin) GitHub topic), the docs are fully bilingual (English/Chinese), and the Python SDK targets benchmark and automation users directly.

Fair warning, straight from the README: this is a *developer preview* and **"THERE WILL BE COMPATIBILITY-BREAKING CHANGES."** Treat it as a reference architecture and a playground, not yet a stable dependency.

## Architecture in five Cordis ideas

Cordis is the plugin framework underneath `dsh`. Its primer boils down to five ideas that explain the whole system:

1. **A plugin is a module with an `apply(ctx)` function** (or a `Service` subclass). The framework calls `apply` on load and hands it a context.
2. **A context is a repository of services.** A service claims a stable key — `ctx.tools`, `ctx.llm`, `ctx.sessions`, `ctx.fs`, `ctx.sandbox` — and other plugins find it by key instead of importing a concrete implementation.
3. **Dependencies are declared, not sequenced.** A plugin lists required services in `inject`; Cordis waits until they exist. No manual boot ordering.
4. **Typed events are the extension points.** Plugins communicate through declared events dispatched as `emit` (fire-and-forget), `waterfall` (around-middleware where each listener calls `next()` or short-circuits), `parallel`, or `serial`.
5. **Registrations are reversible effects.** Everything registered through `ctx.effect()` or `ctx.on()` — tools, prompt sections, adapters, listeners, timers — unwinds automatically when the plugin unloads. Hot-reload and teardown come for free.

The consequence, quoted from the architecture doc: *"There is no privileged core to patch: you extend dsh by mounting a plugin beside the others."* Even the agent loop (`core/agent-loop`) is just the *default* driver behind the `Agent` interface — replaceable like anything else.

### Profiles, bundles, and patches

A running `dsh` is a **plugin tree composed at boot** from ordered layers:

- A **bundle** is a distribution format for config rows plus the code they mount. `dsh-base` (model adapters, tools, persistence, sandbox and approval policy, credentials, telemetry) is the first layer of every profile; `dsh-web-app` adds the browser UI; `dsh-headless` adds a one-shot runner with no server.
- A **profile** is a named composition stored in the Harness home: the bundles it stacks, its out-of-tree plugins, and the user's own `cordis.patch.yml`. `web` and `headless` ship as templates and auto-initialize on first use.
- **Patches** apply on top: each bundle's patch in order, then the profile's `cordis.patch.yml`, then the home-level one, then any `--patch` overlay from the command line. A patch targets a row by id and replaces its config, or inserts new rows.

Inspect the exact tree your machine boots — and note that *any row it prints can be replaced by a patch of your own*:

```sh
dsh --profile web --dump-config
```

### The turn flow

One **step** = one model request plus the tools it calls; a **turn** = zero or more steps. Simplified from the architecture doc:

```text
turn/start
  assemble prompt sections + tool schemas
  agent/pre-step        (waterfall: rewrite or reject what the model sees)
    step/start
    agent/request → llm/stream → assistant/message
    tool/call → tools/pre-execute → tools/execute → tools/post-execute → tool/result
    step/end
  agent/turn-stopping
turn/end
```

Every hook in that flow is a public event a plugin can listen to. Durable facts (`turn/*`, `step/*`, `user/message`, `assistant/*`, `tool/*`) go to an **append-only session log** — and the invariant is strict: *"Model-visible means logged."* Anything that reaches a model request must be reconstructable from the log, which is what makes fork, resume, replay, transcripts, and telemetry all derivable from one stream.

### Capability seams

A **seam** is a swappable capability with three roles: a *Service Definition* (interface), a *Service Provider* (implementation), and a *Consumer* (commonly a model-facing tool). Seams are why one provider swap changes the whole product: filesystem and subprocess providers share one execution world, so pointing them at a remote sandbox moves Bash, PTY, and LSP with them — no forks.

## Quickstart

### Run the Web UI

With Node.js installed:

```sh
npx @deepseek-ai/dsh web
```

This serves the Web UI at `http://127.0.0.1:3080`. Then:

1. **Configure a model** — Settings → Models, paste a [DeepSeek API key](https://platform.deepseek.com/); it takes effect without a restart. Catalog providers (Anthropic, OpenAI, …) and custom OpenAI-compatible endpoints are supported too, and keys are write-only, stored in `$DSH_HOME/.credentials.yaml`.
2. **Choose a workspace** — the directory the agent may read and edit.
3. **Run a task** — e.g. *"Summarize this repository and identify its main packages."* The agent reads and edits files, runs commands, delegates to subagents, and maintains a plan; the UI asks before operations that need approval under the active permission policy.

### Run from source

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

### Headless one-shot mode

The `headless` profile runs one fresh persisted session, prints the final answer, and exits — the shape you want for scripts and CI (needs `DEEPSEEK_API_KEY` in the environment or a repo-root `.env`):

```sh
dsh --profile headless "summarize this workspace"
```

### Python SDK (the benchmarking path)

The published SDK bundles its own runtime (no system Node.js needed) and is the documented path for [running benchmarks](https://github.com/deepseek-ai/deepseek-harness/blob/master/BENCHMARK.md) — the same harness, driven programmatically over JSON-RPC:

```sh
python -m pip install deepseek-harness-sdk
```

```python
from deepseek_harness import DeepSeekHarness

with DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    cwd="/absolute/path/to/workspace",
    session_root="/absolute/path/to/sessions",
    cordis="examples/jsonrpc-agent/minimal.cordis.yml",
) as harness:
    result = harness.run(
        "Inspect the repository and fix the failing tests.",
        session_id="example-001",
    )

print(result.final_response)
```

The session directory receives a JSONL log of the assembled model requests and tool calls — the append-only session log, on disk.

## Your first plugin

The whole extension model fits in one small exercise (from the [official plugin tutorial](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md)). A plugin is a TypeScript module exporting `apply`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  console.log('[hello-plugin] plugin loaded!')
}
```

Register it with a patch file (`scratch-plugin/cordis.yml`) that inserts a row into the tree:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/scratch-plugin/src/my-plugin.ts'
```

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

Upgrading it to a **model-facing tool** takes one service dependency and one registration:

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']   // Cordis waits for ctx.tools to exist

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'The name to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))
}
```

Restart with the patch, ask the agent *"Use the greet tool to greet Ada,"* and the model calls your tool. Everything registered through `ctx` is cleaned up automatically when the plugin unloads — no manual `removeListener`/`clearInterval`.

## What ships in the box

The [tool catalog](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/tool-catalog.md) reads like a checklist of 2026 harness state of the art, each item its own plugin package:

- **Execution:** `bash` (one-shot or persistent PTY), PowerShell for Windows, background jobs (`job_list`/`job_output`/`job_kill`), full interactive terminals, sandbox confinement of spawned processes.
- **Files & search:** `read`/`write`/`edit` with an enforced read-before-write policy (itself a separate event-gate plugin), `glob`/`grep` via bundled ripgrep, LSP integration behind a provider seam.
- **Orchestration:** `subagent` and `subagent_fork` delegation with `send_message`/`interrupt_agent`/`list_agents` control, a `workflow` engine, and a `ralph` tool that loops fresh child agents at an objective round by round.
- **Agent UX:** plan mode with `exit_plan_mode` approval, `todo_write` checklists, `ask_user_question`, skills, session-local schedules, goals, session query/search/trace over past logs, `web_search`/`web_fetch`.
- **Code Mode:** a `run_code` transport where, instead of JSON tool calls, the model writes a program against a generated SDK of its capabilities — each call re-entering the same guarded tool pipeline.
- **Self-referential Cordis tools** (opt-in, not in any shipped tree): `cordis_define`/`cordis_run`/`cordis_inspect_*` let the agent inspect and modify *its own live plugin tree* — a working demo of an agent editing its own harness. Try `pnpm run demo:cordis`.

The `examples/` directory has runnable compositions for each interface: `headless-agent`, `jsonrpc-agent` (Python SDK), `acp-agent` (Agent Client Protocol server), `mcp-memory` (third-party memory servers over MCP), `web-schedule` (durable reminders as an overlay patch), and `web-cordis` (the self-referential agent).

## How it compares

| | **DeepSeek Harness** | **Claude Agent SDK / Claude Code** | **Hermes Agent** |
| :--- | :--- | :--- | :--- |
| **Core idea** | Everything is a plugin; no privileged core | General-purpose harness with extension points (skills, hooks, MCP, subagents) | Personal agent with a persistent learning loop |
| **Extensibility** | Any layer replaceable from config (model, loop, sandbox, UI) | Extend around a maintained core | Toolsets, skills, MCP |
| **License / source** | MIT, fully open | Proprietary core, open SDK surface | Open source |
| **Sweet spot** | Studying/building harnesses, benchmarking, custom compositions | Production coding agents today | Daily personal assistant across messaging platforms |

See the [Hermes Agent Tutorial](hermes-agent-tutorial.md) and the [harness engineering primer](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) for the deeper comparisons.

## Key takeaways

- **The harness is now open.** DeepSeek shipping its agent harness under MIT extends the open-weights movement to the layer that actually determines agent reliability — you can read, replace, and re-tune every part of the car, not just the engine.
- **"Everything is a plugin" is harness engineering made literal.** Model adapters, tools, the agent loop, sandboxes, and the UI are all config rows in a Cordis plugin tree; `dsh --profile web --dump-config` prints the whole machine, and any row can be patched.
- **The append-only session log is the architectural spine.** "Model-visible means logged" gives you replay, fork, resume, and telemetry from one stream — a pattern worth stealing for any harness you build.
- **Extension is a config patch, not a fork.** A first tool is ~30 lines of TypeScript plus a 3-line YAML patch, with automatic cleanup on unload.
- **It's a preview.** Breaking changes are promised; use it to learn and prototype, and pin versions if you build on it.

## References
- DeepSeek AI — [deepseek-harness (GitHub)](https://github.com/deepseek-ai/deepseek-harness) (README, architecture doc, Cordis primer, tool catalog, cookbook, and user guides — the source for all commands and code in this tutorial)
- DeepSeek — [DeepSeek Harness v0.1 developer preview announcement (X)](https://x.com/deepseek_ai/status/2087887408440164663)
- Cordiverse — [Cordis (GitHub)](https://github.com/cordiverse/cordis) (the meta-framework: plugin loading, services, typed events, reversible effects)
- Cordiverse — [A Programming Paradigm for Spatiotemporal Composability (GitHub)](https://github.com/cordiverse/paper) (the design paper behind Cordis)
- DeepSeek — [DeepSeek Platform](https://platform.deepseek.com/) (API keys for the default model route)
- GitHub — [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) (community plugin discoverability)
- Related in this repo: [From Prompt to Context to Harness Engineering](../02-ai-agents/01-foundations/prompt-context-harness-engineering.md) · [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md) · [Hermes Agent Tutorial](hermes-agent-tutorial.md) · [Open Models](../02-ai-agents/01-foundations/open-models.md)
