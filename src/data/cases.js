/* ==========================================================================
   CASE STUDIES — 9 at launch, 3 tiers of depth.
   PROOF RULE: `metrics` may only contain figures confirmed in writing.
   thumb.tone: magenta · aqua · yellow · plum · cream — maps to --k-tone-* tokens.
   No extrapolation, no "up to", no invented dollar figures. Tier 2 and 3
   run on qualitative outcomes until a client confirms numbers.
   ========================================================================== */

export const cases = [
  /* ---- From kijacreative.com (pulled 2026-11-17). Live copy is the source;
     `featured` is the live site's portfolio order. Figures as published on
     the live site at the owner's direction. Held back pending confirmation:
     Blue Plate "12 Year Partnership" and Honeycomb "85%+ parking revenue
     captured" (an illustrative product figure, not a Kija result). -------- */
  {
    slug: 'oak-cliff-pilates',
    tier: 1,
    featured: 1,
    client: 'Oak Cliff Pilates',
    industry: 'Boutique fitness · Reformer Pilates',
    year: '2021 — present',
    location: 'Bishop Arts · Uptown · Lower Greenville, Dallas',
    url: 'https://oakcliffpilates.com',
    tagline: 'Pilates Reimagined, Energy Elevated.',
    services: ['brand-development', 'website-design', 'ongoing-marketing'],
    headline: 'One brand system flexed across three Dallas studios',
    summary: 'Same DNA, three distinct neighborhood personalities. Bishop Arts, Uptown, Lower Greenville.',
    thumb: { tone: 'magenta', word: 'Three\nFloors' },
    flagship: true,
    metrics: [
      { value: '400%+', label: 'Revenue growth' },
      { value: '1 → 3', label: 'Studio locations' },
      { value: '2×', label: 'Membership' },
      { value: '1,100+', label: 'Members across 3 studios' }
    ],
    quote: {
      text: 'The brand we built with Kija doesn’t just look great. It’s the reason we could scale from one studio to three without losing the family we started with.',
      name: 'Amanda Mecsey', role: 'Co-Owner, Oak Cliff Pilates'
    },
    situation: [
      'Oak Cliff Pilates didn’t just open studios. They built a Dallas movement.',
      'Amanda Mecsey and her co-founders had something rare: a single Bishop Arts studio with a cult following. The opportunity was to scale without losing what made it feel like family.'
    ],
    diagnosis: [
      'One brand, three floors. Same DNA, three Dallas neighborhoods, three distinct personalities.',
      'A master line holds the family together, plus local lines that let each floor sound like its own neighborhood: “Are You Down with OCP?” in Bishop Arts, “Strong before the inbox.” in Uptown, “Slow morning, strong week.” on Lower Greenville.'
    ],
    system: [
      { t: 'Multi-location brand architecture', d: 'One master system flexed across Bishop Arts, Uptown and Lower Greenville. Same brand DNA, each floor its own personality.' },
      { t: 'Full-stack website', d: 'The digital infrastructure that makes one studio feel like many.' },
      { t: 'Paid on Meta and Google', d: 'The campaigns that filled the calendar week after week.' },
      { t: 'Signage and event marketing', d: 'From signage to Instagram, every touchpoint reads “Are You Down with OCP?”.' },
      { t: 'Localized strategy per studio', d: 'Ongoing creative and performance support for each neighborhood.' }
    ],
    result: 'Revenue grew more than 400%. One studio became three, with more than 1,100 members across them, and membership doubled.'
  },
  {
    slug: 'honeycomb',
    tier: 1,
    featured: 2,
    client: 'Honeycomb',
    industry: 'PropTech · Commercial real estate software',
    year: null,
    location: 'North America',
    url: 'https://honeycomb.be',
    tagline: 'Start with parking. Run your whole building.',
    services: ['brand-development', 'website-design', 'marketing-automation'],
    headline: 'A PropTech brand redesign built for operators, not software people',
    summary: 'Honeycomb turns underutilized parking into a profit center, then unifies access, amenities, and billing on one platform.',
    thumb: { tone: 'yellow', word: 'Run the\nBuilding' },
    metrics: [
      { value: '+67%', label: 'Demo bookings' },
      { value: '-18%', label: 'Sales cycle' }
    ],
    quote: null,
    situation: ['Honeycomb is built and proven by operators, not software people. The product is sharp; the brand needed to catch up.'],
    diagnosis: ['The identity had to read “ops software,” not “marketing fluff”: direct, data-driven, and unpretentious, just like the product.'],
    system: [
      { t: 'Brand identity redesign', d: 'A full redesign with a color system that signals data, control, and clarity.' },
      { t: 'Color and typography system', d: 'Signal Orange, Op Cyan, Data Violet and Deep Plum.' },
      { t: 'Website architecture and build', d: 'Rebuilt around the operator buying journey.' },
      { t: 'Marketing automation', d: 'Infrastructure that nurtures from demo request through close.' }
    ],
    result: 'Demo bookings rose 67% and the sales cycle shortened by 18%.'
  },
  {
    slug: 'blue-plate-network',
    tier: 1,
    featured: 3,
    client: 'Blue Plate Network',
    industry: 'Commercial real estate · Restaurant tenant rep',
    year: null,
    location: 'Dallas, TX',
    url: 'https://blueplatenetwork.com',
    tagline: 'Your restaurant real estate partner for the long haul.',
    services: ['brand-development', 'website-design'],
    headline: 'An identity that matches the caliber of the restaurants they place',
    summary: 'Blue Plate Network places some of the most exciting restaurants in Dallas. But their brand wasn’t telling that story.',
    thumb: { tone: 'plum', word: 'Long\nHaul' },
    metrics: [
      { value: '+78%', label: 'Direct inquiries' },
      { value: '2.3×', label: 'Website engagement' }
    ],
    quote: null,
    situation: ['Carter Wilson built Blue Plate around a long-haul partner philosophy, pairing restaurateurs with the right communities for sustainable growth. The work demanded a brand with the same caliber as the spaces it brokers.'],
    diagnosis: ['Every touchpoint had to read long-haul partner, not transactional broker. Calm, confident, partnership-first, talking about communities, caliber, and the people behind the restaurants.'],
    system: [
      { t: 'Brand identity refresh', d: 'Rebuilt from typography to color system: refined type, a navy and gold palette.' },
      { t: 'Website redesign', d: 'Built around visual storytelling of every venue.' },
      { t: 'Print identity', d: 'Refreshed collateral and a business card system.' },
      { t: 'Marketing asset toolkit', d: 'Packaged so Carter’s team could deploy it without us in the room.' }
    ],
    result: 'A brand that feels as premium as the restaurants it represents. Direct inquiries rose 78% and website engagement 2.3×.'
  },
  {
    slug: 'latino-arts',
    tier: 2,
    featured: 4,
    client: 'Latino Arts Project',
    industry: 'Nonprofit · Arts and culture',
    year: null,
    location: 'Dallas, TX',
    url: 'https://latinoartsproject.com',
    tagline: 'Rooted. Modern. Bilingual.',
    services: ['brand-development', 'creative-strategy', 'website-design'],
    headline: 'A bilingual identity as intentional and rooted as the culture it celebrates',
    summary: 'Contemporary Latino and Mexican art deserves an institution that looks the part. We built the identity, the platform, and the retail experience to match.',
    thumb: { tone: 'aqua', word: 'Rooted\nModern' },
    metrics: [
      { value: '3', label: 'Channels unified' },
      { value: '2+', label: 'Major exhibitions a year' }
    ],
    quote: null,
    situation: ['Latino Arts Project curates work from Huichol artisans, contemporary Mexican painters, and rotating exhibitions that bridge tradition and now. The brand needed to feel rooted in heritage and uncompromisingly modern at the same time.'],
    diagnosis: ['The brand had to feel native in both English and Spanish, not translated from one. An identity that honors Huichol pattern language and reads contemporary on a museum wall.'],
    system: [
      { t: 'Brand identity', d: 'A typographic and color system — Negro, Tierra, Naranja, Crema — that carries from exhibition signage to online retail.' },
      { t: 'Website plus Shopify storefront', d: 'Lets the community shop, donate, and engage in one seamless experience.' },
      { t: 'Exhibition collateral and signage', d: 'Bilingual, cultural, accessible, grounded in story.' },
      { t: 'Retail and donor touchpoints', d: 'Retail and merchandise that extend the visit beyond the gallery.' }
    ],
    result: 'Three channels unified under one bilingual identity: exhibitions, online retail, and community.'
  },
  {
    slug: 'mammogram-poster-girls',
    tier: 1,
    featured: 5,
    client: 'Mammogram Poster Girls',
    industry: 'Nonprofit · Breast cancer awareness',
    year: '2024',
    location: 'North Texas',
    url: 'https://mammogrampostergirls.org',
    tagline: 'Saving lives, one mammogram at a time.',
    services: ['brand-development', 'ongoing-marketing', 'website-design'],
    headline: 'A nonprofit brand system loud enough to fund the mission',
    summary: 'MPG funds free screenings across North Texas. We rebuilt the brand so the mission lands as loud as the message deserves.',
    thumb: { tone: 'magenta', word: 'Get It\nChecked' },
    flagship: true,
    metrics: [
      { value: '+49%', label: 'Event signups' },
      { value: '3', label: 'Hospital partners' }
    ],
    quote: null,
    situation: ['MPG partners with Methodist, Parkland’s Moody Center, and Hill Regional to fund mammograms for women who can’t afford them, plus mobile screenings in underserved neighborhoods.'],
    diagnosis: ['One mission, three voices. A year-round master brand, an annual June fundraiser, and a poster series, each shifting voice, audience and visual treatment while staying clearly in the same family.'],
    system: [
      { t: 'Brand refresh and guide', d: 'A modernized identity and a full brand guide for sponsors, volunteers, and medical partners.' },
      { t: 'Website rebuild', d: 'Rebuilt from scratch.' },
      { t: 'Man UP! To Breast Cancer', d: 'The June fundraiser’s sub-brand: bolder, more direct, the same DNA stretched into peer-to-peer fundraising.' },
      { t: 'Busted poster series', d: '“Get it checked. Get it caught. Get on with it.” Built for clinic waiting rooms where the brand has seconds to land.' },
      { t: 'Donor and sponsor assets', d: 'Campaign assets packaged donor-ready.' }
    ],
    result: 'Event signups rose 49%, and thousands of free screenings have been funded across three hospital partners.'
  },
  {
    slug: 'beverage-displays',
    tier: 2,
    featured: 6,
    client: 'Beverage Display Design',
    industry: 'Retail · Point-of-sale · Structural design',
    year: null,
    location: 'National',
    url: null,
    tagline: 'Win the shelf.',
    services: ['creative-strategy', 'brand-development'],
    headline: 'Retail displays engineered to win the shelf',
    summary: 'Concept to production-ready CAD for American Airlines, Veuve Clicquot, Shiner, Bishop Cider and more.',
    thumb: { tone: 'cream', word: 'Win the\nShelf' },
    metrics: [{ value: '9+', label: 'Active brand partners' }],
    quote: null,
    situation: ['When the brief is “win the shelf,” the design has to earn the look from across the aisle. Every project starts with the brand’s iconography and ends with shop-floor reality.'],
    diagnosis: ['A display has to interrupt at retail and survive in production. If a stocker cannot assemble it in twelve minutes, it does not ship. From across the aisle, it has to read in three seconds or less.'],
    system: [
      { t: 'Concept', d: 'Iconography decoded, theme set, retail context mapped. Hand sketches, mood boards and shelf-context studies before a single CAD line.' },
      { t: 'Structural design', d: 'CAD engineering for stack-ability, shelf life, and fabrication tolerances, with a real palletization plan.' },
      { t: 'Production', d: 'Print-ready files and fabricator-spec packets, palletized for national distribution.' }
    ],
    result: 'Displays for Veuve Clicquot, Bishop Cider, American Airlines, Shiner, Corralejo, Korbel, Skyy, Deschutes and Interstate Batteries, from POS to mass display, with national distribution reach.'
  },
  {
    slug: 'van-country',
    tier: 1,
    featured: 7,
    client: 'Van Country',
    industry: 'Passenger van rental · Group travel',
    year: '2023',
    location: 'Arlington, TX · Amarillo, TX',
    url: 'https://vancountry.com',
    tagline: 'North Texas Proud. Customer Service Driven.',
    services: ['brand-development', 'website-design', 'ongoing-marketing', 'marketing-automation'],
    headline: 'The brand and the funnel for DFW’s go-to passenger vans',
    summary: 'Van Country is the DFW go-to for clean, dependable 12 and 15-passenger vans. We built the brand and the funnel.',
    thumb: { tone: 'aqua', word: 'Ready\nto Roll' },
    flagship: true,
    metrics: [
      { value: '+83%', label: 'Direct bookings' },
      { value: '2.1×', label: 'Google Ads conversion' }
    ],
    quote: null,
    situation: ['The fleet ranges from the VC Cruiser Collection to luxury Mercedes-Benz Sprinter Hi-Tops, with 12 and 15-passenger Ford T350s and Chevy G2500/G3500s for groups of every size.'],
    diagnosis: ['The previous brand felt utilitarian. The category demanded warmth, trust, and conversion.'],
    system: [
      { t: 'Brand identity', d: 'Built around “Ready to Roll?” Maroon, forest green, cream, and a wordmark that reads at 70 mph and on a phone screen.' },
      { t: 'Website', d: 'Designed to convert browse to booking.' },
      { t: 'Google Ads', d: 'Strategy and management.' },
      { t: 'Email automation', d: 'Follow-up that, with paid, nearly doubled the funnel.' }
    ],
    result: 'Direct bookings rose 83% and Google Ads conversion rose 2.1×.'
  },
  {
    slug: 'event-weis',
    tier: 1,
    featured: 8,
    client: 'Event Weis',
    industry: 'Event planning · Corporate and nonprofit',
    year: null,
    location: 'Dallas, TX',
    url: 'https://www.eventweis.com',
    tagline: 'Define. Develop. Deploy.',
    services: ['brand-development', 'marketing-automation', 'website-design'],
    headline: 'A founder’s brand, and the systems to run it herself',
    summary: 'Cheryl Weis spent years producing corporate events for other people’s brands. We helped her launch hers.',
    thumb: { tone: 'yellow', word: 'Define\nDeploy' },
    metrics: [
      { value: '9', label: 'Bookings in 90 days' },
      { value: '3×', label: 'Inquiry submissions' },
      { value: '-60%', label: 'Marketing spend' }
    ],
    quote: {
      text: 'Kija helped me turn years of event experience into a brand that finally felt established. The website, tools, and systems they built made it easy to run my marketing without depending on outside help.',
      name: 'Cheryl Weis', role: 'Founder, Event Weis'
    },
    situation: ['Cheryl had the experience and the network. What she didn’t have was a brand that signaled the caliber of her work, a system to run marketing without an agency on retainer, and the digital infrastructure to convert inquiries into bookings.'],
    diagnosis: ['Her own methodology, Define, Develop, Deploy, was the brand waiting to be named. It became her three-step pitch, and ours too.'],
    system: [
      { t: 'Brand from scratch', d: 'A mark that balances corporate polish with Cheryl’s calm, hands-on personality.' },
      { t: 'Website', d: 'Designed and developed to turn inquiries into bookings.' },
      { t: 'Social template system', d: 'Reusable assets so she can keep selling without rebuilding creative every time.' },
      { t: 'Marketing infrastructure and training', d: 'Set up, then handed over, so she could run it independently from day one.' }
    ],
    result: 'Nine bookings in the first 90 days, three times the inquiry submissions, and 60% less spent on marketing.'
  },

  /* ---- Repo-only cases: not on the live site. Kept pending a decision;
     see content-import/TRANSFER-REPORT.md §1. ---------------------------- */
  {
    slug: 'altacrest-capital',
    listed: false,   // not on kijacreative.com; page kept, hidden from listings
    tier: 2,
    client: 'Altacrest Capital',
    industry: 'Financial services',
    year: '2023',
    services: ['website-design', 'marketing-automation', 'brand-development'],
    headline: 'A credible digital front door for a private capital firm',
    summary: 'Site build plus CRM integration for a firm whose deal flow depends on how it reads.',
    thumb: { tone: 'plum', word: 'Signal\nOver\nNoise' },
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
    listed: false,   // not on kijacreative.com; page kept, hidden from listings
    tier: 2,
    client: 'Seismic',
    industry: 'Technology',
    year: '2022',
    services: ['marketing-automation', 'website-design'],
    headline: 'A marketing system built to survive its own scale',
    summary: 'Large-scale system build for an organisation where marketing runs across many hands.',
    thumb: { tone: 'cream', word: 'Built\nTo Scale' },
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
    listed: false,   // not on kijacreative.com; page kept, hidden from listings
    tier: 2,
    client: 'GES',
    industry: 'Professional services',
    year: '2022',
    services: ['marketing-automation', 'ongoing-marketing'],
    headline: 'Internal marketing that scales without adding headcount',
    summary: 'A repeatable internal system so marketing stops being a bottleneck.',
    thumb: { tone: 'aqua', word: 'Repeat\nable' },
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
    slug: 'powerx',
    listed: false,   // not on kijacreative.com; page kept, hidden from listings
    tier: 3,
    client: 'PowerX',
    industry: 'Technology',
    year: '2023',
    services: ['website-design', 'brand-development'],
    headline: 'A build with the energy the product actually has',
    summary: 'Website design and build with brand system support.',
    thumb: { tone: 'yellow', word: 'Power\nX' },
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
    listed: false,   // not on kijacreative.com; page kept, hidden from listings
    tier: 3,
    client: 'Piehole Project',
    industry: 'Food & hospitality',
    year: '2022',
    services: ['brand-development', 'creative-strategy'],
    headline: 'Culture-first identity for a brand with an actual personality',
    summary: 'Identity work for a brand that had no interest in being tasteful.',
    thumb: { tone: 'plum', word: 'Pie\nhole' },
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
// Everything shown in listings (grid, wall, tapes) comes from the live site.
export const listed = () => cases.filter((c) => c.listed !== false);
export const featured = () => cases.filter((c) => c.featured).sort((a, b) => a.featured - b.featured);
