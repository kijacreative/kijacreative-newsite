import { esc } from '../templates/layout.js';
import { head, hero, cards, steps, objections, matchedProof, ctaBand } from '../templates/blocks.js';
import { services } from '../data/services.js';

/* ---------- /services — the system, not a menu --------------------------- */
export function servicesIndex() {
  const body = `
${hero({
    eyebrow: 'Capabilities',
    title: 'Not a menu.<br>A sequence.',
    lede: 'Five capability lines that only work in order. You can enter at any point, but you cannot skip a step and expect the one after it to hold. Every page below states where it sits and what it assumes is already done — which is also how we stop scope creeping after the contract is signed.',
    ctas: [
      { label: 'Book a call', href: '/book', track: 'cta_services_hero_book' },
      { label: 'Not sure where you sit?', href: '/fit-finder', style: 'k-btn--ghost', track: 'cta_services_hero_fitfinder' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({
      num: '01',
      title: 'The sequence',
      sub: 'Brand before digital presence. Brand before website. Website before paid. Break the order and you pay twice — once to build it, once to rebuild it on a foundation that was not ready.'
    })}
    <div class="k-rows">
      ${services.map((s, i) => `
      <a class="k-row" href="/services/${s.slug}" style="text-decoration:none" data-track="cta_services_line" data-reveal="${i * 50}">
        <div class="k-row__t">
          <span class="k-tag k-tag--out">Sequence: ${esc(s.sequence)}</span>
          <h3 style="margin-top:14px">${esc(s.name)}</h3>
          <p class="k-dim k-sm" style="margin-top:12px">${esc(s.lede)}</p>
        </div>
        <div>
          <h4>The problem</h4>
          <p class="k-dim" style="margin-top:10px">${esc(s.problem)}</p>
        </div>
        <div>
          <h4>Assumes</h4>
          <p class="k-dim k-sm" style="margin-top:10px">${esc(s.assumes)}</p>
          <p style="margin-top:16px"><span class="k-link">Read the page</span></p>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '02',
      title: 'How we are different,<br>demonstrated',
      sub: 'Every line above has a live artifact on this site. Not a description of our expertise — the expertise itself, running, before you pay for any of it.'
    })}
    ${cards(services.map((s) => ({
      label: s.name, title: s.demo.t, accent: 'accent',
      body: `${esc(s.demo.d.split('. ')[0])}. <a class="k-link" href="${s.demo.cta.href}">${esc(s.demo.cta.label)}</a>`
    })))}
  </div>
</section>

${ctaBand({
    num: '03',
    title: 'Start where<br>it actually hurts',
    lede: 'If you already know, book the call. If you do not, the Fit Finder takes six questions and tells you honestly — including when the answer is "not yet" or "not us".',
    primary: { label: 'Book a call', href: '/book', track: 'cta_services_band_book' },
    secondary: { label: 'Run the Fit Finder', href: '/fit-finder', track: 'cta_services_band_fitfinder' }
  })}`;

  return {
    path: '/services',
    title: 'Services',
    description: 'Creative strategy, brand development, website design, marketing automation and ongoing marketing — one system, run in sequence.',
    body
  };
}

/* ---------- /services/[slug] — the eight-block skeleton ------------------ */
export function servicePage(slug) {
  const s = services.find((x) => x.slug === slug);

  const body = `
<!-- BLOCK 1 — problem hero (their words, not ours) -->
${hero({
    eyebrow: `${esc(s.name)} · sequence: ${esc(s.sequence)}`,
    title: esc(s.problem),
    lede: `<b>${esc(s.lede)}</b>`,
    ctas: [
      { label: 'Book a call', href: '/book', track: `cta_${slug}_hero_book` },
      { label: s.secondaryCta.label, href: s.secondaryCta.href, style: 'k-btn--ghost', track: `cta_${slug}_hero_secondary` }
    ]
  })}

<!-- BLOCK 2 — cost of inaction -->
<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '02', title: 'What it costs<br>to leave it', sub: 'Three consequences, all of them things you are already paying for whether or not the line item exists.' })}
    ${cards(s.costs.map((c) => ({ title: c.t, body: esc(c.d), accent: 'warn' })))}
  </div>
</section>

<!-- BLOCK 3 — where it sits in the sequence -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '03', title: 'Where this sits' })}
    <div class="k-grid k-g2">
      <div class="k-card k-card--accent">
        <h4>Position in the sequence</h4>
        <h3 style="margin-top:12px">Runs ${esc(s.sequence)}</h3>
        <p class="k-dim" style="margin-top:14px">${esc(s.sequenceNote)}</p>
      </div>
      <div class="k-card k-card--mag">
        <h4 class="k-label--mag">What it assumes</h4>
        <h3 style="margin-top:12px">Before we start</h3>
        <p class="k-dim" style="margin-top:14px">${esc(s.assumes)}</p>
        <p style="margin-top:16px"><a class="k-link" href="/services">See the whole sequence</a></p>
      </div>
    </div>
  </div>
</section>

<!-- BLOCK 4 — how we work it, with the actual artifacts named -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '04', title: 'How we work it', sub: 'Four steps, with the real deliverable named at each one. If a step does not produce something you can hold, it is not a step.' })}
    ${steps(s.process)}
  </div>
</section>

<!-- BLOCK 5 — live demonstration (the block that separates us) -->
<section class="k-section k-section--line k-glow k-glow--mint">
  <div class="k-wrap">
    ${head({ num: '05', title: 'Proof you can<br>check right now' })}
    <div class="k-card k-card--accent" style="padding:clamp(24px,4vw,44px)">
      <h4>Live demonstration</h4>
      <h3 class="k-h3-lg" style="margin-top:14px">${esc(s.demo.t)}</h3>
      <p class="k-lede" style="margin-top:16px;max-width:60ch">${esc(s.demo.d)}</p>
      <div class="k-btns" style="margin-top:26px">
        <a class="k-btn k-btn--primary" href="${s.demo.cta.href}" data-track="cta_${slug}_demo">${esc(s.demo.cta.label)} <span class="k-btn__arrow">&rarr;</span></a>
      </div>
    </div>
    ${s.demo.embed === 'signal-test' ? `
    <div style="margin-top:32px">
      <p class="k-label" style="margin-bottom:16px">Or start it here — no email required to see your score</p>
      <div class="k-widget" data-kija-widget="signal-test">
        <div class="k-widget__skel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
    </div>` : ''}
  </div>
</section>

<!-- BLOCK 6 — matched proof -->
${matchedProof(s.proof)}

<!-- BLOCK 7 — objections -->
${objections(s.objections)}

<!-- BLOCK 8 — dual CTA -->
${ctaBand({
    num: '08',
    title: 'Book the call,<br>or check us first',
    lede: 'Both doors lead to the same place. One is just faster than the other.',
    primary: { label: 'Book a call', href: '/book', track: `cta_${slug}_band_book` },
    secondary: { label: s.secondaryCta.label, href: s.secondaryCta.href, track: `cta_${slug}_band_secondary` }
  })}`;

  return {
    path: `/services/${s.slug}`,
    title: s.name,
    description: `${s.problem} ${s.lede}`,
    body,
    scripts: s.demo.embed === 'signal-test' ? ['/assets/widgets/brand-signal-test.js'] : [],
    stickySecondary: { label: s.secondaryCta.label, href: s.secondaryCta.href },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      description: s.lede,
      provider: { '@type': 'Organization', name: 'Kija Creative' }
    }
  };
}

export const servicePages = () => services.map((s) => servicePage(s.slug));
