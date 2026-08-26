import { esc, abRedirect } from '../templates/layout.js';
import { head, hero, steps, matchedProof, ctaBand, cards } from '../templates/blocks.js';
import { offers, offerBySlug } from '../data/offers.js';
import { serviceBySlug } from '../data/services.js';

/* ---------- /packages ---------------------------------------------------- */
export function packagesIndex() {
  const body = `
${hero({
    eyebrow: 'Packages',
    title: 'Five doors,<br>one system',
    lede: 'Three productized packages, one entry tier and one retained partnership. They differ in where you start and how much runs at once — not in how seriously the work gets taken.',
    ctas: [
      { label: 'Book a call', href: '/book', track: 'cta_packages_hero_book' },
      { label: 'Which one is mine?', href: '/fit-finder', style: 'k-btn--ghost', track: 'cta_packages_hero_fitfinder' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '01', title: 'The line-up' })}
    <div class="k-rows">
      ${offers.map((o, i) => `
      <a class="k-row" href="/${o.slug}" style="text-decoration:none" data-track="cta_packages_offer" data-reveal="${i * 50}">
        <div class="k-row__t">
          <span class="k-tag ${o.type === 'productized' ? 'k-tag--mint' : o.type === 'entry' ? 'k-tag--yellow' : 'k-tag--mag'}">${o.type === 'productized' ? 'Productized' : o.type === 'entry' ? 'Entry tier' : 'Retained'}</span>
          <h3 style="margin-top:14px">${esc(o.name)}</h3>
          <p class="k-dim k-sm" style="margin-top:10px">${esc(o.tagline)}</p>
        </div>
        <div><h4>What it is</h4><p class="k-dim" style="margin-top:10px">${esc(o.summary)}</p></div>
        <div>
          <h4>Who it is for</h4>
          <p class="k-dim k-sm" style="margin-top:10px">${esc(o.who)}</p>
          <p style="margin-top:16px"><span class="k-link">${o.gated ? 'Apply' : 'Full detail'}</span></p>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'How we talk<br>about money', sub: 'Stated up front so nobody wastes a call finding it out.' })}
    ${cards([
      { label: 'Productized tiers', title: 'A starting number, published', accent: 'accent',
        body: 'Launch Kit, Growth Engine and Content Machine carry a starting-at figure, because a number that filters saves both of us a meeting.' },
      { label: 'Custom work', title: 'No number, on purpose', accent: 'accent',
        body: 'Capability engagements and Strategic Partner are quoted after scope. Publishing a figure before scope anchors the conversation in the wrong place.' },
      { label: 'What we never do', title: 'No timers, no expiry', accent: 'mag',
        body: 'We flagged countdown pressure as a red flag in a client audit, so we do not run it on ourselves. The price is the price next Tuesday too.' }
    ])}
  </div>
</section>

${ctaBand({
    num: '03',
    title: 'Still not sure?',
    lede: 'Six questions and the Fit Finder tells you which of these is actually yours — including when the honest answer is none of them yet.',
    primary: { label: 'Run the Fit Finder', href: '/fit-finder', track: 'cta_packages_band_fitfinder' },
    secondary: { label: 'Just book a call', href: '/book', track: 'cta_packages_band_book' }
  })}`;

  return {
    path: '/packages',
    title: 'Packages',
    description: 'Launch Kit, Growth Engine, Content Machine, Personal Brand Launch Kit and Strategic Partner — five ways into the same system.',
    body
  };
}

/* ---------- /[offer] -----------------------------------------------------
   Variant a — starting-at price shown (filters harder, fewer calls)
   Variant b — no price, routed to a call (more calls, more discovery)
   This is the live test behind Decision 5.
   ------------------------------------------------------------------------ */
export function offerPage(slug, variant) {
  const o = offerBySlug(slug);
  const showPrice = variant !== 'b' && !!o.price;

  const body = `
${hero({
    eyebrow: `${o.type === 'productized' ? 'Productized package' : o.type === 'entry' ? 'Entry tier' : 'Retained partnership'} · ${esc(o.tagline)}`,
    title: esc(o.name),
    lede: `<b>${esc(o.summary)}</b> ${esc(o.who)}`,
    ctas: o.gated
      ? [{ label: 'Apply for a place', href: '/brand-review?offer=strategic-partner', track: `cta_${slug}_hero_apply` }]
      : [
          { label: 'Book a call', href: '/book', track: `cta_${slug}_hero_book` },
          { label: 'See if it fits', href: '/fit-finder', style: 'k-btn--ghost', track: `cta_${slug}_hero_fitfinder` }
        ],
    meta: [
      { k: 'Type', v: o.type === 'productized' ? 'Productized' : o.type === 'entry' ? 'Entry tier' : 'Retained' },
      { k: 'Usual entry point', v: o.entry },
      { k: 'Capabilities', v: o.services.map((s) => serviceBySlug(s)?.name || s).join(', ') },
      { k: showPrice ? 'Starting at' : 'Investment', v: showPrice ? o.price : 'Quoted after scope' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '01', title: 'What is in it', sub: 'Everything below is included. Nothing below is an upsell discovered in month two.' })}
    ${steps(o.includes.map((i) => ({ t: i.t, d: i.d })))}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'Who it is<br>not for' })}
    <div class="k-callout">
      <h4 class="k-label--yellow">We will say this on the call anyway</h4>
      <p style="margin-top:12px;max-width:62ch">${esc(o.notFor)}</p>
    </div>
  </div>
</section>

${matchedProof(o.proof, 'Where this has run')}

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '07', title: 'The capabilities<br>behind it' })}
    <div class="k-grid k-g${Math.min(o.services.length, 3)}">
      ${o.services.map((s) => {
        const sv = serviceBySlug(s);
        return `<a class="k-card k-card--accent" href="/services/${s}" data-track="cta_${slug}_service">
          <h4>Sequence: ${esc(sv.sequence)}</h4>
          <h3 style="margin-top:12px">${esc(sv.name)}</h3>
          <p class="k-dim k-sm" style="margin-top:12px">${esc(sv.problem)}</p>
        </a>`;
      }).join('')}
    </div>
  </div>
</section>

${ctaBand({
    num: '08',
    title: o.gated ? 'Apply for<br>a place' : `Start with<br>${esc(o.name)}`,
    lede: o.gated
      ? 'Strategic Partner is capped, and we would rather turn down a good fit than take on one we cannot serve properly. Tell us the situation and we will tell you honestly whether there is room.'
      : (showPrice
          ? 'The number above is where it starts. What moves it is page count, how much is interactive, and how much of the content you want us to write.'
          : 'We quote after a call rather than before one, because a number without scope is a guess dressed up as a price.'),
    primary: o.gated
      ? { label: 'Apply', href: '/brand-review?offer=strategic-partner', track: `cta_${slug}_band_apply` }
      : { label: 'Book a call', href: '/book', track: `cta_${slug}_band_book` },
    secondary: o.gated ? null : { label: 'Run the Fit Finder', href: '/fit-finder', track: `cta_${slug}_band_fitfinder` }
  })}`;

  return {
    path: variant ? `/${o.slug}/${variant}` : `/${o.slug}`,
    title: variant ? `${o.name} (variant ${variant.toUpperCase()})` : o.name,
    description: o.summary,
    body,
    variant: variant ? `${slug}-${variant}` : (o.variants.length ? `${slug}-a` : null),
    noindex: !!variant,
    headInline: !variant && o.variants.length
      ? abRedirect(slug.replace(/-/g, '_'), `/${slug}`,
          Object.assign({ a: `/${slug}` }, ...o.variants.map((v) => ({ [v]: `/${slug}/${v}` }))))
      : null,
    stickySecondary: { label: 'Fit Finder', href: '/fit-finder' }
  };
}

export function offerPages() {
  const out = [];
  offers.forEach((o) => {
    out.push(offerPage(o.slug, null));
    o.variants.forEach((v) => out.push(offerPage(o.slug, v)));
  });
  return out;
}
