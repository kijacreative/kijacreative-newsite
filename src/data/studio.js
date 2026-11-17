/* ==========================================================================
   MORE FROM THE STUDIO — work beyond the eight case studies
   Sources: the Drive "Portfolio Selects 2026-11" index (the owner's own
   picks), the Marshman Design portfolio write-ups, and artifacts built in
   Claude. Descriptions say only what the work shows; no results are claimed.

   show: true  → on /work.   show: false → held until the owner clears it
   (pitches and concepts for prospects, unclear relationships). Flip a project
   to true once the client is happy to be shown.
   status: 'live' | 'handoff' | 'concept' | null (null = no badge).
   Images: preference lists; the first file present in src/media wins.
   `sel(slug, file)` covers the extension the selects script chose.
   ========================================================================== */
const sel = (slug, base) => [`selects/${slug}/${base}.jpg`, `selects/${slug}/${base}.png`, `selects/${slug}/${base}.webp`];
const mm = (file) => [`studio/marshman/${file}.webp`];

export const studio = [
  { slug: 'root-pilates', name: 'Root Pilates Company', where: 'Ridgefield, Connecticut', disc: ['web', 'brand'], status: 'live', url: 'https://rootpilates.vercel.app/', show: true, tone: 'plum',
    summary: 'Root Pilates Company, formerly the Pilates Barre, is a small-group Reformer and Fusion studio. Its identity pairs a wordmark with a circular mark of five figures and leaves, in forest green, cream and charcoal.',
    body: 'The website covers the studio’s Reformer and Fusion classes, the schedule, pricing and assessment booking, with a short quiz for people who are not sure where to start. The brand guidelines have their own page, for the team and anyone designing for the studio.',
    deliverables: ['Logo and mark', 'Brand guidelines', 'Website design and build', 'Class-finder quiz'],
    cover: ['studio/root-pilates/rp-hero.webp', ...mm('root-pilates')],
    gallery: [['studio/root-pilates/rp-classes.webp', 'Class cards'], ['studio/root-pilates/rp-founder.webp', 'Founder story'], ['studio/root-pilates/rp-start.webp', 'Where to start'],
      [mm('root-pilates-brand-guide'), 'Brand guidelines'], [mm('root-pilates-reformer'), 'Root Reformer']] },

  { slug: 'camp-firewalker', name: 'Camp Firewalker', where: 'Dallas nonprofit', disc: ['brand', 'web'], status: 'live', url: 'https://campfirewalker.org/', show: true, tone: 'plum',
    summary: 'A volunteer-driven, donor-supported nonprofit that creates outdoor adventures to build teamwork, confidence and self-reliance. Its identity is a phoenix rising from a campfire above a lakeside sunset, with a CF monogram at its heart.',
    body: 'The system covers the full logo, a phoenix icon, the CF monogram, a flame mark and a stacked wordmark, in charcoal, tan, cream, olive and rust, with the line “Adventure. Community. Character.” The website brings the story, a photo and video gallery, volunteer and donor pages and a merchandise shop into one site, with the brand guidelines online.',
    deliverables: ['Logo, phoenix icon and monogram', 'Colour palette and online guidelines', 'Website and merchandise catalogue', 'Merchandise'],
    cover: [...sel('camp-firewalker', '2026_10_07_CampFirewalker_Merch_WaterBottlePhoto_v01'), ...mm('camp-firewalker-brand')],
    gallery: [[sel('camp-firewalker', '2026_08_11_CampFirewalker_Brand_LogoBefore_v01'), 'Before'], [sel('camp-firewalker', '2026_08_07_CampFirewalker_Brand_LogoPrimaryPNG_v01'), 'After'],
      [sel('camp-firewalker', '2026_08_11_CampFirewalker_Brand_PhoenixCrest_v01'), 'Phoenix crest'], [mm('camp-firewalker-website'), 'Website'], [mm('camp-firewalker-merch'), 'Merch shop'],
      [mm('camp-firewalker-board'), 'Brand board'], [sel('camp-firewalker', '2026_08_11_CampFirewalker_Merch_Mockups_v02'), 'Merch range']] },

  { slug: 'triton-studios', name: 'Triton Studios', disc: ['brand', 'web', 'campaign'], status: null, show: true, tone: 'ink',
    summary: 'Brand, website and launch campaigns for Triton Studios.',
    body: 'A stacked logo and symbol; a website with sections for the studio, live concerts and recording; a launch campaign; and a Spirio campaign across feed, story and retargeting placements.',
    deliverables: ['Logo and symbol', 'Brand guidelines', 'Website design', 'Launch and Spirio campaigns'],
    cover: [...sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_HeroFeed_v01'), ...sel('triton-studios', '2026_07_21_Triton_Website_Homepage_v01')],
    gallery: [[sel('triton-studios', '2026_07_21_Triton_Website_Homepage_v01'), 'Website'], [sel('triton-studios', '2026_07_21_Triton_Website_Section03_v01'), 'Live concerts'],
      [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post01_v01'), 'Launch campaign'], [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_Carousel01_v01'), 'Spirio carousel'],
      [sel('triton-studios', '00_Creative Overview'), 'Campaign overview']] },

  { slug: 'taylormade-law', name: 'TaylorMade Law', disc: ['brand', 'campaign', 'web'], status: null, show: true, tone: 'plum',
    summary: 'A brand developed from a napkin sketch, then put to work across print, merch, events and the web.',
    body: 'A stacked logo, business cards, the Real Lyfe Lawyer tee, a branded mic flag, the TaylorMade for Lovers event campaign, a Mass Torts presentation and a website landing page.',
    deliverables: ['Logo, from napkin to final', 'Business cards and merch', 'Event campaigns', 'Website landing page'],
    cover: [...sel('taylormade-law', '2026_10_07_taylormadeLaw_BusinessCard_ProductPhoto_v01')],
    gallery: [[sel('taylormade-law', '2026_05_18_TaylorMade_Brand_NapkinToFlesh_v01'), 'Napkin to final'], [sel('taylormade-law', '2026_10_07_taylormadeLaw_Merch_TshirtPhoto_v01'), 'Real Lyfe Lawyer tee'],
      [sel('taylormade-law', '2025_12_05_TaylorMade_TaylorMadeForLove_SocialPost_v01'), 'TaylorMade for Lovers'], [sel('taylormade-law', '2026_10_07_Merch_MicrophoneProductPhoto_v01'), 'Mic flag'],
      [sel('taylormade-law', '2026_10_05_TaylorMade_Website_LandingPageScreenshot_v01'), 'Website']] },

  { slug: 'catawba-yaupon', name: 'Catawba Yaupon', disc: ['brand'], status: null, show: true, tone: 'aqua',
    summary: 'A rebrand for a yaupon tea maker: logo suite, illustration, colour and pattern, and packaging.',
    body: 'A final logo suite, hummingbird and yaupon-branch illustrations, a colour and pattern strategy, and labels for Black and Roasted Yaupon.',
    deliverables: ['Logo suite', 'Illustration', 'Colour and pattern system', 'Packaging labels'],
    cover: [...sel('catawba-yaupon', '2026_09_02_CatawbaYaupon_Rebrand_IllustrationBird_v01')],
    gallery: [[sel('catawba-yaupon', '2026_08_21_CatawbaYaupon_Rebrand_LogoVersions_v01'), 'Logo suite'], [sel('catawba-yaupon', '2026_09_04_CatawbaYaupon_Rebrand_IllustrationTree_v01'), 'Yaupon branch'],
      [sel('catawba-yaupon', '2026_07_06_CatawbaYaupon_Rebrand_ColorPatternStudy_v01'), 'Colour and pattern']] },

  { slug: 'whittle-watt', name: 'Whittle + Watt', disc: ['brand', 'web'], status: null, show: true, tone: 'yellow',
    summary: 'Brand, product photography and shop for a maker of cut-metal and stained-glass-style pieces.',
    body: 'A W x W mark, product photography for copper and stained dragonflies, a CNC workshop banner, an Etsy kit and a website built around “We design it. We build it.”',
    deliverables: ['Logo mark', 'Product photography', 'Etsy kit', 'Website'],
    cover: [...sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_DragonflyWall_v01')],
    gallery: [[sel('whittle-watt', '2026_10_06_WhittleAndWatt_CaseStudy_Screenshot_v01'), 'Website'], [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_DragonflyWindow_v01'), 'Stained dragonfly'],
      [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Brand_LogoMark_v01'), 'W x W mark']] },

  { slug: 'dr-stuart-lipton', name: 'Dr. Stuart Lipton', disc: ['brand', 'web', 'campaign'], status: null, show: true, tone: 'cream',
    summary: 'A logo refresh, website and ad concepts.',
    body: 'The refreshed logo and its presentation, the website’s home, hero and team pages, and feed ad concepts including the Lipton Inner Circle.',
    deliverables: ['Logo refresh', 'Website design', 'Ad concepts'],
    cover: [...sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Ads_AdConcept1Feed_v01')],
    gallery: [[sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Website_HomepageSS_v01'), 'Website'], [sel('dr-stuart-lipton', '2026_05_04_DrStuartLipton_LogoRefresh_RefreshPresentation_v01'), 'Logo refresh'],
      [sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Ads_LICAdFeed_v01'), 'Lipton Inner Circle']] },

  { slug: 'sgi', name: 'SGI', where: 'Grand Prairie, Texas', disc: ['brand', 'web'], status: 'handoff', show: true, tone: 'ink',
    summary: 'A civil engineering, land surveying and GIS firm. The refreshed identity is built around a ring-and-triangle symbol with a single orange point, drawing on the idea of a survey marker.',
    body: 'The guidelines document the logo in three versions and six colourways, the colour and type system, and the brand in use on stationery, signage and a plan-sheet title block. The website redesign was delivered as high-fidelity design files: 42 pages structured for search and answer engines, with copy and structured data ready for development.',
    deliverables: ['Logo and symbol', 'Brand guidelines', 'Website design (42 pages)', 'Copy and structured data'],
    cover: [...mm('sgi-brand-guidelines')],
    gallery: [[mm('sgi-website'), 'Website'], [mm('sgi-website-services'), 'Services page']] },

  { slug: 'packorial', name: 'Packorial', disc: ['product'], status: null, show: true, tone: 'aqua',
    summary: 'App design: sign-up, product search and an AI try-on screen, with a brand emblem.',
    body: 'Interface design for the Packorial app across its key flows.',
    deliverables: ['App interface design', 'Brand emblem'],
    cover: [...sel('packorial', '2026_10_06_Packorial_App_FindProductSS_v01')],
    gallery: [[sel('packorial', '2026_10_06_Packorial_App_SignupSS_v01'), 'Sign up'], [sel('packorial', '2026_10_06_Packorial_App_AITryonSS_v01'), 'AI try-on']] },

  { slug: 'rio-jiu-jitsu', name: 'Rio Jiu-Jitsu Lifestyle', disc: ['campaign', 'web'], status: null, show: true, tone: 'magenta',
    summary: 'Logo, website and a $25 mat-pass campaign.',
    body: 'A campaign built around a single, low-risk first step, with a matching landing page.',
    deliverables: ['Logo', 'Website landing page', '$25 mat-pass campaign'],
    cover: [...sel('rio-jiu-jitsu', '2026_10_06_RioJJ_25DollarClass_Campaign_v01')],
    gallery: [[sel('rio-jiu-jitsu', '2026_10_06_RioJJ_Website_LandingPageSS_v01'), 'Website']] },

  { slug: 'darling-reclaimed', name: 'Darling Reclaimed', disc: ['web'], status: null, show: true, tone: 'cream',
    summary: 'Website design and imagery for reclaimed-wood feature walls.',
    body: 'Bar, bedroom and living-room installations, and the salvage story behind the material.',
    deliverables: ['Website design', 'Photography direction'],
    cover: [...sel('darling-reclaimed', 'bar-feature-wall')],
    gallery: [[sel('darling-reclaimed', 'living-room-wall'), 'Living room'], [sel('darling-reclaimed', 'bed-room'), 'Bedroom'], [sel('darling-reclaimed', 'salvage'), 'The salvage']] },

  { slug: 'nonos', name: 'Nono’s', where: 'for Cliqbux', disc: ['brand'], status: null, show: true, tone: 'yellow',
    summary: 'Drink-cup branding for Nono’s.', body: '', deliverables: ['Packaging'],
    cover: [...sel('nonos', 'Nonos Drink 1')], gallery: [] },

  { slug: 'dimaco', name: 'Dimaco', disc: ['campaign'], status: null, show: true, tone: 'ink',
    summary: 'A flyer, shown as a rendering and as the outside spread.', body: '', deliverables: ['Print design'],
    cover: [...sel('dimaco', 'Flyer Rendering')], gallery: [[sel('dimaco', 'New Dimaco Flier-Outside'), 'Outside spread']] },

  { slug: 'ssr-apparel', name: 'SSR Apparel', where: 'Monk Holdings', disc: ['campaign'], status: null, show: true, tone: 'plum',
    summary: 'Apparel marketing: a varsity poster, an ad, a 2026 brochure cover and flyers.', body: '', deliverables: ['Print and ads'],
    cover: [...sel('ssr-apparel', 'Monk Varsity Apparel')], gallery: [[sel('ssr-apparel', '2026 Brochure Cover'), 'Brochure cover'], [sel('ssr-apparel', 'flyer one'), 'Flyer']] },

  /* ---- held: pitches, concepts and unclear relationships (not on the site) ---- */
  { slug: 'lisa-kalmin', name: 'Lisa Kalmin', disc: ['brand', 'web'], status: 'concept', show: false, note: 'Concept; Marshman notes ask for client clearance.' },
  { slug: 'enzos', name: 'Enzo’s Deli & Imports', disc: ['web', 'product'], status: 'concept', show: false, note: 'Concept only: not live, takes no orders.' },
  { slug: 'sara-kolata', name: 'Sara Kolata', disc: ['brand', 'web'], status: 'concept', show: false, note: 'Pitch work for a prospect; confidential strategy never shown.' },
  { slug: 'society-sacred-honor', name: 'The Society of Our Sacred Honor', disc: ['brand', 'web'], status: 'concept', show: false, note: 'Proposal and first look.' },
  { slug: 'corner-wines', name: 'Corner Wines', disc: ['brand'], status: 'concept', show: false, note: 'Proposal.' },
  { slug: 'myogen', name: 'MyoGen Bioscience', disc: ['brand'], status: null, show: false, note: 'Logo system; relationship unconfirmed.' },
  { slug: 'cliqbux-analyzer', name: 'Cliqbux Restaurant Analyzer', disc: ['product'], status: null, show: false, note: 'Product prototype; confirm it can be shown.' },
  { slug: 'palmers-lodge', name: 'Palmers Lodge', disc: ['web'], status: null, show: false, note: 'Website design PDF only; needs images.' }
];

export const shownStudio = () => studio.filter((p) => p.show);
export const DISCIPLINES = [['brand', 'Brand'], ['web', 'Web'], ['campaign', 'Campaign'], ['product', 'Product']];
