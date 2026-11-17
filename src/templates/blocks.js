import { esc } from './layout.js';
import { bySlug, listed } from '../data/cases.js';
import { serviceBySlug } from '../data/services.js';

/* ---------- section head --------------------------------------------------
   Heading left, lede right on wide screens. `num` is accepted for backwards
   compatibility but no longer rendered — the sections are not a sequence. */
export const head = ({ title, sub, id }) => `
<div class="k-head-block${sub ? '' : ' k-head-block--solo'}"${id ? ` id="${id}"` : ''}>
  <h2>${title}</h2>
  ${sub ? `<p class="k-lede">${sub}</p>` : ''}
</div>`;

/* ---------- hero ----------------------------------------------------------
   `fault: true` sets the title in the fault-line treatment (homepage only):
   each <br>-separated line is printed twice and the lower slice knocked out
   of register. The first copy is the accessible one; the second is hidden. */
const faultTitle = (title) => `<span class="k-fault">${title.split(/<br\s*\/?>/i).map((l) =>
  `<span class="k-fault__l"><span class="k-fault__a">${l}</span><span class="k-fault__b" aria-hidden="true">${l}</span></span>`).join('')}</span>`;

export const hero = ({ eyebrow, title, lede, ctas = [], meta, fault = false }) => `
<header class="k-section" style="padding-top:${fault ? 'clamp(32px,4vw,56px)' : 'clamp(48px,7vw,104px)'}">
  <div class="k-wrap">
    ${eyebrow ? `<p class="k-eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="${fault ? '' : 'k-split-text'}" style="margin-top:${fault ? '18px' : '22px'};${fault ? '' : 'font-size:var(--k-t-mega)'}">${fault ? faultTitle(title) : title}</h1>
    ${lede ? `<p class="k-lede" style="margin-top:${fault ? '32px' : '28px'};max-width:58ch">${lede}</p>` : ''}
    ${ctas.length ? `<div class="k-btns" style="margin-top:${fault ? '28px' : '36px'}">${ctas.map((c, i) => cta(fault && i === 0 ? { ...c, extra: 'data-fault-fix' } : c)).join('')}</div>` : ''}
    ${meta ? metaStrip(meta) : ''}
  </div>
</header>`;

/* Primary CTAs are magnetic (motion.js). `extra` adds raw attributes, e.g.
   data-fault-fix on the homepage hero CTA. */
export const cta = (c) => {
  const style = c.style || 'k-btn--primary';
  const magnetic = style === 'k-btn--primary' ? ' data-magnetic' : '';
  return `<a class="k-btn ${style} k-btn--lg" href="${c.href}"${c.track ? ` data-track="${c.track}"` : ''}${magnetic}${c.extra ? ' ' + c.extra : ''}>${esc(c.label)}</a>`;
};

export const metaStrip = (items) => `
<dl class="k-meta" style="margin-top:clamp(48px,6vw,80px)">
  ${items.map((i) => `<div><dt>${esc(i.k)}</dt><dd>${esc(i.v)}</dd></div>`).join('')}
</dl>`;

/* ---------- case card -----------------------------------------------------
   Typographic thumbnails by design (no stock photography). Metrics render as
   numbers, not mint pills — mint is reserved for things you can click. */
export const caseCard = (c, { compact = false, feature = false } = {}) => `
<a class="k-card k-case${feature ? ' k-case--feature' : ''}" href="/work/${c.slug}" data-services="${c.services.join(' ')}" data-track="cta_case_card" data-bubble="View case" data-tilt="${feature ? 2.5 : 5}">
  <div class="k-case__thumb k-case__thumb--${esc(c.thumb.tone || 'plum')}" aria-hidden="true">
    <span data-tilt-depth="${feature ? 2 : 1.4}">${esc(c.thumb.word).replace(/\n/g, '<br>')}</span>
  </div>
  <div class="k-case__body">
    <p class="k-label k-label--dim">${esc(c.client)}, ${esc(c.industry.toLowerCase())}</p>
    <h3>${esc(c.headline)}</h3>
    ${!compact ? `<p class="k-dim k-sm">${esc(c.summary)}</p>` : ''}
    ${c.metrics.length ? `<div class="k-metrics">${c.metrics.map((m) => `<p class="k-metric"><b data-ticker>${esc(m.value)}</b><span>${esc(m.label)}</span></p>`).join('')}</div>`
      : `<div class="k-tags">${c.services.slice(0, 2).map((s) => `<span class="k-tag k-tag--out">${esc(serviceBySlug(s)?.name || s)}</span>`).join('')}</div>`}
  </div>
</a>`;

/* ---------- matched proof (2 cards, used on every service/package page) ---- */
export const matchedProof = (slugs, title = 'Matched proof') => `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '06', title: esc(title), sub: 'Two projects where this exact work carried the outcome. Verified figures only — everything else runs on what the client will put in writing.' })}
    <div class="k-grid k-g2">
      ${slugs.map((s) => caseCard(bySlug(s))).join('')}
    </div>
    <p style="margin-top:26px"><a class="k-link" href="/work" data-track="cta_all_work">See all ${listed().length} projects</a></p>
  </div>
</section>`;

/* ---------- process steps ------------------------------------------------- */
export const steps = (items) => `
<div class="k-steps">
  ${items.map((s, i) => `
  <div class="k-step">
    <div class="k-step__n">Step ${i + 1}</div>
    <div class="k-step__b">
      <h3>${esc(s.t)}</h3>
      <p class="k-dim">${esc(s.d)}</p>
      ${s.out ? `<p class="k-label k-label--dim">Deliverable: <b style="color:var(--k-aqua)">${esc(s.out)}</b></p>` : ''}
    </div>
  </div>`).join('')}
</div>`;

/* ---------- objections ---------------------------------------------------- */
export const objections = (items, title = 'The objections you were about to raise') => `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '07', title: esc(title) })}
    <div class="k-acc">
      ${items.map((o, i) => `
      <div class="k-acc__item" data-open="${i === 0}">
        <button class="k-acc__q" aria-expanded="${i === 0}"><span>${esc(o.q)}</span><span class="k-acc__ico" aria-hidden="true"></span></button>
        <div class="k-acc__a"><div><p>${esc(o.a)}</p></div></div>
      </div>`).join('')}
    </div>
  </div>
</section>`;

/* ---------- closing CTA band ----------------------------------------------
   The one full-colour block on a page: magenta ground, mint button. */
export const ctaBand = ({ title, lede, primary, secondary }) => `
<section class="k-section k-band">
  <div class="k-wrap">
    <h2>${title}</h2>
    ${lede ? `<p class="k-lede" style="margin-top:24px;max-width:56ch">${lede}</p>` : ''}
    <div class="k-btns" style="margin-top:36px">
      ${cta({ ...primary, style: 'k-btn--primary' })}
      ${secondary ? cta({ ...secondary, style: 'k-btn--ghost' }) : ''}
    </div>
  </div>
</section>`;

/* ---------- generic cards grid -------------------------------------------- */
export const cards = (items, cls = 'k-g3') => `
<div class="k-grid ${cls}">
  ${items.map((c, i) => `
  <div class="k-card${c.accent ? ' k-card--' + c.accent : ''}" data-reveal="${i * 60}">
    ${c.label ? `<h4${c.labelClass ? ` class="${c.labelClass}"` : ''}>${esc(c.label)}</h4>` : ''}
    ${c.title ? `<h3>${esc(c.title)}</h3>` : ''}
    ${c.body ? `<p class="k-dim">${c.body}</p>` : ''}
    ${c.list ? `<ul class="k-list" style="margin-top:14px">${c.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
  </div>`).join('')}
</div>`;

/* ---------- marquee ------------------------------------------------------- */
export const marquee = (items) => {
  const row = items.map((t) => `<span>${t}</span>`).join('');
  return `<div class="k-marquee" aria-hidden="true"><div class="k-marquee__t">${row}${row}</div></div>`;
};

/* ---------- kpi card ------------------------------------------------------ */
export const kpiCard = (m, sub) => `
<div class="k-card k-card--mag">
  <div class="k-kpi k-kpi--mag" data-ticker>${esc(m.value)}</div>
  <div class="k-kpi__l">${esc(m.label)}</div>
  ${sub ? `<p class="k-dim k-sm" style="margin-top:14px">${esc(sub)}</p>` : ''}
</div>`;
