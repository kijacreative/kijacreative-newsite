/* ==========================================================================
   KIJA CREATIVE — HOMEPAGE OPTION B BEHAVIOUR  (/b)
   Plain JS, no dependencies, ~8 KB. Interaction patterns studied from the
   Truus.co rebuild (no code taken; that repo has no licence) and rebuilt on
   the same spring as motion.js:

     straighten   "BROKEN" hangs askew and snaps into line as you scroll
     sequence     pinned sideways scroll through the five services; letters
                  bounce into place, hand-drawn arrows draw between them
     fling        hero stickers: grab, throw, they spring home
     wobble       proof cards lean into the cursor's speed, spring back
     fan          service cards spread apart around the one you point at
     push         closing stickers dodge a fast cursor, then settle
     bubble       a label that follows the cursor over anything playable
     scribble     leaving the page draws a scribble across it first

   Every effect starts from a finished, readable layout that is already in
   the HTML. Without JS, or with reduced motion, nothing is pinned, hidden
   or delayed.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.querySelector('.kb');
  if (!root) return;
  var mq = function (q) { return window.matchMedia && matchMedia(q).matches; };
  var REDUCE = mq('(prefers-reduced-motion: reduce)');
  var FINE = mq('(hover: hover) and (pointer: fine)');
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (a, b, v) { return Math.max(a, Math.min(b, v)); };
  // elastic.out(1, .45)-style: overshoots and settles, like a sticker slapped down
  var elastic = function (t) {
    if (t <= 0) return 0; if (t >= 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
  };

  function Spring(k, c, onUpdate) { this.k = k; this.c = c; this.x = 0; this.v = 0; this.to = 0; this.f = onUpdate; this.raf = 0; }
  Spring.prototype.kick = function () { if (!this.raf) { this.t = performance.now(); this.raf = requestAnimationFrame(this.tick.bind(this)); } };
  Spring.prototype.set = function (to) { this.to = to; this.kick(); };
  Spring.prototype.tick = function (now) {
    var dt = Math.min(0.05, (now - this.t) / 1000), n = Math.ceil(dt / 0.008), h = dt / n; this.t = now;
    for (var i = 0; i < n; i++) { this.v += (-this.k * (this.x - this.to) - this.c * this.v) * h; this.x += this.v * h; }
    this.f(this.x);
    if (Math.abs(this.v) < 0.01 && Math.abs(this.x - this.to) < 0.01) { this.x = this.to; this.v = 0; this.f(this.x); this.raf = 0; return; }
    this.raf = requestAnimationFrame(this.tick.bind(this));
  };

  /* ---------- straighten "BROKEN" ----------------------------------------- */
  (function () {
    var w = document.querySelector('[data-kb-broken]');
    if (!w || REDUCE) return;
    var chars = $$('.kb-ch', w), ticking = false;
    var paint = function () {
      ticking = false;
      var p = clamp(0, 1, window.scrollY / (window.innerHeight * 0.45));
      chars.forEach(function (ch, i) { ch.style.setProperty('--k', elastic(clamp(0, 1, p * 1.5 - i * 0.07)).toFixed(3)); });
      w.classList.toggle('is-fixed', p > 0.85);
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  })();

  /* ---------- the sequence: pinned, sideways ----------------------------- */
  (function () {
    var sec = document.querySelector('[data-kb-seq]');
    if (!sec || REDUCE) return;
    var track = sec.querySelector('.kb-seq__track');
    var chars = $$('.kb-word .kb-ch', sec), arrows = $$('.kb-arrow', sec);
    var dist = 0, vw = 0, base = [], abase = [], ticking = false;
    sec.classList.add('is-pinned');
    function measure() {
      vw = window.innerWidth;
      track.style.transform = 'none';
      dist = Math.max(0, track.scrollWidth - vw);
      sec.style.height = (window.innerHeight + dist) + 'px';
      base = chars.map(function (c) { var r = c.getBoundingClientRect(); return r.left + r.width / 2; });
      abase = arrows.map(function (a) { var r = a.getBoundingClientRect(); return r.left; });
      paint();
    }
    function paint() {
      ticking = false;
      var top = sec.getBoundingClientRect().top;
      var p = dist ? clamp(0, 1, -top / dist) : 0, x = -p * dist;
      track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      for (var i = 0; i < chars.length; i++) {
        var sx = base[i] + x, e = clamp(0, 1, (vw * 0.95 - sx) / (vw * 0.4));
        chars[i].style.setProperty('--k', elastic(e).toFixed(3));
      }
      for (var j = 0; j < arrows.length; j++) {
        var ax = abase[j] + x, d = clamp(0, 1, (vw * 0.9 - ax) / (vw * 0.35));
        arrows[j].style.setProperty('--d', (1 - d).toFixed(3));
      }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    window.addEventListener('resize', function () { clearTimeout(measure.t); measure.t = setTimeout(measure, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  })();

  if (REDUCE) return;   // everything below is motion for its own sake

  /* ---------- fling: hero stickers -------------------------------------- */
  $$('[data-kb-fling]').forEach(function (el) {
    if (!FINE) return;
    var x = 0, y = 0, r = 0, sx, sy, lx, ly, lt, vx = 0, vy = 0, dragging = false;
    var paint = function () { el.style.translate = x + 'px ' + y + 'px'; el.style.setProperty('--dr', r + 'deg'); };
    var spx = new Spring(120, 9, function (v) { x = v; paint(); });
    var spy = new Spring(120, 9, function (v) { y = v; paint(); });
    var spr = new Spring(160, 8, function (v) { r = v; paint(); });
    el.addEventListener('pointerdown', function (e) {
      dragging = true; el.setPointerCapture(e.pointerId); el.classList.add('is-held');
      sx = e.clientX - x; sy = e.clientY - y; lx = e.clientX; ly = e.clientY; lt = performance.now();
      [spx, spy, spr].forEach(function (s) { cancelAnimationFrame(s.raf); s.raf = 0; });
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now(), dt = Math.max(1, now - lt);
      vx = (e.clientX - lx) / dt * 1000; vy = (e.clientY - ly) / dt * 1000; lx = e.clientX; ly = e.clientY; lt = now;
      x = spx.x = e.clientX - sx; y = spy.x = e.clientY - sy;
      r = spr.x = clamp(-30, 30, vx * 0.02); paint();
    });
    var drop = function () {
      if (!dragging) return; dragging = false; el.classList.remove('is-held');
      spx.v = clamp(-3000, 3000, vx); spy.v = clamp(-3000, 3000, vy); spr.v = clamp(-400, 400, -vx * 0.05);      // throw it, then it comes home
      spx.set(0); spy.set(0); spr.set(0);
    };
    el.addEventListener('pointerup', drop); el.addEventListener('pointercancel', drop);
  });

  /* ---------- wobble: proof cards lean into the cursor ------------------- */
  $$('[data-kb-fling-hover]').forEach(function (el) {
    if (!FINE) return;
    var x = 0, y = 0, r = 0, lx = null, ly = null, lt = 0;
    var paint = function () { el.style.translate = x + 'px ' + y + 'px'; el.style.setProperty('--dr', r + 'deg'); };
    var sx = new Spring(140, 10, function (v) { x = v; paint(); });
    var sy = new Spring(140, 10, function (v) { y = v; paint(); });
    var sr = new Spring(140, 9, function (v) { r = v; paint(); });
    el.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (lx !== null) {
        var dt = Math.max(8, now - lt), vx = (e.clientX - lx) / dt, vy = (e.clientY - ly) / dt;
        sx.set(clamp(-36, 36, vx * 26)); sy.set(clamp(-24, 24, vy * 18)); sr.set(clamp(-10, 10, vx * 7));
      }
      lx = e.clientX; ly = e.clientY; lt = now;
    });
    el.addEventListener('pointerleave', function () {
      lx = null; sx.v += sx.x * 6; sr.v += sr.x * 6;   // a last flick on the way out
      sx.set(0); sy.set(0); sr.set(0);
    });
  });

  /* ---------- fan: spread the hand around the pointed card ------------- */
  (function () {
    var deck = document.querySelector('[data-kb-fan]');
    if (!deck) return;
    var cards = $$('.kb-card', deck);
    var wide = function () { return window.innerWidth > 900; };
    var spread = function (i) {
      if (!wide()) return;
      deck.classList.toggle('is-spread', i > -1);
      cards.forEach(function (c, j) {
        var gap = i < 0 ? 0 : j < i ? -(90 + (i - j - 1) * 24) : j > i ? 90 + (j - i - 1) * 24 : 0;
        c.style.setProperty('--dx', gap + 'px');
        c.classList.toggle('is-up', j === i);
      });
    };
    cards.forEach(function (c, i) {
      c.addEventListener('pointerenter', function () { spread(i); });
      c.addEventListener('focus', function () { spread(i); });
    });
    deck.addEventListener('pointerleave', function () { spread(-1); });
    deck.addEventListener('focusout', function (e) { if (!deck.contains(e.relatedTarget)) spread(-1); });
  })();

  /* ---------- push: closing stickers dodge a fast cursor --------------- */
  (function () {
    var sec = document.querySelector('[data-kb-push]');
    if (!sec || !FINE) return;
    var items = $$('.kb-psticker', sec).map(function (el) {
      var o = { el: el, x: 0, y: 0 };
      var paint = function () { el.style.translate = o.x + 'px ' + o.y + 'px'; };
      o.sx = new Spring(90, 7, function (v) { o.x = v; paint(); });
      o.sy = new Spring(90, 7, function (v) { o.y = v; paint(); });
      return o;
    });
    var lx = null, ly = 0, lt = 0;
    sec.addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (lx !== null) {
        var dt = Math.max(8, now - lt), speed = Math.hypot(e.clientX - lx, e.clientY - ly) / dt;   // px per ms
        if (speed > 0.4) items.forEach(function (o) {
          var r = o.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          var dx = cx - e.clientX, dy = cy - e.clientY, d = Math.hypot(dx, dy) || 1;
          if (d > 240) return;
          var f = (240 - d) / 240 * Math.min(speed, 4) * 260;
          o.sx.v += dx / d * f; o.sy.v += dy / d * f; o.sx.kick(); o.sy.kick();
        });
      }
      lx = e.clientX; ly = e.clientY; lt = now;
    });
    sec.addEventListener('pointerleave', function () { lx = null; });
  })();

  /* ---------- bubble: a label that follows the cursor ------------------- */
  (function () {
    var b = document.querySelector('.kb-bubble');
    if (!b || !FINE) return;
    var label = b.firstElementChild, x = -100, y = -100, cur = null;
    var paint = function () { b.style.translate = x + 'px ' + y + 'px'; };
    var sx = new Spring(320, 30, function (v) { x = v; paint(); });
    var sy = new Spring(320, 30, function (v) { y = v; paint(); });
    window.addEventListener('pointermove', function (e) { sx.set(e.clientX + 18); sy.set(e.clientY + 18); }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('[data-bubble]');
      if (t === cur) return; cur = t;
      if (t) { label.textContent = t.getAttribute('data-bubble'); b.classList.add('is-on'); }
      else b.classList.remove('is-on');
    });
    document.documentElement.addEventListener('pointerleave', function () { b.classList.remove('is-on'); cur = null; });
    document.addEventListener('pointerdown', function () { b.classList.add('is-press'); });
    document.addEventListener('pointerup', function () { b.classList.remove('is-press'); });
  })();

  /* ---------- scribble: leaving the page draws over it first ----------- */
  (function () {
    var wrap = document.querySelector('.kb-scribble');
    if (!wrap || !wrap.animate) return;
    var path = wrap.querySelector('path');
    var inks = ['var(--k-magenta)', 'var(--k-yellow)', 'var(--k-aqua)', 'var(--k-ink)'];
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target || a.hasAttribute('download') || a.closest('.kx')) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      var go = function () {
        if (!window.KIJA_PREVIEW) { location.href = url.href; return; }
        // single-file preview: there is nowhere to go, so wipe back instead
        wrap.classList.remove('is-on'); path.getAnimations().forEach(function (a) { a.cancel(); });
      };
      wrap.style.setProperty('--ink', inks[Math.floor(Math.random() * inks.length)]);
      wrap.classList.add('is-on');
      var anim = path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 520, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      anim.onfinish = go;
      if (!window.KIJA_PREVIEW) setTimeout(go, 900);   // never strand a click on an animation
    });
    window.addEventListener('pageshow', function () {   // back/forward cache: wipe it
      wrap.classList.remove('is-on');
      path.getAnimations && path.getAnimations().forEach(function (a) { a.cancel(); });
    });
  })();
})();
