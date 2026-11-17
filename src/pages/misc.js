import { esc } from '../templates/layout.js';
import { head, hero, cards, ctaBand, steps } from '../templates/blocks.js';
import { site } from '../data/site.js';
import { listed, featured } from '../data/cases.js';

/* ---------- /about -------------------------------------------------------- */
export function aboutPage() {
  const body = `
${hero({
    // from the live kijacreative.com "Who we are" section
    eyebrow: 'Who we are · est. ' + site.established,
    title: 'Design. Strategy.<br>Technical execution.',
    lede: '<b>We’re the intersection of all three.</b> Kija Creative was built on the idea that brands don’t grow from one good idea — they grow from alignment. Alignment between message and design. Between strategy and execution. Between vision and systems. We’re here to make sure every one of those moments makes sense.',
    ctas: [
      { label: 'Book a call', href: '/book', track: 'cta_about_book' },
      { label: 'Free brand review', href: '/brand-review', style: 'k-btn--ghost', track: 'cta_about_review' }
    ],
    meta: [
      { k: 'Based in', v: site.location },
      { k: 'Established', v: site.established },
      { k: 'Studio', v: site.address.street + ', ' + site.address.city },
      { k: 'Contact', v: site.email }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ title: 'What we believe', sub: 'Four positions we hold consistently enough that you should know them before a first call.' })}
    ${cards([
      { label: 'Belief 01', title: 'Systems beat visuals', accent: 'accent', body: 'A beautiful asset solves one problem once. A system solves the same class of problem every time somebody new opens a file.' },
      { label: 'Belief 02', title: 'Sequence is not a preference', accent: 'accent', body: 'Brand before site. Site before paid. Skipping a step does not save money, it defers the cost and adds interest.' },
      { label: 'Belief 03', title: 'The uncomfortable answer is the useful one', accent: 'accent', body: 'If the diagnosis is flattering, it is probably wrong. We will disagree with you early, in writing, while it is still cheap.' },
      { label: 'Belief 04', title: 'Show the numbers or do not claim them', accent: 'mag', body: 'Every figure on this site was confirmed in writing by the client. Where a project has no number, it has no number.' }
    ], 'k-g2')}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'Good taste will<br>not be replaced.', sub: 'Kija Creative, est. ' + site.established + ', by designers, developers, and creative thinkers. Behind the work of artists, startups, and emerging brands, with the strategy, design, and systems to back it up.' })}
    <div class="k-grid k-g4">
      ${featured().map((c) => `
      <a class="k-card k-card--accent" href="/work/${c.slug}" data-track="cta_about_case">
        <p class="k-label k-label--dim">${esc(c.industry)}</p>
        <h3 style="margin-top:8px">${esc(c.client)}</h3>
        <p class="k-metric" style="margin-top:16px"><b>${esc(c.metrics[0].value)}</b><span>${esc(c.metrics[0].label)}</span></p>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'How we work', sub: 'The same shape on every engagement, whatever the size.' })}
    ${steps([
      { t: 'Diagnose before quoting', d: 'We will not price work before we understand the problem. A number without scope is a guess with a decimal point.', out: 'Written diagnosis' },
      { t: 'Agree the sequence', d: 'What comes first, what comes later, what is explicitly out of scope. Both sides sign the same understanding.', out: 'Scope + sequence' },
      { t: 'Build in the open', d: 'Work in progress, not big reveals. Surprises at the end are a process failure, not a presentation style.', out: 'Working reviews' },
      { t: 'Hand over something usable', d: 'Systems, documentation and access. If you can only operate it with us in the room, we built it wrong.', out: 'Handover + training' }
    ])}
  </div>
</section>

${ctaBand({
    num: '04',
    title: 'Come and<br>disagree with us',
    lede: 'Thirty minutes, no deck. Bring the thing you are most frustrated by.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_about_band_book' },
    secondary: { label: 'Test your brand signal', href: '/the-kija-method', track: 'cta_about_band_signal' }
  })}`;

  return {
    path: '/about',
    title: 'About',
    description: 'Kija Creative is a Dallas creative studio, est. 2022: the intersection of design, strategy, and technical execution.',
    body
  };
}

/* ---------- /insights ----------------------------------------------------
   AEO-structured. Each article answers one question in the first paragraph,
   then supports it — so answer engines can quote the answer, not just index
   the page. Articles are authored in Phase 1; this is the index and the
   structure they slot into.
   ------------------------------------------------------------------------ */

/* ---------- legal + 404 --------------------------------------------------- */
const legalShell = (path, title, intro, sections) => ({
  path, title,
  description: `${title} for ${site.domain}.`,
  noindex: false,
  noSticky: true,
  body: `
${hero({ eyebrow: 'Legal', title: esc(title), lede: `<b>${esc(intro)}</b>`, glow: false })}
<section class="k-section" style="padding-top:0">
  <div class="k-wrap">
    <div class="k-prose k-body-copy">
      ${sections.map((s) => `<h3 style="margin-top:36px">${esc(s.t)}</h3><p class="k-dim" style="margin-top:12px">${esc(s.d)}</p>`).join('')}
      <p class="k-label k-label--dim" style="margin-top:44px">Questions: <a class="k-link" href="mailto:${site.email}">${site.email}</a></p>
      <!-- REVIEW REQUIRED: this is a working draft written to match the site's
           actual data practices. Have counsel review before launch. -->
    </div>
  </div>
</section>`
});

export const privacyPage = () => legalShell('/privacy', 'Privacy', 'What we collect, why, and how to make us stop.', [
  { t: 'What we collect', d: 'Anything you type into a form on this site: your name, email, company, and the answers you give in the Brand Signal Test or Fit Finder. We also collect standard analytics — pages viewed, referring source, and any UTM parameters attached to the link you arrived on.' },
  { t: 'Why we collect it', d: 'To reply to you, to send the specific thing you asked for, and to understand which pages do their job. Your Signal Test and Fit Finder answers are used to make our response specific to your situation rather than generic.' },
  { t: 'Where it goes', d: 'Into our CRM (GoHighLevel), and into our analytics tools. We do not sell it, we do not rent it, and we do not share it with anyone who is not helping us run this business.' },
  { t: 'Cookies', d: 'We set a cookie to remember which version of a page you were shown, so you get a consistent experience on a return visit, and one to remember where you came from so we can attribute a lead correctly. Both expire and neither follows you off this site.' },
  { t: 'Getting out', d: 'Every email has a one-click unsubscribe and it works immediately. To have your record deleted entirely, email us and we will do it and confirm when it is done.' },
  { t: 'Changes', d: 'If this policy changes materially, we will say so on this page with the date.' }
]);

export const termsPage = () => legalShell('/terms', 'Terms', 'The short version of how this site works.', [
  { t: 'This site', d: 'The content here is provided as-is for information. Nothing on it is a contract, a quote or a guarantee of a result. Engagements are governed by the signed agreement, not by a web page.' },
  { t: 'Results shown', d: 'Every figure published in a case study was confirmed in writing by the client it belongs to. They describe what happened in that engagement, and they are not a prediction about yours.' },
  { t: 'Free tools', d: 'The Brand Signal Test and Fit Finder produce an opinion generated from the answers you give. They are a starting point for a conversation, not professional advice, and they are deliberately incapable of quoting you a price.' },
  { t: 'Our work', d: 'Content, code and design on this site belong to Kija Creative. Client marks belong to the clients. Ask before republishing anything and we will usually say yes.' },
  { t: 'Liability', d: 'We are not liable for decisions made on the basis of a free tool or a blog post. Hire us and there is a contract that says what we are liable for.' }
]);

export function notFoundPage() {
  return {
    path: '/404',
    title: 'Page not found',
    description: 'That page does not exist.',
    noindex: true,
    noSticky: true,
    body: `
${hero({
      eyebrow: 'Error 404',
      title: 'That page<br>does not exist',
      lede: '<b>Which is a small example of the thing we are usually hired to fix:</b> a system where something was moved and nothing was pointed at where it went. Here is where you were probably heading.'
    })}
<section class="k-section" style="padding-top:0">
  <div class="k-wrap">
    <div class="k-grid k-g4">
      ${[
        ['See the work', '/work', `${listed().length} projects, real numbers.`],
        ['The services', '/services', 'Five capability lines, in sequence.'],
        ['Test your brand', '/the-kija-method', 'Four minutes, real diagnosis.'],
        ['Book a call', '/book', 'Thirty minutes, no deck.']
      ].map(([t, h, d]) => `
      <a class="k-card k-card--accent" href="${h}" data-track="cta_404">
        <h3>${esc(t)}</h3><p class="k-dim k-sm" style="margin-top:10px">${esc(d)}</p>
      </a>`).join('')}
    </div>
  </div>
</section>`
  };
}
