/* ==========================================================================
   KIJA CREATIVE — MOTION
   Dependency-free ports of five Motion Primitives components
   (github.com/itsjwill/motion-primitives-website, MIT): MagneticButton,
   SpotlightCard, TiltCard, NumberTicker and MouseParallax. The originals are
   React + Framer Motion; these keep the same spring maths in ~6 KB of plain JS
   so the site stays static and the GHL paste workflow keeps working.

   Load after global.js (GHL: Custom JS footer, below global.js).

   Rules, in the same spirit as CLAUDE.md:
   - Nothing here hides content. Every effect starts from the finished state
     that is already in the HTML, and only moves it.
   - Hover effects run only on devices with a fine pointer.
   - prefers-reduced-motion turns the whole file off.

   Hooks (all declarative, all optional):
     data-magnetic          button follows the cursor on a spring
     data-tilt              card tilts toward the cursor; [data-tilt-depth]
                            children drift for parallax depth
     data-ticker            a verified figure counts up once (1.2s), when in view
     .k-fault               homepage headline: broken slices drift with the
                            cursor; [data-fault-fix] on a CTA repairs them
     a.k-card, a.k-row,
     .k-order__i            cursor spotlight (magenta, never mint)
   ========================================================================== */
(function () {
  'use strict';
  if (window.KIJA_MOTION) return;
  window.KIJA_MOTION = true;

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  if (mq('(prefers-reduced-motion: reduce)')) return;
  var finePointer = mq('(hover: hover) and (pointer: fine)');
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- spring -----------------------------------------------------
     A critically-damped-ish spring stepped on rAF. Same parameters as
     Framer Motion's useSpring (stiffness, damping, mass), so values tuned in
     Motion Primitives carry over. Sleeps when settled.
     ---------------------------------------------------------------------- */
  function Spring(opts, onUpdate) {
    this.k = opts.stiffness || 150; this.c = opts.damping || 15; this.m = opts.mass || 1;
    this.x = 0; this.v = 0; this.target = 0; this.onUpdate = onUpdate; this.raf = 0; this.t = 0;
  }
  Spring.prototype.set = function (to) {
    this.target = to;
    if (!this.raf) { this.t = performance.now(); this.raf = requestAnimationFrame(this.tick.bind(this)); }
  };
  Spring.prototype.jump = function (to) { this.x = this.target = to; this.v = 0; this.onUpdate(to); };
  Spring.prototype.tick = function (now) {
    var dt = Math.min(0.064, (now - this.t) / 1000); this.t = now;
    var steps = Math.ceil(dt / 0.008), h = dt / steps;            // sub-step for stability
    for (var i = 0; i < steps; i++) {
      var a = (-this.k * (this.x - this.target) - this.c * this.v) / this.m;
      this.v += a * h; this.x += this.v * h;
    }
    this.onUpdate(this.x);
    if (Math.abs(this.v) < 0.001 && Math.abs(this.x - this.target) < 0.001) {
      this.x = this.target; this.onUpdate(this.x); this.raf = 0; return;
    }
    this.raf = requestAnimationFrame(this.tick.bind(this));
  };

  /* ---------- MagneticButton ---------------------------------------------
     Port of effects/magnetic-button.tsx: strength .35, mass .5, label moves
     -0.3× the button for depth. Uses the `translate` property so it composes
     with any transform the stylesheet already sets.
     ---------------------------------------------------------------------- */
  function magnetic(el) {
    var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3, mass = 0.5;
    var cfg = { stiffness: 150 / mass, damping: 15 * mass, mass: mass };
    var label = document.createElement('span');
    label.className = 'k-mag__in';
    while (el.firstChild) label.appendChild(el.firstChild);
    el.appendChild(label);
    var x = 0, y = 0;
    var paint = function () {
      el.style.translate = x + 'px ' + y + 'px';
      label.style.translate = (x * -0.3) + 'px ' + (y * -0.3) + 'px';
    };
    var sx = new Spring(cfg, function (v) { x = v; paint(); });
    var sy = new Spring(cfg, function (v) { y = v; paint(); });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      sx.set((e.clientX - (r.left + r.width / 2)) * strength);
      sy.set((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', function () { sx.set(0); sy.set(0); });
  }

  /* ---------- SpotlightCard ----------------------------------------------
     Port of interactive/spotlight-card.tsx. Writes the cursor position to
     --mx/--my; the radial gradient lives in global.css so the colour stays a
     token. Throttled to one write per frame.
     ---------------------------------------------------------------------- */
  function spotlight(el) {
    var pending = null;
    el.classList.add('k-spot');
    el.addEventListener('pointermove', function (e) {
      if (pending) { pending = e; return; }
      pending = e;
      requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (pending.clientX - r.left) + 'px');
        el.style.setProperty('--my', (pending.clientY - r.top) + 'px');
        pending = null;
      });
    });
  }

  /* ---------- TiltCard -----------------------------------------------------
     Port of cards/tilt-card.tsx: rotation mapped from cursor offset, springs
     at stiffness 300 / damping 30. Intensity is lower than the original's 15°
     — these are content cards, not a demo. Children marked data-tilt-depth
     drift against the tilt, standing in for translateZ(50px).
     ---------------------------------------------------------------------- */
  function tilt(el) {
    var deg = parseFloat(el.getAttribute('data-tilt')) || 5;
    var depthEls = $$('[data-tilt-depth]', el);
    var rx = 0, ry = 0;
    var paint = function () {
      el.style.transform = 'perspective(1100px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      depthEls.forEach(function (d) {
        var k = parseFloat(d.getAttribute('data-tilt-depth')) || 1;
        d.style.translate = (ry * k * 2.2) + 'px ' + (-rx * k * 2.2) + 'px';
      });
    };
    var cfg = { stiffness: 300, damping: 30, mass: 1 };
    var sx = new Spring(cfg, function (v) { rx = v; paint(); });
    var sy = new Spring(cfg, function (v) { ry = v; paint(); });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      sx.set(-py * deg * 2); sy.set(px * deg * 2);
    });
    el.addEventListener('pointerleave', function () {
      sx.set(0); sy.set(0);
      setTimeout(function () { if (!sx.raf && !sy.raf) el.style.transform = ''; }, 700);
    });
  }

  /* ---------- NumberTicker -------------------------------------------------
     Port of interactive/number-ticker.tsx. The original eases on an
     overdamped spring (damping 60, stiffness 100), whose long tail sits on
     near-final values like "397%" for seconds. A verified number should never
     be on screen as a different number for longer than a blink, so this runs
     a fixed 1.2s ease-out instead and lands on the exact published string.
     The figure is already in the HTML and is what renders without JS; the
     count only starts as it scrolls into view. Prefix, suffix and decimals
     are parsed from the published string, never typed in. Figures that are
     not a single number (e.g. "1 → 3") are left alone.
     ---------------------------------------------------------------------- */
  var NUM = /^([^\d-]*)(-?\d+(?:\.\d+)?)([^\d]*)$/;
  function ticker(el) {
    var final = (el.textContent || '').trim(), m = final.match(NUM);
    if (!m || !('IntersectionObserver' in window)) return;
    var pre = m[1], num = parseFloat(m[2]), suf = m[3];
    var dp = (m[2].split('.')[1] || '').length, dur = 1200;
    el.setAttribute('aria-label', final);
    el.style.fontVariantNumeric = 'tabular-nums';
    var run = function () {
      var t0 = performance.now();
      var step = function (now) {
        var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 4);   // easeOutQuart
        el.textContent = t < 1 ? pre + (num * e).toFixed(dp) + suf : final;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(function () { el.textContent = final; }, dur + 400);   // land exactly, whatever happens
    };
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      io.disconnect(); run();
    }, { threshold: 0.6 });
    io.observe(el);
  }

  /* ---------- The fault line (MouseParallax) -------------------------------
     Port of effects/mouse-parallax.tsx (stiffness 50, damping 20) driving the
     homepage headline. Each broken slice drifts with the cursor, the two
     lines in opposite directions, so the break feels alive. Hovering or
     focusing a [data-fault-fix] CTA snaps both lines back into register —
     the page's whole argument, in one gesture.
     ---------------------------------------------------------------------- */
  function fault(root) {
    var lines = $$('.k-fault__l', root);
    if (!lines.length) return;
    var fixed = false, lastOff = 0, springs = [];
    var aim = function () {
      springs.forEach(function (o) { o.s.set(fixed ? 0 : lastOff * 0.09 * o.dir); });
    };
    $$('[data-fault-fix]').forEach(function (cta) {
      var on = function () { fixed = true; root.classList.add('is-fixed'); aim(); };
      var off = function () { fixed = false; root.classList.remove('is-fixed'); aim(); };
      cta.addEventListener('pointerenter', on); cta.addEventListener('pointerleave', off);
      cta.addEventListener('focus', on); cta.addEventListener('blur', off);
    });
    if (!finePointer) return;
    springs = lines.map(function (line, i) {
      return { dir: i % 2 ? -1 : 1, s: new Spring({ stiffness: 50, damping: 20, mass: 1 }, function (v) {
        line.style.setProperty('--fx', v.toFixed(4));
      }) };
    });
    window.addEventListener('pointermove', function (e) {
      lastOff = (e.clientX - window.innerWidth / 2) / window.innerWidth;   // -0.5 … 0.5
      aim();
    }, { passive: true });
  }

  /* ---------- site-wide: cursor label + ink-panel page exit ----------------
     Both started on the homepage (Option B) and now run on every page, so
     moving around the site feels like one place. */
  function siteWide() {
  /* ---------- bubble ------------------------------------------------------ */
  (function () {
    var b = document.querySelector('.kb-bubble');
    if (!b || !finePointer) return;
    var label = b.firstElementChild, x = -100, y = -100, cur = null;
    var paint = function () { b.style.translate = x + 'px ' + y + 'px'; };
    var sx = new Spring({ stiffness: 320, damping: 30, mass: 1 }, function (v) { x = v; paint(); });
    var sy = new Spring({ stiffness: 320, damping: 30, mass: 1 }, function (v) { y = v; paint(); });
    window.addEventListener('pointermove', function (e) {
      // near the right edge the label sits on the cursor's left so it never runs off-screen
      var w = label.offsetWidth || 120, left = e.clientX + 18 + w > window.innerWidth - 12;
      sx.set(left ? e.clientX - 14 - w : e.clientX + 18); sy.set(e.clientY + 18);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('[data-bubble]');
      if (t === cur) return; cur = t;
      if (t) { label.textContent = t.getAttribute('data-bubble'); b.classList.add('is-on'); } else b.classList.remove('is-on');
    });
    document.documentElement.addEventListener('pointerleave', function () { b.classList.remove('is-on'); cur = null; });
    document.addEventListener('pointerdown', function () { b.classList.add('is-press'); });
    document.addEventListener('pointerup', function () { b.classList.remove('is-press'); });
  })();

  /* ---------- exit: a clean ink wipe carrying the K mark ----------------- */
  (function () {
    var wrap = document.querySelector('.kb-scribble'), panel = wrap && wrap.querySelector('.kb-wipe');
    if (!panel || !panel.animate) return;
    var ease = 'cubic-bezier(.7,0,.2,1)';
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target || a.hasAttribute('download') || a.closest('.kx')) return;
      var raw = a.getAttribute('href') || '';
      if (window.KIJA_NAV) {   // inside the whole-site preview: the wipe plays, then the preview changes page
        if (raw.charAt(0) !== '/') return;
        e.preventDefault(); wrap.classList.add('is-on');
        panel.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 460, easing: ease, fill: 'forwards' })
          .onfinish = function () { window.KIJA_NAV(raw); };
        return;
      }
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      wrap.classList.add('is-on');
      var go = function () {
        if (!window.KIJA_PREVIEW) { location.href = url.href; return; }
        // single-file preview: nowhere to go, so the panel carries on up and off
        panel.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: 520, easing: ease, fill: 'forwards' })
          .onfinish = function () { wrap.classList.remove('is-on'); panel.getAnimations().forEach(function (x) { x.cancel(); }); };
      };
      panel.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 460, easing: ease, fill: 'forwards' }).onfinish = go;
      if (!window.KIJA_PREVIEW) setTimeout(go, 900);
    });
    window.addEventListener('pageshow', function () {
      wrap.classList.remove('is-on');
      panel.getAnimations && panel.getAnimations().forEach(function (x) { x.cancel(); });
    });
  })();
  }

  /* ---------- boot ---------------------------------------------------------- */
  function boot() {
    siteWide();
    $$('.k-fault').forEach(fault);
    $$('[data-ticker]').forEach(ticker);
    if (!finePointer) return;
    $$('[data-magnetic]').forEach(magnetic);
    $$('a.k-card, a.k-row, .k-order__i').forEach(spotlight);
    $$('[data-tilt]').forEach(tilt);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
