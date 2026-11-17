/* ==========================================================================
   CASE KIT — makes the case-page modules playable.
   The HTML already shows everything (every tab, every stage, a worked
   example); this marks each module .is-live and wires its control. Plain JS.
   ========================================================================== */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var track = function (name, props) { if (window.kijaTrack) window.kijaTrack(name, props); };

  /* tabs: studios, brand voices */
  $$('[data-ck="tabs"]').forEach(function (root) {
    var tabs = $$('[data-ck-tab]', root), panels = $$('[data-ck-panel]', root);
    var show = function (i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; if (k === i && focus) t.focus(); });
      panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); track('case_module', { module: 'tabs', item: t.textContent.trim() }); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show((i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length, true); }
      });
    });
    root.classList.add('is-live'); show(0);
  });

  /* growth: one studio to three */
  $$('[data-ck="growth"]').forEach(function (root) {
    var stops = JSON.parse(root.getAttribute('data-stops')), input = root.querySelector('[data-ck-in]');
    var out = function (k) { return root.querySelector('[data-ck-out="' + k + '"]'); };
    var paint = function () {
      var s = stops[+input.value];
      out('k').textContent = s.k; out('studios').textContent = s.studios; out('note').textContent = s.note;
      out('stat').innerHTML = s.stat ? '<b>' + esc(s.stat) + '</b> ' + esc(s.statL) : '';
      out('stat2').innerHTML = s.stat2 ? '<b>' + esc(s.stat2) + '</b> ' + esc(s.stat2L) : '';
      $$('i', out('dots')).forEach(function (d, i) { d.classList.toggle('is-on', i < s.studios); });
    };
    input.value = 0; input.addEventListener('input', paint); input.addEventListener('change', function () { track('case_module', { module: 'growth', stop: stops[+input.value].k }); });
    root.classList.add('is-live'); paint();
  });

  /* calc: operator math (illustrative) */
  $$('[data-ck="calc"]').forEach(function (root) {
    var cfg = JSON.parse(root.getAttribute('data-cfg')), input = root.querySelector('[data-ck-in]');
    var out = function (k) { return root.querySelector('[data-ck-out="' + k + '"]'); };
    var paint = function () {
      var n = +input.value, b = n * cfg.before.util * cfg.before.rate, a = n * cfg.after.util * cfg.after.rate;
      out('n').textContent = n.toLocaleString('en-US'); out('before').textContent = money(b); out('after').textContent = money(a);
      out('delta').textContent = '+' + money(a - b); out('year').textContent = money((a - b) * 12) + ' a year';
    };
    input.addEventListener('input', paint); input.addEventListener('change', function () { track('case_module', { module: 'calc', value: input.value }); });
    root.classList.add('is-live'); paint();
  });

  /* impact: every $150 funds a screening */
  $$('[data-ck="impact"]').forEach(function (root) {
    var cfg = JSON.parse(root.getAttribute('data-cfg')), input = root.querySelector('[data-ck-in]');
    var out = function (k) { return root.querySelector('[data-ck-out="' + k + '"]'); };
    var paint = function () {
      var gift = +input.value, n = Math.floor(gift / cfg.per), left = n;
      out('gift').textContent = money(gift); out('n').textContent = n.toLocaleString('en-US');
      out('dots').innerHTML = new Array(Math.min(n, 100) + 1).join('<i></i>');
      out('split').innerHTML = cfg.split.map(function (p, i) {
        var k = i === cfg.split.length - 1 ? left : Math.round(n * p[1]); left -= k;
        return '<li><b>' + k + '</b> ' + esc(p[0]) + '</li>';
      }).join('');
    };
    input.addEventListener('input', paint); input.addEventListener('change', function () { track('case_module', { module: 'impact', value: input.value }); });
    root.classList.add('is-live'); paint();
  });

  /* process: sketch → rendering → shop floor, cross-faded as you scrub */
  $$('[data-ck="process"]').forEach(function (root) {
    var input = root.querySelector('[data-ck-in]'), layers = $$('[data-ck-layer]', root), panels = $$('[data-ck-panel]', root);
    var paint = function () {
      var v = +input.value, i = Math.round(v);
      layers.forEach(function (l, k) { l.style.opacity = Math.max(0, 1 - Math.abs(v - k)).toFixed(3); });
      panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
    };
    input.addEventListener('input', paint);
    input.addEventListener('change', function () { input.value = Math.round(+input.value); paint(); track('case_module', { module: 'process', stage: input.value }); });
    root.classList.add('is-live'); paint();
  });

  /* bilingual: the wordmark in both languages */
  $$('[data-ck="bilingual"]').forEach(function (root) {
    var btns = $$('[data-ck-lang]', root);
    var set = function (lang) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ck-lang') === lang)); });
      $$('[data-ck-word]', root).forEach(function (w) { w.classList.toggle('is-on', w.getAttribute('data-ck-word') === lang); });
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-ck-lang')); track('case_module', { module: 'bilingual', lang: b.getAttribute('data-ck-lang') }); }); });
    root.classList.add('is-live'); set('en');
  });
  /* studio grid: filter by discipline */
  $$('[data-st-filters]').forEach(function (bar) {
    var grid = document.querySelector('[data-st-grid]'); if (!grid) return;
    var btns = $$('[data-st]', bar), cards = $$('.st-card', grid);
    bar.hidden = false;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-st');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        cards.forEach(function (c) { c.hidden = k !== 'all' && (' ' + c.getAttribute('data-disc') + ' ').indexOf(' ' + k + ' ') < 0; });
        track('studio_filter', { discipline: k });
      });
    });
    cards.forEach(function (c) { c.addEventListener('toggle', function () { if (c.open) track('studio_open', { project: c.querySelector('b').textContent }); }); });
  });
})();
