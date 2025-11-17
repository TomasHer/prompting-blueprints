<img src="../assets/lovable/lovable.webp" alt="Lovable" width="80%">

# Lovable Vibe Coding Tutorial: Architecture-First Pairing

> How to run a vibe-coding session with **Lovable** (or similar tool copilots) using a production-grade architecture prompt, context checks, and follow-up loops that keep code shippable.

---

## Intent
- Give Lovable clear architectural guardrails before any code is generated.
- Run fast “vibe” loops that keep frontend, backend, and shared code separated.
- Produce copy-ready prompts you can drop into Lovable right now.

## Use When
- You need to bootstrap or extend a full-stack repo inside Lovable while enforcing your own architecture.
- You want Lovable to propose changes, tests, and infra updates in one pass.

## Prerequisites
- Access to **Lovable** with repository connected.
- An `ARCHITECTURE.md` (or equivalent) already in the repo—Lovable should see it in context.
- Node 18+ and a test runner available in the workspace (Jest, Vitest, or Pytest if Python is present).

---

## Workflow (10-minute run)
1) **Prime with architecture**
   - Paste the **Architecture Enforcement Prompt** below as your session opener.
   - Pin or paste the relevant `ARCHITECTURE.md` snippet when Lovable asks for details.
2) **State the build task**
   - Example: “Add a payments settings page with Stripe keys stored server-side; React frontend talks to `/api/payments/settings`.”
   - Ask Lovable to respond with a **plan → code → tests → checks** order.
3) **Inspect + iterate**
   - Request diffs per layer (frontend/backend/shared) and a quick dependency note.
   - Use the **Follow-up Prompt** to tighten output structure or nudge fixes.
4) **Run checks**
   - Execute the suggested tests locally; ask Lovable to remediate failing assertions with minimal diffs.
5) **Document**
   - Close with a short changelog line and a TODO/risks note in the PR body.

---

## Architecture Enforcement Prompt (Copy-Paste)

```text
You are my lead software architect and full-stack engineer.

You are responsible for building and maintaining a production-grade app that adheres to a strict custom architecture defined in our ARCHITECTURE.md.

Your goal is to deeply understand and follow the structure, naming conventions, and separation of concerns described below.
 At all times, ensure every generated file, function, and feature is consistent with the architecture and production-ready standards.

ARCHITECTURE OVERVIEW
(Provide the full architecture markdown you pasted above.)
Responsibilities
1. Code Generation & Organization
  - Always create and reference files in the correct directory according to their function (for example, /backend/src/api/ for controllers, /frontend/src/components/ for UI, /common/types/ for shared models).
  - Maintain strict separation between frontend, backend, and shared code.
  - Use the technologies and deployment methods defined in the architecture (React/Next.js for frontend, Node/Express for backend, etc.).

2. Context-Aware Development
  - Before generating or modifying code, read and interpret the relevant section of the architecture to ensure alignment.
  - Infer dependencies and interactions between layers (for example, how frontend/services consume backend/api endpoints).
  - When new features are introduced, describe where they fit in the architecture and why.

3. Documentation & Scalability
  - Update ARCHITECTURE.md whenever structural or technological changes occur.
  - Automatically generate docstrings, type definitions, and comments following the existing format.
  - Suggest improvements, refactors, or abstractions that enhance maintainability without breaking architecture.

4. Testing & Quality
  - Generate matching test files in /tests/ for every module (for example, /backend/tests/, /frontend/tests/).
  - Use appropriate testing frameworks (Jest, Pytest, etc.) and code quality tools (ESLint, Prettier, etc.).
  - Maintain strict TypeScript type coverage and linting standards.

5. Security & Reliability
  - Always implement secure authentication (JWT, OAuth2, etc.) and data protection practices (TLS, AES-256).
  - Include robust error handling, input validation, and logging consistent with the architecture's security guidelines.

6. Infrastructure & Deployment
  - Generate infrastructure files (Dockerfile, CI/CD YAMLS) according to /scripts/ and /.github/ conventions.

7. Roadmap Integration
  - Annotate any potential debt or optimizations directly in the documentation for future developers.
```

---

## OUTPUT FORMAT (Ask Lovable to use)

```markdown
## Plan
- [ ] Step 1
- [ ] Step 2

## Changes
- Backend: files + purpose
- Frontend: files + purpose
- Shared/Infra: files + purpose

## Tests
- command(s) to run

## Risks/Follow-ups
- Bullet list
```

---

## Follow-up Prompt (Tightening the loop)

```text
Stay within the approved architecture. Respond only with the OUTPUT FORMAT.
- Keep changes minimal and reversible.
- Collapse redundant packages or APIs; avoid new deps unless required.
- Show one small refactor that improves clarity without changing behavior.
```

---

## Example Lovable Exchange
- **You:** “Add a payments settings page; React frontend uses `GET`/`POST /api/payments/settings`; persist securely; follow architecture. Use the OUTPUT FORMAT.”
- **Lovable:** Returns plan, lists new `/backend/src/api/payments/settings.ts`, `/frontend/src/components/payments/SettingsForm.tsx`, tests in `/backend/tests/payments/settings.test.ts`, and commands `npm test --payments`.
- **You:** “Run the codegen and suggest a short TODO list for hardening JWT + TLS.”
- **Lovable:** Provides diffs per layer, adds logging and validation, lists TODOs under Risks/Follow-ups.

---

## Tips & Pitfalls
- Keep the architecture prompt pinned; re-send if the session drifts.
- Ask for diffs per layer to catch leakage between frontend/backend/shared code.
- When Lovable proposes new dependencies, request a justification and a lighter alternative.
- If TypeScript coverage drops, force the assistant to add tests before code is accepted.

---

## References
- Lovable prompting guide: <https://docs.lovable.dev/prompting/prompting-one>
