import { esc } from '../templates/layout.js';
import { head, hero, caseCard, ctaBand, kpiCard, metaStrip } from '../templates/blocks.js';
import { cases, bySlug, listed } from '../data/cases.js';
import { explorerJSON } from '../data/explorer.js';
import { wall } from '../data/wall.js';
import { caseHeroBand, caseKitSections, pick } from '../templates/casekit.js';
import { shownStudio, DISCIPLINES } from '../data/studio.js';
import { hasMedia, mediaUrl } from '../data/media.js';
import { services, serviceBySlug } from '../data/services.js';


/* ---------- More from the studio: work beyond the case studies ---------- */
const STATUS = { live: 'Live', handoff: 'Design handoff', concept: 'Concept' };
const asList = (x) => (Array.isArray(x) ? x : [x]);
function studioCard(p) {
  const cover = pick(p.cover);
  const shots = (p.gallery || []).map(([src, cap]) => [pick(asList(src)), cap]).filter(([src]) => src);
  // preload="none" keeps every byte of video off first paint. The footer
  // vitals are a published promise, so /work must not carry film it has not
  // been asked for.
  const films = (p.videos || [])
    .map(([v, cap]) => [v, pick(asList(v.poster)), cap])
    .filter(([v]) => hasMedia(v.src));
  const discs = DISCIPLINES.filter(([k]) => p.disc.includes(k)).map(([, v]) => v).join(' · ');
  return `
  <details class="st-card" data-disc="${p.disc.join(' ')}">
    <summary class="st-card__s" data-bubble="Open">
      <span class="st-cover${cover ? '' : ' st-type st-type--' + p.tone}">${cover ? `<img src="${mediaUrl(cover)}" alt="" loading="lazy" decoding="async">` : `<span>${esc(p.name)}</span>`}
        ${p.status ? `<em class="st-badge st-badge--${p.status}">${STATUS[p.status]}</em>` : ''}</span>
      <span class="st-meta"><b>${esc(p.name)}</b><small>${esc([p.where, discs].filter(Boolean).join(' · '))}</small></span>
    </summary>
    <div class="st-body">
      <p class="st-sum">${esc(p.summary)}</p>
      ${p.body ? `<p class="k-dim" style="margin-top:10px">${esc(p.body)}</p>` : ''}
      ${p.deliverables?.length ? `<ul class="st-dl">${p.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
      ${shots.length ? `<div class="st-gal">${shots.map(([src, cap]) => `<figure><img src="${mediaUrl(src)}" alt="${esc(p.name + ': ' + cap)}" loading="lazy" decoding="async"><figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>` : ''}
      ${films.length ? `<div class="st-gal">${films.map(([v, poster, cap]) => `<figure><video controls preload="none" playsinline${poster ? ` poster="${mediaUrl(poster)}"` : ''} aria-label="${esc(p.name + ': ' + cap)}"><source src="${mediaUrl(v.src)}" type="video/mp4"></video><figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>` : ''}
      ${p.url ? `<p style="margin-top:16px"><a class="k-link" href="${esc(p.url)}" target="_blank" rel="noopener" data-track="cta_studio_visit">Visit ${esc(p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></p>` : ''}
    </div>
  </details>`;
}
export function studioSection() {
  const items = shownStudio();
  if (!items.length) return '';
  return `
<section class="k-section k-section--line" id="studio">
  <div class="k-wrap">
    ${head({ title: 'More from<br>the studio', sub: 'Brands, websites, campaigns and products beyond the case studies. Open any of them.' })}
    <div class="st-filters" role="group" aria-label="Filter by discipline" data-st-filters hidden>
      <button type="button" class="ck-tabs__b" data-st="all" aria-pressed="true">All <sup>${items.length}</sup></button>
      ${DISCIPLINES.map(([k, v]) => { const n = items.filter((p) => p.disc.includes(k)).length; return n ? `<button type="button" class="ck-tabs__b" data-st="${k}" aria-pressed="false">${v} <sup>${n}</sup></button>` : ''; }).join('')}
    </div>
    <div class="st-grid" data-st-grid>${items.map(studioCard).join('')}</div>
  </div>
</section>`;
}

/* ---------- /work — filterable proof wall -------------------------------- */
export function workIndex() {

  const body = `
${hero({
    eyebrow: `Selected case studies · ${listed().length} projects`,
    title: 'The proof wall',
    lede: 'Every figure here was confirmed in writing by the client. Where a project has no number, it has no number. We would rather show you a project honestly than decorate it. Explore all of it at once, or filter by the capability that carried the work.',
    ctas: [
      { label: 'Explore the wall', href: '#wall', track: 'cta_work_hero_explore', extra: 'data-explore' },
      { label: 'Book a call', href: '/book', style: 'k-btn--ghost', track: 'cta_work_hero_book' }
    ]
  })}

<section class="k-section" id="wall">
  <div class="k-wrap">
    <div class="k-filters" role="group" aria-label="Filter projects by service">
      <button class="k-filter" data-filter="all" aria-pressed="true">All work</button>
      ${services.map((s) => `<button class="k-filter" data-filter="${s.slug}" aria-pressed="false">${esc(s.name)}</button>`).join('')}
    </div>
    <p class="k-label k-label--dim" style="margin-top:18px" data-wall-count>${listed().length} projects</p>
    <div class="k-grid k-g3" data-wall style="margin-top:22px">
      ${listed().map((c) => caseCard(c)).join('')}
    </div>
  </div>
</section>

<script type="application/json" id="k-cases-data">${explorerJSON()}</script>

${studioSection()}

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
    description: `${listed().length} case studies across brand, website, automation and campaigns, with their results, filterable by capability.`,
    scripts: ['/assets/widgets/work-explorer.js', '/assets/widgets/case-kit.js'],
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
    ${c.logo && hasMedia(c.logo.light) ? `<img class="ck-logo" src="${mediaUrl(c.logo.light)}" alt="${esc(c.client)}">` : ''}
    <p class="k-eyebrow">${esc(tierLabel)} · ${esc(c.client)}${c.tagline ? ` · “${esc(c.tagline.replace(/[“”"]/g, ''))}”` : ''}</p>
    <h1 class="k-split-text" style="margin-top:20px;font-size:var(--k-t-xxl);max-width:18ch">${esc(c.headline)}</h1>
    <p class="k-lede" style="margin-top:26px;max-width:58ch">${esc(c.summary)}</p>
    ${c.url ? `<p style="margin-top:20px"><a class="k-link" href="${esc(c.url)}" rel="noopener" target="_blank">Visit ${esc(c.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a></p>` : ''}
    ${metaStrip([
      { k: 'Client', v: c.client },
      { k: 'Industry', v: c.industry },
      { k: c.location ? 'Location' : 'Engagement', v: c.location || c.year },
      { k: 'Services', v: c.services.map((s) => serviceBySlug(s)?.name || s).join(', ') }
    ].filter((m) => m.v))}
  </div>
</header>

${caseHeroBand(c)}

${c.metrics.length ? `
<section class="k-section">
  <div class="k-wrap">
    <div class="k-grid k-g${Math.min(c.metrics.length, 3)}">
      ${c.metrics.map((m) => kpiCard(m)).join('')}
    </div>
    <p class="k-label k-label--dim" style="margin-top:20px">${esc(c.metricsNote || `Figures confirmed in writing by ${c.client}.`)}</p>
  </div>
</section>` : ''}

${caseKitSections(c)}

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

${(() => {
    const shots = (wall[c.slug]?.media || []).filter((m) => hasMedia(m.src));
    return shots.length ? `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'The work', sub: shots.length + ' pieces from the project.' })}
    <div class="k-gallery ck-gallery">
      ${shots.map((m) => `<figure${m.logo ? ' class="is-logo"' : ''}><img src="${mediaUrl(m.src)}" alt="${esc(m.alt)}" loading="lazy" decoding="async"><figcaption>${esc(m.caption)}</figcaption></figure>`).join('')}
    </div>
    ${(() => {
      // Same deal as the studio cards: poster frame, preload="none", nothing
      // on the wire until someone presses play.
      const films = (wall[c.slug]?.videos || []).filter((v) => hasMedia(v.src));
      return films.length ? `
    <div class="k-gallery ck-gallery" style="margin-top:18px">
      ${films.map((v) => `<figure><video controls preload="none" playsinline${hasMedia(v.poster) ? ` poster="${mediaUrl(v.poster)}"` : ''} aria-label="${esc(c.client + ': ' + v.caption)}"><source src="${mediaUrl(v.src)}" type="video/mp4"></video><figcaption>${esc(v.caption)}</figcaption></figure>`).join('')}
    </div>` : '';
    })()}
  </div>
</section>` : '';
  })()}

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

${c.next ? `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '05', title: 'What’s next' })}
    <p class="k-lede k-prose">${esc(c.next)}</p>
  </div>
</section>
` : ''}

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
      ${listed().filter((x) => x.slug !== c.slug).slice(0, 3).map((x) => caseCard(x, { compact: true })).join('')}
    </div>
  </div>
</section>`;

  return {
    path: `/work/${c.slug}`,
    title: `${c.client} — ${c.headline}`,
    description: c.summary,
    body,
    scripts: ['/assets/widgets/case-kit.js'],
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
