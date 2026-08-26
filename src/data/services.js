/* ==========================================================================
   SERVICE LANDING PAGES — five capability lines, one eight-block skeleton.
   Blocks: 1 problem hero · 2 cost of inaction · 3 where it sits ·
           4 how we work it · 5 live demonstration · 6 matched proof ·
           7 objections · 8 dual CTA
   ========================================================================== */

export const services = [
  {
    slug: 'creative-strategy',
    name: 'Creative Strategy',
    sequence: 'first',
    sequenceNote: 'Nothing downstream is cheap until this is settled. Design without a position is decoration, and decoration gets argued about forever.',
    assumes: 'Nothing. This is where the work starts.',
    problem: 'You can describe what you do. You can’t describe why it matters.',
    lede: 'Positioning, messaging, naming and category framing — the decisions that make every later decision faster.',
    costs: [
      { t: 'You compete on price', d: 'When the buyer can’t tell the difference between you and the next quote, the only remaining variable is the number at the bottom.' },
      { t: 'Every project restarts the argument', d: 'Without a written position, each new campaign relitigates what the company is. That is expensive, and it is paid in your time.' },
      { t: 'Good work gets rejected for the wrong reason', d: 'Teams reject work that feels wrong when what they mean is the strategy was never agreed. The design takes the blame.' }
    ],
    process: [
      { t: 'Excavate', d: 'Interviews with your team, your best clients and — where it is useful — the ones who chose someone else.', out: 'Findings memo' },
      { t: 'Name the problem', d: 'The real one, in the market’s language rather than yours. This is usually the uncomfortable part.', out: 'Positioning statement' },
      { t: 'Frame the category', d: 'Where you sit, what you are compared against, and what you deliberately are not.', out: 'Category map + competitive frame' },
      { t: 'Write the language', d: 'The words your team uses on calls, on the site and in the deck. One vocabulary, everywhere.', out: 'Messaging framework' }
    ],
    demo: {
      t: 'The Brand Signal Test, right here',
      d: 'Twelve questions, scored across positioning, identity, digital presence and system clarity. It gives you a real diagnosis and the three areas to fix first — before you pay us anything. That is the demonstration: if the free version is this specific, the paid version is not a mystery.',
      cta: { label: 'Take the test', href: '/the-kija-method' },
      embed: 'signal-test'
    },
    proof: ['oak-cliff-pilates', 'blue-plate-network'],
    objections: [
      { q: 'We already know who we are', a: 'Possibly. The test is whether five people on your team describe it the same way without checking with each other. If they do, you don’t need this and we’ll say so on the call.' },
      { q: 'How long does this take?', a: 'Strategy work is measured in weeks, not months, and the deliverable is a document short enough that people actually read it. We’ll scope the specific timeline once we know how many stakeholders have a veto.' },
      { q: 'We tried a positioning exercise before and nothing changed', a: 'Usually because it ended at a document. Ours ends at applied language — the site, the deck, the sales call — because a position nobody uses is just a nicer way to describe the same problem.' }
    ],
    secondaryCta: { label: 'Test your brand signal', href: '/the-kija-method' }
  },

  {
    slug: 'brand-development',
    name: 'Brand Development',
    sequence: 'second',
    sequenceNote: 'Runs after positioning and before the website. Building a site on an unfinished identity means building it twice.',
    assumes: 'A settled position. If that is not written down yet, start with Creative Strategy.',
    problem: 'You have a logo. You don’t have a brand.',
    lede: 'Identity systems, guidelines and applications — built so other people can use them without you in the room.',
    costs: [
      { t: 'Everything takes longer than it should', d: 'Each new asset becomes a fresh negotiation about what it should look like. Multiply that by everything you make in a year.' },
      { t: 'Recognition never compounds', d: 'Inconsistent output means every impression starts from zero. You pay for reach and get none of the accumulation.' },
      { t: 'You become the bottleneck', d: 'If you are the only person who knows whether something is on-brand, nothing ships while you are busy.' }
    ],
    process: [
      { t: 'Define the system', d: 'Not a logo — the rules. Colour roles, type scale, spacing, motion, photography direction, voice.', out: 'Design system specification' },
      { t: 'Build the core', d: 'Identity, marks, typography and palette, tested against the hardest real application rather than a mockup.', out: 'Core identity kit' },
      { t: 'Apply it hard', d: 'The awkward cases: signage, merch, a spreadsheet, a slide someone makes at 11pm.', out: 'Application library' },
      { t: 'Hand it over', d: 'Guidelines written for the person who has to use them, plus files organised the way they get searched for.', out: 'Brand guidelines + asset library' }
    ],
    demo: {
      t: 'Our own system, published',
      d: 'Every token, type step, motion rule and voice principle behind this site is public at /brand-system. Not a case study of a system — the actual system this page is rendered from. If we could not do it for ourselves, you should not let us do it for you.',
      cta: { label: 'Open our brand system', href: '/brand-system' }
    },
    proof: ['piehole-project', 'blue-plate-network'],
    objections: [
      { q: 'We just need a refresh, not a rebuild', a: 'Often true. The difference is whether the current system has rules worth keeping. We will tell you which one you are looking at before we quote it, and a refresh is a smaller number.' },
      { q: 'Our industry is conservative', a: 'Restraint is a design decision, not an absence of one. Altacrest Capital is in the room precisely because the work is disciplined. Conservative does not mean generic.' },
      { q: 'Can’t we do this in-house?', a: 'If you have someone who can hold a system and enforce it, yes. Most teams have someone who can make assets, which is a different skill. That is worth being honest about before you spend the money.' }
    ],
    secondaryCta: { label: 'Request a brand review', href: '/brand-review' }
  },

  {
    slug: 'website-design',
    name: 'Website Design',
    sequence: 'third',
    sequenceNote: 'Runs after the brand system exists and before you spend a dollar on paid. Sending traffic to a site that does not convert is a way of paying to learn that.',
    assumes: 'A brand system, or at minimum an agreed position. We can build one alongside if not.',
    problem: 'Your site is a brochure. It should be a filter.',
    lede: 'Conversion-focused design and build. The site’s job is to qualify, not to document.',
    costs: [
      { t: 'You pay for traffic that leaks', d: 'Every dollar of paid or content spend lands on a page that converts at whatever rate it happens to convert at. That rate is the multiplier on everything else you do.' },
      { t: 'Your sales calls start from zero', d: 'A site that filters means the call opens with a qualified prospect. A site that documents means the call opens with an explanation.' },
      { t: 'Speed becomes a tax', d: 'Slow pages lose mobile visitors before they see anything. That loss is invisible in your analytics because they never arrive.' }
    ],
    process: [
      { t: 'Map the decision', d: 'What a visitor needs to believe, in what order, before they act. The sitemap comes out of that, not the other way round.', out: 'Decision map + sitemap' },
      { t: 'Write before designing', d: 'Copy first, always. Design that waits on words gets filled with placeholder thinking.', out: 'Copy deck' },
      { t: 'Design the system, not the pages', d: 'Components and states — including the empty, error and loading ones everyone forgets.', out: 'Page designs + component library' },
      { t: 'Build and instrument', d: 'Fast, accessible, measured. Every CTA carries a stable event name from day one.', out: 'Live site + analytics plan' }
    ],
    demo: {
      t: 'Our own numbers, in the footer',
      d: 'Scroll to the bottom of any page on this site. The Core Web Vitals and page weight are published there and updated at every deploy. Anyone can verify them in thirty seconds. Most agencies selling website performance will not show you theirs.',
      cta: { label: 'See the numbers', href: '#footer' }
    },
    proof: ['van-country', 'altacrest-capital'],
    objections: [
      { q: 'We just rebuilt two years ago', a: 'Then the question is not the design, it is the conversion rate. If you know it and it is fine, you do not need us. If you do not know it, that is the actual finding.' },
      { q: 'What does a site cost?', a: 'It depends on page count and how much of it is interactive. We show a starting number on the productized packages and quote custom builds after a call, because quoting before scope is how projects go wrong.' },
      { q: 'Our last agency took nine months', a: 'Usually because content was not ready when design started. We write the copy deck before design begins, which removes the thing that causes almost every overrun.' }
    ],
    secondaryCta: { label: 'Request a brand review', href: '/brand-review' }
  },

  {
    slug: 'marketing-automation',
    name: 'Marketing Automation',
    sequence: 'parallel',
    sequenceNote: 'Runs alongside the website build rather than after it. The follow-up system and the pages that feed it should be designed together.',
    assumes: 'Somewhere for leads to land. If that is an inbox, we start by fixing that.',
    problem: 'Leads come in. Then what? Usually nothing.',
    lede: 'CRM, lead flows, nurture and integrations — the part of marketing that runs while nobody is watching.',
    costs: [
      { t: 'Speed to lead decides the deal', d: 'The response that arrives in sixty seconds and the one that arrives tomorrow are competing for a decision that has usually already been made.' },
      { t: 'Attribution stays guesswork', d: 'Without a clean path from source to contact record, you cannot tell which channel deserves more budget. So the budget goes where it went last year.' },
      { t: 'Your pipeline lies to you', d: 'Stages that do not reflect how deals actually move produce forecasts nobody trusts and reports nobody reads.' }
    ],
    process: [
      { t: 'Map what happens now', d: 'Every path a lead can take today, including the informal ones people invented to get around the system.', out: 'Current-state flow map' },
      { t: 'Design the flows', d: 'What fires, when, to whom, and what a human still needs to do. Automation that hides a person is worse than none.', out: 'Workflow specification' },
      { t: 'Build and connect', d: 'Forms, fields, tags, pipeline stages, sequences and the integrations between them.', out: 'Configured CRM + live workflows' },
      { t: 'Test every path end to end', d: 'Contact created, correct tags, correct stage, correct sequence, correct attribution. Every path, before launch.', out: 'QA log + documentation' }
    ],
    demo: {
      t: 'You are already in it',
      d: 'Every form on this site triggers an instant, specific, personalised response — not a generic auto-reply, and not a "we’ll be in touch". Fill one in and watch what happens. That experience is the pitch; there is nothing else to show you.',
      cta: { label: 'Try the Fit Finder', href: '/fit-finder' }
    },
    proof: ['altacrest-capital', 'ges'],
    objections: [
      { q: 'We already have a CRM', a: 'Most people do. The question is whether the stages match how your deals actually move and whether anything happens automatically. Half-used CRMs are the norm, not the exception.' },
      { q: 'Automated messages feel impersonal', a: 'Bad ones do. The fix is specificity — referencing what someone actually told you — not sending less. A generic email written by a human is still generic.' },
      { q: 'This sounds like a big project', a: 'It can be phased. Speed-to-lead on one path is usually a week of work and the single highest-return change available to most businesses.' }
    ],
    secondaryCta: { label: 'Find your fit', href: '/fit-finder' }
  },

  {
    slug: 'ongoing-marketing',
    name: 'Ongoing Marketing',
    sequence: 'fourth',
    sequenceNote: 'Runs last, and runs forever. Campaigns pointed at a weak position and a leaking site amplify the problem rather than the business.',
    assumes: 'A position, a system and a site that converts. If any of those are missing, spend there first.',
    problem: 'Campaigns without a system are just expensive guessing.',
    lede: 'Content, ads, campaigns and reporting — run monthly against a system, not invented monthly from scratch.',
    costs: [
      { t: 'Spend without a baseline', d: 'If you do not know what a lead is worth and where it came from, more budget just produces more noise faster.' },
      { t: 'Nothing compounds', d: 'Campaigns built from scratch each month never build an audience. The tenth month looks exactly like the first.' },
      { t: 'Reporting nobody acts on', d: 'A dashboard is not a decision. If a report does not change what happens next month, it is theatre.' }
    ],
    process: [
      { t: 'Set the baseline', d: 'What a lead costs, what it is worth, what converts today. No optimisation before this exists.', out: 'Baseline report' },
      { t: 'Build the calendar', d: 'Pillars mapped to capability lines, formats chosen for what you can sustain rather than what looks impressive.', out: 'Content + campaign calendar' },
      { t: 'Run and instrument', d: 'Paid, organic and email against shared tracking, so channels can be compared honestly.', out: 'Live campaigns + tracking' },
      { t: 'Review and reallocate', d: 'Monthly. What worked gets more, what did not gets killed rather than defended.', out: 'Monthly review + reallocation' }
    ],
    demo: {
      t: 'The live campaign shelf',
      d: 'At /now we publish what we are actually running this month — for clients and for our own business. Including the things that are not working yet. It is the least comfortable page on this site, which is exactly why it is on it.',
      cta: { label: 'See what we’re running', href: '/now' }
    },
    proof: ['van-country', 'mammogram-poster-girls'],
    objections: [
      { q: 'We’ve been burned by retainers', a: 'Usually by ones that bill for activity rather than outcomes. Ask any agency what they would kill if it stopped working. The answer tells you which kind you are talking to.' },
      { q: 'Can we start small?', a: 'Yes. The $300 trial campaign exists for exactly this, and it is a real test rather than a sales device.' },
      { q: 'How long before this works?', a: 'Paid gives signal in weeks. Content and organic compound over quarters. Anyone promising you a specific date is guessing, and we would rather say so.' }
    ],
    secondaryCta: { label: 'See what we’re running now', href: '/now' }
  }
];

export const serviceBySlug = (s) => services.find((x) => x.slug === s);
export const serviceName = (s) => (serviceBySlug(s) || { name: s }).name;
