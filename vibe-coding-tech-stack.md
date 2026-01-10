# Vibe Coding Tech Stack Tutorial

## Transcription

Every app I vibe code has the tech stack below

Easy for beginners and free to start

If you've never built an app before, just paste this list into Claude Code and you'll be good to go:

Web framework: NextJS  
Hosting: Vercel  
Database: Supabase  
Auth: Clerk  
Payments: Stripe  
Styling: Tailwind  
AI: logic- OpenAI, creativity- Claude, cheap tasks- Gemini Flash 3  
Emails: Resend  
AI I use to build it all: Claude Code

Any questions let me know!

## Tutorial: Building with the Vibe Coding Stack

This tutorial walks through a beginner-friendly stack for building and shipping a modern web app. Each tool below has a specific role, and the links point to the official website or a reference page so you can learn more.

### 1. Web Framework: Next.js

Start by creating your app with [Next.js](https://en.wikipedia.org/wiki/Next.js), a React framework that gives you routing, server rendering, and deployment-friendly defaults.

**Quick start:**

```bash
npx create-next-app@latest
```

### 2. Hosting: Vercel

Deploy the app on [Vercel](https://vercel.com/), which has first-class support for Next.js and makes preview deployments painless.

**Tip:** Connect your GitHub repo and Vercel will build and deploy on every push.

### 3. Database: Supabase

Use [Supabase](https://supabase.com/) for a hosted Postgres database, instant APIs, and built-in auth if you want it.

**Tip:** Create a project, then grab your database URL and API keys from the dashboard.

### 4. Authentication: Clerk

Add authentication with [Clerk](https://clerk.com/), which provides drop-in UI components and SDKs for Next.js.

**Tip:** Use Clerk’s Next.js integration to protect routes and show user profiles.

### 5. Payments: Stripe

Handle payments with [Stripe](https://stripe.com/), a widely used platform for subscriptions and one-time charges.

**Tip:** Start with Stripe Checkout to avoid building a custom payment UI.

### 6. Styling: Tailwind CSS

Style your app using utility classes from [Tailwind CSS](https://tailwindcss.com/).

**Quick start:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 7. AI Tools

Pick the right model for the job:

- **Logic:** [OpenAI](https://openai.com/) for reasoning-heavy tasks.
- **Creativity:** [Claude](https://www.anthropic.com/claude) for writing and ideation.
- **Cheap tasks:** [Gemini](https://gemini.google.com/) (Gemini Flash 3) for cost-sensitive workloads.

### 8. Emails: Resend

Send transactional emails via [Resend](https://resend.com/), which is developer-friendly and straightforward to integrate.

**Tip:** Start with the free tier and use their API to send confirmation or notification emails.

### 9. AI Coding Assistant: Claude Code

Use [Claude Code](https://www.anthropic.com/) as your AI coding assistant to scaffold features, refactor code, and generate boilerplate quickly.

---

## Suggested Build Order

1. Scaffold the Next.js app.
2. Set up deployment on Vercel.
3. Add Supabase and connect your database.
4. Integrate Clerk authentication.
5. Wire up Stripe payments.
6. Style with Tailwind CSS.
7. Add email sending with Resend.
8. Use AI tools for content, logic, or automation.

With this stack, you can ship quickly, keep costs low, and scale your app over time.
