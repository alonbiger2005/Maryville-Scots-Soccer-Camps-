#!/usr/bin/env node
/* ============================================================================
   Site — browser tests (router, finished camps, loading, packing list, a11y)

       python3 build/build.py
       NODE_PATH="$(npm root -g)" node tests/site.test.js

   Same setup as tests/assistant.test.js: needs the `playwright` package and
   runs against the built single file in dist/.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require('playwright');

const FILE = path.resolve(__dirname, '..', 'dist', 'maryville-soccer-camp.html');
const URL = 'file://' + FILE;
const DESKTOP = { viewport: { width: 1440, height: 900 } };
const PHONE = { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true };
const PAGES = ['index', 'id-prospect', 'elite-camp', 'hs-team-camp', 'faq', 'register', 'contact'];
const OPEN_DAY = '2026-01-15T12:00:00';     // all three camps still to come
const OVER_DAY = '2026-10-28T12:00:00';     // all three finished

/* ── tiny runner ─────────────────────────────────────────────────────────── */
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }
function eq(a, b, msg) { if (a !== b) throw new Error(`${msg}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

let browser;
async function page(opts = DESKTOP, url = URL) {
  const { now = OPEN_DAY, ...ctxOpts } = opts;
  const ctx = await browser.newContext(ctxOpts);
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', e => p.errors.push(e.message));
  await p.route(/^https?:/, r => r.abort());
  await p.clock.setFixedTime(new Date(now));
  await p.goto(url);
  return p;
}
const shown = p => p.evaluate(() => document.querySelector('.page:not([hidden])').id);
const nav = (p, sel) => p.evaluate(s => document.querySelector(s).click(), sel);
async function done(p) {
  assert(!p.errors.length, 'JS errors: ' + p.errors.join(' | '));
  await p.context().close();
}

/* ── 1. finished camps ───────────────────────────────────────────────────── */
test('before camp: every Register button goes to its form', async () => {
  const p = await page();
  const r = await p.evaluate(() => ({
    forms: document.querySelectorAll('a.btn[href*="forms"]').length,
    ask: [...document.querySelectorAll('a')].filter(a => /^Ask about \d{4}$/.test(a.textContent.trim())).length,
    notes: document.querySelectorAll('.camp-status').length,
    bar: document.querySelector('.announce').textContent
  }));
  assert(r.forms >= 10, 'register buttons point at forms: ' + r.forms);
  eq(r.ask, 0, 'no "Ask about 2027"');
  eq(r.notes, 0, 'no finished notes');
  const status = await p.evaluate(() => window.siteData.registrationStatus);
  assert(r.bar.includes(status), "announcement bar is the coach's text");
  await done(p);
});

test('one camp over: only that camp switches to "Ask about 2027"', async () => {
  const p = await page({ ...DESKTOP, now: '2026-03-01T12:00:00' });   // after Feb 14–15
  const r = await p.evaluate(() => ({
    prospectForms: document.querySelectorAll('[data-mc-href="camps.prospect.registrationUrl"]').length,
    eliteForms: [...document.querySelectorAll('a[href]')].filter(a => a.href === window.siteData.camps.elite.registrationUrl).length,
    asks: [...document.querySelectorAll('a[data-goto="contact"]')].filter(a => a.textContent.trim() === 'Ask about 2027').length,
    cardNote: !!document.querySelector('#reg-prospect .camp-status'),
    eliteNote: !!document.querySelector('#reg-elite .camp-status'),
    heroNote: !!document.querySelector('#page-id-prospect .hero .camp-status'),
    bar: document.querySelector('.announce').textContent
  }));
  eq(r.prospectForms, 0, 'no ID & Prospect form links left');
  assert(r.eliteForms >= 3, 'Elite Camp still links to its form');
  assert(r.asks >= 5, 'ID & Prospect buttons now ask about next year: ' + r.asks);
  assert(r.cardNote && r.heroNote, 'card and page say finished');
  assert(!r.eliteNote, 'open camp has no note');
  assert(!/finished/.test(r.bar), 'season not over yet');
  await done(p);
});

test('season over: announcement bar says so, every button asks about next year', async () => {
  const p = await page({ ...DESKTOP, now: OVER_DAY });
  const r = await p.evaluate(() => ({
    forms: document.querySelectorAll('a[href*="forms"]').length,
    bar: document.querySelector('.announce').textContent,
    barLink: document.querySelector('.announce a') && document.querySelector('.announce a').getAttribute('data-goto'),
    notes: document.querySelectorAll('.camp-status').length,
    asks: [...document.querySelectorAll('a.btn')].filter(a => a.textContent.trim() === 'Ask about 2027').length,
    hrefOnInternal: document.querySelectorAll('a[data-goto][href]').length
  }));
  eq(r.forms, 0, 'no form links anywhere');
  assert(/The 2026 camps have finished/.test(r.bar), 'announcement: ' + r.bar);
  eq(r.barLink, 'contact', 'announcement links to Contact');
  assert(r.notes >= 9, 'cards (home + register) and the three heroes: ' + r.notes);
  assert(r.asks >= 12, 'every camp Register button now asks about 2027: ' + r.asks);
  eq(r.hrefOnInternal, 0, 'converted buttons follow the no-href rule');
  await nav(p, '#page-index a[data-goto="contact"]');
  eq(await shown(p), 'page-contact', 'converted button navigates');
  await done(p);
});

test('the last day of camp still counts as open', async () => {
  const p = await page({ ...DESKTOP, now: '2026-06-04T20:00:00' });   // Elite ends Jun 4
  const n = await p.evaluate(() => [...document.querySelectorAll('a[href]')]
    .filter(a => a.href === window.siteData.camps.elite.registrationUrl).length);
  assert(n >= 3, 'still open on its last day');
  await done(p);
});

/* ── 2. Back button ──────────────────────────────────────────────────────── */
test('Back returns to the previous page, at the same spot', async () => {
  const p = await page(PHONE);
  await p.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await nav(p, '#page-index a[data-goto="elite-camp"]');
  eq(await shown(p), 'page-elite-camp', 'on Elite Camp');
  await nav(p, '.nav-links a[data-goto="faq"]');
  eq(await shown(p), 'page-faq', 'on FAQ');
  await p.goBack();
  eq(await shown(p), 'page-elite-camp', 'Back -> Elite Camp');
  await p.goBack();
  eq(await shown(p), 'page-index', 'Back -> Home');
  const y = await p.evaluate(() => window.pageYOffset);
  assert(Math.abs(y - 1500) < 4, 'home scrolled back to where it was, y=' + y);
  await p.goForward();
  eq(await shown(p), 'page-elite-camp', 'Forward works too');
  await p.evaluate(() => document.getElementById('navToggle').click());
  await p.goBack();
  assert(await p.isHidden('#navDrawer'), 'Back with the menu open closes the menu');
  eq(await shown(p), 'page-index', 'and goes back');
  assert(p.url().startsWith('file://') && !p.url().includes('#'), 'URL never changed: ' + p.url());
  await done(p);
});

test('Back works inside a sandboxed preview frame, with no dialog', async () => {
  const ctx = await browser.newContext(DESKTOP);
  const p = await ctx.newPage();
  const dialogs = []; p.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.route(/^https?:/, r => r.abort());
  await p.setContent('<iframe id="f" sandbox="allow-scripts" style="width:1400px;height:860px;border:0"></iframe>');
  await p.evaluate(html => { document.getElementById('f').srcdoc = html; }, fs.readFileSync(FILE, 'utf8'));
  await p.waitForTimeout(400);
  const f = p.frames().find(x => x !== p.mainFrame());
  await f.evaluate(() => document.querySelector('.nav-links a[data-goto="faq"]').click());
  eq(await f.evaluate(() => document.querySelector('.page:not([hidden])').id), 'page-faq', 'navigated');
  await f.evaluate(() => history.back());
  await p.waitForTimeout(300);
  eq(await f.evaluate(() => document.querySelector('.page:not([hidden])').id), 'page-index', 'Back in frame');
  eq(dialogs.length, 0, 'no external-link dialog');
  eq(errors.length, 0, 'no errors: ' + errors.join(' | '));
  await ctx.close();
});

/* ── 4. links to one page ────────────────────────────────────────────────── */
test('#elite-camp opens that page; #elite-camp/schedule opens the schedule', async () => {
  let p = await page(DESKTOP, URL + '#elite-camp');
  eq(await shown(p), 'page-elite-camp', '#elite-camp');
  eq(await p.evaluate(() => document.title), 'Elite Camp | Maryville Soccer Camp', 'title');
  await done(p);
  p = await page(DESKTOP, URL + '#elite-camp/schedule');
  eq(await shown(p), 'page-elite-camp', 'page');
  // Wait for the smooth scroll to settle rather than a fixed time.
  await p.waitForFunction(() => {
    const t = document.getElementById('schedule').getBoundingClientRect().top;
    const settled = window.__lastTop === t; window.__lastTop = t; return settled && t < 300;
  }, null, { polling: 150, timeout: 5000 }).catch(() => {});
  const top = await p.evaluate(() => document.getElementById('schedule').getBoundingClientRect().top);
  assert(top >= 0 && top < 300, 'scrolled to schedule, top=' + top);
  await done(p);
  for (const bad of ['#nope', '#elite-camp/nope', '#<img src=x>', '#%E0%A4%A']) {
    p = await page(DESKTOP, URL + bad);
    const pg = await shown(p);
    assert(pg === 'page-index' || (bad.startsWith('#elite') && pg === 'page-elite-camp'), bad + ' -> ' + pg);
    await done(p);
  }
});

test('every page can be linked to directly', async () => {
  for (const s of PAGES) {
    const p = await page(DESKTOP, URL + '#' + s);
    eq(await shown(p), 'page-' + s, '#' + s);
    await done(p);
  }
});

/* ── 3. loading on a slow phone ──────────────────────────────────────────── */
test('slow 4G: the home page text shows long before the images finish', async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(FILE));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const ctx = await browser.newContext(PHONE);
  const p = await ctx.newPage();
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',
    { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  const t0 = Date.now(); let heading = 0;
  const poll = setInterval(() => {
    p.evaluate(() => { const h = document.querySelector('#page-index h1'); return !!(h && h.getClientRects().length && document.querySelector('.nav')); })
      .then(ok => { if (ok && !heading) heading = Date.now() - t0; }).catch(() => {});
  }, 50);
  await p.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load', timeout: 60000 });
  const load = Date.now() - t0;
  clearInterval(poll);
  const imgs = await p.evaluate(() => [...document.querySelectorAll('img[data-img]')].every(i => i.naturalWidth > 1));
  await ctx.close(); server.close();
  assert(heading && heading < 2000, `heading and nav visible at ${heading} ms (whole file ${load} ms)`);
  assert(heading < load * 0.6, `text well before the end of the download (${heading} of ${load} ms)`);
  assert(imgs, 'every image filled in once loaded');
});

test('without JavaScript the home page text is still there', async () => {
  const ctx = await browser.newContext({ ...PHONE, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto(URL);
  const t = await p.evaluate(() => document.body.innerText);
  assert(t.includes('Maryville College Soccer Camp') && t.includes('Which camp is right for you?'), 'home text visible');
  await ctx.close();
});

test('each image is embedded once, logo and home images first', async () => {
  const html = fs.readFileSync(FILE, 'utf8');
  const keys = [...html.matchAll(/mc:image',\{detail:\{"key": "([a-z_]+)"/g)].map(m => m[1]);
  const manifest = Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src/assets/manifest.json'))));
  eq(keys.length, manifest.length, 'one script per image');
  eq(new Set(keys).size, keys.length, 'no duplicates');
  eq(keys[0], 'scots', 'logo first');
  eq(keys[1], 'champs', 'home hero next');
  assert(html.indexOf('mc:image\',{detail') > html.indexOf('</main>'), 'images after all page text');
});

/* ── 5. packing list ─────────────────────────────────────────────────────── */
test('packing list ticks, remembers, and works by keyboard', async () => {
  const p = await page(PHONE, URL + '#elite-camp/bring');
  await p.waitForTimeout(600);
  const items = p.locator('ul[data-pack] li');
  eq(await items.count(), 9, 'nine items');
  eq(await p.locator('ul[data-pack] input[type=checkbox]:checked').count(), 0, 'nothing ticked to start');
  await items.nth(1).locator('label').tap();
  eq(await items.nth(1).getAttribute('class'), 'is-checked', 'tap ticks');
  const box = await items.nth(1).locator('label').boundingBox();
  assert(box.height >= 44, 'tap target ' + box.height);
  await items.nth(3).locator('input').focus();
  await p.keyboard.press('Space');
  eq(await items.nth(3).locator('input').isChecked(), true, 'Space ticks');
  await p.reload();
  await p.waitForTimeout(400);
  eq(await p.locator('ul[data-pack] input:checked').count(), 2, 'ticks survive a reload');
  await items.nth(1).locator('label').tap();
  eq(await items.nth(1).locator('input').isChecked(), false, 'tap again unticks');
  assert(await p.isVisible('.pack-hint'), 'hint explains it');
  eq(await p.locator('.checklist:not([data-pack]) input').count(), 0, 'other checklists stay decorative');
  await done(p);
});

test('packing list still ticks when storage is blocked', async () => {
  const ctx = await browser.newContext(PHONE);
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const p = await ctx.newPage(); p.errors = []; p.on('pageerror', e => p.errors.push(e.message));
  await p.route(/^https?:/, r => r.abort());
  await p.goto(URL + '#elite-camp/bring');
  await p.locator('ul[data-pack] li').first().locator('label').tap();
  eq(await p.locator('ul[data-pack] input:checked').count(), 1, 'ticks without storage');
  await done(p);
});

/* ── 6. focus and headings ───────────────────────────────────────────────── */
test('keyboard navigation moves focus to the new page heading', async () => {
  const p = await page();
  await p.focus('.nav-links a[data-goto="faq"]');
  await p.keyboard.press('Enter');
  const a = await p.evaluate(() => ({ tag: document.activeElement.tagName, text: document.activeElement.textContent.trim() }));
  eq(a.tag, 'H1', 'focus on heading');
  eq(a.text, 'Frequently asked questions', 'the FAQ heading');
  await p.goBack();
  eq(await p.evaluate(() => document.activeElement.tagName), 'H1', 'Back focuses the heading too');
  await p.focus('#page-index a[data-frag="camps"]');
  await p.keyboard.press('Enter');
  eq(await p.evaluate(() => document.activeElement.id), 'camps', 'section links focus the section');
  await done(p);
});

test('navigation from the chat keeps focus in the chat', async () => {
  const p = await page();
  await p.click('#asBtn');
  await p.locator('#asChips .as-chip', { hasText: 'Go to a page' }).click();
  await p.locator('#asChips .as-chip', { hasText: 'FAQ' }).click();
  eq(await shown(p), 'page-faq', 'navigated');
  assert(await p.evaluate(() => !!document.activeElement.closest('.as-root')), 'focus stayed in the chat');
  await done(p);
});

test('headings never skip a level', async () => {
  const p = await page();
  for (const s of PAGES) {
    await p.evaluate(s => { const a = document.createElement('a'); a.setAttribute('data-goto', s); document.body.appendChild(a); a.click(); a.remove(); }, s);
    const levels = await p.evaluate(() => [...document.querySelectorAll('.page:not([hidden]) :is(h1,h2,h3,h4)')]
      .filter(h => !h.closest('[data-empty="true"]')).map(h => +h.tagName[1]));
    eq(levels[0], 1, s + ' starts with h1');
    for (let i = 1; i < levels.length; i++) assert(levels[i] - levels[i - 1] <= 1, `${s}: h${levels[i - 1]} -> h${levels[i]}`);
  }
  await done(p);
});

/* ── run ─────────────────────────────────────────────────────────────────── */
(async () => {
  if (!fs.existsSync(FILE)) { console.error('Build first: python3 build/build.py'); process.exit(1); }
  browser = await chromium.launch();
  const only = process.argv[2];
  let failed = 0;
  for (const t of tests) {
    if (only && !t.name.includes(only)) continue;
    try { await t.fn(); console.log('  ✓ ' + t.name); }
    catch (e) { failed++; console.log('  ✗ ' + t.name + '\n      ' + e.message.split('\n')[0]); }
  }
  await browser.close();
  console.log(failed ? `\n${failed} failed` : '\nall passed');
  process.exit(failed ? 1 : 0);
})();
