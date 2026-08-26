/* ==========================================================================
   LEAD FORM — progressive enhancement for any <form data-kija-form="...">
   Handles validation, honeypot, submission through KIJA.submitLead and the
   routed redirect. Used by /brand-review and the qualified /book variant.
   ========================================================================== */
(function () {
  'use strict';
  var K = window.KIJA;

  function validate(form) {
    var ok = true, seenGroup = {};
    Array.prototype.forEach.call(form.elements, function (input) {
      if (!input.name || input.type === 'submit' || input.name === 'website') return;

      // A radio/checkbox group is one question, so validate it once. Marking
      // per-input lets a later, non-required sibling clear the flag the
      // required one just set — which silently blocks submit with no error.
      if (input.type === 'radio' || input.type === 'checkbox') {
        if (seenGroup[input.name]) return;
        seenGroup[input.name] = true;
        var required = !!form.querySelector('[name="' + input.name + '"][required]');
        var groupBad = required && !form.querySelector('[name="' + input.name + '"]:checked');
        var groupWrap = input.closest('.k-field');
        if (groupWrap) groupWrap.setAttribute('data-invalid', String(groupBad));
        if (groupBad) ok = false;
        return;
      }

      var wrap = input.closest('.k-field');
      var bad = input.required && (!input.value.trim() ||
                (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)));
      if (wrap) wrap.setAttribute('data-invalid', String(!!bad));
      if (bad) ok = false;
    });
    return ok;
  }

  function collect(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (input) {
      if (!input.name || input.type === 'submit' || input.name === 'website') return;
      if (input.type === 'radio') { if (input.checked) data[input.name] = input.value; }
      else if (input.type === 'checkbox') {
        if (input.checked) (data[input.name] = data[input.name] || []).push(input.value);
      } else if (input.value.trim()) data[input.name] = input.value.trim();
    });
    Object.keys(data).forEach(function (k) {
      if (Array.isArray(data[k])) data[k] = data[k].join(', ');
    });
    return data;
  }

  /* Pre-fill from the query string. Case study CTAs deep-link with the
     industry attached so the form arrives partly answered. */
  function prefill(form) {
    var q = new URLSearchParams(location.search);
    q.forEach(function (value, key) {
      var field = form.querySelector('[name="' + key + '"]');
      if (!field) return;
      if (field.tagName === 'SELECT') {
        var match = Array.prototype.filter.call(field.options, function (o) {
          return o.value.toLowerCase() === value.toLowerCase();
        })[0];
        if (match) field.value = match.value;
      } else if (field.type !== 'radio' && field.type !== 'checkbox') {
        field.value = value;
      }
    });
  }

  function bind(form) {
    var path = form.getAttribute('data-kija-form');
    var thanks = form.getAttribute('data-thanks') || '/thanks/' + path.replace(/_/g, '-');
    prefill(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name=website]');
      if (hp && hp.value) return;                        // honeypot: silently drop

      if (!validate(form)) {
        var bad = form.querySelector('[data-invalid="true"]');
        if (bad) { bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
        return;
      }

      var btn = form.querySelector('[type=submit]');
      var original = btn ? btn.innerHTML : '';
      if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Sending...'; }

      var payload = collect(form);
      payload.capture_path = path;
      payload.tags = ['source:' + path.replace(/_/g, '-'),
                      'variant:' + ((K && K.currentVariant()) || 'default')];

      try { sessionStorage.setItem('kija_last_result', JSON.stringify(payload)); } catch (err) {}

      var go = function () { location.href = thanks; };
      if (!K) return go();
      K.submitLead(payload).then(go).catch(function () {
        // The lead is stashed in sessionStorage; the thank-you page retries.
        // Never show the visitor an error for our infrastructure problem.
        go();
      });
      // Belt and braces: if the network hangs, do not strand the visitor.
      setTimeout(go, 4000);
      if (btn) setTimeout(function () { btn.innerHTML = original; }, 6000);
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-kija-form]'), bind);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
