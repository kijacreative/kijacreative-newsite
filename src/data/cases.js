/* ==========================================================================
   CASE STUDIES — 9 at launch, 3 tiers of depth.
   PROOF RULE: `metrics` may only contain figures confirmed in writing.
   No extrapolation, no "up to", no invented dollar figures. Tier 2 and 3
   run on qualitative outcomes until a client confirms numbers.
   ========================================================================== */

export const cases = [
  {
    slug: 'oak-cliff-pilates',
    tier: 1,
    client: 'Oak Cliff Pilates',
    industry: 'Health & fitness',
    year: '2021 — present',
    services: ['creative-strategy', 'brand-development', 'website-design', 'ongoing-marketing'],
    headline: 'A studio that stopped selling classes and started selling a third space',
    summary: 'Positioning work that took one location to three, on a playbook we run ourselves.',
    thumb: { from: '#C21E7A', to: '#1E0A1E', word: 'Third\nSpace' },
    flagship: true,
    metrics: [
      { value: '400%', label: 'Revenue growth' },
      { value: '1 → 3', label: 'Locations' },
      { value: '2×', label: 'Membership' }
    ],
    quote: null,           // TODO: owner quote — we operate this one, so this is on us
    situation: [
      'Oak Cliff Pilates was a single studio competing in a category where every competitor said the same four things: expert instructors, small classes, all levels welcome, book your intro.',
      'Price was the only remaining variable, and price is a race a boutique studio cannot win against a chain. Class packs sold, but members churned out at the end of every pack. Growth meant constantly refilling the top of the funnel.'
    ],
    diagnosis: [
      'The studio was selling a workout. People were buying somewhere to be.',
      'Once we named that — the third space between home and work — everything downstream had a rule to follow. What the studio should look like, who it should hire, what it should say, what it should refuse to do.',
      'The offer changed from class packs to membership, because a third space is somewhere you belong, not somewhere you visit nine more times.'
    ],
    system: [
      { t: 'Positioning', d: 'The Third Space framing, written down, with the language the team actually uses at the desk.' },
      { t: 'Identity', d: 'A full brand system built for physical space first — signage, walls, merch — then flattened for digital.' },
      { t: 'Website', d: 'Membership-first architecture. The intro offer sits behind the story, not in front of it.' },
      { t: 'Ongoing marketing', d: 'Local paid, member content, referral mechanics. Same operators, every month, still running.' }
    ],
    result: 'Revenue grew 400%. The studio went from one location to three. Membership doubled, and the churn pattern that used to define the business went with it.',
    next: 'Still running. Oak Cliff Pilates is a Kija-operated business, which is why it doubles as our own proving ground — every play on this site was run here before it was sold to anyone else.'
  },
  {
    slug: 'van-country',
    tier: 1,
    client: 'Van Country',
    industry: 'Travel & rental',
    year: '2023',
    services: ['website-design', 'ongoing-marketing', 'marketing-automation'],
    headline: 'Rebuilding a booking site around the decision, not the inventory',
    summary: 'A site rebuild plus paid rework that moved direct bookings 83% and ad conversion 2.1×.',
    thumb: { from: '#3DFFAE', to: '#1E0A1E', word: 'Direct\nBookings' },
    flagship: true,
    metrics: [
      { value: '83%', label: 'Increase in direct bookings' },
      { value: '2.1×', label: 'Google Ads conversion rate' }
    ],
    quote: null,           // BLOCKER: needs written sign-off + quote before launch
    situation: [
      'Van Country had inventory, traffic and an ad budget. What it did not have was a site that helped anyone decide.',
      'The old build led with the fleet — a grid of vehicles, specs first. Visitors who had never done this before could not tell which van suited their trip, so they bounced to marketplaces that made the choice for them, and the business paid a commission on its own demand.'
    ],
    diagnosis: [
      'The site was organised around what the business owned instead of what the visitor was trying to work out.',
      'Nobody wakes up wanting a specific van. They want a specific trip to go well. Restructure around the trip and the vehicle choice answers itself.',
      'The paid account had the same problem in miniature: every keyword pointed at the same generic landing page.'
    ],
    system: [
      { t: 'Website', d: 'Rebuilt around trip type and party size, with the fleet as the answer rather than the question.' },
      { t: 'Booking flow', d: 'Fewer steps, clearer availability, direct-booking incentive made explicit against the marketplaces.' },
      { t: 'Paid', d: 'Campaign structure matched to the new page architecture — intent keyword to matched page, never to the home page.' },
      { t: 'Automation', d: 'Enquiry-to-booking follow-up automated so no request sat overnight.' }
    ],
    result: 'Direct bookings rose 83%. Google Ads converted at 2.1× the previous rate against the same creative budget.',
    next: 'Seasonal campaign support and continued conversion work on the booking flow.'
  },
  {
    slug: 'mammogram-poster-girls',
    tier: 1,
    client: 'Mammogram Poster Girls',
    industry: 'Nonprofit & cause',
    year: '2024',
    services: ['creative-strategy', 'ongoing-marketing', 'brand-development'],
    headline: 'A cause campaign that made screening feel like an invitation',
    summary: 'Campaign and identity work that lifted event signups 49%.',
    thumb: { from: '#F5E61A', to: '#1E0A1E', word: 'Show\nUp' },
    flagship: true,
    metrics: [{ value: '49%', label: 'Increase in event signups' }],
    quote: null,           // BLOCKER: needs written sign-off + quote before launch
    situation: [
      'Awareness was never the problem. Every woman in the target group already knew mammograms matter. Knowing it and booking it are separated by dread, not information.',
      'Previous campaigns worked the statistics angle, which is exactly the register that makes people close the tab.'
    ],
    diagnosis: [
      'Fear-based messaging asks someone to act while feeling their worst. It converts the already-converted and repels everyone else.',
      'The people most likely to bring a friend were not scared, they were proud. Build for them and the reluctant arrive as guests rather than patients.'
    ],
    system: [
      { t: 'Campaign platform', d: 'Poster Girls as the organising idea — real participants, front and centre, no stock imagery anywhere.' },
      { t: 'Identity', d: 'A campaign identity that reads as celebration at fifty feet and information up close.' },
      { t: 'Channel plan', d: 'Social, print and partner distribution built around the signup as the single action.' }
    ],
    result: 'Event signups rose 49% against the prior campaign.',
    next: 'Annual campaign refresh and partner-side asset kit.'
  },

  /* ---- Tier 2 — standard. Qualitative only until numbers are confirmed. -- */
  {
    slug: 'altacrest-capital',
    tier: 2,
    client: 'Altacrest Capital',
    industry: 'Financial services',
    year: '2023',
    services: ['website-design', 'marketing-automation', 'brand-development'],
    headline: 'A credible digital front door for a private capital firm',
    summary: 'Site build plus CRM integration for a firm whose deal flow depends on how it reads.',
    thumb: { from: '#2C1230', to: '#1E0A1E', word: 'Signal\nOver\nNoise' },
    metrics: [],
    situation: [
      'In private capital the website is rarely the first touch, but it is almost always the second. It gets opened after the introduction and before the meeting, and it either confirms the referral or quietly undermines it.',
      'Altacrest was being introduced well and presenting inconsistently.'
    ],
    diagnosis: [
      'The firm needed restraint, not personality. Credibility in this category is communicated through clarity, precision and the absence of noise.',
      'The second job was operational: enquiries were arriving through a form that went to an inbox and nowhere else.'
    ],
    system: [
      { t: 'Identity refinement', d: 'A tighter system with the rigour the category expects.' },
      { t: 'Website', d: 'Built for the post-introduction read — thesis, team and track record, fast.' },
      { t: 'CRM integration', d: 'Enquiries flow into the CRM with source attribution and an owner from the moment they arrive.' }
    ],
    result: 'A digital presence that matches how the firm is described when someone recommends it, and an enquiry path that no longer depends on somebody watching an inbox.',
    next: 'Ongoing content support.'
  },
  {
    slug: 'seismic',
    tier: 2,
    client: 'Seismic',
    industry: 'Technology',
    year: '2022',
    services: ['marketing-automation', 'website-design'],
    headline: 'A marketing system built to survive its own scale',
    summary: 'Large-scale system build for an organisation where marketing runs across many hands.',
    thumb: { from: '#3A1A3E', to: '#1E0A1E', word: 'Built\nTo Scale' },
    metrics: [],
    situation: [
      'At a certain size the constraint stops being ideas and becomes coordination. Multiple teams produce in parallel, and without shared rules the output diverges faster than anyone can review it.'
    ],
    diagnosis: [
      'This was a systems problem wearing a design problem as a costume.',
      'What was needed was a set of components and rules that made the on-brand version the fastest version to build.'
    ],
    system: [
      { t: 'System architecture', d: 'Components, templates and rules covering the cases teams actually hit.' },
      { t: 'Build', d: 'Implementation that holds up under many contributors rather than one careful one.' },
      { t: 'Automation', d: 'Workflow and routing so requests move without a person brokering each one.' }
    ],
    result: 'A marketing system that stayed coherent as more people used it — the only real test a system has.',
    next: 'Periodic system audits as new surfaces are added.'
  },
  {
    slug: 'ges',
    tier: 2,
    client: 'GES',
    industry: 'Professional services',
    year: '2022',
    services: ['marketing-automation', 'ongoing-marketing'],
    headline: 'Internal marketing that scales without adding headcount',
    summary: 'A repeatable internal system so marketing stops being a bottleneck.',
    thumb: { from: '#C6F5E8', to: '#1E0A1E', word: 'Repeat\nable' },
    metrics: [],
    situation: [
      'GES had a marketing function whose throughput was capped by how many requests one team could personally absorb. Every campaign started from zero.'
    ],
    diagnosis: [
      'The work was repeatable but had never been made repeatable. Templates, routing and a defined intake would recover most of the lost capacity without a single new hire.'
    ],
    system: [
      { t: 'Intake', d: 'A structured request path that arrives complete instead of arriving as a conversation.' },
      { t: 'Templates', d: 'Campaign and asset templates covering the recurring eighty percent.' },
      { t: 'Automation', d: 'Routing, reminders and reporting handled by the system rather than by people.' }
    ],
    result: 'A marketing operation that absorbs more volume with the same team, and a queue that no longer depends on individual memory.',
    next: 'Continued rollout to additional business units.'
  },
  {
    slug: 'blue-plate-network',
    tier: 2,
    client: 'Blue Plate Network',
    industry: 'Hospitality',
    year: '2023',
    services: ['creative-strategy', 'brand-development'],
    headline: 'Repositioning a network that had outgrown its own description',
    summary: 'Strategy and identity refresh for a business the market had stopped reading correctly.',
    thumb: { from: '#C21E7A', to: '#3A1A3E', word: 'Say It\nStraight' },
    metrics: [],
    situation: [
      'Blue Plate Network had grown into something its own materials no longer described. The name, the language and the visual system all pointed at an earlier, smaller version of the business.'
    ],
    diagnosis: [
      'Growth had outpaced the story. Prospects were arriving with the wrong expectation and leaving before the real offer surfaced.'
    ],
    system: [
      { t: 'Repositioning', d: 'A description of the business as it exists now, written for the buyer it wants next.' },
      { t: 'Identity refresh', d: 'A visual system with the range the expanded operation needs.' },
      { t: 'Messaging', d: 'Core language applied consistently across every touchpoint.' }
    ],
    result: 'A position that matches the business as it actually operates, and materials that stop under-selling it.',
    next: 'Rollout across partner-facing collateral.'
  },

  /* ---- Tier 3 — showcase. Visual-first. --------------------------------- */
  {
    slug: 'powerx',
    tier: 3,
    client: 'PowerX',
    industry: 'Technology',
    year: '2023',
    services: ['website-design', 'brand-development'],
    headline: 'A build with the energy the product actually has',
    summary: 'Website design and build with brand system support.',
    thumb: { from: '#F5E61A', to: '#3A1A3E', word: 'Power\nX' },
    metrics: [],
    situation: ['A technical product with real momentum and a digital presence that read as cautious.'],
    diagnosis: ['The work was to translate momentum into interface: pace in the motion, confidence in the type, no hedging in the copy.'],
    system: [
      { t: 'Brand support', d: 'System extensions for digital surfaces.' },
      { t: 'Website', d: 'Design and build, front to back.' }
    ],
    result: 'A presence that carries the energy of the product instead of apologising for it.',
    next: 'Ongoing design support.'
  },
  {
    slug: 'piehole-project',
    tier: 3,
    client: 'Piehole Project',
    industry: 'Food & hospitality',
    year: '2022',
    services: ['brand-development', 'creative-strategy'],
    headline: 'Culture-first identity for a brand with an actual personality',
    summary: 'Identity work for a brand that had no interest in being tasteful.',
    thumb: { from: '#3DFFAE', to: '#C21E7A', word: 'Pie\nhole' },
    metrics: [],
    situation: ['A food brand with a distinct voice and a visual identity that flattened it into every other food brand.'],
    diagnosis: ['The personality already existed in how the team talked. The job was to stop sanding it down.'],
    system: [
      { t: 'Identity', d: 'A system with room for the voice rather than one that constrains it.' },
      { t: 'Applications', d: 'Packaging, signage and social, built from the same rules.' }
    ],
    result: 'An identity people recognise before they read the name.',
    next: 'Seasonal applications.'
  }
];

export const byTier = (t) => cases.filter((c) => c.tier === t);
export const bySlug = (s) => cases.find((c) => c.slug === s);
export const flagships = () => cases.filter((c) => c.flagship);
