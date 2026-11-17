/* ==========================================================================
   KIJA CREATIVE — PROOF WALL EXPLORER  (/work)
   Port of Infinite Gallery by BLCaptain / @dososo
   (github.com/dososo/infinite-image-gallery, MIT). Same world/camera
   architecture, R2 lattice scatter, rectangle separation, Fibonacci sphere
   and CRT power-off — re-cast for Kija:

   - No stock photographs. Every tile is a piece of the live
     kijacreative.com work: the headline word, each published figure,
     taglines, client quotes, palettes, voice lines, locations, partners,
     method steps, and the project's own photos once they are in the repo.
   - Tiles sit in greyscale like an archive; hovering one brings it back to
     colour. Clicking expands it into an interactive case panel.
   - Scrolling past the sphere powers the wall off and returns you to the
     page — the CRT shutdown is the exit, not an ending.
   - GSAP (vendored, GreenSock standard licence) is fetched only when the
     explorer first opens. The grid on /work is the no-JS / keyboard /
     search-engine version of the same content and is never removed.
   ========================================================================== */
(function () {
  'use strict';
  if (window.KIJA_EXPLORER) return;
  window.KIJA_EXPLORER = true;

  var DATA_EL = document.getElementById('k-cases-data');
  var TRIGGERS = Array.prototype.slice.call(document.querySelectorAll('[data-explore]'));
  if (!DATA_EL || !TRIGGERS.length) return;
  var CASES = JSON.parse(DATA_EL.textContent);
  var BASE = window.KIJA_ASSET_BASE || '';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = function (e, p) { try { window.KIJA && KIJA.track(e, p); } catch (x) {} };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- geometry (lib/geometry.js, unchanged maths) ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // R2 plastic-constant lattice (Martin Roberts): uniform, non-gridded, and
  // natively toroidal, so the infinite loop has no seam to hide.
  function r2Scatter(n, W, H, jitter, seed) {
    var a1 = 0.7548776662, a2 = 0.5698402910, rand = mulberry32(seed);
    var damp = jitter * 0.76 * Math.sqrt(Math.PI) / (2 * Math.sqrt(n)), pts = [];
    for (var i = 0; i < n; i++) {
      var x = (0.5 + a1 * i) % 1, y = (0.5 + a2 * i) % 1;
      x = ((x + damp * (rand() - 0.5) * 2) % 1 + 1) % 1;
      y = ((y + damp * (rand() - 0.5) * 2) % 1 + 1) % 1;
      pts.push({ x: x * W, y: y * H });
    }
    return pts;
  }
  // Toroidal AABB separation: guarantees no two tiles' corners overlap.
  function separateRects(pts, W, H, rw, rh, gap) {
    var needX = rw + gap, needY = rh + gap;
    for (var it = 0; it < 60; it++) {
      var moved = false;
      for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x; if (dx > W / 2) dx -= W; else if (dx < -W / 2) dx += W;
        var dy = pts[i].y - pts[j].y; if (dy > H / 2) dy -= H; else if (dy < -H / 2) dy += H;
        var ox = needX - Math.abs(dx), oy = needY - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          moved = true;
          if (ox <= oy) {
            var px = (ox / 2 + 0.5) * (dx < 0 ? -1 : 1);
            pts[i].x = ((pts[i].x + px) % W + W) % W; pts[j].x = ((pts[j].x - px) % W + W) % W;
          } else {
            var py = (oy / 2 + 0.5) * (dy < 0 ? -1 : 1);
            pts[i].y = ((pts[i].y + py) % H + H) % H; pts[j].y = ((pts[j].y - py) % H + H) % H;
          }
        }
      }
      if (!moved) break;
    }
    return pts;
  }
  // Fibonacci sphere (golden angle) for the plane ⇄ sphere morph.
  function spherePositions(n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(Math.max(0, 1 - y * y)), th = 2.399963 * i;
      pts.push({ x: Math.cos(th) * rr, y: y, z: Math.sin(th) * rr });
    }
    return pts;
  }

  /* ---------- tiles from proof --------------------------------------------
     Interleaved across cases so neighbouring tiles rarely share a project. */
  function buildPieces() {
    var per = CASES.map(function (c, ci) {
      var out = [{ ci: ci, kind: 'word' }, { ci: ci, kind: 'client' }];
      c.metrics.forEach(function (m) { out.push({ ci: ci, kind: 'metric', m: m }); });
      out.push({ ci: ci, kind: 'headline' });
      if (c.quote) out.push({ ci: ci, kind: 'cquote' });
      (c.pieces || []).forEach(function (w) { out.push({ ci: ci, kind: 'w-' + w.kind, w: w }); });
      (c.media || []).forEach(function (m) { out.push({ ci: ci, kind: 'image', img: m }); });
      return out;
    });
    var pieces = [], more = true, round = 0;
    while (more) {
      more = false;
      per.forEach(function (list) { if (list[round]) { pieces.push(list[round]); more = true; } });
      round++;
    }
    return pieces;
  }
  // Client palettes are content: their hexes are applied inline on purpose.
  var HEX = /^#[0-9a-f]{3,8}$/i;
  function tileHTML(p) {
    var c = CASES[p.ci], w = p.w || {};
    var who = '<span class="kx-t__who">' + esc(c.client) + '</span>';
    switch (p.kind) {
      case 'word': return '<div class="kx-t kx-t--word"><span class="kx-t__word">' + esc(c.thumb.word).replace(/\n/g, '<br>') + '</span></div>';
      case 'client': return '<div class="kx-t kx-t--client"><span class="kx-t__k">' + esc(c.industry) + (c.year ? ' · ' + esc(c.year) : '') + '</span><b>' + esc(c.client) + '</b><span class="kx-t__k">Case study</span></div>';
      case 'metric': return '<div class="kx-t kx-t--metric">' + who + '<b>' + esc(p.m.value) + '</b><span class="kx-t__k">' + esc(p.m.label) + '</span></div>';
      case 'headline': return '<div class="kx-t kx-t--headline">' + who + '<b>' + esc(c.headline) + '</b></div>';
      case 'cquote': return '<div class="kx-t kx-t--quote">' + '<q>' + esc(c.quote.text) + '</q><span class="kx-t__k">' + esc(c.quote.name) + ', ' + esc(c.quote.role) + '</span></div>';
      case 'w-tagline': return '<div class="kx-t kx-t--tagline">' + who + '<b>' + esc(w.text) + '</b></div>';
      case 'w-voice': return '<div class="kx-t kx-t--voice">' + '<span class="kx-t__k">' + esc(c.client) + ' · ' + esc(w.label) + '</span><b>“' + esc(w.text) + '”</b></div>';
      case 'w-place': return '<div class="kx-t kx-t--place">' + '<span class="kx-t__k">' + esc(w.label) + '</span><b>' + esc(w.name) + '</b><span class="kx-t__k">“' + esc(w.line) + '”</span></div>';
      case 'w-palette': return '<div class="kx-t kx-t--palette">' + '<span class="kx-t__k">' + esc(c.client) + ' · ' + esc(w.label) + '</span><span class="kx-t__sw">' +
        w.colors.filter(function (x) { return HEX.test(x[1]); }).map(function (x) { return '<i style="background:' + x[1] + '"><em>' + esc(x[0] || x[1]) + '</em></i>'; }).join('') + '</span></div>';
      case 'w-list': return '<div class="kx-t kx-t--list">' + '<span class="kx-t__k">' + esc(c.client) + ' · ' + esc(w.label) + '</span><ul>' + w.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
      case 'w-step': return '<div class="kx-t kx-t--step">' + '<span class="kx-t__k">' + esc(c.client) + ' · ' + esc(w.n) + '</span><b>' + esc(w.t) + '</b><span class="kx-t__k">' + esc(w.d) + '</span></div>';
      case 'w-pair': return '<div class="kx-t kx-t--pair">' + '<span class="kx-t__k">' + esc(w.label) + '</span><b>' + esc(w.a) + '</b><b class="kx-t__alt">' + esc(w.b) + '</b></div>';
      case 'image': return '<div class="kx-t kx-t--image' + (p.img.logo ? ' kx-t--logo' : '') + '"><img src="' + esc(p.img.src) + '" alt="" loading="lazy" decoding="async" draggable="false"><span class="kx-t__cap">' + esc(c.client) + ' · ' + esc(p.img.caption) + '</span></div>';
    }
    return '';
  }

  /* ---------- state -------------------------------------------------------- */
  var TILE_W = 240, TILE_H = 160, MIN_DIST = 330, DENSITY = 0.86;   // a touch denser than the original: fewer, richer tiles
  var LERP_DRAG = 0.75, FRICTION = 0.93, FLING = 0.5;
  var IDLE_DRIFT = REDUCE ? 0 : 0.08, IDLE_SPIN = 0.004, BALL_SPIN = REDUCE ? 0 : 0.0035;
  var root, stage, world, tipEl, crtEl, dotEl, panel, indexEl, modeBtns, lastTrigger;
  var tiles = [], sphere = [], N = 0, cellW = 0, cellH = 0, vw = 0, vh = 0;
  var phase = 'closed', camX = 0, camY = 0, targetX = 0, targetY = 0;
  var dragging = false, lastPX = 0, lastPY = 0, downX = 0, downY = 0, downTile = null, velX = 0, velY = 0;
  var idleAngle = 0, zoom = 2, zoomTarget = null, ballRot = 0, inBall = false, rafId = 0;
  var pointers = new Map(), pinchDist0 = 0, pinchZoom0 = 0, pushedHash = false, openCi = -1;
  var gsap = null, built = false;
  var clamp = function (a, b, v) { return Math.max(a, Math.min(b, v)); };

  /* ---------- GSAP, lazily ---------------------------------------------------- */
  var gsapPromise = null;
  /* history calls can be refused (sandboxed or srcdoc frames); never let that break the wall */
  function safeHistory(method, url) {
    try { history[method](method === 'pushState' ? { kx: 1 } : null, '', url); return true; } catch (err) { return false; }
  }

  function loadGsap() {
    if (window.gsap) return Promise.resolve(window.gsap);
    if (gsapPromise) return gsapPromise;
    gsapPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = BASE + '/assets/vendor/gsap.min.js';
      s.onload = function () { window.gsap ? res(window.gsap) : rej(new Error('gsap missing')); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return gsapPromise;
  }

  /* ---------- DOM ------------------------------------------------------------- */
  function build() {
    root = document.createElement('div');
    root.className = 'kx';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Explore the proof wall');
    root.hidden = true;
    root.innerHTML =
      '<div class="kx__stage"><div class="kx__world" aria-hidden="true"></div></div>' +
      '<div class="kx__top">' +
        '<p class="kx__title"><span class="k-mark">KIJA<span>/</span>CREATIVE</span><span class="kx__sub">The proof wall · ' + CASES.length + ' projects · <span data-kx-count></span> pieces of proof</span></p>' +
        '<button class="kx__btn" type="button" data-kx-close>Close <kbd>Esc</kbd></button>' +
      '</div>' +
      '<div class="kx__bar" role="toolbar" aria-label="Wall view">' +
        '<button class="kx__seg" type="button" data-kx-mode="plane" aria-pressed="true">Plane</button>' +
        '<button class="kx__seg" type="button" data-kx-mode="sphere" aria-pressed="false">Sphere</button>' +
        '<span class="kx__sep" aria-hidden="true"></span>' +
        '<button class="kx__seg" type="button" data-kx-index aria-expanded="false" aria-controls="kx-index">Index</button>' +
      '</div>' +
      '<nav class="kx__index" id="kx-index" aria-label="All projects" hidden><ol>' +
        CASES.map(function (c, i) {
          return '<li><button type="button" data-kx-open="' + i + '"><span class="kx__dot k-case__thumb--' + esc(c.thumb.tone) + '"></span><b>' + esc(c.client) + '</b><span>' + esc(c.industry) + '</span></button></li>';
        }).join('') +
      '</ol></nav>' +
      '<p class="kx__tip" aria-hidden="true">Drag to roam · Scroll to gather it into a sphere · Click any tile to open its case</p>' +
      '<div class="kx__crt"></div><div class="kx__flash"></div>' +
      '<article class="kx__case" aria-live="polite" hidden></article>';
    document.body.appendChild(root);
    stage = root.querySelector('.kx__stage'); world = root.querySelector('.kx__world');
    tipEl = root.querySelector('.kx__tip'); crtEl = root.querySelector('.kx__crt'); dotEl = root.querySelector('.kx__flash');
    panel = root.querySelector('.kx__case'); indexEl = root.querySelector('.kx__index');
    modeBtns = Array.prototype.slice.call(root.querySelectorAll('[data-kx-mode]'));

    var pieces = buildPieces();
    N = pieces.length;
    root.querySelector('[data-kx-count]').textContent = N;
    vw = window.innerWidth; vh = window.innerHeight;
    var aspect = vw / vh, area = N * MIN_DIST * MIN_DIST / DENSITY;
    cellH = Math.round(Math.sqrt(area / aspect)); cellW = Math.round(cellH * aspect);
    // the loop needs at least a viewport plus a tile in each direction
    cellW = Math.max(cellW, vw + TILE_W * 2); cellH = Math.max(cellH, vh + TILE_H * 2);
    var pts = separateRects(r2Scatter(N, cellW, cellH, 0.35, 7), cellW, cellH, TILE_W * 1.1, TILE_H * 1.1, 26);
    sphere = spherePositions(N);
    tiles = pieces.map(function (p, i) {
      var el = document.createElement('div');
      el.className = 'kx__tile kx-tone-' + (CASES[p.ci].thumb.tone || 'plum');
      el.setAttribute('data-ci', p.ci);
      el.innerHTML = tileHTML(p);
      world.appendChild(el);
      return { el: el, wx: pts[i].x, wy: pts[i].y, p: p };
    });

    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    stage.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('keydown', onKey);
    window.addEventListener('resize', function () { vw = window.innerWidth; vh = window.innerHeight; });
    stage.addEventListener('pointerover', hover);
    stage.addEventListener('pointerout', hover);

    root.querySelector('[data-kx-close]').addEventListener('click', function () { requestClose(); });
    modeBtns.forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-kx-mode')); }); });
    root.querySelector('[data-kx-index]').addEventListener('click', function () { toggleIndex(); });
    indexEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kx-open]'); if (!b) return;
      toggleIndex(false); openCase(+b.getAttribute('data-kx-open'), null);
    });
    panel.addEventListener('click', onPanelClick);
    built = true;
  }

  /* ---------- hover: greyscale archive → colour --------------------------- */
  function hover(e) {
    var t = e.target.closest && e.target.closest('.kx__tile');
    if (!t || phase !== 'roam' || dragging || zoom < 1.5 || openCi > -1) return;
    var on = e.type === 'pointerover';
    if (!on && e.relatedTarget && t.contains(e.relatedTarget)) return;
    t.classList.toggle('is-hot', on);
    t.style.zIndex = on ? 30 : '';
    if (!REDUCE) gsap.to(t, { scale: on ? 1.2 : 1.1, duration: on ? 0.3 : 0.4, ease: 'power2.out', overwrite: 'auto' });
  }

  /* ---------- camera loop ---------------------------------------------------- */
  function recycle() {
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i], moved = false;
      if (t.wx + camX < -TILE_W * 1.2) { t.wx += cellW; moved = true; }
      else if (t.wx + camX > vw + TILE_W * 0.2) { t.wx -= cellW; moved = true; }
      if (t.wy + camY < -TILE_H * 1.2) { t.wy += cellH; moved = true; }
      else if (t.wy + camY > vh + TILE_H * 0.2) { t.wy -= cellH; moved = true; }
      if (moved) gsap.set(t.el, { x: t.wx, y: t.wy });
    }
  }
  function centre() { camX = targetX = vw / 2 - cellW / 2; camY = targetY = vh / 2 - cellH / 2; }

  function frame() {
    rafId = requestAnimationFrame(frame);
    if (phase !== 'roam') return;
    if (zoomTarget !== null) {                         // Plane / Sphere buttons ease the same dial the wheel drives
      zoom += (zoomTarget - zoom) * (REDUCE ? 1 : 0.08);
      if (Math.abs(zoomTarget - zoom) < 0.005) { zoom = zoomTarget; zoomTarget = null; }
    }
    var flat = clamp(0, 1, (zoom - 1.0) / 0.6);
    syncMode(flat);
    if (flat >= 0.999) {
      if (inBall) {
        inBall = false; centre(); velX = velY = 0;
        tiles.forEach(function (t) { gsap.set(t.el, { x: t.wx, y: t.wy, scale: 1.1, opacity: 1, zIndex: '' }); });
        stage.classList.remove('is-ball');
      }
      if (dragging) {
        camX += (targetX - camX) * LERP_DRAG; camY += (targetY - camY) * LERP_DRAG;
      } else {
        camX += velX; camY += velY; velX *= FRICTION; velY *= FRICTION;
        if (Math.abs(velX) < 0.03 && Math.abs(velY) < 0.03) {
          velX = velY = 0;
          if (openCi < 0) { idleAngle += IDLE_SPIN; camX += Math.cos(idleAngle) * IDLE_DRIFT; camY += Math.sin(idleAngle) * IDLE_DRIFT; }
        }
        targetX = camX; targetY = camY;
      }
      stage.classList.toggle('is-moving', dragging || Math.abs(velX) > 0.5 || Math.abs(velY) > 0.5);
      gsap.set(world, { x: camX, y: camY, force3D: true });
      recycle();
    } else {
      inBall = true;
      stage.classList.add('is-ball');
      renderBall(flat);
    }
  }

  function renderBall(flat) {
    gsap.set(world, { x: 0, y: 0 });
    var camX0 = vw / 2 - cellW / 2, camY0 = vh / 2 - cellH / 2;
    camX = targetX = camX0; camY = targetY = camY0;
    if (openCi < 0) ballRot += BALL_SPIN;
    var R = Math.min(vw, vh) * 0.42 * clamp(0.02, 1, zoom), focal = Math.min(vw, vh) * 2;
    var zfade = clamp(0, 1, (zoom - 0.06) / 0.22), sinR = Math.sin(ballRot), cosR = Math.cos(ballRot);
    for (var i = 0; i < N; i++) {
      var t = tiles[i], sp = sphere[i];
      var x1 = sp.x * cosR - sp.z * sinR, z1 = sp.x * sinR + sp.z * cosR;
      var s = focal / (focal - z1 * R);
      var bx = vw / 2 + x1 * R * s, by = vh / 2 + sp.y * R * s, bs = 0.5 * s, bo = (z1 + 1) / 2 * 0.7 + 0.3;
      var fx = t.wx + camX, fy = t.wy + camY;
      gsap.set(t.el, {
        x: bx + (fx - bx) * flat - TILE_W / 2, y: by + (fy - by) * flat - TILE_H / 2,
        scale: bs + (1.1 - bs) * flat,
        opacity: (bo + (1 - bo) * flat) * (flat + (1 - flat) * zfade), force3D: true
      });
      var zi = Math.round((z1 + 1) * 100);
      if (t._zi !== zi) { t.el.style.zIndex = zi; t._zi = zi; }
    }
  }

  function syncMode(flat) {
    var m = flat > 0.5 ? 'plane' : 'sphere';
    if (syncMode.last === m) return; syncMode.last = m;
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-kx-mode') === m)); });
  }
  function setMode(m) {
    if (phase !== 'roam') return;
    zoomTarget = m === 'sphere' ? 1.0 : 2.0;
    track('work_explore_mode', { mode: m });
  }

  /* ---------- open: erupt → golden disc → scatter --------------------------- */
  function intro() {
    var els = tiles.map(function (t) { return t.el; });
    centre(); gsap.set(world, { x: camX, y: camY });
    if (REDUCE) {
      phase = 'intro';
      tiles.forEach(function (t) { gsap.set(t.el, { x: t.wx, y: t.wy, scale: 1.1, opacity: 0 }); });
      gsap.to(els, { opacity: 1, duration: 0.4, onComplete: function () { phase = 'roam'; showTip(); } });
      return;
    }
    phase = 'intro';
    els.forEach(function (el, i) {
      el.style.zIndex = i;
      gsap.set(el, { x: cellW / 2 - TILE_W / 2 + (Math.random() - 0.5) * 140, y: cellH / 2 - TILE_H / 2 + (Math.random() - 0.5) * 90, scale: 0.3, opacity: 0 });
    });
    // shorter than the original's 2s spawn: a visitor clicked a button to get here
    gsap.to(els, { scale: 1.8, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: { amount: 1.1, from: 0, ease: 'power2.out' } });
    gsap.delayedCall(1.1 + 0.5 + 0.25, explode);
  }
  function explode() {
    phase = 'explode';
    var els = tiles.map(function (t) { return t.el; });
    els.forEach(function (el) { el.style.zIndex = ''; });
    var cx = cellW / 2, cy = cellH / 2, R = Math.min(vw, vh) * 0.42;
    var disc = tiles.map(function (t, i) {
      var a = i * 2.399963, r = Math.sqrt(i / N) * R;
      return { x: cx + r * Math.cos(a) - TILE_W / 2, y: cy + r * Math.sin(a) - TILE_H / 2 };
    });
    gsap.timeline()
      .to(els, { x: function (i) { return disc[i].x; }, y: function (i) { return disc[i].y; }, scale: 0.82, duration: 0.8, ease: 'power4.out', stagger: { amount: 0.3, from: 'center', grid: 'auto' } })
      .to(els, { x: function (i) { return tiles[i].wx; }, y: function (i) { return tiles[i].wy; }, scale: 1.1, duration: 1.3, ease: 'expo.inOut', stagger: { amount: 0.5, from: 'center', grid: 'auto' },
        onComplete: function () { phase = 'roam'; showTip(); } });
  }
  function showTip() {
    gsap.killTweensOf(tipEl);
    gsap.fromTo(tipEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      onComplete: function () { gsap.to(tipEl, { opacity: 0, duration: 0.8, delay: 4 }); } });
  }

  /* ---------- exit: the CRT power-off --------------------------------------- */
  function powerOff() {
    if (phase !== 'roam') return;
    phase = 'gone';
    track('work_explore_power_off');
    if (REDUCE) { close(); return; }
    var cx = vw / 2, cy = vh / 2, els = tiles.map(function (t) { return t.el; });
    gsap.timeline({ onComplete: function () { gsap.delayedCall(0.15, function () { requestClose(true); }); } })
      .to(els, { x: cx - TILE_W / 2, y: cy - TILE_H / 2, scale: 0.55, duration: 0.16, ease: 'power3.in' }, 0)
      .to(els, { scaleY: 0.006, duration: 0.13, ease: 'power2.in' }, 0.16)
      .to(els, { scaleX: 0.006, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0.29)
      .to(crtEl, { opacity: 1, duration: 0.32, ease: 'power2.in' }, 0.08)
      .fromTo(dotEl, { opacity: 0, scaleX: 4, scaleY: 1 }, { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.1, ease: 'power2.out' }, 0.34)
      .to(dotEl, { opacity: 0, scale: 0, duration: 0.32, ease: 'power2.in' }, 0.45);
  }

  /* ---------- input ------------------------------------------------------------ */
  function onDown(e) {
    if (openCi > -1) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downX = e.clientX; downY = e.clientY;
    downTile = e.target.closest('.kx__tile');
    if (pointers.size === 2) {
      dragging = false;
      var v = Array.from(pointers.values());
      pinchDist0 = Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y) || 1; pinchZoom0 = zoom;
      return;
    }
    if (phase !== 'roam' || zoom < 1.5) return;
    dragging = true; lastPX = e.clientX; lastPY = e.clientY; velX = velY = 0;
    try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  }
  function onMove(e) {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && phase === 'roam') {
      var v = Array.from(pointers.values());
      var nz = pinchZoom0 * (Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y) / pinchDist0);
      zoomTarget = null;
      if (nz < 0.14) { powerOff(); return; }
      zoom = clamp(0.14, 2.0, nz);
      return;
    }
    if (!dragging) return;
    var dx = e.clientX - lastPX, dy = e.clientY - lastPY;
    targetX += dx; targetY += dy;
    velX = velX * 0.55 + dx * 0.45; velY = velY * 0.55 + dy * 0.45;
    lastPX = e.clientX; lastPY = e.clientY;
  }
  function onUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    var moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (dragging) {
      dragging = false;
      if (moved > 10) {
        var speed = Math.min(moved * FLING, 100);
        velX = (e.clientX - downX) / moved * speed; velY = (e.clientY - downY) / moved * speed;
      } else { velX = velY = 0; }
      try { stage.releasePointerCapture(e.pointerId); } catch (x) {}
    }
    if (moved < 8 && downTile && phase === 'roam' && pointers.size === 0) {
      openCase(+downTile.getAttribute('data-ci'), downTile);
    }
    downTile = null;
  }
  function onWheel(e) {
    e.preventDefault();
    if (phase !== 'roam' || openCi > -1) return;
    zoomTarget = null;
    var nz = zoom - e.deltaY * 0.0015;
    if (nz < 0.14 && e.deltaY > 0) { powerOff(); return; }
    zoom = clamp(0.14, 2.0, nz);
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (openCi > -1) closeCase(); else if (!indexEl.hidden) toggleIndex(false); else requestClose();
      return;
    }
    if (e.key === 'Tab') return trapFocus(e);
    if (openCi > -1) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepCase(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepCase(-1); }
      return;
    }
    if (phase !== 'roam' || zoom < 1.5 || e.target.closest('.kx__index')) return;
    var K = 60;
    if (e.key === 'ArrowLeft') velX += K; else if (e.key === 'ArrowRight') velX -= K;
    else if (e.key === 'ArrowUp') velY += K; else if (e.key === 'ArrowDown') velY -= K;
    else return;
    e.preventDefault();
  }
  function trapFocus(e) {
    var scope = openCi > -1 ? panel : root;
    var f = Array.prototype.slice.call(scope.querySelectorAll('a[href],button:not([disabled])')).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!scope.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }
  function toggleIndex(force) {
    var open = typeof force === 'boolean' ? force : indexEl.hidden;
    indexEl.hidden = !open;
    root.querySelector('[data-kx-index]').setAttribute('aria-expanded', String(open));
    if (open) { var b = indexEl.querySelector('button'); if (b) b.focus(); }
  }

  /* ---------- the case panel ------------------------------------------------- */
  function caseHTML(ci) {
    var c = CASES[ci], tone = c.thumb.tone || 'plum';
    var metrics = c.metrics.length
      ? '<div class="kx-c__metrics">' + c.metrics.map(function (m) { return '<p><b data-kx-tick>' + esc(m.value) + '</b><span>' + esc(m.label) + '</span></p>'; }).join('') + '</div>'
      : '<p class="kx-c__nometric">No figures on this one yet. We publish a number only once the client has confirmed it in writing.</p>';
    var sys = (c.system || []);
    return '' +
      '<div class="kx-c__art k-case__thumb--' + tone + '" aria-hidden="true"><span>' + esc(c.thumb.word).replace(/\n/g, '<br>') + '</span></div>' +
      '<div class="kx-c__body">' +
        '<div class="kx-c__nav">' +
          '<p class="kx-c__meta">' + esc(c.client) + ' · ' + esc(c.industry) + (c.year ? ' · ' + esc(c.year) : '') + '</p>' +
          '<span>' +
            '<button class="kx__btn" type="button" data-kx-step="-1" aria-label="Previous project">←</button>' +
            '<button class="kx__btn" type="button" data-kx-step="1" aria-label="Next project">→</button>' +
            '<button class="kx__btn" type="button" data-kx-back>Back to the wall</button>' +
          '</span>' +
        '</div>' +
        (c.tagline ? '<p class="kx-c__tag">“' + esc(c.tagline.replace(/[“”"]/g, '')) + '”</p>' : '') +
        '<h2 class="kx-c__h" id="kx-case-title">' + esc(c.headline) + '</h2>' +
        metrics +
        (c.situation ? '<section class="kx-c__sec"><h3 class="k-label k-label--dim">Situation</h3><p>' + esc(c.situation[0]) + '</p></section>' : '') +
        (c.diagnosis ? '<section class="kx-c__sec"><h3 class="k-label k-label--mag">Diagnosis</h3><p class="kx-c__pull">' + esc(c.diagnosis[0]) + '</p>' +
          (c.diagnosis[1] ? '<p>' + esc(c.diagnosis[1]) + '</p>' : '') + '</section>' : '') +
        (sys.length ? '<section class="kx-c__sec"><h3 class="k-label k-label--dim">The system, in order</h3>' +
          '<div class="kx-c__steps" role="tablist" aria-label="System parts">' + sys.map(function (s, i) {
            return '<button type="button" role="tab" id="kx-tab-' + i + '" aria-controls="kx-step" aria-selected="' + (i === 0) + '" data-kx-part="' + i + '"><span>' + (i + 1) + '</span>' + esc(s.t) + '</button>';
          }).join('') + '</div>' +
          '<p class="kx-c__stepd" id="kx-step" role="tabpanel" aria-labelledby="kx-tab-0">' + esc(sys[0].d) + '</p></section>' : '') +
        (c.result ? '<section class="kx-c__sec"><h3 class="k-label k-label--dim">Result</h3><p>' + esc(c.result) + '</p></section>' : '') +
        (c.quote ? '<blockquote class="kx-c__quote"><p>“' + esc(c.quote.text) + '”</p><footer>' + esc(c.quote.name) + ', ' + esc(c.quote.role) + '</footer></blockquote>' : '') +
        ((c.media || []).length ? '<section class="kx-c__sec"><h3 class="k-label k-label--dim">The work</h3><div class="kx-c__gallery">' +
          c.media.map(function (m) { return '<figure' + (m.logo ? ' class="is-logo"' : '') + '><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async"><figcaption>' + esc(m.caption) + '</figcaption></figure>'; }).join('') + '</div></section>' : '') +
        '<div class="k-btns kx-c__ctas">' +
          '<a class="k-btn k-btn--primary" href="/work/' + esc(c.slug) + '" data-track="cta_explore_case_full">Read the full case study</a>' +
          '<a class="k-btn k-btn--ghost" href="/book" data-track="cta_explore_case_book">Book a call</a>' +
        '</div>' +
      '</div>';
  }
  function tickNumbers() {
    if (REDUCE) return;
    Array.prototype.forEach.call(panel.querySelectorAll('[data-kx-tick]'), function (el) {
      var final = el.textContent, m = final.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)([^\d]*)$/);
      if (!m) return;
      var num = parseFloat(m[2]), dp = (m[2].split('.')[1] || '').length, o = { v: 0 };
      el.setAttribute('aria-label', final);
      gsap.to(o, { v: num, duration: 1.2, ease: 'power4.out', delay: 0.25,
        onUpdate: function () { el.textContent = m[1] + o.v.toFixed(dp) + m[3]; },
        onComplete: function () { el.textContent = final; } });
    });
  }
  function revealPanel() {
    var parts = panel.querySelectorAll('.kx-c__art span, .kx-c__nav, .kx-c__h, .kx-c__metrics, .kx-c__nometric, .kx-c__sec, .kx-c__ctas');
    if (REDUCE) return;
    gsap.fromTo(parts, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 });
  }

  function openCase(ci, fromTile) {
    if (openCi > -1 || phase !== 'roam') return;
    openCi = ci;
    var c = CASES[ci];
    track('work_explore_case_open', { case: c.slug, via: fromTile ? 'tile' : 'index' });
    panel.innerHTML = caseHTML(ci);
    panel.setAttribute('aria-labelledby', 'kx-case-title');
    panel.hidden = false;
    stage.classList.add('is-dim');
    root.classList.add('has-case');
    var src = fromTile && fromTile.getBoundingClientRect();
    if (src && !REDUCE) {
      var f = panel.getBoundingClientRect();
      var art = panel.querySelector('.kx-c__art');
      var tone = getComputedStyle(fromTile).getPropertyValue('--kx-bg').trim() || getComputedStyle(fromTile.firstElementChild).backgroundColor;
      gsap.set(panel.children, { opacity: 0 });
      // The tile grows into the panel in its own colour, then the reading side
      // settles to ink as the content arrives — the tile becomes the case.
      var ink = getComputedStyle(panel).getPropertyValue('--kx-panel').trim();
      gsap.set(art, { opacity: 1 });
      gsap.set(panel.querySelector('.kx-c__art span'), { opacity: 0 });
      gsap.fromTo(panel,
        { x: src.left - f.left, y: src.top - f.top, scaleX: src.width / f.width, scaleY: src.height / f.height, transformOrigin: '0 0', backgroundColor: tone },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.7, ease: 'expo.inOut',
          onComplete: function () {
            gsap.set(panel, { clearProps: 'transform' });
            gsap.to(panel, { backgroundColor: ink, duration: 0.45, ease: 'power2.out', onComplete: function () { gsap.set(panel, { clearProps: 'backgroundColor' }); } });
            gsap.set(panel.children, { opacity: 1 }); revealPanel(); tickNumbers();
          } });
    } else {
      gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: REDUCE ? 0.01 : 0.3, onComplete: function () { revealPanel(); tickNumbers(); } });
    }
    var back = panel.querySelector('[data-kx-back]'); if (back) back.focus({ preventScroll: true });
  }
  function closeCase() {
    if (openCi < 0) return;
    var ci = openCi;
    var tile = null;
    // fold back into a visible tile of the same project, if there is one on screen
    tiles.some(function (t) {
      if (+t.el.getAttribute('data-ci') !== ci || t.p.kind !== 'word') return false;
      var r = t.el.getBoundingClientRect();
      if (r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh) { tile = t.el; return true; }
      return false;
    });
    var done = function () {
      panel.hidden = true; panel.innerHTML = ''; gsap.set(panel, { clearProps: 'all' });
      stage.classList.remove('is-dim'); root.classList.remove('has-case'); openCi = -1;
      var b = root.querySelector('[data-kx-index]'); if (b) b.focus({ preventScroll: true });
    };
    if (tile && !REDUCE) {
      var r = tile.getBoundingClientRect(), f = panel.getBoundingClientRect();
      gsap.to(panel.children, { opacity: 0, duration: 0.15 });
      gsap.to(panel, { x: r.left - f.left, y: r.top - f.top, scaleX: r.width / f.width, scaleY: r.height / f.height, transformOrigin: '0 0',
        backgroundColor: getComputedStyle(tile).getPropertyValue('--kx-bg').trim() || getComputedStyle(tile.firstElementChild).backgroundColor, duration: 0.55, ease: 'expo.inOut', onComplete: done });
    } else {
      gsap.to(panel, { opacity: 0, duration: REDUCE ? 0.01 : 0.25, onComplete: done });
    }
  }
  function stepCase(dir) {
    if (openCi < 0) return;
    var next = (openCi + dir + CASES.length) % CASES.length;
    track('work_explore_case_step', { case: CASES[next].slug });
    var swap = function () { openCi = next; panel.innerHTML = caseHTML(next); revealPanel(); tickNumbers(); panel.scrollTop = 0;
      var b = panel.querySelector('[data-kx-step="' + dir + '"]'); if (b) b.focus({ preventScroll: true }); };
    if (REDUCE) return swap();
    gsap.to(panel.children, { opacity: 0, x: -24 * dir, duration: 0.18, ease: 'power2.in', onComplete: swap });
  }
  function onPanelClick(e) {
    var s = e.target.closest('[data-kx-step]'); if (s) return stepCase(+s.getAttribute('data-kx-step'));
    if (e.target.closest('[data-kx-back]')) return closeCase();
    var p = e.target.closest('[data-kx-part]');
    if (p) {
      var i = +p.getAttribute('data-kx-part'), sys = CASES[openCi].system;
      Array.prototype.forEach.call(panel.querySelectorAll('[data-kx-part]'), function (b) { b.setAttribute('aria-selected', String(b === p)); });
      var d = panel.querySelector('.kx-c__stepd');
      d.setAttribute('aria-labelledby', 'kx-tab-' + i);
      if (REDUCE) { d.textContent = sys[i].d; return; }
      gsap.to(d, { opacity: 0, y: 6, duration: 0.12, onComplete: function () { d.textContent = sys[i].d; gsap.to(d, { opacity: 1, y: 0, duration: 0.25 }); } });
    }
  }

  /* ---------- open / close the explorer ------------------------------------- */
  function open(trigger, fromHash) {
    if (phase !== 'closed') return;
    lastTrigger = trigger || null;
    phase = 'loading';
    document.documentElement.classList.add('kx-loading');
    loadGsap().then(function (g) {
      gsap = g;
      document.documentElement.classList.remove('kx-loading');
      if (!built) build();
      root.hidden = false;
      document.documentElement.classList.add('kx-open');
      zoom = 2; zoomTarget = null; inBall = false; openCi = -1; syncMode.last = null; syncMode(1);
      stage.classList.remove('is-ball', 'is-dim');
      gsap.set([crtEl, dotEl], { opacity: 0 });
      if (!fromHash) pushedHash = safeHistory('pushState', '#explore');   // refused in some embeds; the wall still opens
      track('work_explore_open', { via: fromHash ? 'link' : 'button' });
      cancelAnimationFrame(rafId); rafId = requestAnimationFrame(frame);
      root.querySelector('[data-kx-close]').focus({ preventScroll: true });
      intro();
    }, function () {
      // Only when GSAP could not load (offline, blocked): the grid on /work is the same content.
      phase = 'closed';
      document.documentElement.classList.remove('kx-loading');
      var wall = document.getElementById('wall');
      if (wall) wall.scrollIntoView();
      else if (window.KIJA_NAV) window.KIJA_NAV('/work');
      else location.href = '/work';
    });
  }
  function requestClose(fromPowerOff) {
    if (phase === 'closed' || phase === 'loading') return;
    if (pushedHash && location.hash === '#explore') { pushedHash = false; history.back(); return; }   // popstate closes
    if (location.hash === '#explore') safeHistory('replaceState', location.pathname + location.search);
    close(fromPowerOff);
  }
  function close() {
    if (phase === 'closed') return;
    if (openCi > -1) { panel.hidden = true; panel.innerHTML = ''; openCi = -1; root.classList.remove('has-case'); }
    gsap.killTweensOf(tiles.map(function (t) { return t.el; }));
    var finish = function () {
      root.hidden = true; phase = 'closed';
      cancelAnimationFrame(rafId);
      tiles.forEach(function (t) { gsap.set(t.el, { opacity: 0, scaleX: 1, scaleY: 1 }); });
      document.documentElement.classList.remove('kx-open');
      toggleIndex(false);
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    };
    if (REDUCE || phase === 'gone') finish();
    else gsap.to(root, { opacity: 0, duration: 0.25, onComplete: function () { gsap.set(root, { clearProps: 'opacity' }); finish(); } });
  }
  window.addEventListener('popstate', function () {
    if (location.hash === '#explore') open(null, true);
    else { pushedHash = false; close(); }
  });

  /* ---------- wire triggers --------------------------------------------------- */
  TRIGGERS.forEach(function (t) {
    t.addEventListener('click', function (e) { e.preventDefault(); open(t, false); });
    // warm the cache before the click lands
    t.addEventListener('pointerenter', function () { loadGsap().catch(function () {}); }, { once: true });
    t.addEventListener('focus', function () { loadGsap().catch(function () {}); }, { once: true });
  });
  if (location.hash === '#explore') open(null, true);
})();
