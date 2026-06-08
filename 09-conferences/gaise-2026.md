---
title: "GAISE 2026 — Conference Notes"
tags: ["conferences", "gaise", "ai", "software-engineering"]
last_updated: "2026-06-07"
---

# GAISE 2026 — Tampere, Finland

## Event Introduction

**GAISE 2026 (Generative AI in Software Engineering)** took place on **1–3 June 2026** at **Tampere University, Finland**, hosted by [GPT-Lab](https://gpt-lab.eu/about-us/our-team/) — a generative-AI research lab founded by Professor Pekka Abrahamsson.

Across three days, the program explored how artificial intelligence is reshaping software engineering and organizations, structured around three thematic areas:

- **Monday, 1 June — Autonomous AI Systems** (Academic & Industry Tracks)
- **Tuesday, 2 June — AI-Native World** (Academic, Industry & Executive Tracks)
- **Wednesday, 3 June — Responsible AI Era** (Academic & Industry Tracks)

These are my personal notes from the sessions I attended.

**Links:** [Full program](https://gpt-lab.eu/gaise26-program/) · [Speakers](https://gpt-lab.eu/gaise26-speakers/) · [Organizer: GPT-Lab](https://gpt-lab.eu/about-us/our-team/)

<img src="../assets/conferences/gaise-2026/event-photo.png" alt="GAISE 2026 — Tampere University">

<!-- VIDEO PLACEHOLDER — replace the URL below with the YouTube link once available -->
<!-- <a href="https://www.youtube.com/watch?v=VIDEO_ID"><img src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" alt="GAISE 2026 — Conference Highlight Video"></a> -->

---

## Day 1 — Monday, 1 June 2026

### Theme: Autonomous AI Systems · Academic & Industry Tracks

### 🎤 Conference Opening

<img src="../assets/conferences/gaise-2026/day1/01-opening/IMG_0993.jpg" alt="GAISE 2026 — Conference Opening">

GAISE 2026 kicked off with a warm welcome from Prof. Pekka Abrahamsson and Virve Yli-Savola of GPT-Lab at Tampere University. They opened the summer school, set the stage for three days exploring how AI is reshaping software engineering, and introduced the program ahead.

### 🛠️ Workshop — Agent-first IDEs by Tomas Herda & Agnes Lipovits, Austrian Post Business Solutions

<img src="../assets/conferences/gaise-2026/day1/03-tomas/tomas1.png" alt="Agent-first IDEs — workshop by Tomas Herda & Agnes Lipovits">

To kick off the session, we presented [#DAiTA — Intelligent Document Processing](https://www.post.at/en/g/c/daita) — Austrian Post Business Solutions' platform for AI-powered automation of business document workflows — as a real-world example of applied AI in enterprise operations.

<img src="../assets/conferences/gaise-2026/day1/03-tomas/IMG_8144.png" alt="Agent-first IDEs Workshop — Tomas Herda & Agnes Lipovits">

The way we build software is changing rapidly. Modern Agent-first IDEs and coding agents such as Kiro, Google Antigravity, Cursor, Windsurf, and Claude Code no longer just autocomplete code — they can plan, implement, test, debug, and validate changes autonomously across entire repositories. At the same time, the industry is moving from prompt-driven coding toward **spec-driven autonomous engineering**, where agents execute structured specifications, constraints, and acceptance criteria instead of relying on ad-hoc prompts alone.

This hands-on workshop introduced the key concepts behind reliable AI-assisted development: Context Engineering, reusable Skills, AGENTS.md, MCP (Model Context Protocol), and persistent AI knowledge bases (wikis) that let agents accumulate and reuse project knowledge across sessions. The first half covered the concepts and tooling behind agent-first development; the second half was fully practical — participants built and experimented with a working setup directly on their own laptops.

<img src="../assets/conferences/gaise-2026/day1/03-tomas/IMG_1171.heic" alt="Agent-first IDEs Workshop — Tomas Herda">

**Interesting observations**

- **Context over cleverness.** The session anchored on a line from Andrej Karpathy: *"90% of Claude's mistakes come from missing context, not a weak model."* Most failures aren't model failures — they're context failures.
- **Context engineering vs. prompt engineering.** The analogy ran throughout: entire environment info vs. a single query, a screenplay vs. a sticky note, a complete system (docs, examples, rules, patterns, guardrails) vs. clever wording, continuous curation vs. a one-time instruction — memory, tools, data, schemas, and project context vs. a few few-shot examples. See [Context Engineering](https://github.com/TomasHer/prompting-blueprints/blob/main/02-ai-agents/03-context-and-memory/context-engineering.md).
- **Prompting patterns still matter.** A tour through reusable prompting patterns — Persona, Question Refinement, Flipped Interaction, Chain-of-Thought, Zero-Shot, and Few-Shot — and how each fits reasoning LLMs ([Effective prompts for reasoning LLMs](https://gpt-lab.eu/effective-prompts-for-reasoning-llms/)).
- **What makes an IDE *agentic*?** The components: Repository, Chat Window, Agent Configuration, Agent Orchestration, Agent Definitions, Skills, MCP & Tools, and Human-in-the-loop.
- **AGENTS.md.** An introduction to the AGENTS.md convention and a reusable template for steering agents with project context ([Agent context window & performance](https://github.com/TomasHer/prompting-blueprints/blob/main/02-ai-agents/03-context-and-memory/agent-context-window-performance.md)).
- **Anatomy of a Skill.** How reusable Skills are structured and how they tie back into context engineering ([Anatomy of a Skill](https://github.com/TomasHer/prompting-blueprints/blob/main/02-ai-agents/02-skills/anatomy-of-a-skill.md)).
- **Personal AI knowledge base.** A live use case built with Obsidian + MCP (or the open-source alternative [Logseq](https://logseq.com)), echoing Karpathy's own AI knowledge-base workflow ([AI knowledge base tutorial](https://github.com/TomasHer/prompting-blueprints/blob/main/02-ai-agents/03-context-and-memory/ai-knowledge-base-tutorial.md#implementation-claude-obsidian)). Demonstrated by building a **Product Owner handbook** and walking through [Prompting Blueprints](https://github.com/TomasHer/prompting-blueprints) — my personal AI knowledge base.
- **Hands-on: AI Bug Detective.** The interactive part put predefined agents and skills to work in a Replit project — [AI Bug Detective](https://replit.com/@laxxli/ai-bug-detective).

<img src="../assets/conferences/gaise-2026/day1/03-tomas/IMG_1178.heic" alt="AI Bug Detective — hands-on session">

### 🎤 Keynote — When Software Stops Waiting: Life in Autonomous AI Systems by Alex Polyakov, CEO @ ProjectSimple

<img src="../assets/conferences/gaise-2026/day1/02-keynote/keynote1.png" alt="When Software Stops Waiting — keynote by Alex Polyakov">

AI is changing far more than how code is written — software systems are starting to observe, decide, and act with ever less human involvement. Tracing the thread back to *"The first AI-Assisted Agile Software Engineering workshop"* he ran with Prof. Pekka Abrahamsson at XP Amsterdam on 13 June 2023, Alex Polyakov walked through what is already **dead**, what is rapidly **dying**, and what stays **very much alive** in the age of autonomous AI systems. His core message: agents make the coding fast, but the value — and the bottleneck — now lives in human judgment, ownership, and the checkpoints that keep autonomy honest.

<img src="../assets/conferences/gaise-2026/day1/02-keynote/keynote2.HEIC" alt="Human-in-the-Loop vs. Autonomous Agents — where agents struggle without human checkpoints">

**Interesting observations**

- **Autonomous agents cut both ways.** Done right they deliver real gains — ~50% faster cycle time, ~35% fewer open bugs, ~40% more test coverage, ~60% faster incident recovery, and ~80% fresher docs. Done wrong, the failure modes are severe: deleted production databases, secrets logged in plain text, read-only modes overridden, and safety/approval loops bypassed.
- **Human-in-the-Loop is what closes those gaps.** Practices like work decomposition, iterative delivery, code review, a shared definition of done, requirement clarification, acceptance testing, architectural decision records, pair programming, and reversible rollbacks are exactly where agents fall short.
- **Where autonomous agents struggle (mostly high-severity):** scope drift, front-loaded execution, self-review blind spots, completion uncertainty, silent assumption propagation, teaching to the test, no rationale memory, asymmetric dialogue (they can't push back), and irreversibility blindness.
- **The Agile lesson still holds:** the more work is in progress, the slower it gets done. AI accelerates output, but human bottlenecks create the wait — Alex framed it via Kent Beck's Theory of Constraints ("see where the bags are piling up") and a baggage-claim metaphor: AI coding is *fast*, while human-in-the-loop and review/approve are the *waiting* states where work piles up.
- **Backlog thought experiment:** he contrasted how the backlog of **1 person + a 24/7 autonomous AI** looks versus **5 devs using human-in-the-loop** — output isn't the constraint, the human review states are.
- **Dead, Dying, Very Much Alive game** — Dead: PR-less merge, manual test generation, Scrum, the "10x developer." Dying: hand-coding, code ownership, line-by-line PR review. Very much alive: architectural design, Agile, product managers, and software engineers.
- **Five takeaways:**
<br>(1) autonomous agents aren't new — hallucination without judgment has always changed outcomes, and model size doesn't fix it;
<br>(2) human-in-the-loop beats full autonomy for now;
<br>(3) complex work needs more than intelligence — architecture, prioritization, naming, and incident calls stay human;
<br>(4) the biggest value is **Intelligent Automation (IA)**, reached through contextual awareness rather than bigger models;
<br>(5) **tokens are the new currency**, but AI commoditization is inevitable — ask what's optimizing whom.
- **Some memorable lines and data points:** *"Early bird gets the worm, but the second mouse gets the cheese."* On average **65% of a team's work is unplanned**, **token usage is the new KPI**, and — most pointedly — *"You cannot delegate ownership: let the people decide what we work on, describe the problem, and let the team solve the issue."*

### 🎓 Academic Talk — Generative AI in Software Engineering: Progress & Open Questions by Muhammad Waseem, PhD

<img src="../assets/conferences/gaise-2026/day1/04-waseem/IMG_7696.JPG" alt="Generative AI in Software Engineering — Progress & Open Questions by Muhammad Waseem, PhD">

A state-of-the-art academic survey of where generative AI in software engineering actually stands. Muhammad Waseem traced the long arc of "the end of hand-written code," mapped today's tooling landscape, laid out the research methods the community uses to measure real impact, and closed with a working artifact — a multi-agent refactoring tool — as a concrete example of workflow-level AI assistance. The throughline: capability is real and layered, but the open questions are about how we *rigorously* measure value, trust, and security.

**Interesting observations**

- **A short history — every era was promised the end of hand-written code.**

<img src="../assets/conferences/gaise-2026/day1/04-waseem/waseem1.png" alt="A short history — every era was promised the end of hand-written code">

- **The GenAI tooling ecosystem is an 8-layer stack.**

<img src="../assets/conferences/gaise-2026/day1/04-waseem/waseem2.png" alt="The GenAI tooling ecosystem is an 8-layer stack">

- **Research approaches — seven ways to study GenAI's real impact. Each method maps to what it can actually measure.**

<img src="../assets/conferences/gaise-2026/day1/04-waseem/waseem4.png" alt="Research approaches — seven ways to study GenAI's real impact">

- **RENDRI-R: a multi-agent tool for Java code refactoring.**

<img src="../assets/conferences/gaise-2026/day1/04-waseem/waseem3.png" alt="RENDRI-R: a multi-agent tool for Java code refactoring">

### 🛠️ Workshop — Vibing Ideas: Knowing What to Build When AI Does the Rest by Prof. Xiaofeng Wang, Daniel Planötscher & Silvia Cortesia, LUT University / Free University of Bozen-Bolzano

<img src="../assets/conferences/gaise-2026/day1/05-xiaofeng/IMG_6619.HEIC" alt="Vibing Ideas: Knowing What to Build When AI Does the Rest — workshop by Prof. Xiaofeng Wang, Daniel Planötscher & Silvia Cortesia">

*"If coding really is solved, the bottleneck moves to taste, judgment, and knowing what is worth building."* This hands-on workshop reframed AI not as a faster way to write code, but as a **thinking partner** — a collaborator for navigating ambiguity, surfacing real user needs, and shaping rough ideas into solutions actually worth building. Once implementation stops being the constraint, the hard part becomes deciding *what* to build and *why*, and the workshop put that judgment front and center.

**Interesting observations**

- **The bottleneck has moved upstream.** When AI handles the "how," value concentrates in the "what" and "why" — taste, judgment, and problem framing become the scarce skills.
- **AI as a thinking partner, not a code generator.** Used well, AI helps explore the problem space, challenge assumptions, and pressure-test ideas before any code is written.
- **Navigating ambiguity is the real work.** Surfacing latent user needs and turning fuzzy, ill-defined problems into something concrete enough to act on is where the leverage lives.
- **From ideas to solutions worth building.** The hands-on portion practiced shaping and prioritizing ideas — separating what's *possible* from what's *worth doing*.

---

## Day 2 — Tuesday, 2 June 2026

### Theme: AI-Native World · Academic, Industry & Executive Tracks

---

## Day 3 — Wednesday, 3 June 2026

### Theme: Responsible AI Era · Academic & Industry Tracks

### 🎤 Conference Closing

<!-- CLOSING PHOTO PLACEHOLDER -->
<img src="../assets/conferences/gaise-2026/day3-closing.jpg" alt="GAISE 2026 — Conference Closing">

A heartfelt thank you to everyone who made GAISE 2026 possible. The **GPT-Lab team** at Tampere University created an outstanding program that brought together researchers, practitioners, and executives from across the AI and software-engineering community.

Special recognition goes to the main organizers — **Vaishnavi Bankhele** and **Virve Yli-Savola** — whose meticulous planning and tireless effort ensured the event ran smoothly from the first keynote to the final session. Equal thanks to all the **volunteers** who handled registration, logistics, and the countless behind-the-scenes tasks that keep a multi-track conference on track.

Your work gave everyone in the room the space to focus on learning and connecting. Thank you.

---

*Notes by Tomas Herda. Connect on [LinkedIn](https://www.linkedin.com/in/herdatom).*
