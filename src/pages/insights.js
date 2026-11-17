import { esc } from '../templates/layout.js';
import { head, hero, caseCard, ctaBand } from '../templates/blocks.js';
import { articles, articleBySlug } from '../data/insights.js';
import { bySlug } from '../data/cases.js';
import { serviceBySlug } from '../data/services.js';
import { site } from '../data/site.js';

/* ---------- /insights — index ------------------------------------------- */
export function insightsIndex() {
  const body = `
${hero({
    eyebrow: 'Insights',
    title: 'Answers,<br>not think-pieces',
    lede: '<b>Every article here answers one question in its first paragraph and then earns it.</b> Structured that way on purpose, so an answer engine can quote the answer, and so you can leave after the first paragraph if that is all you needed.'
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap">
    <div class="k-grid k-g2">
      ${articles.map((a, i) => `
      <a class="k-card k-card--accent" href="/insights/${a.slug}" data-reveal="${i * 50}" data-bubble="Read" data-track="cta_insight_card">
        <h4 class="k-label--dim">${esc(a.tag)} &middot; ${esc(a.read)} read</h4>
        <h3 style="margin-top:12px;max-width:22ch">${esc(a.q)}</h3>
        <p class="k-dim" style="margin-top:14px">${esc(a.a)}</p>
        <p style="margin-top:18px"><span class="k-link">Read the answer</span></p>
      </a>`).join('')}
    </div>
    <div class="k-callout" style="margin-top:30px">
      <h4 class="k-label--yellow">Why the answer comes first</h4>
      <p style="margin-top:10px;max-width:66ch">Search is increasingly answered rather than listed. An article that buries its conclusion under six hundred words of preamble does not get quoted, and a page nobody quotes does not get found. The structure is the SEO.</p>
    </div>
  </div>
</section>

${ctaBand({
    title: 'Or ask us<br>directly',
    lede: 'Reading is slower than asking. Thirty minutes and we will answer the version of the question that is actually yours.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_insights_band_book' },
    secondary: { label: 'Test your signal', href: '/the-kija-method', track: 'cta_insights_band_signal' }
  })}`;

  return {
    path: '/insights',
    title: 'Insights',
    description: 'Direct answers to the questions that come up before a brand, website or campaign project — structured to be quoted, not just indexed.',
    body,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: articles.map((a) => ({ '@type': 'Question', name: a.q, url: `${site.url}/insights/${a.slug}`, acceptedAnswer: { '@type': 'Answer', text: a.answer } }))
    }
  };
}

/* ---------- /insights/<slug> — one answer ------------------------------- */
export function articlePage(slug) {
  const a = articleBySlug(slug);
  const svc = serviceBySlug(a.service);
  const rel = bySlug(a.related);
  const quoted = a.quoteFrom ? bySlug(a.quoteFrom) : null;
  const others = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  const body = `
${hero({
    eyebrow: `Insights · ${a.tag} · ${a.read} read`,
    title: esc(a.q),
    lede: `<b>${esc(a.answer)}</b>`
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap k-article">
    <div class="k-article__body k-body-copy">
      ${a.sections.map((s) => `
      <h2 class="k-article__h">${esc(s.h)}</h2>
      ${s.p.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
      ${quoted && quoted.quote ? `
      <blockquote class="k-article__quote">
        <p>“${esc(quoted.quote.text)}”</p>
        <footer>${esc(quoted.quote.name)}, ${esc(quoted.quote.role)}</footer>
      </blockquote>` : ''}
    </div>
    <aside class="k-article__aside">
      <div class="k-callout">
        <h4>In short</h4>
        <ul class="k-list" style="margin-top:12px">${a.inShort.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <p class="k-label k-label--dim" style="margin-top:26px">Where this sits</p>
      <p style="margin-top:6px"><a class="k-link" href="/services/${svc.slug}">${esc(svc.name)}</a></p>
      ${a.extraLink ? `<p style="margin-top:10px"><a class="k-link" href="${a.extraLink.href}">${esc(a.extraLink.label)}</a></p>` : ''}
    </aside>
  </div>
</section>

${rel ? `
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'Where we did this', sub: rel.summary })}
    <div class="k-grid k-g2">${caseCard(rel)}</div>
  </div>
</section>` : ''}

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'More answers' })}
    <div class="k-grid k-g3">
      ${others.map((o) => `
      <a class="k-card k-card--accent" href="/insights/${o.slug}" data-bubble="Read" data-track="cta_insight_more">
        <h4 class="k-label--dim">${esc(o.tag)}</h4>
        <h3 style="margin-top:10px">${esc(o.q)}</h3>
        <p style="margin-top:16px"><span class="k-link">Read the answer</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>

${ctaBand({
    title: 'Ask the version<br>that is yours',
    lede: 'Thirty minutes. We will tell you what we would do first and why, whether or not you hire us to do it.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_insight_band_book' },
    secondary: { label: 'Free brand review', href: '/brand-review', track: 'cta_insight_band_review' }
  })}`;

  return {
    path: `/insights/${a.slug}`,
    title: a.q,
    description: a.answer,
    body,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Article', headline: a.q, description: a.answer, articleSection: a.tag,
        author: { '@type': 'Organization', name: site.name, url: site.url }, publisher: { '@type': 'Organization', name: site.name } },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: a.q, acceptedAnswer: { '@type': 'Answer', text: a.answer } }] }
    ]
  };
}

export const articlePages = () => articles.map((a) => articlePage(a.slug));
