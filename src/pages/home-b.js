import { esc } from '../templates/layout.js';
import { cta } from '../templates/blocks.js';
import { site } from '../data/site.js';
import { services } from '../data/services.js';
import { cases, featured, listed } from '../data/cases.js';
import { explorerPayload, explorerJSON } from '../data/explorer.js';
import { hasMedia, mediaUrl, LIVE_UPLOADS } from '../data/media.js';
import { shownStudio } from '../data/studio.js';
const pickMedia = (list) => (list || []).find((x) => hasMedia(x)) || null;

/* ==========================================================================
   HOMEPAGE — OPTION B v2  ("the workshop table")
   Cream ground, stickers and tape, hand-drawn marks, physics you can play
   with. v2 carries the live kijacreative.com copy (pulled 2026-11-17):
   "Make your brand unmissable", the Signal teaser, the eight featured
   projects, "Good taste will not be replaced", Who we are, Let's talk.

   Interaction patterns were studied from the Truus.co rebuild; no code,
   artwork, font or layout from it is used (that repo has no licence).
   Behaviour lives in widgets/home-b.js. Served at /b as variant home-b.
   ========================================================================== */

const MARK = {
  under: '<svg class="kb-mark kb-mark--under" viewBox="0 0 260 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 5H258"/></svg>',
  arrow: '<svg class="kb-arrow" viewBox="0 0 190 40" aria-hidden="true"><path pathLength="1" d="M4 20H182"/><path pathLength="1" d="M168 8l14 12-14 12"/></svg>',
  star: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 3l9 24 24-11-9 25 23 11-25 7 7 25-23-12-6 25-8-24-23 12 8-25-25-8 24-10-10-24 25 10z"/></svg>',
  // A chunky seal: 16 shallow points around a wide solid centre, so copy sits well inside it.
  burst: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50.0 1.0 L57.9 10.3 L68.8 4.7 L72.5 16.3 L84.6 15.4 L83.7 27.5 L95.3 31.2 L89.7 42.1 L99.0 50.0 L89.7 57.9 L95.3 68.8 L83.7 72.5 L84.6 84.6 L72.5 83.7 L68.8 95.3 L57.9 89.7 L50.0 99.0 L42.1 89.7 L31.2 95.3 L27.5 83.7 L15.4 84.6 L16.3 72.5 L4.7 68.8 L10.3 57.9 L1.0 50.0 L10.3 42.1 L4.7 31.2 L16.3 27.5 L15.4 15.4 L27.5 16.3 L31.2 4.7 L42.1 10.3Z"/></svg>'
};
const jit = (i, s = 1) => { const x = Math.sin((i + 1) * 12.9898 * s) * 43758.5453; return x - Math.floor(x) - 0.5; };
const letters = (word, seed, amp = 1) => [...word].map((ch, i) => ch === ' '
  ? '<span class="kb-ch kb-ch--sp"> </span>'
  : `<span class="kb-ch" style="--r:0deg;--y:${(0.32 + Math.abs(jit(i, seed + 3)) * 0.3 * amp).toFixed(2)}em">${esc(ch)}</span>`).join('');
const TONES = ['magenta', 'aqua', 'yellow', 'ink', 'paper'];

/* A sticker: front and back. Tap flips it; drag throws it. */
/* A print of real work, lying on the table. Drag to throw it; tap to turn it
   over for the result. Falls back to the project's typographic face if the
   photo is not in src/media yet. */
const PRINTS = [   // two loose columns on the sticker side, clear of the headline
  ['oak-cliff-pilates', '2026/02/OCP-Grand-Opening-308-scaled.webp', 76, 27, -2.5],
  ['beverage-displays', '2026/02/Veuve-Deer-Head-scaled.webp', 91, 22, 2.5],
  ['latino-arts', '2026/02/09042022-12.webp', 77, 61, 1.5],
  ['mammogram-poster-girls', '2026/02/Busted-Poster-scaled.webp', 92, 57, -2],
  ['cliqbux', 'studio/cliqbux/analyzer-report.webp', 85, 88, 1]
];
const print = ([slug, img, x, t, r]) => {
  const c = cases.find((k) => k.slug === slug);
  if (!c) return '';
  const m = c.metrics[0];
  const face = hasMedia(img)
    ? `<img src="${mediaUrl(img)}" alt="" draggable="false" loading="eager" decoding="async">`
    : `<span class="kb-print__type k-case__thumb--${esc(c.thumb.tone)}"><span>${esc(c.thumb.word).replace(/\n/g, '<br>')}</span></span>`;
  return `
    <span class="kb-sticker kb-print" data-kb-sticker data-bubble="Drag · tap to turn over" style="--x:${x}%;--t:${t}%;--r:${r}deg">
      <span class="kb-sticker__in">
        <span class="kb-sticker__f kb-print__f">${face}<span class="kb-print__cap">${esc(c.client)}</span></span>
        <span class="kb-sticker__b kb-print__b">
          <span class="kb-print__n">${esc(m.value)}</span><span class="kb-print__l">${esc(m.label)}</span>
          <span class="kb-print__c">${esc(c.client)}</span>
          <a href="/work/${c.slug}" tabindex="-1">View the case</a>
        </span>
      </span>
    </span>`;
};

/* The reel, faded into the paper. Local copy first (once downloaded), the
   live WordPress file as a fallback while that site is still up. */
const heroMedia = () => {
  const v = site.heroVideo;
  if (!v) return '';
  const sources = [hasMedia(v.src) ? mediaUrl(v.src) : null, LIVE_UPLOADS + v.src].filter(Boolean);
  const poster = v.poster && hasMedia(v.poster) ? ` poster="${mediaUrl(v.poster)}"` : '';
  return `<div class="kb-media" aria-hidden="true" data-kb-media>
    <div class="kb-media__in" data-kb-media-in>
      <video class="kb-media__v" muted playsinline loop preload="metadata"${poster} data-kb-video>
        ${sources.map((src) => `<source src="${src}" type="video/mp4">`).join('\n        ')}
      </video>
    </div>
    <span class="kb-media__wash"></span>
  </div>`;
};

/* More from the studio: the four strongest studio builds that have imagery */
const studioStrip = () => {
  const items = shownStudio().map((p) => ({ p, img: pickMedia(p.cover) })).filter((x) => x.img).slice(0, 4);
  if (items.length < 2) return '';
  return `
    <div class="kb-studio">
      <div class="kb-studio__head"><h3>More from the studio</h3><a class="k-link" href="/work#studio" data-track="cta_home_b_studio">See all ${shownStudio().length}</a></div>
      <div class="kb-studio__row">
        ${items.map(({ p, img }, i) => `
        <a class="kb-studio__i" href="/work#studio" data-bubble="Open" data-track="cta_home_b_studio_card" style="--r:${[-1.2, 0.8, -0.6, 1.1][i]}deg">
          <span class="kb-studio__img"><img src="${mediaUrl(img)}" alt="" loading="lazy" decoding="async">${p.status === 'live' ? '<em>Live</em>' : ''}</span>
          <b>${esc(p.name)}</b><small>${esc((p.where ? p.where + ' · ' : '') + p.disc.map((d) => d[0].toUpperCase() + d.slice(1)).join(' · '))}</small>
        </a>`).join('')}
      </div>
    </div>`;
};

export default function homeB() {
  const work = featured();
  const ocp = cases.find((c) => c.slug === 'oak-cliff-pilates');
  // count what the wall will actually draw: word, client, metrics, headline, quote, live pieces, photos
  const pieceCount = explorerPayload().reduce((n, c) => n + 3 + c.metrics.length + (c.quote ? 1 : 0) + c.pieces.length + c.media.length, 0);
  const fanRot = [4, -5, 5, -8, 5];
  const cardRot = [-3, 2.5, -1.5, 3, -2.5, 1.5, -3.5, 2];

  const body = `
<div class="kb">

<!-- ===== HERO ===== -->
<header class="kb-hero" data-kb-table>
  ${heroMedia()}
  <div class="k-wrap">
    <p class="kb-eyebrow">Kija Creative, est. ${esc(site.established)}. By designers, developers, and creative thinkers.</p>
    <h1 class="kb-h1"><span class="k-sr">Make your brand unmissable.</span>
      <span class="kb-h1__l" aria-hidden="true" data-kb-solid>Make your brand</span>
      <span class="kb-h1__l" aria-hidden="true"><span class="kb-tune" data-kb-solid data-text="unmissable.">unmissable.</span></span>
    </h1>
    <p class="kb-lede" data-kb-solid><b>Creative direction for what’s next.</b> Behind the work of artists, startups, and emerging brands, with the strategy, design, and systems to back it up.</p>
    <div class="k-btns" style="margin-top:32px" data-kb-solid>
      ${cta({ label: 'Book a call', href: '/book', track: 'cta_hero_book' })}
      ${cta({ label: 'Test your signal', href: '/the-kija-method', style: 'k-btn--ghost kb-btn-ink', track: 'cta_hero_signal_test' })}
    </div>
  </div>
  <div class="kb-stickers" aria-hidden="true">
    ${PRINTS.map(print).join('')}
  </div>
</header>

<!-- ===== SIGNAL ===== -->
<section class="kb-signal" data-kb-signal>
  <div class="k-wrap kb-signal__grid">
    <div>
      <p class="kb-kicker">The Signal Test</p>
      <h2 class="kb-h2" data-reveal>Your brand is already sending a <span class="kb-underlined">signal.${MARK.under}</span></h2>
      <p class="kb-sub">Every click, scroll, email, ad, package, and first impression is either building trust or quietly losing it.</p>
      <p class="kb-sub kb-sub--sm">The Signal Test helps you see what people may already be feeling but not saying: where your message gets fuzzy, where your brand feels less legit than it is, and where potential customers drop off before they ever reach out.</p>
      <div class="k-btns" style="margin-top:28px">${cta({ label: 'Test your signal', href: '/the-kija-method', track: 'cta_home_b_signal' })}</div>
    </div>
    <figure class="kb-wave" aria-label="A noisy signal resolving into a clean one">
      <svg viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true"><path class="kb-wave__ghost" d="M0 110 Q 75 40 150 110 T 300 110 T 450 110 T 600 110"/><path class="kb-wave__line" data-kb-wave d="M0 110 Q 75 40 150 110 T 300 110 T 450 110 T 600 110"/></svg>
      <figcaption>
        <span class="kb-wave__read">Signal: <b data-kb-wave-read>clear</b></span>
        <span class="kb-gaps">${['message', 'look', 'conversion', 'consistency'].map((g) => `<span class="kb-gap is-on" data-kb-gap>${g}</span>`).join('')}</span>
      </figcaption>
    </figure>
  </div>
</section>

<!-- ===== WE BUILD SYSTEMS — the positioning, said plainly, with proof ===== -->
<section class="kb-systems" aria-labelledby="kb-systems-h">
  <div class="k-wrap kb-systems__grid">
    <div>
      <p class="kb-systems__eyebrow">What Kija is</p>
      <h2 class="kb-systems__h" id="kb-systems-h">We build<br><span>systems.</span></h2>
      <p class="kb-systems__p">Brands, websites, sales tools and automation that keep working long after launch day. For Cliqbux, that meant a website evaluation system and a site generator that sell their product to restaurants, and a partnership on every order.</p>
      <ul class="kb-systems__parts">
        <li><a href="/services/brand-development" data-track="cta_home_systems_part">Brand systems</a></li>
        <li><a href="/services/website-design" data-track="cta_home_systems_part">Website systems</a></li>
        <li><a href="/services/marketing-automation" data-track="cta_home_systems_part">Sales &amp; automation systems</a></li>
        <li><a href="/services/ongoing-marketing" data-track="cta_home_systems_part">Marketing systems</a></li>
      </ul>
      <div class="k-btns" style="margin-top:28px">
        <a class="k-btn k-btn--primary k-btn--lg" href="/work/cliqbux" data-track="cta_home_systems_cliqbux">See the Cliqbux system</a>
      </div>
    </div>
    ${hasMedia('studio/cliqbux/analyzer-orders.webp') ? `
    <a class="kb-systems__proof" href="/work/cliqbux" data-bubble="Open" data-track="cta_home_systems_proof">
      ${hasMedia('studio/cliqbux/cliqbux-logo-on-dark.svg') ? `<img class="kb-systems__logo" src="${mediaUrl('studio/cliqbux/cliqbux-logo-on-dark.svg')}" alt="Cliqbux">` : ''}
      <span class="kb-systems__shot"><img src="${mediaUrl('studio/cliqbux/analyzer-orders.webp')}" alt="Cliqbux Restaurant Analyzer: where a restaurant’s online orders go today (sample data)" loading="lazy" decoding="async"></span>
      <span class="kb-systems__fig"><b>6.5%</b> per order on Cliqbux, against 15–30% on delivery apps</span>
      <span class="kb-systems__fig"><b>45%</b> Kija’s partner share of all orders</span>
    </a>` : ''}
  </div>
</section>

<!-- ===== WHAT WE DO — pinned, sideways; it is a real order ===== -->
<section class="kb-seq" data-kb-seq aria-labelledby="kb-seq-h">
  <div class="kb-seq__pin">
    <div class="kb-seq__track">
      <h2 class="kb-seq__intro" id="kb-seq-h"><span class="kb-seq__k">What we do</span>Good branding makes people get it faster.<span>Good strategy makes sure they find you first.</span></h2>
      ${services.map((s, i) => `
      <a class="kb-word kb-word--${['magenta', 'ink', 'aqua', 'yellow', 'magenta'][i]}" href="/services/${s.slug}" data-track="cta_home_service" data-bubble="Read">
        <span class="kb-word__seq">${esc(s.sequence)}${s.sequence.toLowerCase() === 'parallel' ? ', alongside the rest' : ''}</span>
        <span class="k-sr">${esc(s.name.split(' ')[0])}</span><span class="kb-word__w" aria-hidden="true">${letters(s.name.split(' ')[0], 20 + i, 1.4)}</span>
        <span class="kb-word__rest">${esc(s.name.split(' ').slice(1).join(' '))}</span>
        <span class="kb-word__p">${esc(s.problem)}</span>
      </a>${i < services.length - 1 ? MARK.arrow : ''}`).join('')}
      <p class="kb-seq__end">In that<br>order.</p>
    </div>
  </div>
</section>

<!-- ===== FEATURED CASE STUDIES — cards on the table ===== -->
<section class="kb-proof">
  <div class="k-wrap">
    <p class="kb-kicker">Selected case studies</p>
    <h2 class="kb-h2" data-reveal>Featured case <span class="kb-underlined">studies.${MARK.under}</span></h2>
    <div class="kb-proof__table">
      ${work.map((c, i) => `
      <a class="kb-pcard kb-pcard--${esc(c.thumb.tone)}" href="/work/${c.slug}" data-kb-wobble data-bubble="View case" data-track="cta_case_card" style="--r:${cardRot[i % cardRot.length]}deg">
        <span class="kb-pcard__top"><span>${String(i + 1).padStart(2, '0')}</span><span>${esc(c.client)}</span></span>
        <span class="kb-pcard__n" data-ticker>${esc(c.metrics[0].value)}</span>
        <span class="kb-pcard__l">${esc(c.metrics[0].label)}${c.metrics[1] ? ` · ${esc(c.metrics[1].value)} ${esc(c.metrics[1].label.toLowerCase())}` : ''}</span>
        <span class="kb-pcard__h">${esc(c.headline)}</span>
      </a>`).join('')}
    </div>
    <div class="kb-proof__foot">
      <a class="kb-explore" href="/work#explore" data-explore data-bubble="Explore" data-track="cta_home_b_explore">
        <span class="kb-explore__ring" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="kb-ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs><text><textPath href="#kb-ring">explore the wall · explore the wall · explore the wall ·</textPath></text></svg></span>
        <span class="kb-explore__c"><b>${pieceCount}</b>pieces of proof, every direction</span>
      </a>
      <a class="k-btn k-btn--ghost kb-btn-ink k-btn--lg" href="/work" data-track="cta_home_b_portfolio">View full portfolio</a>
    </div>
    ${studioStrip()}
  </div>
</section>

<!-- ===== SERVICES — a fanned hand of cards ===== -->
<section class="kb-fan">
  <div class="k-wrap">
    <h2 class="kb-h2" data-reveal>Where we come <span class="kb-underlined">in.${MARK.under}</span></h2>
    <p class="kb-sub">Five capabilities, one sequence. Each card is what you are left holding at the end.</p>
  </div>
  <div class="kb-fan__deck" data-kb-fan>
    ${services.map((s, i) => `
    <a class="kb-card kb-card--${['magenta', 'paper', 'aqua', 'yellow', 'ink'][i]}" href="/services/${s.slug}" style="--r:${fanRot[i]}deg" data-bubble="View" data-track="cta_home_service_card">
      <span class="kb-card__seq">${esc(s.sequence)}</span>
      <span class="kb-card__t">${esc(s.name)}</span>
      <svg class="kb-card__rule" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true"><path d="M2 4H198"/></svg>
      <span class="kb-card__l">${s.process.map((p) => `<span>${esc(p.out)}</span>`).join('')}</span>
    </a>`).join('')}
  </div>
</section>

<!-- ===== GOOD TASTE ===== -->
<section class="kb-taste" data-kb-taste>
  <div class="k-wrap kb-taste__wrap">
    <h2 class="kb-taste__h"><span class="k-sr">Good taste will not be replaced.</span>
      <span aria-hidden="true">
        <span class="kb-taste__w kb-taste__w--xl" data-kb-drift="-1">Good</span>
        <span class="kb-taste__w kb-taste__w--md" data-kb-drift="1">taste</span>
        <span class="kb-taste__w kb-taste__w--lg" data-kb-drift="-1">will</span>
        <span class="kb-taste__w kb-taste__w--not" data-kb-drift="1">not</span>
        <span class="kb-taste__w kb-taste__w--md" data-kb-drift="-1">be</span>
        <span class="kb-taste__w kb-taste__w--xl" data-kb-drift="1">replaced.</span>
      </span>
    </h2>
    <a class="kb-review" href="/brand-review" data-bubble="Free brand review" data-track="cta_home_b_review">
      <svg viewBox="0 0 200 200" aria-hidden="true" data-kb-spin><defs><path id="kb-ring2" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0"/></defs><text><textPath href="#kb-ring2">free brand review · free brand review · free brand review ·</textPath></text></svg>
      ${hasMedia(site.logo.mark) ? `<img class="kb-review__mark" src="${mediaUrl(site.logo.mark)}" alt="" aria-hidden="true">` : '<span class="kb-review__k" aria-hidden="true">K</span>'}
      <span class="k-sr">Free brand review</span>
    </a>
  </div>
</section>

<!-- ===== WHO WE ARE — three things coming into alignment ===== -->
<section class="kb-who" data-kb-align>
  <div class="k-wrap kb-who__grid">
    <div class="kb-venn" aria-hidden="true">
      <span class="kb-venn__c kb-venn__c--a" data-kb-venn="a"><span>design</span></span>
      <span class="kb-venn__c kb-venn__c--b" data-kb-venn="b"><span>strategy</span></span>
      <span class="kb-venn__c kb-venn__c--c" data-kb-venn="c"><span>technical<br>execution</span></span>
      <span class="kb-venn__k" data-kb-venn-k>Kija</span>
    </div>
    <div>
      <p class="kb-kicker">Who we are</p>
      <h2 class="kb-h2 kb-h2--md">We’re the intersection of design, strategy, and technical execution.</h2>
      <p class="kb-sub">Kija Creative was built on the idea that brands don’t grow from one good idea — they grow from alignment. Alignment between message and design. Between strategy and execution. Between vision and systems.</p>
      <p class="kb-who__close">We’re here to make sure every one of those moments makes sense.</p>
    </div>
  </div>
</section>

<!-- ===== DOUBLE TAPE ===== -->
<section class="kb-tapes" aria-label="Clients and principles">
  ${(() => {
    const clients = listed().map((c, i) => `<a class="kb-pill kb-pill--${TONES[i % TONES.length]}" href="/work/${c.slug}" data-bubble="Open">${esc(c.client)}</a>`).join('');
    const rules = ['Make your brand unmissable', 'Good taste will not be replaced', 'Strategy before design', 'Creative direction for what’s next', 'Systems, not visuals', 'Proof before praise']
      .map((r) => `<span class="kb-rule">${esc(r)}<span class="kb-rule__s" aria-hidden="true">${MARK.star}</span></span>`).join('');
    return `
  <div class="kb-tape kb-tape--a"><div class="kb-tape__t"><div class="kb-tape__set">${clients}</div><div class="kb-tape__set" aria-hidden="true" inert>${clients}</div></div></div>
  <div class="kb-tape kb-tape--b"><div class="kb-tape__t"><div class="kb-tape__set">${rules}</div><div class="kb-tape__set" aria-hidden="true">${rules}</div></div></div>`;
  })()}
</section>

<!-- ===== LET'S TALK ===== -->
<section class="kb-end" data-kb-push>
  <div class="k-wrap">
    <h2 class="kb-end__h">Let’s talk.<br>We’re ready.</h2>
    <p class="kb-end__p">Get in touch. We’re probably working with the headphones on, but we’ll see your message and get back to you soon.</p>
    <div class="k-btns" style="margin-top:34px">
      ${cta({ label: 'Book a call', href: '/book', track: 'cta_footer_band_book' })}
      ${cta({ label: 'Free brand review', href: '/brand-review', style: 'k-btn--ghost', track: 'cta_footer_band_review' })}
    </div>
    <address class="kb-end__contact">
      <span><small>Contact</small><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><a href="${esc(site.phoneHref)}">${esc(site.phone)}</a></span>
      <span><small>Studio</small>${esc(site.address.street)}<br>${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postal)}</span>
      <span><small>Social</small><a href="${esc(site.social.instagram)}" rel="noopener">Instagram</a><a href="${esc(site.social.linkedin)}" rel="noopener">LinkedIn</a></span>
    </address>
  </div>
  <div aria-hidden="true">
    <span class="kb-psticker kb-psticker--yellow" style="--x:74%;--t:14%;--r:9deg">+67%<small>demo bookings</small></span>
    <span class="kb-psticker kb-psticker--aqua" style="--x:89%;--t:38%;--r:-7deg">+78%<small>direct inquiries</small></span>
    <span class="kb-psticker kb-psticker--paper" style="--x:78%;--t:62%;--r:4deg">9<small>bookings in 90 days</small></span>
    <span class="kb-psticker kb-psticker--ink" style="--x:92%;--t:84%;--r:-12deg">2.1×<small>ad conversion</small></span>
  </div>
</section>


<script type="application/json" id="k-cases-data">${explorerJSON()}</script>
</div>`;

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
      email: site.email,
      telephone: site.phone,
      foundingDate: site.established,
      sameAs: [site.social.instagram, site.social.linkedin],
      address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postal, addressCountry: 'US' },
      slogan: 'Make your brand unmissable.'
    },
    scripts: ['/assets/vendor/motion-scroll.min.js', '/assets/widgets/home-b.js', '/assets/widgets/work-explorer.js']
  };
}
