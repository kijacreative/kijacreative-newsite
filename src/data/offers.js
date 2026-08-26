/* ==========================================================================
   OFFER ARCHITECTURE — 3 productized entry points, 1 entry tier, 1 retained.
   Built against section 02 of the strategy doc. See Decision 1: this is a
   read of where the offers are heading, not confirmed. Changing a name or
   adding a tier here propagates to nav, /packages and every cross-link.

   PRICING POSTURE (Decision 5, open):
     `price: null`  -> the page shows no number and routes to a call.
     `price: '$X'`  -> the page shows "Starting at $X".
   Productized tiers are meant to carry a starting-at number so they filter.
   Set the three strings below and the pages update themselves.
   ========================================================================== */

export const offers = [
  {
    slug: 'launch-kit',
    name: 'Launch Kit',
    type: 'productized',
    tagline: 'The we’re-starting-over package',
    price: null,                          // Decision 5
    // The canonical URL is variant A (price shown). Only the B sibling is
    // generated; assignment happens in the head before first paint.
    variants: ['b'],
    entry: 'Brand Signal Test, paid ads',
    summary: 'Brand, site and an initial ad program, built in sequence and handed over working.',
    who: 'You are rebuilding rather than adjusting — new company, new direction, or an old one that stopped describing what you actually do.',
    includes: [
      { t: 'Positioning + messaging', d: 'The written position and the language your team uses everywhere.' },
      { t: 'Full brand system', d: 'Identity, rules, applications and guidelines other people can build in.' },
      { t: 'Conversion-focused website', d: 'Designed around the decision, built fast, instrumented from day one.' },
      { t: 'Lead capture + automation', d: 'Forms, CRM, tags, pipeline stages and the follow-up that fires in sixty seconds.' },
      { t: 'Initial ad program', d: 'A first campaign against the new positioning, with a baseline you can hold us to.' }
    ],
    services: ['creative-strategy', 'brand-development', 'website-design', 'marketing-automation'],
    proof: ['oak-cliff-pilates', 'van-country'],
    notFor: 'A logo refresh. If the position is settled and the site converts, this is more than you need — Growth Engine is the honest recommendation.'
  },
  {
    slug: 'growth-engine',
    name: 'Growth Engine',
    type: 'productized',
    tagline: 'The monthly machine',
    price: null,                          // Decision 5
    variants: ['b'],          // canonical URL is variant A (price shown)
    entry: 'Case studies, referral',
    summary: 'Campaigns, optimisation and reporting, run every month against a system that already exists.',
    who: 'The foundation is built. What is missing is someone running it consistently and reallocating budget based on what the numbers actually say.',
    includes: [
      { t: 'Monthly campaign plan', d: 'Built from the baseline, not from a template.' },
      { t: 'Paid media management', d: 'Search, social and retargeting, structured to match the site architecture.' },
      { t: 'Content production', d: 'The formats that feed the campaigns, at a cadence you can sustain.' },
      { t: 'Conversion optimisation', d: 'Continuous testing on the pages that carry the traffic.' },
      { t: 'Monthly review', d: 'What worked, what got killed, where next month’s budget moves. One page, not a dashboard tour.' }
    ],
    services: ['ongoing-marketing', 'marketing-automation', 'website-design'],
    proof: ['van-country', 'mammogram-poster-girls'],
    notFor: 'A business without a settled position. Campaigns amplify whatever is underneath them, including the problems.'
  },
  {
    slug: 'content-machine',
    name: 'Content Machine',
    type: 'productized',
    tagline: 'Email, blog and social on subscription',
    price: null,                          // Decision 5
    variants: [],
    entry: 'Content, search and AEO',
    summary: 'A recurring content operation so the strategy keeps producing after the project ends.',
    who: 'You know what you want to say. You cannot reliably get it made every week, and hiring for it is a bigger commitment than the problem warrants.',
    includes: [
      { t: 'Monthly content calendar', d: 'Pillars mapped to what you actually sell.' },
      { t: 'Email', d: 'Written, built and sent, including the sequences behind your capture paths.' },
      { t: 'Long-form + AEO', d: 'Articles structured to be quoted by answer engines, not just indexed by search.' },
      { t: 'Social', d: 'Formats chosen for sustainability over range.' },
      { t: 'Performance review', d: 'What is being read, what is converting, what to stop making.' }
    ],
    services: ['ongoing-marketing', 'creative-strategy'],
    proof: ['ges', 'blue-plate-network'],
    notFor: 'Volume for its own sake. If the goal is posting frequency rather than pipeline, we are the wrong shop.'
  },
  {
    slug: 'personal-brand-launch-kit',
    name: 'Personal Brand Launch Kit',
    type: 'entry',
    tagline: 'The founder-brand build',
    price: null,                          // Decision 5 — lowest tier, likely self-serve
    variants: [],
    entry: 'Podcasts, LinkedIn',
    summary: 'The lowest-commitment door into the same system, built around the person rather than the company.',
    who: 'You are the brand right now, whether or not that was the plan. Founders, operators, consultants and anyone whose next opportunity arrives because of who knows them.',
    includes: [
      { t: 'Personal positioning', d: 'What you are known for, stated in a way that survives being repeated by someone else.' },
      { t: 'Visual identity', d: 'A consistent look across the profiles and surfaces people actually check.' },
      { t: 'Profile rebuild', d: 'LinkedIn and speaker-facing assets rewritten around the position.' },
      { t: 'Content system', d: 'Formats, cadence and a starting bank so week two is not a blank page.' },
      { t: 'Capture path', d: 'One page and one form, so attention has somewhere to convert.' }
    ],
    services: ['creative-strategy', 'brand-development'],
    proof: ['oak-cliff-pilates', 'piehole-project'],
    notFor: 'A company rebuild wearing a founder costume. If the business is the thing that is broken, Launch Kit is the honest answer.'
  },
  {
    slug: 'strategic-partner',
    name: 'Strategic Partner',
    type: 'retained',
    tagline: 'Senior strategy, monthly, application only',
    price: null,                          // No number by design — custom work anchors wrong
    variants: [],
    entry: 'Call only, no self-serve',
    gated: true,
    summary: 'Monthly consulting: strategy, accountability and access to the expert network behind it.',
    who: 'You have a team that can execute. What you do not have is someone senior in the room every month who is not inside the politics.',
    includes: [
      { t: 'Monthly strategy session', d: 'Working session, not a status update.' },
      { t: 'Accountability', d: 'Decisions carry owners and dates, and get revisited whether or not they went well.' },
      { t: 'Expert network access', d: 'The specialists we would bring in ourselves, without a new procurement cycle each time.' },
      { t: 'Async availability', d: 'The between-meetings questions that would otherwise wait a month.' },
      { t: 'Quarterly reset', d: 'A harder look at whether the strategy still matches the market.' }
    ],
    services: ['creative-strategy', 'ongoing-marketing'],
    proof: ['seismic', 'altacrest-capital'],
    notFor: 'Production capacity. This is not a cheaper way to buy delivery, and treating it that way wastes both sides’ time.'
  }
];

export const offerBySlug = (s) => offers.find((o) => o.slug === s);
export const productized = () => offers.filter((o) => o.type === 'productized');
