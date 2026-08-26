/* ==========================================================================
   BRAND SIGNAL TEST — /the-kija-method
   Self-contained widget. Mounts into <div data-kija-widget="signal-test">.
   Variants: b1 (score free, email for the written diagnosis)  ← default
             b2 (email gate before any result)
             b3 (6 questions, ungated, no email)
   ========================================================================== */
(function () {
  'use strict';
  var K = window.KIJA;

  /* --- question set ------------------------------------------------------
     Four pillars x 3 questions. Each answer carries a 0-4 weight.
     b3 uses one question per pillar plus two cross-cutting ones.
     ---------------------------------------------------------------------- */
  var PILLARS = {
    positioning: { name: 'Positioning', fix: 'You can describe what you do. You cannot describe why it matters. That gap is where deals stall in comparison.' },
    identity:    { name: 'Identity',    fix: 'You have assets, not a system. Every new piece becomes a fresh argument instead of an application of a rule.' },
    digital:     { name: 'Digital presence', fix: 'Your site documents you. It does not filter, and it does not sell while you sleep.' },
    system:      { name: 'System clarity',   fix: 'Leads arrive and nothing happens automatically. Follow-up depends on somebody remembering.' }
  };

  var Q = [
    { p:'positioning', short:1, q:'If we asked five people on your team why a client should choose you, how close would the answers be?',
      a:[['Five different answers',0],['Same theme, different words',2],['Broadly aligned',3],['Word for word',4]] },
    { p:'positioning', q:'Can you name the specific type of buyer you are the obvious choice for?',
      a:[['Not really, we take what comes',0],['A rough sense of it',1],['Yes, and we say no sometimes',3],['Yes, and we turn down bad fits routinely',4]] },
    { p:'positioning', q:'When you lose a deal, do you know why?',
      a:[['We usually guess',0],['Sometimes, anecdotally',1],['Most of the time',3],['We track it and it informs messaging',4]] },

    { p:'identity', short:1, q:'Does your brand have written rules, not just files?',
      a:[['A logo and some colors',0],['A basic style sheet',1],['A guidelines document',3],['A living system others can build in',4]] },
    { p:'identity', q:'If two people made a piece of collateral this week, would they look related?',
      a:[['Definitely not',0],['Vaguely',1],['Mostly',3],['Yes, predictably',4]] },
    { p:'identity', q:'How often does a project stall on "what should this look like?"',
      a:[['Every time',0],['Frequently',1],['Occasionally',3],['Almost never',4]] },

    { p:'digital', short:1, q:'What does your website actually do for the business?',
      a:[['It exists so we look real',0],['It informs people who already found us',1],['It generates some inbound',3],['It qualifies and books, measurably',4]] },
    { p:'digital', q:'Do you know your conversion rate from visit to enquiry?',
      a:[['No',0],['Roughly',2],['Yes, tracked monthly',3],['Yes, and we test against it',4]] },
    { p:'digital', q:'How fast can you publish a landing page for a new offer?',
      a:[['Months, or we do not',0],['Weeks, with outside help',1],['Days',3],['Same day',4]] },

    { p:'system', short:1, q:'What happens in the first sixty seconds after someone fills in a form?',
      a:[['Honestly, not sure',0],['Someone gets an email eventually',1],['Auto-reply, then manual follow-up',3],['Instant, specific, automated, then a sequence',4]] },
    { p:'system', q:'Where do leads live?',
      a:[['Inboxes and memory',0],['A spreadsheet',1],['A CRM we half-use',2],['A CRM with stages that reflect reality',4]] },
    { p:'system', q:'If your best salesperson left tomorrow, how much of the process leaves with them?',
      a:[['All of it',0],['Most of it',1],['Some of it',3],['Very little, it is documented and automated',4]] }
  ];

  /* --- scoring ----------------------------------------------------------- */
  function scoreOf(answers, questions) {
    var got = {}, max = {};
    Object.keys(PILLARS).forEach(function (p) { got[p] = 0; max[p] = 0; });
    questions.forEach(function (q, i) {
      var m = Math.max.apply(null, q.a.map(function (x) { return x[1]; }));
      max[q.p] += m;
      got[q.p] += (answers[i] == null ? 0 : q.a[answers[i]][1]);
    });
    var pillars = Object.keys(PILLARS).filter(function (p) { return max[p] > 0; }).map(function (p) {
      return { key: p, name: PILLARS[p].name, fix: PILLARS[p].fix, pct: Math.round((got[p] / max[p]) * 100) };
    });
    var total = pillars.reduce(function (s, x) { return s + x.pct; }, 0);
    return {
      score: Math.round(total / pillars.length),
      pillars: pillars,
      weakest: pillars.slice().sort(function (a, b) { return a.pct - b.pct; }).slice(0, 3)
    };
  }

  function band(score) {
    if (score >= 80) return { label: 'Strong signal', copy: 'Your brand is doing its job. The upside now is in optimisation and reach, not reconstruction, which is a very different engagement.' };
    if (score >= 60) return { label: 'Mixed signal', copy: 'The foundations hold, but the system leaks in specific places. Fixing the weakest area first usually moves the number more than a redesign would.' };
    if (score >= 35) return { label: 'Weak signal', copy: 'You are being evaluated on assets rather than a position. That costs you deals you never hear about.' };
    return { label: 'No signal', copy: 'Right now the market is filling in your meaning for you. That is the most expensive item on this list.' };
  }

  /* --- helpers ----------------------------------------------------------- */
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }

  function mount(root) {
    var variant = (K && K.currentVariant && K.currentVariant()) || 'b1';
    if (['b1','b2','b3'].indexOf(variant) === -1) variant = 'b1';

    var questions = variant === 'b3' ? Q.filter(function (q) { return q.short; }).concat([Q[4], Q[10]]) : Q;
    var answers = new Array(questions.length).fill(null);
    var idx = 0;

    function paint(node) { root.innerHTML = ''; root.appendChild(node); }

    /* ---- question step ---- */
    function step() {
      var q = questions[idx];
      var pct = Math.round((idx / questions.length) * 100);
      var node = el(
        '<div class="k-widget__step">' +
          '<div class="k-prog" aria-hidden="true"><div class="k-prog__bar" style="width:' + pct + '%"></div></div>' +
          '<p class="k-label k-label--dim" style="margin-top:18px">' + esc(PILLARS[q.p].name) + '</p>' +
          '<h3 class="k-h3-lg" style="margin-top:10px;max-width:24ch">' + esc(q.q) + '</h3>' +
          '<div class="k-choices" role="radiogroup" aria-label="' + esc(q.q) + '" style="margin-top:26px">' +
            q.a.map(function (opt, i) {
              return '<label class="k-choice">' +
                '<input type="radio" name="q' + idx + '" value="' + i + '"' + (answers[idx] === i ? ' checked' : '') + '>' +
                '<span class="k-choice__box" aria-hidden="true"></span>' +
                '<span class="k-choice__t">' + esc(opt[0]) + '</span></label>';
            }).join('') +
          '</div>' +
          '<div class="k-widget__nav">' +
            '<button class="k-btn k-btn--ghost k-btn--sm" data-back' + (idx === 0 ? ' aria-disabled="true"' : '') + '>Back</button>' +
            '<span class="k-widget__count">Question ' + (idx + 1) + ' / ' + questions.length + '</span>' +
            '<button class="k-btn k-btn--primary" data-next aria-disabled="' + (answers[idx] === null) + '">' +
              (idx === questions.length - 1 ? 'See my signal' : 'Next') + ' <span class="k-btn__arrow">&rarr;</span></button>' +
          '</div>' +
        '</div>');

      node.addEventListener('change', function (e) {
        if (e.target.name !== 'q' + idx) return;
        answers[idx] = parseInt(e.target.value, 10);
        node.querySelector('[data-next]').setAttribute('aria-disabled', 'false');
      });
      node.querySelector('[data-next]').addEventListener('click', function () {
        if (answers[idx] === null) return;
        K && K.track('signal_test_answer', { question_index: idx + 1, pillar: q.p });
        if (idx === questions.length - 1) return finish();
        idx++; step();
      });
      node.querySelector('[data-back]').addEventListener('click', function () {
        if (idx === 0) return; idx--; step();
      });
      paint(node);
    }

    /* ---- email gate (b2, before results) ---- */
    function gate(onDone) {
      var node = el(
        '<div class="k-widget__step">' +
          '<p class="k-label">Your results are ready</p>' +
          '<h3 class="k-h3-lg" style="margin-top:10px;max-width:20ch">Where should we send the full breakdown?</h3>' +
          '<p class="k-dim k-sm" style="margin-top:12px;max-width:52ch">Your score plus a written diagnosis of every weak area. One click to leave the list, always.</p>' +
          '<form novalidate style="margin-top:26px">' +
            '<div class="k-field"><label class="k-field__l" for="st-name">First name</label>' +
              '<input class="k-input" id="st-name" name="first_name" autocomplete="given-name" required>' +
              '<span class="k-field__err">We need something to call you.</span></div>' +
            '<div class="k-field"><label class="k-field__l" for="st-email">Work email</label>' +
              '<input class="k-input" id="st-email" name="email" type="email" autocomplete="email" required>' +
              '<span class="k-field__err">That address does not look right.</span></div>' +
            '<div class="k-field"><label class="k-field__l" for="st-co">Company</label>' +
              '<input class="k-input" id="st-co" name="company" autocomplete="organization"></div>' +
            '<div class="k-hp"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
            '<button class="k-btn k-btn--primary k-btn--lg" style="margin-top:22px;width:100%" type="submit">' +
              'Show my signal <span class="k-btn__arrow">&rarr;</span></button>' +
          '</form>' +
        '</div>');
      bindForm(node.querySelector('form'), onDone);
      paint(node);
    }

    /* ---- results ---- */
    function results(lead) {
      var r = scoreOf(answers, questions);
      var b = band(r.score);
      var C = 2 * Math.PI * 54;
      var gated = (variant === 'b1' && !lead);

      var node = el(
        '<div class="k-widget__step">' +
          '<p class="k-label">Your brand signal</p>' +
          '<div class="k-dial" style="margin-top:18px">' +
            '<svg class="k-dial__svg" width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Signal score ' + r.score + ' out of 100">' +
              '<circle class="k-dial__track" cx="70" cy="70" r="54"></circle>' +
              '<circle class="k-dial__val" cx="70" cy="70" r="54" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"></circle>' +
              '<text class="k-dial__num" x="70" y="82" text-anchor="middle">' + r.score + '</text>' +
            '</svg>' +
            '<div style="flex:1;min-width:220px">' +
              '<h3 class="k-h3-lg">' + esc(b.label) + '</h3>' +
              '<p class="k-dim k-sm" style="margin-top:10px;max-width:44ch">' + esc(b.copy) + '</p>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:32px">' +
            r.pillars.map(function (p) {
              var cls = p.pct < 40 ? ' k-bar--weak' : (p.pct < 70 ? ' k-bar--mid' : '');
              return '<div class="k-bar' + cls + '"><div class="k-bar__top"><span>' + esc(p.name) + '</span><span>' + p.pct + '%</span></div>' +
                '<div class="k-bar__track"><div class="k-bar__fill" data-pct="' + p.pct + '"></div></div></div>';
            }).join('') +
          '</div>' +
          (gated
            ? '<div class="k-callout" style="margin-top:30px">' +
                '<h4 class="k-label--yellow">The three fixes, in order</h4>' +
                '<p class="k-sm" style="margin-top:10px">We wrote a specific diagnosis for each weak area. Tell us where to send it. Nothing else required.</p>' +
                '<form novalidate style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">' +
                  '<div class="k-field" style="flex:1;min-width:210px"><label class="k-field__l" for="st-email2">Work email</label>' +
                    '<input class="k-input" id="st-email2" name="email" type="email" required>' +
                    '<span class="k-field__err">That address does not look right.</span></div>' +
                  '<div class="k-hp"><label>Leave empty<input name="website" tabindex="-1"></label></div>' +
                  '<button class="k-btn k-btn--primary" type="submit">Send it</button>' +
                '</form></div>'
            : '<div style="margin-top:30px"><h4>Your three weakest areas</h4>' +
                '<ol class="k-list k-list--num" style="margin-top:14px">' +
                  r.weakest.map(function (p) {
                    return '<li><b style="color:var(--k-cream)">' + esc(p.name) + ' &mdash; ' + p.pct + '%</b><br>' + esc(p.fix) + '</li>';
                  }).join('') +
                '</ol></div>') +
          '<div class="k-btns" style="margin-top:32px">' +
            '<a class="k-btn k-btn--primary k-btn--lg" href="/book" data-track="cta_book_from_signal_test">' +
              'Walk me through it on a call <span class="k-btn__arrow">&rarr;</span></a>' +
            '<a class="k-btn k-btn--ghost k-btn--lg" href="/work" data-track="cta_work_from_signal_test">See what fixing it looks like</a>' +
          '</div>' +
        '</div>');

      paint(node);
      requestAnimationFrame(function () {
        var dial = node.querySelector('.k-dial__val');
        if (dial) dial.style.strokeDashoffset = String(C - (C * r.score) / 100);
        Array.prototype.forEach.call(node.querySelectorAll('.k-bar__fill'), function (f) {
          f.style.width = f.getAttribute('data-pct') + '%';
        });
      });

      var f = node.querySelector('form');
      if (f) bindForm(f, function (lead2) { send(lead2, r); results(lead2); });

      K && K.track('signal_test_completed', { score: r.score, band: b.label, gated: gated });
    }

    /* ---- shared form handling ---- */
    function bindForm(form, onDone) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name=website]');
        if (hp && hp.value) return;                       // honeypot
        var data = {}, valid = true;
        Array.prototype.forEach.call(form.elements, function (input) {
          if (!input.name || input.type === 'submit' || input.name === 'website') return;
          var field = input.closest('.k-field');
          var bad = input.required && (!input.value.trim() ||
                    (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)));
          if (field) field.setAttribute('data-invalid', String(!!bad));
          if (bad) valid = false;
          data[input.name] = input.value.trim();
        });
        if (!valid) return;
        var btn = form.querySelector('[type=submit]');
        btn.setAttribute('aria-disabled', 'true');
        btn.textContent = 'Sending...';
        onDone(data);
      });
    }

    /* ---- submission ---- */
    function send(lead, r) {
      var payload = Object.assign({}, lead, {
        capture_path: 'brand_signal_test',
        signal_score: r.score,
        signal_band: band(r.score).label,
        weak_areas: r.weakest.map(function (p) { return p.name; }).join(', '),
        pillar_scores: r.pillars.map(function (p) { return p.name + ':' + p.pct; }).join('|'),
        tags: ['source:signal-test', 'variant:' + variant, 'band:' + band(r.score).label.toLowerCase().replace(/\s+/g, '-')]
      });
      try { sessionStorage.setItem('kija_last_result', JSON.stringify(payload)); } catch (e) {}
      if (K) K.submitLead(payload).catch(function () {});
    }

    function finish() {
      if (variant === 'b2') return gate(function (lead) { send(lead, scoreOf(answers, questions)); results(lead); });
      results(null);   // b1 shows the score and gates the write-up; b3 is fully open
    }

    K && K.track('signal_test_started', { question_count: questions.length, variant_id: variant });
    step();
  }

  function init() {
    var root = document.querySelector('[data-kija-widget="signal-test"]');
    if (root) mount(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
