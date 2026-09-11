---
title: "DeepSeek Harness on a DGX Spark with VS Code"
tags: ["tools", "deepseek-harness", "dgx-spark", "vscode"]
last_updated: "2026-09-11"
---

# DeepSeek Harness on a DGX Spark, Driven from VS Code, Pointed at Your Knowledge Base

> Three pieces, one workflow: an **NVIDIA DGX Spark** as the always-on agent host, **VS Code Remote-SSH** as the front end on your laptop, and **this repository** as the workspace the agent reads, edits, and maintains. [DeepSeek Harness](./deepseek-harness-tutorial.md) (`dsh`) is the harness in the middle — and it happens to be built for exactly this shape.

## Intent
- Show why the Spark + VS Code + a knowledge-base repo is a natural fit for `dsh`, not a workaround.
- Get a working setup end to end: install, remote editing, model routing, workspace instructions, a repo-specific skill, and a nightly headless loop.
- Keep the repo's own publishing rules (front-matter, nav, changelog, source index) inside the agent's context so its edits are mergeable.

## Use when
- You own a DGX Spark (or any Linux arm64 box) and want a **private, always-on coding agent** over your own content.
- You want to edit in VS Code on your laptop while the agent runs, holds state, and burns tokens **on the Spark**.
- You want the harness itself to be inspectable and swappable — see the [architecture walkthrough](./deepseek-harness-tutorial.md) for what "everything is a plugin" actually buys you.

## Why these three fit together

Four facts from the `dsh` sources decide the whole design:

| Fact | Consequence for this setup |
| :--- | :--- |
| `dsh` ships **prebuilt `linux-arm64`** native artifacts (static Landlock launcher, glibc/musl addons; CI builder `ubuntu-24.04-arm`) | The Spark's 20-core Arm CPU is a first-class target, not a compile-it-yourself platform |
| `dsh --profile web` **rejects `--host 0.0.0.0` at startup** and binds loopback only | Remote access is *meant* to go through SSH forwarding — which is what VS Code Remote-SSH gives you for free |
| Over SSH, `dsh` prints the URL but **skips the browser handoff** ("the SSH client or editor owns the local forwarded address") | The editor-forwarded workflow is documented behavior, not an accident |
| The `dsh-agent-instructions` plugin loads **`AGENTS.md` / `CLAUDE.md`** from `$DSH_HOME` and from the project root down to the session cwd | Your knowledge base's own contribution rules become the agent's operating manual with zero glue code |

The Spark's **128 GB of coherent unified memory** (shared CPU/GPU, GB10 Grace Blackwell) adds the fourth leg: a local OpenAI-compatible model server on the same box, so the agent's model route never leaves your desk. See [Ornith-1.0 on a DGX Spark](../06-models-and-evaluations/ornith-1-0-dgx-spark-guide.md) for picking and serving that model.

```text
  Laptop                          DGX Spark (DGX OS, arm64)
  ┌──────────────────┐  SSH   ┌──────────────────────────────────────┐
  │ VS Code          │───────▶│ dsh web  →  127.0.0.1:3080           │
  │  Remote-SSH      │        │   ├─ workspace: ~/prompting-blueprints│
  │  port 3080 fwd   │◀───────│   ├─ AGENTS.md + .agents/skills/     │
  │  browser tab     │        │   └─ model: local vLLM/Ollama :8000  │
  └──────────────────┘        └──────────────────────────────────────┘
```

## Prerequisites
- **DGX Spark** with DGX OS, reachable over SSH (or any Linux arm64/x64 host).
- **Node.js 22.19+ or 24+** on the Spark — `dsh` declares `^22.19.0 || >=24.0.0`.
- **VS Code** on your laptop with the **Remote - SSH** extension.
- A clone of your knowledge base on the Spark, and a **DeepSeek API key** and/or a local OpenAI-compatible model server.
- `dsh` is a **developer preview** (`0.1.5-rc.2` at the time of writing) and promises breaking changes. Pin versions if anything depends on it.

## Step 1 — Prepare the Spark

SSH in and confirm the platform, then install Node:

```sh
uname -m                       # expect: aarch64
nvidia-smi                     # GB10, 128 GB unified
node --version                 # need v22.19+ or v24+
```

If Node is older, install a current LTS (nvm, `fnm`, or NodeSource — all publish arm64 builds). Then check the sandbox story, because `dsh` confines tool execution with **Landlock**, which needs an enforcing kernel:

```sh
grep -i landlock /boot/config-$(uname -r) 2>/dev/null || zgrep -i landlock /proc/config.gz
```

`dsh` runs a functional probe at startup and reports full, partial, or unusable enforcement — kernel version alone is not a guarantee. Unusable enforcement does not block `dsh`; it means confinement falls back, so keep the default `workspace-write` permission preset (Step 5).

## Step 2 — Open the Spark in VS Code

On your laptop, add the host once so forwarding and the remote server are automatic:

```jsonc
// ~/.ssh/config
Host spark
  HostName spark.local        // or the Spark's IP
  User yourname
  ForwardAgent yes
```

Then in VS Code: **F1 → Remote-SSH: Connect to Host… → spark**. VS Code installs its arm64 server on the Spark and every terminal you open is a Spark terminal. Open the knowledge-base folder remotely:

```sh
git clone https://github.com/<you>/prompting-blueprints.git ~/prompting-blueprints
```

**File → Open Folder → `~/prompting-blueprints`.** You now edit on the Spark with local-feeling latency, and the agent will see exactly the files you see.

## Step 3 — First `dsh` run with editor port forwarding

In a VS Code terminal (already on the Spark), from the repo root — the invoking directory is the default workspace root:

```sh
cd ~/prompting-blueprints
npx @deepseek-ai/dsh web --no-open
```

Startup prints a `dsh web:` line whose root URL carries a **fresh process token**. Because this is an SSH session, no browser opens — that is by design. VS Code auto-forwards port **3080**; check the **Ports** panel, then <kbd>Ctrl</kbd>-click the printed URL (VS Code rewrites it to your local forwarded address). Keep the token: every Host API call and WebSocket stream is authenticated by it.

Two useful variants:

```sh
npx @deepseek-ai/dsh web --no-open --port 8080    # avoid a port clash
dsh --profile web --dump-config                   # print the whole plugin tree, boot-free
```

> **Do not** reach for `--host 0.0.0.0` to "just expose it on the LAN" — it is rejected at startup for safety. The SSH tunnel is the supported remote path, and VS Code already built it for you.

Configure a model in **Settings → Models** (a DeepSeek API key is the one-field path; keys are write-only and land in `$DSH_HOME/.credentials.yaml`, default `~/.dsh`). Then **Choose workspace → `~/prompting-blueprints`** and run a first task, e.g. *"Summarize the directory structure and the contribution rules of this repository."*

## Step 4 — Route the agent to a local model on the Spark

This is the step that makes the Spark worth having. Serve any open model behind an OpenAI-compatible endpoint on the box (see the [Ornith guide](../06-models-and-evaluations/ornith-1-0-dgx-spark-guide.md) for the model choice and serving flags), then add it as a **custom provider**.

In **Settings → Models → Add a custom provider**, fill: a lowercase **Provider ID** (permanent — it is referenced by sessions and defaults), **base URL**, **API protocol** `openai-completions`, an **API key**, and at least one model. **Fetch available models** queries the endpoint's `GET /models` if it serves one.

Most local servers need two compatibility switches the form does not expose. Edit `$DSH_HOME/settings.yaml` directly (adapters re-read it on the next request — no restart):

```yaml
llm-pi-ai:
  providers:
    spark-local:
      apiKeyEnv: SPARK_LOCAL_KEY      # any non-empty value for an unauthenticated local server
      api: openai-completions
      baseURL: http://127.0.0.1:8000/v1
      compat:
        supportsDeveloperRole: false  # pi-ai sends reasoning models' system prompt as role: developer
        maxTokensField: max_tokens    # servers that don't know max_completion_tokens
      models:
        - id: your-local-model
          reasoningEfforts:           # only then does the Effort menu appear
            off:
            high: high
            max: max
```

Keep the DeepSeek cloud route configured alongside it: two providers, one picker, and you choose per session whether a task stays on the Spark or goes to a frontier model.

| Symptom | Fix |
| :--- | :--- |
| Gateway refuses every request despite a valid key and URL | Start with `compat.supportsDeveloperRole: false` and `compat.maxTokensField: max_tokens` |
| Only reasoning models fail | `supportsDeveloperRole: false` |
| `MISSING_CREDENTIAL` | Store the key on the Models page, or export the `apiKeyEnv` variable before starting `dsh` |
| No **Effort** menu on a hand-entered model | It declares no levels — add `reasoningEfforts` |

## Step 5 — Make the knowledge base a first-class workspace

### 5a. Give the agent your contribution rules

`dsh` loads `AGENTS.md` and `CLAUDE.md` from the project root (marked by `.git`) down to the session cwd, broad-to-specific, within a 65,536-byte budget, dropping broader files before truncating the most specific one.

**Watch the filename casing.** The candidate list is literally `['AGENTS.md', 'CLAUDE.md']`, and Linux filesystems are case-sensitive — a lowercase `agents.md` is *not* picked up. If your repo (like this one) uses lowercase, add the canonical name:

```sh
cd ~/prompting-blueprints
ln -s agents.md AGENTS.md      # or: git mv agents.md AGENTS.md
```

Machine-local preferences that should never be committed go in `AGENTS.local.md` — an additive overlay loaded after the base file, and a natural `.gitignore` entry. Sibling files with identical trimmed content render once, so a `CLAUDE.md` duplicating `AGENTS.md` costs nothing.

### 5b. Pick a permission preset

`dsh` bundles a sandbox mode and an approval policy into one selector. Use `/permission` in the composer to inspect or switch:

| Preset | Sandbox | Approval | Use for |
| :--- | :--- | :--- | :--- |
| `workspace-write` | `workspace-write` | `ask` | Default. Edits confined to the workspace, prompts before risky operations |
| `danger-full-access` | `danger-full-access` | `never` | Unattended loops only, on a box you accept the risk on |

Keep `workspace-write` for interactive sessions; reserve the second for Step 7, and scope it to a checkout you can throw away.

## Step 6 — Teach it your repo's publishing rules as a skill

`dsh` discovers local skills from ranked roots — `<project>/.dsh/skills` (100), **`<project>/.agents/skills` (200)**, custom dirs (300), `$DSH_HOME/skills` (400), `<agentsHome>/skills` (500) — and watches them, so a new skill reaches the next session without a restart. A skill is `<name>/SKILL.md` or a flat `<name>.md` at the **top level** of a root; nested `**/SKILL.md` is deliberately not discovered.

Because rank 200 lives in the repo, the skill travels with the knowledge base and every machine that clones it gets the same behavior:

```sh
mkdir -p ~/prompting-blueprints/.agents/skills/kb-page
```

```markdown
<!-- .agents/skills/kb-page/SKILL.md -->
---
name: kb-page
description: Publish a new page in this knowledge base with every repo rule applied.
whenToUse: When adding or significantly updating a Markdown page in this repository.
---

# Publishing a knowledge-base page

1. Place the file in the right directory (`02-ai-agents/`, `03-prompts-and-patterns/`,
   `04-guides/`, `05-tools/`, `06-models-and-evaluations/`, `07-use-cases-and-research/`,
   `10-security/`). Never create a new top-level directory.
2. Open with YAML front-matter: `title` (exact mkdocs nav label), `tags` (first tag is the
   directory category), `last_updated` (ISO date). Verify with
   `python3 scripts/check-frontmatter.py`.
3. Start with an **Intent** or **Use when** section; keep the file under ~250 lines.
4. Use explicit relative links: `./file.md` in-directory, `../dir/file.md` across.
5. Register the page in `mkdocs.yml` under the matching nav section.
6. Add every external URL to `external-sources.md` in alphabetical order, then regenerate
   with `python3 scripts/build-source-index.py`.
7. Add a one-line entry to `CHANGELOG.md` under **Unreleased**.
8. Run `mkdocs build` before proposing the change.
```

Invoke it from the composer with `/kb-page`, or let the model select it from the catalog. See [Anatomy of a Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) for how to write these well.

## Step 7 — A nightly maintenance loop

The `headless` profile runs one task, prints the final answer on stdout, streams reasoning to stderr, and exits — `0` on completion, `1` on abort or error. No server, no port, nothing left running. That makes it a clean `cron` or `systemd` unit on an always-on Spark:

```sh
cd ~/prompting-blueprints && dsh --profile headless \
  "Check every internal Markdown link in this repository resolves. List broken links as a table and propose the corrected relative path for each. Do not edit files."
```

```sh
# ~/.config/systemd/user/kb-audit.timer  →  OnCalendar=*-*-* 03:00:00
# ~/.config/systemd/user/kb-audit.service
[Service]
Type=oneshot
WorkingDirectory=%h/prompting-blueprints
Environment=SPARK_LOCAL_KEY=local
ExecStart=%h/.local/bin/dsh --profile headless "Audit front-matter across all content directories with scripts/check-frontmatter.py, then report every file missing or malformed, grouped by directory."
```

Point these at the **local** provider and the loop costs nothing per run. Start read-only ("report", "do not edit"), read the transcripts for a week, and only then let a loop write. The same pattern, and its failure modes, are covered in [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md).

To make a patch overlay permanent instead of passing `--patch` each time, merge it into `$DSH_HOME/profiles/<name>/cordis.patch.yml` (one profile) or `$DSH_HOME/cordis.patch.yml` (every profile). Out-of-tree plugins install per profile: `dsh plugin --profile web add <package>`.

## Step 8 — Scripted access from the same box

For batch work over the knowledge base, the Python SDK drives the same harness over JSON-RPC and bundles its own runtime (no system Node.js needed). It supports **Linux arm64** explicitly and honors `DEEPSEEK_BASE_URL`, so it can target the Spark's local endpoint:

```sh
python -m pip install deepseek-harness-sdk
export DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1
```

Use it when you want a loop *around* the agent — one session per directory, per page, or per open PR — rather than one long session. The `acp` profile covers the other direction: an Agent Client Protocol server for editors and automation that speak ACP.

## Troubleshooting

| Symptom | Cause / fix |
| :--- | :--- |
| Startup stops with a build hint | Running from a checkout without built artifacts — `pnpm run build` first, or use `npx @deepseek-ai/dsh` |
| Browser never opens | Expected over SSH. Open the printed URL through the VS Code **Ports** panel |
| Port 3080 not forwarded | Add it manually in the Ports panel, or use `--port` and forward that |
| Agent ignores your repo rules | Lowercase `agents.md`; add `AGENTS.md` (Step 5a). Check for a `Workspace instruction budget …` notice — broad files get dropped first |
| A new skill does not appear | It must sit at the **top level** of a scanned root as `<name>/SKILL.md` or `<name>.md`, with `name` and `description` in its front-matter |
| `--host 0.0.0.0` refused | Deliberate. Use SSH forwarding; `--trusted-host` only adds allowed hosts, it does not change the bind |

## Key takeaways
- **The Spark is the host, VS Code is the window, the repo is the context.** Remote-SSH puts your editor and the agent in the same filesystem, and `dsh`'s loopback-only bind makes the forwarded tunnel the intended path rather than a compromise.
- **`linux-arm64` is a supported platform**, with prebuilt native artifacts and a documented CI builder — the Spark needs no special build.
- **Your contribution rules are the agent's prompt.** `AGENTS.md` at the project root, `AGENTS.local.md` for machine-local overlays — and mind the case-sensitive filename.
- **Repo-local skills at `.agents/skills/` travel with the clone**, hot-reload on disk change, and are the right place to encode publishing checklists.
- **Local model + headless profile = free loops.** One task, one exit code, no listening port; start read-only and graduate to writes.

## References
- DeepSeek AI — [deepseek-harness (GitHub)](https://github.com/deepseek-ai/deepseek-harness) and the [documentation site](https://deepseek-harness.github.io/deepseek-harness/)
- DeepSeek — [Configure models guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/providers.md) (custom providers, `compat` switches, `reasoningEfforts`)
- DeepSeek — [`dsh-web-app` bundle reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/web-app/README.md) (flags, SSH behavior, the `0.0.0.0` refusal)
- DeepSeek — [`dsh-agent-instructions` reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/context/agent-instructions/README.md) (`AGENTS.md` candidates, budget)
- DeepSeek — [`dsh-skill-filesystem` reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill-filesystem/README.md) (skill roots and ranks)
- DeepSeek — [`dsh-headless` reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/headless/README.md) and the [Python SDK guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/python-sdk.md)
- DeepSeek — [`dsh-permission-presets` reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/interaction/permission-presets/README.md)
- NVIDIA — [DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- Microsoft — [VS Code Remote Development using SSH](https://code.visualstudio.com/docs/remote/ssh)
- Related in this repo: [DeepSeek Harness Tutorial](./deepseek-harness-tutorial.md) · [Ornith-1.0 on a DGX Spark](../06-models-and-evaluations/ornith-1-0-dgx-spark-guide.md) · [AGENTS.md and Claude Code](../02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md) · [Build an AI Knowledge Base](../02-ai-agents/03-context-and-memory/ai-knowledge-base-tutorial.md) · [Anatomy of a Skill](../02-ai-agents/02-skills/anatomy-of-a-skill.md) · [Loop Engineering](../02-ai-agents/01-foundations/loop-engineering.md)
