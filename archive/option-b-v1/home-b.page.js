import { esc } from '../templates/layout.js';
import { cta } from '../templates/blocks.js';
import { site } from '../data/site.js';
import { services } from '../data/services.js';
import { cases, flagships } from '../data/cases.js';

/* ==========================================================================
   HOMEPAGE — OPTION B  ("the workshop table")
   Same brand, same copy, same proof as Option A, in a second register: cream
   ground, stickers and tape, hand-drawn marks, and physics you can play with.
   Interaction patterns are studied from the Truus.co rebuild
   (github.com/Thakuma07/Truus.co-Awwward-Website); no code, artwork, font or
   layout from it is used — that repo carries no licence. Every mark and
   sticker here is drawn for Kija. Behaviour lives in widgets/home-b.js.

   Served at /b as variant `home-b` (noindex). Flip site.homeTest to true to
   split traffic 50/50 between / and /b through the existing A/B redirect.
   ========================================================================== */

// Deterministic "hand-placed" jitter so the build is reproducible.
const jit = (i, s = 1) => {
  const x = Math.sin((i + 1) * 12.9898 * s) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};
const letters = (word, seed, amp = 1) =>
  [...word].map((ch, i) => ch === ' '
    ? '<span class="kb-ch kb-ch--sp"> </span>'
    : `<span class="kb-ch" style="--r:${(jit(i, seed) * 34 * amp).toFixed(1)}deg;--y:${(jit(i, seed + 3) * 0.5 * amp).toFixed(2)}em">${esc(ch)}</span>`).join('');

/* Hand-drawn marks — drawn for Kija, stroke-only so they take currentColor. */
const MARK = {
  ring: '<svg class="kb-mark kb-mark--ring" viewBox="0 0 260 110" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M28 44C46 20 120 10 196 22c44 8 62 30 46 52-20 26-96 34-160 26C34 94 8 78 14 56c6-24 56-38 118-40 52-2 92 6 108 16"/></svg>',
  under: '<svg class="kb-mark kb-mark--under" viewBox="0 0 260 22" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 14C58 6 132 3 257 8"/><path pathLength="1" d="M46 19c52-4 110-6 168-4"/></svg>',
  arrow: '<svg class="kb-arrow" viewBox="0 0 190 100" aria-hidden="true"><path pathLength="1" d="M6 62C38 14 92 10 112 44c14 26-18 44-30 22-12-24 40-46 96-24"/><path pathLength="1" d="M160 28l20 14-22 10"/></svg>',
  star: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 3l9 24 24-11-9 25 23 11-25 7 7 25-23-12-6 25-8-24-23 12 8-25-25-8 24-10-10-24 25 10z"/></svg>'
};

const TONES = ['magenta', 'aqua', 'yellow', 'ink', 'paper'];   // 9 clients % 5 → no repeat at the loop seam

export default function homeB() {
  const proof = flagships();
  const explorerData = cases.map((c) => ({
    slug: c.slug, client: c.client, industry: c.industry, year: c.year, headline: c.headline,
    thumb: c.thumb, metrics: c.metrics, situation: c.situation || null, diagnosis: c.diagnosis || null,
    system: c.system || [], result: c.result || null
  }));
  const pieceCount = cases.reduce((n, c) => n + 3 + c.metrics.length + (c.diagnosis ? 1 : 0) + (c.system || []).length, 0);
  const rot = [-4, 3, -2.5];
  const fanRot = [4, -5, 5, -8, 5];

  const body = `
<div class="kb">

<!-- ===== HERO ===== -->
<header class="kb-hero">
  <div class="k-wrap">
    <p class="kb-eyebrow">Brand, website, automation and campaigns. ${esc(site.location)}.</p>
    <h1 class="kb-h1"><span class="k-sr">Most brands are broken</span>
      <span class="kb-h1__l" aria-hidden="true">Most brands</span>
      <span class="kb-h1__l" aria-hidden="true">are <span class="kb-broken" data-kb-broken>${letters('broken', 7, 0.85)}${MARK.ring}</span></span>
    </h1>
    <p class="kb-lede"><b>We fix them by building systems, not visuals.</b> Positioning that holds up under pressure, an identity other people can build in, a site that filters instead of documents, and the automation that runs while you sleep. In that order, because the order is the whole point.</p>
    <div class="k-btns" style="margin-top:32px">
      ${cta({ label: 'Book a call', href: '/book', track: 'cta_hero_book' })}
      ${cta({ label: 'Test your brand signal', href: '/the-kija-method', style: 'k-btn--ghost kb-btn-ink', track: 'cta_hero_signal_test' })}
    </div>
  </div>
  <div class="kb-stickers" aria-hidden="true">
    <span class="kb-sticker kb-sticker--badge" data-kb-fling data-bubble="Throw it" style="--x:80%;--t:14%;--r:-10deg">Made in<b>Dallas</b>Texas</span>
    <span class="kb-sticker kb-sticker--star" data-kb-fling data-bubble="Throw it" style="--x:70%;--t:52%;--r:8deg">${MARK.star}<span><b>400%</b>revenue,<br>Oak Cliff Pilates</span></span>
    <span class="kb-sticker kb-sticker--tape" data-kb-fling data-bubble="Throw it" style="--x:88%;--t:76%;--r:-4deg">systems &gt; visuals</span>
    <span class="kb-sticker kb-sticker--ticket" data-kb-fling data-bubble="Throw it" style="--x:58%;--t:84%;--r:5deg">Proof first. Always.</span>
  </div>
</header>

<!-- ===== THE SEQUENCE — pinned, sideways; it is a real order ===== -->
<section class="kb-seq" data-kb-seq aria-labelledby="kb-seq-h">
  <div class="kb-seq__pin">
    <div class="kb-seq__track">
      <h2 class="kb-seq__intro" id="kb-seq-h">One system,<br>five parts.<br><span>The order is the whole point.</span></h2>
      ${services.map((s, i) => `
      <a class="kb-word kb-word--${['magenta', 'ink', 'aqua', 'yellow', 'magenta'][i]}" href="/services/${s.slug}" data-track="cta_home_service" data-bubble="Read it">
        <span class="kb-word__seq">${esc(s.sequence)}${s.sequence.toLowerCase() === 'parallel' ? ', alongside the rest' : ''}</span>
        <span class="k-sr">${esc(s.name.split(' ')[0])}</span><span class="kb-word__w" aria-hidden="true">${letters(s.name.split(' ')[0], 20 + i, 1.4)}</span>
        <span class="kb-word__rest">${esc(s.name.split(' ').slice(1).join(' '))}</span>
        <span class="kb-word__p">${esc(s.problem)}</span>
      </a>${i < services.length - 1 ? MARK.arrow : ''}`).join('')}
      <p class="kb-seq__end">In that<br>order.</p>
    </div>
  </div>
</section>

<!-- ===== PROOF — cards you can fling ===== -->
<section class="kb-proof">
  <div class="k-wrap">
    <h2 class="kb-h2" data-reveal>The proof, <span class="kb-underlined">first${MARK.under}</span></h2>
    <p class="kb-sub">Every number on this site was confirmed in writing by the client. No extrapolation, no “up to”, no invented dollar figures.</p>
    <div class="kb-proof__table">
      ${proof.map((c, i) => `
      <a class="kb-pcard kb-pcard--${esc(c.thumb.tone)}" href="/work/${c.slug}" data-kb-fling-hover data-bubble="Read the case" data-track="cta_case_card" style="--r:${rot[i]}deg">
        <span class="kb-pcard__who">${esc(c.client)}</span>
        <span class="kb-pcard__n" data-ticker>${esc(c.metrics[0].value)}</span>
        <span class="kb-pcard__l">${esc(c.metrics[0].label)}</span>
        <span class="kb-pcard__h">${esc(c.headline)}</span>
      </a>`).join('')}
      <a class="kb-explore" href="/work#explore" data-explore data-bubble="Explore" data-track="cta_home_b_explore">
        <span class="kb-explore__ring" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="kb-ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs><text><textPath href="#kb-ring">explore the wall · explore the wall · explore the wall ·</textPath></text></svg></span>
        <span class="kb-explore__c"><b>${pieceCount}</b>pieces of proof, every direction</span>
      </a>
    </div>
  </div>
</section>

<!-- ===== SERVICES — a fanned hand of cards ===== -->
<section class="kb-fan">
  <div class="k-wrap">
    <h2 class="kb-h2" data-reveal>Where we come <span class="kb-underlined">in${MARK.under}</span></h2>
    <p class="kb-sub">Five capabilities, one sequence. Each card is what you are left holding at the end.</p>
  </div>
  <div class="kb-fan__deck" data-kb-fan>
    ${services.map((s, i) => `
    <a class="kb-card kb-card--${['magenta', 'paper', 'aqua', 'yellow', 'ink'][i]}" href="/services/${s.slug}" style="--r:${fanRot[i]}deg" data-bubble="See it" data-track="cta_home_service_card">
      <span class="kb-card__seq">${esc(s.sequence)}</span>
      <span class="kb-card__t">${esc(s.name)}</span>
      <svg class="kb-card__rule" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true"><path d="M2 5c30-4 60 3 98-1s70-3 98 0"/></svg>
      <span class="kb-card__l">${s.process.map((p) => `<span>${esc(p.out)}</span>`).join('')}</span>
    </a>`).join('')}
  </div>
</section>

<!-- ===== DOUBLE TAPE ===== -->
<section class="kb-tapes" aria-label="Clients and principles">
  ${(() => {
    const clients = cases.map((c, i) => `<a class="kb-pill kb-pill--${TONES[i % TONES.length]}" href="/work/${c.slug}" data-bubble="Open">${esc(c.client)}</a>`).join('');
    const rules = ['Strategy before design', 'Proof before praise', 'Systems, not visuals', 'We disagree in writing, early', 'No countdown timers', 'Brand before website']
      .map((r) => `<span class="kb-rule">${esc(r)}<span class="kb-rule__s" aria-hidden="true">${MARK.star}</span></span>`).join('');
    return `
  <div class="kb-tape kb-tape--a"><div class="kb-tape__t"><div class="kb-tape__set">${clients}</div><div class="kb-tape__set" aria-hidden="true" inert>${clients}</div></div></div>
  <div class="kb-tape kb-tape--b"><div class="kb-tape__t"><div class="kb-tape__set">${rules}</div><div class="kb-tape__set" aria-hidden="true">${rules}</div></div></div>`;
  })()}
</section>

<!-- ===== CLOSE — stickers that get out of your way ===== -->
<section class="kb-end" data-kb-push>
  <div class="k-wrap">
    <h2 class="kb-end__h">Let’s find out<br>what’s broken</h2>
    <p class="kb-end__p">Thirty minutes. We will tell you what we would do first and why, whether or not you hire us to do it. If we are the wrong shop for the problem, we will say that too, and point you at who is not.</p>
    <div class="k-btns" style="margin-top:34px">
      ${cta({ label: 'Book a call', href: '/book', track: 'cta_footer_band_book' })}
      ${cta({ label: 'Or take the test first', href: '/the-kija-method', style: 'k-btn--ghost', track: 'cta_footer_band_signal' })}
    </div>
  </div>
  <div aria-hidden="true">
    <span class="kb-psticker kb-psticker--yellow" style="--x:72%;--t:12%;--r:9deg">1 → 3<small>locations</small></span>
    <span class="kb-psticker kb-psticker--aqua" style="--x:86%;--t:46%;--r:-7deg">83%<small>direct bookings</small></span>
    <span class="kb-psticker kb-psticker--paper" style="--x:75%;--t:72%;--r:4deg">49%<small>event signups</small></span>
    <span class="kb-psticker kb-psticker--ink" style="--x:90%;--t:84%;--r:-12deg">2.1×<small>ad conversion</small></span>
  </div>
</section>

<div class="kb-bubble" aria-hidden="true"><span></span></div>
<div class="kb-scribble" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path pathLength="1" d="M-12 2 C30 0 70 20 112 10 C70 14 30 34 -12 26 C30 24 70 44 112 34 C70 38 30 58 -12 50 C30 48 70 68 112 58 C70 62 30 82 -12 74 C30 72 70 92 112 82 C70 86 30 106 -12 98 C30 96 70 116 112 106"/></svg></div>

<script type="application/json" id="k-cases-data">${JSON.stringify(explorerData).replace(/</g, '\\u003c')}</script>
</div>`;

  return {
    path: '/b',
    title: 'Option B',
    description: site.description,
    body,
    variant: 'home-b',
    noindex: true,
    scripts: ['/assets/widgets/home-b.js', '/assets/widgets/work-explorer.js']
  };
}
