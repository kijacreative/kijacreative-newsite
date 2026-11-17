/* ==========================================================================
   INSIGHTS — answer-first articles (/insights/<slug>)
   Format: the first paragraph answers the question outright (that is what an
   answer engine quotes); the sections earn it. Proof cites only figures the
   live case studies publish. No borrowed statistics.
   ========================================================================== */

export const articles = [
  {
    slug: 'brand-before-website',
    q: 'Should you rebrand before rebuilding your website?',
    a: 'Yes, in almost every case. A website is an application of a brand system; building one before the system exists means building it twice.',
    answer: 'Yes, in almost every case. A website is an application of your brand: its structure comes from your positioning, its look from your identity system, and its words from your messaging. Build the site first and you will rebuild it once the brand catches up.',
    tag: 'Creative Strategy', service: 'creative-strategy', read: '6 min', related: 'van-country',
    sections: [
      { h: 'Why the order matters', p: [
        'A website quietly encodes dozens of brand decisions. Who it is for. What to say first. What to leave out. Which colour means "click here" and which means "pay attention". When those answers already exist, the site applies them. When they do not, the team makes them up in design reviews, one argument at a time, and the finished site freezes a set of guesses into code.',
        'When the brand work happens afterwards, and it usually does, most of those guesses are wrong in small ways that add up. The navigation reflects the old offer. The homepage leads with the thing you have stopped selling. Rebuilding then costs more than doing it in order would have.'
      ] },
      { h: 'What "rebrand" has to mean here', p: [
        'Not necessarily a new logo. Before a site, you need three things written down: a position (who you are the obvious choice for, and why), a messaging framework (the words your team uses on calls, on the site and in the deck), and an identity with rules rather than just files (colour roles, a type scale, image direction).',
        'Sometimes the existing identity survives intact and only the strategy changes. That is still a rebrand in the sense that matters, because the site is built on decisions instead of preferences.'
      ] },
      { h: 'The exceptions', p: [
        'If your site is technically failing (insecure, unmaintainable, or broken on phones) and the brand underneath it is sound, rebuild on the system you have. And if a launch date is fixed weeks away, build a deliberately minimal site on interim rules and schedule the real one, knowingly, rather than pretending the interim site is the finished thing.'
      ] },
      { h: 'How we sequence it', p: [
        'Creative strategy first, brand development second, website third, with marketing automation built alongside and ongoing marketing on top. With Van Country we built the identity around "Ready to Roll?" before designing the site to convert browsing into booking. Direct bookings rose 83% and Google Ads conversion rose 2.1×, results the site could not have delivered on its own.'
      ] }
    ],
    inShort: [
      'A website applies a brand; it cannot stand in for one.',
      'Before the site: a written position, a messaging framework, and identity rules.',
      'Only skip the order for a technically failing site or a fixed date, and plan the rebuild.'
    ]
  },
  {
    slug: 'what-a-brand-system-includes',
    q: 'What is actually in a brand system?',
    a: 'Rules, not files. Colour roles, a type scale, spacing, motion, photography direction and voice — enough that someone who has never met you can produce on-brand work.',
    answer: 'Rules, not files. Colour roles, a type scale, spacing, motion, photography direction and voice, written down well enough that someone who has never met you can produce on-brand work without asking.',
    tag: 'Brand Development', service: 'brand-development', read: '8 min', related: 'oak-cliff-pilates',
    sections: [
      { h: 'Files versus rules', p: [
        'A logo folder tells you which assets exist. It does not tell you which version goes on a dark photo, how big the headline should be on a flyer, or whether the new hire is allowed to use the accent colour for a button. Every one of those questions gets answered somewhere, and without a system it gets answered differently each time.',
        'A brand system answers them before they are asked. That is the whole job.'
      ] },
      { h: 'The parts', p: [
        'Positioning and messaging, so the words come from the same place as the visuals. A logo system with clear usage. Colour with roles, not just swatches: on our own site, mint means "you can click this" and is used for nothing else. A type scale with jobs for each size. Layout and spacing rules. Photography or illustration direction. Voice, with examples. And templates for the outputs you actually make most often.',
        'The templates matter more than most guides admit. A rule nobody can apply quickly gets ignored under deadline.'
      ] },
      { h: 'How you know it works', p: [
        'Give the guide and a template to someone who has never worked with you and ask for a flyer. If what comes back looks related to everything else, the system works. If it needs three rounds of "not quite", it is a style guide, not a system.',
        'Oak Cliff Pilates is the clearest test we have run. One master system flexes across three Dallas studios: Bishop Arts, Uptown and Lower Greenville. Each has its own neighbourhood line ("Strong before the inbox." for Uptown, "Slow morning, strong week." for Lower Greenville) while a shared master line holds the family together.'
      ] },
      { h: 'Where it lives', p: [
        'Somewhere it can be updated. A PDF goes stale the week after it is exported. We publish our own system as a live page that the site itself is rendered from, so the rules and the reality cannot drift apart.'
      ] }
    ],
    inShort: [
      'A brand system is the decisions, written down, not the asset folder.',
      'Colour needs roles, type needs jobs, and templates make the rules usable.',
      'Test it by handing it to a stranger and seeing whether the work comes back related.'
    ],
    extraLink: { href: '/brand-system', label: 'See our own system, published' }
  },
  {
    slug: 'website-conversion-rate-benchmarks',
    q: 'What is a good conversion rate for a B2B services website?',
    a: 'Between 2% and 5% of visitors to enquiry is typical. The more useful number is the one you are at now, which most businesses cannot state.',
    answer: 'Between 2% and 5% of visitors becoming an enquiry is a commonly cited range. The more useful number is your own current rate, measured by source, which most businesses cannot state.',
    tag: 'Website Design', service: 'website-design', read: '5 min', related: 'van-country',
    sections: [
      { h: 'Why benchmarks mislead', p: [
        'A conversion rate is a ratio of two things that vary wildly between businesses: who arrives, and what you count as converting. A site that gets most of its traffic from people searching its own name will convert far higher than one buying cold traffic from social. A form fill is not the same event as a booked call. Comparing your number to an industry average without accounting for either tells you very little.',
        'Compare yourself against yourself instead: the same definition, the same sources, over time.'
      ] },
      { h: 'Measure it before you change anything', p: [
        'Decide what counts (form submission, booked call, phone call) and track each separately. Split the numbers by traffic source and by landing page. Give it a few weeks to settle into a baseline. Most redesigns skip this step, which is why most redesigns cannot say whether they worked.'
      ] },
      { h: 'What usually moves it', p: [
        'Clarity in the first screen: who this is for and what happens next. Fewer paths, each with stronger intent. Proof placed next to the ask rather than on a separate page. Forms that ask only what is needed. Fast pages. In short, a site that filters instead of documents.',
        'Van Country is a good example. The old site led with the fleet; the rebuild led with the trip, so visitors could work out which van suited them without leaving for a marketplace. Direct bookings rose 83%.'
      ] },
      { h: 'Traffic that is not ready yet', p: [
        'Not every visitor will enquire today, and pushing them harder rarely helps. Give them something useful to do instead, like a diagnostic or a case study that matches their situation, and a way back. That is a separate conversion worth measuring too.'
      ] }
    ],
    inShort: [
      '2–5% is a common range, but your own baseline matters more.',
      'Track each conversion type and each traffic source separately.',
      'Clarity, proof near the ask, and short forms usually move the number most.'
    ]
  },
  {
    slug: 'speed-to-lead',
    q: 'How fast do you need to respond to a new lead?',
    a: 'Inside five minutes to be competitive, inside sixty seconds to be memorable. After an hour you are usually competing for a decision that has already been made.',
    answer: 'Inside five minutes to be competitive, inside sixty seconds to be memorable. After an hour you are usually competing for a decision that has already been made.',
    tag: 'Marketing Automation', service: 'marketing-automation', read: '4 min', related: 'honeycomb',
    sections: [
      { h: 'Why speed beats polish', p: [
        'The moment someone fills in your form is the moment their interest is highest. They are often contacting more than one firm, and the first credible reply sets the frame for everything after it. A perfect response tomorrow loses to a good one now.'
      ] },
      { h: 'What a response actually is', p: [
        'Not a robotic "thanks, we will be in touch". A useful first reply confirms what they asked for, says what happens next and when, gives them a direct next step such as a calendar link, and, where it fits, shows one piece of relevant proof. It should read like it came from someone who looked at what they wrote.',
        'Fill in any form on this site and you will see the version we run for ourselves.'
      ] },
      { h: 'Build it as a system, not a habit', p: [
        'Speed that depends on somebody watching an inbox does not survive a busy week. Route every enquiry straight into the CRM with its source attached, give it an owner the moment it arrives, send a specific first reply automatically within a minute, and set a time by which a person follows up. Decide what happens out of hours.',
        'For Honeycomb we stood up marketing automation that nurtures from demo request through close. Demo bookings rose 67% and the sales cycle shortened by 18%.'
      ] },
      { h: 'What to measure', p: [
        'Time to first response, by source. The number of enquiries that never got a reply at all, which is usually higher than anyone expects. And what happens to the leads that came in at 6pm on a Friday.'
      ] }
    ],
    inShort: [
      'Answer within minutes; after an hour the decision is often made.',
      'The first reply should be specific and give a clear next step.',
      'Make it a system: CRM routing, an owner, an automatic first reply, a follow-up deadline.'
    ],
    extraLink: { href: '/fit-finder', label: 'Try a form and watch what happens' }
  },
  {
    slug: 'when-to-start-paid-ads',
    q: 'When should you start running paid ads?',
    a: 'After the position is settled and the landing page converts. Paid amplifies whatever is underneath it, including the problems.',
    answer: 'After your position is settled and your landing page converts. Paid amplifies whatever is underneath it, including the problems.',
    tag: 'Ongoing Marketing', service: 'ongoing-marketing', read: '6 min', related: 'van-country',
    sections: [
      { h: 'Paid is an amplifier', p: [
        'Ad spend multiplies the conversion rate you already have. If the page converts well, more traffic means more enquiries. If it does not, more traffic means paying to learn that faster. Running ads into an unclear offer is one of the most expensive ways to find out the offer is unclear.'
      ] },
      { h: 'Ready, in practice', p: [
        'Your position is clear enough that the ad copy nearly writes itself. You have landing pages matched to what people searched for, not a generic homepage. Tracking works, so you will know which campaigns produce enquiries rather than clicks. Your follow-up can handle more volume without leads going cold. And there is budget for a learning period, because the first weeks are for finding out, not for judging.'
      ] },
      { h: 'Start narrow', p: [
        'High-intent search before broad social. Match each intent to its own page, never the homepage. Widen once the narrow version is working.',
        'With Van Country we ran the Google Ads strategy alongside email automation once the rebuilt site was converting browsers into bookings. Google Ads conversion rose 2.1×.'
      ] },
      { h: 'When ads can come earlier', p: [
        'One good reason to run ads before everything is ready: testing whether anyone wants a new offer at all. Keep the budget small, accept that it is research, and do not mistake the result for a campaign.'
      ] }
    ],
    inShort: [
      'Settle the position and fix the landing page before you scale spend.',
      'Make sure tracking and follow-up can handle the volume.',
      'Start with high-intent search and matched pages, then widen.'
    ]
  },
  {
    slug: 'agency-vs-in-house',
    q: 'Should you hire an agency or build the function in-house?',
    a: 'In-house wins on context and consistency. Agencies win on range and speed of setup. The honest split is usually agency to build the system, in-house to run it.',
    answer: 'In-house wins on context and consistency; agencies win on range and speed of setup. The honest split is usually an agency to build the system and an in-house team to run it.',
    tag: 'Creative Strategy', service: 'creative-strategy', read: '7 min', related: 'event-weis',
    sections: [
      { h: 'What each is good at', p: [
        'An in-house team knows the business in a way no outsider can: the history, the politics, the customers by name. It is there every day and remembers why decisions were made. An agency brings specialists you would not hire full-time, pattern recognition from many other businesses, and the ability to start at full speed without a hiring process.'
      ] },
      { h: 'The split that works', p: [
        'Use an agency for the work that happens once and needs range: positioning, the identity system, the website, the automation. Make handover part of the brief, with documentation, templates and training. Then let an in-house person or small team run the day-to-day with tools built for them, and bring the agency back periodically for strategy.',
        'Event Weis is the version of this we are proudest of. We created the brand, built the website and a social template system, and trained Cheryl Weis to run her marketing herself from day one. Her marketing spend fell 60%.'
      ] },
      { h: 'Which you need right now', p: [
        'Lean in-house if you produce a high volume of daily output, the system already exists, and speed of small iterations matters most. Lean agency if there is no system yet, projects keep stalling on "what should this look like?", or the gaps are specialist ones like structural design or automation.'
      ] },
      { h: 'Questions to ask any agency', p: [
        'Will you hand over everything you build, in a form we can run without you? Who will actually do the work? What is explicitly out of scope? An agency that is uncomfortable with any of these answers is telling you how the relationship will go.'
      ] }
    ],
    inShort: [
      'In-house brings context; an agency brings range and speed.',
      'Agency builds the system, in-house runs it, with handover in the brief.',
      'Ask any agency whether you can run what they build without them.'
    ],
    quoteFrom: 'event-weis'
  }
];

export const articleBySlug = (s) => articles.find((a) => a.slug === s);
