import { esc, abRedirect } from '../templates/layout.js';
import { head, hero, cards, ctaBand, caseCard } from '../templates/blocks.js';
import { site } from '../data/site.js';
import { bySlug } from '../data/cases.js';

/* ---------- shared form field helpers ------------------------------------ */
const field = ({ name, label, type = 'text', required, options, placeholder, half, help }) => {
  const err = required ? `<span class="k-field__err">${type === 'email' ? 'That address does not look right.' : 'This one we do need.'}</span>` : '';
  const input = options
    ? `<select class="k-select" id="f-${name}" name="${name}"${required ? ' required' : ''}>
         <option value="">Choose one</option>${options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}
       </select>`
    : type === 'textarea'
      ? `<textarea class="k-textarea" id="f-${name}" name="${name}"${required ? ' required' : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}></textarea>`
      : `<input class="k-input" id="f-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''} autocomplete="${{ email: 'email', tel: 'tel' }[type] || (name === 'first_name' ? 'given-name' : name === 'company' ? 'organization' : 'on')}">`;
  return `<div class="k-field"${half ? ' style="flex:1;min-width:200px"' : ''}>
    <label class="k-field__l" for="f-${name}">${esc(label)}</label>
    ${input}${help ? `<span class="k-xs k-dim" style="display:block;margin-top:6px">${esc(help)}</span>` : ''}${err}
  </div>`;
};

const radioGroup = ({ name, legend, options, required }) => `
<fieldset class="k-field" style="border:0;padding:0;margin:0">
  <legend class="k-field__l">${esc(legend)}</legend>
  <div class="k-choices">
    ${options.map((o, i) => `<label class="k-choice">
      <input type="radio" name="${name}" value="${esc(o.v || o)}"${required && i === 0 ? ' required' : ''}>
      <span class="k-choice__box" aria-hidden="true"></span>
      <span class="k-choice__t">${o.b ? `<b>${esc(o.b)}</b>` : ''}${esc(o.t || o)}</span></label>`).join('')}
  </div>
  <span class="k-field__err">Pick the closest one.</span>
</fieldset>`;

const honeypot = `<div class="k-hp"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div>`;

/* ==========================================================================
   PATH B — /the-kija-method (Brand Signal Test)
   b1 score free + gated write-up (default) · b2 email gate · b3 short ungated
   ========================================================================== */
const B_COPY = {
  b1: { title: 'What is your<br>brand signal?', sub: 'Twelve questions, about four minutes. You get your score and the pillar breakdown immediately — no email required to see it.' },
  b2: { title: 'What is your<br>brand signal?', sub: 'Twelve questions, about four minutes. Your full scored diagnosis lands in your inbox the moment you finish.' },
  b3: { title: 'Six questions.<br>One honest score.', sub: 'The short version. No email, no gate, no follow-up unless you ask for one.' }
};

export function signalTestPage(variant) {
  const v = variant || 'b1';
  const copy = B_COPY[v];
  const body = `
${hero({
    eyebrow: 'The Kija Method · Brand Signal Test',
    title: copy.title,
    lede: `<b>${esc(copy.sub)}</b> It scores four things: whether your position is clear, whether your identity is a system, whether your digital presence does any work, and whether anything happens automatically after a lead arrives.`,
    glow: true
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap" style="max-width:820px">
    <div class="k-widget" data-kija-widget="signal-test">
      <div class="k-widget__skel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <noscript><p class="k-dim">The Signal Test needs JavaScript. <a class="k-link" href="/book">Book a call</a> and we will run it with you instead.</p></noscript>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'Why this is free', sub: 'Because it is the demonstration. Creative Strategy is the hardest capability to prove on a services page, so we gave the diagnosis away instead of describing our ability to produce one.' })}
    ${cards([
      { label: 'What you get', title: 'A real diagnosis', accent: 'accent', body: 'A score, a pillar breakdown and the three weakest areas named specifically — not a lead magnet with your name pasted in.' },
      { label: 'What we get', title: 'A better first call', accent: 'accent', body: 'When you do book, we already know where the problem is. The call starts at the useful part instead of the introductions.' },
      { label: 'What happens next', title: 'Nothing you did not ask for', accent: 'mag', body: 'No countdown timer, no daily sequence, no sales call you did not book. One email, and you can leave the list from it.' }
    ])}
  </div>
</section>

${ctaBand({
    num: '03',
    title: 'Rather just<br>talk it through?',
    lede: 'The test is useful, but it is not a conversation. If you already know roughly what is wrong, skip it.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_signal_band_book' },
    secondary: { label: 'See the work', href: '/work', track: 'cta_signal_band_work' }
  })}`;

  return {
    path: v === 'b1' ? '/the-kija-method' : `/the-kija-method/${v}`,
    title: 'Brand Signal Test',
    description: 'A scored diagnostic across positioning, identity, digital presence and system clarity. Free, immediate, and specific.',
    body,
    variant: v,
    noindex: v !== 'b1',
    scripts: ['/assets/widgets/brand-signal-test.js'],
    stickySecondary: { label: 'Book a call', href: '/book' },
    headInline: v === 'b1'
      ? abRedirect('signal_test', '/the-kija-method',
          { b1: '/the-kija-method', b2: '/the-kija-method/b2', b3: '/the-kija-method/b3' })
      : null
  };
}

/* ==========================================================================
   PATH C — /brand-review
   c1 "Free brand review" · c2 "Apply — limited slots"
   ========================================================================== */
export function brandReviewPage(variant) {
  const v = variant || 'c1';
  const applyFraming = v === 'c2';

  const form = `
<form class="k-widget" data-kija-form="brand_review" data-thanks="/thanks/brand-review" novalidate>
  <h4>${applyFraming ? 'Application' : 'Request your review'}</h4>
  <h3 class="k-h3-lg" style="margin-top:12px;max-width:22ch">${applyFraming ? 'Tell us what you are working with' : 'Six fields. Then we go and look.'}</h3>
  <div class="k-stack" style="margin-top:26px">
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      ${field({ name: 'first_name', label: 'First name', required: true, half: true })}
      ${field({ name: 'email', label: 'Work email', type: 'email', required: true, half: true })}
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      ${field({ name: 'company', label: 'Company', required: true, half: true })}
      ${field({ name: 'url', label: 'Website', placeholder: 'yourcompany.com', half: true })}
    </div>
    ${field({ name: 'industry', label: 'Industry', options: ['Professional services', 'Health, fitness or wellness', 'Hospitality or travel', 'Retail or ecommerce', 'Construction or trades', 'Financial services', 'Healthcare or life sciences', 'Nonprofit or cause', 'Technology', 'Something else'], required: true })}
    ${radioGroup({
      name: 'primary_constraint', legend: 'What is actually holding you back?', required: true,
      options: [
        { b: 'Nobody understands what we do', t: 'The positioning is unclear, inside or outside.', v: 'clarity' },
        { b: 'Not enough qualified leads', t: 'Traffic exists. Good-fit enquiries do not.', v: 'leads' },
        { b: 'Leads go nowhere', t: 'They arrive and then the follow-up depends on somebody remembering.', v: 'follow-up' },
        { b: 'We cannot keep it fed', t: 'The strategy is fine. The output is not sustainable.', v: 'content' },
        { b: 'No one owns the strategy', t: 'Lots of activity, no through-line.', v: 'strategy' }
      ]
    })}
    ${field({ name: 'context', label: applyFraming ? 'Why now?' : 'Anything we should know', type: 'textarea', placeholder: 'What has already been tried, what is off the table, and what "fixed" would look like.' })}
    ${honeypot}
  </div>
  <button class="k-btn k-btn--primary k-btn--lg" type="submit" style="width:100%;margin-top:26px">
    ${applyFraming ? 'Submit application' : 'Request my brand review'} <span class="k-btn__arrow">&rarr;</span>
  </button>
  <p class="k-xs k-dim" style="margin-top:14px">${applyFraming
    ? 'We review applications weekly and reply either way. If there is no slot, we will say so rather than leaving you waiting.'
    : 'A real person looks at your brand and site and writes back. No automated PDF with your logo dropped into it.'}</p>
</form>`;

  const body = `
${hero({
    eyebrow: applyFraming ? 'Brand Review · limited slots' : 'Brand Review · free',
    title: applyFraming ? 'Apply for a<br>brand review' : 'A free review<br>by an actual human',
    lede: applyFraming
      ? '<b>We run a handful of these a month, and we choose them.</b> A senior look at your positioning, identity, site and follow-up system, written up as findings you could hand to another agency and still use.'
      : '<b>A senior look at your positioning, identity, site and follow-up system</b> — written up as specific findings, not a scorecard. Free, because the work sells itself better than a pitch does.',
    ctas: []
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-split k-wrap">
    <div>
      <h4>What you get back</h4>
      <ul class="k-list" style="margin-top:18px">
        <li><b style="color:var(--k-cream)">A written diagnosis</b> — what is actually wrong, in priority order, with the reasoning attached.</li>
        <li><b style="color:var(--k-cream)">The first three moves</b> — what we would do first, second and third, whether or not we are the ones doing it.</li>
        <li><b style="color:var(--k-cream)">What to ignore</b> — the things you are worrying about that do not matter yet. Usually the most useful part.</li>
        <li><b style="color:var(--k-cream)">An honest fit call</b> — including when the answer is that you do not need us.</li>
      </ul>
      <div class="k-callout" style="margin-top:30px">
        <h4 class="k-label--yellow">Turnaround</h4>
        <p class="k-sm" style="margin-top:10px">${applyFraming
          ? 'Applications are reviewed weekly. Accepted reviews are written and returned inside two weeks.'
          : 'Reviews are written and returned inside two weeks. We do not batch them, and we do not outsource them.'}</p>
      </div>
    </div>
    <div>${form}</div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'What a fixed<br>version looks like' })}
    <div class="k-grid k-g2">
      ${caseCard(bySlug('van-country'))}${caseCard(bySlug('oak-cliff-pilates'))}
    </div>
  </div>
</section>`;

  return {
    path: v === 'c1' ? '/brand-review' : `/brand-review/${v}`,
    title: 'Brand Review',
    description: 'A senior human review of your positioning, identity, site and follow-up system — written up as specific findings.',
    body,
    variant: v,
    noindex: v !== 'c1',
    scripts: ['/assets/widgets/lead-form.js'],
    stickySecondary: { label: 'Book a call', href: '/book' },
    headInline: v === 'c1'
      ? abRedirect('brand_review', '/brand-review', { c1: '/brand-review', c2: '/brand-review/c2' })
      : null
  };
}

/* ==========================================================================
   PATH D — /fit-finder
   d1 conversational · d2 structured form
   ========================================================================== */
export function fitFinderPage(variant) {
  const v = variant || 'd1';
  const body = `
${hero({
    eyebrow: 'Fit Finder',
    title: 'Where should<br>you start?',
    lede: `<b>${v === 'd1' ? 'Six questions, one at a time.' : 'Six questions, one page.'}</b> At the end you get a straight recommendation — which package fits, what order we would work in, and one thing to do first whether or not you ever hire us. It will not quote you a price and it will not promise you a date. Those are call conversations, and anything else would be a guess.`
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap" style="max-width:820px">
    <div class="k-widget" data-kija-widget="fit-finder">
      <div class="k-widget__skel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <noscript><p class="k-dim">The Fit Finder needs JavaScript. <a class="k-link" href="/brand-review">Request a brand review</a> instead and we will do this properly.</p></noscript>
    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'The rules<br>it runs on', sub: 'Published, because a recommendation engine you cannot inspect is just a sales script with extra steps.' })}
    ${cards([
      { label: 'Rule 01', title: 'Never quotes a price', accent: 'accent', body: 'A number without scope is a guess. It will tell you which package fits, not what it costs.' },
      { label: 'Rule 02', title: 'Never promises a timeline', accent: 'accent', body: 'Delivery depends on your stakeholders as much as ours. Anyone promising a date on question six is guessing.' },
      { label: 'Rule 03', title: 'Always routes to a human', accent: 'mag', body: 'The output ends at a call, because the interesting part is the disagreement, and software cannot have one with you.' }
    ])}
  </div>
</section>

${ctaBand({
    num: '03',
    title: 'Skip it and<br>just talk to us',
    lede: 'The Fit Finder exists for people who would rather not talk to anyone yet. That is a completely reasonable position and there is no penalty for the other one.',
    primary: { label: 'Book a call', href: '/book', track: 'cta_fitfinder_band_book' },
    secondary: { label: 'Request a brand review', href: '/brand-review', track: 'cta_fitfinder_band_review' }
  })}`;

  return {
    path: v === 'd1' ? '/fit-finder' : `/fit-finder/${v}`,
    title: 'Fit Finder',
    description: 'Six questions and an honest recommendation about where to start — including when the answer is not us.',
    body,
    variant: v,
    noindex: v !== 'd1',
    scripts: ['/assets/widgets/fit-finder.js'],
    stickySecondary: { label: 'Book a call', href: '/book' },
    headInline: v === 'd1'
      ? abRedirect('fit_finder', '/fit-finder', { d1: '/fit-finder', d2: '/fit-finder/d2' })
      : null
  };
}

/* ==========================================================================
   PATH A — /book
   a1 calendar first · a2 three questions, then calendar
   ========================================================================== */
const calendarEmbed = `
<div class="k-widget" style="padding:0;overflow:hidden;min-height:720px">
  <iframe src="${site.calendar}" title="Book a strategy call with Kija Creative"
    style="width:100%;height:760px;border:0;display:block;background:var(--k-ink-2)"
    loading="lazy" scrolling="no"></iframe>
</div>
<p class="k-xs k-dim" style="margin-top:12px">Calendar not loading? Email <a class="k-link" href="mailto:${site.email}">${site.email}</a> and we will sort a time by hand.</p>`;

export function bookPage(variant) {
  const v = variant || 'a1';
  const qualifyFirst = v === 'a2';

  const qualifier = `
<form class="k-widget" data-kija-form="book_qualified" data-thanks="#calendar" novalidate id="qualify">
  <h4>Three questions first</h4>
  <h3 class="k-h3-lg" style="margin-top:12px;max-width:24ch">So the call starts at the useful part</h3>
  <p class="k-dim k-sm" style="margin-top:12px;max-width:52ch">Answer these and the calendar opens underneath. It takes about thirty seconds and it means we arrive having already thought about your situation.</p>
  <div class="k-stack-lg" style="margin-top:28px">
    ${radioGroup({
      name: 'current_state', legend: 'Where does the brand stand today?', required: true,
      options: [
        { b: 'Starting from scratch', t: 'Or close enough that starting over is on the table.', v: 'greenfield' },
        { b: 'Assets, but no system', t: 'A logo and some files, nothing behind them.', v: 'assets-only' },
        { b: 'Good brand, weak site', t: 'The identity holds. The website does not convert.', v: 'brand-ok' },
        { b: 'It works, nothing feeds it', t: 'Brand and site are fine. Demand is the problem.', v: 'needs-demand' }
      ]
    })}
    ${radioGroup({
      name: 'timeline', legend: 'When does this need to move?', required: true,
      options: [
        { b: 'Yesterday', t: 'There is a deadline behind this.', v: 'urgent' },
        { b: 'Next quarter', t: 'Planned, funded, not yet started.', v: 'quarter' },
        { b: 'This year', t: 'On the list, not yet scheduled.', v: 'year' },
        { b: 'Exploring', t: 'Working out whether to do anything at all.', v: 'exploring' }
      ]
    })}
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      ${field({ name: 'first_name', label: 'First name', required: true, half: true })}
      ${field({ name: 'email', label: 'Work email', type: 'email', required: true, half: true })}
    </div>
    ${honeypot}
  </div>
  <button class="k-btn k-btn--primary k-btn--lg" type="submit" style="width:100%;margin-top:26px">
    Open the calendar <span class="k-btn__arrow">&rarr;</span>
  </button>
</form>`;

  const body = `
${hero({
    eyebrow: 'Strategy call · 30 minutes · no charge',
    title: qualifyFirst ? 'Book a<br>strategy call' : 'Pick a time.<br>That is it.',
    lede: qualifyFirst
      ? '<b>Three questions, then the calendar.</b> We ask because a call that starts with "so tell us about your business" wastes the first ten minutes of a thirty-minute conversation.'
      : '<b>No qualifying gauntlet, no discovery form.</b> Pick a slot and we will work out the rest live. Thirty minutes, and you leave with the first thing we would do — regardless of whether we do it.'
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap" style="max-width:900px">
    ${qualifyFirst ? qualifier + `<div id="calendar" style="margin-top:40px">${calendarEmbed}</div>` : calendarEmbed}
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ num: '02', title: 'What happens<br>on the call', sub: 'So you can decide whether it is worth thirty minutes before you spend them.' })}
    ${cards([
      { label: 'Minutes 0–10', title: 'What is actually broken', accent: 'accent', body: 'You describe the situation. We ask the uncomfortable questions rather than the flattering ones.' },
      { label: 'Minutes 10–25', title: 'What we would do first', accent: 'accent', body: 'A specific first move and the reasoning. You can take this and execute it without us.' },
      { label: 'Minutes 25–30', title: 'Whether we are a fit', accent: 'mag', body: 'Sometimes the answer is no, or not yet. We would rather say that than sell you a phase you are not ready for.' }
    ])}
    <div class="k-callout" style="margin-top:26px">
      <h4 class="k-label--yellow">What will not happen</h4>
      <p style="margin-top:10px">No deck. No pricing pressure. No second call to "bring in the team". If we can help, you will know by minute twenty-five.</p>
    </div>
  </div>
</section>`;

  return {
    path: v === 'a1' ? '/book' : `/book/${v}`,
    title: 'Book a call',
    description: 'A 30-minute strategy call. You leave with the first thing we would do, whether or not we do it.',
    body,
    variant: v,
    noindex: v !== 'a1',
    scripts: qualifyFirst ? ['/assets/widgets/lead-form.js'] : [],
    noSticky: true,
    headInline: v === 'a1' ? abRedirect('book', '/book', { a1: '/book', a2: '/book/a2' }) : null
  };
}

/* ==========================================================================
   THANK-YOU PAGES — one per capture path, each with a different next step
   ========================================================================== */
const THANKS = {
  'signal-test': {
    title: 'Your diagnosis<br>is on its way',
    lede: 'Check your inbox in the next sixty seconds. If it is not there, look in promotions — and if it is still not there, reply to anything from us and a human will fix it.',
    next: [
      { label: 'While you wait', title: 'See a fixed version', body: 'Oak Cliff Pilates scored badly on every pillar you just answered. Here is what changed.', href: '/work/oak-cliff-pilates' },
      { label: 'If you already know', title: 'Book the call', body: 'The email is useful. The conversation is faster.', href: '/book' }
    ],
    seq: 'Sequence 1 — five emails, one per weak area, ending on a call ask.'
  },
  'brand-review': {
    title: 'Request received.<br>A human has it.',
    lede: 'Not a queue and not an autoresponder loop. Someone here is going to open your site and look at it properly, and you will hear back inside two weeks.',
    next: [
      { label: 'Meanwhile', title: 'Take the Signal Test', body: 'Four minutes, and it gives us a head start on your review.', href: '/the-kija-method' },
      { label: 'Or skip ahead', title: 'Book the call now', body: 'If two weeks is too long, take a slot and we will do it live.', href: '/book' }
    ],
    seq: 'Sequence 2 — four emails: confirmation, delivery, one deep insight, call ask.'
  },
  'fit-finder': {
    title: 'Recommendation<br>sent.',
    lede: 'Your recommended path, the sequence behind it and the matched case study are in your inbox. It is specific to what you answered, not a template with your name in it.',
    next: [
      { label: 'The obvious next step', title: 'Book the call', body: 'Thirty minutes to pressure-test the recommendation against what you actually know.', href: '/book' },
      { label: 'Read first', title: 'See the packages', body: 'The full detail on what each one includes and who it is not for.', href: '/packages' }
    ],
    seq: 'Sequence 3 — four emails: recommended path, matched case study, sequence rationale, call ask.'
  },
  call: {
    title: 'You are booked.',
    lede: 'Calendar invite is in your inbox. Bring the thing you are most frustrated by — that is usually the fastest way into the useful part of the conversation.',
    next: [
      { label: 'Before we speak', title: 'Take the Signal Test', body: 'Four minutes. It means we arrive already knowing where the problem is.', href: '/the-kija-method' },
      { label: 'Optional', title: 'Read a case study', body: 'Van Country is the closest thing we have to a standard-shaped engagement.', href: '/work/van-country' }
    ],
    seq: 'Reminder sequence plus the no-show re-engagement path if the slot goes unused.'
  }
};

export function thanksPage(key) {
  const t = THANKS[key];
  const body = `
${hero({
    eyebrow: 'Confirmed',
    title: t.title,
    lede: `<b>${esc(t.lede)}</b>`,
    glow: true
  })}

<section class="k-section" style="padding-top:0">
  <div class="k-wrap">
    <div class="k-grid k-g2">
      ${t.next.map((n) => `
      <a class="k-card k-card--accent" href="${n.href}" data-track="cta_thanks_${key}">
        <h4>${esc(n.label)}</h4>
        <h3 style="margin-top:12px">${esc(n.title)}</h3>
        <p class="k-dim k-sm" style="margin-top:12px">${esc(n.body)}</p>
      </a>`).join('')}
    </div>
    <!-- ${esc(t.seq)} -->
    <div class="k-callout" style="margin-top:32px">
      <h4 class="k-label--yellow">This page is also the demonstration</h4>
      <p style="margin-top:10px;max-width:64ch">You submitted a form and something specific happened immediately — routed to the right confirmation, with the right next step, and an email that references what you actually said. That is Marketing Automation. There is nothing else to show you.</p>
      <p style="margin-top:14px"><a class="k-link" href="/services/marketing-automation">See how it is built</a></p>
    </div>
  </div>
</section>`;

  return {
    path: `/thanks/${key}`,
    title: 'Thank you',
    description: 'Confirmed.',
    body,
    noindex: true,
    noSticky: true,
    // Retries a submission that failed on the previous page. The visitor
    // never sees this; the lead is not lost to a network blip.
    inline: `(function(){try{var p=sessionStorage.getItem('kija_pending_lead');
if(p&&window.KIJA){window.KIJA.submitLead(JSON.parse(p)).then(function(){sessionStorage.removeItem('kija_pending_lead');}).catch(function(){});}
}catch(e){}})();`
  };
}

export function capturePages() {
  return [
    signalTestPage('b1'), signalTestPage('b2'), signalTestPage('b3'),
    brandReviewPage('c1'), brandReviewPage('c2'),
    fitFinderPage('d1'), fitFinderPage('d2'),
    bookPage('a1'), bookPage('a2'),
    ...Object.keys(THANKS).map(thanksPage)
  ];
}
