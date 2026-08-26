/* ==========================================================================
   FIT FINDER — /fit-finder
   Mounts into <div data-kija-widget="fit-finder">.
   Variants: d1 (conversational, one question at a time)  <- default
             d2 (structured multi-step form)
   Guardrails (hard rules, do not relax without a decision from Kiel):
     - never quotes a price
     - never promises a timeline
     - always routes to a call
     - if the AI layer errors, degrade to d2 rather than failing the capture
   ========================================================================== */
(function () {
  'use strict';
  var K = window.KIJA;

  /* --- intake ------------------------------------------------------------ */
  var STEPS = [
    { id:'industry', ask:'First, what world do you operate in?', label:'Industry',
      type:'select', options:['Professional services','Health, fitness or wellness','Hospitality or travel','Retail or ecommerce','Construction or trades','Financial services','Healthcare or life sciences','Nonprofit or cause','Technology','Something else'] },
    { id:'size', ask:'How big is the team behind it?', label:'Company size',
      type:'choice', options:[
        ['Just me','solo'],['2 to 10','small'],['11 to 50','mid'],['51 to 200','large'],['200+','enterprise']] },
    { id:'state', ask:'Where does the brand stand today?', label:'Current state',
      type:'choice', options:[
        ['Starting from scratch, or close to it','greenfield'],
        ['We have a logo, but nothing behind it','assets-only'],
        ['Solid brand, weak website','brand-ok'],
        ['Good brand and site, nothing driving traffic','needs-demand'],
        ['It all works, we just cannot keep it fed','needs-content']] },
    { id:'constraint', ask:'And what is the thing actually holding you back?', label:'Primary constraint',
      type:'choice', options:[
        ['Nobody understands what we do','clarity'],
        ['Not enough qualified leads','leads'],
        ['Leads come in and go nowhere','follow-up'],
        ['We cannot produce enough content','content'],
        ['No one owns the strategy','strategy']] },
    { id:'timeline', ask:'When do you need this moving?', label:'Timeline',
      type:'choice', options:[
        ['Yesterday','urgent'],['Next quarter','quarter'],['This year','year'],['Exploring for now','exploring']] },
    { id:'budget', ask:'Last one. What range are you working within?', label:'Budget band',
      type:'choice', options:[
        ['Under $10k','band-1'],['$10k to $30k','band-2'],['$30k to $75k','band-3'],['$75k+','band-4'],['No idea yet','unknown']] },
    { id:'contact', ask:'Good. Where do we send the recommendation?', label:'Contact', type:'contact' }
  ];

  /* --- recommendation ----------------------------------------------------
     Deterministic and inspectable on purpose. When the AI layer is live it
     enriches the write-up; it never overrides the routing rules below.
     ---------------------------------------------------------------------- */
  var OFFERS = {
    'launch-kit': { name:'Launch Kit', href:'/launch-kit',
      why:'You are rebuilding the foundation, not patching it. Brand and site together, then a first ad program once there is something worth sending traffic to.' },
    'growth-engine': { name:'Growth Engine', href:'/growth-engine',
      why:'The foundation is there. What is missing is the machine that runs on it every month: campaigns, optimisation, reporting.' },
    'content-machine': { name:'Content Machine', href:'/content-machine',
      why:'The strategy exists. The output does not keep up with it. This is the lowest-friction way to fix that without adding headcount.' },
    'personal-brand': { name:'Personal Brand Launch Kit', href:'/personal-brand-launch-kit',
      why:'At your stage the company brand and the founder brand are the same asset. Build the one people actually follow first.' },
    'strategic-partner': { name:'Strategic Partner', href:'/strategic-partner',
      why:'You do not need more production. You need someone senior in the room every month holding the strategy and the accountability.' },
    'marketing-automation': { name:'Marketing Automation', href:'/services/marketing-automation',
      why:'You are already generating interest and losing it after the click. Fixing the follow-up system is the highest-return thing on your list.' }
  };

  var SEQUENCE = {
    greenfield:     ['Creative Strategy','Brand Development','Website Design','Ongoing Marketing'],
    'assets-only':  ['Creative Strategy','Brand Development','Website Design'],
    'brand-ok':     ['Website Design','Marketing Automation','Ongoing Marketing'],
    'needs-demand': ['Marketing Automation','Ongoing Marketing'],
    'needs-content':['Ongoing Marketing']
  };

  function recommend(a) {
    var offer;
    if (a.constraint === 'strategy' && (a.size === 'mid' || a.size === 'large' || a.size === 'enterprise')) offer = 'strategic-partner';
    else if (a.size === 'solo' && (a.state === 'greenfield' || a.state === 'assets-only')) offer = 'personal-brand';
    else if (a.state === 'greenfield' || a.state === 'assets-only' || a.constraint === 'clarity') offer = 'launch-kit';
    else if (a.constraint === 'follow-up') offer = 'marketing-automation';
    else if (a.constraint === 'content' || a.state === 'needs-content') offer = 'content-machine';
    else offer = 'growth-engine';

    var first = {
      clarity:   'Get the positioning written down and agreed before another asset gets made. Everything downstream is cheaper once that exists.',
      leads:     'Work out where the current traffic dies before buying more of it. Usually the leak is on the page, not in the ad account.',
      'follow-up':'Map what happens in the first sixty seconds after a form fill. That is almost always the fastest win available to you.',
      content:   'Pick the two formats you can sustain forever and stop doing the rest. Consistency beats range.',
      strategy:  'Name the owner. A strategy nobody owns is a document, not a plan.'
    }[a.constraint];

    return {
      offer: OFFERS[offer],
      offerKey: offer,
      sequence: SEQUENCE[a.state] || SEQUENCE.greenfield,
      first: first,
      // Deliberately no price and no delivery date. Both are call conversations.
      note: a.timeline === 'exploring'
        ? 'You said you are exploring, so nothing here is urgent. Read the matched case study first and come back when it is.'
        : 'The honest next step is a call, so we can pressure-test this against what you actually know about your market.'
    };
  }

  /* --- helpers ----------------------------------------------------------- */
  function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]; }); }
  function labelFor(step, value) {
    if (step.type === 'select') return value;
    var hit = (step.options || []).filter(function (o) { return o[1] === value; })[0];
    return hit ? hit[0] : value;
  }

  function mount(root) {
    var variant = (K && K.currentVariant && K.currentVariant()) || 'd1';
    if (['d1', 'd2'].indexOf(variant) === -1) variant = 'd1';

    var answers = {};
    var idx = 0;
    var transcript = [];

    function paint(node) { root.innerHTML = ''; root.appendChild(node); }

    /* ================= D1 — conversational ================= */
    function chatStep() {
      var step = STEPS[idx];
      transcript.push({ who: 'bot', text: step.ask });

      var body = step.type === 'contact' ? contactFields() :
        step.type === 'select'
          ? '<label class="k-field"><span class="k-field__l">' + esc(step.label) + '</span>' +
            '<select class="k-select" data-answer><option value="">Choose one</option>' +
            step.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') +
            '</select></label>'
          : '<div class="k-choices">' + step.options.map(function (o) {
              return '<button class="k-choice" style="text-align:left" data-pick="' + esc(o[1]) + '">' +
                '<span class="k-choice__box" aria-hidden="true"></span><span class="k-choice__t">' + esc(o[0]) + '</span></button>';
            }).join('') + '</div>';

      var node = el(
        '<div class="k-widget__step">' +
          '<div class="k-chat" data-chat>' +
            transcript.map(function (m) {
              return '<div class="k-chat__msg k-chat__msg--' + (m.who === 'bot' ? 'bot' : 'me') + '">' + esc(m.text) + '</div>';
            }).join('') +
          '</div>' +
          '<div style="margin-top:24px" data-input>' + body + '</div>' +
          '<div class="k-widget__nav">' +
            '<button class="k-btn k-btn--ghost k-btn--sm" data-back' + (idx === 0 ? ' aria-disabled="true"' : '') + '>Back</button>' +
            '<span class="k-widget__count">' + (idx + 1) + ' / ' + STEPS.length + '</span>' +
          '</div>' +
        '</div>');

      var chat = node.querySelector('[data-chat]');
      requestAnimationFrame(function () { chat.scrollTop = chat.scrollHeight; });

      node.addEventListener('click', function (e) {
        var pick = e.target.closest('[data-pick]');
        if (pick) { advance(step, pick.getAttribute('data-pick'), pick.textContent.trim()); return; }
        if (e.target.closest('[data-back]') && idx > 0) { idx--; transcript = transcript.slice(0, -2); chatStep(); }
      });
      var sel = node.querySelector('[data-answer]');
      if (sel) sel.addEventListener('change', function () {
        if (sel.value) advance(step, sel.value, sel.value);
      });
      var form = node.querySelector('form');
      if (form) bindContact(form);

      paint(node);
    }

    function advance(step, value, label) {
      answers[step.id] = value;
      transcript.push({ who: 'me', text: label });
      K && K.track('fit_finder_answer', { step: step.id, value: value });
      idx++;
      if (idx >= STEPS.length) return finish();
      chatStep();
    }

    /* ================= D2 — structured form ================= */
    function formStep() {
      var groups = STEPS.filter(function (s) { return s.type !== 'contact'; });
      var node = el(
        '<div class="k-widget__step">' +
          '<p class="k-label">Fit Finder</p>' +
          '<h3 class="k-h3-lg" style="margin-top:10px;max-width:22ch">Six questions. Then a straight answer about where to start.</h3>' +
          '<form novalidate style="margin-top:28px" class="k-stack-lg">' +
            groups.map(function (s) {
              if (s.type === 'select') {
                return '<label class="k-field"><span class="k-field__l">' + esc(s.label) + '</span>' +
                  '<select class="k-select" name="' + s.id + '" required><option value="">Choose one</option>' +
                  s.options.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') +
                  '</select><span class="k-field__err">Pick the closest fit.</span></label>';
              }
              return '<fieldset class="k-field" style="border:0;padding:0;margin:0">' +
                '<legend class="k-field__l">' + esc(s.label) + '</legend>' +
                '<div class="k-choices">' + s.options.map(function (o, i) {
                  return '<label class="k-choice"><input type="radio" name="' + s.id + '" value="' + esc(o[1]) + '"' +
                    (i === 0 ? ' required' : '') + '>' +
                    '<span class="k-choice__box" aria-hidden="true"></span>' +
                    '<span class="k-choice__t">' + esc(o[0]) + '</span></label>';
                }).join('') + '</div>' +
                '<span class="k-field__err">Pick the closest fit.</span></fieldset>';
            }).join('') +
            contactFields(true) +
            '<button class="k-btn k-btn--primary k-btn--lg" type="submit" style="width:100%">' +
              'Get my recommendation <span class="k-btn__arrow">&rarr;</span></button>' +
          '</form>' +
        '</div>');
      bindContact(node.querySelector('form'), true);
      paint(node);
    }

    /* ---- contact block, shared ---- */
    function contactFields(inline) {
      return (inline ? '<div class="k-stack" style="border-top:1px solid var(--k-line);padding-top:26px">' : '<form novalidate class="k-stack">') +
        '<div class="k-grid k-g2">' +
          '<label class="k-field"><span class="k-field__l">First name</span>' +
            '<input class="k-input" name="first_name" autocomplete="given-name" required>' +
            '<span class="k-field__err">We need something to call you.</span></label>' +
          '<label class="k-field"><span class="k-field__l">Work email</span>' +
            '<input class="k-input" name="email" type="email" autocomplete="email" required>' +
            '<span class="k-field__err">That address does not look right.</span></label>' +
        '</div>' +
        '<label class="k-field"><span class="k-field__l">Company</span>' +
          '<input class="k-input" name="company" autocomplete="organization"></label>' +
        '<div class="k-hp"><label>Leave empty<input name="website" tabindex="-1" autocomplete="off"></label></div>' +
        (inline ? '</div>' :
          '<button class="k-btn k-btn--primary k-btn--lg" type="submit" style="width:100%">' +
          'Get my recommendation <span class="k-btn__arrow">&rarr;</span></button></form>');
    }

    function bindContact(form, collectAll) {
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name=website]');
        if (hp && hp.value) return;
        var valid = true, seenGroup = {};
        Array.prototype.forEach.call(form.elements, function (input) {
          if (!input.name || input.type === 'submit' || input.name === 'website') return;

          if (input.type === 'radio') {
            if (input.checked) answers[input.name] = input.value;
            // Evaluate a radio group once. Marking per-input lets the last,
            // non-required sibling clear the flag the required one just set.
            if (seenGroup[input.name]) return;
            seenGroup[input.name] = true;
            var groupRequired = !!form.querySelector('[name="' + input.name + '"][required]');
            var groupBad = groupRequired && !form.querySelector('[name="' + input.name + '"]:checked');
            var groupWrap = input.closest('.k-field');
            if (groupWrap) groupWrap.setAttribute('data-invalid', String(groupBad));
            if (groupBad) valid = false;
            return;
          }

          var wrap = input.closest('.k-field');
          var bad = input.required && (!input.value.trim() ||
                    (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)));
          if (wrap) wrap.setAttribute('data-invalid', String(!!bad));
          if (bad) valid = false;
          if (collectAll || ['first_name','email','company'].indexOf(input.name) > -1) answers[input.name] = input.value.trim();
        });
        if (!valid) { var firstBad = form.querySelector('[data-invalid="true"]'); if (firstBad) firstBad.scrollIntoView({ block:'center' }); return; }
        var btn = form.querySelector('[type=submit]');
        if (btn) { btn.setAttribute('aria-disabled','true'); btn.textContent = 'Working...'; }
        finish();
      });
    }

    /* ---- result ---- */
    function finish() {
      var rec = recommend(answers);
      var lead = {
        first_name: answers.first_name, email: answers.email, company: answers.company,
        capture_path: 'fit_finder',
        industry: answers.industry,
        company_size: answers.size,
        current_state: answers.state,
        primary_constraint: answers.constraint,
        timeline: answers.timeline,
        budget_band: answers.budget,
        recommended_offer: rec.offer.name,
        recommended_sequence: rec.sequence.join(' > '),
        tags: ['source:fit-finder', 'variant:' + variant, 'offer:' + rec.offerKey]
      };
      try { sessionStorage.setItem('kija_last_result', JSON.stringify(lead)); } catch (e) {}
      if (K) K.submitLead(lead).catch(function () {});

      var summary = STEPS.filter(function (s) { return s.type !== 'contact' && answers[s.id]; }).map(function (s) {
        return '<div><dt class="k-label k-label--dim">' + esc(s.label) + '</dt>' +
               '<dd style="font-weight:700;font-size:var(--k-t-sm);margin-top:4px">' + esc(labelFor(s, answers[s.id])) + '</dd></div>';
      }).join('');

      paint(el(
        '<div class="k-widget__step">' +
          '<p class="k-label">Where you should start</p>' +
          '<h3 class="k-h3-lg" style="margin-top:10px">' + esc(rec.offer.name) + '</h3>' +
          '<p class="k-lede" style="margin-top:14px;max-width:52ch">' + esc(rec.offer.why) + '</p>' +
          '<div class="k-callout" style="margin-top:26px">' +
            '<h4 class="k-label--yellow">Do this first, whether or not you hire us</h4>' +
            '<p class="k-sm" style="margin-top:10px">' + esc(rec.first) + '</p>' +
          '</div>' +
          '<h4 style="margin-top:30px">The order we would work in</h4>' +
          '<ol class="k-list k-list--num" style="margin-top:14px">' +
            rec.sequence.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
          '</ol>' +
          '<p class="k-dim k-sm" style="margin-top:18px;max-width:56ch">' + esc(rec.note) + '</p>' +
          '<dl class="k-meta" style="margin-top:30px">' + summary + '</dl>' +
          '<div class="k-btns" style="margin-top:30px">' +
            '<a class="k-btn k-btn--primary k-btn--lg" href="/book" data-track="cta_book_from_fit_finder">' +
              'Book the call <span class="k-btn__arrow">&rarr;</span></a>' +
            '<a class="k-btn k-btn--ghost k-btn--lg" href="' + rec.offer.href + '" data-track="cta_offer_from_fit_finder">' +
              'Read about ' + esc(rec.offer.name) + '</a>' +
          '</div>' +
        '</div>'));

      K && K.track('fit_finder_completed', { recommended_offer: rec.offer.name, constraint: answers.constraint });
    }

    K && K.track('fit_finder_started', { variant_id: variant });

    // Guardrail: any failure in the conversational path degrades to the
    // structured form rather than losing the capture.
    try {
      if (variant === 'd2') formStep(); else chatStep();
    } catch (err) {
      K && K.track('fit_finder_fallback', { message: String(err && err.message) });
      try { formStep(); } catch (e2) {
        root.innerHTML = '<p class="k-dim">Something broke on our side. ' +
          '<a class="k-link" href="/book">Book a call instead</a> and we will do this live.</p>';
      }
    }
  }

  function init() {
    var root = document.querySelector('[data-kija-widget="fit-finder"]');
    if (root) mount(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
