# Vibe Coding Tech Stack Tutorial

## Intent
Provide a beginner-friendly, low-friction stack and build order for shipping a modern web app with AI support.

## Use when
- You want a proven default stack for a full-stack web app.
- You prefer managed services over custom infrastructure.
- You want to ship fast with an AI coding assistant.

## Stack snapshot
| Layer | Tool | Why it fits |
| --- | --- | --- |
| Web framework | [Next.js](https://nextjs.org/) | Full-stack React with routing, SSR, and deployment-friendly defaults. |
| Hosting | [Vercel](https://vercel.com/) | Zero-config deploys with preview URLs. |
| Database | [Supabase](https://supabase.com/) | Hosted Postgres with instant APIs. |
| Auth | [Clerk](https://clerk.com/) | Drop-in auth UI and Next.js SDKs. |
| Payments | [Stripe](https://stripe.com/) | Subscriptions and one-time payments. |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling with fast iteration. |
| Email | [Resend](https://resend.com/) | Simple transactional email API. |
| AI models | [OpenAI](https://openai.com/chatgpt) for logic, [Claude](https://www.anthropic.com/claude) for creativity, [Gemini](https://ai.google.dev/gemini-api) for low-cost tasks | Pick by task and budget. |
| AI coding assistant | [Claude Code](https://www.anthropic.com/claude-code) | Fast scaffolding, refactors, and boilerplate. |

## Suggested build order
1. Scaffold the Next.js app.
2. Commit and push to GitHub.
3. Connect Vercel for preview deploys.
4. Add Supabase and wire database access.
5. Integrate Clerk auth and protect routes.
6. Wire Stripe for billing.
7. Add Tailwind for UI styling.
8. Add Resend for transactional emails.
9. Use AI models for content, logic, and automation tasks.

## Setup notes by tool
### Next.js
- Run `npx create-next-app@latest` and choose TypeScript and ESLint.
- Keep the app directory structure simple while you prototype.

### Vercel
- Connect the GitHub repo and enable preview deploys.
- Add environment variables in Vercel to match local `.env`.

### Supabase
- Create a project and copy the database URL and API keys.
- Use the SQL editor for schema setup before building UI.

### Clerk
- Follow the Next.js integration guide and protect routes early.
- Start with hosted sign-in and user profile components.

### Stripe
- Use Stripe Checkout for the first release.
- Keep webhooks scoped to the minimum events you need.

### Tailwind CSS
- Install Tailwind or enable it during Next.js setup.
- Start with a small design system (colors, spacing, type scale).

### Resend
- Verify a sender domain before sending production emails.
- Use a single template for receipts or onboarding at first.

### AI models
- Logic: OpenAI for reasoning-heavy tasks and tool integration.
- Creativity: Claude for writing, UX copy, and ideation.
- Low-cost tasks: Gemini Flash 3 for bulk or draft work.

### Claude Code
- Use it to scaffold flows, refactor, and generate boilerplate.
- Keep tasks small and provide clear acceptance criteria.

## Starter prompt (copy-ready)
Use this with Claude Code or another coding assistant.

```text
Project: <PROJECT_NAME>
Goal: <ONE_SENTENCE_PRODUCT_BRIEF>
Users: <PRIMARY_USER_SEGMENT>
Requirements:
- Use Next.js + Vercel + Supabase + Clerk + Stripe + Tailwind + Resend.
- Follow the suggested build order.
- Produce commands, environment variables, and a short TODO list.

Deliver the plan and the first scaffold steps.
```

## OUTPUT FORMAT
Provide the response in Markdown with:
1. Stack confirmation (bullets)
2. Commands to run (code block)
3. Environment variables (list)
4. Setup checklist by service (bullets)
5. Next 3 TODOs (numbered list)

## Example output (truncated)
```text
Stack confirmation:
- Framework: Next.js
- Hosting: Vercel

Commands to run:
npx create-next-app@latest my-app

Environment variables:
- NEXT_PUBLIC_SUPABASE_URL=...
- SUPABASE_SERVICE_ROLE_KEY=...
```

## References
- https://nextjs.org/
- https://vercel.com/
- https://supabase.com/
- https://clerk.com/
- https://stripe.com/
- https://tailwindcss.com/
- https://resend.com/
- https://openai.com/chatgpt
- https://www.anthropic.com/claude
- https://ai.google.dev/gemini-api
- https://www.anthropic.com/claude-code
