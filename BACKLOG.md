# Repository Backlog

> Remediation backlog from the June 2026 repository audit. Tasks are self-contained:
> each lists scope, affected files, and a done-check, so they can be executed one at a
> time (e.g. "do task P1-02 from BACKLOG.md"). Check items off in the same PR that
> completes them. Maintainer backlog for *content* ideas stays in `agents.md` §8.

Verification helpers used below:

```bash
python3 scripts/check-frontmatter.py        # front-matter gate
python3 scripts/build-source-index.py       # regenerate source-index.md
mkdocs build --strict                       # fails on broken nav/links
```

---

## Phase 1 — Fix what is broken on the published site

- [ ] **P1-01 Fix 17 broken `mkdocs.yml` nav paths.**
  The `02-ai-agents/` reorganization into `01-foundations/`, `02-skills/`,
  `03-context-and-memory/`, `04-protocols/`, `05-production/` was never reflected in
  the nav. Broken entries (old → new location):
  `02-ai-agents/anatomy-of-a-skill.md`, `claude-agent-skills.md`,
  `skills-design-patterns.md`, `skills-testing-iteration.md` → `02-ai-agents/02-skills/`;
  `ai-agents-overview.md`, `google-5-day-ai-agents-course.md`, `ai-coding-spectrum.md`,
  `models-for-ai-agents-2026.md`, `open-models.md` → `02-ai-agents/01-foundations/`;
  `context-engineering.md`, `agent-context-window-performance.md`,
  `cursor-dynamic-context-discovery.md` → `02-ai-agents/03-context-and-memory/`;
  `mcp-guide.md`, `a2a-protocol-guide.md` → `02-ai-agents/04-protocols/`;
  `ultimate-2026-ai-software-implementation-guide.md` → `02-ai-agents/05-production/`;
  `self-evolving-agents-google-adk.md` → `02-ai-agents/02-skills/`;
  `05-tools/agents-md-claude-code-tutorial.md` → `02-ai-agents/03-context-and-memory/`.
  Done when: `mkdocs build --strict` reports no missing nav files.

- [ ] **P1-02 Add orphaned pages to `mkdocs.yml` nav.**
  ~31 content pages are unreachable from the site. Add nav sections mirroring the
  folder structure, including: the whole `08-requirements-engineering/` folder
  (overview, check-model-consistency, compare-specification-with-source-code),
  `02-ai-agents/README.md` + `ai-agents-quiz.md`,
  `02-skills/copilot-custom-skills-integration.md`,
  `03-context-and-memory/mempalace-ai-memory-tutorial.md`,
  `04-protocols/claude-managed-agents-tutorial.md`,
  `05-production/how-to-build-ai-agents-production.md`,
  `01-foundations/prompt-context-harness-engineering.md` (verify — may already be listed),
  `05-tools/claude-code-plugins-tutorial.md`, `05-tools/claude-md-design-tutorial.md`,
  `06-models-and-evaluations/types-of-ai-models-tutorial.md`,
  `09-conferences/conference-template.md` (or deliberately exclude templates).
  Depends on P1-05/P1-06 for the duplicate files.
  Done when: every content `.md` outside `docs/`/`website/` is in nav or deliberately excluded.

- [ ] **P1-03 Fix 13 broken internal links + 3 bare-filename links.**
  Worst file: `02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md`
  (9 broken links — still uses `./` paths from its old `05-tools/` location and wrong
  `../02-ai-agents/...` prefixes). Also: `agents.md` links to nonexistent
  `./mcp-guide.md` (twice); `09-conferences/conference-template.md` has a literal
  `<organizer-url>` placeholder; `07-use-cases-and-research/langchain-research-agent.md`
  has a literal `URL` placeholder. Bare links (need `./` prefix):
  `04-guides/ai-coding-rules-senior-engineers.md` (2 links — also note these targets
  live in `04-guides/`), and `source-index.md` → fix in `scripts/build-source-index.py`,
  not by hand.
  Done when: a repo-wide link check finds 0 broken relative links.

- [ ] **P1-04 Regenerate `source-index.md` and fix front-matter failures.**
  `python3 scripts/build-source-index.py` currently produces a diff vs. the committed
  file. Also `python3 scripts/check-frontmatter.py` fails on `02-ai-agents/README.md`
  and `02-ai-agents/ai-agents-quiz.md`. Fix the 6 first-tag violations too
  (first tag must equal directory category): `02-ai-agents/05-production/cicd-ai-agents-microsoft-foundry.md`
  ('guides'→'agents'), `02-ai-agents/03-context-and-memory/agents-md-claude-code-tutorial.md`
  and `agentmemory-tutorial.md` ('tools'→'agents'),
  `03-prompts-and-patterns/claude-prompt-shortcuts.md` ('prompts'→'patterns'),
  `03-prompts-and-patterns/role-constraint-format.md` ('pattern'→'patterns'),
  `07-use-cases-and-research/intelligent-document-processing-daita.md` ('use-case'→'research').
  Done when: both scripts exit 0 and `git diff` after regeneration is empty.

- [ ] **P1-05 Deduplicate the camera-movements library.**
  `ai-video-camera-movements-prompt-library.md` exists in both
  `06-models-and-evaluations/` and `07-use-cases-and-research/` (identical bodies) and
  both are in nav. Keep the `07-` copy (changelog says it was moved there), delete the
  `06-` copy, remove its nav entry, and fix any links pointing at the old path.

- [ ] **P1-06 Resolve versioned-content duplicates.**
  (a) `05-tools/claude-code-cheatsheet-tutorial.md` (210 lines, in nav) vs.
  `claude-code-cheatsheet-v2.md` (415 lines, orphaned) — merge or replace v1 with v2 in
  nav, then delete or deprecation-banner the loser.
  (b) `04-guides/genai-basics-glossary.md` vs. `genai-terms-explained-v2.md` — both in
  nav; either merge or add explicit cross-references stating which is current.
  (c) Delete stray HTML exports that duplicate markdown pages:
  `02-ai-agents/01-foundations/ai-agents-overview.html`,
  `05-tools/claude-code-notebooklm-integration-tutorial.html`.

- [ ] **P1-07 Fix `CITATION.cff`.**
  `cff-version: 1.3.0` is not a valid spec version — change to `1.2.0` (can break
  GitHub's "Cite this repository"). Bump `version`/`date-released` when P4-02 cuts a release.

---

## Phase 2 — Security hardening

- [ ] **P2-01 Fix stored XSS in the docs viewer (`docs/app.js`).**
  `marked.parse(text)` output is injected via `innerHTML` (line ~513 →
  `setViewerHtml`) with no sanitizer; raw HTML in any repo markdown executes on the
  GitHub Pages origin. Add DOMPurify (CDN, with SRI) and wrap:
  `els.viewer.innerHTML = DOMPurify.sanitize(html)`. Also remove `allow-same-origin`
  from the iframe `sandbox` attribute (line ~474) — combined with `allow-scripts` it
  defeats the sandbox.
  Done when: a test markdown file with `<img src=x onerror=alert(1)>` renders inert.

- [ ] **P2-02 Add Subresource Integrity to CDN scripts.**
  `docs/index.html` loads marked 12.0.2 and highlight.js 11.10.0 (JS + CSS) from cdnjs
  with no `integrity` attributes. Add SRI hashes + `crossorigin="anonymous"` to all
  four CDN tags, plus any tag added by P2-01.

- [ ] **P2-03 Repo hardening (manual, GitHub settings + small files).**
  Enable branch protection on `main` (require PR review), enable secret scanning +
  push protection. Add `SECURITY.md` (disclosure contact) and `.github/CODEOWNERS`
  (`* @TomasHer`). Settings steps are manual in the GitHub UI; files can be done in a PR.

- [ ] **P2-04 (Decision) Personal email exposure.**
  `01-about-author/speaking/index.md:80` publishes a personal Gmail. If intentional,
  check this off; otherwise replace with an alias or contact form link.

---

## Phase 3 — CI so it stays fixed

- [ ] **P3-01 Add GitHub Actions CI workflow.**
  `.github/workflows/ci.yml` running on PRs: (1) `mkdocs build --strict`;
  (2) `python3 scripts/check-frontmatter.py`; (3) relative-link checker (e.g. lychee
  with `--offline`); (4) regenerate `source-index.md` and fail if it differs;
  (5) `external-sources.md` alphabetical-order check; (6) grep new/changed content for
  `<script`, `onerror=`, `onclick=` as a content-injection tripwire (warn, not block).
  Depends on Phase 1 being done, otherwise CI starts red.

- [ ] **P3-02 Add orphan-page check.**
  Small script (`scripts/check-nav-coverage.py`): every tracked content `.md` must
  appear in `mkdocs.yml` nav or in an explicit allowlist (templates, READMEs). Wire
  into P3-01. This is the check whose absence let 35 pages go missing silently.

- [ ] **P3-03 Unify agent instruction files.**
  `.agent/rules/coding-guidelines.md` is a drifted copy of `agents.md` (missing the
  entire front-matter section). Make `agents.md` canonical and reduce the `.agent`
  rule to a pointer/import. While in there: add `01-about-author/`,
  `08-requirements-engineering/`, `09-conferences/` to the agents.md repository map,
  extend the front-matter rule to cover `06-`, `08-`, `09-`, and define the controlled
  tag vocabulary (P4-05).

---

## Phase 4 — Cleanup & slimming

- [ ] **P4-01 Asset diet (398 MB → target <100 MB).**
  (a) Delete byte-identical PDF duplicates: the three OpenAI PDFs exist in both
  `assets/guides/` and `assets/prompting-guides/` (~22 MB free; keep one location, fix links).
  (b) Replace vendored third-party PDFs >10 MB with links to the original sources —
  `pplx-at-work.pdf` (35 MB), `google-ai-agents-for-startup.pdf` (26 MB),
  `microsoft-m365-copilot-prompting-guide.pptx` (25 MB) — this also resolves the
  licensing exposure (they are not CC BY 4.0, unlike the repo's declared docs license).
  (c) Compress images >5 MB (`google_veo_3_1.gif` 16 MB, several speaking photos) and
  the 2.1 MB README hero PNG.

- [ ] **P4-02 Cut a release.**
  ~40 entries sit under "Unreleased" and the repo has zero git tags. Move them under
  `## [0.2.0] - <date>` in `CHANGELOG.md`, tag `v0.2.0`, bump `CITATION.cff`
  version + date-released.

- [ ] **P4-03 Remove or auto-generate `structure.txt`; fix README structure block.**
  `structure.txt` documents the pre-reorganization layout and is missing folders
  06–09 — delete it (README + `02-ai-agents/README.md` already cover structure).
  Update the README structure block: add `09-conferences/`, `scripts/`,
  `source-index.md`; fix indentation/ordering.

- [ ] **P4-04 Constrain the MkDocs build.**
  `docs_dir: "."` makes the build crawl the whole repo including 398 MB of assets.
  Either move content to a dedicated docs dir (big change) or add `exclude`/
  `not_in_nav` patterns for `assets/`, `website/`, `.agent/`, templates.

- [ ] **P4-05 Normalize `external-sources.md`.**
  261 entries, 37 out-of-order adjacent pairs, caused by mixed dash styles
  (`–` vs `—` vs `-`) and inconsistent `Author – Title` formats. Pick one format,
  re-sort, and add the sort check from P3-01 so it stays clean. Define the allowed
  front-matter tag vocabulary in `agents.md` at the same time.

- [ ] **P4-06 (Decision) Third-party PII in conference assets.**
  `09-conferences/gaise-2026.md` and `assets/speaking/` include third-party speaker
  names/photos under a CC BY 4.0 docs license. Confirm consent/usage rights, or note
  an exception in the license section.
