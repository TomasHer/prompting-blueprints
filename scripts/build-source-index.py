#!/usr/bin/env python3
"""
Generate source-index.md: a reverse map from each external source to the
content file(s) that cite it.

`external-sources.md` is the canonical, hand-maintained registry of every
external reference (alphabetical, no back-references). This script reads that
registry, then scans the repository's content for each source URL and records
which files cite it -- making it possible to backtrack from a source to the
page(s) where it appears.

Usage:
    python3 scripts/build-source-index.py            # write source-index.md
    python3 scripts/build-source-index.py --check     # verify it is up to date

The --check mode exits 1 if source-index.md is missing or stale, so it can be
wired into CI or a pre-commit hook alongside check-frontmatter.py.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
REGISTRY = REPO_ROOT / "external-sources.md"
OUTPUT = REPO_ROOT / "source-index.md"

# Files that are not "content" and should never count as a citation site.
EXCLUDE = {"external-sources.md", "source-index.md"}

# Matches a markdown list item:  - [Title](url)
ENTRY_RE = re.compile(r"^\s*-\s*\[(?P<title>.+?)\]\((?P<url>.+)\)\s*$")
# Matches a top-level section heading:  ## Section
SECTION_RE = re.compile(r"^##\s+(?P<name>.+?)\s*$")
# Characters that may legally continue a URL; used to reject prefix matches.
URL_TAIL = r"[\w/._\-?=#&%~:@]"


def parse_registry(text: str):
    """Yield (section, title, url) tuples in registry order."""
    section = None
    for line in text.splitlines():
        sec = SECTION_RE.match(line)
        if sec:
            section = sec.group("name")
            continue
        entry = ENTRY_RE.match(line)
        if entry:
            yield section, entry.group("title"), entry.group("url")


def content_files():
    """All git-tracked markdown files that may cite a source."""
    out = subprocess.run(
        ["git", "ls-files"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    files = []
    for rel in out.splitlines():
        if rel.endswith(".md"):
            if Path(rel).name in EXCLUDE:
                continue
            files.append(rel)
    return sorted(files)


def build_url_matcher(url: str) -> re.Pattern:
    """Match the URL only when it is not a prefix of a longer URL.

    e.g. https://notebooklm.google must not match
         https://notebooklm.google.com/...
    """
    url_stripped = url.rstrip("/")
    return re.compile(re.escape(url_stripped) + r"/?(?!" + URL_TAIL + r")")


def render(sources, citations) -> str:
    lines = [
        "# Source Index",
        "",
        "<!-- GENERATED FILE - do not edit by hand. -->",
        "<!-- Run: python3 scripts/build-source-index.py -->",
        "",
        "Reverse map of every entry in "
        "[`external-sources.md`](external-sources.md) to the content file(s) "
        "that cite it. Use this to backtrack from a source to where it is "
        "used. Regenerate after editing citations or the registry.",
        "",
    ]
    current_section = object()
    for section, title, url in sources:
        if section != current_section:
            current_section = section
            lines.append(f"## {section}")
            lines.append("")
        lines.append(f"- [{title}]({url})")
        files = citations.get(url, [])
        if files:
            refs = ", ".join(f"`{f}`" for f in files)
            lines.append(f"  - cited in: {refs}")
        else:
            lines.append("  - _not cited in any content file_")
    lines.append("")
    return "\n".join(lines)


def generate() -> str:
    registry_text = REGISTRY.read_text(encoding="utf-8")
    sources = list(parse_registry(registry_text))

    # De-duplicate URLs while preserving registry order.
    seen = set()
    unique_urls = []
    for _, _, url in sources:
        if url not in seen:
            seen.add(url)
            unique_urls.append(url)

    # Read each content file once, test every URL against it.
    file_texts = {
        rel: (REPO_ROOT / rel).read_text(encoding="utf-8")
        for rel in content_files()
    }
    matchers = {url: build_url_matcher(url) for url in unique_urls}

    citations: dict[str, list[str]] = {url: [] for url in unique_urls}
    for rel, text in file_texts.items():
        for url, matcher in matchers.items():
            if matcher.search(text):
                citations[url].append(rel)

    return render(sources, citations)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify source-index.md is up to date instead of writing it",
    )
    args = parser.parse_args()

    rendered = generate()

    if args.check:
        current = OUTPUT.read_text(encoding="utf-8") if OUTPUT.exists() else ""
        if current != rendered:
            print(
                "FAIL: source-index.md is missing or out of date.\n"
                "Run  python3 scripts/build-source-index.py  to regenerate it."
            )
            sys.exit(1)
        print("OK: source-index.md is up to date.")
        return

    OUTPUT.write_text(rendered, encoding="utf-8")
    n = rendered.count("\n  - ")
    print(f"Wrote {OUTPUT.relative_to(REPO_ROOT)} ({n} sources indexed).")


if __name__ == "__main__":
    main()
