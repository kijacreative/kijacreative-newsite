/* ==========================================================================
   CASE KITS — the playable part of each case page
   Ported from the live kijacreative.com case pages (owner's content), then
   rebuilt in the studio style. Figures are only those the live pages publish;
   calculators carry their published methodology. Images use the live-site
   files now and the Drive "Portfolio Selects" files once they are in
   src/media (each `img` lists preferred files first; the first that exists wins).
   ========================================================================== */

export const caseKits = {
  cliqbux: {
    hero: ['studio/cliqbux/analyzer-report.webp'],
    signature: { line: 'Partners on every order.', note: 'Cliqbux liked the evaluation tool enough to ask for more of the system, and then made Kija a 45% partner on all orders. We meet every week on their site, marketing, sales and strategy.' },
    modules: [
      { type: 'fees', title: 'Keep more<br>of every order', sub: 'The math the analyzer puts in front of every restaurant. Slide to a restaurant’s monthly online sales.',
        min: 5000, max: 150000, step: 5000, value: 60000, appsLow: 0.15, appsHigh: 0.30, cliqbux: 0.065,
        note: 'Illustrative. Fees are a share of online order sales: 15–30% is the range the analyzer shows for delivery apps like DoorDash and Uber Eats; about 6.5% is Cliqbux’s all-in cost, card processing included.' },
      { type: 'shots', title: 'One report,<br>one restaurant', sub: 'Screens from the Restaurant Analyzer, shown with sample data.',
        items: [
          ['studio/cliqbux/analyzer-report.webp', 'Order Readiness Score and what’s working'],
          ['studio/cliqbux/analyzer-orders.webp', 'Where the restaurant’s online orders go today'],
          ['studio/cliqbux/analyzer-search.webp', 'What people search for nearby'],
          ['studio/cliqbux/analyzer-ai.webp', 'What AI assistants say, and the full checklist']
        ] }
    ]
  },

  'oak-cliff-pilates': {
    hero: ['selects/oak-cliff-pilates/OCP Bishop Team.jpg', '2026/02/OCP-Grand-Opening-308-scaled.webp'],
    signature: { line: 'Are You Down with OCP?', note: 'A question that became a community password. From new-member welcomes to t-shirts to Instagram captions, the line carries the brand without ever feeling like a tagline.' },
    modules: [
      { type: 'floors', title: 'One brand.<br>Three floors.', sub: 'Same DNA, three neighbourhood personalities. Pick a studio.',
        items: [
          { name: 'Bishop Arts', tag: 'Original studio · Est. 2020', address: '196 W. Davis St., Dallas', h: 'Where it started.',
            d: 'The original cult studio. Walkable, brunch-after, neighbourhood-first. Bishop Arts gave OCP its language and its community before any other floor existed.',
            line: 'Are You Down with OCP?', img: ['selects/oak-cliff-pilates/OCP Bishop Interior.jpg', 'selects/oak-cliff-pilates/Bishop 1200x1200.jpg', '2026/02/OCP-Grand-Opening-308-scaled.webp'] },
          { name: 'Uptown', tag: 'Expansion 01 · Est. 2022', address: '2222 McKinney Ave., Dallas', h: 'Pre-meeting energy. Post-meeting calm.',
            d: 'Built for the high-rise crowd. 6am classes that beat the traffic, polished signage that lives next to luxury retail. Same brand DNA, sharper edges.',
            line: 'Strong before the inbox.', img: ['selects/oak-cliff-pilates/OCP Uptown Sign.jpg', 'selects/oak-cliff-pilates/Uptown 1200x1200.png', '2026/06/OCP-Uptown-scaled.webp'] },
          { name: 'Lower Greenville', tag: 'Expansion 02 · Est. 2024', address: '2000 Greenville Ave., Dallas', h: 'Sunday-morning vibes. Tuesday-night discipline.',
            d: 'The warmest floor. Cream and gold colourway, coffee-after culture, and a programming mix designed for the Lower Greenville rhythm. The system’s range, made visible.',
            line: 'Slow morning, strong week.', img: ['selects/oak-cliff-pilates/OCP Lower Greenville - Sign.jpg', 'selects/oak-cliff-pilates/Lower Greenville 1200x1200.png', '2026/06/LowerGreenville-scaled.webp'] }
        ] },
      { type: 'growth', title: 'One studio<br>to three', sub: 'Drag through the openings. Only the figures OCP has published are shown.',
        stops: [
          { k: '2020', studios: 1, stat: '450', statL: 'active members', note: 'Bishop Arts opens with a cult following.' },
          { k: '2022', studios: 2, note: 'Uptown opens: the system’s first flex.' },
          { k: '2024', studios: 3, note: 'Lower Greenville opens in cream and gold.' },
          { k: 'Today', studios: 3, stat: '1,100+', statL: 'members across three studios', stat2: '400%+', stat2L: 'revenue growth', note: 'One brand, three floors, one family.' }
        ] }
    ]
  },

  honeycomb: {
    hero: ['selects/honeycomb/hero.jpg'],
    modules: [
      { type: 'calc', title: 'Operator<br>math', sub: 'The argument Honeycomb’s brand had to make, as a calculator. Move the slider to your building.',
        min: 25, max: 1000, step: 25, value: 200, unit: 'parking spaces',
        before: { util: 0.60, rate: 150, label: 'Unmanaged' }, after: { util: 0.85, rate: 220, label: 'Run on Honeycomb' },
        note: 'This is illustrative, not a quote. Methodology: about 60% utilisation at $150 per space per month, against about 85% at $220 once access, amenities and billing run on one platform.' }
    ]
  },

  'blue-plate-network': {
    hero: ['2026/06/BluePlate-Brand-Identity-Evolution.webp', '2021/11/blueplate-SS.webp'],
    modules: []
  },

  'latino-arts': {
    hero: ['2026/02/09042022-12.webp'],
    modules: [
      { type: 'bilingual', title: 'Rooted. Modern.<br>Bilingual.', sub: 'An identity that honours Huichol pattern language and reads contemporary on a museum wall. Heritage and now, in the same breath.',
        en: { a: 'Latino', b: 'Arts', c: 'Project', line: 'Rooted. Modern. Bilingual.' },
        es: { a: 'Arte', b: 'Latino', c: 'Proyecto', line: 'Arraigado. Moderno. Bilingüe.' } }
    ]
  },

  'mammogram-poster-girls': {
    hero: ['selects/mammogram-poster-girls/2026_10_07_MPG_Aframe_UseMockup_v01.jpg', '2026/02/MPG-scaled.webp'],
    modules: [
      { type: 'impact', title: 'Impact<br>math', sub: 'Every $150 funds one free mammogram for a woman who can’t afford it.',
        min: 150, max: 15000, step: 150, value: 1500, per: 150,
        split: [['Methodist', 0.5], ['Parkland Moody', 0.3], ['Hill Regional', 0.2]],
        why: 'Each screening is a chance to catch breast cancer early. Caught while still localised, its five-year relative survival rate is about 99 percent. That is the math your gift bends.',
        note: '$150 per screening is MPG’s published per-mammogram cost across partner facilities. Allocation across the three partners is illustrative, based on prior funding cycles; actual distribution depends on MPG’s current grant cycle and partner capacity.' },
      { type: 'voices', title: 'One mission.<br>Three voices.', sub: 'Every sub-brand answers to the master voice.',
        items: [
          { name: 'Mammogram Poster Girls', tag: 'Master brand', aud: 'Women in North Texas, donors, medical partners', goal: 'Year-round funding, mission awareness',
            voice: 'Saving lives, one mammogram at a time.', d: 'Approachable, warm, mission-first. The Girls speak directly to women and to the partners who fund the work.',
            img: ['selects/mammogram-poster-girls/2025_10_03_MPG_Rebrand_LogoPrimary_v01.png', '2026/06/MPG-Logo.png'], logo: true },
          { name: 'Man UP! To Breast Cancer', tag: 'Sub-brand · June event', aud: 'Men supporting the women in their lives', goal: 'Annual June fundraiser, peer-to-peer outreach',
            voice: 'Real men know early detection saves the women they love.', d: 'Bolder, more direct. Same brand DNA stretched into a peer-to-peer fundraising moment: darker palette, sharper edges.',
            img: ['2026/02/ManUP-Logos-wh-OL-01.png'], logo: true, dark: true },
          { name: 'Busted', tag: 'Campaign · poster series', aud: 'Broader awareness, clinic and public-space placement', goal: 'Make screening reminders impossible to miss',
            voice: 'Get it checked. Get it caught. Get on with it.', d: 'Editorial typography and direct campaign language for waiting rooms and partner walls where the brand has seconds to land. The cheekiest voice in the family, on purpose.',
            img: ['selects/mammogram-poster-girls/2025_07_16_MPG_BustedEvent_Poster_v01.jpg', '2026/02/Busted-Poster-scaled.webp'] }
        ] }
    ]
  },

  'beverage-displays': {
    hero: ['2026/02/Veuve-Deer-Head-scaled.webp'],
    modules: [
      { type: 'process', title: 'Sketch to<br>shop floor', sub: 'Bishop Cider mass display, co-built with Uncommon Brands. Scrub through the three stages.',
        specs: [['Footprint', '48 × 40 in'], ['Capacity', '240 units']],
        stages: [
          { k: 'Stage 01 · The brief', h: 'Concept.', img: '2026/06/Bishop-Sketch.webp',
            d: 'Brand-led concept development. Iconography decoded, theme set, retail context mapped: translating the craft-cider attitude into a mass floor stack operators could spot from the entrance.',
            q: 'What does the brand want to be remembered for from across the aisle?',
            out: ['Concept sketches', 'Mood and material boards', 'Shelf-context studies', 'Approved direction'] },
          { k: 'Stage 02 · The build', h: 'Structural design.', img: '2026/06/Bishop-Rendering.webp',
            d: 'CAD engineering for stack-ability, shelf life and fabrication tolerances. The sketch becomes a 3D rendering with real dimensions, real materials and a real palletisation plan.',
            q: 'If a stocker cannot assemble it in twelve minutes, it does not ship.',
            out: ['3D CAD models', 'Technical drawings', 'Materials specification', 'Fabricator-ready pack'] },
          { k: 'Stage 03 · The floor', h: 'Production.', img: '2026/06/Bishop-Instore.webp',
            d: 'Print-ready files, fabricator-spec packets, palletised for national distribution. It arrives looking like the rendering, holding inventory the way the CAD modelled, and pulling shoppers the way the sketch promised.',
            q: 'From across the aisle, it has to read in three seconds or less.',
            out: ['Print-ready production files', 'Palletisation plan', 'Field-installation guide', 'QC checklist'] }
        ] },
      { type: 'brands', title: 'On the shelf for', items: [
        ['Veuve Clicquot', 'Luxury sculptural'], ['Bishop Cider', 'Mass floor stack'], ['American Airlines', 'Wall wraps'], ['Shiner', 'Mobile activation'],
        ['Corralejo', 'Premium spirits'], ['Korbel', 'Sparkling POS'], ['Skyy', 'Spirits display'], ['Deschutes', 'Craft beer POS'],
        ['Interstate Batteries', 'Retail wraps'], ['Uncommon Brands', 'Mass display co-build']] }
    ]
  },

  'van-country': {
    hero: ['selects/van-country/2026_04_02_VanCountry_Website_FooterBackground_v01.webp', 'selects/van-country/2026_10_06_VanCountry_Website_LandingPageScreenshot_v01.jpg'],
    signature: { line: 'Ready to Roll?', note: 'The question the whole identity is built around: an invitation, not a spec sheet.' },
    modules: []
  },

  'event-weis': {
    hero: ['selects/event-weis/03_TheSky_Background_8000px.jpg', '2026/02/LogoCardsShot-scaled.webp'],
    modules: []
  }
};

export const kitFor = (slug) => caseKits[slug] || { hero: [], modules: [] };
