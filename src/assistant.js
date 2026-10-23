/* ============================================================================
   MARYVILLE SOCCER CAMP — camp assistant
   The chat bubble in the bottom-right corner. It helps visitors find the
   right camp, jump to the right part of the site, and get answers from the
   FAQ. There is no AI behind it: every answer is read from the FAQ page
   itself or from data.js, so it can never say something the site doesn't.

   Loaded as its own <script> after script.js. If anything in here fails, the
   site carries on without it. The only global is window.siteAssistant.
   ========================================================================== */
(function () {
  'use strict';
  try { boot(); } catch (err) {
    if (window.console) console.warn('Camp assistant did not start:', err);
  }

  function boot() {
  var D = window.siteData;
  if (!D || !document.getElementById('page-index')) return;

  /* ── CONFIG ────────────────────────────────────────────────────────────
     Everything a non-developer might want to change is in this block. */

  /* Main menu. `step` names a step below. */
  var MENU = [
    { label: 'Find the right camp', step: 'findCamp' },
    { label: 'Register',            step: 'register' },
    { label: 'Ask a question',      step: 'ask' },
    { label: 'Go to a page',        step: 'pages' },
    { label: 'Contact camp staff',  step: 'contact' }
  ];

  /* "Go to a page": page -> sections. `frag` is an id on that page; any
     section whose id is missing is skipped rather than shown as a dead end. */
  var PAGES = [
    { label: 'Home', page: 'index', sections: [
      { label: 'Which camp is right for you?', frag: 'camps' } ] },
    { label: 'ID & Prospect Camp', page: 'id-prospect', sections: [
      { label: 'Daily schedule', frag: 'schedule' } ] },
    { label: 'Elite Camp', page: 'elite-camp', sections: [
      { label: 'Goalkeeper School', frag: 'goalkeeper' },
      { label: 'Daily schedule',    frag: 'schedule' },
      { label: 'What to bring',     frag: 'bring' } ] },
    { label: 'HS Girls Team Camp', page: 'hs-team-camp', sections: [
      { label: 'Mountain Challenge', frag: 'mountain' } ] },
    { label: 'FAQ', page: 'faq', sections: [
      { label: 'Registration',         frag: 'registration' },
      { label: 'Elite Camp',           frag: 'elite' },
      { label: 'ID & Prospect Camp',   frag: 'idcamp' },
      { label: 'HS Girls Team Camp',   frag: 'teamcamp' },
      { label: 'Location and arrival', frag: 'location' },
      { label: 'Payment help',         frag: 'payment' } ] },
    { label: 'Register', page: 'register', sections: [] },
    { label: 'Contact',  page: 'contact',  sections: [] }
  ];

  /* Which camp page and FAQ group belong to each camp in data.js. */
  var CAMP = {
    prospect: { page: 'id-prospect',  faq: 'idcamp' },
    elite:    { page: 'elite-camp',   faq: 'elite' },
    team:     { page: 'hs-team-camp', faq: 'teamcamp' }
  };

  /* Offline FAQ: keyword pattern -> FAQ item id on the FAQ page. The answer
     text is read from the page, never written here. `camp` limits a rule to
     a camp the visitor is looking at; rules are tried top to bottom.
     `special` answers come straight from data.js (prices, dates, contact). */
  var FAQ_RULES = [
    { re: /\b(phone|call|email|e-mail|contact|talk to|speak to)\b/,               special: 'contact' },
    { re: /\b(discount|discounts|sibling|siblings|cheaper|scholarship)\b/,        faq: 'registration-5' },
    { re: /\b(check|cheque)\b.*\b(mail|address|payable|send)\b|\bmail\b.*\bcheck\b/, faq: 'payment-2' },
    { re: /\b(paypal|online payment|pay online)\b.*\b(work|working|trouble|fail|problem)\b/, faq: 'payment-1' },
    { re: /\b(mountain|ropes|canoe|canoes)\b.*\b(cost|price|included|extra|fee)\b/, faq: 'teamcamp-3' },
    { re: /\bregist\w*\b.*\b(on the day|at camp|same day|walk.?in)\b|\b(on the day|at camp|same day|walk.?in)\b.*\bregist/, faq: 'registration-3' },
    { re: /\b(when|deadline|early|sell out|fill up|spots?|places)\b.*\bregist|\bregist\w*\b.*\b(when|deadline|early)\b/, faq: 'registration-2' },
    { re: /\b(where|meet|check.?in)\b/, camp: 'prospect',                        faq: 'idcamp-5' },
    { re: /\b(check.?in|arrive|arrival|drop.?off|pick.?up)\b/,                  faq: 'location-3' },
    { re: /\b(price|prices|cost|costs|how much|fee|fees)\b/,                       special: 'prices' },
    { re: /\b(date|dates|when is|when are|when does|what day|which day|what week)\b/, special: 'dates' },
    { re: /\b(pay|paying|payment|cash|card|paypal)\b/,                           faq: 'registration-4' },
    { re: /\b(individual|individuals|by team|whole team|squad)\b/,              faq: 'teamcamp-1' },
    { re: /\b(register|registration|sign ?up|enrol|enroll|form)\b/,             faq: 'registration-1' },
    { re: /\b(lunch|meal|meals|food|eat|breakfast|dinner)\b/, camp: 'prospect',  faq: 'idcamp-3' },
    { re: /\b(lunch|meal|meals|food|eat|breakfast|dinner)\b/,                   faq: 'elite-5' },
    { re: /\b(goal ?keeper|goalie|keeper|keepers|gk)\b/,                        faq: 'elite-7' },
    { re: /\b(evaluat\w*|recruit\w*|scout\w*|roster)\b/,                        faq: 'idcamp-4' },
    { re: /\b(men'?s|women'?s|session|sessions)\b/,                             faq: 'idcamp-2' },
    { re: /\b(mountain challenge|ropes|canoe|canoes|team.?building)\b/,         faq: 'teamcamp-2' },
    { re: /\b(gatlinburg|smoky|smokies|hike|hiking|trip)\b/,                    faq: 'teamcamp-5' },
    { re: /\b(games?|scrimmage|matches)\b/, camp: 'team',                        faq: 'teamcamp-4' },
    { re: /\b(day camp|day camper|daytime|not overnight)\b/,                    faq: 'elite-2' },
    { re: /\b(dorm|dorms|room|rooms|sleep|sleeps)\b|\bwhere\b.*\bstay/,           faq: 'elite-4' },
    { re: /\b(overnight|night|nights|stay)\b/,                                  faq: 'elite-3' },
    { re: /\b(bring|pack|packing|need to take|kit|cleats|shin)\b/,              faq: 'elite-6' },
    { re: /\b(supervis\w*|safe|safety|chaperon\w*)\b/,                          faq: 'elite-8' },
    { re: /\b(age|ages|old|young|year olds?)\b/, camp: 'prospect',               faq: 'idcamp-1' },
    { re: /\b(age|ages|old|young|year olds?|who can)\b/,                        faq: 'elite-1' },
    { re: /\b(who should|college.?bound|prospect)\b/,                           faq: 'idcamp-1' },
    { re: /\b(soccer complex|field|fields|pitch)\b/,                            faq: 'location-2' },
    { re: /\b(where|location|located|address|directions|knoxville|campus|far)\b/, faq: 'location-1' }
  ];

  /* Elements the bubble must never sit on top of. Anything fixed to the
     bottom of the screen is also found automatically; this list is for
     bars that only appear at some widths. */
  var AVOID = ['.mobilebar', '[data-assistant-avoid]'];

  /* Buttons and links on the page itself that the resting bubble would cover:
     the hero buttons (on phones "Explore camps" lands in the corner) and the
     footer's last row. While one is under the bubble's resting spot, the
     bubble sits just above it; once it scrolls clear, the bubble drops back. */
  var LIFT_OVER = ['.hero .btn', '.footer-bottom a'];

  var SHORT_ANSWER_WORDS = 6;       // voice: shorter answers send themselves
  var AUTO_SEND_MS = 800;           // ... this long after the speaker pauses
  var MIC_IDLE_MS = 2 * 60 * 1000;  // mic switches off after this much quiet

  /* ── STATE ─────────────────────────────────────────────────────────────
     mode: menu | navigate | qa | done. `step` is what is on screen now,
     `history` is what Back returns to. */
  var state = { mode: 'menu', step: null, history: [], camp: null, open: false };

  /* ── HELPERS ───────────────────────────────────────────────────────── */
  function get(p) { return p.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, D); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/&/g, ' and ').replace(/[’']/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function wordCount(s) { return String(s).trim() ? String(s).trim().split(/\s+/).length : 0; }

  function svg(name) {
    var p = {
      chat:  '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
      mic:   '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
      send:  '<path d="M5 12h13M13 6l6 6-6 6"/>'
    }[name];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  /* ── MARKUP ────────────────────────────────────────────────────────── */
  var root = el('div', 'as-root');
  root.innerHTML =
    '<button type="button" id="asBtn" class="as-bubble" aria-expanded="false" aria-controls="asPanel" ' +
      'aria-label="Open the camp assistant">' + svg('chat') + '<span class="as-bubble-label">Assistant</span></button>' +
    '<div id="asPanel" class="as-panel" role="dialog" aria-modal="false" aria-labelledby="asTitle" hidden>' +
      '<div class="as-head">' +
        '<div class="as-head-text">' +
          '<div class="as-title" id="asTitle" tabindex="-1">Camp assistant</div>' +
          '<div class="as-sub" id="asSub"></div>' +
        '</div>' +
        '<button type="button" class="as-icon-btn" data-as="restart" aria-label="Start over">' + svg('reset') + '</button>' +
        '<button type="button" class="as-icon-btn" data-as="close" aria-label="Close the assistant">' + svg('close') + '</button>' +
      '</div>' +
      '<div class="as-log" id="asLog" role="log" aria-live="polite" aria-relevant="additions" tabindex="0" ' +
        'aria-label="Conversation"></div>' +
      '<div class="as-chips" id="asChips" role="group" aria-label="Suggested replies"></div>' +
      '<form class="as-input" id="asForm" autocomplete="off">' +
        '<textarea id="asInput" rows="1" placeholder="Type a question…" aria-label="Type a question"></textarea>' +
        '<button type="button" class="as-mic" id="asMic" aria-pressed="false" aria-label="Start voice input" hidden>' + svg('mic') + '</button>' +
        '<button type="submit" class="as-send" aria-label="Send">' + svg('send') + '</button>' +
      '</form>' +
      '<p class="as-privacy" id="asPrivacy">Everything you type stays on this page.</p>' +
    '</div>';
  document.body.appendChild(root);

  var btn = root.querySelector('#asBtn');
  var panel = root.querySelector('#asPanel');
  var log = root.querySelector('#asLog');
  var chipsEl = root.querySelector('#asChips');
  var form = root.querySelector('#asForm');
  var input = root.querySelector('#asInput');
  var mic = root.querySelector('#asMic');
  var sub = root.querySelector('#asSub');
  var title = root.querySelector('#asTitle');
  var privacy = root.querySelector('#asPrivacy');

  var SUBTITLES = {
    menu: 'Main menu',
    navigate: 'Finding your way around',
    qa: 'Answers from the FAQ',
    done: 'All set'
  };
  function setMode(m) {
    state.mode = m;
    sub.textContent = voice.on ? 'Listening… tap the mic to stop' : SUBTITLES[m];
  }

  /* ── LOG ───────────────────────────────────────────────────────────── */
  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function say(content, who) {
    var m = el('div', 'as-msg as-msg--' + (who || 'bot'));
    if (typeof content === 'string') m.textContent = content;
    else m.appendChild(content);
    if (who !== 'user') {
      var sr = el('span', 'as-sr', 'Assistant: ');
      m.insertBefore(sr, m.firstChild);
    }
    log.appendChild(m);
    scrollLog();
    return m;
  }
  function you(text) { say(text, 'user'); }

  /* ── CHIPS ─────────────────────────────────────────────────────────────
     A chip is one of:
       { label, step, arg }          next step in the conversation
       { label, page, frag, step? }  navigate the site (no href, see below)
       { label, url }                leaves the site in a new tab
       { label, href }               mailto: / tel:
       { label, act }                back | menu
     Navigation chips follow the site's rule for internal links: no href at
     all, data-goto instead. A preview frame reacts to an anchor's href before
     any script runs, so a bare "#page-x" breaks navigation there. The site's
     own router (script.js) handles the click; we only continue the chat. */
  var chipDefs = [];

  function chips(list) {
    chipsEl.innerHTML = '';
    chipDefs = list.filter(Boolean);
    chipDefs.forEach(function (c, i) {
      var a;
      if (c.url) {
        a = el('a', 'as-chip as-chip--primary is-external', c.label);
        a.href = c.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', c.label + ' (opens in a new tab)');
      } else if (c.href) {
        a = el('a', 'as-chip', c.label);
        a.href = c.href;
      } else if (c.page) {
        a = el('a', 'as-chip', c.label);
        a.setAttribute('data-goto', c.page);
        if (c.frag) a.setAttribute('data-frag', c.frag);
        a.setAttribute('role', 'link');
        a.setAttribute('tabindex', '0');
      } else {
        a = el('button', 'as-chip' + (c.act ? ' as-chip--quiet' : ''), c.label);
        a.type = 'button';
      }
      a.setAttribute('data-chip', i);
      chipsEl.appendChild(a);
    });
    chipsEl.hidden = !chipDefs.length;
    chipsEl.scrollTop = 0;
  }

  function nav(page, frag) {
    // Let the site's router do the work by clicking a link it understands.
    var a = el('a');
    a.setAttribute('data-goto', page);
    if (frag) a.setAttribute('data-frag', frag);
    a.hidden = true;
    root.appendChild(a);
    a.click();
    root.removeChild(a);
  }

  /* After the router lands on an FAQ question, open it. */
  function openFaqItem(id) {
    setTimeout(function () {
      var b = document.querySelector('#' + id + ' .acc-btn');
      if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
    }, 60);
  }

  function useChip(c, fromClick) {
    you(c.label);
    if (c.act === 'back') return back();
    if (c.act === 'menu') return go('menu');
    if (c.url) {
      if (fromClick) { go('sentToForm', c); }
      // Typed or spoken: a new tab can only open from a real tap.
      else say('Tap “' + c.label + '” below to open it — it opens in a new tab.');
      return;
    }
    if (c.href) {
      if (!fromClick) window.location.href = c.href;
      return;
    }
    if (c.page) {
      if (!fromClick) nav(c.page, c.frag);
      if (c.faqItem) openFaqItem(c.faqItem);
      if (c.step) return go(c.step, c.arg);
      say('Done — that’s open on the page now. Anything else?');
      return;
    }
    if (c.step) go(c.step, c.arg);
  }

  chipsEl.addEventListener('click', function (e) {
    var a = e.target.closest('[data-chip]');
    if (!a) return;
    var c = chipDefs[+a.getAttribute('data-chip')];
    if (c) useChip(c, true);
  });
  // Buttons get Enter/Space for free; the site's keydown handler covers
  // data-goto links. External/mail links are real links already.

  /* ── STEPS ─────────────────────────────────────────────────────────────
     Each step writes one bot message and sets the chips. go() records the
     step so Back can return to it. */
  var NAV_TAIL = [{ label: 'Back', act: 'back' }, { label: 'Main menu', act: 'menu' }];

  function go(name, arg, opts) {
    opts = opts || {};
    if (!opts.noPush && state.step && name !== 'menu') state.history.push(state.step);
    if (name === 'menu') state.history = [];
    state.step = { name: name, arg: arg };
    STEPS[name](arg);
  }

  function back() {
    var prev = state.history.pop();
    if (!prev) return go('menu');
    state.step = prev;
    STEPS[prev.name](prev.arg);
  }

  function campCard(key) {
    var c = D.camps[key];
    var box = el('div', 'as-card');
    box.appendChild(el('div', 'as-card-title', c.name));
    var dl = el('dl', 'as-facts');
    function row(k, v, n) {
      if (!v) return;
      dl.appendChild(el('dt', null, k));
      var dd = el('dd', null, v);
      if (n) dd.appendChild(el('span', 'as-note', n));
      dl.appendChild(dd);
    }
    if (key === 'prospect') {
      row('Men’s session', c.menDate);
      row('Women’s session', c.womenDate);
      row('Price', c.price, c.priceNote);
    } else {
      row('Dates', c.dates);
      row('Who', c.audience);
      row('Day camper', c.dayPrice, c.dayPriceNote);
      row('Overnight camper', c.overnightPrice, c.overnightPriceNote);
      if (c.mountainChallengePrice) row('Mountain Challenge', c.mountainChallengePrice, c.mountainChallengeNote);
    }
    box.appendChild(dl);
    return box;
  }

  function campChips(key) {
    var c = D.camps[key], m = CAMP[key];
    return [
      c.registrationUrl ? { label: 'Register for ' + c.shortName, url: c.registrationUrl } : null,
      document.getElementById('page-' + m.page).querySelector('#schedule')
        ? { label: 'See the schedule', page: m.page, frag: 'schedule' } : null,
      { label: 'Questions about this camp', step: 'topic', arg: m.faq }
    ].concat(NAV_TAIL);
  }

  var STEPS = {
    menu: function () {
      setMode('menu');
      state.camp = null;
      say('What can I help you with?');
      chips(MENU.map(function (m) { return { label: m.label, step: m.step }; }));
    },

    findCamp: function () {
      setMode('navigate');
      say('Who is the camp for?');
      chips([
        { label: 'A player aged ' + (D.camps.elite.ages || '8–17'), step: 'camp', arg: 'elite' },
        { label: 'A college-bound player', step: 'camp', arg: 'prospect' },
        { label: 'A high school girls team', step: 'camp', arg: 'team' }
      ].concat(NAV_TAIL));
    },

    camp: function (key) {
      setMode('navigate');
      state.camp = key;
      nav(CAMP[key].page);
      var wrap = el('div');
      wrap.appendChild(el('p', null, D.camps[key].name + ' is the one. I’ve opened its page.'));
      wrap.appendChild(campCard(key));
      say(wrap);
      chips(campChips(key));
    },

    register: function () {
      setMode('navigate');
      say('Each camp has its own registration form. Which camp?');
      var list = Object.keys(CAMP).map(function (k) {
        var c = D.camps[k];
        return c.registrationUrl ? { label: c.shortName, url: c.registrationUrl } : null;
      });
      chips(list.concat([{ label: 'Not sure which camp', step: 'findCamp' },
                         { label: 'Registration page', page: 'register' }], NAV_TAIL));
    },

    sentToForm: function (c) {
      setMode('done');
      say('The form opened in a new tab. ' + (D.payment.note || ''));
      chips([{ label: 'How do I pay?', step: 'answer', arg: 'registration-4' },
             { label: 'Contact camp staff', step: 'contact' }].concat(NAV_TAIL));
    },

    pages: function () {
      setMode('navigate');
      say('Which page?');
      chips(PAGES.map(function (p, i) {
        var hasSections = p.sections.some(function (s) { return findOnPage(p.page, s.frag); });
        return hasSections ? { label: p.label, step: 'page', arg: i } : { label: p.label, page: p.page };
      }).concat(NAV_TAIL));
    },

    page: function (i) {
      setMode('navigate');
      var p = PAGES[i];
      nav(p.page);
      say('Here’s the ' + p.label + ' page. Jump to a section?');
      chips(p.sections.filter(function (s) { return findOnPage(p.page, s.frag); })
        .map(function (s) { return { label: s.label, page: p.page, frag: s.frag }; })
        .concat(NAV_TAIL));
    },

    ask: function () {
      setMode('qa');
      say('Type your question, or pick a topic.');
      chips(faqGroups().map(function (g) { return { label: g.title, step: 'topic', arg: g.id }; })
        .concat(NAV_TAIL));
      if (!isCoarse()) input.focus();
    },

    topic: function (groupId) {
      setMode('qa');
      var g = faqGroups().filter(function (x) { return x.id === groupId; })[0];
      if (!g) return STEPS.ask();
      say(g.title + ' — what would you like to know?');
      chips(g.items.map(function (it) { return { label: it.q, step: 'answer', arg: it.id }; })
        .concat(NAV_TAIL));
    },

    answer: function (id) {
      setMode('qa');
      var it = faqItem(id);
      if (!it) return STEPS.unknown();
      answerCard(it);
      var rel = faqGroups().filter(function (g) { return g.id === it.group; })[0];
      var more = rel ? rel.items.filter(function (x) { return x.id !== id; }).slice(0, 2) : [];
      chips([{ label: 'Show it on the FAQ page', page: 'faq', frag: it.id, faqItem: it.id, step: 'afterShow' }]
        .concat(more.map(function (x) { return { label: x.q, step: 'answer', arg: x.id }; }), NAV_TAIL));
    },

    afterShow: function () {
      setMode('qa');
      say('It’s open on the FAQ page. Anything else?');
      chips([{ label: 'Ask another question', step: 'ask' }].concat(NAV_TAIL));
    },

    special: function (kind) {
      setMode('qa');
      SPECIAL[kind]();
    },

    contact: function () {
      setMode('qa');
      var wrap = el('div');
      wrap.appendChild(el('p', null, 'Camp staff would much rather answer your question than have you guess.'));
      var lines = el('div', 'as-card');
      var tel = el('a', null, D.contact.phone); tel.href = 'tel:' + D.contact.phoneDial;
      var mail = el('a', null, D.contact.email); mail.href = 'mailto:' + D.contact.email;
      var p1 = el('p'); p1.appendChild(document.createTextNode('Call ')); p1.appendChild(tel);
      var p2 = el('p'); p2.appendChild(document.createTextNode('Email ')); p2.appendChild(mail);
      lines.appendChild(p1); lines.appendChild(p2);
      wrap.appendChild(lines);
      say(wrap);
      chips([{ label: 'Call ' + D.contact.phone, href: 'tel:' + D.contact.phoneDial },
             { label: 'Email us', href: 'mailto:' + D.contact.email },
             { label: 'Open the Contact page', page: 'contact' }].concat(NAV_TAIL));
    },

    unknown: function () {
      setMode('qa');
      say('I don’t have an answer for that on this site, and I’d rather not guess. ' +
          'Camp staff can help: call ' + D.contact.phone + ' or email ' + D.contact.email + '.');
      chips([{ label: 'Browse FAQ topics', step: 'ask' },
             { label: 'Contact camp staff', step: 'contact' }].concat(NAV_TAIL));
    }
  };

  /* Answers built from data.js, so they always match the rest of the site. */
  var SPECIAL = {
    prices: function () { campsSummary('Here’s what each camp costs.'); },
    dates:  function () { campsSummary('Here are the camp dates.'); },
    contact: function () { STEPS.contact(); }
  };
  function campsSummary(lead) {
    var keys = state.camp ? [state.camp] : Object.keys(CAMP);
    var wrap = el('div');
    wrap.appendChild(el('p', null, lead));
    keys.forEach(function (k) { wrap.appendChild(campCard(k)); });
    say(wrap);
    var list = keys.length === 1
      ? [{ label: 'Open the ' + D.camps[keys[0]].shortName + ' page', page: CAMP[keys[0]].page }].concat(campChips(keys[0]))
      : keys.map(function (k) { return { label: D.camps[k].shortName, step: 'camp', arg: k }; }).concat(NAV_TAIL);
    chips(list);
  }

  function findOnPage(page, frag) {
    var sec = document.getElementById('page-' + page);
    return !!(sec && frag && sec.querySelector('#' + frag));
  }

  /* ── FAQ, READ FROM THE PAGE ───────────────────────────────────────────
     Questions and answers come from the FAQ accordions in the document, after
     data.js has filled in prices and dates. Edit the FAQ page and the
     assistant follows. */
  var faqCache = null;
  function faqGroups() {
    if (faqCache) return faqCache;
    faqCache = [].slice.call(document.querySelectorAll('#page-faq .faq-group[id]')).map(function (g) {
      var h = g.querySelector('h3');
      return {
        id: g.id,
        title: h ? h.textContent.trim() : g.id,
        items: [].slice.call(g.querySelectorAll('.acc[id]')).map(function (a) {
          var b = a.querySelector('.acc-btn');
          return { id: a.id, group: g.id, q: b ? b.textContent.trim() : a.id,
                   panel: a.querySelector('.acc-panel-inner') };
        })
      };
    }).filter(function (g) { return g.items.length; });
    return faqCache;
  }
  function faqItem(id) {
    var found = null;
    faqGroups().forEach(function (g) { g.items.forEach(function (it) { if (it.id === id) found = it; }); });
    return found;
  }

  /* Notes meant for the coach (VERIFY ...) are never read out to visitors. */
  var EDITOR_NOTE = /VERIFY|data\.js/;

  function answerCard(it) {
    var wrap = el('div');
    wrap.appendChild(el('p', 'as-q', it.q));
    if (it.panel) {
      it.panel.querySelectorAll('p, li').forEach(function (n) {
        var t = n.textContent.replace(/\s+/g, ' ').trim();
        if (!t || EDITOR_NOTE.test(t)) return;
        var p = el('p', n.tagName === 'LI' ? 'as-li' : null);
        n.childNodes.forEach(function (c) {
          // Keep line breaks (addresses) and links that leave the site (maps).
          if (c.nodeName === 'BR') return p.appendChild(document.createElement('br'));
          var h = c.nodeName === 'A' && c.getAttribute('href');
          if (h && /^https?:/.test(h)) {
            var a = el('a', 'is-external', c.textContent.trim());
            a.href = h; a.target = '_blank'; a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', a.textContent + ' (opens in a new tab)');
            return p.appendChild(a);
          }
          p.appendChild(document.createTextNode(c.textContent.replace(/\s+/g, ' ')));
        });
        wrap.appendChild(p);
      });
    }
    say(wrap);
  }

  var STOP = ' a an and are at be can do does for how i in is it me my of on or our the there to we what when where which who will with you your '
    .split(' ').reduce(function (o, w) { if (w) o[w] = 1; return o; }, {});
  function terms(s) { return norm(s).split(' ').filter(function (w) { return w.length > 2 && !STOP[w]; }); }

  /* Keyword rules first; then plain word overlap with the questions. */
  function matchFaq(text) {
    var t = norm(text);
    var camp = state.camp || campOnScreen();
    for (var i = 0; i < FAQ_RULES.length; i++) {
      var r = FAQ_RULES[i];
      if (r.camp && r.camp !== camp) continue;
      if (!r.re.test(t)) continue;
      if (r.special) return { special: r.special };
      if (faqItem(r.faq)) return { faq: r.faq };
    }
    var words = terms(text), best = null, bestScore = 0;
    if (!words.length) return null;
    faqGroups().forEach(function (g) {
      g.items.forEach(function (it) {
        var hay = ' ' + norm(it.q + ' ' + (it.panel ? it.panel.textContent : '')) + ' ';
        var qn = ' ' + norm(it.q) + ' ';
        var score = 0;
        words.forEach(function (w) {
          if (qn.indexOf(' ' + w) !== -1) score += 2;
          else if (hay.indexOf(' ' + w) !== -1) score += 1;
        });
        if (score > bestScore) { bestScore = score; best = it; }
      });
    });
    return bestScore >= 2 ? { faq: best.id } : null;
  }

  function campOnScreen() {
    var shown = document.querySelector('.page:not([hidden])');
    var id = shown ? shown.id.replace('page-', '') : '';
    for (var k in CAMP) if (CAMP[k].page === id) return k;
    return null;
  }

  /* ── TYPED (OR SPOKEN) INPUT ───────────────────────────────────────── */
  function matchChip(text) {
    var t = norm(text);
    if (!t) return null;
    var exact = chipDefs.filter(function (c) { return norm(c.label) === t; });
    if (exact.length) return exact[0];
    if (t.length < 3) return null;
    var partial = chipDefs.filter(function (c) {
      var l = norm(c.label);
      return (' ' + l + ' ').indexOf(' ' + t + ' ') !== -1;
    });
    return partial.length === 1 ? partial[0] : null;
  }

  function handleText(raw) {
    var text = raw.trim();
    if (!text) return;
    var t = norm(text);
    var chip = matchChip(text);
    if (chip) return useChip(chip, false);
    you(text);
    if (/^(menu|main menu|start over|start again|restart|home menu)$/.test(t)) return go('menu');
    if (/^(back|go back|previous)$/.test(t)) return back();
    if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/.test(t) && wordCount(t) <= 3) {
      say('Hi! What can I help you with?');
      return;
    }
    if (/^(thanks|thank you|thx|cheers|ok|okay|great|perfect)\b/.test(t) && wordCount(t) <= 4) {
      say('You’re welcome. Anything else?');
      return;
    }
    var m = matchFaq(text);
    if (!m) return go('unknown');
    if (m.special) return go('special', m.special);
    go('answer', m.faq);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send();
  });
  function send() {
    var v = input.value;
    input.value = '';
    autosize();
    voiceSent();
    handleText(v);
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); }
  });
  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }
  input.addEventListener('input', function (e) {
    autosize();
    if (e.isTrusted && voice.on) voiceTypingTakesOver();
  });

  /* ── OPEN / CLOSE ──────────────────────────────────────────────────── */
  function isCoarse() { return window.matchMedia('(pointer: coarse)').matches; }

  function open() {
    if (state.open) return;
    state.open = true;
    panel.hidden = false;
    root.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (!log.children.length) {
      say('Hi! I can help you find the right camp, get around the site, or answer common questions.');
      go('menu');
    }
    place();
    // On phones, focusing the box would throw the keyboard over the menu.
    if (isCoarse()) title.focus(); else input.focus();
    scrollLog();
  }

  function close() {
    if (!state.open) return;
    state.open = false;
    stopVoice();
    panel.hidden = true;
    root.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  function restart() {
    log.innerHTML = '';
    state.history = []; state.step = null; state.camp = null;
    say('Starting over. I can help you find the right camp, get around the site, or answer common questions.');
    go('menu');
  }

  btn.addEventListener('click', function () { state.open ? close() : open(); });
  root.querySelector('[data-as="close"]').addEventListener('click', close);
  root.querySelector('[data-as="restart"]').addEventListener('click', restart);
  // Capture phase, so this sees the menu drawer before script.js closes it.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !state.open) return;
    var drawer = document.getElementById('navDrawer');
    if (drawer && drawer.classList.contains('open')) return;  // the menu closes first
    close();
  }, true);

  /* ── STAY CLEAR OF THE SITE'S OWN BUTTONS ──────────────────────────────
     Anything pinned to the bottom of the screen (the phone bar with Call and
     Register, a cookie bar, a modal's action row) is measured and the bubble
     floats just above it. A full-screen overlay such as the menu drawer hides
     the bubble instead. Links listed in LIFT_OVER push it up while they are
     under it. Re-measured on scroll, on resize and whenever the page changes. */
  function pinnedAncestor(n) {
    for (; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      if (root.contains(n)) return null;
      var pos = getComputedStyle(n).position;
      if (pos === 'fixed' || pos === 'sticky') return n;
    }
    return null;
  }
  function visible(n) {
    var cs = getComputedStyle(n);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    var r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function place() {
    var W = window.innerWidth, H = window.innerHeight;
    var off = 0, overlay = false;
    var seen = [];

    function consider(n) {
      if (!n || seen.indexOf(n) !== -1 || root.contains(n) || !visible(n)) return;
      seen.push(n);
      var r = n.getBoundingClientRect();
      if (r.height > H * 0.8 && r.width > W * 0.8) { overlay = true; return; }
      // Only things along the bottom edge (or stacked on what's there, allowing
      // a small gap) and under the right-hand corner.
      if (r.bottom < H - off - 16 || r.right < W - 120) return;
      off = Math.max(off, H - r.top);
    }

    document.querySelectorAll(AVOID.join(',')).forEach(function (n) {
      if (getComputedStyle(n).position === 'fixed') consider(n);
    });
    // Probe the corner, then above whatever was found, for stacked bars.
    root.style.visibility = 'hidden';
    for (var k = 0; k < 4; k++) {
      var before = off;
      [24, 72, 120].forEach(function (dx) {
        var stack = document.elementsFromPoint ? document.elementsFromPoint(W - dx, H - off - 8) : [];
        for (var j = 0; j < stack.length; j++) {
          var pin = pinnedAncestor(stack[j]);
          if (pin) { consider(pin); break; }
        }
      });
      if (off === before) break;
    }
    root.style.visibility = '';

    // Sit just above a page button that is under the bubble's spot. Repeat,
    // in case lifting lands it on another one.
    var bub = btn.getBoundingClientRect();
    if (!state.open && bub.width) {
      var gap = parseFloat(getComputedStyle(root).getPropertyValue('--as-gap')) || 0;
      var lifts = [].slice.call(document.querySelectorAll(LIFT_OVER.join(',')));
      for (var pass = 0; pass < 4; pass++) {
        var bottom = H - off - gap, top = bottom - bub.height, moved = false;
        lifts.forEach(function (n) {
          var r = n.getBoundingClientRect();
          if (!r.height || r.right < bub.left || r.left > bub.right) return;
          if (r.top >= bottom || r.bottom <= top) return;
          off = Math.max(off, H - r.top + 8 - gap);
          moved = true;
        });
        if (!moved) break;
      }
    }

    root.style.setProperty('--as-bottom', Math.round(off) + 'px');
    root.classList.toggle('is-covered', overlay);
  }

  var placing = false;
  function schedulePlace() {
    if (placing) return;
    placing = true;
    requestAnimationFrame(function () { placing = false; place(); });
  }
  window.addEventListener('resize', schedulePlace);
  window.addEventListener('scroll', schedulePlace, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', schedulePlace);
  if ('MutationObserver' in window) {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) if (!root.contains(records[i].target)) return schedulePlace();
    }).observe(document.body, { attributes: true, attributeFilter: ['class', 'hidden', 'style', 'open'],
                                 childList: true, subtree: true });
  }
  place();

  /* ── VOICE ─────────────────────────────────────────────────────────────
     One continuous recognition session, opened on the first tap and kept for
     the rest of the conversation, so the browser asks for the microphone
     once. Words appear in the box as they are heard; a short answer sends
     itself shortly after the speaker pauses, a long one waits for Send. */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var voice = { on: false, rec: null, base: 0, resultCount: 0, typed: false, lastHeard: 0, sendTimer: null, idleTimer: null };

  if (SR) mic.hidden = false;

  /* "jane at example dot com" -> "jane@example.com" */
  function spokenEmail(s) {
    return s.replace(
      /\b([a-z0-9][a-z0-9._%+-]*(?:\s+(?:dot|underscore|dash|hyphen)\s+[a-z0-9]+)*)\s+at\s+([a-z0-9-]+(?:\s+dot\s+[a-z0-9-]+)+)\b/gi,
      function (all, user, domain) {
        function squash(x) {
          return x.replace(/\s+dot\s+/gi, '.').replace(/\s+underscore\s+/gi, '_')
                  .replace(/\s+(?:dash|hyphen)\s+/gi, '-').replace(/\s+/g, '');
        }
        return (squash(user) + '@' + squash(domain)).toLowerCase();
      });
  }

  function startVoice() {
    if (!SR || voice.on) return;
    voice.on = true;
    voice.base = 0; voice.typed = false; voice.lastHeard = Date.now();
    mic.setAttribute('aria-pressed', 'true');
    mic.setAttribute('aria-label', 'Stop voice input');
    root.classList.add('is-listening');
    privacy.textContent = 'Voice goes through your browser’s speech service. Typed text stays on this page.';
    setMode(state.mode);
    if (!voice.rec) {
      voice.rec = new SR();
      voice.rec.continuous = true;
      voice.rec.interimResults = true;
      voice.rec.lang = document.documentElement.lang === 'en' ? 'en-US' : (document.documentElement.lang || 'en-US');
      voice.rec.onresult = onVoiceResult;
      voice.rec.onerror = onVoiceError;
      voice.rec.onend = function () {
        // Browsers end long sessions on their own; reopen quietly.
        voice.base = 0; voice.resultCount = 0;
        if (voice.on) { try { voice.rec.start(); } catch (e) { /* already starting */ } }
      };
    }
    try { voice.rec.start(); } catch (e) { /* already running */ }
    clearInterval(voice.idleTimer);
    voice.idleTimer = setInterval(function () {
      if (Date.now() - voice.lastHeard > MIC_IDLE_MS) {
        stopVoice();
        say('I switched the microphone off after two minutes of quiet. Tap the mic to talk again.');
      }
    }, 5000);
  }

  function stopVoice() {
    if (!voice.on) return;
    voice.on = false;
    clearTimeout(voice.sendTimer);
    clearInterval(voice.idleTimer);
    try { voice.rec && voice.rec.stop(); } catch (e) { /* not running */ }
    mic.setAttribute('aria-pressed', 'false');
    mic.setAttribute('aria-label', 'Start voice input');
    root.classList.remove('is-listening');
    privacy.textContent = 'Everything you type stays on this page.';
    setMode(state.mode);
  }

  function onVoiceResult(e) {
    voice.lastHeard = Date.now();
    voice.resultCount = e.results.length;
    if (voice.typed) return;
    var fin = '', interim = '';
    for (var i = voice.base; i < e.results.length; i++) {
      var t = e.results[i][0].transcript;
      if (e.results[i].isFinal) fin += t; else interim += t;
    }
    input.value = spokenEmail((fin + interim).replace(/\s+/g, ' ').trim());
    autosize();
    clearTimeout(voice.sendTimer);
    if (!interim && fin && wordCount(input.value) <= SHORT_ANSWER_WORDS) {
      voice.sendTimer = setTimeout(function () { if (voice.on && !voice.typed && input.value.trim()) send(); }, AUTO_SEND_MS);
    }
  }

  /* Whatever has been heard so far belongs to the answer just sent. */
  function voiceSent() {
    clearTimeout(voice.sendTimer);
    voice.typed = false;
    voice.base = voice.resultCount;
  }

  function voiceTypingTakesOver() {
    voice.typed = true;
    clearTimeout(voice.sendTimer);
  }

  function onVoiceError(e) {
    var err = e && e.error;
    if (err === 'no-speech' || err === 'aborted') return;
    if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
      stopVoice();
      say('The microphone is blocked here, so I can’t listen. You can still talk to me with your device’s ' +
          'own dictation: press Windows + H on Windows, press Fn twice (or the mic key) on a Mac, or tap ' +
          'the mic on your phone’s keyboard. Then press Send.');
      return;
    }
    if (err === 'network') {
      stopVoice();
      say('Voice input needs an internet connection. You can keep typing instead.');
    }
  }

  mic.addEventListener('click', function () {
    if (voice.on) stopVoice(); else startVoice();
  });

  /* ── PUBLIC ────────────────────────────────────────────────────────── */
  window.siteAssistant = {
    open: open,
    close: close,
    get state() {
      return { mode: state.mode, open: state.open, step: state.step && state.step.name,
               camp: state.camp, history: state.history.map(function (s) { return s.name; }),
               listening: voice.on };
    }
  };
  }
})();
