import { esc } from '../templates/layout.js';
import { head, hero, caseCard, ctaBand, kpiCard, metaStrip } from '../templates/blocks.js';
import { cases, bySlug } from '../data/cases.js';
import { services, serviceBySlug } from '../data/services.js';

/* ---------- /work — filterable proof wall -------------------------------- */
export function workIndex() {
  const body = `
${hero({
    eyebrow: 'Selected work · nine projects',
    title: 'The proof wall',
    lede: 'Every figure here was confirmed in writing by the client. Where a project has no number, it has no number — we would rather show you a project honestly than decorate it. Filter by the capability that carried the work.',
    ctas: [{ label: 'Book a call', href: '/book', track: 'cta_work_hero_book' }]
  })}

<section class="k-section">
  <div class="k-wrap">
    <div class="k-filters" role="group" aria-label="Filter projects by service">
      <button class="k-filter" data-filter="all" aria-pressed="true">All work</button>
      ${services.map((s) => `<button class="k-filter" data-filter="${s.slug}" aria-pressed="false">${esc(s.name)}</button>`).join('')}
    </div>
    <p class="k-label k-label--dim" style="margin-top:18px" data-wall-count>${cases.length} projects</p>
    <div class="k-grid k-g3" data-wall style="margin-top:22px">
      ${cases.map((c) => caseCard(c)).join('')}
    </div>
  </div>
</section>

${ctaBand({
    num: '02',
    title: 'Recognise<br>your situation?',
    lede: 'Most of these started with a version of the same call. Thirty minutes, and you leave with the first thing we would do — regardless of who does it.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_work_band_book' },
    secondary: { label: 'Request a brand review', href: '/brand-review', track: 'cta_work_band_review' }
  })}`;

  return {
    path: '/work',
    title: 'Work',
    description: 'Nine projects across brand, website, automation and campaigns — with verified results, filterable by capability.',
    body
  };
}

/* ---------- /work/[slug] — case study ------------------------------------ */
export function casePage(slug) {
  const c = bySlug(slug);
  const tierLabel = { 1: 'Flagship case study', 2: 'Case study', 3: 'Project' }[c.tier];

  const body = `
<header class="k-section k-glow" style="padding-top:clamp(48px,7vw,84px)">
  <div class="k-wrap">
    <p class="k-eyebrow">${esc(tierLabel)} · ${esc(c.client)}</p>
    <h1 class="k-split-text" style="margin-top:20px;font-size:var(--k-t-xxl);max-width:18ch">${esc(c.headline)}</h1>
    <p class="k-lede" style="margin-top:26px;max-width:58ch">${esc(c.summary)}</p>
    ${metaStrip([
      { k: 'Client', v: c.client },
      { k: 'Industry', v: c.industry },
      { k: 'Engagement', v: c.year },
      { k: 'Services', v: c.services.map((s) => serviceBySlug(s)?.name || s).join(', ') }
    ])}
  </div>
</header>

${c.metrics.length ? `
<section class="k-section">
  <div class="k-wrap">
    <div class="k-grid k-g${Math.min(c.metrics.length, 3)}">
      ${c.metrics.map((m) => kpiCard(m)).join('')}
    </div>
    <p class="k-label k-label--dim" style="margin-top:20px">Figures confirmed in writing by ${esc(c.client)}.</p>
  </div>
</section>` : ''}

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '01', title: 'Situation' })}
    <div class="k-prose k-body-copy k-lede">${c.situation.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'Diagnosis', sub: 'The part that decided everything else. Prospects recognise themselves in constraints, not in triumphs.' })}
    <div class="k-prose k-body-copy k-lede">${c.diagnosis.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '03', title: 'The system', sub: 'Built in sequence. Each piece assumes the one above it is settled.' })}
    <div class="k-rows">
      ${c.system.map((s, i) => `
      <div class="k-row" data-reveal="${i * 50}">
        <div class="k-row__t"><span class="k-num">${String(i + 1).padStart(2, '0')}</span><h3 style="margin-top:10px">${esc(s.t)}</h3></div>
        <div style="grid-column:span 2"><p class="k-dim">${esc(s.d)}</p></div>
      </div>`).join('')}
    </div>
    <div class="k-tags" style="margin-top:24px">
      ${c.services.map((s) => `<a class="k-tag k-tag--out" href="/services/${s}" style="text-decoration:none" data-track="cta_case_service">${esc(serviceBySlug(s)?.name || s)} &rarr;</a>`).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '04', title: 'Result' })}
    <p class="k-lede k-prose">${esc(c.result)}</p>
    ${c.quote ? `
    <blockquote class="k-callout" style="margin-top:30px">
      <p style="font-size:var(--k-t-lede)">&ldquo;${esc(c.quote.text)}&rdquo;</p>
      <p class="k-label k-label--dim" style="margin-top:16px">${esc(c.quote.name)}${c.quote.role ? ' — ' + esc(c.quote.role) : ''}</p>
    </blockquote>` : `
    <!-- Client quote pending. Per the proof standard, we publish nothing
         attributed until it is confirmed in writing. -->`}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '05', title: 'What’s next' })}
    <p class="k-lede k-prose">${esc(c.next)}</p>
  </div>
</section>

${ctaBand({
    num: '06',
    title: 'Similar situation?',
    lede: `We will look at yours the way we looked at ${esc(c.client)}’s — the constraints first, the pretty part last. Thirty minutes and you leave with the first move, whether or not we make it together.`,
    primary: { label: 'Request a brand review', href: `/brand-review?industry=${encodeURIComponent(c.industry)}`, track: 'cta_case_review' },
    secondary: { label: 'Book a call instead', href: '/book', track: 'cta_case_book' }
  })}

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '07', title: 'More work' })}
    <div class="k-grid k-g3">
      ${cases.filter((x) => x.slug !== c.slug).slice(0, 3).map((x) => caseCard(x, { compact: true })).join('')}
    </div>
  </div>
</section>`;

  return {
    path: `/work/${c.slug}`,
    title: `${c.client} — ${c.headline}`,
    description: c.summary,
    body,
    stickySecondary: { label: 'Brand review', href: '/brand-review' },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.headline,
      about: c.client,
      articleSection: 'Case study'
    }
  };
}

export const casePages = () => cases.map((c) => casePage(c.slug));
