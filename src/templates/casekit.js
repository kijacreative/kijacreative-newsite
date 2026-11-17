/* ==========================================================================
   CASE KIT RENDERERS — the visual, playable sections of a case page.
   Every module renders its full content as plain HTML (all tabs, all stages,
   a worked example for each calculator), so it reads without JS. case-kit.js
   then adds the interaction: it marks the module .is-live and hides what the
   controls are not showing.
   ========================================================================== */
import { esc } from './layout.js';
import { head } from './blocks.js';
import { hasMedia, mediaUrl } from '../data/media.js';
import { kitFor } from '../data/casekits.js';
import { wall } from '../data/wall.js';

/** First image in a preference list that exists in src/media. */
export const pick = (list) => (list || []).find((s) => hasMedia(s)) || null;
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

/* ---------- hero band: the work, big, right under the headline ---------- */
export function caseHeroBand(c) {
  const src = pick(kitFor(c.slug).hero) || pick((wall[c.slug]?.media || []).filter((m) => !m.logo).map((m) => m.src));
  if (!src) return '';
  return `
<div class="ck-hero" data-ck-hero>
  <div class="k-wrap"><figure class="ck-hero__f"><img src="${mediaUrl(src)}" alt="${esc(c.client)}: the work" fetchpriority="high" decoding="async"></figure></div>
</div>`;
}

/* ---------- signature line: one phrase, set big ---------- */
function signature(sig) {
  return `
<section class="ck-sig" data-reveal>
  <div class="k-wrap">
    <p class="ck-sig__line">${esc(sig.line)}</p>
    <p class="ck-sig__note">${esc(sig.note)}</p>
  </div>
</section>`;
}

/* ---------- modules ---------- */
const M = {
  floors(m) {
    return `
    <div class="ck-tabs" data-ck="tabs">
      <div class="ck-tabs__bar" role="tablist" aria-label="Studios">
        ${m.items.map((it, i) => `<button class="ck-tabs__b" role="tab" type="button" data-ck-tab="${i}" aria-selected="${i === 0}">${esc(it.name)}</button>`).join('')}
      </div>
      ${m.items.map((it, i) => {
        const img = pick(it.img);
        return `
      <article class="ck-floor" data-ck-panel="${i}" role="tabpanel">
        <div class="ck-floor__img">${img ? `<img src="${mediaUrl(img)}" alt="Oak Cliff Pilates ${esc(it.name)}" loading="lazy" decoding="async">` : `<span class="ck-floor__type">${esc(it.name)}</span>`}</div>
        <div class="ck-floor__t">
          <p class="k-label k-label--dim">${esc(it.tag)}</p>
          <h3 class="ck-floor__name">${esc(it.name)}</h3>
          <p class="ck-floor__h">${esc(it.h)}</p>
          <p class="k-dim" style="margin-top:12px">${esc(it.d)}</p>
          <p class="ck-floor__line">“${esc(it.line)}”</p>
          <p class="k-label k-label--dim" style="margin-top:14px">${esc(it.address)}</p>
        </div>
      </article>`;
      }).join('')}
    </div>`;
  },

  growth(m) {
    const last = m.stops.length - 1;
    return `
    <div class="ck-growth" data-ck="growth" data-stops='${esc(JSON.stringify(m.stops))}'>
      <div class="ck-growth__read" aria-live="polite">
        <p class="ck-growth__k" data-ck-out="k">${esc(m.stops[last].k)}</p>
        <div class="ck-growth__dots" data-ck-out="dots">${[1, 2, 3].map((n) => `<i class="${n <= m.stops[last].studios ? 'is-on' : ''}"></i>`).join('')}</div>
        <p class="ck-growth__s"><b data-ck-out="studios">${m.stops[last].studios}</b> studios open</p>
        <p class="ck-growth__stat" data-ck-out="stat">${m.stops[last].stat ? `<b>${esc(m.stops[last].stat)}</b> ${esc(m.stops[last].statL)}` : ''}</p>
        <p class="ck-growth__stat" data-ck-out="stat2">${m.stops[last].stat2 ? `<b>${esc(m.stops[last].stat2)}</b> ${esc(m.stops[last].stat2L)}` : ''}</p>
        <p class="k-dim" data-ck-out="note">${esc(m.stops[last].note)}</p>
      </div>
      <label class="ck-range">
        <span class="k-sr">Year</span>
        <input type="range" min="0" max="${last}" step="1" value="${last}" data-ck-in>
        <span class="ck-range__ticks">${m.stops.map((s) => `<span>${esc(s.k)}</span>`).join('')}</span>
      </label>
      <ol class="ck-growth__list">${m.stops.map((s) => `<li><b>${esc(s.k)}</b> ${s.studios} studio${s.studios > 1 ? 's' : ''}. ${esc(s.note)}${s.stat ? ` ${esc(s.stat)} ${esc(s.statL)}.` : ''}${s.stat2 ? ` ${esc(s.stat2)} ${esc(s.stat2L)}.` : ''}</li>`).join('')}</ol>
    </div>`;
  },

  calc(m) {
    const b = m.value * m.before.util * m.before.rate, a = m.value * m.after.util * m.after.rate;
    return `
    <div class="ck-calc" data-ck="calc" data-cfg='${esc(JSON.stringify({ before: m.before, after: m.after }))}'>
      <label class="ck-range ck-range--wide">
        <span class="ck-calc__q"><b data-ck-out="n">${m.value.toLocaleString('en-US')}</b> ${esc(m.unit)}</span>
        <input type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.value}" data-ck-in aria-label="${esc(m.unit)}">
      </label>
      <div class="ck-calc__cols">
        <div class="ck-calc__col"><p class="k-label k-label--dim">${esc(m.before.label)}</p><p class="ck-calc__v" data-ck-out="before">${money(b)}</p><p class="k-dim k-sm">a month · ${Math.round(m.before.util * 100)}% used at $${m.before.rate}</p></div>
        <div class="ck-calc__col is-after"><p class="k-label">${esc(m.after.label)}</p><p class="ck-calc__v" data-ck-out="after">${money(a)}</p><p class="k-dim k-sm">a month · ${Math.round(m.after.util * 100)}% used at $${m.after.rate}</p></div>
        <div class="ck-calc__col is-delta"><p class="k-label">The difference</p><p class="ck-calc__v" data-ck-out="delta">+${money(a - b)}</p><p class="k-dim k-sm" data-ck-out="year">${money((a - b) * 12)} a year</p></div>
      </div>
      <p class="ck-note">${esc(m.note)}</p>
    </div>`;
  },

  impact(m) {
    const n = Math.floor(m.value / m.per);
    let left = n;
    const parts = m.split.map(([name, share], i) => { const k = i === m.split.length - 1 ? left : Math.round(n * share); left -= k; return [name, k]; });
    return `
    <div class="ck-impact" data-ck="impact" data-cfg='${esc(JSON.stringify({ per: m.per, split: m.split }))}'>
      <label class="ck-range ck-range--wide">
        <span class="ck-calc__q">A gift of <b data-ck-out="gift">${money(m.value)}</b></span>
        <input type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.value}" data-ck-in aria-label="Gift amount">
      </label>
      <div class="ck-impact__out">
        <p class="ck-impact__n"><b data-ck-out="n">${n}</b> <span>free screenings</span></p>
        <div class="ck-impact__dots" data-ck-out="dots" aria-hidden="true">${'<i></i>'.repeat(Math.min(n, 100))}</div>
        <ul class="ck-impact__split" data-ck-out="split">${parts.map(([p, k]) => `<li><b>${k}</b> ${esc(p)}</li>`).join('')}</ul>
      </div>
      <p class="k-dim" style="margin-top:18px;max-width:60ch">${esc(m.why)}</p>
      <p class="ck-note">${esc(m.note)}</p>
    </div>`;
  },

  voices(m) {
    return `
    <div class="ck-tabs" data-ck="tabs">
      <div class="ck-tabs__bar" role="tablist" aria-label="Brand family">
        ${m.items.map((it, i) => `<button class="ck-tabs__b" role="tab" type="button" data-ck-tab="${i}" aria-selected="${i === 0}">${esc(it.tag.split(' · ')[0])}</button>`).join('')}
      </div>
      ${m.items.map((it, i) => {
        const img = pick(it.img);
        return `
      <article class="ck-voice${it.dark ? ' is-dark' : ''}" data-ck-panel="${i}" role="tabpanel">
        <div class="ck-voice__img${it.logo ? ' is-logo' : ''}">${img ? `<img src="${mediaUrl(img)}" alt="${esc(it.name)}" loading="lazy" decoding="async">` : ''}</div>
        <div>
          <p class="k-label k-label--dim">${esc(it.tag)}</p>
          <h3 style="margin-top:8px">${esc(it.name)}</h3>
          <p class="ck-voice__q">“${esc(it.voice)}”</p>
          <p class="k-dim" style="margin-top:12px">${esc(it.d)}</p>
          <dl class="ck-voice__meta"><dt>Audience</dt><dd>${esc(it.aud)}</dd><dt>Goal</dt><dd>${esc(it.goal)}</dd></dl>
        </div>
      </article>`;
      }).join('')}
    </div>`;
  },

  process(m) {
    return `
    <div class="ck-process" data-ck="process">
      <div class="ck-process__specs">${m.specs.map(([k, v]) => `<span><b>${esc(v)}</b> ${esc(k)}</span>`).join('')}</div>
      <label class="ck-range ck-range--wide">
        <span class="k-sr">Stage</span>
        <input type="range" min="0" max="${m.stages.length - 1}" step="0.01" value="0" data-ck-in>
        <span class="ck-range__ticks">${m.stages.map((s) => `<span>${esc(s.h.replace('.', ''))}</span>`).join('')}</span>
      </label>
      <div class="ck-process__stage">
        <div class="ck-process__imgs">${m.stages.map((s, i) => hasMedia(s.img) ? `<img src="${mediaUrl(s.img)}" alt="Bishop Cider display: ${esc(s.h)}" data-ck-layer="${i}" decoding="async">` : '').join('')}</div>
        <div class="ck-process__panels">
          ${m.stages.map((s, i) => `
          <article class="ck-process__p" data-ck-panel="${i}">
            <p class="k-label k-label--dim">${esc(s.k)}</p>
            <h3 class="ck-process__h">${esc(s.h)}</h3>
            <p class="k-dim" style="margin-top:10px">${esc(s.d)}</p>
            <p class="ck-process__q">“${esc(s.q)}”</p>
            <ul class="ck-process__out">${s.out.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
          </article>`).join('')}
        </div>
      </div>
    </div>`;
  },

  fees(m) {
    const v = m.value, lo = v * m.appsLow, hi = v * m.appsHigh, cq = v * m.cliqbux;
    return `
    <div class="ck-calc" data-ck="fees" data-cfg='${esc(JSON.stringify({ lo: m.appsLow, hi: m.appsHigh, cq: m.cliqbux }))}'>
      <label class="ck-range ck-range--wide">
        <span class="ck-calc__q"><b data-ck-out="sales">${money(v)}</b> a month in online orders</span>
        <input type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${v}" data-ck-in aria-label="Monthly online order sales">
      </label>
      <div class="ck-calc__cols">
        <div class="ck-calc__col"><p class="k-label k-label--dim">Delivery apps · 15–30%</p><p class="ck-calc__v" data-ck-out="apps">${money(lo)}–${money(hi)}</p><p class="k-dim k-sm">a month in fees</p></div>
        <div class="ck-calc__col is-after"><p class="k-label">Cliqbux · about 6.5%</p><p class="ck-calc__v" data-ck-out="cq">${money(cq)}</p><p class="k-dim k-sm">a month, card processing included</p></div>
        <div class="ck-calc__col is-delta"><p class="k-label">The restaurant keeps</p><p class="ck-calc__v" data-ck-out="keep">+${money(lo - cq)}–${money(hi - cq)}</p><p class="k-dim k-sm" data-ck-out="year">${money((lo - cq) * 12)}–${money((hi - cq) * 12)} a year</p></div>
      </div>
      <p class="ck-note">${esc(m.note)}</p>
    </div>`;
  },

  shots(m) {
    const items = m.items.filter(([src]) => hasMedia(src));
    return `<div class="ck-shots">${items.map(([src, cap], i) => `
      <figure class="ck-shots__i${i === 0 ? ' is-lead' : ''}" data-reveal><img src="${mediaUrl(src)}" alt="Cliqbux Restaurant Analyzer: ${esc(cap)} (sample data)" loading="lazy" decoding="async"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>`;
  },

  brands(m) {
    return `<ul class="ck-brands">${m.items.map(([n, t]) => `<li><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join('')}</ul>`;
  },

  bilingual(m) {
    const word = (w) => `<span class="ck-bi__a">${esc(w.a)}</span> <span class="ck-bi__b">${esc(w.b)}</span><span class="ck-bi__c">${esc(w.c)}</span>`;
    return `
    <div class="ck-bi" data-ck="bilingual">
      <div class="ck-bi__bar" role="group" aria-label="Language">
        <button type="button" class="ck-tabs__b" data-ck-lang="en" aria-pressed="true">EN</button>
        <button type="button" class="ck-tabs__b" data-ck-lang="es" aria-pressed="false">ES</button>
      </div>
      <div class="ck-bi__card">
        <p class="ck-bi__mark" data-ck-word="en" lang="en">${word(m.en)}</p>
        <p class="ck-bi__mark" data-ck-word="es" lang="es">${word(m.es)}</p>
        <p class="ck-bi__line" data-ck-word="en" lang="en">${esc(m.en.line)}</p>
        <p class="ck-bi__line" data-ck-word="es" lang="es">${esc(m.es.line)}</p>
      </div>
    </div>`;
  }
};

/* ---------- the brand system strip: palette, voice, lists from the wall ---------- */
function brandStrip(slug) {
  const ps = (wall[slug]?.pieces || []);
  const pal = ps.find((p) => p.kind === 'palette');
  const voices = ps.filter((p) => p.kind === 'voice').slice(0, 2);
  const steps = ps.filter((p) => p.kind === 'step');
  const list = ps.find((p) => p.kind === 'list');
  if (!pal && !voices.length && !steps.length && !list) return '';
  return `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'The brand system', sub: 'The parts that make it repeatable.' })}
    ${steps.length ? `<div class="ck-steps">${steps.map((s) => `<div class="ck-steps__i" data-reveal><p class="k-label k-label--dim">${esc(s.n)}</p><h3 class="ck-steps__t">${esc(s.t)}</h3><p class="k-dim">${esc(s.d)}</p></div>`).join('')}</div>` : ''}
    ${pal ? `
    <div class="ck-pal" data-reveal>
      <p class="k-label k-label--dim">${esc(pal.label)}</p>
      <div class="ck-pal__row">${pal.colors.map(([n, hex]) => `<div class="ck-pal__sw" style="--sw:${hex}" title="${esc(n || hex)}"><span>${esc(n || '')}</span><code>${esc(hex)}</code></div>`).join('')}</div>
    </div>` : ''}
    ${voices.length ? `<div class="ck-voices">${voices.map((v) => `<figure class="ck-voices__i" data-reveal><figcaption class="k-label k-label--dim">${esc(v.label)}</figcaption><p>“${esc(v.text)}”</p></figure>`).join('')}</div>` : ''}
    ${list ? `<div style="margin-top:28px"><p class="k-label k-label--dim">${esc(list.label)}</p><ul class="ck-brands" style="margin-top:12px">${list.items.map((x) => `<li><b>${esc(x)}</b></li>`).join('')}</ul></div>` : ''}
  </div>
</section>`;
}

/** Everything playable for a case, in page order. */
export function caseKitSections(c) {
  const kit = kitFor(c.slug);
  return `
${kit.signature ? signature(kit.signature) : ''}
${kit.modules.map((m) => `
<section class="k-section k-section--line ck-mod ck-mod--${m.type}">
  <div class="k-wrap">
    ${m.title ? head({ title: m.title, sub: m.sub }) : ''}
    ${M[m.type](m)}
  </div>
</section>`).join('')}
${brandStrip(c.slug)}`;
}
