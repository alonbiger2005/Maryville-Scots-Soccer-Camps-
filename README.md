# Maryville Soccer Camp

Rebuild of the Maryville College Soccer Camp website. One self-contained HTML
file, no dependencies, no build step at the destination.

## Build

```bash
python3 build/build.py
open dist/maryville-soccer-camp.html
```

## Updating for next year

Open **`src/data.js`**, change the dates, prices and registration links, change
`registrationStatus`, then run the build. That is the whole job — nothing else
needs touching.

## Files

| Path | What |
|---|---|
| `CLAUDE.md` | **Read first.** Project state, decisions, constraints, gotchas. |
| `CONTENT-CHECKLIST.md` | Items needing human verification before publishing. |
| `docs/ORIGINAL-BRIEF.md` | The original design brief. |
| `src/data.js` | Dates, prices, links. The file the coach edits. |
| `src/pages/` | Seven page bodies. |
| `src/styles.css` | Design system + dark theme. |
| `src/script.js` | Header, footer, router, bindings, accordions, tabs. |
| `src/assets/` | 14 images + `manifest.json`. |
| `build/build.py` | Assembles `src/` into `dist/`. |
| `dist/` | Generated. Don't edit. |

## Hosting

Drop `dist/maryville-soccer-camp.html` on any static host (Netlify, GitHub
Pages, Cloudflare Pages) as `index.html`. Nothing else is required.
