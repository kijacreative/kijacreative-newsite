/* ==========================================================================
   KIJA CREATIVE — HOMEPAGE OPTION B v2 BEHAVIOUR  (/b)
   Plain JS, no dependencies. Every effect starts from a finished, readable
   layout already in the HTML; without JS or with reduced motion nothing is
   pinned, hidden or delayed.

     reel       the hero video, faded into the paper, with scroll parallax
     table      hero work prints are physical: throw them and they fly, spin,
                bounce off the walls, each other, the headline and the
                buttons, then slide to a stop where they land. Tap one to
                flip it over.
     signal     a noisy waveform tunes in as you scroll or move across it
     sequence   pinned sideways scroll through the five services
     wobble     project cards lean into the cursor's speed
     fan        service cards spread apart around the one you point at
     taste      the words of "Good taste will not be replaced." slide into
                place with the scroll; the review badge turns with it
     align      design, strategy and technical execution drift into one
     push       closing stickers dodge a fast cursor
     (the cursor label and the ink-panel exit live in motion.js, site-wide)
   ========================================================================== */
(function () {
  'use strict';
  var root = document.querySelector('.kb');
  if (!root) return;
  var mq = function (q) { return window.matchMedia && matchMedia(q).matches; };
  var REDUCE = mq('(prefers-reduced-motion: reduce)');
  var FINE = mq('(hover: hover) and (pointer: fine)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (a, b, v) { return Math.max(a, Math.min(b, v)); };
  var easeOut = function (t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); };
  var elastic = function (t) {
    if (t <= 0) return 0; if (t >= 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
  };
  // progress of an element through the viewport: 0 as its top enters, 1 when its top reaches `end` of the viewport
  var progress = function (el, end) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp(0, 1, (vh - r.top) / (vh * (1 - (end || 0.35))));
  };
  // run fn on scroll/resize, once per frame
  var onScroll = function (fn) {
    var t = false;
    var go = function () { if (!t) { t = true; requestAnimationFrame(function () { t = false; fn(); }); } };
    window.addEventListener('scroll', go, { passive: true });
    window.addEventListener('resize', go);
    fn();
  };

  function Spring(k, c, f) { this.k = k; this.c = c; this.x = 0; this.v = 0; this.to = 0; this.f = f; this.raf = 0; }
  Spring.prototype.kick = function () { if (!this.raf) { this.t = performance.now(); this.raf = requestAnimationFrame(this.tick.bind(this)); } };
  Spring.prototype.set = function (to) { this.to = to; this.kick(); };
  Spring.prototype.tick = function (now) {
    var dt = Math.min(0.05, (now - this.t) / 1000), n = Math.ceil(dt / 0.008), h = dt / n; this.t = now;
    for (var i = 0; i < n; i++) { this.v += (-this.k * (this.x - this.to) - this.c * this.v) * h; this.x += this.v * h; }
    this.f(this.x);
    if (Math.abs(this.v) < 0.01 && Math.abs(this.x - this.to) < 0.01) { this.x = this.to; this.v = 0; this.f(this.x); this.raf = 0; return; }
    this.raf = requestAnimationFrame(this.tick.bind(this));
  };

  /* ---------- table: stickers with real physics --------------------------
     Top-down: no gravity, sliding friction like a sticker on a desk. Each
     sticker is a circle for collisions; the headline, lede and buttons are
     solid rectangles, so stickers bounce off the copy and never land on it.
     A tap (little movement, short press) flips the sticker instead.
     ---------------------------------------------------------------------- */
  (function () {
    var table = $('[data-kb-table]');
    if (!table) return;
    var els = $$('[data-kb-sticker]', table);
    var flip = function (el) { el.classList.toggle('is-flipped'); };

    // Phones, tablets and reduced motion: stickers sit in the flow; tap flips.
    if (!FINE || REDUCE || window.innerWidth <= 900) {
      els.forEach(function (el) {
        el.addEventListener('click', function (e) { if (e.target.closest('a')) return; flip(el); });
      });
      return;
    }

    table.classList.add('is-physical');
    var W = 0, H = 0, solids = [], bodies = [], raf = 0, last = 0;
    var FRICTION = 3.1, SPIN_FRICTION = 4.2, BOUNCE = 0.45, PAD = 8;   // prints glide and settle; they do not spin like toys

    function measure() {
      var tr = table.getBoundingClientRect();
      W = tr.width; H = tr.height;
      solids = $$('[data-kb-solid]', table).map(function (s) {
        var r = s.getBoundingClientRect();
        return { x0: r.left - tr.left - PAD, y0: r.top - tr.top - PAD, x1: r.right - tr.left + PAD, y1: r.bottom - tr.top + PAD };
      });
    }
    function paint(b) {
      b.el.style.transform = 'translate3d(' + (b.x - b.w / 2).toFixed(1) + 'px,' + (b.y - b.h / 2).toFixed(1) + 'px,0) rotate(' + b.a.toFixed(2) + 'deg)';
    }
    function init() {
      measure();
      var tr = table.getBoundingClientRect();
      bodies = els.map(function (el) {
        var r = el.getBoundingClientRect();   // laid out by CSS percentages first
        var b = { el: el, w: el.offsetWidth, h: el.offsetHeight, x: r.left - tr.left + r.width / 2, y: r.top - tr.top + r.height / 2,
          vx: 0, vy: 0, a: parseFloat(el.style.getPropertyValue('--r')) || 0, va: 0, held: false };
        b.r = (b.w + b.h) / 4 + 2;
        return b;
      });
      bodies.forEach(function (b) { b.el.classList.add('is-free'); });
      for (var i = 0; i < 40; i++) collide(0);   // settle any start-up overlaps
      bodies.forEach(paint);
    }

    // Each sticker's footprint on the table, accounting for its rotation, so
    // a long strip of tape is as solid as it looks.
    function extents(b) {
      var r = b.a * Math.PI / 180, c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
      return { x: b.w / 2 * c + b.h / 2 * s, y: b.w / 2 * s + b.h / 2 * c };
    }
    function collide(dt) {
      for (var i = 0; i < bodies.length; i++) {
        var b = bodies[i], e = extents(b);
        // walls
        if (b.x - e.x < 0) { b.x = e.x; if (b.vx < 0) { b.vx = -b.vx * BOUNCE; b.va += b.vy * 0.05; } }
        if (b.x + e.x > W) { b.x = W - e.x; if (b.vx > 0) { b.vx = -b.vx * BOUNCE; b.va -= b.vy * 0.05; } }
        if (b.y - e.y < 0) { b.y = e.y; if (b.vy < 0) { b.vy = -b.vy * BOUNCE; b.va -= b.vx * 0.05; } }
        if (b.y + e.y > H) { b.y = H - e.y; if (b.vy > 0) { b.vy = -b.vy * BOUNCE; b.va += b.vx * 0.05; } }
        // solid copy: footprint vs rectangle, resolved along the shallower axis
        for (var s = 0; s < solids.length; s++) {
          var o = solids[s];
          var px = Math.min(b.x + e.x - o.x0, o.x1 - (b.x - e.x));
          var py = Math.min(b.y + e.y - o.y0, o.y1 - (b.y - e.y));
          if (px <= 0 || py <= 0) continue;
          if (px < py) {
            var sx = (b.x < (o.x0 + o.x1) / 2) ? -1 : 1;
            b.x += sx * px;
            if (b.vx * sx < 0) { b.vx = -b.vx * BOUNCE; b.va += b.vy * 0.012 * sx; }
          } else {
            var sy = (b.y < (o.y0 + o.y1) / 2) ? -1 : 1;
            b.y += sy * py;
            if (b.vy * sy < 0) { b.vy = -b.vy * BOUNCE; b.va -= b.vx * 0.012 * sy; }
          }
        }
        // each other: equal-mass circles sized to the footprint
        for (var j = i + 1; j < bodies.length; j++) {
          var c = bodies[j], ex = c.x - b.x, ey = c.y - b.y, dd = Math.hypot(ex, ey) || 0.001, min = b.r + c.r;
          if (dd >= min) continue;
          var ux = ex / dd, uy = ey / dd, over = (min - dd) / 2;
          if (!b.held) { b.x -= ux * over; b.y -= uy * over; } else { c.x += ux * over; c.y += uy * over; }
          if (!c.held) { c.x += ux * over; c.y += uy * over; } else { b.x -= ux * over; b.y -= uy * over; }
          var rel = (c.vx - b.vx) * ux + (c.vy - b.vy) * uy;
          if (rel < 0) {
            var imp = -(1 + 0.7) * rel / 2;
            if (!b.held) { b.vx -= imp * ux; b.vy -= imp * uy; b.va -= imp * 0.03; }
            if (!c.held) { c.vx += imp * ux; c.vy += imp * uy; c.va += imp * 0.03; }
          }
        }
      }
    }

    function step(now) {
      var dt = Math.min(0.033, (now - last) / 1000); last = now;
      var awake = false;
      bodies.forEach(function (b) {
        if (b.held) { awake = true; return; }
        var f = Math.exp(-FRICTION * dt), fs = Math.exp(-SPIN_FRICTION * dt);
        b.vx *= f; b.vy *= f; b.va *= fs;
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        if (Math.hypot(b.vx, b.vy) > 6 || Math.abs(b.va) > 4) awake = true;
        else { b.vx = b.vy = 0; b.va = 0; }
      });
      collide(dt);
      bodies.forEach(paint);
      raf = awake ? requestAnimationFrame(step) : 0;
    }
    function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } }

    els.forEach(function (el, i) {
      var samples = [], sx, sy, t0, moved, offx, offy;
      el.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        if (e.target.closest('a') && el.classList.contains('is-flipped')) return;   // let the link work
        var b = bodies[i]; if (!b) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        measure();
        var tr = table.getBoundingClientRect();
        b.held = true; b.vx = b.vy = 0; b.va = 0; moved = 0;
        sx = e.clientX; sy = e.clientY; t0 = performance.now();
        offx = b.x - (e.clientX - tr.left); offy = b.y - (e.clientY - tr.top);
        samples = [{ x: e.clientX, y: e.clientY, t: t0 }];
        el.classList.add('is-held'); el.style.zIndex = 6;
        wake();
      });
      el.addEventListener('pointermove', function (e) {
        var b = bodies[i]; if (!b || !b.held) return;
        var tr = table.getBoundingClientRect(), now = performance.now();
        moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy));
        b.x = e.clientX - tr.left + offx; b.y = e.clientY - tr.top + offy;
        samples.push({ x: e.clientX, y: e.clientY, t: now });
        while (samples.length > 2 && now - samples[0].t > 90) samples.shift();
        var p = samples[0], vx = (e.clientX - p.x) / Math.max(0.016, (now - p.t) / 1000);
        b.a += clamp(-0.6, 0.6, vx * 0.0005);   // a slight lean as you drag it
        wake();
      });
      var release = function (e) {
        var b = bodies[i]; if (!b || !b.held) return;
        b.held = false; el.classList.remove('is-held');
        setTimeout(function () { el.style.zIndex = ''; }, 600);
        var now = performance.now();
        if (moved < 6 && now - t0 < 350) { flip(el); wake(); return; }
        var p = samples[0];
        var dt = Math.max(0.016, (now - p.t) / 1000);
        var vx = (e.clientX - p.x) / dt, vy = (e.clientY - p.y) / dt, sp = Math.hypot(vx, vy), max = 2600;
        if (sp > max) { vx *= max / sp; vy *= max / sp; }
        b.vx = vx; b.vy = vy; b.va = clamp(-160, 160, vx * 0.08);
        if (window.KIJA && KIJA.track && sp > 600) KIJA.track('home_b_sticker_thrown', { sticker: i });
        wake();
      };
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('lostpointercapture', release);
    });

    var ready = function () { init(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
    window.addEventListener('resize', function () {
      clearTimeout(ready.t);
      ready.t = setTimeout(function () {
        measure();
        // walls in collide() pull everything back inside the resized table
        collide(0); bodies.forEach(paint);
      }, 150);
    });
  })();

  /* ---------- the reel: faded video with parallax ------------------------
     Plays only when it is on screen, never with reduced motion or when the
     visitor has asked to save data (then the first frame stands still).
     Scroll moves it at a third of the page's speed and eases it in closer;
     on a desktop it also leans a little toward the cursor. */
  (function () {
    var media = $('[data-kb-media]'), inner = $('[data-kb-media-in]'), video = $('[data-kb-video]');
    if (!media || !video) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    var canPlay = !REDUCE && !saveData;
    if (canPlay) {
      var tryPlay = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
      new IntersectionObserver(function (en) { if (en[0].isIntersecting) tryPlay(); else video.pause(); }, { threshold: 0.05 }).observe(media);
    }
    if (REDUCE) return;
    var px = 0, py = 0, mx = 0, my = 0, hero = media.parentElement;
    var paint = function () {
      var h = hero.offsetHeight || 1, y = Math.min(window.scrollY, h);
      var scale = 1 + (y / h) * 0.08;
      inner.style.transform = 'translate3d(' + (mx).toFixed(1) + 'px,' + (y * 0.32 + my).toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')';
    };
    onScroll(paint);
    if (FINE) {
      var sx = new Spring(60, 16, function (v) { mx = v; paint(); }), sy = new Spring(60, 16, function (v) { my = v; paint(); });
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        sx.set(((e.clientX - r.left) / r.width - 0.5) * -22); sy.set(((e.clientY - r.top) / r.height - 0.5) * -14);
      });
      hero.addEventListener('pointerleave', function () { sx.set(0); sy.set(0); });
    }
  })();

  /* ---------- signal: a waveform that tunes in --------------------------- */
  (function () {
    var sec = $('[data-kb-signal]'), path = $('[data-kb-wave]'), read = $('[data-kb-wave-read]');
    if (!sec || !path) return;
    var gaps = $$('[data-kb-gap]', sec), fig = $('.kb-wave', sec);
    if (REDUCE) return;   // the markup already shows the clear signal
    var clarity = 0, hover = null, t = 0, raf = 0, visible = false, labels = ['weak', 'fuzzy', 'getting there', 'clear'];
    var noise = function (x, k) { return Math.sin(x * 0.11 + k) * 0.5 + Math.sin(x * 0.37 - k * 1.7) * 0.3 + Math.sin(x * 0.91 + k * 2.3) * 0.2; };
    function draw() {
      raf = 0; t += 0.045;
      var target = hover !== null ? Math.max(progress(sec, 0.45), hover) : progress(sec, 0.45);
      clarity += (target - clarity) * 0.08;
      var d = '', n = 120;
      for (var i = 0; i <= n; i++) {
        var x = i / n * 600;
        var clean = Math.sin(x / 600 * Math.PI * 4) * 70;
        var junk = noise(x, t) * 85 * (1 - clarity) + (Math.random() - 0.5) * 26 * (1 - clarity);
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (110 - clean * (0.35 + 0.65 * clarity) - junk).toFixed(1);
      }
      path.setAttribute('d', d);
      var lit = Math.round(clarity * 4.2 - 0.4);
      gaps.forEach(function (g, i) { g.classList.toggle('is-on', i < lit); });
      read.textContent = labels[clamp(0, 3, Math.floor(clarity * 3.999))];
      if (visible) raf = requestAnimationFrame(draw);
    }
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    }).observe(sec);
    if (FINE) {
      fig.addEventListener('pointermove', function (e) { var r = fig.getBoundingClientRect(); hover = clamp(0, 1, (e.clientX - r.left) / r.width); });
      fig.addEventListener('pointerleave', function () { hover = null; });
    }
  })();

  /* ---------- sequence: pinned, sideways ---------------------------------- */
  (function () {
    var sec = $('[data-kb-seq]');
    if (!sec || REDUCE) return;
    var track = $('.kb-seq__track', sec);
    var chars = $$('.kb-word .kb-ch', sec), arrows = $$('.kb-arrow', sec);
    var dist = 0, vw = 0, base = [], abase = [];
    sec.classList.add('is-pinned');
    function measure() {
      vw = window.innerWidth;
      track.style.transform = 'none';
      dist = Math.max(0, track.scrollWidth - vw);
      sec.style.height = (window.innerHeight + dist) + 'px';
      base = chars.map(function (c) { var r = c.getBoundingClientRect(); return r.left + r.width / 2; });
      abase = arrows.map(function (a) { return a.getBoundingClientRect().left; });
      paint();
    }
    function paint() {
      var top = sec.getBoundingClientRect().top;
      var p = dist ? clamp(0, 1, -top / dist) : 0, x = -p * dist;
      track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      for (var i = 0; i < chars.length; i++) chars[i].style.setProperty('--k', easeOut((vw * 0.95 - (base[i] + x)) / (vw * 0.4)).toFixed(3));
      for (var j = 0; j < arrows.length; j++) arrows[j].style.setProperty('--d', (1 - clamp(0, 1, (vw * 0.9 - (abase[j] + x)) / (vw * 0.35))).toFixed(3));
    }
    onScroll(paint);
    window.addEventListener('resize', function () { clearTimeout(measure.t); measure.t = setTimeout(measure, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  })();

  /* ---------- taste: words slide into place; the badge turns ---------- */
  (function () {
    var sec = $('[data-kb-taste]');
    if (!sec || REDUCE) return;
    var words = $$('[data-kb-drift]', sec), spin = $('[data-kb-spin]', sec);
    onScroll(function () {
      var p = progress(sec, 0.3), e = 1 - Math.pow(1 - p, 3), vw = window.innerWidth;
      words.forEach(function (w, i) {
        var dir = parseFloat(w.getAttribute('data-kb-drift')) || 1;
        w.style.translate = ((1 - e) * dir * vw * (0.18 + i * 0.03)).toFixed(1) + 'px 0';
        w.style.opacity = (0.15 + 0.85 * e).toFixed(3);
      });
      if (spin) spin.style.rotate = (window.scrollY * 0.12).toFixed(1) + 'deg';
    });
  })();

  /* ---------- align: three circles become one -------------------------- */
  (function () {
    var sec = $('[data-kb-align]');
    if (!sec || REDUCE) return;
    var a = $('[data-kb-venn="a"]', sec), b = $('[data-kb-venn="b"]', sec), c = $('[data-kb-venn="c"]', sec), k = $('[data-kb-venn-k]', sec);
    onScroll(function () {
      var p = progress(sec, 0.4), e = easeOut(p * 1.15 - 0.1), s = (1 - e) * 120;
      a.style.translate = (-s).toFixed(1) + 'px ' + (-s * 0.55).toFixed(1) + 'px';
      b.style.translate = s.toFixed(1) + 'px ' + (-s * 0.55).toFixed(1) + 'px';
      c.style.translate = '0 ' + (s * 0.9).toFixed(1) + 'px';
      k.style.opacity = clamp(0, 1, (p - 0.7) / 0.25).toFixed(3);
      sec.classList.toggle('is-aligned', p > 0.9);
    });
  })();

  if (REDUCE) return;   // everything below is motion for its own sake

  /* ---------- wobble: project cards lean into the cursor --------------- */
  $$('[data-kb-wobble]').forEach(function (el) {
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
        sx.set(clamp(-30, 30, vx * 22)); sy.set(clamp(-20, 20, vy * 16)); sr.set(clamp(-9, 9, vx * 6));
      }
      lx = e.clientX; ly = e.clientY; lt = now;
    });
    el.addEventListener('pointerleave', function () { lx = null; sx.v += sx.x * 6; sr.v += sr.x * 6; sx.set(0); sy.set(0); sr.set(0); });
  });

  /* ---------- fan: spread the hand around the pointed card ----------- */
  (function () {
    var deck = $('[data-kb-fan]');
    if (!deck) return;
    var cards = $$('.kb-card', deck);
    var spread = function (i) {
      if (window.innerWidth <= 900) return;
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

  /* ---------- push: closing stickers dodge a fast cursor ------------- */
  (function () {
    var sec = $('[data-kb-push]');
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
        var dt = Math.max(8, now - lt), speed = Math.hypot(e.clientX - lx, e.clientY - ly) / dt;
        if (speed > 0.4) items.forEach(function (o) {
          var r = o.el.getBoundingClientRect(), dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY, d = Math.hypot(dx, dy) || 1;
          if (d > 240) return;
          var f = (240 - d) / 240 * Math.min(speed, 4) * 150;
          o.sx.v += dx / d * f; o.sy.v += dy / d * f; o.sx.kick(); o.sy.kick();
        });
      }
      lx = e.clientX; ly = e.clientY; lt = now;
    });
    sec.addEventListener('pointerleave', function () { lx = null; });
  })();

  // the cursor label and the ink-panel exit are site-wide now: see motion.js
})();
