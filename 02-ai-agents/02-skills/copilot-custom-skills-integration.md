---
title: "Integrating Claude Agent Skills into VS Code GitHub Copilot"
tags: ["agents", "github-copilot", "vscode", "skills", "integration"]
last_updated: "2026-04-24"
---

# Integrating Claude Agent Skills into VS Code GitHub Copilot

This tutorial shows how to take the modular skill pattern described in [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md) and apply the same concepts inside Visual Studio Code with GitHub Copilot Agent mode.

As of VS Code 1.97, Copilot natively understands the Agent Skills format: the same `SKILL.md` file you write for Claude loads directly in Copilot without any conversion. The underlying ideas — scoped instructions, progressive disclosure, and reusable capability packages — are now a shared open standard across Claude, GitHub Copilot in VS Code, Copilot CLI, and the Copilot cloud agent.

---

## Concept Mapping

| Claude Agent Skill | VS Code Copilot (native skills) | VS Code Copilot (prompt files) |
|---|---|---|
| `skill-name/SKILL.md` | `.github/skills/skill-name/SKILL.md` | `.github/prompts/skill-name.prompt.md` |
| YAML `name` (matches directory) | YAML `name` (must match directory) | Filename stem |
| YAML `description` | YAML `description` (max 1024 chars) | Frontmatter `description` |
| `user-invocable` frontmatter | `user-invocable` frontmatter | Always in slash menu |
| `disable-model-invocation` | `disable-model-invocation` | N/A |
| `argument-hint` | `argument-hint` | N/A |
| Level 2 — instruction body | Markdown body of `SKILL.md` | Markdown body of `.prompt.md` |
| Level 3 — sibling `.md` files | Relative Markdown links in body | `#file:` directives |
| `scripts/` subfolder | Scripts referenced from body | MCP server or `terminal` tool |
| `/plugin install anthropic:pdf` | Skills gallery / plugin install | N/A |
| Repository-wide activation | `.github/copilot-instructions.md` | `.github/copilot-instructions.md` |

---

## Native Agent Skills in Copilot

VS Code Copilot recognizes Agent Skills placed in any of the standard skills directories. No conversion is needed — the same `SKILL.md` file works for both Claude and Copilot.

### Skill Locations

Skills are discovered from three scopes:

**Project skills** (checked into the repository, available to the whole team):

```
.github/skills/pdf/SKILL.md
.claude/skills/pdf/SKILL.md
.agents/skills/pdf/SKILL.md
```

**Personal skills** (stored in your home directory, shared across all projects):

```
~/.copilot/skills/pdf/SKILL.md
~/.claude/skills/pdf/SKILL.md
~/.agents/skills/pdf/SKILL.md
```

**Custom locations** — add additional paths via the VS Code setting `chat.agentSkillsLocations`.

For monorepos, enable `chat.useCustomizationsInParentRepositories` to discover skills defined in parent directories.

> **Critical requirement:** The `name` field in `SKILL.md` frontmatter must exactly match the parent directory name. A skill at `.github/skills/pdf/SKILL.md` must declare `name: pdf`.

### SKILL.md Frontmatter Fields

| Field | Required | Values | Purpose |
|---|---|---|---|
| `name` | Yes | Lowercase letters, numbers, hyphens; max 64 chars | Unique identifier; must match parent directory name |
| `description` | Yes | String; max 1024 chars | When Copilot should use this skill; write as a usage condition |
| `argument-hint` | No | String | Placeholder text shown in the chat input bar when the skill is invoked via slash command |
| `user-invocable` | No | `true` (default) / `false` | `false` hides the skill from the `/` slash menu; skill still loads automatically |
| `disable-model-invocation` | No | `false` (default) / `true` | `true` prevents Copilot from loading the skill automatically; only loads when explicitly invoked |

### Activation Modes

The `user-invocable` and `disable-model-invocation` fields give fine-grained control over how Copilot loads a skill:

| `user-invocable` | `disable-model-invocation` | Slash menu | Auto-loaded | Typical use case |
|---|---|---|---|---|
| `true` (default) | `false` (default) | Yes | Yes | General-purpose skills |
| `false` | `false` | No | Yes | Background context (e.g., coding standards, domain glossary) |
| `true` | `true` | Yes | No | Sensitive or expensive skills; load only when explicitly requested |
| `false` | `true` | No | No | Effectively disabled |

### Verifying Skills in VS Code

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run **Chat: Open Chat Customizations**.
2. Switch to the **Skills** tab to see all discovered skills: project-scoped, personal, and plugin-contributed.
3. In Copilot Chat, type `/` — skills appear in the picker as `/pdf` for a local skill or `/my-extension:pdf` for a plugin-contributed skill.

### Community Skills Gallery

The [`github/awesome-copilot`](https://github.com/github/awesome-copilot) repository is a growing community collection of skills, custom agents, instructions, and prompts. The [`anthropics/skills`](https://github.com/anthropics/skills) repository contains reference skills maintained by Anthropic. Skills contributed via VS Code extensions appear automatically in the **Chat Customizations** editor alongside locally defined skills.

### Plugin System

VS Code extensions can bundle and distribute skills. An extension declares skills in its `package.json`:

```json
{
  "contributes": {
    "chatSkills": [
      { "path": "./skills/pdf/SKILL.md" }
    ]
  }
}
```

Plugin-contributed skills appear in the slash menu prefixed with the extension name: `/my-extension:pdf`. They show up in the **Skills** tab of the Chat Customizations editor alongside local skills.

---

## Additional Integration Approaches

The following approaches use VS Code-specific mechanisms — prompt files and MCP servers — as an alternative when you need features not available in the native SKILL.md format.

### Approach 1 — Repository Instructions (Simplest)

Use `.github/copilot-instructions.md` when a skill should be active for **every** Copilot conversation in the repository. This is equivalent to a skill with `user-invocable: false` and `disable-model-invocation: false` — always loaded, never gated.

Create the file at the repository root:

```
.github/
└── copilot-instructions.md
```

Port the body of your `SKILL.md` directly into this file. Omit the YAML frontmatter — the file has no routing mechanism; it is always included.

**When to use:** Cross-cutting standards (coding style, security rules, domain glossary) that apply to all tasks in the repo.

**When to avoid:** Task-specific skills (PDF handling, form filling) that should only activate for relevant requests.

---

### Approach 2 — Prompt Files (VS Code-Specific Alternative)

Prompt files are a VS Code-only alternative to `SKILL.md`. Each `.prompt.md` file in `.github/prompts/` appears as a slash command in Copilot Chat and supports richer tooling declarations via frontmatter.

```
.github/
└── prompts/
    ├── pdf.prompt.md
    ├── pdf-reference.prompt.md
    └── pdf-forms.prompt.md
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

#### Prompt File Frontmatter Fields

| Field | Values | Purpose |
|---|---|---|
| `mode` | `'agent'`, `'ask'`, `'edit'` | Copilot interaction mode; `'agent'` enables tool use |
| `tools` | array of tool IDs | Tools Copilot may invoke during this skill session |
| `description` | string | Shown in the `/` slash menu; write it as a routing hint |

**Write the `description` as a usage condition, not a feature list** — the same advice that applies to Claude Skill frontmatter applies here.

**Weak:** `"PDF skill."`
**Strong:** `"Use when the user needs to read, extract text or tables from, merge, split, fill forms in, or create PDF files."`

**When to prefer prompt files over native skills:**
- You need an explicit `tools` list to restrict which VS Code tools Copilot can invoke.
- You use `#file:` transclusion to compose several files into a single context load.
- Your team uses VS Code exclusively and has no need for cross-agent portability.

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

## Converting the PDF Skill to Prompt Files: Step-by-Step

The following walkthrough converts the official `skills/pdf/` Claude skill to a VS Code Copilot prompt file set. If you are placing the skill in a standard skills directory (`.github/skills/`), skip this section — the `SKILL.md` file works as-is.

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

Alternatively, open the Command Palette and run **Chat: Open Chat Customizations** to see all skills and prompts in the **Skills** and **Prompts** tabs.

---

## Workspace Layout for Multiple Skills

### Native Skills Layout

```
.github/
├── copilot-instructions.md      ← always-on repo standards
└── skills/
    ├── pdf/
    │   ├── SKILL.md
    │   ├── reference.md
    │   └── forms.md
    ├── docx/
    │   └── SKILL.md
    └── pptx/
        └── SKILL.md
```

This layout is identical to the Claude Skills layout and works for both agents without modification.

### Prompt Files Layout (VS Code-Specific)

For a repository that uses prompt files instead, use a flat structure in `.github/prompts/`. Prefixing related files with the skill name keeps the slash menu scannable.

```
.github/
├── copilot-instructions.md
└── prompts/
    ├── pdf.prompt.md
    ├── pdf-reference.prompt.md
    ├── pdf-forms.prompt.md
    ├── docx.prompt.md
    ├── pptx.prompt.md
    └── xlsx.prompt.md
```

The main structural difference is that prompt files use a flat directory with prefixed file names, while native skills (and Claude Skills) use a nested directory per skill.

---

## Progressive Disclosure in Copilot

The three-level progressive disclosure model maps identically to both native skills and prompt files:

```
Level 1 — Description     (shown in slash menu, ~20 tokens)
  └─ frontmatter `description` field

Level 2 — Instructions    (loaded when skill activates, <5 000 tokens)
  └─ Markdown body of SKILL.md or .prompt.md

Level 3 — Resources       (loaded on demand)
  └─ Native skills: relative Markdown links
  └─ Prompt files: #file: directives
```

To keep Level 2 lean:

- Keep the main file body under 5 000 tokens.
- Move rarely-needed advanced content into a `-reference` file.
- Move task-specific branching workflows into their own named files.
- Reference sibling files explicitly in the body so the model knows to load them.

---

## Writing Effective Copilot Skill Instructions

The authoring guidelines from Claude Skills apply without modification:

- **Description field:** Write as a routing condition. Users read descriptions in the slash menu to decide which skill to activate. Make the trigger conditions explicit.
- **Instruction body:** Lead with a Quick Start. Simple tasks should resolve from Level 2 without needing any sibling-file references.
- **Second person:** "You are working with PDFs…" — Copilot responds to instructions addressed directly.
- **Fenced code blocks:** Include every command and script snippet in a fenced block with a language tag.
- **Quick Reference section:** List every supported operation as a bullet. This helps Copilot confirm it activated the correct skill.
- **Branching logic:** Express decision trees as numbered steps with conditional sub-bullets.

---

## Security Considerations

Copilot skills and prompt files can direct Copilot to run terminal commands and write files. Apply the same audit checklist you would for a Claude Agent Skill:

1. Read every `SKILL.md` or `.prompt.md` file before activating it in agent mode.
2. Inspect any scripts referenced from the skill body or called via the terminal tool.
3. Confirm the skill does not instruct Copilot to send data to external URLs.
4. For prompt files, restrict `tools` in the frontmatter to only what the skill genuinely needs — avoid including `fetchUrl` unless the skill requires network access.
5. For team repositories, review skill files in pull requests the same way you review code changes.
6. Personal skills in `~/.copilot/skills/` are loaded for every project — audit them as carefully as you would a shell profile.

---

## Platform Comparison

| Capability | Claude Agent Skills | VS Code Copilot (native skills) | VS Code Copilot (prompt files) |
|---|---|---|---|
| Skill entry point | `SKILL.md` | `SKILL.md` | `.prompt.md` |
| Metadata / routing | YAML frontmatter | YAML frontmatter (identical schema) | Frontmatter `description` |
| Cross-agent portability | Yes (open standard) | Yes (open standard) | No (VS Code only) |
| Instruction body | Markdown | Markdown | Markdown |
| Sibling file references | Relative Markdown links | Relative Markdown links | `#file:` directives |
| Always-on instructions | N/A | `.github/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Executable tools | `scripts/` subfolder | Scripts referenced from body | MCP server or `terminal` tool |
| Explicit tool allowlist | No | No | `tools` frontmatter field |
| Install command | `/plugin install anthropic:pdf` | Skills gallery / plugin install | N/A |
| Auto-load control | `user-invocable` + `disable-model-invocation` | `user-invocable` + `disable-model-invocation` | Always user-invoked |
| Personal skill scope | N/A | `~/.copilot/skills/` | N/A |
| Max skills per session | 8 | Unlimited (progressive loading) | Unlimited (but keep body lean) |
| Context budget | ~5 000 tokens per skill | ~5 000 tokens per skill | ~5 000 tokens recommended |

---

## References

- [Anatomy of a Claude Agent Skill](./anatomy-of-a-skill.md)
- [VS Code Docs — Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [VS Code Docs — Copilot custom instructions](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [VS Code Docs — Prompt files (`.prompt.md`)](https://code.visualstudio.com/docs/copilot/copilot-customization#_reusable-prompt-files-experimental)
- [VS Code Docs — MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [VS Code Docs — Copilot Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)
- [GitHub — anthropics/skills repository](https://github.com/anthropics/skills)
- [GitHub — github/awesome-copilot (community gallery)](https://github.com/github/awesome-copilot)
- [GitHub Changelog — Copilot now supports Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
