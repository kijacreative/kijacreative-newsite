/* ==========================================================================
   PROOFMAIL TOOLKIT — INTERNAL TOOLS
   Three tools behind one shell:
     1. Prospect finder  — score local businesses on how well mail would work
     2. Area analyzer    — pick carrier routes around a location
     3. Client dashboard — what a campaign client sees

   ALL DATA HERE IS SAMPLE DATA. The businesses are invented, the routes are
   generated from a seeded PRNG, and the campaign numbers are illustrative.
   The live versions read Google Places, USPS EDDM routes, Census ACS
   household data, and the campaign dashboards. Nothing in this file should
   ever be presented to a client as a result.

   Colours are read from proofmail.css at boot (tok()) rather than written
   here, so the sub-brand stays in one file even where SVG needs a literal.
   ========================================================================== */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  /* ---------- tokens ------------------------------------------------------
     SVG fill/stroke attributes and the colour ramp need literal values. Read
     them off the custom properties so proofmail.css stays the one source.
     -------------------------------------------------------------------------- */
  var CS = getComputedStyle(document.documentElement);
  function tok(name) { return CS.getPropertyValue('--pm-' + name).trim(); }
  function rgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  var C = {
    ink: tok('ink'), mint: tok('mint'), magenta: tok('magenta'), yellow: tok('yellow'),
    aqua: tok('aqua'), onInk: tok('on-ink'), dim: tok('dim'), line: tok('ink-3')
  };

  var tt;
  function toast(m) {
    var t = $('#toast');
    t.textContent = m; t.hidden = false;
    clearTimeout(tt);
    tt = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* ---------- tabs -------------------------------------------------------- */
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      ['find', 'area', 'dash'].forEach(function (p) { $('#p-' + p).hidden = p !== b.dataset.p; });
    });
  });

  /* ======================================================================
     1 — PROSPECT FINDER
     ====================================================================== */
  // Sample businesses (invented). web: none | old | ok
  var B = [
    ['Sunrise Bakehouse', 'Restaurant', 'Bishop Arts', 4.7, 38, 'old', 1, 0, 1], ['Cedar & Sage Pilates', 'Fitness', 'Oak Cliff', 4.9, 22, 'ok', 1, 0, 1], ['Trinity Tile Pros', 'Home services', 'Oak Cliff', 4.4, 61, 'none', 0, 0, 1],
    ['Lakeside Paws Grooming', 'Pet', 'Lakewood', 4.6, 140, 'old', 0, 0, 0], ['Greenville Taqueria', 'Restaurant', 'Lower Greenville', 4.5, 412, 'ok', 0, 1, 0], ['Glow Lab Med Spa', 'Med spa', 'Uptown', 4.8, 96, 'ok', 1, 1, 0],
    ['North Star Roofing', 'Home services', 'Richardson', 4.2, 33, 'old', 0, 0, 0], ['Little Climbers Gym', 'Kids activities', 'Plano', 4.8, 57, 'ok', 1, 0, 0], ['Bluebonnet Dental', 'Dental', 'Lakewood', 4.9, 210, 'old', 0, 0, 0],
    ['Deep Ellum Barber Co', 'Personal care', 'Deep Ellum', 4.6, 18, 'none', 0, 0, 0], ['Pecan Street Pizza', 'Restaurant', 'Oak Cliff', 4.3, 74, 'old', 0, 0, 1], ['Iron Ridge Fitness', 'Fitness', 'Richardson', 4.1, 129, 'ok', 0, 1, 0],
    ['Magnolia Floor Studio', 'Home services', 'Plano', 4.7, 29, 'none', 0, 0, 0], ['Tierra Yoga House', 'Fitness', 'Bishop Arts', 4.9, 44, 'old', 0, 0, 1], ['Kettle & Crumb Cafe', 'Restaurant', 'Lakewood', 4.4, 188, 'ok', 1, 1, 0],
    ['Brightside Pediatric Dental', 'Dental', 'Plano', 4.8, 63, 'ok', 1, 0, 0], ['Southside Auto Spa', 'Auto', 'Oak Cliff', 4.0, 12, 'none', 0, 0, 1], ['Willow Lane Boutique', 'Retail', 'Lower Greenville', 4.7, 35, 'old', 0, 0, 0],
    ['Elm Thicket Plumbing', 'Home services', 'Uptown', 4.5, 48, 'old', 0, 0, 0], ['Rosemont Wine Bar', 'Restaurant', 'Bishop Arts', 4.6, 233, 'ok', 0, 0, 1], ['Kick Start Martial Arts', 'Kids activities', 'Lakewood', 4.9, 31, 'none', 0, 0, 0],
    ['Lumen Skin Studio', 'Med spa', 'Plano', 4.6, 27, 'old', 1, 0, 0], ['Harvest Hill Florist', 'Retail', 'Oak Cliff', 4.8, 52, 'old', 0, 0, 1], ['Prairie Pet Clinic', 'Pet', 'Richardson', 4.4, 301, 'ok', 0, 1, 0],
    ['Copper Kettle Diner', 'Restaurant', 'Richardson', 4.2, 96, 'old', 0, 0, 0], ['Steel Horse HVAC', 'Home services', 'Lakewood', 4.3, 41, 'none', 0, 0, 0], ['Barre Society', 'Fitness', 'Uptown', 4.7, 88, 'ok', 1, 1, 0],
    ['Juniper Kids Dental', 'Dental', 'Oak Cliff', 4.6, 24, 'old', 1, 0, 1], ['Paper Moon Books', 'Retail', 'Deep Ellum', 4.9, 66, 'ok', 0, 0, 0], ['Two Rivers BBQ', 'Restaurant', 'Plano', 4.4, 15, 'none', 1, 0, 0]
  ].map(function (r, i) {
    return { id: i, name: r[0], cat: r[1], area: r[2], rating: r[3], reviews: r[4], web: r[5], isNew: !!r[6], multi: !!r[7], mark: !!r[8] };
  });

  // Mail Fit weights. Tune after the first 250-business outreach run.
  var fitCats = { 'Restaurant': 1, 'Fitness': 1, 'Home services': 1, 'Med spa': 1, 'Dental': 1, 'Kids activities': 1 };
  function scoreOf(b) {
    var parts = [['Base', 40]];
    if (b.web === 'none') parts.push(['No website', 20]);
    else if (b.web === 'old') parts.push(['Outdated website', 10]);
    if (b.reviews < 50) parts.push(['Under 50 reviews', 10]);
    if (b.isNew) parts.push(['New or opening soon', 15]);
    if (fitCats[b.cat]) parts.push(['Category responds well to mail', 10]);
    if (b.rating >= 4.5) parts.push(['Strong rating, needs reach', 5]);
    if (b.multi) parts.push(['Multi-location', 5]);
    var s = parts.reduce(function (a, p) { return a + p[1]; }, 0);
    return { s: Math.min(100, s), parts: parts };
  }
  B.forEach(function (b) { var r = scoreOf(b); b.score = r.s; b.parts = r.parts; });

  var cats = Array.from(new Set(B.map(function (b) { return b.cat; }))).sort();
  var areas = Array.from(new Set(B.map(function (b) { return b.area; }))).sort();
  cats.forEach(function (c) { $('#f-cat').insertAdjacentHTML('beforeend', '<option>' + esc(c) + '</option>'); });
  areas.forEach(function (c) { $('#f-area').insertAdjacentHTML('beforeend', '<option>' + esc(c) + '</option>'); });

  var sortKey = 'score', sortDir = -1, selId = 0, outreach = new Set(), shown = [];

  function sigs(b) {
    var h = '';
    if (b.web === 'none') h += '<span class="chip c">No website</span>';
    else if (b.web === 'old') h += '<span class="chip w">Old site</span>';
    if (b.isNew) h += '<span class="chip g">New</span>';
    if (b.reviews < 50) h += '<span class="chip w">Few reviews</span>';
    if (b.multi) h += '<span class="chip">Multi-location</span>';
    return h;
  }
  function sc(s) {
    return '<span class="score ' + (s >= 75 ? 's-hi' : s >= 55 ? 's-mid' : 's-lo') + '">' + s + '</span>';
  }

  function renderFind() {
    var q = $('#f-q').value.trim().toLowerCase(), c = $('#f-cat').value, a = $('#f-area').value, min = +$('#f-min').value;
    $('#f-minv').textContent = min;
    shown = B.filter(function (b) {
      return (!q || (b.name + ' ' + b.cat).toLowerCase().indexOf(q) > -1) &&
        (!c || b.cat === c) && (!a || b.area === a) && b.score >= min &&
        (!$('#f-noweb').checked || b.web !== 'ok') &&
        (!$('#f-new').checked || b.isNew) &&
        (!$('#f-few').checked || b.reviews < 50) &&
        (!$('#f-mark').checked || b.mark);
    });
    shown.sort(function (x, y) {
      var u = x[sortKey], v = y[sortKey];
      return (u > v ? 1 : u < v ? -1 : 0) * sortDir;
    });
    $('#resCount').textContent = shown.length;
    $('#bizTbl tbody').innerHTML = shown.map(function (b) {
      return '<tr class="row' + (b.id === selId ? ' sel' : '') + '" data-id="' + b.id + '" tabindex="0">' +
        '<td><b>' + esc(b.name) + '</b><div class="sub">' + esc(b.cat) +
        (outreach.has(b.id) ? ' · <span style="color:var(--pm-mint)">in list</span>' : '') + '</div></td>' +
        '<td>' + esc(b.area) + '</td><td class="num">' + b.rating.toFixed(1) + '</td>' +
        '<td class="num">' + b.reviews + '</td><td>' + sigs(b) + '</td>' +
        '<td class="num">' + sc(b.score) + '</td></tr>';
    }).join('') || '<tr><td colspan="6" class="sub" style="padding:20px">No businesses match. Lower the minimum fit or clear a filter.</td></tr>';

    $$('#bizTbl tr.row').forEach(function (tr) {
      function go() { selId = +tr.dataset.id; renderFind(); renderDetail(); }
      tr.addEventListener('click', go);
      tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
    $('#outCount').textContent = outreach.size + ' in outreach list';
  }

  function campaignFor(b) {
    if (b.isNew) return 'Launch campaign: opening announcement to homes within 3 miles';
    if (b.cat === 'Dental' || b.cat === 'Med spa') return 'Targeted campaign: homeowners and new movers nearby';
    if (b.reviews < 50) return 'Neighborhood drop with a review drive';
    if (b.cat === 'Restaurant') return 'Neighborhood drop with a first-visit offer';
    return 'Neighborhood drop on the best routes nearby';
  }

  var WEB_LABEL = { none: 'None found', old: 'Outdated, not mobile friendly', ok: 'Current' };

  function renderDetail() {
    var b = B.filter(function (x) { return x.id === selId; })[0];
    if (!b) { $('#detail').innerHTML = '<p class="sub">Select a business.</p>'; return; }
    $('#detail').innerHTML =
      '<p class="eyebrow">' + esc(b.cat) + ' · ' + esc(b.area) + '</p><h2>' + esc(b.name) + '</h2><div>' + sigs(b) + '</div>' +
      '<dl class="kv"><dt>Mail fit</dt><dd>' + sc(b.score) + '</dd>' +
      '<dt>Google</dt><dd>' + b.rating.toFixed(1) + ' stars, ' + b.reviews + ' reviews</dd>' +
      '<dt>Website</dt><dd>' + WEB_LABEL[b.web] + '</dd>' +
      '<dt>Mark route</dt><dd>' + (b.mark ? 'Yes' : 'No') + '</dd></dl>' +
      '<p class="eyebrow">Why this score</p><ul class="why">' +
      b.parts.map(function (p) { return '<li>' + esc(p[0]) + ': +' + p[1] + '</li>'; }).join('') + '</ul>' +
      '<p class="eyebrow">Pitch</p><p style="margin:6px 0 4px;font-size:14px">' + esc(campaignFor(b)) + '</p>' +
      (b.web !== 'ok' ? '<p class="sub">Kija add-on: website plan from $100/mo.</p>' : '') +
      '<div class="actions"><button type="button" class="toolkit-btn mint" id="addOne">' +
      (outreach.has(b.id) ? 'Remove from list' : 'Add to outreach list') +
      '</button><button type="button" class="toolkit-btn" id="audit">Quick audit</button></div><div id="auditBox"></div>';

    $('#addOne').addEventListener('click', function () {
      outreach.has(b.id) ? outreach.delete(b.id) : outreach.add(b.id);
      renderFind(); renderDetail();
      toast(outreach.has(b.id) ? 'Added to outreach list' : 'Removed from list');
    });
    $('#audit').addEventListener('click', function () {
      $('#auditBox').innerHTML = '<div class="audit"><b>Quick audit for ' + esc(b.name) + '</b><ul>' +
        (b.web === 'none'
          ? '<li>No website found. Mail needs a landing page to send people to: we build one with the campaign.</li>'
          : b.web === 'old'
            ? '<li>Website is not mobile friendly. Most QR scans happen on phones.</li>'
            : '<li>Website is current. We add a campaign page that matches the mail piece.</li>') +
        (b.reviews < 50
          ? '<li>' + b.reviews + ' Google reviews. A review drive card would build trust before a bigger drop.</li>'
          : '<li>' + b.reviews + ' reviews at ' + b.rating.toFixed(1) + ' stars. Use them on the card.</li>') +
        '<li>Recommended first step: ' + esc(campaignFor(b)) + '.</li></ul>' +
        '<p class="note">Sample audit. Live version checks the site, Google profile and nearby competitors.</p></div>';
    });
  }

  ['#f-q', '#f-cat', '#f-area', '#f-min', '#f-noweb', '#f-new', '#f-few', '#f-mark'].forEach(function (s) {
    $(s).addEventListener('input', renderFind);
  });
  $$('#bizTbl th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () {
      var k = th.dataset.sort;
      sortDir = (sortKey === k) ? -sortDir : (k === 'name' || k === 'area' ? 1 : -1);
      sortKey = k;
      renderFind();
    });
  });
  $('#addTop').addEventListener('click', function () {
    shown.slice(0, 10).forEach(function (b) { outreach.add(b.id); });
    renderFind(); renderDetail();
    toast('Top ' + Math.min(10, shown.length) + ' added');
  });
  $('#copyCsv').addEventListener('click', function () {
    var rows = B.filter(function (b) { return outreach.has(b.id); });
    if (!rows.length) { toast('Add businesses to the list first'); return; }
    var csv = 'Business,Category,Area,Rating,Reviews,Website,Mail fit,Suggested campaign\n' +
      rows.map(function (b) {
        return ['"' + b.name + '"', b.cat, b.area, b.rating, b.reviews, b.web, b.score, '"' + campaignFor(b) + '"'].join(',');
      }).join('\n');
    try {
      navigator.clipboard.writeText(csv).then(
        function () { toast(rows.length + ' rows copied'); },
        function () { toast('Copy blocked in this view'); }
      );
    } catch (e) { toast('Copy blocked in this view'); }
  });
  renderFind(); renderDetail();

  /* ======================================================================
     2 — AREA ANALYZER
     Hex lattice standing in for carrier routes. Seeded per location so the
     same place always shows the same map.
     ====================================================================== */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  var locSeeds = {
    'Bishop Arts, 75208': [75208, 0.55], 'Lakewood, 75214': [75214, 0.78],
    'Lower Greenville, 75206': [75206, 0.7], 'Plano, 75024': [75024, 0.85]
  };
  // How much each business type cares about owners, kids, home value, distance.
  var weights = {
    family: { own: .35, kids: .35, val: .1, dist: .2 },
    dining: { own: .1, kids: .1, val: .2, dist: .6 },
    home: { own: .55, kids: .05, val: .25, dist: .15 },
    premium: { own: .2, kids: .05, val: .55, dist: .2 }
  };
  var routes = [], selR = new Set();

  function buildRoutes() {
    var loc = $('#a-loc').value, cfg = locSeeds[loc], r = rng(cfg[0]);
    var rad = +$('#a-rad').value, w = weights[$('#a-biz').value];
    routes = [];
    var size = 30, cx = 280, cy = 225, rings = Math.min(5, rad + 1), zip = String(cfg[0]), n = 0;
    for (var q = -rings; q <= rings; q++) {
      for (var s = -rings; s <= rings; s++) {
        var t = -q - s;
        if (Math.max(Math.abs(q), Math.abs(s), Math.abs(t)) > rings) continue;
        var x = cx + size * 1.5 * q, y = cy + size * Math.sqrt(3) * (s + q / 2);
        var dist = Math.max(Math.abs(q), Math.abs(s), Math.abs(t));
        var own = Math.min(.95, Math.max(.2, cfg[1] - .15 + r() * .35));
        var kids = .15 + r() * .3;
        var val = Math.round((180 + cfg[1] * 420 + r() * 260) / 5) * 5;
        var hh = Math.round(280 + r() * 420);
        var vn = Math.min(1, (val - 150) / 600), dn = 1 - dist / (rings + .5);
        var fit = Math.round(100 * (w.own * own + w.kids * (kids / .45) + w.val * vn + w.dist * dn));
        fit = Math.max(8, Math.min(98, fit));
        n++;
        routes.push({ id: zip + '-C' + String(n).padStart(3, '0'), x: x, y: y, hh: hh, val: val, own: own, fit: fit, dist: dist, size: size });
      }
    }
    selR = new Set();
  }

  // The legend ramp in CSS and this function must agree: same four stops.
  var RAMP = [[0, rgb(tok('ink-3'))], [.4, rgb(tok('magenta-ink'))], [.7, rgb(tok('magenta'))], [1, rgb(tok('yellow'))]];
  function col(f) {
    var t = f / 100;
    for (var i = 1; i < RAMP.length; i++) {
      if (t <= RAMP[i][0]) {
        var a = RAMP[i - 1], b = RAMP[i], k = (t - a[0]) / (b[0] - a[0]);
        return 'rgb(' + a[1].map(function (v, j) { return Math.round(v + (b[1][j] - v) * k); }).join(',') + ')';
      }
    }
    return 'rgb(' + RAMP[RAMP.length - 1][1].join(',') + ')';
  }
  function hexPts(x, y, s) {
    var p = [];
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 180 * 60 * i;
      p.push((x + s * .96 * Math.cos(a)).toFixed(1) + ',' + (y + s * .96 * Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  }

  function renderArea() {
    $('#a-radv').textContent = $('#a-rad').value;
    var svg = '';
    routes.forEach(function (r) {
      var on = selR.has(r.id);
      svg += '<polygon class="hex" data-id="' + r.id + '" points="' + hexPts(r.x, r.y, r.size) +
        '" fill="' + col(r.fit) + '" stroke="' + (on ? C.mint : C.ink) + '" stroke-width="' + (on ? 3 : 1.5) +
        '"><title>' + r.id + ': ' + r.hh + ' homes, fit ' + r.fit + '</title></polygon>';
    });
    svg += '<circle cx="280" cy="225" r="9" fill="' + C.aqua + '" stroke="' + C.ink + '" stroke-width="3"/>' +
      '<text x="280" y="203" text-anchor="middle" font-size="12" font-weight="700" fill="' + C.onInk + '">Your business</text>';
    $('#map').innerHTML = svg;

    $$('#map .hex').forEach(function (h) {
      h.addEventListener('click', function () {
        var id = h.dataset.id;
        selR.has(id) ? selR.delete(id) : selR.add(id);
        renderArea();
      });
    });

    var sel = routes.filter(function (r) { return selR.has(r.id); });
    var hh = sel.reduce(function (a, r) { return a + r.hh; }, 0);
    $('#tRoutes').textContent = sel.length;
    $('#tHH').textContent = fmt(hh);
    $('#tPost').textContent = '$' + fmt(hh * .26);
    $('#tFit').textContent = sel.length ? Math.round(sel.reduce(function (a, r) { return a + r.fit; }, 0) / sel.length) : 0;

    var list = routes.slice().sort(function (a, b) { return b.fit - a.fit; });
    $('#routeTbl tbody').innerHTML = list.map(function (r) {
      return '<tr class="row' + (selR.has(r.id) ? ' sel' : '') + '" data-id="' + r.id + '">' +
        '<td><span style="font-family:var(--pm-mono);font-size:12px">' + r.id + '</span></td>' +
        '<td class="num">' + r.hh + '</td><td class="num">$' + r.val + 'k</td>' +
        '<td class="num">' + Math.round(r.own * 100) + '%</td><td class="num">' + sc(r.fit) + '</td></tr>';
    }).join('');
    $$('#routeTbl tr.row').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var id = tr.dataset.id;
        selR.has(id) ? selR.delete(id) : selR.add(id);
        renderArea();
      });
    });
  }

  function best() {
    selR = new Set();
    var tot = 0;
    routes.slice().sort(function (a, b) { return b.fit - a.fit; }).forEach(function (r) {
      if (tot + r.hh <= 5000) { selR.add(r.id); tot += r.hh; }
    });
    renderArea();
  }
  ['#a-biz', '#a-loc', '#a-rad'].forEach(function (s) {
    $(s).addEventListener('input', function () { buildRoutes(); best(); });
  });
  $('#bestRoutes').addEventListener('click', best);
  $('#clearRoutes').addEventListener('click', function () { selR = new Set(); renderArea(); });
  $('#toPlan').addEventListener('click', function () {
    if (!selR.size) { toast('Select routes first'); return; }
    toast('Mail plan drafted: ' + selR.size + ' routes, ' + $('#tHH').textContent + ' homes');
  });
  buildRoutes(); best();

  /* ======================================================================
     3 — CLIENT DASHBOARD
     ====================================================================== */
  var D = {
    open: {
      title: 'Sunrise Bakehouse · Grand opening', spend: 3680,
      funnel: [['Mailed', 5000], ['Delivered', 4812], ['Scanned', 318], ['Left details', 97], ['Booked or visited', 41]],
      seed: 7, peak: 3,
      vers: [['A · New neighbors', 'Free pastry with coffee', 2500, 171, 52, 22], ['B · Families nearby', 'Kids eat free Saturday', 1500, 96, 31, 13], ['C · Offices', 'Team breakfast 15% off', 1000, 51, 14, 6]],
      drops: [['Drop 1 · 5,000 postcards', 'Delivered Nov 3 to Nov 5', 'st-done', 'Delivered'], ['Drop 2 · Reminder', 'Mails Nov 26', 'st-sched', 'Scheduled'], ['Drop 3 · Last week offer', 'Mails Dec 10', 'st-sched', 'Scheduled']]
    },
    rev: {
      title: 'Sunrise Bakehouse · Review drive', spend: 1140,
      funnel: [['Mailed', 1200], ['Delivered', 1176], ['Scanned', 204], ['Left a review', 88], ['5-star reviews', 79]],
      seed: 19, peak: 2,
      vers: [['A · Regulars', 'Thanks for 2026', 700, 131, 58, 52], ['B · Lapsed 90 days', 'We saved your seat', 500, 73, 30, 27]],
      drops: [['Drop 1 · 1,200 cards', 'In transit, arriving Nov 25', 'st-transit', 'In transit']]
    }
  };
  var names = ['Maria G.', 'Devon P.', 'Alicia R.', 'Sam T.', 'Priya K.', 'Jordan M.', 'Luis A.', 'Hannah W.'];

  function renderDash() {
    var d = D[$('#dSel').value];
    $('#dTitle').textContent = d.title;
    var f = d.funnel, cpl = d.spend / f[3][1];

    var k = [
      ['Mailed', fmt(f[0][1]), 'pieces'],
      ['Delivered', fmt(f[1][1]), Math.round(f[1][1] / f[0][1] * 100) + '% of mailed'],
      ['QR scans', fmt(f[2][1]), (f[2][1] / f[1][1] * 100).toFixed(1) + '% of delivered'],
      [f[3][0], fmt(f[3][1]), Math.round(f[3][1] / f[2][1] * 100) + '% of scans'],
      [f[4][0], fmt(f[4][1]), Math.round(f[4][1] / f[3][1] * 100) + '% of leads'],
      ['Cost per lead', '$' + cpl.toFixed(0), '$' + fmt(d.spend) + ' all-in']
    ];
    $('#kpis').innerHTML = k.map(function (x, i) {
      return '<div class="kpi"><small>' + esc(x[0]) + '</small><b' +
        (i === 5 ? ' style="color:var(--pm-mint)"' : '') + '>' + x[1] + '</b><div class="d">' + esc(x[2]) + '</div></div>';
    }).join('');

    $('#funnel').innerHTML = f.map(function (r, i) {
      var w = Math.max(1.2, r[1] / f[0][1] * 100);
      var pct = i ? Math.round(r[1] / f[i - 1][1] * 100) + '%' : '';
      return '<div class="fbar"><span>' + esc(r[0]) + '</span><div class="track"><div class="fill" style="width:' + w + '%"></div></div>' +
        '<span class="num">' + fmt(r[1]) + '</span><span class="num" style="color:var(--pm-dim)">' + pct + '</span></div>';
    }).join('') + '<p class="note">Right column: share that carried on from the step above.</p>';

    // Scans spread over 21 days with a peak a few days after delivery.
    var r = rng(d.seed), days = 21, raw = [];
    for (var i = 0; i < days; i++) {
      raw.push(Math.exp(-Math.pow(i - d.peak, 2) / (2 * Math.pow(3.2, 2))) * (0.75 + r() * .5) + 0.06);
    }
    var sum = raw.reduce(function (a, b) { return a + b; }, 0);
    var vals = raw.map(function (v) { return Math.round(v / sum * f[2][1]); });
    var max = Math.max.apply(null, vals);
    var W = 640, H = 220, L = 36, R = 12, T = 14, Bm = 30;
    var cw = (W - L - R) / (days - 1), yMax = Math.ceil(max / 20) * 20 || 20;
    function X(i) { return L + i * cw; }
    function Y(v) { return T + (H - T - Bm) * (1 - v / yMax); }

    var g = '';
    for (var t = 0; t <= 4; t++) {
      var v = yMax * t / 4;
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + C.line + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="11" fill="' + C.dim + '">' + Math.round(v) + '</text>';
    }
    var path = vals.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
    var area = path + ' L' + X(days - 1) + ' ' + Y(0) + ' L' + X(0) + ' ' + Y(0) + 'Z';
    var mi = vals.indexOf(max);
    var lab = '';
    [0, 7, 14, 20].forEach(function (i) {
      lab += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="' + (i === 20 ? 'end' : i === 0 ? 'start' : 'middle') +
        '" font-size="11" fill="' + C.dim + '">Day ' + (i + 1) + '</text>';
    });
    $('#trend').innerHTML =
      '<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + C.magenta + '" stop-opacity=".35"/>' +
      '<stop offset="1" stop-color="' + C.magenta + '" stop-opacity="0"/></linearGradient></defs>' + g +
      '<path d="' + area + '" fill="url(#ag)"/>' +
      '<path d="' + path + '" fill="none" stroke="' + C.magenta + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="' + X(mi) + '" cy="' + Y(max) + '" r="5" fill="' + C.yellow + '"/>' +
      '<text x="' + (X(mi) + 10) + '" y="' + (Y(max) + 4) + '" font-size="12" font-weight="700" fill="' + C.onInk + '">Peak: ' + max + ' scans</text>' + lab;

    $('#verTbl').innerHTML =
      '<thead><tr><th>Version</th><th class="num">Mailed</th><th class="num">Scans</th><th class="num">Leads</th><th class="num">Booked</th><th class="num">Scan rate</th></tr></thead><tbody>' +
      d.vers.map(function (v) {
        var rate = v[3] / v[2] * 100;
        var bestv = d.vers.every(function (o) { return v[3] / v[2] >= o[3] / o[2]; });
        return '<tr><td><b>' + esc(v[0]) + '</b><div class="sub">' + esc(v[1]) + '</div></td>' +
          '<td class="num">' + fmt(v[2]) + '</td><td class="num">' + v[3] + '</td>' +
          '<td class="num">' + v[4] + '</td><td class="num">' + v[5] + '</td>' +
          '<td class="num">' + (bestv ? '<span class="score s-hi">' + rate.toFixed(1) + '%</span>' : rate.toFixed(1) + '%') + '</td></tr>';
      }).join('') + '</tbody>';

    var lr = rng(d.seed + 3);
    $('#leadTbl').innerHTML =
      '<thead><tr><th>Name</th><th>Version</th><th>Status</th><th class="num">When</th></tr></thead><tbody>' +
      names.slice(0, 6).map(function (n, i) {
        var v = d.vers[Math.floor(lr() * d.vers.length)][0].split(' · ')[0];
        var st = lr() > .45 ? ['g', 'Booked'] : ['w', 'New'];
        return '<tr><td>' + n + '</td><td>' + v + '</td><td><span class="chip ' + st[0] + '">' + st[1] + '</span></td>' +
          '<td class="num">' + (i === 0 ? '12 min ago' : (i * 3 + 1) + ' hr ago') + '</td></tr>';
      }).join('') + '</tbody>';

    $('#drops').innerHTML = d.drops.map(function (x) {
      var c = x[2] === 'st-done' ? 'var(--pm-mint)' : x[2] === 'st-transit' ? 'var(--pm-aqua)' : 'var(--pm-dim)';
      return '<div class="drop"><span class="dot" style="background:' + c + '"></span>' +
        '<div><b>' + esc(x[0]) + '</b><div class="sub">' + esc(x[1]) + '</div></div>' +
        '<span class="status ' + x[2] + '">' + x[3] + '</span></div>';
    }).join('');
  }
  $('#dSel').addEventListener('input', renderDash);

  var orders = [];
  $$('[data-order]').forEach(function (b) {
    b.addEventListener('click', function () {
      orders.push(b.dataset.order);
      $('#orderLog').textContent = 'Requested: ' + orders.join(', ') +
        '. Your Kija strategist will confirm within one business day.';
      toast(b.dataset.order + ' requested');
    });
  });
  renderDash();
})();
