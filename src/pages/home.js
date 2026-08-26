import { esc } from '../templates/layout.js';
import { head, hero, cta, caseCard, cards, marquee, ctaBand } from '../templates/blocks.js';
import { flagships } from '../data/cases.js';
import { services } from '../data/services.js';
import { offers } from '../data/offers.js';
import { site } from '../data/site.js';

export default function home() {
  const body = `
${hero({
    eyebrow: 'Brand · Website · Automation · Campaigns — Dallas',
    title: 'Most brands<br>are broken',
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

${marquee([
    'Strategy <b>before</b> design.', 'Brand <b>before</b> website.',
    'Website <b>before</b> paid.', 'Systems <b>over</b> visuals.',
    'Verified numbers <b>only</b>.'
  ])}

<!-- ===== 01 · THE FILTER — wrong-fit prospects should leave here ===== -->
<section class="k-section">
  <div class="k-wrap">
    ${head({
      num: '01',
      title: 'This is not for everyone',
      sub: 'Volume is not the metric. If the next two columns describe you, the rest of this site is worth your time. If they do not, we would rather you found that out on screen one than on invoice one.'
    })}
    <div class="k-grid k-g2">
      <div class="k-card k-card--accent">
        <h4>Right fit</h4>
        <ul class="k-list" style="margin-top:16px">
          <li>You are being compared on price and you know that is the wrong conversation.</li>
          <li>You would rather hear the uncomfortable diagnosis than the flattering one.</li>
          <li>You want one partner accountable for the outcome, not four vendors accountable for their piece.</li>
          <li>You can make a decision without assembling a committee for each one.</li>
        </ul>
      </div>
      <div class="k-card k-card--warn">
        <h4 class="k-label--yellow">Wrong fit</h4>
        <ul class="k-list" style="margin-top:16px">
          <li>You need a logo by Friday and nothing else.</li>
          <li>You want campaigns now and the brand work "later" — later never arrives, and we would be taking your money.</li>
          <li>You are looking for the cheapest quote. There is always a cheaper one.</li>
          <li>You want an agency that agrees with you. We are going to disagree, in writing, early.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ===== 02 · PROOF ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '02',
      title: 'The proof, first',
      sub: 'Every number on this site was confirmed in writing by the client. No extrapolation, no "up to", no invented dollar figures. Three carry the weight.'
    })}
    <div class="k-grid k-g3">
      ${flagships().map((c) => caseCard(c)).join('')}
    </div>
    <p style="margin-top:28px"><a class="k-link" href="/work" data-track="cta_home_all_work">All nine projects</a></p>
  </div>
</section>

<!-- ===== 03 · THE SYSTEM ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '03',
      title: 'One system,<br>five parts',
      sub: 'These are not five things you can buy in any order. Each one assumes the one before it is done. Every service page says out loud where it sits and what it depends on — which is also how we keep scope from quietly expanding after the contract.'
    })}
    <div class="k-rows">
      ${services.map((s, i) => `
      <a class="k-row" href="/services/${s.slug}" style="text-decoration:none" data-track="cta_home_service" data-reveal="${i * 50}">
        <div class="k-row__t">
          <span class="k-tag k-tag--out">Sequence: ${esc(s.sequence)}</span>
          <h3 style="margin-top:14px">${esc(s.name)}</h3>
        </div>
        <div>
          <h4>The problem it solves</h4>
          <p class="k-dim" style="margin-top:10px">${esc(s.problem)}</p>
        </div>
        <div>
          <h4>How we prove it</h4>
          <p class="k-dim k-sm" style="margin-top:10px">${esc(s.demo.t)}</p>
          <p style="margin-top:14px"><span class="k-link">Read the page</span></p>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- ===== 04 · SELF-DEMONSTRATION ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '04',
      title: 'We practise<br>what we preach',
      sub: 'Any agency can claim expertise on a services page. So none of ours are claims. Each capability line has a live artifact on this site that you can inspect right now, without talking to us.'
    })}
    ${cards([
      { label: 'Creative Strategy', title: 'The Brand Signal Test', accent: 'accent',
        body: 'A scored diagnostic that gives away real strategic thinking before anyone pays. <a class="k-link" href="/the-kija-method">Take it</a>' },
      { label: 'Brand Development', title: 'Our system, published', accent: 'accent',
        body: 'Tokens, type scale, motion rules and voice — the actual system this page renders from. <a class="k-link" href="/brand-system">Open it</a>' },
      { label: 'Website Design', title: 'Our numbers, in the footer', accent: 'accent',
        body: `Core Web Vitals published at every deploy. Currently LCP ${esc(site.vitals.lcp)}, CLS ${esc(site.vitals.cls)}. <a class="k-link" href="#footer">Check them</a>` },
      { label: 'Marketing Automation', title: 'What happens after you submit', accent: 'accent',
        body: 'Instant, specific, personalised. Fill in any form here and watch. <a class="k-link" href="/fit-finder">Try it</a>' },
      { label: 'Ongoing Marketing', title: 'The live campaign shelf', accent: 'accent',
        body: 'What we are running this month, for clients and for ourselves — including what is not working. <a class="k-link" href="/now">See it</a>' },
      { label: 'And the differentiator', title: 'We run a business on this', accent: 'mag',
        body: 'Oak Cliff Pilates is Kija-operated. Every play here was run there first. <a class="k-link" href="/oak-cliff-pilates-story">The story</a>' }
    ])}
  </div>
</section>

<!-- ===== 05 · PACKAGES ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '05',
      title: 'Where people start',
      sub: 'Three productized entry points, one low-commitment door, one retained tier. Most engagements begin at one of these and expand along the sequence.'
    })}
    <div class="k-grid k-g3">
      ${offers.map((o, i) => `
      <a class="k-card ${o.type === 'retained' ? 'k-card--mag' : o.type === 'entry' ? 'k-card--warn' : 'k-card--accent'}" href="/${o.slug}" data-track="cta_home_offer" data-reveal="${i * 60}">
        <h4${o.type === 'retained' ? ' class="k-label--mag"' : o.type === 'entry' ? ' class="k-label--yellow"' : ''}>${o.type === 'productized' ? 'Productized' : o.type === 'entry' ? 'Entry tier' : 'Retained'}</h4>
        <h3 style="margin-top:12px">${esc(o.name)}</h3>
        <p class="k-dim k-sm" style="margin-top:12px">${esc(o.summary)}</p>
        <p style="margin-top:18px"><span class="k-link">${o.gated ? 'Apply' : 'See what is in it'}</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- ===== 06 · CAPTURE PATHS ===== -->
<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({
      num: '06',
      title: 'Four ways in',
      sub: 'Pick the one that matches how sure you are. None of them put you on a list you cannot leave, and none of them start with a countdown timer.'
    })}
    <div class="k-grid k-g4">
      ${[
        ['Ready now', 'Book a call', '/book', 'Shortest path. No qualifying gauntlet in front of the calendar.', 'cta_home_book'],
        ['Something is off', 'Brand Signal Test', '/the-kija-method', 'Twelve questions, a real score, and the three areas to fix first.', 'cta_home_signal'],
        ['We know what we need', 'Brand Review', '/brand-review', 'A human audit of what you have. Slower, and considerably more useful.', 'cta_home_review'],
        ['Still exploring', 'Fit Finder', '/fit-finder', 'Six questions, then an honest recommendation — including "not us".', 'cta_home_fitfinder']
      ].map(([label, title, href, body, track], i) => `
      <a class="k-card k-card--accent" href="${href}" data-track="${track}" data-reveal="${i * 60}">
        <h4>${esc(label)}</h4>
        <h3 style="margin-top:12px">${esc(title)}</h3>
        <p class="k-dim k-sm" style="margin-top:12px">${esc(body)}</p>
      </a>`).join('')}
    </div>
  </div>
</section>

${ctaBand({
    num: '07',
    title: 'Let’s find out<br>what’s broken',
    lede: 'Thirty minutes. We will tell you what we would do first and why — whether or not you hire us to do it. If we are the wrong shop for the problem, we will say that too, and point you at who is not.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_footer_band_book' },
    secondary: { label: 'Or take the test first', href: '/the-kija-method', track: 'cta_footer_band_signal' }
  })}`;

  return {
    path: '/',
    title: null,
    description: site.description,
    body,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: site.name,
      url: site.url,
      description: site.description,
      areaServed: 'United States',
      address: { '@type': 'PostalAddress', addressLocality: 'Dallas', addressRegion: 'TX', addressCountry: 'US' },
      slogan: site.tagline
    }
  };
}
