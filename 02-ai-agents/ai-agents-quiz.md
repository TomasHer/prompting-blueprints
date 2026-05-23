# AI Agents Quiz — 20 Questions

Test your understanding of AI agent architectures, skills, context engineering, protocols, and production design. Questions range from foundational concepts to research-backed surprises. Answers are at the bottom — no peeking!

---

## Questions

---

### Part 1: Foundations

**Q1. True or False: A 1-million-token context window should be filled as much as possible to give the agent maximum information.**

**Q2. Rank these three AI-workflow levels from least to most autonomous:**

- Vibe-Coding
- Agentic Coding
- AI-Assisted Coding

**Q3. Match each agent type to its best description:**

| Agent Type | Description |
|---|---|
| A. Retrieval Agent | 1. Executes long-horizon tasks with dynamic planning |
| B. Task Agent | 2. Grounds answers in fresh data |
| C. Autonomous Agent | 3. Automates predictable, multi-step workflows |

**Q4. A 350-million-parameter model fine-tuned specifically for tool-calling was benchmarked on ToolBench. What did it score — and what does that result challenge?**

*(Hint: think about "bigger is always better.")*

**Q5. According to the 7-step production framework, which step comes immediately after choosing the right model?**

A) Connect Tools  
B) Divide Memory  
C) Choose the Right Framework  
D) Test and Evals

---

### Part 2: Skills

**Q6. What are the three required frontmatter fields in a minimal SKILL.md file?**

*(Choose the correct set)*

A) `name`, `description`, `version`  
B) `name`, `description` *(only these two are required)*  
C) `name`, `description`, `author`  
D) `name`, `description`, `allowed-tools`

**Q7. Progressive disclosure loads a skill in three stages. Put them in the correct order:**

- Full instruction body (~5,000 tokens)
- Sibling resource files loaded on demand (unlimited)
- YAML frontmatter metadata (~100 tokens)

**Q8. Scenario — Which skill design pattern fits each situation?**

| Situation | Pattern |
|---|---|
| A. "Store this file — large files go to S3, collaborative docs to Notion, code to GitHub" | 1. Sequential Workflow Orchestration |
| B. "Draft a report, review it, refine it, repeat until quality threshold is met" | 2. Context-Aware Tool Selection |
| C. "Create account → set up payment → create subscription → send welcome email" | 3. Iterative Refinement |

**Q9. True or False: A SKILL.md file written for Claude Agent Skills can be used directly in VS Code GitHub Copilot Agent mode without conversion.**

**Q10. A 10-skill catalog uses full preloading vs. progressive disclosure. What is the approximate token difference per call?**

A) 500 vs. 100 tokens  
B) 8,000 vs. 1,500 tokens  
C) 50,000 vs. 10,000 tokens  
D) No meaningful difference

---

### Part 3: Context & Memory

**Q11. Context engineering and prompt engineering are different disciplines. Which statement correctly distinguishes them?**

A) Prompt engineering is for multi-turn agents; context engineering is for single-turn queries.  
B) Prompt engineering shapes a single query; context engineering continuously curates the entire information environment the agent sees.  
C) Context engineering is just prompt engineering with RAG added.  
D) They are the same thing under different names.

**Q12. A research study from ETH Zurich (arXiv 2602.11988) tested the impact of AGENTS.md files on agent success rates. What did they find? (Select all that apply)**

A) LLM-generated AGENTS.md files reduced success rates by 0.5–3 percentage points  
B) Developer-written minimal AGENTS.md files raised success rates by ~4 percentage points  
C) Cost overhead from AGENTS.md files was negligible  
D) The agents were "too obedient" — they followed every instruction even when irrelevant  

**Q13. Fill in the blank:**

MemPalace achieves ___% R@5 on LongMemEval — described as the highest-ever benchmarked score — while being completely _______ and costing roughly ______ per year.

**Q14. What are the four memory tiers in AgentMemory (from most immediate to most persistent)?**

**Q15. According to the context window performance data, at what context size does GPT-5.4's needle-in-haystack accuracy drop below 40%?**

A) 128K tokens  
B) 256K tokens  
C) 512K–1M tokens  
D) It doesn't drop below 40% at any size

---

### Part 4: Protocols

**Q16. MCP (Model Context Protocol) uses which communication format?**

A) REST + XML  
B) GraphQL  
C) JSON-RPC over stdio or WebSockets  
D) gRPC

**Q17. What are the three core MCP primitives — the building blocks that every MCP server exposes?**

**Q18. In the A2A (Agent-to-Agent) protocol, what is an "Agent Card"?**

A) A credit-card-style API key identifying the agent  
B) A machine-readable profile advertising the agent's identity, capabilities, and endpoints  
C) A log entry recording what one agent told another  
D) A visual UI card displayed to the end user

---

### Part 5: Production & Architecture

**Q19. You are building a new AI agent. The task involves high-stakes financial decisions and irreversible database writes. What architectural element does the 7-step framework say you must explicitly define for this scenario?**

A) A second LLM for verification  
B) Human-in-the-Loop (HITL) checkpoints  
C) A dedicated logging MCP server  
D) Streaming output to reduce latency

**Q20. Scenario question — Hard mode:**

Your team has been running an agent in production for two months. You notice:
- The agent is getting slower and more expensive over time
- It occasionally ignores instructions that were working fine last month
- A junior dev suggests "we should upgrade to a model with a bigger context window"

Based on what you've learned, what is the most likely root cause, and what is the *correct* fix?

*(Write a short answer — there is no multiple choice here)*

---

## Answers

<details>
<summary>Click to reveal all answers</summary>

---

**A1. FALSE.**  
Bigger context ≠ better performance. Empirical data shows GPT-5.4 drops from 97.3% accuracy at 4–8K tokens to 36.6% at 512K–1M. The goal is *small, focused context* — fill only what the agent actually needs right now. Larger windows are a ceiling, not an operating target.

---

**A2. Least → Most Autonomous:**
1. Vibe-Coding (speed/prototyping, minimal developer control)
2. AI-Assisted Coding (real-time suggestions, developer stays in control)
3. Agentic Coding (agent plans, codes, tests, refines with minimal supervision)

*(Note: Vibe-Coding appears least autonomous to the developer, but the AI is actually doing more unsupervised generation — the distinction is about developer oversight vs. agent planning depth.)*

---

**A3.**
- A → 2 (Retrieval: grounding in fresh data)
- B → 3 (Task: predictable multi-step workflows)
- C → 1 (Autonomous: dynamic long-horizon planning)

---

**A4.** It scored **77.55% on ToolBench** — outperforming much larger generalist models (20–500× its size). This challenges the assumption that bigger models are always better. For tool-calling specifically, a small *specialist* model fine-tuned for the job beats a large generalist.

---

**A5. C) Choose the Right Framework**

The 7 steps in order: Goal → Model → **Framework** → Tools → Memory → Context → Evals.

---

**A6. B) Only `name` and `description` are required.**

`version`, `author`, `allowed-tools`, and `license` are all optional. Keep the minimal footprint — only add frontmatter fields you actually need.

---

**A7. Correct order:**
1. YAML frontmatter metadata (~100 tokens) — always loaded at startup
2. Full instruction body (~5,000 tokens) — loaded when intent matches
3. Sibling resource files on demand (unlimited) — fetched only if the skill needs them

---

**A8.**
- A → 2 (Context-Aware Tool Selection: same goal, different tool depending on input characteristics)
- B → 3 (Iterative Refinement: review-and-revise loop until quality criteria met)
- C → 1 (Sequential Workflow Orchestration: fixed order, each step feeds the next)

---

**A9. TRUE.**  
As of VS Code 1.97, Claude SKILL.md maps directly to VS Code Copilot Agent mode skills — the same file works for both without conversion. Both platforms use the same frontmatter schema and progressive disclosure model.

---

**A10. B) 8,000 vs. 1,500 tokens**

A 10-skill catalog with progressive disclosure uses ~1,500 tokens per call vs. ~8,000 with full preload — roughly an **82% token savings**.

---

**A11. B** — Prompt engineering shapes a single query; context engineering continuously curates the *entire* information environment (memory, tools, data, schemas, timing) across the full agent lifecycle.

---

**A12. A, B, and D are all correct. C is wrong.**

- LLM-generated AGENTS.md → **-0.5 to -3 percentage points** success rate
- Developer-written minimal AGENTS.md → **+4 percentage points** success rate
- Cost overhead was **+19–23%** regardless of file quality (C is false)
- Agents were "too obedient" — following every instruction even when irrelevant to the task

---

**A13.**

MemPalace achieves **96.6%** R@5 on LongMemEval — completely **local (free, private)** — costing roughly **~$10** per year (vs. $500+ for LLM-summarization approaches).

---

**A14. Four memory tiers (most immediate → most persistent):**

1. **Working** — immediate/in-session context
2. **Episodic** — session summaries
3. **Semantic** — compressed, distilled facts
4. **Procedural** — skills and patterns learned over time

---

**A15. C) 512K–1M tokens**

Accuracy collapses to **36.6%** in that range — a 40+ percentage point drop from the 97.3% baseline at 4–8K. This is why large contexts are dangerous without careful curation.

---

**A16. C) JSON-RPC over stdio or WebSockets**

MCP is built on JSON-RPC for structured messaging. The transport layer is typically stdio for local servers and WebSockets for remote ones.

---

**A17. The three MCP primitives:**

1. **Tools** — actions the agent can invoke
2. **Resources** — readable artifacts (files, database results, etc.)
3. **Prompts** — reusable prompt snippets the agent can reference

---

**A18. B) A machine-readable profile advertising the agent's identity, capabilities, and endpoints.**

An Agent Card is A2A's "business card" for agents — it lets other agents discover what a given agent can do and how to call it, enabling standardized agent-to-agent discovery.

---

**A19. B) Human-in-the-Loop (HITL) checkpoints**

The framework explicitly says: identify HITL points for **irreversible actions and high-stakes decisions** as part of goal definition (Step 1). Upgrading to a larger model or adding logging won't prevent a bad irreversible write — a human approval gate does.

---

**A20. Root cause: Context bloat.**

Over two months, the agent's context window has grown — conversation history, tool results, and accumulated instructions are filling up, pushing critical guidance into the "forgotten middle." The junior dev's instinct to use a bigger context window would make this *worse*, not better.

**Correct fixes:**
- Audit what's in the context — strip stale history, old tool results, and redundant instructions
- Switch to **just-in-time retrieval** rather than preloading everything
- Spin up **sub-agents with smaller, focused contexts** for distinct subtasks
- Set context size warnings (~100K = warning, ~200K = compact, ~400K = spawn fresh agent)
- Rewrite any LLM-generated AGENTS.md or system prompt bloat with a minimal, developer-curated version

The core lesson: more context ≠ better performance. Focused context = reliable agent.

</details>

---

## Scoring

| Score | Level |
|---|---|
| 18–20 | Agent Architect — you're ready to ship to production |
| 14–17 | Senior Builder — solid foundations, sharpen your context engineering |
| 10–13 | Practitioner — revisit the Skills and Context sections |
| 6–9 | Apprentice — start with the Foundations section |
| 0–5 | Explorer — the whole `02-ai-agents` folder is waiting for you |
