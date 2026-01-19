# NotebookLM 2026 Tool Tutorial: Curate -> Learn -> Act

## Intent
- Build a curated NotebookLM knowledge base that stays grounded in trusted sources.
- Turn the same sources into learning assets (audio, video, maps, quizzes).
- Ship real-world outputs you can share or publish.

## Use when
- You want fewer hallucinations and tighter, source-cited answers.
- You need a repeatable workflow for research, learning, or content creation.
- You want to repurpose one notebook into multiple output formats.

## Prerequisites
- NotebookLM access (web or mobile).
- Vetted sources you already trust.
- A clear topic or project goal.

## Workflow overview
1) Curate: build a vetted source library.
2) Learn: configure roles, verify with citations, and compound notes.
3) Act: export, share, and publish outputs.

## Step 1: Curate (vetted source library)
**The mistake**
- Treating NotebookLM like a search engine and dumping random links.

**The fix**
- Only add sources you have already vetted and found valuable.

**Supported sources**
- YouTube videos (paste the link).
- Website URLs and blog posts.
- PDFs, docs, and uploaded files.
- Google Drive documents.
- Voice memos (mobile upload).
- Copied text (useful for paywalled articles you can access).
- Images.

**Curation checklist**
- Every source earns its place.
- Sources align on a compatible methodology or philosophy.
- Prefer depth over breadth; small, high-signal sets work best.
- Paste multiple links at once using spaces or new lines.
- Avoid "search web" auto-imports; it defeats curation.

## Step 2: Learn (knowledge transformation)
**Configure the notebook role**
- Open "configure notebook" and set a custom role to shape responses.
- Example:
```text
Act as an elite marathon training coach with over 20 years of experience coaching Boston qualifying athletes and first-time marathoners.
```

**Use the chat panel intentionally**
- Every answer includes citations; hover to verify exact quotes.
- Uncheck sources on the left to focus on one document or viewpoint.
- Ask specific questions tied to the exact outcome you need.

**Compound intelligence**
- Save a great answer to a note, then "convert to source."
- Your notebook becomes more useful with every iteration.

## Studio panel: Turn knowledge into formats
**Audio overviews (AI podcasts)**
- Always click the pencil icon before generating.
- Formats: Deep Dive, Debate, Critique, Brief.
- Add a focus prompt to guide the episode.
- Interactive mode (Deep Dive) lets you join and ask questions live.
- Mobile app lets you download for offline listening.

**Video overviews**
- Choose length (brief or structured) and visual style (classic, anime, etc.).
- Add a focus prompt to lock the scope.

**Other Studio outputs**
- Mind maps: click nodes to start focused chats.
- Reports: long-form, text-based explanations.
- Flashcards: choose difficulty and quantity.
- Quizzes: multiple choice with hints and grading.
- Infographics: pick orientation and detail level.
- Slide decks: "detailed" (learning) or "presenter" (talking points).
- Data tables: extract structured data into spreadsheet-ready formats.

## Step 3: Act (real-world output)
- Create content: outlines, scripts, articles, or videos.
- Build business assets: training, competitive intel, market summaries.
- Share with teams: share full notebook or chat-only view.
- Download outputs: podcasts, slides, and infographics are ready to distribute.

## Prompt Pack (Copy-Paste)

### ⚙️ PROMPT #1: THE NOTEBOOK ARCHITECT
💡 Use this prompt to help plan your notebook before you start adding sources. It ensures you're building with intention, not just dumping random content.

```text
#CONTEXT:

You are a Knowledge Curation Specialist. You understand that AI tools like NotebookLM are only as good as the sources fed into them. Your job is to help users design intentional knowledge bases that deliver consistent, trustworthy answers.

#ROLE:

Act as a Research Librarian who specializes in building curated collections. You don't accept random sources. You vet everything. You understand that conflicting philosophies in a knowledge base create confused outputs.

#RESPONSE GUIDELINES:

1. Ask what topic or project the notebook will serve.

2. Identify the specific questions the user wants the notebook to answer.

3. Determine the philosophy or methodology the user wants to follow (avoid mixing competing approaches).

4. Recommend source types (videos, articles, PDFs, voice memos) that best serve the goal.

5. Suggest a custom role configuration for the notebook chat.

#TASK CRITERIA:

- Focus on quality over quantity

- Ensure sources share compatible philosophies

- Output a Source Curation Checklist

#INFORMATION ABOUT ME:

- My Topic/Project: [INSERT TOPIC]

- My Key Questions: [WHAT DO YOU WANT THE NOTEBOOK TO ANSWER?]

- My Preferred Approach/Philosophy: [INSERT METHODOLOGY OR LEAVE BLANK]

#RESPONSE FORMAT:

Provide a Notebook Blueprint with: Recommended Source Types, Vetting Criteria, Suggested Custom Role, and 5 Starter Questions to ask the notebook once built.

# END OF PROMPT #1: THE NOTEBOOK ARCHITECT

Input needed:
Your topic or project
The questions you want answered
Your preferred methodology (optional)
Output you'll get:
A complete blueprint for building an intentional, high-quality NotebookLM knowledge base.
```

### ⚙️ PROMPT #2: THE STUDIO MAXIMIZER
💡 Use this prompt to get the most out of NotebookLM's Studio features. It helps you choose the right format and customize the output.

```text
#CONTEXT:
You are a Learning Experience Designer who specializes in transforming raw knowledge into consumable formats. You understand that different learning goals require different output types.

#ROLE:
Act as a Content Transformation Strategist. You help users choose between audio overviews (deep dive, debate, critique, brief), video overviews, mind maps, reports, flashcards, quizzes, infographics, slide decks, and data tables.

#RESPONSE GUIDELINES:
1. Ask what the user's learning or output goal is.
2. Ask how much time they have available.
3. Ask if they need to share the output with others.
4. Recommend the optimal Studio format with specific customization settings.
5. Provide the exact focus prompt to use in the pencil icon settings.

#TASK CRITERIA:
- Match output format to learning style and goal
- Consider time constraints
- Provide copy-paste focus prompts

#INFORMATION ABOUT ME:
- My Notebook Topic: [INSERT TOPIC]
- My Goal: [LEARN / CREATE CONTENT / SHARE WITH TEAM / STUDY FOR TEST]
- My Time Available: [INSERT TIME]

#RESPONSE FORMAT:
Provide: Recommended Studio Format, Customization Settings, Focus Prompt to Copy-Paste, and Alternative Options.

#END OF PROMPT #2: THE STUDIO MAXIMIZER

Input needed:
Your notebook topic
Your goal (learning, creating, sharing, studying)
Available time
Output you'll get:
A specific Studio format recommendation with exact settings and a ready-to-use focus prompt.
```

## Example run
**Input**
```text
Topic: Marathon training for first-time runners
Key questions: How should I structure long runs? How do I balance speed vs endurance? How do I prevent injuries?
Preferred methodology: Evidence-based coaching with a 16-week plan
Goal: Learn and create a study pack
Time available: 2 hours/week
```

**Expected Output**
```text
Recommended sources: 3-5 vetted coaching videos, 2 peer-reviewed injury-prevention PDFs, 1 athlete training log.
Suggested custom role: "Act as an elite marathon training coach..."
Studio plan: Audio overview (Debate) + flashcards (medium) + quiz (10 questions).
```

## Tips and pitfalls
- Curate first; random sources create random answers.
- Always click the pencil icon before generating Studio content.
- Use citations to verify claims before turning them into outputs.
- Save strong answers as notes and convert them to sources.
- Share the notebook or chat depending on what you want to reveal.

## References
- [NotebookLM Audio Overviews Blueprint](notebooklm-audio-overviews-blueprint.md)
- [NotebookLM Prompting Blueprints](notebooklm-prompting-blueprints.md)
