import { esc } from '../templates/layout.js';
import { head, hero, caseCard, ctaBand } from '../templates/blocks.js';
import { abRedirect } from '../templates/layout.js';
import { flagships, listed } from '../data/cases.js';
import { services } from '../data/services.js';
import { offers } from '../data/offers.js';
import { site } from '../data/site.js';

export default function home() {
  const body = `
${hero({
    eyebrow: 'Brand, website, automation and campaigns. Dallas, Texas.',
    title: 'Most brands<br>are broken',
    fault: true,
    lede: '<b>We fix them by building systems, not visuals.</b> Positioning that holds up under pressure, an identity other people can build in, a site that filters instead of documents, and the automation that runs while you sleep. In that order, because the order is the whole point.',
    ctas: [
      { label: 'Book a call', href: '/book', track: 'cta_hero_book' },
      { label: 'Test your brand signal', href: '/the-kija-method', style: 'k-btn--ghost', track: 'cta_hero_signal_test' }
    ],
    meta: [
      { k: 'Based in', v: site.location },
      { k: 'Model', v: 'Growth partner, not vendor' },
      { k: 'Proof', v: '400% revenue growth, owner-operated' },
      { k: 'First step', v: 'A real diagnosis, free' }
    ]
  })}

<!-- ===== THE FILTER — wrong-fit prospects should leave here ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'This is not for everyone',
      sub: 'Volume is not the metric. If the left column describes you, the rest of this site is worth your time. If the right one does, we would rather you found that out on screen one than on invoice one.'
    })}
    <div class="k-fit">
      <div>
        <h3 class="k-fit__h k-fit__h--yes">Right fit</h3>
        <ul class="k-list">
          <li>You are being compared on price and you know that is the wrong conversation.</li>
          <li>You would rather hear the uncomfortable diagnosis than the flattering one.</li>
          <li>You want one partner accountable for the outcome, not four vendors accountable for their piece.</li>
          <li>You can make a decision without assembling a committee for each one.</li>
        </ul>
      </div>
      <div>
        <h3 class="k-fit__h k-fit__h--no">Wrong fit</h3>
        <ul class="k-list">
          <li>You need a logo by Friday and nothing else.</li>
          <li>You want campaigns now and the brand work \"later\". Later never arrives, and we would be taking your money.</li>
          <li>You are looking for the cheapest quote. There is always a cheaper one.</li>
          <li>You want an agency that agrees with you. We are going to disagree, in writing, early.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ===== PROOF ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'The proof, first',
      sub: 'Every number on this site was confirmed in writing by the client. No extrapolation, no \"up to\", no invented dollar figures. Three projects carry the weight.'
    })}
    ${(() => {
      const [lead, ...rest] = flagships();
      return `<div class="k-grid">${caseCard(lead, { feature: true })}</div>
    <div class="k-grid k-g2" style="margin-top:var(--k-s5)">${rest.map((c) => caseCard(c)).join('')}</div>`;
    })()}
    <p style="margin-top:32px"><a class="k-link" href="/work" data-track="cta_home_all_work">See all ${listed().length} projects</a></p>
  </div>
</section>

<!-- ===== THE SYSTEM — a real sequence, so it is ordered ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'One system,<br>five parts',
      sub: 'These are not five things you can buy in any order. Each one assumes the one before it is done. Every service page says out loud where it sits and what it depends on, which is also how we keep scope from quietly expanding after the contract.'
    })}
    <ol class="k-order">
      ${services.map((s, i) => `
      <li><a class="k-order__i${s.sequence.toLowerCase() === 'parallel' ? ' k-order__i--parallel' : ''}" href="/services/${s.slug}" data-track="cta_home_service" data-reveal="${i * 50}">
        <span class="k-order__seq">${esc(s.sequence)}</span>
        <span>
          <span class="k-order__name" style="display:block">${esc(s.name)}</span>
          <span class="k-order__p" style="display:block">${esc(s.problem)}</span>
        </span>
        <span class="k-order__proof">How we prove it: ${esc(s.demo.t)}<br><span class="k-link">Read the page</span></span>
      </a></li>`).join('')}
    </ol>
  </div>
</section>

<!-- ===== SELF-DEMONSTRATION ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'We practise<br>what we preach',
      sub: 'Any agency can claim expertise on a services page, so none of ours are claims. Each capability has a live artifact on this site you can inspect right now, without talking to us.'
    })}
    <div class="k-ledger">
      ${[
        ['Creative strategy', 'The Brand Signal Test', 'A scored diagnostic that gives away real strategic thinking before anyone pays.', '/the-kija-method', 'Take the test'],
        ['Brand development', 'Our system, published', 'Tokens, type scale, motion rules and voice: the actual system this page renders from.', '/brand-system', 'Open the system'],
        ['Website design', 'Our numbers, in the footer', `Core Web Vitals published at every deploy. Currently LCP ${esc(site.vitals.lcp)}, CLS ${esc(site.vitals.cls)}.`, '#footer', 'Check them'],
        ['Marketing automation', 'What happens after you submit', 'Instant, specific, personalised. Fill in any form here and watch.', '/fit-finder', 'Try the Fit Finder'],
        ['Ongoing marketing', 'The live campaign shelf', 'What we are running this month, for clients and for ourselves, including what is not working.', '/now', 'See this month'],
        ['The differentiator', 'We run a business on this', 'Oak Cliff Pilates is Kija-operated. Every play here was run there first.', '/oak-cliff-pilates-story', 'Read the story']
      ].map(([label, title, body, href, link], i) => `
      <div class="k-ledger__i${i === 5 ? ' k-ledger__i--mag' : ''}" data-reveal="${i * 60}">
        <p class="k-label k-label--dim">${label}</p>
        <h3>${title}</h3>
        <p>${body}</p>
        <p style="margin-top:14px"><a class="k-link" href="${href}">${link}</a></p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ===== PACKAGES ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'Where people start',
      sub: 'Three productized entry points, one low-commitment door, one retained tier. Most engagements begin at one of these and expand along the sequence.'
    })}
    ${[offers.filter((o) => o.type === 'productized'), offers.filter((o) => o.type !== 'productized')].map((group, g) => `
    <div class="k-grid ${group.length > 2 ? 'k-g3' : 'k-g2'}"${g ? ' style="margin-top:var(--k-s5)"' : ''}>
      ${group.map((o, i) => `
      <a class="k-card ${o.type === 'retained' ? 'k-card--mag' : o.type === 'entry' ? 'k-card--warn' : 'k-card--accent'}" href="/${o.slug}" data-track="cta_home_offer" data-reveal="${i * 60}">
        <p class="k-label${o.type === 'retained' ? ' k-label--mag' : o.type === 'entry' ? ' k-label--yellow' : ' k-label--dim'}">${o.type === 'productized' ? 'Productized' : o.type === 'entry' ? 'Entry tier' : 'Retained'}</p>
        <h3 style="margin-top:10px;font-size:var(--k-t-lg)">${esc(o.name)}</h3>
        <p class="k-dim k-sm" style="margin-top:12px">${esc(o.summary)}</p>
        <p style="margin-top:20px"><span class="k-link">${o.gated ? 'Apply' : 'See what is in it'}</span></p>
      </a>`).join('')}
    </div>`).join('')}
  </div>
</section>

<!-- ===== CAPTURE PATHS ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      title: 'Four ways in',
      sub: 'Pick the one that matches how sure you are. None of them put you on a list you cannot leave, and none of them start with a countdown timer.'
    })}
    <div class="k-grid k-g4">
      ${[
        ['Ready now', 'Book a call', '/book', 'Shortest path. No qualifying gauntlet in front of the calendar.', 'cta_home_book'],
        ['Something is off', 'Brand Signal Test', '/the-kija-method', 'Twelve questions, a real score, and the three areas to fix first.', 'cta_home_signal'],
        ['We know what we need', 'Brand Review', '/brand-review', 'A human audit of what you have. Slower, and considerably more useful.', 'cta_home_review'],
        ['Still exploring', 'Fit Finder', '/fit-finder', 'Six questions, then an honest recommendation, including \"not us\".', 'cta_home_fitfinder']
      ].map(([label, title, href, body, track], i) => `
      <a class="k-card k-card--accent" href="${href}" data-track="${track}" data-reveal="${i * 60}">
        <p class="k-label k-label--dim">${esc(label)}</p>
        <h3 style="margin-top:10px">${esc(title)}</h3>
        <p class="k-dim k-sm" style="margin-top:12px">${esc(body)}</p>
      </a>`).join('')}
    </div>
  </div>
</section>

${ctaBand({
    title: 'Let’s find out<br>what’s broken',
    lede: 'Thirty minutes. We will tell you what we would do first and why, whether or not you hire us to do it. If we are the wrong shop for the problem, we will say that too, and point you at who is not.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_footer_band_book' },
    secondary: { label: 'Or take the test first', href: '/the-kija-method', track: 'cta_footer_band_signal' }
  })}`;

  return {
    path: '/',
    title: null,
    variant: site.homeTest ? 'home-a' : null,
    headInline: site.homeTest ? abRedirect('home', '/', { a: '/', b: '/b' }) : null,
    description: site.description,
    body,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: site.name,
      url: site.url,
      description: site.description,
      areaServed: 'United States',
      address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postal, addressCountry: 'US' },
      email: site.email,
      telephone: site.phone,
      foundingDate: site.established,
      sameAs: [site.social.instagram, site.social.linkedin],
      slogan: site.tagline
    }
  };
}
