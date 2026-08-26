import { esc } from '../templates/layout.js';
import { head, hero, cards, ctaBand, kpiCard, metaStrip, caseCard } from '../templates/blocks.js';
import { bySlug } from '../data/cases.js';
import { site } from '../data/site.js';

/* ==========================================================================
   /brand-system — Brand Development, demonstrated.
   Rendered from the same tokens.css the rest of the site uses. If a value
   changes there it changes here, which is the entire point.
   ========================================================================== */
const SWATCHES = [
  ['--k-ink', '#1E0A1E', 'Aubergine', 'Page ground. Everything sits on this.'],
  ['--k-ink-2', '#2C1230', 'Surface', 'Raised surfaces — cards, widgets, rows.'],
  ['--k-ink-3', '#3A1A3E', 'Surface 2', 'Second-level raise inside a surface.'],
  ['--k-mint', '#3DFFAE', 'Mint', 'Primary action. One per screen region.'],
  ['--k-magenta', '#C21E7A', 'Magenta', 'Emphasis and the left edge of the aberration.'],
  ['--k-cream', '#F5F3EC', 'Cream', 'Primary text. Never pure white.'],
  ['--k-aqua', '#C6F5E8', 'Aqua', 'Code, tertiary accent, stripe segment.'],
  ['--k-yellow', '#F5E61A', 'Yellow', 'Attention. Used sparingly or it stops working.']
];

const TYPE_SCALE = [
  ['--k-t-mega', 'League Gothic', '56 → 160', 'Hero only. One per page.'],
  ['--k-t-xxl', 'League Gothic', '42 → 100', 'h1 on interior pages.'],
  ['--k-t-xl', 'League Gothic', '34 → 68', 'Section headings.'],
  ['--k-t-lg', 'League Gothic', '25 → 38', 'Large card headings.'],
  ['--k-t-md', 'League Gothic', '27', 'Standard h3.'],
  ['--k-t-lede', 'Lato', '17 → 21', 'Lede paragraphs.'],
  ['--k-t-base', 'Lato', '16.5', 'Body copy.'],
  ['--k-t-label', 'JetBrains Mono', '11', 'Labels, eyebrows, buttons.']
];

export function brandSystemPage() {
  const body = `
${hero({
    eyebrow: 'Proof of practice · Brand Development',
    title: 'Our system,<br>in public',
    lede: '<b>This is not a case study about a design system. It is the design system this page is rendered from.</b> Every token below is live — change one value in <code>tokens.css</code> and this page changes with the rest of the site. If we could not hold our own rules, you should not let us write yours.',
    ctas: [{ label: 'See how we build them', href: '/services/brand-development', track: 'cta_brandsystem_service' }],
    meta: [
      { k: 'Tokens', v: '48 custom properties' },
      { k: 'Type families', v: '3' },
      { k: 'Components', v: '24 in the library' },
      { k: 'Source of truth', v: 'tokens.css' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '01', title: 'Colour', sub: 'Eight values with defined roles. A colour without a role is decoration, and decoration gets used inconsistently by definition.' })}
    <div class="k-grid k-g4">
      ${SWATCHES.map(([token, hex, name, role]) => `
      <div class="k-card" style="padding:0;overflow:hidden">
        <div style="background:var(${token});height:104px;border-bottom:1px solid var(--k-line)"></div>
        <div style="padding:18px">
          <h4>${esc(name)}</h4>
          <p class="k-mono k-xs k-mint" style="margin-top:8px">${esc(token)}</p>
          <p class="k-mono k-xs k-dim">${esc(hex)}</p>
          <p class="k-dim k-xs" style="margin-top:10px">${esc(role)}</p>
        </div>
      </div>`).join('')}
    </div>
    <div class="k-callout" style="margin-top:26px">
      <h4 class="k-label--yellow">The one rule that matters</h4>
      <p style="margin-top:10px">Mint is the action colour and nothing else. The moment a mint element is not clickable, every mint element stops meaning anything. Same rule, different colour, applies in any system worth having.</p>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'Type', sub: 'League Gothic compressed for display, Lato for anything you have to read, JetBrains Mono for labels and data. Three families, no exceptions, no decorative fourth.' })}
    <div class="k-scroll-x">
      <table class="k-tbl">
        <thead><tr><th style="width:22%">Token</th><th style="width:22%">Family</th><th style="width:16%">Size (px)</th><th>Use</th></tr></thead>
        <tbody>
          ${TYPE_SCALE.map(([t, f, s, u]) => `<tr><td><code>${esc(t)}</code></td><td>${esc(f)}</td><td class="k-mono k-xs">${esc(s)}</td><td class="k-dim">${esc(u)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="k-card" style="margin-top:26px">
      <h4>Live specimen</h4>
      <p class="k-display" style="font-size:var(--k-t-xxl);margin-top:18px;line-height:.9">Systems, not visuals</p>
      <p class="k-lede" style="margin-top:18px">Lede text carries the argument. It is dimmed rather than sized down, so the hierarchy survives being read on a phone at arm's length.</p>
      <p style="margin-top:14px">Body copy sits at 16.5px with a 1.65 line height. Long enough to read comfortably, short enough that a paragraph does not become an obligation.</p>
      <p class="k-label" style="margin-top:18px">Labels are mono, uppercase, letter-spaced</p>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '03', title: 'The signature', sub: 'Every system needs one thing that is unmistakably yours. Ours is chromatic aberration — a magenta and mint RGB split on display type, borrowed from a printing error and used deliberately.' })}
    <div class="k-card" style="text-align:center;padding:clamp(32px,6vw,64px)">
      <p class="k-display k-split-text" style="font-size:var(--k-t-xl)">Most brands are broken</p>
      <p class="k-label k-label--dim" style="margin-top:24px">.k-split-text — magenta 3px left, mint 3px right</p>
    </div>
    <div style="margin-top:20px">${cards([
      { label: 'Rule 01', title: 'Display type only', body: 'Never on body copy. It is a signature, not a texture, and it destroys legibility below about 32px.' },
      { label: 'Rule 02', title: 'Offset stays proportional', body: '3px at hero scale, 2px below it. Fixed offsets look accidental at the wrong size.' },
      { label: 'Rule 03', title: 'One per viewport', body: 'Two split headlines in view at once and neither reads as deliberate.' }
    ])}</div>
    <div style="margin-top:34px">
      <h4>The structural accent</h4>
      <p class="k-dim" style="margin-top:12px;max-width:60ch">The rainbow stripe brackets every page — top and bottom, six pixels, five fixed segments. It is the only ornamental element in the system, which is what lets it work.</p>
      <div class="k-stripe" style="margin-top:18px;border-radius:var(--k-r-pill)"></div>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '04', title: 'Components', sub: 'Rendered live from the same stylesheet the rest of the site loads.' })}
    <div class="k-grid k-g2">
      <div class="k-card">
        <h4>Buttons</h4>
        <div class="k-btns" style="margin-top:18px">
          <span class="k-btn k-btn--primary">Primary</span>
          <span class="k-btn k-btn--ghost">Ghost</span>
          <span class="k-btn k-btn--mag">Magenta</span>
          <span class="k-btn k-btn--primary k-btn--sm">Small</span>
        </div>
        <p class="k-dim k-xs" style="margin-top:16px">One primary per screen region. Ghost for the secondary path. Magenta is reserved for destructive or contrarian actions and is almost never used.</p>
      </div>
      <div class="k-card">
        <h4>Tags</h4>
        <div class="k-tags" style="margin-top:18px">
          <span class="k-tag k-tag--mint">Verified metric</span>
          <span class="k-tag k-tag--mag">Retained</span>
          <span class="k-tag k-tag--yellow">Entry tier</span>
          <span class="k-tag k-tag--aqua">Aqua</span>
          <span class="k-tag k-tag--out">Capability</span>
        </div>
        <p class="k-dim k-xs" style="margin-top:16px">Mint tags carry confirmed numbers and nothing else. That constraint is what makes them credible on the proof wall.</p>
      </div>
      <div class="k-card">
        <h4>Form controls</h4>
        <div class="k-field" style="margin-top:18px">
          <label class="k-field__l" for="demo-in">Text input</label>
          <input class="k-input" id="demo-in" placeholder="Focus me — the border goes mint">
        </div>
        <div class="k-choices" style="margin-top:16px">
          <label class="k-choice"><input type="radio" name="demo" checked><span class="k-choice__box" aria-hidden="true"></span><span class="k-choice__t"><b>Selected state</b>Mint fill, mint border, tinted background.</span></label>
          <label class="k-choice"><input type="radio" name="demo"><span class="k-choice__box" aria-hidden="true"></span><span class="k-choice__t"><b>Unselected</b>Hover raises the surface one level.</span></label>
        </div>
      </div>
      <div class="k-card">
        <h4>Motion</h4>
        <ul class="k-list" style="margin-top:18px">
          <li><b style="color:var(--k-cream)">150ms</b> — hover and focus. Anything slower feels broken.</li>
          <li><b style="color:var(--k-cream)">280ms</b> — state changes, drawers, accordions.</li>
          <li><b style="color:var(--k-cream)">600ms</b> — scroll reveals and data animations only.</li>
          <li><b style="color:var(--k-cream)">Always</b> — <code>prefers-reduced-motion</code> disables all of it. Non-negotiable.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '05', title: 'Voice', sub: 'The part most systems skip, which is why most brands look consistent and read like four different companies.' })}
    ${cards([
      { label: 'We do', title: 'State it plainly', accent: 'accent', body: 'Short sentences. Concrete nouns. The uncomfortable version rather than the diplomatic one.' },
      { label: 'We do', title: 'Frame in outcomes', accent: 'accent', body: 'Not "we offer brand strategy". What breaks without it, and what it costs.' },
      { label: 'We do', title: 'Ask open questions', accent: 'accent', body: 'Open questions over hard closes. If the offer needs pressure, the offer is the problem.' },
      { label: 'We never', title: 'Manufacture urgency', accent: 'warn', body: 'No countdown timers, no expiring slots. We flagged it as a red flag in a client audit, so we do not run it on ourselves.' },
      { label: 'We never', title: 'Use filler', accent: 'warn', body: 'No \u201cin today\u2019s fast-paced landscape\u201d. If a sentence survives being deleted, delete it.' },
      { label: 'We never', title: 'Claim what we cannot show', accent: 'warn', body: 'Every number on this site was confirmed in writing. One fabricated figure costs the whole wall.' }
    ])}
  </div>
</section>

${ctaBand({
    num: '06',
    title: 'Want one<br>of these?',
    lede: 'A system you can hand to someone else and have them build in it correctly on the first try. That is the deliverable — not a folder of files.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_brandsystem_band_book' },
    secondary: { label: 'Brand Development', href: '/services/brand-development', track: 'cta_brandsystem_band_service' }
  })}`;

  return {
    path: '/brand-system',
    title: 'Our brand system',
    description: 'The live design system this site is rendered from — tokens, type scale, components, motion rules and voice, published in full.',
    body
  };
}

/* ==========================================================================
   /now — the live campaign shelf (Ongoing Marketing, demonstrated)
   Update monthly. Including the things that are not working — that is the
   part that makes the page worth anything.
   ========================================================================== */
export function nowPage() {
  const body = `
${hero({
    eyebrow: 'Proof of practice · Ongoing Marketing · updated monthly',
    title: 'What we are<br>running now',
    lede: '<b>Every campaign live this month — for clients and for our own business — including the ones that are not working yet.</b> This is the least comfortable page on the site, which is exactly why it is on it. Anyone can show you the case study after it worked.',
    meta: [
      { k: 'Updated', v: 'Monthly, first week' },
      { k: 'Campaigns live', v: '7' },
      { k: 'Ours vs client', v: '3 / 4' },
      { k: 'Currently failing', v: '2 — listed below' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '01', title: 'Running for us' })}
    <div class="k-rows">
      ${[
        ['Brand teardowns', 'Working', 'Weekly video teardown of a real brand, posted to LinkedIn and YouTube. Highest-engagement thing we make and the biggest driver into the Signal Test.', 'k-tag--mint'],
        ['Signal Test paid, cold', 'Learning', 'Meta and YouTube against problem-aware audiences, optimised for test completion rather than clicks. Cost per completion is moving in the right direction; cost per booked call is not yet.', 'k-tag--yellow'],
        ['Monthly list', 'Working', 'One teardown, one client result, one thing we learned running Oak Cliff Pilates. Slow-growing and the highest-intent list we have.', 'k-tag--mint']
      ].map(([t, s, d, cls]) => `
      <div class="k-row">
        <div class="k-row__t"><span class="k-tag ${cls}">${esc(s)}</span><h3 style="margin-top:14px">${esc(t)}</h3></div>
        <div style="grid-column:span 2"><p class="k-dim">${esc(d)}</p></div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'Running for clients', sub: 'Named where the client is happy to be named, described generically where they are not.' })}
    <div class="k-rows">
      ${[
        ['Oak Cliff Pilates — local acquisition', 'Working', 'Geo-targeted paid plus member-generated content across three locations. Our own business, so it is also where we break things first.', 'k-tag--mint'],
        ['Van Country — seasonal demand', 'Working', 'Search and retargeting against trip-type landing pages rather than the fleet page. Continues to outperform the old structure.', 'k-tag--mint'],
        ['Nonprofit — event signups', 'Learning', 'Campaign refresh ahead of the annual event. Creative is testing well, the landing page is not converting at the rate the last one did. Being rebuilt this month.', 'k-tag--yellow'],
        ['B2B services — content engine', 'Not working yet', 'Long-form plus AEO structuring. Six weeks in, indexation is fine, citations in answer engines are not appearing. Either the structure is wrong or the timeline is longer than we assumed. We will say which by next month.', 'k-tag--mag']
      ].map(([t, s, d, cls]) => `
      <div class="k-row">
        <div class="k-row__t"><span class="k-tag ${cls}">${esc(s)}</span><h3 style="margin-top:14px">${esc(t)}</h3></div>
        <div style="grid-column:span 2"><p class="k-dim">${esc(d)}</p></div>
      </div>`).join('')}
    </div>
    <div class="k-callout" style="margin-top:28px">
      <h4 class="k-label--yellow">Why we publish the failures</h4>
      <p style="margin-top:10px;max-width:66ch">Because an agency that has never shown you a campaign that did not work has either been extraordinarily lucky or is editing. The interesting question is not whether something failed — it is how quickly it got noticed and what happened next.</p>
    </div>
  </div>
</section>

${ctaBand({
    num: '03',
    title: 'Want this<br>running for you?',
    lede: 'Same operators, same monthly rhythm, same willingness to tell you when something is not working before you notice it yourself.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_now_band_book' },
    secondary: { label: 'Growth Engine', href: '/growth-engine', track: 'cta_now_band_offer' }
  })}`;

  return {
    path: '/now',
    title: 'What we are running now',
    description: 'The live campaign shelf — every campaign we are running this month for clients and for ourselves, including the ones that are not working.',
    body
  };
}

/* ==========================================================================
   /oak-cliff-pilates-story — the owner-operator differentiator
   ========================================================================== */
export function ocpStoryPage() {
  const c = bySlug('oak-cliff-pilates');
  const body = `
${hero({
    eyebrow: 'Proof of practice · owner-operated',
    title: 'We run a business<br>on this playbook',
    lede: '<b>Oak Cliff Pilates is not a client. It is ours.</b> Which means every play on this site was run on our own money before it was ever sold to anyone else — and when one of them did not work, we felt it in a way that no retainer can replicate.',
    ctas: [
      { label: 'Read the case study', href: '/work/oak-cliff-pilates', style: 'k-btn--ghost', track: 'cta_ocp_case' },
      { label: 'Book a call', href: '/book', track: 'cta_ocp_book' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    <div class="k-grid k-g3">
      ${c.metrics.map((m) => kpiCard(m)).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '01', title: 'Why this<br>matters to you', sub: 'Not because the numbers are good. Because of what operating changes about how we advise.' })}
    ${cards([
      { label: 'Consequence 01', title: 'We have signed the invoice', accent: 'accent', body: 'We know what it feels like to approve a marketing spend that might not work, with money that is also payroll. That changes what we recommend and how confidently we recommend it.' },
      { label: 'Consequence 02', title: 'We have run the playbook end to end', accent: 'accent', body: 'Positioning, identity, site, automation, campaigns, expansion. Not as five projects for five clients — as one business, in sequence, over four years.' },
      { label: 'Consequence 03', title: 'We know which parts are hard', accent: 'accent', body: 'The sequence on this site is not theory about what should work. It is the order we found out actually works, including the two things we did in the wrong order first.' },
      { label: 'Consequence 04', title: 'We cannot hide behind the deck', accent: 'mag', body: 'If our advice were wrong, our own business would show it. That is a more uncomfortable form of accountability than a case study, and a more useful one for you.' }
    ], 'k-g2')}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'What we got<br>wrong first', sub: 'The part that usually gets left out.' })}
    ${cards([
      { label: 'Mistake 01', title: 'We ran ads too early', accent: 'warn', body: 'Before the positioning was settled. It worked badly and we blamed the creative for two months before admitting the problem was upstream.' },
      { label: 'Mistake 02', title: 'We sold class packs too long', accent: 'warn', body: 'The offer contradicted the position. A third space is somewhere you belong, not somewhere you visit nine more times.' },
      { label: 'Mistake 03', title: 'We under-built the system', accent: 'warn', body: 'The first identity worked for one studio and broke at three. Now we build every system against the hardest application, not the first one.' }
    ])}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '03', title: 'The full story' })}
    <div class="k-grid k-g2">${caseCard(c)}${caseCard(bySlug('van-country'))}</div>
  </div>
</section>

${ctaBand({
    num: '04',
    title: 'Same playbook,<br>your business',
    lede: 'Thirty minutes. We will tell you which part of the sequence you are actually at, which is usually earlier than people expect and cheaper than they fear.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_ocp_band_book' },
    secondary: { label: 'Test your brand signal', href: '/the-kija-method', track: 'cta_ocp_band_signal' }
  })}`;

  return {
    path: '/oak-cliff-pilates-story',
    title: 'The Oak Cliff Pilates story',
    description: 'Kija Creative operates Oak Cliff Pilates. Every play we sell was run on our own business first — including the ones that failed.',
    body
  };
}
