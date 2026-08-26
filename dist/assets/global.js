/* ==========================================================================
   KIJA CREATIVE — GLOBAL JS
   Paste once at the GHL funnel level, above page-level code blocks.
   Namespaced on window.KIJA. Safe to load twice (idempotent).
   ========================================================================== */
(function () {
  'use strict';
  if (window.KIJA && window.KIJA.__booted) return;

  var CONFIG = {
    variantCookieDays: 30,
    utmCookieDays: 90,
    // Wired at deploy time — see CLAUDE.md §Deploy.
    endpoint: (window.KIJA_ENDPOINT || ''),   // serverless proxy that holds the GHL PIT token
    calendar: 'https://brand.kijacreative.com/widget/booking/IvRyDWXB23MJfz0G6ddg',
    debug: /[?&]kdebug=1/.test(location.search)
  };

  /* ---------- tiny utils ------------------------------------------------ */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function log() { if (CONFIG.debug) console.log.apply(console, ['[kija]'].concat([].slice.call(arguments))); }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie(name) {
    // Split rather than build a regex from a string — safer with names that
    // contain regex metacharacters, and impossible to get the escaping wrong.
    var parts = document.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0].trim() === name) return decodeURIComponent(kv.slice(1).join('=').trim());
    }
    return null;
  }

  /* ---------- A/B assignment -------------------------------------------
     Sticky for 30 days so a returning visitor never sees a different
     variant mid-consideration. Assignment is recorded on every submission
     as `variant_id` so GHL reporting stays comparable across paths.
     ---------------------------------------------------------------------- */
  function assign(testId, variants) {
    var key = 'kija_ab_' + testId;
    var forced = new URLSearchParams(location.search).get('v');
    if (forced && variants.indexOf(forced) > -1) { setCookie(key, forced, CONFIG.variantCookieDays); return forced; }
    var existing = getCookie(key);
    if (existing && variants.indexOf(existing) > -1) return existing;
    var picked = variants[Math.floor(Math.random() * variants.length)];
    setCookie(key, picked, CONFIG.variantCookieDays);
    track('variant_assigned', { test_id: testId, variant_id: picked });
    return picked;
  }
  function currentVariant() {
    return document.documentElement.getAttribute('data-variant') || 'default';
  }

  /* ---------- attribution ----------------------------------------------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  function captureAttribution() {
    var q = new URLSearchParams(location.search), found = {}, any = false;
    UTM_KEYS.forEach(function (k) { if (q.get(k)) { found[k] = q.get(k); any = true; } });
    if (any) {
      found.landing_page = location.pathname;
      found.first_seen = new Date().toISOString();
      setCookie('kija_attr', JSON.stringify(found), CONFIG.utmCookieDays);
    }
    if (!getCookie('kija_referrer') && document.referrer && document.referrer.indexOf(location.host) === -1) {
      setCookie('kija_referrer', document.referrer, CONFIG.utmCookieDays);
    }
  }
  function attribution() {
    var raw = getCookie('kija_attr');
    var out = {};
    try { out = raw ? JSON.parse(raw) : {}; } catch (e) { out = {}; }
    out.referrer = getCookie('kija_referrer') || 'direct';
    return out;
  }

  /* ---------- analytics -------------------------------------------------
     One stable event name per action, fanned out to every sink that
     happens to be present. Never throws if a sink is missing.
     ---------------------------------------------------------------------- */
  function track(event, props) {
    var payload = Object.assign({
      page_path: location.pathname,
      variant_id: currentVariant()
    }, props || {});
    log('track', event, payload);
    try { if (window.posthog && posthog.capture) posthog.capture(event, payload); } catch (e) {}
    try { if (window.gtag) gtag('event', event, payload); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: event }, payload)); } catch (e) {}
  }

  /* auto-track every CTA that declares a name */
  function bindCtaTracking() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (!el) return;
      track(el.getAttribute('data-track'), {
        cta_text: (el.textContent || '').trim().slice(0, 60),
        cta_href: el.getAttribute('href') || null
      });
    });
  }

  /* ---------- lead submission ------------------------------------------
     Posts to a thin serverless proxy which holds the GHL Private
     Integration token and performs: upsert contact → set custom fields →
     add tags → create opportunity in pipeline 1jAQxcIIIG1G1cx8c1nG.
     The token is never exposed client-side.
     ---------------------------------------------------------------------- */
  function submitLead(payload) {
    var body = Object.assign({
      source_path: location.pathname,
      variant_id: currentVariant(),
      submitted_at: new Date().toISOString()
    }, attribution(), payload);

    track('lead_submitted', { capture_path: payload.capture_path, offer: payload.recommended_offer || null });

    if (!CONFIG.endpoint) {
      log('no endpoint configured — payload would have been:', body);
      return Promise.resolve({ ok: true, simulated: true, body: body });
    }
    return fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('submit failed: ' + r.status);
      return r.json();
    }).catch(function (err) {
      // Never lose a lead to a network blip: stash and let the thank-you page retry.
      try { sessionStorage.setItem('kija_pending_lead', JSON.stringify(body)); } catch (e) {}
      track('lead_submit_error', { message: String(err && err.message) });
      throw err;
    });
  }

  /* ---------- nav drawer ------------------------------------------------ */
  function bindNav() {
    var burger = $('[data-burger]'), drawer = $('[data-drawer]');
    if (!burger || !drawer) return;
    function set(open) {
      drawer.setAttribute('data-open', String(open));
      burger.setAttribute('aria-expanded', String(open));
      burger.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      set(drawer.getAttribute('data-open') !== 'true');
    });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  /* ---------- accordion ------------------------------------------------- */
  function bindAccordions() {
    $$('.k-acc').forEach(function (acc) {
      acc.classList.add('is-ready');            // only now may panels collapse

      $$('.k-acc__item', acc).forEach(function (item, i) {
        var btn = $('.k-acc__q', item);
        var panel = $('.k-acc__a', item);
        var inner = panel.firstElementChild;
        var id = 'k-acc-' + (i + 1) + '-' + Math.random().toString(36).slice(2, 7);

        panel.id = id;
        panel.setAttribute('role', 'region');
        btn.setAttribute('aria-controls', id);

        var open = item.getAttribute('data-open') === 'true';
        panel.style.height = open ? 'auto' : '0px';

        function set(next) {
          item.setAttribute('data-open', String(next));
          btn.setAttribute('aria-expanded', String(next));
          // Animate between two definite heights; `auto` cannot be
          // transitioned, so it is only restored once the panel is open.
          panel.style.height = panel.getBoundingClientRect().height + 'px';
          void panel.offsetHeight;
          panel.style.height = next ? inner.getBoundingClientRect().height + 'px' : '0px';
          if (next) {
            var done = function (e) {
              if (e.propertyName !== 'height') return;
              panel.removeEventListener('transitionend', done);
              panel.style.height = 'auto';      // keeps reflowing content honest
            };
            panel.addEventListener('transitionend', done);
            // If the transition never fires (reduced motion, background tab),
            // do not leave the panel stuck at a stale pixel height.
            setTimeout(function () { if (item.getAttribute('data-open') === 'true') panel.style.height = 'auto'; }, 500);
          }
        }

        btn.addEventListener('click', function () {
          var isOpen = item.getAttribute('data-open') === 'true';
          set(!isOpen);
          if (!isOpen) track('objection_opened', { question: (btn.textContent || '').trim().slice(0, 80) });
        });
      });
    });
  }

  /* ---------- reveal on scroll ------------------------------------------ */
  function bindReveal() {
    var els = $$('[data-reveal]');
    if (!els.length) return;

    var root = document.documentElement;
    function revealAll() {
      els.forEach(function (el) { el.classList.add('is-in'); });
    }
    // No observer, or motion is unwanted: leave everything visible.
    if (!('IntersectionObserver' in window) ||
        (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      return;
    }

    root.classList.add('k-reveal');            // only now is hiding allowed

    function show(el) {
      var delay = parseInt(el.getAttribute('data-reveal') || '0', 10) || 0;
      setTimeout(function () { el.classList.add('is-in'); }, delay);
    }
    // Anything already on screen reveals without waiting for the first tick.
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) show(el);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        show(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (el) { io.observe(el); });

    // Watchdog: if the observer never reports (hidden tab, odd render
    // context, GHL editor), give the content back rather than hiding it.
    setTimeout(function () {
      if (!document.querySelector('[data-reveal].is-in')) {
        root.classList.remove('k-reveal');
        revealAll();
        log('reveal watchdog tripped — content restored');
      }
    }, 1600);
  }

  /* ---------- sticky mobile CTA ----------------------------------------- */
  function bindSticky() {
    var bar = $('[data-sticky]');
    if (!bar) return;
    function onScroll() {
      // Reveal once the visitor is past the hero — a CTA bar over the hero
      // competes with the hero's own CTA and measures worse.
      bar.setAttribute('data-show', String(window.scrollY > 520));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- proof wall filter ----------------------------------------- */
  function bindFilters() {
    var wall = $('[data-wall]');
    if (!wall) return;
    var buttons = $$('[data-filter]', wall.parentElement || document);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        $$('[data-services]', wall).forEach(function (card) {
          var match = f === 'all' || card.getAttribute('data-services').split(' ').indexOf(f) > -1;
          card.hidden = !match;
          if (match) shown++;
        });
        var count = $('[data-wall-count]');
        if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
        track('work_filtered', { filter: f, results: shown });
      });
    });
  }

  /* ---------- scroll depth ---------------------------------------------- */
  function bindScrollDepth() {
    var hits = {};
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = Math.round((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
      [25, 50, 75, 90].forEach(function (m) {
        if (pct >= m && !hits[m]) { hits[m] = 1; track('scroll_depth', { depth: m }); }
      });
    }, { passive: true });
  }

  /* ---------- boot ------------------------------------------------------- */
  function boot() {
    captureAttribution();
    bindNav(); bindAccordions(); bindReveal(); bindSticky();
    bindFilters(); bindCtaTracking(); bindScrollDepth();
    track('page_view', { title: document.title });
  }

  window.KIJA = {
    __booted: true,
    config: CONFIG,
    $: $, $$: $$,
    assign: assign, currentVariant: currentVariant,
    track: track, submitLead: submitLead,
    attribution: attribution, setCookie: setCookie, getCookie: getCookie
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
