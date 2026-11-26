/* ==========================================================================
   PROOFMAIL — CLIENT SITE BEHAVIOUR
   Variable-data demo, funnel bars, the five-question quiz, and the two
   capture paths (free mail plan, quote or call).

   Leads go through KIJA.submitLead from /assets/global.js, so ProofMail
   shares the site's attribution cookies, event names and /api/lead endpoint
   rather than running a second, divergent capture stack. If global.js is
   missing the forms still validate and confirm; the submission is logged.

   Booking is Calendly and only Calendly (CLAUDE.md, "Booking"). The call
   path captures the lead, then hands the visitor the calendar link.
   ========================================================================== */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function track(ev, props) { try { if (window.KIJA) KIJA.track(ev, props); } catch (e) {} }

  var CALENDLY = (window.KIJA_LINKS && window.KIJA_LINKS.consultation) ||
                 'https://calendly.com/kiel-kijacreative/free-consultation';

  /* Posts through the shared endpoint. Always resolves: the visitor has
     already done their part, and our plumbing is not their problem. The
     boolean says whether it landed, so the confirmation can add a fallback
     address when it did not. */
  function send(payload) {
    track('lead_submitted_proofmail', { capture_path: payload.capture_path });
    if (!window.KIJA || !KIJA.submitLead) {
      console.warn('[proofmail] global.js absent — lead not sent', payload);
      return Promise.resolve(false);
    }
    return KIJA.submitLead(payload).then(function (r) { return !!(r && r.ok !== false); })
      .catch(function () { return false; });
  }

  /* One validation rule for both forms: required fields filled, email shaped
     like an email. Marks the field so the CSS can flag it. */
  function invalidFields(form) {
    return $$('[required]', form).filter(function (i) {
      var bad = !i.value.trim() || (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value));
      i.setAttribute('data-invalid', String(bad));
      return bad;
    });
  }

  function busy(btn, on, label) {
    if (!btn) return;
    btn.setAttribute('aria-disabled', String(on));
    btn.textContent = on ? 'Sending…' : label;
  }

  var FALLBACK = ' If you do not hear from us within one business day, email ' +
                 '<a href="mailto:kiel@kijacreative.com">kiel@kijacreative.com</a>.';

  /* ---------- variable data demo ---------------------------------------- */
  var versions = [
    { eye: 'Welcome to the neighborhood', head: 'Your first class is on us', offer: 'Free intro class, this month only', sw: 'var(--pm-magenta)', url: 'scan.proofmail.co/hello' },
    { eye: 'We miss you', head: 'Come back for 20% off', offer: 'Any class pack, through Sunday', sw: 'var(--pm-aqua)', url: 'scan.proofmail.co/back' },
    { eye: 'For our regulars', head: 'You are on the VIP list', offer: 'Private preview night, plus one guest', sw: 'var(--pm-yellow)', url: 'scan.proofmail.co/vip' }
  ];
  var vdTabs = $$('.vd-tabs button');
  function showV(i) {
    var v = versions[i];
    vdTabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    var piece = $('#vdPiece');
    if (piece) piece.setAttribute('aria-labelledby', 'vd-' + i);
    $('#vdEye').textContent = v.eye;
    $('#vdHead').textContent = v.head;
    $('#vdOffer').textContent = v.offer;
    $('#vdSwatch').style.background = v.sw;
    $('#vdUrl').textContent = v.url;
  }
  vdTabs.forEach(function (t) {
    t.addEventListener('click', function () { showV(+t.dataset.v); });
  });

  /* ---------- dashboard funnel ------------------------------------------ */
  var funnelEl = $('#funnel');
  if (funnelEl) {
    var f = [['Mailed', 5000], ['Delivered', 4812], ['Scanned', 318], ['Left details', 97], ['Booked', 41]];
    funnelEl.innerHTML = f.map(function (r) {
      var w = Math.max(1.5, r[1] / f[0][1] * 100);
      return '<div class="bar"><span>' + r[0] + '</span><div class="track"><div class="fill" style="width:' +
             w + '%"></div></div><span class="num">' + r[1].toLocaleString('en-US') + '</span></div>';
    }).join('');
  }

  /* ---------- quiz -------------------------------------------------------
     Five questions to a recommended package. The answers travel with the
     lead so the mail plan is written against what they actually said.
     ---------------------------------------------------------------------- */
  var Q = [
    { q: 'What kind of business are you?', k: 'cat', o: ['Restaurant or cafe', 'Fitness, wellness or med spa', 'Home services', 'Retail or other local business'] },
    { q: 'What do you want to promote?', k: 'goal', o: ['A new location or opening', 'A special offer', 'An event', 'More reviews or past customers back'] },
    { q: 'Who should get it?', k: 'aud', o: ['Every home near me', 'A specific type of person', 'My existing customers', 'Not sure yet'] },
    { q: 'How far do customers travel to you?', k: 'rad', o: ['Under 2 miles', '2 to 5 miles', '5 to 15 miles', 'All over DFW'] },
    { q: 'What budget feels right for a first campaign?', k: 'bud', o: ['Under $2,000', '$2,000 to $5,000', '$5,000 to $10,000', '$10,000+'] }
  ];
  var A = {}, step = 0, body = $('#quizBody'), bar = $('#qbar');

  function answerText(key) {
    var q = Q.filter(function (x) { return x.k === key; })[0];
    return (q && A[key] != null) ? q.o[A[key]] : '';
  }

  function renderQ() {
    if (!body) return;
    bar.style.width = (step / (Q.length + 1) * 100) + '%';
    var x = Q[step];
    body.innerHTML =
      '<p class="eyebrow">Question ' + (step + 1) + ' of ' + Q.length + '</p>' +
      '<div class="q-title" style="margin-top:8px">' + esc(x.q) + '</div>' +
      '<div class="opts">' + x.o.map(function (o, i) {
        return '<button type="button" data-i="' + i + '">' + esc(o) + '</button>';
      }).join('') + '</div>' +
      (step ? '<button type="button" class="btn btn-ghost" id="qBack" style="margin-top:18px;padding:8px 14px">Back</button>' : '');

    $$('.opts button', body).forEach(function (b) {
      b.addEventListener('click', function () {
        A[x.k] = +b.dataset.i;
        if (!step) track('proofmail_quiz_started', {});
        track('proofmail_quiz_answer', { question: x.k, answer: x.o[+b.dataset.i] });
        step++;
        step < Q.length ? renderQ() : renderResult();
      });
    });
    var bk = $('#qBack');
    if (bk) bk.addEventListener('click', function () { step--; renderQ(); });
  }

  function recommend() {
    if (A.goal === 0) return { name: 'Launch campaign', why: 'Openings work best with more than one touch: a teaser, an opening-week offer and a reminder, plus ads to the same streets.', items: ['3 drops over 6 weeks', 'RSVP or opening offer page', 'Meta and Google ads to the same area', 'Review drive after opening'] };
    if (A.aud === 2 || A.goal === 3) return { name: 'Targeted campaign', why: 'Your best prospects are people who already know you. We mail your customer list with versions for lapsed, regular and VIP customers.', items: ['Your customer list, cleaned and verified', 'Up to 2 variable-data versions', 'A landing page per version', 'Follow-up email to everyone who scans'] };
    if (A.aud === 1) return { name: 'Targeted campaign', why: 'You know who you want. We pull a list that matches them by age, income, homeownership or new-mover status.', items: ['Purchased list matched to your buyer', 'Up to 2 variable-data versions', 'A landing page per version', '90-day results dashboard'] };
    return { name: 'Neighborhood drop', why: 'Your customers live close by. Mailing every home on the best routes near you is the fastest, lowest-cost test.', items: ['Top mail routes near you, up to 5,000 homes', '1 design with a matching landing page', 'Lead capture and a 60-day dashboard', 'Postage from $0.26 per piece'] };
  }

  function renderResult() {
    bar.style.width = (Q.length / (Q.length + 1) * 100) + '%';
    var r = recommend();
    track('proofmail_quiz_completed', { recommended_offer: r.name });

    body.innerHTML =
      '<div class="result"><p class="eyebrow">Your best fit</p><h3>' + esc(r.name) + '</h3>' +
      '<p class="muted">' + esc(r.why) + '</p><ul>' +
      r.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>' +
      '<form class="form" id="quizForm" novalidate>' +
      '<div class="full"><b>Where should we send your free mail plan?</b></div>' +
      '<div><label for="q-name">Name</label><input id="q-name" required autocomplete="name"></div>' +
      '<div><label for="q-biz">Business</label><input id="q-biz" required autocomplete="organization"></div>' +
      '<div><label for="q-email">Email</label><input id="q-email" type="email" required autocomplete="email"></div>' +
      '<div><label for="q-zip">Business ZIP code</label><input id="q-zip" inputmode="numeric" maxlength="5" required placeholder="75208" autocomplete="postal-code"></div>' +
      '<div class="pm-hp" aria-hidden="true"><label for="q-website">Leave this empty</label><input id="q-website" name="website" tabindex="-1" autocomplete="off"></div>' +
      '<div class="full"><button class="btn btn-mag" type="submit" id="q-submit">Send my mail plan</button> ' +
      '<button class="btn btn-ghost" type="button" id="qRestart">Start over</button>' +
      '<p class="fineprint">A real person builds the plan. We reply within one business day.</p></div>' +
      '</form><div id="quizOk" class="ok" hidden></div>';

    $('#qRestart').addEventListener('click', function () { A = {}; step = 0; renderQ(); });

    $('#quizForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      if ($('#q-website').value) return;                 // honeypot
      var bad = invalidFields(form);
      if (bad.length) { bad[0].focus(); return; }

      var name = $('#q-name').value.trim();
      var zip = $('#q-zip').value.trim();
      var btn = $('#q-submit');
      busy(btn, true);

      send({
        capture_path: 'proofmail_mail_plan',
        first_name: name.split(' ')[0],
        email: $('#q-email').value.trim(),
        company: $('#q-biz').value.trim(),
        industry: answerText('cat'),
        budget_band: answerText('bud'),
        recommended_offer: r.name,
        context: [
          'ZIP ' + zip,
          'Promoting: ' + answerText('goal'),
          'Audience: ' + answerText('aud'),
          'Travel radius: ' + answerText('rad')
        ].join(' · '),
        tags: ['proofmail', 'mail-plan']
      }).then(function (ok) {
        busy(btn, false, 'Send my mail plan');
        bar.style.width = '100%';
        form.hidden = true;
        var box = $('#quizOk');
        box.hidden = false;
        box.innerHTML = '<div><b>Got it, ' + esc(name.split(' ')[0]) + '.</b> We are building your mail plan for ZIP ' +
          esc(zip) + ' and will send it over within one business day. It starts from a <b>' + esc(r.name) +
          '</b>. Want to walk through it? <a href="' + esc(CALENDLY) + '" rel="noopener" target="_blank">Book a 15-minute call</a>.' +
          (ok ? '' : FALLBACK) + '</div>';
        box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
  }
  renderQ();

  /* ---------- contact: quote or call ------------------------------------ */
  var contactForm = $('#contactForm');
  if (contactForm) {
    var mode = 'quote';
    var seg = $$('.seg button');

    function setMode(m) {
      mode = m;
      seg.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === m)); });
      $$('.quote-only').forEach(function (el) { el.hidden = m !== 'quote'; });
      $$('.call-only').forEach(function (el) { el.hidden = m !== 'call'; });
      contactForm.setAttribute('aria-labelledby', m === 'quote' ? 'tab-quote' : 'tab-call');
      $('#c-submit').textContent = m === 'quote' ? 'Send my request' : 'Request a call';
    }
    seg.forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.dataset.tab); });
    });
    setMode('quote');

    /* A package CTA deep-links into the form with its package preselected. */
    $$('[data-quote]').forEach(function (a) {
      a.addEventListener('click', function () {
        setMode('quote');
        var s = $('#c-pkg');
        [].forEach.call(s.options, function (o, i) { if (o.text === a.dataset.quote) s.selectedIndex = i; });
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#c-website').value) return;                 // honeypot
      var bad = invalidFields(contactForm);
      if (bad.length) { bad[0].focus(); return; }

      var biz = $('#c-biz').value.trim();
      var email = $('#c-email').value.trim();
      var name = $('#c-name').value.trim();
      var label = mode === 'quote' ? 'Send my request' : 'Request a call';
      var btn = $('#c-submit');
      busy(btn, true);

      var context = [$('#c-msg').value.trim()];
      if (mode === 'quote') {
        context.push('Quantity: ' + $('#c-qty').value);
        if ($('#c-when').value) context.push('Mail by: ' + $('#c-when').value);
      }

      send({
        capture_path: mode === 'quote' ? 'proofmail_quote' : 'proofmail_call',
        first_name: name.split(' ')[0],
        email: email,
        company: biz,
        phone: $('#c-phone').value.trim(),
        recommended_offer: mode === 'quote' ? $('#c-pkg').value : '',
        context: context.filter(Boolean).join(' · '),
        tags: ['proofmail', mode === 'quote' ? 'quote' : 'call']
      }).then(function (ok) {
        busy(btn, false, label);
        contactForm.hidden = true;
        $$('.calendly-note').forEach(function (el) { el.hidden = true; });  // the confirmation carries the link now
        var box = $('#contactOk');
        box.hidden = false;
        box.innerHTML = mode === 'quote'
          ? '<div><b>Request received.</b> We will send a quote for ' + esc(biz) +
            ' within one business day.' + (ok ? '' : FALLBACK) + '</div>'
          : '<div><b>Thanks, ' + esc(name.split(' ')[0]) + '.</b> Pick a time that suits you and we will come prepared: ' +
            '<a href="' + esc(CALENDLY) + '" rel="noopener" target="_blank">open the calendar</a>. ' +
            (ok
              ? 'We have your details either way and will follow up within one business day.'
              : 'Our form had trouble sending your details, so if the calendar does not suit you, email ' +
                '<a href="mailto:kiel@kijacreative.com">kiel@kijacreative.com</a>.') + '</div>';
        box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
  }

  /* ---------- copy buttons ----------------------------------------------- */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.copy;
      try {
        navigator.clipboard.writeText(t).then(
          function () { b.textContent = 'Copied'; },
          function () { b.textContent = 'Select to copy'; }
        );
      } catch (e) { b.textContent = 'Select to copy'; }
    });
  });
})();
