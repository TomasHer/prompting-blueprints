#!/usr/bin/env python3
"""
Generate the "Recently added" list in README.md.

The list shows the 5 most recently *added* content pages, derived automatically
from git history (the commit that first introduced each file). No manual
bookkeeping is required: add a new content page, commit it, and the next run
picks it up.

The list is written between these markers in README.md:

    <!-- RECENT_ADDITIONS:START -->
    ...generated list...
    <!-- RECENT_ADDITIONS:END -->

Because README.md is also the MkDocs homepage (`- Home: README.md`), the same
block appears on GitHub and on the published site.

Usage:
    python3 scripts/build-recent-additions.py            # write README.md
    python3 scripts/build-recent-additions.py --check    # verify it is up to date

The --check mode exits 1 if README.md is missing the block or is stale, so it
can be wired into CI alongside check-frontmatter.py / build-source-index.py.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
README = REPO_ROOT / "README.md"

START = "<!-- RECENT_ADDITIONS:START -->"
END = "<!-- RECENT_ADDITIONS:END -->"

# How many recent additions to list.
LIMIT = 5

# Only markdown under the numbered content sections counts as a "new thing".
CONTENT_GLOB = re.compile(r"^0\d-[^/]+/.*\.md$")

# Section overviews and scaffolding are not content "things".
EXCLUDE_NAMES = {"README.md"}
EXCLUDE_SUFFIXES = ("-template.md",)


def added_dates() -> dict[str, str]:
    """Map each content file to the date it was first added to git (YYYY-MM-DD)."""
    out = subprocess.run(
        [
            "git",
            "log",
            "--diff-filter=A",
            "--name-only",
            "--date=short",
            "--pretty=format:%ad",
        ],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout

    dates: dict[str, str] = {}
    current_date = None
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", line):
            current_date = line
        elif line not in dates:  # git log is newest-first; keep the first (latest) add
            dates[line] = current_date
    return dates


def is_content(path: str) -> bool:
    if not CONTENT_GLOB.match(path):
        return False
    name = path.rsplit("/", 1)[-1]
    if name in EXCLUDE_NAMES:
        return False
    if any(name.endswith(suffix) for suffix in EXCLUDE_SUFFIXES):
        return False
    return (REPO_ROOT / path).exists()  # skip files that were later moved/deleted


def title_for(path: str) -> str:
    """Prefer the front-matter title, then the first H1, then a prettified name."""
    text = (REPO_ROOT / path).read_text(encoding="utf-8")
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            fm = text[3:end]
            m = re.search(r'^title:\s*"?(.+?)"?\s*$', fm, re.MULTILINE)
            if m:
                return m.group(1).strip()
    m = re.search(r"^#\s+(.+?)\s*$", text, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return path.rsplit("/", 1)[-1][:-3].replace("-", " ").title()


def build_list() -> str:
    dates = added_dates()
    content = [(p, d) for p, d in dates.items() if is_content(p)]
    content.sort(key=lambda pd: (pd[1] or "", pd[0]), reverse=True)
    rows = []
    for path, date in content[:LIMIT]:
        rows.append(f"- **{date}** · [{title_for(path)}](./{path})")
    if not rows:
        return "_No content pages found yet._"
    return "\n".join(rows)


def render(block: str) -> str:
    return f"{START}\n{block}\n{END}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="exit 1 if README.md is missing the block or is stale",
    )
    args = parser.parse_args()

    original = README.read_text(encoding="utf-8")
    if START not in original or END not in original:
        print(
            f"ERROR: README.md is missing the markers {START} ... {END}.",
            file=sys.stderr,
        )
        return 1

    new_block = render(build_list())
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    updated = pattern.sub(lambda _: new_block, original, count=1)

    if args.check:
        if updated != original:
            print(
                "ERROR: README.md 'Recently added' list is stale. "
                "Run: python3 scripts/build-recent-additions.py",
                file=sys.stderr,
            )
            return 1
        print("OK: README.md 'Recently added' list is up to date.")
        return 0

    if updated != original:
        README.write_text(updated, encoding="utf-8")
        print("Updated README.md 'Recently added' list.")
    else:
        print("README.md 'Recently added' list already up to date.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
