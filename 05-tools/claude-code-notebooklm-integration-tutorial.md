# Claude Code + NotebookLM Integration Tutorial

## Intent
Use this tutorial to connect Claude Code with NotebookLM through `notebooklm-py`, then run end-to-end research workflows (ingest sources, chat, generate artifacts, and download outputs) directly from your terminal.

## [Claude Code Logo] + [NotebookLM Logo]
Two of the most powerful AI tools can be chained into one workflow:
- **NotebookLM** for source-grounded analysis and media/study artifact generation.
- **Claude Code** for natural-language orchestration in the terminal via skills.

## What makes this integration work: `notebooklm-py`
The open-source [`notebooklm-py`](https://github.com/akosbalasko/notebooklm-py) project provides:
- Python tooling to connect to NotebookLM.
- A Claude Code-compatible skill installation path.
- A CLI for notebook creation, source ingestion, analysis, generation, and downloads.

Repository links:
- README
- Contributing
- MIT License
- Security

## Features available through `notebooklm-py`
`notebooklm-py` exposes the full NotebookLM suite, including notebook setup and Studio outputs.

### Studio outputs
- Audio Overview
- Video Overview
- Mind Map
- Reports
- Flashcards
- Quiz
- Infographic
- Slide Deck
- Data Table

## Installation
Run the following commands in your terminal.

> First-time setup note: install takes a few seconds. A browser window opens during authentication so you can log into NotebookLM.

```bash
# Basic installation
pip install notebooklm-py

# With browser login support (required for first-time setup)
pip install "notebooklm-py[browser]"
playwright install chromium

# 1. Authenticate (opens browser)
notebooklm login

# Install via CLI or ask Claude Code to do it
notebooklm skill install
```

## Using the skill with Claude Code
Claude Code connects to NotebookLM via the `notebooklm` skill.

You can describe the task in natural language, and Claude Code can invoke the skill automatically.

### 2) Create a notebook and add sources
```bash
notebooklm create "My Research"
notebooklm use <notebook_id>
notebooklm source add "https://en.wikipedia.org/wiki/Artificial_intelligence"
notebooklm source add "./paper.pdf"
```

### 3) Chat with your sources
```bash
notebooklm ask "What are the key themes?"
```

### 4) Generate content
```bash
notebooklm generate audio "make it engaging" --wait
notebooklm generate video --style whiteboard --wait
notebooklm generate quiz --difficulty hard
notebooklm generate flashcards --quantity more
notebooklm generate slide-deck
notebooklm generate infographic --orientation portrait
notebooklm generate mind-map
notebooklm generate data-table "compare key concepts"
```

### 5) Download artifacts
```bash
notebooklm download audio ./podcast.mp3
notebooklm download video ./overview.mp4
notebooklm download quiz --format markdown ./quiz.md
notebooklm download flashcards --format json ./cards.json
notebooklm download slide-deck ./slides.pdf
notebooklm download mind-map ./mindmap.json
notebooklm download data-table ./data.csv
```

## Best-fit use cases
This pairing works especially well for:
- YouTube-centric research workflows.
- Deliverables such as slide decks, infographics, and flashcards.

Workflow sketch:
`[YouTube Logo] -> [NotebookLM Logo] -> [Claude Code Logo]`

## Copy/paste templates for Claude Code terminal
Replace `[INSERT YOUTUBE URL HERE]` before running.

### Option 1: Executive Summary (Slide Deck)
```text
Use the notebooklm skill to create a new notebook called 'Video Research'. Add this YouTube video as a source: [INSERT YOUTUBE URL HERE]. Once it's processed, generate a comprehensive slide deck that outlines the key takeaways and download the PDF to my current folder.
```

### Option 2: Deep Study (Flashcards + Quiz)
```text
I need to learn the material in this video: [INSERT YOUTUBE URL HERE]. Use the notebooklm skill to add it to a new notebook. Generate a quiz with 'hard' difficulty and a set of flashcards for the core concepts. Download both files in markdown or JSON format.
```

### Option 3: Visual Breakdown (Infographic + Mind Map)
```text
Connect to NotebookLM and ingest this video: [INSERT YOUTUBE URL HERE]. Use the tool to generate a mind map of the video's structure and a portrait-oriented infographic summarizing the data. Save the artifacts to my workspace.
```

## Pro tip
If you have already run `notebooklm login` in your terminal, Claude can access your existing notebooks. To use an existing notebook instead of creating a new one, prompt Claude like this:

```text
Use my existing 'Project X' notebook to add this video...
```

## References
- [notebooklm-py (GitHub)](https://github.com/akosbalasko/notebooklm-py)
- [Google NotebookLM](https://notebooklm.google)
