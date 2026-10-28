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

**Set each camp's `endDate` too** (its last day, `YEAR-MONTH-DAY`). The day
after it, the site marks that camp finished on its own: its Register buttons
become "Ask about <next year>" and go to Contact, and its card and page say next
year's dates will be posted. When every camp is finished, the announcement bar
says the season is over. New dates plus a new `endDate` reopen it.

## Linking to one page

Add the page name after `#`: `…/maryville-soccer-camp.html#elite-camp`, or a
section too: `#elite-camp/schedule`. Pages: `index`, `id-prospect`,
`elite-camp`, `hs-team-camp`, `faq`, `register`, `contact`. Useful for texts
and QR codes. The site only reads the address; it never changes it.

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
| `src/assistant.js`, `src/assistant.css` | The camp assistant (chat bubble, bottom right). |
| `tests/assistant.test.js` | Browser tests for the assistant. |
| `tests/site.test.js` | Browser tests for the router, finished camps, loading, packing list, focus. |
| `src/assets/` | 14 images + `manifest.json`. |
| `build/build.py` | Assembles `src/` into `dist/`. |
| `dist/` | Generated. Don't edit. |

## Camp assistant

The chat bubble in the bottom-right corner of every page. It helps visitors
find the right camp, jump to any page or section, and get answers to common
questions. It has **no AI and sends nothing anywhere**: every answer is read
from the FAQ page or from `data.js`, so it can't say anything the site doesn't.

**Adding it to a page.** Nothing to do: `build.py` appends `assistant.css` to
the styles and `assistant.js` as its own `<script>` after `script.js`. Because
it's a separate script wrapped in `try/catch`, a failure in it leaves the site
untouched. Its only global is `window.siteAssistant` (`open()`, `close()`,
`state`).

**Where answers come from.**
- *Questions:* typed or spoken questions are matched against `FAQ_RULES` at
  the top of `assistant.js` (keyword pattern → FAQ item id, e.g.
  `registration-5`). The answer text is read from that FAQ accordion on the
  page, so editing the FAQ page updates the assistant. Anything containing
  `VERIFY` or `data.js` is coach-only and never read out. If no rule matches,
  a word-overlap search over the FAQ is tried; if that fails too, it says it
  doesn't know and gives the phone number and email.
- *Prices and dates:* built from `data.js` on the spot.
- *Context:* on a camp page, ambiguous questions ("is lunch included?")
  answer for that camp.

**Customising.** All in the CONFIG block at the top of `assistant.js`:
- `MENU`: the main-menu buttons.
- `PAGES`: "Go to a page", as page → sections. A section whose id no longer
  exists on the page is skipped, not shown as a dead end.
- `FAQ_RULES`: keyword → FAQ item. Rules are tried top to bottom, so put
  specific ones above general ones. `camp:` limits a rule to one camp's
  context.
- `AVOID`: bars the bubble must float above. Anything fixed to the bottom of
  the screen is also detected automatically.

Navigation buttons follow the site's internal-link rule: no `href`, just
`data-goto`/`data-frag`, so they work in preview frames.

**Voice.** The mic button uses the browser's speech recognition (Chrome, Edge,
Safari) and is hidden where that's missing. One session is kept for the whole
conversation, so the browser asks for the microphone only once. Short answers
send themselves 0.8 s after you stop talking; longer ones wait for Send. The
mic switches off when the panel closes or after 2 minutes of quiet. If the mic
is blocked, the assistant explains how to use the device's own dictation
instead. Note that in Chrome, speech is processed by Google's servers, and the
panel says so while the mic is on.

**AI and form filling.** Not built. The site has no forms of its own
(registration is on Google Forms, which can't be filled from this page), and
AI would need a server to hold an API key, which a single file can't have.

**Tests.**

```bash
python3 build/build.py
NODE_PATH="$(npm root -g)" node tests/assistant.test.js    # needs: npm i -g playwright
NODE_PATH="$(npm root -g)" node tests/site.test.js
```

Both run on a fixed date (January 2026, registration open) so results don't
change as the real calendar passes camp dates; the finished-camp tests set
their own dates.

## Hosting

Drop `dist/maryville-soccer-camp.html` on any static host (Netlify, GitHub
Pages, Cloudflare Pages) as `index.html`. Nothing else is required.
