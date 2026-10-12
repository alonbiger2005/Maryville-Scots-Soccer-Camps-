# Maryville Soccer Camp — project brief

Read this before touching anything. It is the accumulated state of a long
rebuild: the decisions, the constraints, and the bugs already paid for once.

---

## What this is

A complete rebuild of the Maryville College Soccer Camp website, replacing
`sites.google.com/view/maryvillesoccercamp`. Seven pages, dark theme,
self-contained.

Owner: **Alon** — goalkeeper on the Maryville College men's team, who runs the
camp's web presence. The original brief is in `docs/ORIGINAL-BRIEF.md`; it is
still the governing spec except where this file records a later decision.

**Status: feature-complete, not yet published.** The blocker is content
verification, not code — see `CONTENT-CHECKLIST.md`.

---

## Build and run

```bash
python3 build/build.py        # src/ -> dist/maryville-soccer-camp.html
open dist/maryville-soccer-camp.html
```

No dependencies, no package manager, no server. Python 3 standard library only.

**Edit `src/`, never `dist/`.** The dist file is generated and will be
overwritten.

---

## Architecture

```
src/
  head.html        <head> contents; __CSS__ token is replaced at build
  styles.css       base design system + dark theme layer (41 KB)
  data.js          ← THE ONLY FILE THE COACH EDITS. Dates, prices, links.
  script.js        header, footer, router, data binding, accordions, tabs
  pages/*.html     seven page bodies, no <html>/<head>/<body> wrapper
  assets/          14 images + manifest.json mapping key -> filename
build/build.py     assembles everything into one file
dist/              generated output
```

### The output must stay a single file

Non-negotiable across all of Alon's builds. One HTML file, no external requests
except Google Fonts, every asset embedded as base64. It gets opened from a text
message or a QR code with no hosting involved.

### Images are embedded once

Each asset appears **once** in a JS `IMAGES` map; every `<img>` carries
`data-img="brady"` and gets its `src` assigned on load.

> Pasting the data URI into each `<img>` inline made the file 1.33 MB instead
> of 419 KB (back when there were 8 images) — the championship photo alone
> appeared three times. Don't reintroduce that.
>
> The current build is **~726 KB with 14 embedded images**; the growth since
> then is the added `--wide`/`--narrow` hero and band variants, not
> duplication. The build prints the size — check it after adding an asset.

### Routing is in memory and carries no `href`

All seven pages live in one document as `<section class="page">`. Navigation is
pure JS state.

> **This has broken twice, both times in a preview/embed frame.**
>
> 1. Hash routing (`location.hash = '#/elite-camp'`) — preview frames restrict
>    URL changes; the page painted, then died on first navigation.
> 2. Keeping a bare `href="#page-register"` after removing `target` — the frame
>    inspects an anchor's `href` on click and shows an "open external link"
>    dialog **before any JS runs**, so `preventDefault()` was too late.
>
> Internal links therefore have **no `href` at all**. They carry
> `data-goto="<page>"`, optional `data-frag="<id>"`, plus `role="link"` and
> `tabindex="0"`, and a keydown handler makes Enter/Space work. If you add an
> internal link, follow that pattern or it will break in preview.

Only 11 links leave the site: three registration forms, map links, the college
site, mcscots.com. Those keep real `href`s, get `rel="noopener noreferrer"`, a
↗ marker and an "opens in a new tab" label.

---

## Content rules

**Never invent camp information.** Everything on the site traces to the old
Google Site or to something Alon supplied. Where the source was ambiguous the
code carries `<!-- VERIFY WITH COACH -->` and the item is listed in
`CONTENT-CHECKLIST.md`. Staff bios and testimonials are deliberately empty —
the sections auto-hide while their arrays are empty. Do not populate them.

**Everything dated or priced lives in `src/data.js`.** It is written for a
non-developer: heavily commented, one object. Binding is by attribute —
`data-mc` (text), `data-mc-href`, `data-mc-mailto`, `data-mc-gmail`,
`data-mc-tel`, `data-mc-list`, `data-hide-if-empty`. Never hardcode a date or
price into a page.

---

## Design decisions that look like bugs

Changing these back will look like a fix and will be a regression.

| Decision | Why |
|---|---|
| Buttons use `#C9450F`, not Maryville Orange `#F26522` | White on `#F26522` is **3.15:1** — fails WCAG AA. `#C9450F` is 4.84:1. `#F26522` is still used for rules, dots and accents. |
| Hover brightens with a ring + glow, not a lighter fill | On dark there is no headroom: any brighter orange drops white text below 4.5:1. |
| `.reveal` classes are **removed** after the entrance animation | `.js-reveal .reveal.in { transform: none }` outranks `.camp-card:hover { transform: … }` and silently killed every hover lift. |
| Content is visible by default; the hidden state is opt-in via `js-reveal` on `<html>` | A JS failure must never leave prices and dates invisible. |
| Faded section backgrounds use a **pre-composited band** | The photo sits on a canvas of the section's own colour with feathered edges, so `object-fit: cover` only ever trims flat padding. Fitting the raw photo instead leaves a hard vertical seam — tried twice, visible both times. |
| Desktop and mobile use **different image files** for heroes and faded sections (`--wide` / `--narrow`) | The wide composite is built for a side-by-side layout; below 900px `cover` blows it up and crops into it. |
| "Email us" opens Gmail compose; the plain address stays `mailto:` | Alon's call — most parents use Gmail, and `mailto:` was opening Outlook. The address link keeps `mailto:` so Outlook/Apple Mail users aren't stranded. |
| `mailto:`/`tel:` clicks fall back to copying to clipboard after ~900ms | Covers preview frames, desktops with no mail client, laptops with no dialler. Watches for window blur so it stays quiet when a real client opens. |
| `img { height: auto }` is set globally | The `width`/`height` attributes are presentational hints that fight `max-width:100%` and stretch images vertically on phones. |
| `.page { padding-block: 0 }` | `.page` is a `<section>` and would otherwise inherit section padding, opening a gap above every hero. |

---

## Working with Alon

From a long iteration history:

- **Short, direct, screenshot-driven.** "The crop is terrible." "Undo everything
  from the last 2 prompts." Expect to render and look before claiming done.
- **Reverts are common.** Execute them cleanly — strip the CSS *and* the markup
  the change added. A half-revert left duplicate `<img>` layers stacked in every
  camp card once.
- **Image direction is exact.** Zoom level, crop framing, whether the ball is
  visible, seam quality. If an image treatment regresses he notices immediately.
- **He removes decoration.** Footer nav bar, redundant Register buttons, 3D
  spin, option cards — all cut. Default to less.
- **Some messages are voice-dictated**, so names and numbers may be phonetic.
- **Diagnose root cause.** Don't narrate implementation. When something breaks,
  reproduce it first — three separate "preview is broken" reports had three
  different causes, and guessing wasted two rounds each time.

---

## Verify before claiming done

The checks that have actually caught regressions:

```
• render at 1440, 780 and 390 and LOOK at the screenshots
• all 7 routes navigate; no internal link carries an href
• every <img> loads (naturalWidth > 0); no duplicate data-img on a page
• no horizontal overflow at 390px
• contrast: measure every text node against its real background, AA thresholds
  (text over a photo: sample the rendered pixels, not the CSS)
• accordions expand, schedule tabs switch, drawer + sticky bar navigate
• zero JS errors
• prefers-reduced-motion disables transforms
```

For preview-frame issues, reproduce inside
`<iframe sandbox="allow-scripts" srcdoc="…">` with all external network aborted.
That is the only way the routing bugs were ever visible.

---

## Current content state

Seven pages: Home, ID & Prospect, Elite Camp, HS Girls Team Camp, FAQ, Register,
Contact. Nav is Home · ID & Prospect · Elite Camp · HS Team Camp · FAQ ·
Contact · **Register** (orange). Mobile adds a sticky bar: Menu · Call · Camps ·
Register.

Camp-specific Register buttons go **straight to that camp's Google Form**.
Generic ones (nav, announcement bar, sticky bar, FAQ, Contact) go to the
Register hub, which can't know which camp you want.

**Images in use (8 originals):**

| Asset | Where |
|---|---|
| Scots logo | header, drawer, footer, home hero, contact |
| Men's / Women's soccer crests | home programs panel, ID & Prospect session cards — on a **cream plate**, because the men's mark has black lettering that vanishes on dark |
| Championship team photo | home hero, faded behind the heading |
| Night match (No. 12) | ID & Prospect hero + card, Register |
| Away match (No. 3) | Elite Camp hero + card, Register |
| Women's match (No. 18) | HS Team Camp hero + card, Register |
| Two keepers at sunset | Goalkeeper School, faded behind the Elite Camp section |
| MC Soccer Complex | home "East Tennessee", Elite Camp Location (faded) |

---

## Open items

`CONTENT-CHECKLIST.md` is the authority. The ones that block publishing:

1. **ID & Prospect has two competing registration form URLs** — the old site's
   homepage and camp page linked to different forms. One is wrong, and every
   Register button now goes straight to a form, so this fails at the point of
   registration.
2. **Team Camp registration is a `goo.gl` short link** — Google is retiring
   those. Needs the full URL.
3. **Elite Camp Thursday timing contradicts itself** — field session 9:15–11:30,
   awards at 11:00.
4. **Check mailing address and payment provider** unconfirmed (PayPal?).
5. **Maryville College branding approval** — the men's crest contains a Nike
   swoosh.
6. **Goalkeeper photo** carries no credit, and its background is a European
   pitch, not the Maryville campus, on a page that says training happens on
   campus.
7. **Jr. Elite Camp** was in the old nav with a completely blank page. Dropped.
   Confirm whether that camp still runs.
