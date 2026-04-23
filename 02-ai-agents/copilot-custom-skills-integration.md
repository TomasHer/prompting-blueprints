---
title: "Integrating Claude Agent Skills into VS Code GitHub Copilot"
tags: ["agents", "github-copilot", "vscode", "skills", "integration"]
last_updated: "2026-04-23"
---

# Integrating Claude Agent Skills into VS Code GitHub Copilot

This tutorial shows how to take the modular skill pattern described in [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md) and apply the same concepts inside Visual Studio Code with GitHub Copilot Agent mode. The underlying ideas — scoped instructions, progressive disclosure, and reusable capability packages — translate directly to Copilot's prompt file system.

---

## Concept Mapping

Claude Agent Skills and VS Code Copilot Agent share the same goal: load only the instructions a task needs, from a versioned, reusable source. The table below maps each layer of a Claude skill to its Copilot equivalent.

| Claude Agent Skill | VS Code Copilot equivalent |
|---|---|
| `skill-name/SKILL.md` (entry point) | `.github/prompts/skill-name.prompt.md` |
| YAML frontmatter `name` + `description` | Prompt file frontmatter `description` + `mode` |
| Level 1 — metadata (~100 tokens) | `description` field in frontmatter (shown in Copilot Chat UI) |
| Level 2 — instruction body | Markdown body of the `.prompt.md` file |
| Level 3 — sibling `.md` files | Additional `.prompt.md` files referenced by `#file:` directives |
| `scripts/` subfolder | Referenced workspace scripts via `#file:` |
| `/plugin install` in Claude Code | Selecting the prompt in Copilot Chat `/` slash menu |
| Repository-wide skill activation | `.github/copilot-instructions.md` |

---

## Three Integration Approaches

Choose the approach that matches the scope you need.

### Approach 1 — Repository Instructions (Simplest)

Use `.github/copilot-instructions.md` when a skill should be active for **every** Copilot conversation in the repository. This is equivalent to a Claude skill that is always loaded rather than triggered on demand.

Create the file at the repository root:

```
.github/
└── copilot-instructions.md
```

Port the body of your `SKILL.md` directly into this file. Omit the YAML frontmatter — the file has no routing mechanism; it is always included.

**When to use:** Cross-cutting standards (coding style, security rules, domain glossary) that apply to all tasks in the repo.

**When to avoid:** Task-specific skills (PDF handling, form filling) that should only activate for relevant requests.

---

### Approach 2 — Prompt Files (Recommended for Most Skills)

Prompt files are the direct equivalent of a Claude Agent Skill folder. Each `.prompt.md` file in `.github/prompts/` appears as a slash command in Copilot Chat.

```
.github/
└── prompts/
    ├── pdf.prompt.md          ← maps to skills/pdf/SKILL.md
    ├── pdf-reference.prompt.md   ← maps to skills/pdf/reference.md
    └── pdf-forms.prompt.md    ← maps to skills/pdf/forms.md
```

#### Prompt File Structure

```markdown
---
mode: 'agent'
tools: ['codebase', 'readFile', 'writeFile', 'terminal']
description: 'Use when the user needs to read, extract, merge, split, or fill PDF files.'
---

## Overview

This skill covers PDF processing using Python libraries.
For advanced rendering and JavaScript extraction, use #file:pdf-reference.prompt.md.
If filling a PDF form, use #file:pdf-forms.prompt.md.

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
| pdfplumber | Text and table extraction with layout |
| reportlab | Programmatic PDF creation |
```

#### Frontmatter Fields

| Field | Values | Purpose |
|---|---|---|
| `mode` | `'agent'`, `'ask'`, `'edit'` | Copilot interaction mode; `'agent'` enables tool use |
| `tools` | array of tool IDs | Tools Copilot may invoke during this skill session |
| `description` | string | Shown in the `/` slash menu; write it as a routing hint |

**Write the `description` as a usage condition, not a feature list** — the same advice that applies to Claude Skill frontmatter applies here. Copilot surfaces descriptions in the prompt picker; users read them to decide which prompt to activate.

**Weak:** `"PDF skill."`
**Strong:** `"Use when the user needs to read, extract text or tables from, merge, split, fill forms in, or create PDF files."`

---

### Approach 3 — MCP Server (For Tool-Driven Skills)

When a Claude skill bundles executable scripts that Claude runs during a task (e.g., `scripts/check_fillable_fields.py`), the Copilot equivalent is a **Model Context Protocol (MCP) server** registered in VS Code.

Add the MCP server to your VS Code workspace settings:

```json
// .vscode/mcp.json
{
  "servers": {
    "pdf-tools": {
      "command": "python",
      "args": ["scripts/mcp_pdf_server.py"],
      "description": "PDF processing tools: extract text, merge, split, fill forms"
    }
  }
}
```

The MCP server exposes tool endpoints that Copilot Agent can call, mirroring how Claude skills expose scripts via the `scripts/` subfolder. The prompt file then references the MCP tools:

```markdown
---
mode: 'agent'
tools: ['pdf-tools_extract', 'pdf-tools_merge', 'pdf-tools_fill_form']
description: 'PDF operations: extract, merge, split, fill forms using local tools.'
---
```

**When to use:** Skills where execution accuracy matters more than code generation — e.g., when you need deterministic extraction, not LLM-written scripts.

---

## Converting the PDF Skill: Step-by-Step

The following walkthrough converts the official `skills/pdf/` Claude skill to a VS Code Copilot prompt file set.

### Step 1 — Create the prompts directory

```bash
mkdir -p .github/prompts
```

### Step 2 — Create the entry-point prompt

Create `.github/prompts/pdf.prompt.md`. Map each Claude skill section:

| Claude `SKILL.md` section | Copilot prompt file section |
|---|---|
| `name: pdf` | `description` field (drives the slash command label) |
| `description: Comprehensive PDF toolkit…` | Frontmatter `description` value |
| Markdown body | Markdown body — copy verbatim |
| `see ./reference.md` | `use #file:pdf-reference.prompt.md` |
| `read ./forms.md` | `use #file:pdf-forms.prompt.md` |

```markdown
---
mode: 'agent'
tools: ['codebase', 'readFile', 'writeFile', 'terminal']
description: 'Use when the user needs to read, extract text or tables from, merge, split, rotate, watermark, fill forms in, or create PDF files.'
---

## Overview

This skill covers PDF processing using Python libraries and command-line tools.
For advanced features and detailed examples, use #file:pdf-reference.prompt.md.
If filling a PDF form, use #file:pdf-forms.prompt.md and follow its instructions.

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

### Step 3 — Create sibling prompt files

Create `.github/prompts/pdf-reference.prompt.md` for advanced content:

```markdown
---
mode: 'agent'
tools: ['codebase', 'readFile', 'terminal']
description: 'Advanced PDF reference: pypdfium2 rendering, JavaScript extraction, edge cases.'
---

# PDF Advanced Reference

Use this file for advanced rendering, pypdfium2 bindings, and JavaScript-based extraction.

## pypdfium2 Library

pypdfium2 is a Python binding for PDFium (Chromium's PDF library). Use it for
fast rendering and image generation from PDF pages.

\`\`\`python
import pypdfium2 as pdfium

pdf = pdfium.PdfDocument("document.pdf")
page = pdf[0]
bitmap = page.render(scale=2)
image = bitmap.to_pil()
image.save("page_0.png")
\`\`\`
```

Create `.github/prompts/pdf-forms.prompt.md` for the form-filling workflow:

```markdown
---
mode: 'agent'
tools: ['codebase', 'readFile', 'writeFile', 'terminal']
description: 'PDF form filling: detect fillable fields, fill or overlay text.'
---

# PDF Form Filling

First check whether the PDF has fillable form fields:

\`\`\`bash
python scripts/check_fillable_fields.py <file.pdf>
\`\`\`

**If fillable fields exist** — proceed to the Fillable Fields section below.
**If no fillable fields** — proceed to the Non-Fillable Fields section below.

## Fillable Fields

\`\`\`python
import pypdf

reader = pypdf.PdfReader("form.pdf")
writer = pypdf.PdfWriter()
writer.append(reader)
writer.update_page_form_field_values(
    writer.pages[0],
    {"field_name": "value"}
)
with open("filled.pdf", "wb") as f:
    writer.write(f)
\`\`\`

## Non-Fillable Fields

Use reportlab to overlay text at specific coordinates:

\`\`\`python
from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter

c = canvas.Canvas("overlay.pdf")
c.drawString(100, 700, "Filled value")
c.save()
# Merge overlay with original...
\`\`\`
```

### Step 4 — Verify the skill appears in Copilot Chat

1. Open VS Code with the GitHub Copilot extension installed.
2. Open Copilot Chat (`Ctrl+Alt+I` / `Cmd+Alt+I`).
3. Switch to **Agent mode** using the mode selector in the chat input bar.
4. Type `/` — the prompt picker should list `pdf`, `pdf-reference`, and `pdf-forms` with their descriptions.
5. Select `pdf` and type a request such as "merge these two PDF files."

---

## Workspace Layout for Multiple Skills

For a repository that hosts several skills, use a flat structure in `.github/prompts/`. Prefixing related files with the skill name keeps the slash menu scannable.

```
.github/
├── copilot-instructions.md      ← always-on repo standards
└── prompts/
    ├── pdf.prompt.md
    ├── pdf-reference.prompt.md
    ├── pdf-forms.prompt.md
    ├── docx.prompt.md
    ├── pptx.prompt.md
    └── xlsx.prompt.md
```

Compare this to the Claude Skills layout:

```
skills/
├── pdf/
│   ├── SKILL.md
│   ├── reference.md
│   └── forms.md
├── docx/
│   └── SKILL.md
└── pptx/
    └── SKILL.md
```

The main structural difference is that Copilot uses a flat directory (`.github/prompts/`) with prefixed file names, while Claude Skills use a nested directory per skill. The content inside each file is identical or nearly identical.

---

## Progressive Disclosure in Copilot

The three-level progressive disclosure model from Claude Skills maps to Copilot as follows:

```
Level 1 — Description     (shown in slash menu, ~20 tokens)
  └─ frontmatter `description` field

Level 2 — Instructions    (loaded when prompt activates, <5 000 tokens)
  └─ Markdown body of the .prompt.md file

Level 3 — Resources       (loaded on demand via #file: references)
  └─ Additional .prompt.md files, workspace scripts
```

To keep Level 2 lean, apply the same rules as Claude Skills:

- Keep the main `.prompt.md` body under 5 000 tokens.
- Move rarely-needed advanced content into a `-reference.prompt.md` file.
- Move task-specific branching workflows into their own named `.prompt.md` files.
- Always reference sibling files with `#file:` directives: `#file:pdf-reference.prompt.md`.

---

## Writing Effective Copilot Skill Instructions

The authoring guidelines from Claude Skills apply without modification:

- **Description field:** Write as a routing condition. Users read descriptions in the slash menu to decide which prompt to activate. Make the trigger conditions explicit.
- **Instruction body:** Lead with a Quick Start. Simple tasks should resolve from Level 2 without needing any `#file:` references.
- **Second person:** "You are working with PDFs…" — Copilot responds to instructions addressed directly.
- **Fenced code blocks:** Include every command and script snippet in a fenced block with a language tag.
- **Quick Reference section:** List every supported operation as a bullet. This helps Copilot confirm it activated the correct skill.
- **Branching logic:** Express decision trees as numbered steps with conditional sub-bullets — the same structure that works in `forms.md` works identically in Copilot.

---

## Security Considerations

Copilot prompt files can direct Copilot to run terminal commands and write files. Apply the same audit checklist you would for a Claude Agent Skill:

1. Read every `.prompt.md` file before activating it in agent mode.
2. Inspect any scripts referenced via `#file:` or called from the prompt body.
3. Confirm the prompt does not instruct Copilot to send data to external URLs.
4. Restrict `tools` in the frontmatter to only what the skill genuinely needs — avoid including `fetchUrl` unless the skill requires network access.
5. For team repositories, review prompt files in pull requests the same way you review code changes.

---

## Platform Comparison

| Capability | Claude Agent Skills | VS Code Copilot Prompt Files |
|---|---|---|
| Skill entry point | `SKILL.md` | `.prompt.md` |
| Metadata / routing | YAML frontmatter `name` + `description` | Frontmatter `description` |
| Instruction body | Markdown | Markdown |
| Sibling files | `./reference.md` | `#file:pdf-reference.prompt.md` |
| Always-on instructions | N/A (per-skill activation) | `.github/copilot-instructions.md` |
| Executable tools | `scripts/` subfolder | MCP server or `terminal` tool |
| Install command | `/plugin install anthropic:pdf` | `/` slash menu in Copilot Chat |
| Max skills per session | 8 | Unlimited (but keep body lean) |
| Context budget | ~5 000 tokens per skill | ~5 000 tokens recommended per prompt |

---

## References

- [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md)
- [GitHub — anthropics/skills repository](https://github.com/anthropics/skills)
- [VS Code Docs — Copilot custom instructions](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [VS Code Docs — Prompt files (`.prompt.md`)](https://code.visualstudio.com/docs/copilot/copilot-customization#_reusable-prompt-files-experimental)
- [VS Code Docs — MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [VS Code Docs — Copilot Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)
