import { esc } from './layout.js';
import { bySlug } from '../data/cases.js';
import { serviceBySlug } from '../data/services.js';

/* ---------- section head -------------------------------------------------- */
export const head = ({ num, title, sub, id }) => `
<div class="k-head-block"${id ? ` id="${id}"` : ''}>
  <div class="k-head">${num ? `<span class="k-num">${esc(num)}</span>` : ''}<h2>${title}</h2></div>
  ${sub ? `<p class="k-lede" style="margin-top:16px">${sub}</p>` : ''}
</div>`;

/* ---------- hero ---------------------------------------------------------- */
export const hero = ({ eyebrow, title, lede, ctas = [], meta, glow = true }) => `
<header class="k-section${glow ? ' k-glow' : ''}" style="padding-top:clamp(56px,8vw,104px)">
  <div class="k-wrap">
    ${eyebrow ? `<p class="k-eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="k-split-text" style="margin-top:22px;font-size:var(--k-t-mega)">${title}</h1>
    ${lede ? `<p class="k-lede" style="margin-top:28px;max-width:62ch">${lede}</p>` : ''}
    ${ctas.length ? `<div class="k-btns" style="margin-top:34px">${ctas.map(cta).join('')}</div>` : ''}
    ${meta ? metaStrip(meta) : ''}
  </div>
</header>`;

export const cta = (c) =>
  `<a class="k-btn ${c.style || 'k-btn--primary'} k-btn--lg" href="${c.href}"${c.track ? ` data-track="${c.track}"` : ''}>${esc(c.label)}${c.arrow === false ? '' : ' <span class="k-btn__arrow">&rarr;</span>'}</a>`;

export const metaStrip = (items) => `
<dl class="k-meta" style="margin-top:44px">
  ${items.map((i) => `<div><dt>${esc(i.k)}</dt><dd>${esc(i.v)}</dd></div>`).join('')}
</dl>`;

/* ---------- case card ----------------------------------------------------- */
export const caseCard = (c, { compact = false } = {}) => `
<a class="k-card k-case" href="/work/${c.slug}" data-services="${c.services.join(' ')}" style="padding:0;overflow:hidden" data-track="cta_case_card">
  <div class="k-case__thumb" style="background:linear-gradient(150deg,${c.thumb.from},${c.thumb.to})">
    <span>${esc(c.thumb.word).replace(/\n/g, '<br>')}</span>
  </div>
  <div class="k-case__body">
    <p class="k-label k-label--dim">${esc(c.client)} &middot; ${esc(c.industry)}</p>
    <h3>${esc(c.headline)}</h3>
    ${!compact ? `<p class="k-dim k-sm">${esc(c.summary)}</p>` : ''}
    ${c.metrics.length ? `<div class="k-tags">${c.metrics.map((m) => `<span class="k-tag k-tag--mint">${esc(m.value)} ${esc(m.label)}</span>`).join('')}</div>`
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
    <p style="margin-top:26px"><a class="k-link" href="/work" data-track="cta_all_work">See all nine projects</a></p>
  </div>
</section>`;

/* ---------- process steps ------------------------------------------------- */
export const steps = (items) => `
<div class="k-steps">
  ${items.map((s, i) => `
  <div class="k-step">
    <div class="k-step__n">Step ${String(i + 1).padStart(2, '0')}</div>
    <div class="k-step__b">
      <h3>${esc(s.t)}</h3>
      <p class="k-dim">${esc(s.d)}</p>
      ${s.out ? `<p class="k-label k-label--dim">Deliverable — <span class="k-mint">${esc(s.out)}</span></p>` : ''}
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

/* ---------- closing CTA band ---------------------------------------------- */
export const ctaBand = ({ title, lede, primary, secondary, num = '08' }) => `
<section class="k-section k-section--line k-glow k-glow--mint">
  <div class="k-wrap">
    <div class="k-head"><span class="k-num">${esc(num)}</span><h2 class="k-split-text k-split-text--sm">${title}</h2></div>
    ${lede ? `<p class="k-lede" style="margin-top:18px;max-width:56ch">${lede}</p>` : ''}
    <div class="k-btns" style="margin-top:32px">
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
  <div class="k-kpi k-kpi--mag">${esc(m.value)}</div>
  <div class="k-kpi__l">${esc(m.label)}</div>
  ${sub ? `<p class="k-dim k-sm" style="margin-top:14px">${esc(sub)}</p>` : ''}
</div>`;
