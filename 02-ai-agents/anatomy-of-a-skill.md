---
title: "Anatomy of a Claude Agent Skill"
tags: ["agents", "claude-agent", "skills"]
last_updated: "2026-04-23"
---

# Anatomy of a Claude Agent Skill

Claude Agent Skills are modular capability packages — self-contained folders that bundle instructions, scripts, and resources so Claude can load exactly what it needs for a specialised task. This tutorial dissects every layer of a skill, from the two-line template up to multi-file bundles, using real examples from the official [anthropics/skills](https://github.com/anthropics/skills) repository.

---

## What Is a Skill?

A skill is a **folder** that Claude loads dynamically at runtime. At minimum it contains one file — `SKILL.md` — but it can grow to include helper scripts, reference documents, data files, and additional markdown guides.

Skills replace the practice of copy-pasting long instructions into every agent system prompt. Instead you package the instructions once, version them, and attach them to any agent that needs them.

### Why skills beat inline instructions

| Approach | Reusability | Maintainability | Context cost |
|---|---|---|---|
| Inline system prompt | Per-agent copy | Edit every agent | Always loaded |
| Skill folder | Attach to any agent | Edit once | Loaded on demand |

---

## The Minimal Skill

The official template from `template/SKILL.md` in the repository is deliberately sparse:

```markdown
---
name: template-skill
description: Replace with description of the skill and when Claude should use it.
---

# Insert instructions below
```

Two sections. That is all Claude requires.

### YAML Frontmatter

The frontmatter block between the `---` delimiters is loaded first, before any instructions. It provides the metadata Claude uses to decide whether to activate the skill at all.

```yaml
---
name: pdf
description: Comprehensive PDF toolkit for extracting text and tables,
  merging/splitting documents, and filling-out forms.
---
```

| Field | Constraint | Purpose |
|---|---|---|
| `name` | max 64 chars, lowercase / numbers / hyphens | Machine identifier; used in API calls and `/plugin install` commands |
| `description` | max 1024 chars | Natural-language trigger; Claude reads this to decide when the skill applies |

**Write the description as a usage hint, not a feature list.** Claude matches user intent against descriptions. "Use this skill when the user needs to read, create, merge, split, or fill PDF documents" outperforms "PDF operations toolkit."

### Markdown Body

Everything after the frontmatter is the instruction document — plain GitHub-flavoured Markdown. Use headings, bullet lists, fenced code blocks, and tables exactly as you would in any documentation file.

```markdown
## Quick Start

\`\`\`python
from pypdf import PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")
\`\`\`

## Operations

- **Extract text** — use `pdfplumber` for layout-aware extraction
- **Merge** — use `pypdf.PdfWriter.append()`
- **Split** — slice `reader.pages` into separate writers
```

---

## Progressive Disclosure: Three Loading Levels

Skills use a **progressive disclosure** model. Claude loads only what is needed, keeping context lean.

```
Level 1 — Metadata          (~100 tokens, always loaded)
  └─ YAML frontmatter: name + description

Level 2 — Instructions      (<5 000 tokens, loaded when skill activates)
  └─ Markdown body of SKILL.md

Level 3+ — Resources        (effectively unlimited, loaded on demand)
  └─ Additional .md files, scripts, data files referenced from SKILL.md
```

This means a catalog of 20 skills adds only ~2 000 tokens of overhead (20 × ~100 token frontmatter blocks) while full instructions stay dormant until invoked.

---

## Bundling Additional Content

Larger skills link out to sibling files inside the same folder. Claude reads those files only when the active task calls for them.

```
pdf/
├── SKILL.md        ← entry point; links to siblings
├── reference.md    ← advanced library coverage; loaded for complex tasks
└── forms.md        ← form-filling workflow; loaded only for form tasks
```

The `SKILL.md` for the PDF skill directs Claude explicitly:

> "For advanced features, JavaScript libraries, and detailed examples, see `./reference.md`."  
> "If you need to fill out a PDF form, read `./forms.md` and follow its instructions."

### Why this matters

- **`reference.md`** contains deep-dive content (e.g. pypdfium2 bindings, rendering to images) that most tasks never need.
- **`forms.md`** contains a branching workflow — check for fillable fields, follow the fillable path or the overlay-text path — that is irrelevant unless the user is actually filling a form.

Splitting content this way keeps Level 2 load small while making Level 3 content richly detailed.

### Diagrammatic view

```
SKILL.md (entry point)
│
├──→ reference.md  (advanced / optional)
│       # PDF Processing Advanced Reference
│       ## pypdfium2 Library (Apache/BSD License)
│       pypdfium2 is a Python binding for PDFium (Chromium's PDF
│       library). It's excellent for fast PDF rendering, image
│       generation, and serves as ...
│
└──→ forms.md  (task-specific / optional)
        If you need to fill out a PDF form, first check to see
        if the PDF has fillable form fields. Run this script
        from this file's directory:
          `python scripts/check_fillable_fields <file.pdf>`,
        and depending on the result go to either the "Fillable
        fields" or "Non-fillable fields" section ...
```

---

## Real Skills from the Official Repository

The [anthropics/skills](https://github.com/anthropics/skills) repository ships skills across four domains:

### Document skills (source-available)

| Skill | Folder | What it does |
|---|---|---|
| PDF toolkit | `skills/pdf/` | Extract, merge, split, OCR, fill forms |
| Word documents | `skills/docx/` | Create and edit `.docx` files |
| PowerPoint | `skills/pptx/` | Build and modify presentations |
| Excel / spreadsheets | `skills/xlsx/` | Generate and manipulate workbooks |

### Creative & design skills

Creative skills (music generation prompts, design briefs, image-direction guides) follow the same folder pattern but are lighter — often a single `SKILL.md` without sibling files.

### Development & technical skills

Technical skills may include runnable scripts inside a `scripts/` subfolder alongside the `SKILL.md`. The PDF skill, for example, ships with helper scripts for checking fillable fields and extracting form field info.

### Enterprise skills

Enterprise skills (lead qualification, case summarisation, renewal-risk scanning) tend to be instruction-heavy with elaborate decision trees embedded in the markdown body.

---

## The PDF Skill: A Full Walkthrough

The `skills/pdf/` folder in the repository is a good reference implementation because it uses all three loading levels.

### Frontmatter

```yaml
---
name: pdf
description: Comprehensive PDF toolkit for extracting text and tables,
  merging/splitting documents, and filling-out forms.
---
```

Short, action-oriented description. No library names — those live in the body.

### Body (Level 2 — SKILL.md excerpt)

```markdown
## Overview

This guide covers essential PDF processing operations using Python
libraries and command-line tools. For advanced features, JavaScript
libraries, and detailed examples, see ./reference.md.
If you need to fill out a PDF form, read ./forms.md and follow its
instructions.

## Quick Start

\`\`\`python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")
\`\`\`

## Core Libraries

| Library | Best for |
|---|---|
| pypdf | Merge, split, rotate, metadata |
| pdfplumber | Text + table extraction with layout |
| reportlab | Programmatic PDF creation |

## Quick Reference

- Merge PDFs
- Split PDFs
- Extract text
- Extract tables
- Create PDFs
- Command-line merge
- OCR scanned PDFs
- Fill PDF forms
```

### Sibling files (Level 3 — reference.md and forms.md)

`reference.md` covers pypdfium2, advanced rendering, JavaScript-based extraction, and edge-case handling. `forms.md` contains the branching workflow for fillable vs. non-fillable form fields — including the script commands to run at each decision point.

---

## Anatomy Summary

```
skill-name/
│
├── SKILL.md              ← required; frontmatter + core instructions
│     ┌─────────────────────────────────────────────┐
│     │ ---                                         │  ← Level 1
│     │ name: skill-name                            │     metadata
│     │ description: When and why to use this skill │
│     │ ---                                         │
│     │                                             │  ← Level 2
│     │ ## Overview                                 │     instructions
│     │ ...                                         │
│     │                                             │
│     │ For details see ./reference.md              │  ← pointer to L3
│     └─────────────────────────────────────────────┘
│
├── reference.md          ← optional; deep reference content (Level 3)
├── forms.md              ← optional; task-specific workflow (Level 3)
└── scripts/              ← optional; runnable helpers
    └── check_fields.py
```

---

## Writing Effective Skill Instructions

### Description field

The description is the most important line you write. Claude reads it to decide whether the skill is relevant. Treat it as a routing rule.

**Weak:** `"PDF operations."`  
**Strong:** `"Use when the user needs to read, extract text or tables from, merge, split, rotate, watermark, fill forms in, or create PDF files."`

### Instruction body

- Write in second person: "You are working with PDFs…"
- Lead with a Quick Start so simple tasks resolve at Level 2 without reaching Level 3.
- Use fenced code blocks for every command and script snippet.
- Put branching logic in numbered steps with conditional sub-bullets.
- Add a Quick Reference section listing every operation as a scannable bullet — Claude uses this to confirm it has the right skill activated.

### Sibling files

- Keep `SKILL.md` under 5 000 tokens.
- Move advanced, rarely-needed content into `reference.md`.
- Move task-specific workflows (forms, auth flows, etc.) into their own named files.
- Always reference sibling files with relative paths: `./reference.md`.

---

## Using Skills on Each Platform

| Platform | Mechanism | Supports custom skills |
|---|---|---|
| **Claude Code** | `/plugin install anthropic:pdf` | Yes — place folder in `.claude/skills/` |
| **Claude.ai** | Upload `.zip` of the skill folder | Yes |
| **Claude API** | Pass skill via `skills` parameter with beta headers | Yes |

### Claude API beta headers required

```python
headers = {
    "anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02,files-api-2025-04-14"
}
```

Up to 8 skills per request. Skills run inside a sandboxed virtual machine with filesystem access and code execution.

---

## Security Considerations

Skills execute code and can direct Claude to invoke tools. Before activating a skill from any source:

1. Read the full `SKILL.md` and all sibling files.
2. Audit any scripts in the `scripts/` subfolder.
3. Confirm the skill does not redirect Claude to external URLs or exfiltrate data.
4. Only install skills from sources you control or have audited.

The official [anthropics/skills](https://github.com/anthropics/skills) repository is provided for demonstration and educational purposes. Test behaviour in your own environment before using skills in production.

---

## References

- [GitHub — anthropics/skills repository](https://github.com/anthropics/skills)
- [GitHub — skills/pdf SKILL.md](https://github.com/anthropics/skills/blob/main/skills/pdf/SKILL.md)
- [GitHub — skills/template SKILL.md](https://github.com/anthropics/skills/blob/main/template/SKILL.md)
- [Claude Agent Skills Playbook](./claude-agent-skills.md)
- [Anthropic — Agent Skills overview](https://www.anthropic.com/news/skills)
- [Anthropic engineering — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
