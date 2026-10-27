/* ============================================================================
   MARYVILLE SOCCER CAMP — single-file build
   Header, footer, router, data binding, accordions and tabs.
   ========================================================================== */
(function () {
  'use strict';
  var D = window.siteData;

  var NAV = [
    { label: 'Home',          page: 'index' },
    /* "Camps" was dropped: it pointed at a section of the home page, so it
       duplicated Home. The three camps have their own entries below, and the
       sticky bar on phones still has a direct Camps jump. */
    { label: 'ID & Prospect', page: 'id-prospect' },
    { label: 'Elite Camp',    page: 'elite-camp' },
    { label: 'HS Team Camp',  page: 'hs-team-camp' },
    { label: 'FAQ',           page: 'faq' },
    { label: 'Contact',       page: 'contact' }
  ];
  var IMAGES = __IMAGES__;
  var LOGO = IMAGES.scots;

  /* Every <img> carries data-img="<key>"; the picture itself is stored once. */
  function applyImages(scope) {
    (scope || document).querySelectorAll('img[data-img]').forEach(function (im) {
      var src = IMAGES[im.getAttribute('data-img')];
      if (src && im.src !== src) im.src = src;
    });
  }
  var LOGO_ALT = 'Maryville College Scots logo';

  function get(p) { return p.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, D); }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function href(page, frag) { return '#' + (frag || 'page-' + page); }

  /* ── ROUTER ──────────────────────────────────────────────────────────── */
  var pages = [].slice.call(document.querySelectorAll('.page'));
  var ids = pages.map(function (p) { return p.id.replace('page-', ''); });

  var current = null;

  /* Anything still pointing at http(s) leaves the site. Flag it so people know
     before they click, rather than being surprised by a new tab. */
  function markExternal() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      if (a.dataset.extMarked || a.hasAttribute('data-goto')) return;
      a.dataset.extMarked = '1';
      a.setAttribute('rel', 'noopener noreferrer');
      var label = (a.textContent || '').trim();
      if (label) a.setAttribute('aria-label', label + ' (opens in a new tab)');
      a.classList.add('is-external');
    });
  }

  /* Internal navigation carries NO href.
     The preview frame inspects an anchor's href on click and shows an
     "open external link" dialog before our own handler ever runs, because a
     bare "#page-register" resolves against the frame's own URL. Stripping the
     href removes the thing it reacts to; role and tabindex keep the elements
     behaving as links for keyboard and screen-reader users. */
  function localizeLinks(root) {
    (root || document).querySelectorAll('a[data-goto], a.skip').forEach(function (a) {
      if (a.dataset.localized) return;
      a.dataset.localized = '1';
      a.removeAttribute('href');
      a.removeAttribute('target');
      a.setAttribute('role', 'link');
      if (!a.hasAttribute('tabindex')) a.setAttribute('tabindex', '0');
    });
  }

  function show(page, frag) {
    pages.forEach(function (p) { p.hidden = p.id !== 'page-' + page; });
    current = page;
    var sec = document.getElementById('page-' + page);
    document.title = sec ? sec.getAttribute('data-title') : 'Maryville Soccer Camp';

    // Nav current-page state
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    revealAll(sec);

    if (frag) {
      var t = document.getElementById(frag);
      if (t) {
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Briefly mark the thing the person asked for, so arriving on a long
        // page doesn't leave them hunting for it.
        t.classList.add('is-target');
        setTimeout(function () { t.classList.remove('is-target'); }, 2200);
        return;
      }
    }
    window.scrollTo(0, 0);
  }

  /* All navigation is handled here. Nothing writes to location, so the site
     works identically in a preview frame, in a file:// window and on a host. */
  document.addEventListener('click', function (e) {
    var skip = e.target.closest && e.target.closest('a.skip');
    if (skip) {
      e.preventDefault();
      var main = document.getElementById('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus(); }
      return;
    }
    var a = e.target.closest && e.target.closest('a[data-goto]');
    if (!a) return;
    var page = a.getAttribute('data-goto');
    if (ids.indexOf(page) === -1) return;
    e.preventDefault();
    show(page, a.getAttribute('data-frag') || '');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var a = e.target.closest && e.target.closest('a[data-goto], a.skip');
    if (!a) return;
    e.preventDefault();
    a.click();
  });

  /* ── HEADER ──────────────────────────────────────────────────────────── */
  function navHTML() {
    return NAV.map(function (n) {
      return '<li><a href="' + href(n.page, n.frag) + '" data-nav="' + n.page + '"' +
             ' data-goto="' + n.page + '"' + (n.frag ? ' data-frag="' + n.frag + '"' : '') + '>' +
             esc(n.label) + '</a></li>';
    }).join('');
  }

  function buildHeader() {
    var announce = D.announcementLink
      ? esc(D.registrationStatus) + ' <a href="#page-register" data-goto="register">' + esc(D.announcementLinkText) + '</a>'
      : esc(D.registrationStatus);

    document.getElementById('site-header').innerHTML =
      '<div class="announce">' + announce + '</div>' +
      '<nav class="nav" aria-label="Main"><div class="nav-inner">' +
        '<a class="brand" href="#page-index" data-goto="index">' +
          '<img src="' + LOGO + '" alt="' + LOGO_ALT + '" width="480" height="288">' +
          '<span class="brand-text"><b>Maryville Soccer Camp</b>' +
          '<span>' + esc(D.location.city) + '</span></span>' +
        '</a>' +
        '<ul class="nav-links">' + navHTML() +
          '<li><a class="nav-cta" href="#page-register" data-goto="register" data-nav="register">Register</a></li>' +
        '</ul>' +
        '<button class="hamburger" id="navToggle" type="button" aria-expanded="false" ' +
          'aria-controls="navDrawer" aria-label="Open menu"><span></span></button>' +
      '</div></nav>' +
      '<div class="drawer" id="navDrawer" hidden>' +
        '<div class="drawer-top"><img src="' + LOGO + '" alt="' + LOGO_ALT + '">' +
        '<button class="drawer-close" id="navClose" type="button" aria-label="Close menu">&times;</button></div>' +
        /* Only the orange button below — the plain list item duplicated it. */
        '<ul>' + navHTML() + '</ul>' +
        '<div class="drawer-cta"><a class="btn btn-primary" href="#page-register" data-goto="register">Register for camp</a></div>' +
        '<p class="drawer-contact">Questions? ' +
          '<a href="tel:' + D.contact.phoneDial + '">' + esc(D.contact.phone) + '</a> &middot; ' +
          '<a href="mailto:' + D.contact.email + '">' + esc(D.contact.email) + '</a></p>' +
      '</div>';
    wireDrawer();
  }

  function wireDrawer() {
    var btn = document.getElementById('navToggle');
    var dr = document.getElementById('navDrawer');
    var cl = document.getElementById('navClose');
    function open() {
      dr.hidden = false; dr.classList.add('open');
      btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      var a = dr.querySelector('a'); if (a) a.focus();
    }
    function shut() {
      dr.classList.remove('open'); dr.hidden = true;
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = ''; btn.focus();
    }
    btn.addEventListener('click', function () { dr.classList.contains('open') ? shut() : open(); });
    cl.addEventListener('click', shut);
    dr.addEventListener('click', function (e) { if (e.target.tagName === 'A') shut(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dr.classList.contains('open')) shut();
    });
  }

  /* ── FOOTER + MOBILE BAR ─────────────────────────────────────────────── */
  function icon(n) {
    var p = {
      phone: '<path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1z"/>',
      list:  '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
      menu:  '<path d="M3 6h18M3 12h18M3 18h18"/>',
      ticket:'<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"/>'
    }[n];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  function buildFooter() {
    document.getElementById('site-footer').innerHTML =
      '<footer class="footer"><div class="wrap"><div class="footer-grid">' +
        '<div><img class="f-logo" src="' + LOGO + '" alt="' + LOGO_ALT + '">' +
          '<p><strong>Maryville Soccer Camp</strong><br>' + esc(D.location.college) +
          '<br>' + esc(D.location.city) + '</p></div>' +
        '<div><h4>Camps</h4><ul>' +
          '<li><a href="#page-id-prospect" data-goto="id-prospect">ID &amp; Prospect Camp</a></li>' +
          '<li><a href="#page-elite-camp" data-goto="elite-camp">Elite Camp</a></li>' +
          '<li><a href="#page-hs-team-camp" data-goto="hs-team-camp">HS Girls Team Camp</a></li></ul></div>' +
        '<div><h4>Information</h4><ul>' +
          '<li><a href="#page-faq" data-goto="faq">FAQ</a></li>' +
          '<li><a href="#page-register" data-goto="register">Registration</a></li>' +
          '<li><a href="#page-contact" data-goto="contact">Contact</a></li>' +
          '<li><a href="' + D.location.mapsUrl + '" target="_blank" rel="noopener">Directions</a></li></ul></div>' +
        '<div><h4>Contact</h4><ul>' +
          '<li><a href="mailto:' + D.contact.email + '">' + esc(D.contact.email) + '</a></li>' +
          '<li><a href="tel:' + D.contact.phoneDial + '">' + esc(D.contact.phone) + '</a></li></ul></div>' +
      '</div><div class="footer-bottom">' +
        '<p>&copy; ' + new Date().getFullYear() + ' Maryville Soccer Camp</p>' +
        '<p><a href="' + D.location.athleticsUrl + '" target="_blank" rel="noopener">Maryville College Athletics</a></p>' +
      '</div></div></footer>' +
      /* Sticky bar on phones. "Menu" opens the full navigation, so every page
         is reachable from the bottom of the screen without scrolling. */
      '<div class="mobilebar" aria-label="Quick actions">' +
        '<button type="button" id="barMenu" aria-controls="navDrawer" aria-expanded="false">' +
          icon('menu') + 'Menu</button>' +
        '<a href="tel:' + D.contact.phoneDial + '">' + icon('phone') + 'Call</a>' +
        '<a href="#camps" data-goto="index" data-frag="camps">' + icon('list') + 'Camps</a>' +
        '<a class="primary" href="#page-register" data-goto="register">' + icon('ticket') + 'Register</a>' +
      '</div>';

    var barMenu = document.getElementById('barMenu');
    if (barMenu) barMenu.addEventListener('click', function () {
      var t = document.getElementById('navToggle');
      if (t) t.click();
    });
  }

  /* ── EMAIL AND PHONE LINKS ───────────────────────────────────────────
     mailto: and tel: are correct in the markup and work normally on a live
     site. They can still go nowhere in three situations: an embedded or
     preview frame that blocks the handler, a desktop with no mail client
     configured, and a laptop with no calling app.

     So the click is left to proceed as normal, and if nothing has taken over
     shortly afterwards, the address or number is copied to the clipboard and
     the person is told. Nobody ends up tapping a dead button. */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    } catch (e) { return Promise.reject(e); }
  }

  var toastEl = null, toastTimer = null;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3600);
  }

  function wireContactLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
      if (!a) return;
      var href = a.getAttribute('href');
      var isMail = href.indexOf('mailto:') === 0;
      // Copy the number in the form people read and write it, not the raw
      // dial string, so it is useful pasted into a contacts app or a message.
      var value = isMail ? href.replace(/^mailto:/, '').split('?')[0]
                         : (D.contact.phone || href.replace(/^tel:/, ''));

      var handled = false;
      function markHandled() { handled = true; }
      window.addEventListener('blur', markHandled, { once: true });
      document.addEventListener('visibilitychange', markHandled, { once: true });

      setTimeout(function () {
        window.removeEventListener('blur', markHandled);
        document.removeEventListener('visibilitychange', markHandled);
        if (handled) return;          // a mail client or dialler took over
        copyText(value).then(function () {
          toast((isMail ? 'Email address' : 'Phone number') + ' copied: ' + value);
        }).catch(function () {
          toast(isMail ? 'Email us at ' + value : 'Call us on ' + value);
        });
      }, 900);
    });
  }

  /* ── DATA BINDING ────────────────────────────────────────────────────── */
  function bindData() {
    document.querySelectorAll('[data-mc]').forEach(function (el) {
      var v = get(el.getAttribute('data-mc'));
      if (v == null) return;
      el.textContent = v;
      // An email address may only wrap after the @ ("name@" / "gmail.com"),
      // never mid-word, which is what happened on phones.
      var at = String(v).indexOf('@');
      if (at > 0) {
        el.textContent = '';
        el.appendChild(document.createTextNode(v.slice(0, at + 1)));
        el.appendChild(document.createElement('wbr'));
        el.appendChild(document.createTextNode(v.slice(at + 1)));
      }
    });
    document.querySelectorAll('[data-mc-href]').forEach(function (el) {
      var v = get(el.getAttribute('data-mc-href'));
      el.setAttribute('href', v || '#page-contact');
      if (!v) { el.setAttribute('data-goto', 'contact'); el.removeAttribute('target'); }
    });
    document.querySelectorAll('[data-mc-mailto]').forEach(function (el) {
      var v = get(el.getAttribute('data-mc-mailto'));
      if (v) el.setAttribute('href', 'mailto:' + v);
    });

    /* The "Email us" buttons open a Gmail compose window rather than handing
       off to whatever mail client the computer happens to have registered,
       which on most machines is Outlook. The plain email address elsewhere on
       the page stays a mailto: link, so anyone who prefers their own client
       still has that route. */
    document.querySelectorAll('[data-mc-gmail]').forEach(function (el) {
      var v = get(el.getAttribute('data-mc-gmail'));
      if (!v) return;
      el.setAttribute('href',
        'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(v));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
    document.querySelectorAll('[data-mc-tel]').forEach(function (el) {
      var v = get(el.getAttribute('data-mc-tel'));
      if (v) el.setAttribute('href', 'tel:' + v);
    });
    document.querySelectorAll('[data-mc-list]').forEach(function (el) {
      var a = get(el.getAttribute('data-mc-list'));
      if (Array.isArray(a) && a.length) {
        el.innerHTML = a.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('');
      }
    });
    document.querySelectorAll('[data-hide-if-empty]').forEach(function (s) {
      var a = get(s.getAttribute('data-hide-if-empty'));
      if (!Array.isArray(a) || !a.length) s.setAttribute('data-empty', 'true');
    });
  }

  /* ── ACCORDIONS ──────────────────────────────────────────────────────── */
  function wireAccordions() {
    document.querySelectorAll('.acc-btn').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.setAttribute('aria-expanded', 'false');
      panel.style.height = '0px';
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        if (open) {
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(function () { panel.style.height = '0px'; });
        } else {
          panel.style.height = panel.scrollHeight + 'px';
          panel.addEventListener('transitionend', function once() {
            if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
            panel.removeEventListener('transitionend', once);
          });
        }
      });
    });
  }

  /* ── SCHEDULE TABS ───────────────────────────────────────────────────── */
  function wireTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (g) {
      var tabs = g.querySelectorAll('.day-tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', String(on));
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) p.hidden = !on;
          });
        });
      });
    });
  }

  /* ── REVEAL ──────────────────────────────────────────────────────────── */
  /* Content is visible by default. The hidden starting state is only applied
     once we know the observer exists, so nothing can leave prices invisible. */
  var io = null;

  /* Once an element has finished revealing, its reveal classes are removed.
     `.js-reveal .reveal.in { transform: none }` is more specific than
     `.camp-card:hover { transform: translateY(-4px) }`, so leaving the classes
     on would silently cancel every hover lift on the page. */
  function markIn(el) {
    el.classList.add('in');
    setTimeout(function () { el.classList.remove('reveal', 'in'); }, 650);
  }

  function initReveal() {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { markIn(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '220px 0px 220px 0px', threshold: 0 });
    window.addEventListener('scroll', function () {
      document.querySelectorAll('.page:not([hidden]) .reveal:not(.in)').forEach(function (e) {
        var r = e.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) markIn(e);
      });
    }, { passive: true });
  }
  function revealAll(scope) {
    if (!io || !scope) return;
    scope.querySelectorAll('.reveal:not(.in)').forEach(function (e) { io.observe(e); });
    // Anything already on screen after a page switch shows immediately.
    requestAnimationFrame(function () {
      scope.querySelectorAll('.reveal:not(.in)').forEach(function (e) {
        var r = e.getBoundingClientRect();
        if (r.top < window.innerHeight) markIn(e);
      });
    });
  }

  /* ── GO ──────────────────────────────────────────────────────────────── */
  applyImages();
  buildHeader();
  buildFooter();
  bindData();
  localizeLinks();
  markExternal();
  wireContactLinks();
  wireAccordions();
  wireTabs();
  initReveal();
  show('index', '');
})();
