<img src="../assets/other/self-evolving-ai.png" alt="Google ADK Self-Evolving Agents" width="80%">

# Self-Evolving AI: Scaling Autonomy with Google ADK and Agent Skills

## Intent
Build self-evolving agents with Google's Agent Development Kit (ADK) by composing modular, dynamically discovered Agent Skills — enabling agents to extend their own capabilities without redeployment.

## Why It Matters
Traditional agents hardcode all instructions into a single system prompt. As capabilities grow, that prompt becomes bloated, expensive to run, and brittle to change. Agent Skills solve this by treating each capability as a self-contained module that an agent discovers and loads only when needed — the same way a developer installs a library on demand rather than shipping everything upfront.

The result: agents that can **grow new capabilities** by adding a new skill directory, reducing token usage by 70–80%, and enabling teams to evolve agent behaviour independently without touching core agent code.

---

## Core Concepts

### What Is Google ADK?
The [Agent Development Kit](https://google.github.io/adk-docs/) is an open-source, model-agnostic framework for building production-ready AI agents. It is optimized for Gemini but works with other LLMs. ADK provides:

- An **Agent** class for reasoning and routing
- **Tools** as callable Python functions
- **SkillToolset** for packaging and loading skills
- A local dev server and deployment adapters for Cloud Run or Vertex AI

### What Are Agent Skills?
An Agent Skill is a self-contained unit of capability packaged as a `SKILL.md` file plus optional supporting resources. Skills follow the open [agentskills.io](https://agentskills.io/specification) specification.

| Component | Purpose |
| --- | --- |
| **YAML frontmatter** | `name` and `description` fields the agent reads to decide when to use the skill |
| **Markdown body** | Step-by-step instructions, input expectations, output format, guardrails |
| **`scripts/`** | Executable Python or Bash the agent can run |
| **`references/`** | Documentation, SOPs, or API specs loaded on demand |
| **`assets/`** | Templates, sample outputs, or binaries |

### Two Skill Formats

**Inline Skills** — defined in Python; best for always-on, single-purpose rules:
```python
from google.adk.skills import models

inline_skill = models.Skill(
    frontmatter={
        "name": "tone-enforcer",
        "description": "Ensure all customer replies use a warm, professional tone."
    },
    instructions="You are a tone reviewer. Rewrite any reply that is blunt or passive-aggressive...",
    resources=[]
)
```

**Directory-Based Skills** — structured folders; best for complex, team-owned, reusable capabilities:
```
skills/
└── lead-qualification/
    ├── SKILL.md          # instructions + frontmatter
    ├── scripts/
    │   └── score_lead.py
    └── references/
        └── scoring-rubric.md
```

---

## SKILL.md Anatomy

A minimal `SKILL.md` that an ADK agent can discover:

```markdown
---
name: lead-qualification
description: Qualify sales leads and segment them by revenue potential and fit score.
license: Apache-2.0
metadata:
  author: sales-team
  version: "1.0"
---

## Purpose
Systematically evaluate inbound leads before routing to sales.

## Inputs Required
- Company name and industry vertical
- Estimated annual revenue
- Primary use case described by the prospect

## Qualification Steps
1. Score revenue fit (0–10) against ideal customer profile.
2. Score use-case alignment (0–10) against product capabilities.
3. Combine scores: (revenue × 0.6) + (use-case × 0.4).
4. Segment: ≥ 8 = Enterprise, 5–7 = Mid-Market, < 5 = SMB.

## Output Format
```json
{
  "qualified": true,
  "segment": "enterprise",
  "fit_score": 8.6,
  "next_steps": ["schedule discovery call", "send ROI calculator"],
  "notes": "ARR exceeds threshold; use-case matches core product workflow."
}
```

## Guardrails
- Do not adjust revenue figures.
- Escalate to a human when fit_score is between 4 and 5 (borderline cases).
- Decline if prospect has opted out of contact.
```

---

## How Dynamic Skill Discovery Works

ADK uses **progressive disclosure** — agents load skill context in three stages to minimise token usage:

| Stage | What loads | When it happens |
| --- | --- | --- |
| **1 — Metadata** | `name` + `description` only | Agent startup |
| **2 — Instructions** | Full `SKILL.md` body | When user intent matches skill description |
| **3 — Resources** | Files from `references/` and `scripts/` | When instructions reference them |

This means an agent with ten skills might use only 1,500 tokens per call instead of 8,000 — because it loads the one relevant skill, not all ten.

---

## Building a Self-Evolving Agent

### Step 1 — Install ADK
```bash
pip install google-adk
```

### Step 2 — Create a Skill Directory
```bash
mkdir -p my_agent/skills/data-summariser
cat > my_agent/skills/data-summariser/SKILL.md << 'EOF'
---
name: data-summariser
description: Summarise tabular data from CSV files into executive-ready bullet points.
---

## Steps
1. Parse the CSV (first row = headers).
2. Identify numeric columns; compute mean, min, max.
3. Flag any column where max > 3× mean (potential outlier).
4. Write a 3–5 bullet summary suitable for a non-technical audience.

## Output
Markdown bullet list, no raw numbers, percentages rounded to one decimal place.
EOF
```

### Step 3 — Load Skills and Wire the Agent
```python
import pathlib
from google.adk import Agent
from google.adk.skills import load_skill_from_dir
from google.adk.tools import skill_toolset

skills_dir = pathlib.Path(__file__).parent / "skills"

skill_toolset_instance = skill_toolset.SkillToolset(
    skills=[
        load_skill_from_dir(skills_dir / "data-summariser"),
        # Add more skills here — the agent discovers them automatically
    ]
)

root_agent = Agent(
    model="gemini-2.5-flash",
    name="analyst-agent",
    description="An analyst that can summarise data, qualify leads, and draft reports.",
    instruction="You are a helpful business analyst. Use the available skills to complete tasks accurately.",
    tools=[skill_toolset_instance],
)
```

### Step 4 — Add a New Skill Without Touching Agent Code
Drop a new folder into `skills/`:
```bash
mkdir -p my_agent/skills/report-drafter
# add SKILL.md with name + description + instructions
```
Restart the agent. It discovers and loads the new skill automatically. No changes to agent code required.

---

## Five Skill Design Patterns

Each pattern is reusable and composable — a Pipeline step can contain a Reviewer, a Generator can open with Inversion.

| Pattern | Analogy | Best For |
| --- | --- | --- |
| **Tool Wrapper** | Cheat sheet for a library | Loading API docs or SDK patterns on demand |
| **Generator** | Form the agent fills in | Producing consistently structured documents |
| **Reviewer** | Rubric with severity levels | Code review, compliance check, QA scoring |
| **Inversion** | Agent interviews you first | Requirements gathering before generating output |
| **Pipeline** | Recipe with mandatory sign-offs | Multi-step workflows where order matters |

### Example: Reviewer Pattern
```markdown
---
name: code-reviewer
description: Review Python code for security, performance, and readability issues.
---

## Review Criteria
For each finding, record: file, line, severity (Critical / Major / Minor), description, suggested fix.

## Severity Definitions
- **Critical**: Security vulnerability or data loss risk. Block merge.
- **Major**: Performance regression or logic error. Require fix before merge.
- **Minor**: Style, naming, or test coverage gap. Fix encouraged, not required.

## Output
Group findings by severity. End with a pass/fail verdict and a one-line rationale.
```

---

## Token Economics

| Approach | Tokens per call (10 skills) | Notes |
| --- | --- | --- |
| All skills in system prompt | ~8,000 | Every call pays the full cost |
| Skills with progressive loading | ~1,500 | Only active skill loaded |
| **Savings** | **~82%** | Compounds over multi-turn conversations |

---

## Self-Evolution Mechanism

An agent becomes self-evolving when skills are:

1. **Versioned independently** — skill teams ship new versions without coordinating with the agent team.
2. **Fetched at runtime** — the agent pulls the latest `SKILL.md` on each invocation, so updated instructions are live immediately.
3. **Created programmatically** — an orchestrator agent can write new `SKILL.md` files based on observed task patterns, expanding the skill library autonomously.
4. **Composed dynamically** — a meta-skill can call sub-skills, enabling emergent multi-step workflows the original developer never explicitly coded.

This mirrors how software engineers extend a codebase with new modules rather than rewriting the core.

---

## Checklist

- [ ] Each skill has a unique `name` and a precise `description` (the agent uses this for routing).
- [ ] Instructions are written in second person ("You are...") with numbered steps.
- [ ] Output format is deterministic (JSON schema or labelled Markdown sections).
- [ ] Guardrails specify at least one decline scenario and one escalation trigger.
- [ ] Skills are grouped by business domain in the `skills/` directory.
- [ ] At least one test prompt covers a missing-input edge case.
- [ ] Token budget is validated — sum of all skill metadata fits in the context window at startup.

---

## References
- [Google ADK Documentation](https://google.github.io/adk-docs/)
- [Skills for ADK Agents — Official Docs](https://google.github.io/adk-docs/skills/)
- [agentskills.io Specification](https://agentskills.io/specification)
- [google/adk-samples — GitHub](https://github.com/google/adk-samples)
- [5 Agent Skill Design Patterns Every ADK Developer Should Know](https://lavinigam.com/posts/adk-skill-design-patterns/)
- [Introducing Skills in ADK — Google Cloud Community](https://medium.com/google-cloud/introducing-skills-in-adk-teach-your-agent-new-tricks-one-skill-at-a-time-be319f9b1917)
- [Google Cloud ADK Quickstart](../05-tools/google-cloud-platform-agents.md)
- [Claude Agent Skills Playbook](./claude-agent-skills.md)
