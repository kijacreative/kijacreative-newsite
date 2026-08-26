import { esc } from '../templates/layout.js';
import { head, hero, cards, ctaBand, steps } from '../templates/blocks.js';
import { site } from '../data/site.js';

/* ---------- /about -------------------------------------------------------- */
export function aboutPage() {
  const body = `
${hero({
    eyebrow: 'About',
    title: 'A growth partner<br>that also operates',
    lede: '<b>Kija Creative is a Dallas brand and growth studio that owns and runs businesses of its own.</b> That is not a personality detail — it is the reason our advice is sequenced the way it is, and the reason we will tell you to spend less than you were expecting more often than you would think.',
    meta: [
      { k: 'Based in', v: site.location },
      { k: 'Model', v: 'Partner, not vendor' },
      { k: 'Also operates', v: 'Oak Cliff Pilates' },
      { k: 'Team', v: 'Small, senior, hands on the work' }
    ]
  })}

<section class="k-section">
  <div class="k-wrap">
    ${head({ num: '01', title: 'What we believe', sub: 'Four positions we hold consistently enough that you should know them before a first call.' })}
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
    ${head({ num: '02', title: 'The third<br>space idea', sub: 'The concept that came out of running Oak Cliff Pilates, and that now shapes how we look at every brand.' })}
    <div class="k-split">
      <div class="k-body-copy k-lede">
        <p>A third space is the place that is neither home nor work — the one people choose to be in, and that becomes part of how they describe themselves.</p>
        <p>We found the idea by accident, running a Pilates studio that was competing on price against chains and losing. The studio was selling a workout. Members were buying somewhere to belong.</p>
        <p>Once that was named, everything downstream had a rule to follow: what the space should look like, who to hire, what to say, what to refuse. Revenue grew 400% and one location became three.</p>
        <p>Most brands have a third-space idea buried somewhere in what their best customers already say about them. Finding it is most of what Creative Strategy actually is.</p>
      </div>
      <div>
        <div class="k-card k-card--mag">
          <h4 class="k-label--mag">Where it came from</h4>
          <h3 style="margin-top:12px">Oak Cliff Pilates</h3>
          <p class="k-dim" style="margin-top:14px">We own and operate it. Every play on this site was run there first, on our own money, before it was ever sold to a client.</p>
          <p style="margin-top:18px"><a class="k-link" href="/oak-cliff-pilates-story">The full story</a></p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '03', title: 'How we work', sub: 'The same shape on every engagement, whatever the size.' })}
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
    description: 'Kija Creative is a Dallas brand and growth partner that also owns and operates businesses of its own.',
    body
  };
}

/* ---------- /insights ----------------------------------------------------
   AEO-structured. Each article answers one question in the first paragraph,
   then supports it — so answer engines can quote the answer, not just index
   the page. Articles are authored in Phase 1; this is the index and the
   structure they slot into.
   ------------------------------------------------------------------------ */
const ARTICLES = [
  { slug: 'brand-before-website', q: 'Should you rebrand before rebuilding your website?',
    a: 'Yes, in almost every case. A website is an application of a brand system; building one before the system exists means building it twice.',
    tag: 'Creative Strategy', read: '6 min' },
  { slug: 'what-a-brand-system-includes', q: 'What is actually in a brand system?',
    a: 'Rules, not files. Colour roles, a type scale, spacing, motion, photography direction and voice — enough that someone who has never met you can produce on-brand work.',
    tag: 'Brand Development', read: '8 min' },
  { slug: 'website-conversion-rate-benchmarks', q: 'What is a good conversion rate for a B2B services website?',
    a: 'Between 2% and 5% of visitors to enquiry is typical. The more useful number is the one you are at now, which most businesses cannot state.',
    tag: 'Website Design', read: '5 min' },
  { slug: 'speed-to-lead', q: 'How fast do you need to respond to a new lead?',
    a: 'Inside five minutes to be competitive, inside sixty seconds to be memorable. After an hour you are usually competing for a decision that has already been made.',
    tag: 'Marketing Automation', read: '4 min' },
  { slug: 'when-to-start-paid-ads', q: 'When should you start running paid ads?',
    a: 'After the position is settled and the landing page converts. Paid amplifies whatever is underneath it, including the problems.',
    tag: 'Ongoing Marketing', read: '6 min' },
  { slug: 'agency-vs-in-house', q: 'Should you hire an agency or build the function in-house?',
    a: 'In-house wins on context and consistency. Agencies win on range and speed of setup. The honest split is usually agency to build the system, in-house to run it.',
    tag: 'Creative Strategy', read: '7 min' }
];

export function insightsPage() {
  const body = `
${hero({
    eyebrow: 'Insights',
    title: 'Answers,<br>not think-pieces',
    lede: '<b>Every article here answers one question in its first paragraph and then earns it.</b> Structured that way on purpose — so an answer engine can quote the answer, and so you can leave after the first paragraph if that is all you needed.'
  })}

<section class="k-section">
  <div class="k-wrap">
    <div class="k-grid k-g2">
      ${ARTICLES.map((a, i) => `
      <article class="k-card k-card--accent" data-reveal="${i * 50}">
        <h4>${esc(a.tag)} &middot; ${esc(a.read)}</h4>
        <h3 style="margin-top:12px;max-width:22ch">${esc(a.q)}</h3>
        <p class="k-dim" style="margin-top:14px">${esc(a.a)}</p>
        <p class="k-label k-label--dim" style="margin-top:16px">Full article publishing in phase 1</p>
      </article>`).join('')}
    </div>
    <div class="k-callout" style="margin-top:30px">
      <h4 class="k-label--yellow">Why the answer comes first</h4>
      <p style="margin-top:10px;max-width:66ch">Search is increasingly answered rather than listed. An article that buries its conclusion under six hundred words of preamble does not get quoted, and a page nobody quotes does not get found. The structure is the SEO.</p>
    </div>
  </div>
</section>

${ctaBand({
    num: '02',
    title: 'Or ask us<br>directly',
    lede: 'Reading is slower than asking. Thirty minutes and we will answer the version of the question that is actually yours.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_insights_band_book' },
    secondary: { label: 'Test your brand signal', href: '/the-kija-method', track: 'cta_insights_band_signal' }
  })}`;

  return {
    path: '/insights',
    title: 'Insights',
    description: 'Direct answers to the questions that come up before a brand, website or campaign project — structured to be quoted, not just indexed.',
    body,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ARTICLES.map((a) => ({
        '@type': 'Question', name: a.q,
        acceptedAnswer: { '@type': 'Answer', text: a.a }
      }))
    }
  };
}

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
        ['See the work', '/work', 'Nine projects, verified numbers.'],
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
