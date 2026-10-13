#!/usr/bin/env node
/* ============================================================================
   Camp assistant — browser tests

       python3 build/build.py
       node tests/assistant.test.js

   Needs the `playwright` package (npm i -g playwright, then run with
   NODE_PATH="$(npm root -g)"). Tests run against the built single file in
   dist/, so they test exactly what gets published.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const FILE = path.resolve(__dirname, '..', 'dist', 'maryville-soccer-camp.html');
const URL = 'file://' + FILE;
const DESKTOP = { viewport: { width: 1440, height: 900 } };
const PHONE = { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true };

/* ── tiny runner ─────────────────────────────────────────────────────────── */
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }
function eq(a, b, msg) { if (a !== b) throw new Error(`${msg}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

let browser;
async function page(opts = DESKTOP, init) {
  const ctx = await browser.newContext(opts);
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', e => p.errors.push(e.message));
  // Only Google Fonts may load; nothing else should reach the network.
  await p.route(/^https?:/, r => r.abort());
  if (init) await p.addInitScript(init);
  await p.goto(URL);
  await p.waitForFunction(() => window.siteAssistant);
  return p;
}
const state = p => p.evaluate(() => window.siteAssistant.state);
const visiblePage = p => p.evaluate(() => document.querySelector('.page:not([hidden])').id);
const lastBot = p => p.evaluate(() => { const m = document.querySelectorAll('.as-msg--bot'); return m[m.length - 1].textContent; });
const chipLabels = p => p.$$eval('#asChips .as-chip', c => c.map(x => x.textContent));
async function chip(p, label) {
  await p.locator('#asChips .as-chip', { hasText: label }).first().click();
  await p.waitForTimeout(80);
}
async function ask(p, text) {
  await p.fill('#asInput', text);
  await p.press('#asInput', 'Enter');
  await p.waitForTimeout(80);
}
async function done(p) {
  assert(!p.errors.length, 'JS errors: ' + p.errors.join(' | '));
  await p.context().close();
}

/* Mock of the Web Speech API. __say(text, final) delivers a result the way
   Chrome does: interim results are replaced in place until they go final. */
const MOCK_SPEECH = () => {
  window.__sr = { instances: [], starts: 0, stops: 0, deny: false };
  class MockSR {
    constructor() { window.__sr.instances.push(this); this.results = []; }
    start() {
      window.__sr.starts++;
      if (window.__sr.deny) setTimeout(() => { this.onerror({ error: 'not-allowed' }); this.onend(); }, 0);
    }
    stop() { window.__sr.stops++; }
  }
  window.SpeechRecognition = MockSR;
  delete window.webkitSpeechRecognition;
  window.__say = (text, isFinal = true) => {
    const r = window.__sr.instances[0];
    const res = Object.assign([{ transcript: text }], { isFinal });
    const last = r.results[r.results.length - 1];
    let idx;
    if (last && !last.isFinal) { idx = r.results.length - 1; r.results[idx] = res; }
    else { idx = r.results.length; r.results.push(res); }
    r.onresult({ results: r.results, resultIndex: idx });
  };
  window.__end = () => { const r = window.__sr.instances[0]; r.results = []; r.onend(); };
};

/* ── tests ───────────────────────────────────────────────────────────────── */
test('opens and closes; Escape closes; focus goes to the input', async () => {
  const p = await page();
  assert(await p.isHidden('#asPanel'), 'panel starts closed');
  eq(await p.getAttribute('#asBtn', 'aria-expanded'), 'false', 'aria-expanded closed');
  await p.click('#asBtn');
  assert(await p.isVisible('#asPanel'), 'panel opens');
  eq(await p.getAttribute('#asBtn', 'aria-expanded'), 'true', 'aria-expanded open');
  eq(await p.evaluate(() => document.activeElement.id), 'asInput', 'focus on input');
  eq(await p.getAttribute('#asLog', 'role'), 'log', 'log role');
  eq(await p.getAttribute('#asLog', 'aria-live'), 'polite', 'log aria-live');
  const labels = await chipLabels(p);
  assert(labels.includes('Find the right camp') && labels.includes('Ask a question'), 'main menu chips: ' + labels);
  await p.keyboard.press('Escape');
  assert(await p.isHidden('#asPanel'), 'Escape closes');
  eq(await p.evaluate(() => document.activeElement.id), 'asBtn', 'focus back on bubble');
  await p.click('#asBtn');
  const n = await p.locator('.as-msg').count();
  assert(n >= 2, 'conversation kept after reopening');
  await p.click('[data-as="close"]');
  assert(await p.isHidden('#asPanel'), 'close button closes');
  await done(p);
});

test('Escape with the menu drawer open closes the drawer, not the chat', async () => {
  const p = await page(PHONE);
  await p.click('#asBtn');
  await p.evaluate(() => document.getElementById('navToggle').click());
  await p.keyboard.press('Escape');
  assert(await p.isHidden('#navDrawer'), 'drawer closed');
  eq((await state(p)).open, true, 'chat still open');
  await done(p);
});

test('guided navigation: find a camp, then jump to its schedule', async () => {
  const p = await page();
  await p.click('#asBtn');
  await chip(p, 'Find the right camp');
  eq((await state(p)).mode, 'navigate', 'mode');
  await chip(p, 'A college-bound player');
  eq(await visiblePage(p), 'page-id-prospect', 'camp page opened');
  const D = await p.evaluate(() => window.siteData.camps.prospect);
  const card = await lastBot(p);
  assert(card.includes(D.price) && card.includes(D.menDate) && card.includes(D.womenDate), 'card uses data.js: ' + card);
  const reg = p.locator('#asChips a.as-chip', { hasText: 'Register for' });
  eq(await reg.getAttribute('href'), D.registrationUrl, 'register chip goes straight to the camp form');
  eq(await reg.getAttribute('target'), '_blank', 'form opens in a new tab');
  await chip(p, 'See the schedule');
  eq(await visiblePage(p), 'page-id-prospect', 'still on camp page');
  await p.waitForTimeout(700);
  const top = await p.evaluate(() => document.querySelector('#page-id-prospect #schedule').getBoundingClientRect().top);
  assert(top >= 0 && top < 400, 'schedule scrolled into view, top=' + top);
  await chip(p, 'Back');
  eq((await state(p)).step, 'findCamp', 'Back returns to the previous question');
  await chip(p, 'Main menu');
  eq((await state(p)).step, 'menu', 'main menu');
  eq((await state(p)).history.length, 0, 'history cleared at menu');
  await done(p);
});

test('go to a page: page, then section', async () => {
  const p = await page();
  await p.click('#asBtn');
  await chip(p, 'Go to a page');
  await chip(p, 'Elite Camp');
  eq(await visiblePage(p), 'page-elite-camp', 'elite page');
  await chip(p, 'What to bring');
  await p.waitForTimeout(700);
  const top = await p.evaluate(() => document.querySelector('#bring').getBoundingClientRect().top);
  assert(top >= 0 && top < 400, 'bring section in view');
  await done(p);
});

test('internal chips carry no href (preview-frame rule)', async () => {
  const p = await page();
  await p.click('#asBtn');
  for (const path of [['Go to a page', 'FAQ'], ['Find the right camp', 'A player aged']]) {
    await chip(p, 'Main menu').catch(() => {});
    for (const c of path) await chip(p, c);
    const bad = await p.$$eval('.as-root a[data-goto]', a => a.filter(x => x.hasAttribute('href')).length);
    eq(bad, 0, 'internal chips with href');
  }
  await done(p);
});

test('typed text that matches a chip is accepted', async () => {
  const p = await page();
  await p.click('#asBtn');
  await ask(p, 'register');
  eq((await state(p)).step, 'register', 'typed "register" picks the Register chip');
  const hrefs = await p.$$eval('#asChips a.is-external', a => a.map(x => x.getAttribute('href')));
  const urls = await p.evaluate(() => Object.values(window.siteData.camps).map(c => c.registrationUrl));
  eq(JSON.stringify(hrefs), JSON.stringify(urls), 'one chip per camp form');
  await ask(p, 'not sure which camp');
  eq((await state(p)).step, 'findCamp', 'typed partial label');
  await done(p);
});

test('offline FAQ answers come from the FAQ page, not invented', async () => {
  const p = await page();
  await p.click('#asBtn');
  await ask(p, 'Are there any discounts for siblings?');
  const discount = await p.evaluate(() => document.querySelector('#registration-5 .acc-panel-inner').textContent.trim());
  assert((await lastBot(p)).includes(discount), 'discount answer read from the page');

  await ask(p, 'where do I mail a check?');
  const t = await lastBot(p);
  const pay = await p.evaluate(() => window.siteData.payment);
  assert(t.includes(pay.checkRecipient) && t.includes(pay.checkStreet), 'check address from data.js');
  assert(!/VERIFY|data\.js/.test(t), 'coach-only notes are not read out');

  await chip(p, 'Show it on the FAQ page');
  await p.waitForTimeout(150);
  eq(await visiblePage(p), 'page-faq', 'FAQ page open');
  eq(await p.getAttribute('#b-payment-2', 'aria-expanded'), 'true', 'that question is expanded');

  await ask(p, 'is there a swimming pool');
  eq((await state(p)).step, 'unknown', 'unknown question');
  const phone = await p.evaluate(() => window.siteData.contact.phone);
  assert((await lastBot(p)).includes(phone), 'unknown answer points to staff');
  await done(p);
});

test('prices and dates are read live from data.js', async () => {
  const p = await page();
  await p.evaluate(() => { window.siteData.camps.elite.dayPrice = '$999'; });
  await p.click('#asBtn');
  await ask(p, 'how much does it cost?');
  const t = await lastBot(p);
  assert(t.includes('$999') && t.includes('$110') && t.includes('$210'), 'all camps, live values: ' + t);
  await ask(p, 'when is team camp?');
  const D = await p.evaluate(() => window.siteData.camps);
  assert((await lastBot(p)).includes(D.team.dates), 'dates');
  await done(p);
});

test('context: on the ID camp page, "is lunch included" answers for that camp', async () => {
  const p = await page();
  await p.click('#asBtn');
  await chip(p, 'Find the right camp');
  await chip(p, 'A college-bound player');
  await ask(p, 'is lunch included?');
  eq((await state(p)).step, 'answer', 'answered');
  const q = await p.evaluate(() => document.querySelector('#b-idcamp-3').textContent.trim());
  assert((await lastBot(p)).includes(q), 'ID camp lunch answer');
  await done(p);
});

test('start over clears the conversation', async () => {
  const p = await page();
  await p.click('#asBtn');
  await chip(p, 'Find the right camp');
  await chip(p, 'A player aged');
  await p.click('[data-as="restart"]');
  const s = await state(p);
  eq(s.step, 'menu', 'back at menu');
  eq(s.history.length, 0, 'history empty');
  eq(s.camp, null, 'camp forgotten');
  eq(await p.locator('.as-msg').count(), 2, 'log cleared to greeting + menu');
  await done(p);
});

test('voice: one session for several answers, short ones send themselves', async () => {
  const p = await page(DESKTOP, MOCK_SPEECH);
  await p.click('#asBtn');
  assert(await p.isVisible('#asMic'), 'mic shown when supported');
  await p.click('#asMic');
  eq((await state(p)).listening, true, 'listening');
  eq(await p.getAttribute('#asMic', 'aria-pressed'), 'true', 'mic pressed');

  await p.evaluate(() => window.__say('find the', false));
  eq(await p.inputValue('#asInput'), 'find the', 'interim words shown live');
  await p.evaluate(() => window.__say('find the right camp', true));
  await p.waitForTimeout(1000);
  eq((await state(p)).step, 'findCamp', 'short answer auto-sent');

  await p.evaluate(() => window.__say('a college bound player', true));
  await p.waitForTimeout(1000);
  eq((await state(p)).step, 'camp', 'second answer, same session');

  await p.evaluate(() => window.__say('my email is jane at example dot com and I have a question', true));
  await p.waitForTimeout(1100);
  const v = await p.inputValue('#asInput');
  assert(v.includes('jane@example.com'), 'spoken email normalised: ' + v);
  eq((await state(p)).step, 'camp', 'long answer waits for Send');
  await p.click('.as-send');
  eq(await p.inputValue('#asInput'), '', 'sent');

  // Browser ends the session on its own: reopened quietly, same object.
  await p.evaluate(() => window.__end());
  await p.evaluate(() => window.__say('main menu', true));
  await p.waitForTimeout(1000);
  eq((await state(p)).step, 'menu', 'still listening after the browser restarted the session');
  const sr = await p.evaluate(() => ({ n: window.__sr.instances.length, starts: window.__sr.starts }));
  eq(sr.n, 1, 'one recognition object for the whole conversation');
  eq(sr.starts, 2, 'started once, plus one silent restart');

  await p.click('[data-as="close"]');
  eq((await state(p)).listening, false, 'closing the panel stops the mic');
  assert((await p.evaluate(() => window.__sr.stops)) >= 1, 'recognition stopped');
  await done(p);
});

test('voice: typing takes over the current answer', async () => {
  const p = await page(DESKTOP, MOCK_SPEECH);
  await p.click('#asBtn');
  await p.click('#asMic');
  await p.evaluate(() => window.__say('find', false));
  await p.fill('#asInput', '');
  await p.type('#asInput', 'ask a question');
  await p.evaluate(() => window.__say('find the right camp', true));
  await p.waitForTimeout(1000);
  eq(await p.inputValue('#asInput'), 'ask a question', 'typed text kept, speech ignored');
  await p.press('#asInput', 'Enter');
  eq((await state(p)).step, 'ask', 'typed answer used');
  await p.evaluate(() => window.__say('main menu', true));
  await p.waitForTimeout(1000);
  eq((await state(p)).step, 'menu', 'voice resumes for the next answer');
  await done(p);
});

test('voice: blocked microphone explains OS dictation', async () => {
  const p = await page(DESKTOP, { content: `(${MOCK_SPEECH})(); window.__sr.deny = true;` });
  await p.click('#asBtn');
  await p.click('#asMic');
  await p.waitForTimeout(100);
  eq((await state(p)).listening, false, 'mic off');
  const t = await lastBot(p);
  assert(/Windows \+ H/.test(t) && /Fn twice/.test(t), 'explains OS dictation: ' + t);
  eq(await p.evaluate(() => window.__sr.starts), 1, 'no retry loop');
  await done(p);
});

test('voice: mic hidden where speech recognition is unsupported', async () => {
  const p = await page(DESKTOP, () => { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; });
  await p.click('#asBtn');
  assert(await p.isHidden('#asMic'), 'mic hidden');
  await done(p);
});

test('bubble floats above the phone bar, a cookie bar, and hides under the drawer', async () => {
  const p = await page(PHONE);
  const pos = () => p.evaluate(() => ({
    bubble: document.getElementById('asBtn').getBoundingClientRect().bottom,
    bar: document.querySelector('.mobilebar').getBoundingClientRect().top
  }));
  let r = await pos();
  assert(r.bubble <= r.bar - 8, `bubble (${r.bubble}) above the bar (${r.bar})`);

  await p.evaluate(() => {
    const c = document.createElement('div');
    c.id = 'cookie';
    c.style.cssText = 'position:fixed;left:0;right:0;bottom:60px;height:90px;background:#fff;z-index:85';
    document.body.appendChild(c);
  });
  await p.waitForTimeout(100);
  const cookieTop = await p.evaluate(() => document.getElementById('cookie').getBoundingClientRect().top);
  r = await pos();
  assert(r.bubble <= cookieTop - 8, `bubble (${r.bubble}) above stacked cookie bar (${cookieTop})`);
  await p.evaluate(() => document.getElementById('cookie').remove());
  await p.waitForTimeout(100);
  r = await pos();
  assert(r.bubble <= r.bar - 8 && r.bubble > r.bar - 40, 'drops back down when it goes');

  await p.evaluate(() => document.getElementById('navToggle').click());
  await p.waitForTimeout(100);
  assert(await p.isHidden('#asBtn'), 'hidden while the menu drawer covers the page');
  await p.evaluate(() => document.getElementById('navClose').click());
  await p.waitForTimeout(100);
  assert(await p.isVisible('#asBtn'), 'back when the drawer closes');

  // Desktop: no bar, so it sits in the corner.
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(150);
  const b = await p.evaluate(() => document.getElementById('asBtn').getBoundingClientRect().bottom);
  eq(Math.round(b), 900 - 20, 'desktop corner after resize');
  await done(p);
});

test('bubble rides above the footer links at the bottom of the page', async () => {
  for (const vp of [{ width: 1440, height: 900 }, { width: 780, height: 900 }]) {
    const p = await page({ viewport: vp });
    const measure = () => p.evaluate(() => {
      const l = [...document.querySelectorAll('.footer-bottom a')].pop().getBoundingClientRect();
      const b = document.getElementById('asBtn').getBoundingClientRect();
      return { overlap: !(b.right < l.left || b.left > l.right || b.bottom <= l.top || b.top >= l.bottom),
               gap: l.top - b.bottom, bottom: b.bottom };
    });
    await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await p.waitForTimeout(100);
    let m = await measure();
    assert(!m.overlap, `${vp.width}px: bubble covers the athletics link`);
    assert(m.gap >= 4 && m.gap <= 16, `${vp.width}px: sits just above it, gap ${m.gap}`);
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await p.waitForTimeout(100);
    m = await measure();
    eq(Math.round(m.bottom), vp.height - 20, `${vp.width}px: back in the corner after scrolling up`);
    await done(p);
  }
});

test('phone layout: icon-only bubble, bottom sheet ~60%, tap targets', async () => {
  const p = await page(PHONE);
  const bw = await p.evaluate(() => document.getElementById('asBtn').getBoundingClientRect().width);
  assert(bw <= 60, 'icon-only bubble, width ' + bw);
  eq(await p.getAttribute('#asBtn', 'aria-label'), 'Open the camp assistant', 'accessible name');
  await p.tap('#asBtn');
  await p.waitForTimeout(300);
  const m = await p.evaluate(() => {
    const r = document.getElementById('asPanel').getBoundingClientRect();
    const bar = document.querySelector('.mobilebar').getBoundingClientRect();
    const chips = [...document.querySelectorAll('.as-chip, .as-icon-btn, .as-send, .as-mic:not([hidden])')]
      .map(c => c.getBoundingClientRect()).filter(c => c.height);
    return { w: r.width, h: r.height, bottom: r.bottom, bar: bar.top, vw: innerWidth, vh: innerHeight,
             minTap: Math.min(...chips.map(c => Math.min(c.height, c.width))),
             overflow: document.documentElement.scrollWidth > innerWidth,
             focus: document.activeElement.id };
  });
  eq(m.w, m.vw, 'full width sheet');
  assert(m.h >= m.vh * 0.5 && m.h <= m.vh * 0.68, `sheet height ${m.h} of ${m.vh}`);
  assert(Math.abs(m.bottom - m.bar) < 2, 'sheet sits on top of the phone bar, leaving Call/Register usable');
  assert(m.minTap >= 40, 'tap targets >= 40px, smallest ' + m.minTap);
  assert(!m.overflow, 'no horizontal overflow');
  eq(m.focus, 'asTitle', 'on touch, focus goes to the title, not the keyboard');
  await done(p);
});

test('reduced motion: no animations or transforms', async () => {
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); p.errors = []; p.on('pageerror', e => p.errors.push(e.message));
  await p.goto(URL);
  await p.hover('#asBtn');
  const tr = await p.evaluate(() => getComputedStyle(document.getElementById('asBtn')).transform);
  assert(tr === 'none', 'no hover lift: ' + tr);
  await p.click('#asBtn');
  const anim = await p.evaluate(() => getComputedStyle(document.getElementById('asPanel')).animationName);
  eq(anim, 'none', 'panel animation');
  await done(p);
});

test('contrast: chat text meets WCAG AA', async () => {
  const p = await page();
  await p.click('#asBtn');
  await chip(p, 'Find the right camp');
  await chip(p, 'A player aged');
  const fails = await p.evaluate(() => {
    function rgb(s) { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] == null ? 1 : m[3] }; }
    function over(fg, bg) { return { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 }; }
    function lum(c) { return [c.r, c.g, c.b].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); })
      .reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
    function bgOf(el) {
      const chain = [];
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage.includes('gradient')) {
          // Gradients: test against the lightest stop, the worst case for white text.
          const stops = cs.backgroundImage.match(/rgba?\([^)]+\)/g).map(rgb);
          chain.push(stops.sort((a, b) => lum(b) - lum(a))[0]); break;
        }
        const c = rgb(cs.backgroundColor);
        if (c.a > 0) { chain.push(c); if (c.a === 1) break; }
      }
      let bg = { r: 21, g: 9, b: 16, a: 1 };
      for (let i = chain.length - 1; i >= 0; i--) bg = over(chain[i], bg);
      return bg;
    }
    const out = [];
    document.querySelectorAll('.as-root *').forEach(el => {
      if (!el.offsetParent && el.id !== 'asPanel') return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const cs = getComputedStyle(el);
      const fg = over(rgb(cs.color), bgOf(el));
      const L1 = lum(fg), L2 = lum(bgOf(el));
      const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
      if (ratio < (large ? 3 : 4.5)) out.push(el.className + ' "' + el.textContent.trim().slice(0, 30) + '" ' + ratio.toFixed(2));
    });
    return out;
  });
  eq(fails.length, 0, 'contrast failures ' + fails.join('; '));
  await done(p);
});

test('bubble stays visible on a light background', async () => {
  const p = await page();
  await p.evaluate(() => { document.body.style.background = '#fff'; document.querySelectorAll('main, .page').forEach(e => e.style.display = 'none'); });
  const s = await p.evaluate(() => {
    const cs = getComputedStyle(document.getElementById('asBtn'));
    return { shadow: cs.boxShadow, bg: cs.backgroundImage };
  });
  assert(/gradient/.test(s.bg) && s.shadow !== 'none', 'gradient fill and shadow separate it from white');
  await done(p);
});

test('works inside a sandboxed preview frame with the network off', async () => {
  const ctx = await browser.newContext(DESKTOP);
  const p = await ctx.newPage();
  const dialogs = []; p.on('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
  await p.route(/^https?:/, r => r.abort());
  await p.setContent('<iframe id="f" sandbox="allow-scripts" style="width:1400px;height:860px;border:0"></iframe>');
  await p.evaluate(html => { document.getElementById('f').srcdoc = html; }, fs.readFileSync(FILE, 'utf8'));
  const f = p.frameLocator('#f');
  await f.locator('#asBtn').click();
  await f.locator('#asChips .as-chip', { hasText: 'Go to a page' }).click();
  await f.locator('#asChips .as-chip', { hasText: 'Elite Camp' }).click();
  await f.locator('#asChips .as-chip', { hasText: 'Daily schedule' }).click();
  const frame = p.frames().find(x => x !== p.mainFrame());
  eq(await frame.evaluate(() => document.querySelector('.page:not([hidden])').id), 'page-elite-camp', 'navigated in frame');
  eq(dialogs.length, 0, 'no external-link dialog');
  await ctx.close();
});

test('if the assistant fails, the site still works', async () => {
  const html = fs.readFileSync(FILE, 'utf8');
  const marker = 'MARYVILLE SOCCER CAMP — camp assistant';
  const i = html.indexOf(marker);
  assert(i > 0, 'assistant script present in build');
  const start = html.lastIndexOf('<script>', i) + '<script>'.length;
  const end = html.indexOf('</script>', i);
  const broken = html.slice(0, start) + '\nthrow new Error("assistant failed");\n' + html.slice(end);
  const ctx = await browser.newContext(DESKTOP);
  const p = await ctx.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.setContent(broken);
  await p.evaluate(() => document.querySelector('.nav-links a[data-goto="faq"]').click());
  eq(await p.evaluate(() => document.querySelector('.page:not([hidden])').id), 'page-faq', 'site navigation unaffected');
  eq(await p.locator('#asBtn').count(), 0, 'no half-built widget');
  await ctx.close();
});

test('only one global', async () => {
  const p = await page();
  const keys = await p.evaluate(() => Object.keys(window).filter(k => /assistant|^as[A-Z]/i.test(k)));
  eq(JSON.stringify(keys), '["siteAssistant"]', 'globals');
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
