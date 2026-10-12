# Content checklist — verify before publishing

Everything below was carried over from the old Google Site
(`sites.google.com/view/maryvillesoccercamp`) or inferred from it. Nothing on this
list was invented, but all of it needs a human to confirm it before the site goes live.

Almost every item lives in **`data.js`**. Edit that one file and the whole site updates.

---

## 1. Blocking — the site should not go live until these are confirmed

| # | Item | Where it lives | Why it needs checking |
|---|------|----------------|----------------------|
| 1 | **Camp year** — is 2026 still the season being advertised? | `data.js` → dates, `registrationStatus` | The old site was still showing 2026 dates. |
| 2 | **ID & Prospect registration link** | `data.js` → `camps.prospect.registrationUrl` | ⚠️ The old site used **two different forms** for this camp. The homepage linked to a `docs.google.com` form; the ID camp page linked to `goo.gl/forms/ksjU3xZmJObtYCM63`. Only one can be right. |
| 3 | **Team Camp registration link** | `data.js` → `camps.team.registrationUrl` | It is a `goo.gl` short link. Google has been retiring these. Please supply the full form URL. |
| 4 | **Elite Camp registration link** | `data.js` → `camps.elite.registrationUrl` | Old link was `http://` (not secure). Changed to `https://` — confirm it still opens. |
| 5 | **Thursday awards timing at Elite Camp** | `elite-camp.html` → Thursday tab | ⚠️ The old site said the field session runs 9:15–11:30 AM *and* that awards begin at 11:00 AM. These overlap. |
| 6 | **Check mailing address** | `data.js` → `payment` | Currently Pepe Fernandez, 2101 Chippendale Drive, Maryville, TN 37803. Confirm this is still where checks should go. |
| 7 | **Payment provider** | `data.js` → `payment.onlinePaymentUrl` | Left blank on purpose. Confirm whether PayPal is still being used for 2026, and whether the mobile-browser problem described on the old site still applies. |
| 8 | **Maryville College branding approval** | logos, colours, wording | The site uses the Scots logo and the men's and women's soccer logos. Confirm the college is happy with this use. The men's soccer logo also contains a **Nike swoosh** — confirm that is fine to display. |

---

## 2. Dates and prices

- [ ] ID & Prospect Camp — men's session, currently **Saturday, February 14, 2026**
- [ ] ID & Prospect Camp — women's session, currently **Sunday, February 15, 2026**
  *(The old site spelled this "Febuary" and did not state the days of the week. Both were corrected — confirm the weekdays are right.)*
- [ ] ID & Prospect Camp price — **$110**, lunch included
- [ ] Elite Camp dates — **May 31 – June 4, 2026**
- [ ] Elite Camp ages — **8–17**
- [ ] Elite Camp day price — **$235** (includes lunch Mon–Wed)
- [ ] Elite Camp overnight price — **$440** (includes 3 meals Mon–Wed + breakfast Thursday)
- [ ] HS Girls Team Camp dates — **July 12 – 15, 2026**
- [ ] HS Girls Team Camp day price — **$210**
- [ ] HS Girls Team Camp overnight price — **$375**
- [ ] Mountain Challenge — **$30 per player**, optional

---

## 3. Camp detail to confirm

- [ ] **Overnight meals.** The old Elite Camp page said overnight campers get three meals Mon–Wed plus breakfast Thursday, and that no meal is served Sunday evening (pizza orders available instead). Still accurate?
- [ ] **ID & Prospect schedule.** Times were taken exactly from the old site (10:00 AM check-in through 3:00 PM finish). Confirm nothing has moved.
- [ ] **Check-in location.** Cooper Athletic Center for ID & Prospect. Confirm where Elite Camp overnight campers check in — the old site said "the dorms" without naming which.
- [ ] **Soccer complex address.** The FAQ says training happens "on the Maryville College campus." If there is a specific MC Soccer Complex address parents should drive to, it should be added.
- [ ] **Goalkeeper School.** Only what the old site stated is published (full-time keeper training; part-time keepers choose daily). No curriculum detail was invented. Add specifics if the goalkeeper coach wants them.
- [ ] **Mountain Challenge options.** High ropes, low ropes, canoes. Still the three choices?
- [ ] **Team Camp format.** Two sessions daily plus evening games — confirm.
- [ ] **Past participating programs.** 14 schools listed in `data.js` → `pastTeams`. Confirm the list, and that they are happy to be named.

---

## 4. Contact

- [ ] Email — **maryvillesoccercamp@gmail.com**
  - The **"Email us" buttons** open a Gmail compose window in a new tab, rather than handing off to whatever mail client the computer has registered. Anyone not signed in to Gmail will see a Google sign-in first.
  - The **email address itself**, wherever it appears as text (contact card, footer, FAQ), stays a normal `mailto:` link, so people who use Outlook, Apple Mail or anything else still have that route.
  - Both are generated from `data.js` → `contact.email`; change it once and every link updates.
- [ ] Phone — **865-256-4070** (used as a tappable `tel:` link, so it must be a line someone answers)
- [ ] Directions link — currently points to Maryville College's main address on Google Maps. Confirm or replace in `data.js` → `location.mapsUrl`.

---

## 5. Photography

All six supplied images are in use. None were generated or altered beyond resizing and
removing flat backgrounds behind the logos.

| Image | Used on |
|-------|---------|
| Maryville Scots logo | Header, mobile menu, footer, homepage hero, Contact page |
| MC Men's Soccer logo | Homepage programs panel, ID & Prospect men's session card |
| MC Women's Soccer logo | Homepage programs panel, ID & Prospect women's session card, Team Camp page |
| Championship team photo | **Homepage hero**, faded behind the heading |
| Night match action (No. 12) | **ID & Prospect** — hero and camp card, and the Register page |
| Away match action (No. 3) | **Elite Camp** — hero and camp card, and the Register page |
| Women's match action (No. 18) | **HS Girls Team Camp** — hero and camp card, and the Register page |
| Goalkeeper photo | Goalkeeper School — a panel on the homepage, faded behind the section on the Elite Camp page |
| MC Soccer Complex | Homepage "Train in the heart of East Tennessee", Elite Camp location, and faded behind "More than soccer" on the Team Camp page |

Each camp page's hero now uses the same photograph as that camp's card on the homepage,
faded behind the heading.

- [ ] **Championship caption.** The homepage caption reads "2025 Collegiate Conference of the South champions," based on the banner in the photo. Confirm the year and competition.
- [ ] **Photo credit.** If any of these images came from Maryville College Athletics, a photographer credit may be required.
- [ ] **Goalkeeper photograph — check the setting.** The Goalkeeper School now uses a photograph of two Maryville keepers at sunset. The kit reads clearly, but the background is a European pitch with hillside houses, not the Maryville College campus. On a page that says training takes place on campus, someone who knows the area may notice. Confirm you are happy with it, or send a keeper photo taken at Maryville.
- [ ] **Earlier goalkeeper photograph.** The Goalkeeper School sections now use a daylight photo of the keeper set on his line, framed wide enough to show the goal and the players around him. It carries no watermark and no credit line. **Confirm who took it and whether a photographer credit is needed.** The earlier night photograph (© Williamson Photography) is no longer used anywhere on the site.
- [ ] **Away-match photo.** The Elite Camp photograph was taken at an away fixture and the opposition's touchline banner is partly visible. It has been cropped tightly and the hero gradient darkens the top of the frame, but a home-field photo would be better if one exists.
- [x] **Campus photography.** The MC Soccer Complex photograph now anchors the East Tennessee section.

---

## 6. Sections deliberately left empty

- **Staff** (`data.js` → `staff`). The section exists on the Contact page but is hidden while the array is empty. No coach biographies were written. Add real, approved information to switch it on.
- **Testimonials** (`data.js` → `testimonials`). Layout exists on the homepage, hidden while empty. **Never write these yourself** — only add quotes families actually gave you.

---

## 7. Things from the old site that were dropped or changed

| Old site | New site | Why |
|----------|----------|-----|
| **Jr. Elite Camp** page | Not included | The page existed in the navigation but was completely blank. **Decide:** does this camp still run? If so, send the details and it can be added. If not, nothing to do. |
| PayPal warning about Safari and mobile browsers, sitting in the middle of the homepage | Moved into a "Payment help" accordion on the FAQ page | It was scaring people off before they had read what the camps were. |
| Raw PayPal `<script>` code and QR code images visible as page text | Removed | It was broken markup showing on the live page. |
| "Febuary" | "February" | Spelling. |
| "May31 -June 4" / "July 12 -July 15" | "May 31 – June 4" / "July 12 – 15" | Spacing and dashes. |
| "MEN ONLY , FEBUARY 14, 2026" as an `<h1>` | Session cards under one page heading | Three competing `<h1>`s on one page. |
| Check mailing address repeated on three pages | Stored once in `data.js`, shown on Contact and FAQ | One place to update. |
| Staff information mixed into a heading called "Staff" on the Team Camp page that actually listed past teams | Split: past teams now have their own section, staff section left empty | The old heading did not match its content. |

---

## 8. Testing done

- [x] Desktop, tablet and mobile layouts
- [x] Every internal link resolves to a file that exists
- [x] Every registration link points at the URL stored in `data.js`
- [x] `tel:` and `mailto:` links generated from `data.js`
- [x] Keyboard navigation: skip link, menu, accordions, schedule tabs
- [x] `prefers-reduced-motion` respected
- [x] Colour contrast — every text element on all seven pages measured against its real background; all pass WCAG AA
- [ ] **Test on a real phone** once hosted — particularly the registration forms

---

---

## 9. Design changes made after the first draft

- The site now runs on a **dark theme** — near-black garnet surfaces with light text, garnet navigation, orange calls to action. The original light design is still intact underneath: the dark theme lives entirely in one stylesheet layer.
- **Every camp card now leads with a photograph**, on both the homepage and the registration page.
- The homepage hero is the **championship team photo**.
- The Goalkeeper School sections carry a real goalkeeper photograph.
- The men's and women's soccer marks sit on a **cream plate** wherever they appear. The men's mark has black lettering and a black swoosh, which were invisible against a dark card.
- The repeated photo band was removed from the homepage — with photographs on all three camp cards, it was showing the same image twice.
- The **homepage hero fades the championship photograph behind the heading**, full-bleed edge to edge. The frame height tracks the photo's own 16:9 shape, so on ordinary screens nothing is cropped; only on unusually tall windows does it trim sky and turf rather than players. On phones the photo anchors to the top of the frame and the heading reads over the darker area beneath it.
- The **Elite Camp photograph is framed wide enough to show both players head to toe**, including the far player's face, rather than the tight crop used in the first pass.
- The **goalkeeper photograph keeps its original framing**, uncropped.
- **Site navigation never leaves the page.** All internal links route in memory and carry no `href`, because preview and embed frames inspect an anchor's `href` on click and interrupt with an "open external link" prompt before any script runs. They keep `role="link"` and `tabindex`, so keyboard and screen-reader behaviour is unchanged. Only 11 links across the whole site go off-site: the three registration forms, the map links, the college site and the athletics site. Each is marked with a small arrow and an "opens in a new tab" label.
- **Every card-like surface lifts under the pointer** — camp cards, feature cards, panels, fact tiles, schedule rows, team pills, hero fact chips and the crest plates. Camp card photographs also scale gently. All of it is switched off under `prefers-reduced-motion`.

---

## 10. One deliberate colour decision

The brief specified orange call-to-action buttons with white text. White on Maryville
Orange (`#F26522`) measures **3.15:1**, which fails the WCAG AA minimum of 4.5:1 for
button text — a real problem for older parents reading on a phone in daylight.

Buttons therefore rest on a slightly deeper shade of the same orange (`#C9450F`,
one step darker than the palette's Dark Orange) and **brighten to full Maryville Orange
on hover**, which the brief also asked for. Rules, dots, focus rings and accents all still
use `#F26522` exactly as specified. The change is confined to text-on-orange, where
legibility is at stake.

On the dark theme there is no headroom to brighten the fill on hover either — full Maryville Orange under white text measures 3.15:1. Hover therefore keeps the accessible fill and signals itself with a bright orange ring and glow, which still reads as the button lighting up.

Both values are defined at the top of `styles.css` if you would rather set them back.

---

## How to update next year

1. Open `data.js`.
2. Change the dates, prices and registration links.
3. Change `registrationStatus` (e.g. to `"2027 camp dates coming soon"`).
4. Save and re-upload. That's the whole job.
