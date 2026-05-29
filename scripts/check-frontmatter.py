#!/usr/bin/env python3
"""
Lint script: verify that all content markdown files have YAML front-matter.

Exits 0 if all files pass, 1 if any violations are found.

Usage:
    python3 scripts/check-frontmatter.py

Add to CI or as a pre-commit hook to prevent regression.
"""
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent

CONTENT_DIRS = {
    "02-ai-agents",
    "03-prompts-and-patterns",
    "04-guides",
    "05-tools",
    "07-use-cases-and-research",
}


def has_frontmatter(path: Path) -> bool:
    with open(path, encoding="utf-8") as f:
        first = f.read(4)
    return first.startswith("---")


def main():
    violations: list[str] = []

    for dir_name in sorted(CONTENT_DIRS):
        dir_path = REPO_ROOT / dir_name
        if not dir_path.exists():
            continue
        for md_file in sorted(dir_path.glob("*.md")):
            if not has_frontmatter(md_file):
                violations.append(str(md_file.relative_to(REPO_ROOT)))

    if violations:
        print(f"FAIL: {len(violations)} file(s) missing front-matter:\n")
        for v in violations:
            print(f"  {v}")
        print(
            "\nRun  python3 scripts/add-frontmatter.py  to generate stubs, "
            "then review and fill in any blank fields."
        )
        sys.exit(1)
    else:
        print(f"OK: all content files have front-matter.")


if __name__ == "__main__":
    main()
