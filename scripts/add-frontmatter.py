#!/usr/bin/env python3
"""
Generate YAML front-matter stubs for content files that lack them.

Tier A (03-prompts-and-patterns): title, intent, model_tested, tags, last_updated
Tier B (02-ai-agents, 04-guides, 05-tools, 07-use-cases-and-research): title, tags, last_updated
Tier C (everything else): skipped

Run from the repo root:
    python3 scripts/add-frontmatter.py [--dry-run]
"""
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent

TIER_A = {"03-prompts-and-patterns"}
TIER_B = {"02-ai-agents", "04-guides", "05-tools", "07-use-cases-and-research"}

DIR_TAGS = {
    "02-ai-agents": "agents",
    "03-prompts-and-patterns": "patterns",
    "04-guides": "guides",
    "05-tools": "tools",
    "07-use-cases-and-research": "research",
}

STOP_WORDS = {
    "ai", "tool", "the", "and", "for", "with", "how", "to", "of", "a", "an",
    "guide", "tutorial", "overview", "playbook", "blueprint", "prompt", "prompting",
    "2025", "2026", "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
    "vs", "via", "deep", "intro", "introduction", "using",
}

VERSION_RE = re.compile(r"^v\d+(\.\d+)*$")
YEAR_RE = re.compile(r"^\d{4}$")


def get_nav_titles() -> dict[str, str]:
    """Parse mkdocs.yml and return {relative_path: nav_title}."""
    import yaml  # guarded import — only needed here

    with open(REPO_ROOT / "mkdocs.yml", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    titles: dict[str, str] = {}

    def walk(nav):
        for item in nav:
            if isinstance(item, dict):
                for key, value in item.items():
                    if isinstance(value, str):
                        titles[value] = key
                    elif isinstance(value, list):
                        walk(value)

    walk(config.get("nav", []))
    return titles


def git_date(path: Path) -> str:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%as", "--", str(path)],
        capture_output=True, text=True, cwd=REPO_ROOT,
    )
    return result.stdout.strip() or "2025-01-01"


def first_heading(content: str) -> str | None:
    for line in content.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return None


def extract_intent(content: str) -> str:
    """Pull first non-empty line(s) from an ## Intent section, if present."""
    lines = content.splitlines()
    capturing = False
    collected: list[str] = []

    for line in lines:
        if re.match(r"^##\s+Intent", line, re.IGNORECASE):
            capturing = True
            continue
        if capturing:
            if line.startswith("#"):
                break
            stripped = line.strip()
            if stripped and not stripped.startswith("-") or (stripped.startswith("-") and not collected):
                # take first prose sentence or first bullet
                collected.append(stripped.lstrip("- ").strip())
            if collected:
                break  # one sentence is enough

    intent = " ".join(collected)[:200]
    # strip trailing incomplete sentence punctuation
    return intent.rstrip(",;")


def infer_keyword(filename_stem: str) -> str | None:
    """Return the most informative 1-2 word keyword from a filename stem."""
    parts = [p for p in filename_stem.split("-") if p]
    # drop dates, versions, stop words
    clean = [
        p for p in parts
        if p.lower() not in STOP_WORDS
        and not VERSION_RE.match(p)
        and not YEAR_RE.match(p)
        and len(p) > 1
    ]
    if not clean:
        return None
    # try joining first two words if both survive the filter
    if len(clean) >= 2:
        return f"{clean[0]}-{clean[1]}"
    return clean[0]


def format_frontmatter(fields: dict) -> str:
    lines = ["---"]
    for key, value in fields.items():
        if isinstance(value, str):
            escaped = value.replace('"', '\\"')
            lines.append(f'{key}: "{escaped}"')
        elif isinstance(value, list):
            items = ", ".join(f'"{v}"' for v in value)
            lines.append(f"{key}: [{items}]")
        else:
            lines.append(f"{key}: {value}")
    lines.append("---")
    return "\n".join(lines)


def process_file(path: Path, nav_titles: dict, tier: str, dry_run: bool) -> str:
    """
    Returns: "skipped" | "already" | "written"
    """
    with open(path, encoding="utf-8") as f:
        content = f.read()

    if content.lstrip().startswith("---"):
        return "already"

    rel = str(path.relative_to(REPO_ROOT))
    dir_name = path.parent.name
    stem = path.stem

    title = (
        nav_titles.get(rel)
        or first_heading(content)
        or stem.replace("-", " ").title()
    )

    primary_tag = DIR_TAGS.get(dir_name, dir_name)
    keyword = infer_keyword(stem)
    tags = [primary_tag] + ([keyword] if keyword and keyword != primary_tag else [])

    date = git_date(path)

    if tier == "A":
        intent = extract_intent(content)
        fields = {
            "title": title,
            "intent": intent,
            "model_tested": [],
            "tags": tags,
            "last_updated": date,
        }
    else:
        fields = {
            "title": title,
            "tags": tags,
            "last_updated": date,
        }

    fm = format_frontmatter(fields)
    new_content = fm + "\n\n" + content

    if not dry_run:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)

    return "written"


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("DRY RUN — no files will be modified\n")

    nav_titles = get_nav_titles()

    counts = {"written": 0, "already": 0, "skipped": 0}

    for dir_name, tier in [(d, "A") for d in TIER_A] + [(d, "B") for d in TIER_B]:
        dir_path = REPO_ROOT / dir_name
        if not dir_path.exists():
            continue
        for md_file in sorted(dir_path.glob("*.md")):
            result = process_file(md_file, nav_titles, tier, dry_run)
            rel = md_file.relative_to(REPO_ROOT)
            if result == "written":
                print(f"  ✓  {rel}")
            elif result == "already":
                print(f"  ↷  {rel}  (front-matter exists)")
            counts[result] += 1

    verb = "would be" if dry_run else "were"
    print(
        f"\nDone: {counts['written']} files {verb} updated, "
        f"{counts['already']} already had front-matter."
    )


if __name__ == "__main__":
    main()
