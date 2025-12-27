# Vibe Kanban Tutorial: Parallel AI Coding Board
![Vibe Kanban dashboard](../assets/other/vibe-kanban.jpg)

> How to orchestrate Claude Code, Gemini CLI, and Codex tasks from a single Kanban so you can switch agents instantly, keep status visible, and avoid context switching across tooling.

---

## Intent
- Give teams a single dashboard to launch and track parallel AI coding tasks.
- Make it easy to swap between Claude Code, Gemini CLI, and Codex mid-task without losing status.
- Provide ready-to-run prompts for quick spikes, fixes, and review cycles.

## Use When
- You need multiple AI coding agents running in parallel (e.g., backend fix + frontend UI spike + test hardening).
- You want to compare agent outputs quickly or reroute tasks to a different model without re-planning.
- You prefer a Kanban view to track work-in-progress and avoid juggling multiple agent windows.

## Prerequisites
- Git installed and access to the **Vibe Kanban** repository.
- Node.js 18+ (or the version recommended in the repo) and a package manager (`npm`, `pnpm`, or `yarn`).
- API access for at least one of: **Claude Code**, **Gemini CLI**, or **Codex** (with corresponding API keys or CLI auth tokens).
- A small test repo available locally to validate agent outputs.

---

## Quick Setup
1) **Clone and install**
   ```bash
   git clone https://github.com/BloopAI/vibe-kanban.git
   cd vibe-kanban
   npm install  # or pnpm install / yarn install per the repository README
   ```
2) **Configure providers**
   - Create `.env` (or update the provided sample) with the agent credentials you plan to use. Keep only the keys you need.
   ```bash
   CLAUDE_API_KEY="..."
   GEMINI_API_KEY="..."
   OPENAI_API_KEY="..."  # for Codex-compatible endpoints
   ```
   - If you rely on provider CLIs (e.g., `gcloud auth login` for Gemini CLI), authenticate before launching the board.
3) **Start the board**
   - Use the repository’s start script (commonly `npm run dev` or `npm run start`). The dashboard exposes a Kanban view for tasks and agent sessions.
4) **Create columns**
   - Suggested lanes: **Backlog**, **In Progress**, **Review**, **Blocked**, **Done**. Keep WIP limits visible to avoid overloading agents.

---

## Core Workflow
1) **Add tasks with clear acceptance criteria**
   - Example cards:
     - "Backend: add `/api/tasks/:id/assign` with auth + 95% test coverage."
     - "Frontend: Kanban card drag-and-drop with optimistic updates and a11y labels."
2) **Assign the right agent per task**
   - Claude Code: complex refactors or architecture-sensitive changes.
   - Gemini CLI: fast iterations, code search, or Google Cloud-centric tasks.
   - Codex: concise completions and regex-heavy edits.
3) **Switch agents without losing context**
   - Move the card to the **In Progress** lane and log the active agent in the card notes.
   - If an agent stalls, swap to another (e.g., Claude → Codex) and paste the latest diff summary plus TODOs.
4) **Parallelize safely**
   - Run backend and frontend tasks concurrently; stagger merges with a short review buffer to minimize conflicts.
   - Keep a running changelog in the card comments so agent swaps have instant context.
5) **Review and close**
   - Use the **Review** lane for human inspection. Require: tests run, lint clean, and a short rationale of risky changes.
   - Move to **Done** only when the change is merged or verified locally.

---

## Prompt Starters (drop into each agent)
- **Planning**
  - "Plan the minimal steps to deliver: <task>. List files you will touch, risks, and quick checks to run."
- **Implementation**
  - "Implement <task>. Show diffs per file, commands to run, and a rollback note. Keep responses under 200 lines."
- **Swap/Recovery**
  - "Here is the current diff summary: <paste>. Continue the task with the same acceptance criteria. Avoid reformatting untouched files."
- **Review**
  - "Review the proposed changes for <task>. List breaking risks, missing tests, and any API contract drift."
- **Release notes**
  - "Summarize the change for the changelog in one bullet. Mention tests executed and any follow-up work."

---

## Dashboard Hygiene
- Keep **one card per change** to avoid tangled histories.
- Pin env/setup instructions in the Backlog column so new contributors can start quickly.
- Capture failed command output directly in the card comments so the next agent can retry with fixes.
- Timebox agent runs; if no progress in 10–15 minutes, switch or split the task.

---

## Troubleshooting
- **API auth failures**: Re-run CLI auth (`gcloud auth login`, `anthropic`/`openai` auth) and refresh the page.
- **Stuck tasks**: Move the card to **Blocked** with the exact error message; attach a retry checklist.
- **Context drift after agent swap**: Paste the latest diff summary and acceptance criteria before resuming.
- **Noise from parallel runs**: Limit each lane to 2–3 active cards; batch small fixes into a single card when safe.

---

## References
- [Vibe Kanban GitHub repository](https://github.com/BloopAI/vibe-kanban)
