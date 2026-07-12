---
title: "Test Any Skill Before Installing It"
tags: ["security", "skills", "claude-code", "safety"]
last_updated: "2026-07-12"
---

# Test Any Skill Before Installing It

## Intent

A skill you install into a tool like Claude Code is not passive documentation — it is
instructions the agent will read and act on, plus any scripts it ships. If it came from
a source you don't fully trust, it can try to read your files, exfiltrate data, run hidden
commands, or grab secrets like passwords and API keys. This tutorial gives you a fast,
repeatable **safety check** you can run in about 30 seconds before you ever install a skill.

The idea is simple: **review the skill in a sandboxed, read-only regular chat first, where it
has no access to your machine.** Only once it comes back clean do you move it into an agentic
tool that can actually touch your files.

## Who this is for

Anyone who installs `SKILL.md`-style skills into an agentic coding tool (Claude Code, and
similar) from marketplaces, GitHub repos, gists, or a link a colleague sent — especially when
you didn't write the skill yourself.

---

## Why this matters

A skill is typically a folder containing a `SKILL.md` file (YAML frontmatter + Markdown
instructions) and sometimes helper scripts. When you install it, the agent loads those
instructions into its context and may execute the scripts. A malicious or careless skill can hide:

- Instructions to read files outside the project (`~/.ssh`, `.env`, credential stores)
- Commands that send data to an external server ("post this to…", `curl`, webhooks)
- Hidden or obfuscated shell commands buried in a script
- Prompt-injection text that tries to redirect the agent away from what the skill claims to do
- Requests for passwords, tokens, or API keys

The safest place to inspect all of that is a **regular chat window**, which can read and reason
about pasted text but cannot run commands or reach into your filesystem. That's the sandbox.

---

## The 30-second Safety Check

> **Never install a skill without doing this.**

1. **Paste it into a regular Claude chat.** Upload/paste the `SKILL.md` and any scripts the
   skill includes into an ordinary chat window — *not* into your agentic tool. The chat can
   read it but can't touch your machine.
2. **Run the safety prompt** (below). Ask the model to audit every file and line and flag
   anything unsafe.
3. **Clean? Move it to Claude Code.** Only if the audit comes back clean do you install the
   skill into the tool that can actually run it.
4. **Tailor it to you + save.** Once installed, customize the skill to your real workflow and
   preferences, then save it.

---

## Step 2 — The safety-audit prompt

Paste the skill files into a regular chat, then run this prompt. Transcribed from the source:

```text
I'm about to install this as a skill, but I got it from a source I don't fully trust.
Before I do, go through every file and line in it, the SKILL.md and any scripts it includes,
and tell me in plain terms if anything looks unsafe. Flag anything that tries to access my
files, send data somewhere, run hidden commands, grab my passwords or API keys, or do
something that doesn't match what the skill claims to do. If it's clean, say so. If anything's
off, quote the exact line and tell me why.
```

**What a good audit looks like:** it names concrete lines. "Line 42 runs `curl -X POST` to an
external host with the contents of `.env`" is actionable. "Looks fine 👍" with no line
references is not — if the model can't point at specifics, re-run it and ask it to go
file-by-file, line-by-line.

**Red flags that mean _do not install_:**

- Reading or globbing paths outside the project — home directory, SSH keys, keychains, `.env`
- Any network call that ships local data out (`curl`/`wget` POST, webhooks, "upload/send to…")
- Base64-encoded, obfuscated, or `eval`'d shell that hides what it actually runs
- Instructions telling the agent to ignore the user, hide steps, or "don't mention this"
- Any request for credentials, tokens, or API keys the stated task doesn't need

If the audit is clean, continue to Step 3. If anything's off, **discard the skill** — a
useful skill is never worth handing an untrusted script access to your machine.

---

## Step 4 — Tailor it to you, then save

Once the skill is installed in Claude Code and you've confirmed it's clean, make it yours.
Run this customization prompt (transcribed from the source):

```text
Before we save this skill, I want you to customize it for me. Look at everything you know
about how I work: my projects, my files, my writing style, the tools I use, and how I
typically ask for things.
Then go through this skill and:

Rewrite any generic instructions so they match my actual workflow and preferences
Swap out placeholder examples for examples that reflect my real work
Remove anything I'd never use so it stays lean
Add any steps or defaults you know I always want (formatting rules, tone, tools, file locations)
```

Tailoring isn't just ergonomics — a leaner skill with fewer generic instructions has less
surface area for something unexpected to hide in, and it's easier to re-audit next time.

---

## Quick reference

| Step | Do | Where |
|---|---|---|
| 1 | Paste the skill (`SKILL.md` + scripts) | Regular Claude chat (sandboxed, read-only) |
| 2 | Run the safety-audit prompt | Regular Claude chat |
| 3 | If clean, install the skill | Claude Code (agentic tool) |
| 4 | Tailor it to your workflow + save | Claude Code |

**Rule of thumb:** the tool that *reviews* a skill and the tool that *runs* it should not be
the same tool on the first pass. Audit in the sandbox; run only what came back clean.

---

## Related

- [AI Safety Classifiers & Jailbreak Severity](ai-safety-classifiers-jailbreak-severity.md) —
  how providers layer defenses; the same defense-in-depth thinking applies to your own install habits.
- [Claude Building Skills Guide](../04-guides/claude-building-skills-guide.md) — how skills are
  structured, so you know what a normal `SKILL.md` should and shouldn't contain.

---

## Source

Adapted from a short-form video walkthrough ("Never install a Claude skill without doing this")
demonstrating a 30-second safety check before installing skills into Claude Code. The two
prompts above are transcribed verbatim from that walkthrough.
