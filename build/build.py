#!/usr/bin/env python3
"""
Maryville Soccer Camp — build

Assembles src/ into ONE self-contained HTML file at dist/maryville-soccer-camp.html.

    python3 build/build.py

What it does
    - inlines src/styles.css into the <style> block
    - inlines src/data.js   (the only file the coach edits each year)
    - inlines src/script.js (header, footer, router, bindings, accordions, tabs)
    - embeds every file in src/assets/ as a base64 data URI, ONCE, in a JS map
    - concatenates the seven page bodies from src/pages/ as <section class="page">
    - appends the camp assistant (src/assistant.css, src/assistant.js). It runs
      in its own <script>, so if it fails the site carries on without it.

Why one file
    The single file must run with no server, no build step at the destination,
    and no external requests beyond Google Fonts. Images are embedded once in a
    JS map and applied by key (data-img="brady") rather than pasted into every
    <img> — pasting them inline made the file roughly four times larger.
"""

import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
DIST = ROOT / "dist"

# Page order drives nothing at runtime (the router uses ids) but keeps the
# output diff-friendly.
PAGES = [
    "index",
    "id-prospect",
    "elite-camp",
    "hs-team-camp",
    "faq",
    "register",
    "contact",
]


def load_images():
    """Every file in src/assets (except the manifest) becomes one data URI."""
    manifest = json.loads((SRC / "assets" / "manifest.json").read_text())
    mime = {"webp": "image/webp", "png": "image/png", "jpg": "image/jpeg"}
    images = {}
    for key, filename in manifest.items():
        path = SRC / "assets" / filename
        ext = filename.rsplit(".", 1)[1]
        data = base64.b64encode(path.read_bytes()).decode()
        images[key] = f"data:{mime[ext]};base64,{data}"
    return images


def load_pages():
    out = []
    for slug in PAGES:
        raw = (SRC / "pages" / f"{slug}.html").read_text()
        title = re.search(r"<!-- (.*?) -->", raw).group(1)
        body = re.sub(r"^<!--.*?-->\n", "", raw, count=2, flags=re.S).strip()
        out.append(
            f'<section class="page" id="page-{slug}" '
            f'data-title="{title}" hidden>\n{body}\n</section>'
        )
    return "\n\n".join(out)


def main():
    css = (SRC / "styles.css").read_text() + "\n" + (SRC / "assistant.css").read_text()
    data = (SRC / "data.js").read_text()
    script = (SRC / "script.js").read_text()
    assistant = (SRC / "assistant.js").read_text()
    head = (SRC / "head.html").read_text()
    images = load_images()

    script = script.replace("__IMAGES__", json.dumps(images))
    head = head.replace("__CSS__", "\n" + css + "\n")

    html = (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n"
        + head.strip()
        + "\n</head>\n<body>\n"
        '<a class="skip" href="#main">Skip to content</a>\n\n'
        '<div id="site-header"></div>\n\n'
        '<main id="main">\n'
        + load_pages()
        + "\n</main>\n\n"
        '<div id="site-footer"></div>\n\n'
        "<script>\n" + data.strip() + "\n</script>\n"
        "<script>\n" + script.strip() + "\n</script>\n"
        "<script>\n" + assistant.strip() + "\n</script>\n"
        "</body>\n</html>\n"
    )

    DIST.mkdir(exist_ok=True)
    out = DIST / "maryville-soccer-camp.html"
    out.write_text(html)
    print(f"built {out}  —  {len(html) // 1024} KB  ({len(images)} embedded images)")


if __name__ == "__main__":
    main()
