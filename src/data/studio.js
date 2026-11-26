/* ==========================================================================
   MORE FROM THE STUDIO — work beyond the case studies
   Sources: the Drive "Portfolio Selects 2026-11" index (the owner's own
   picks, with its per-file HERO/Support tier and captions), the Marshman
   Design portfolio write-ups, and each client's live site, read 2026-11-24.
   Descriptions say only what the work shows; no results are claimed.

   show: true  → on /work.   show: false → held until the owner clears it
   (pitches and concepts for prospects, unclear relationships). Flip a project
   to true once the client is happy to be shown.
   status: 'live' | 'handoff' | 'concept' | null (null = no badge).
   url:    only when the site is actually reachable. A dead or password-walled
           store gets no link, however finished the work is.
   Images: preference lists; the first file present in src/media wins.
   `sel(slug, file)` resolves src/media/selects/<slug>/<file>.{jpg,png,webp}.
   Run content-import/collect-selects.sh to populate it from the shared drive.
   Multi-page PDFs land as <base>-p1, -p2, ... so a design document can be
   shown page by page.
   `vid(slug, file)` is the same for video: <file>.mp4 with a <file>-poster
   still. /work renders these preload="none", so they cost nothing until
   someone presses play.
   ========================================================================== */
const sel = (slug, base) => [`selects/${slug}/${base}.jpg`, `selects/${slug}/${base}.png`, `selects/${slug}/${base}.webp`];
const mm = (file) => [`studio/marshman/${file}.webp`];
export const vid = (slug, base) => ({
  src: `selects/${slug}/${base}.mp4`,
  poster: [`selects/${slug}/${base}-poster.webp`, `selects/${slug}/${base}-poster.jpg`]
});

export const studio = [
  { slug: 'root-pilates', name: 'Root Pilates Company', where: 'Ridgefield, Connecticut', disc: ['web', 'brand'], status: 'concept', show: true, tone: 'plum',
    // No public link: the only build is a vercel.app preview, which is ours, not theirs.
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
    cover: [...sel('camp-firewalker', '2026_10_07_CampFirewalker_Merch_WaterBottlePhoto_v01'), ...mm('camp-firewalker-brand'), 'studio/camp-firewalker/cf-mark.webp'],
    gallery: [[sel('camp-firewalker', '2026_08_11_CampFirewalker_Brand_LogoBefore_v01'), 'Before'], [sel('camp-firewalker', '2026_08_07_CampFirewalker_Brand_LogoPrimaryPNG_v01'), 'After'],
      [sel('camp-firewalker', '2026_08_11_CampFirewalker_Brand_PhoenixCrest_v01'), 'Phoenix crest'], [sel('camp-firewalker', '2026_08_11_CampFirewalker_Brand_LogoPatch_v01'), 'Patch'],
      [sel('camp-firewalker', '2026_08_31_CampFirewalker_WebsiteConcept_OGImage_v01'), 'Website'],
      [sel('camp-firewalker', '2026_08_11_CampFirewalker_Merch_Mockups_v02'), 'Merch range'],
      [sel('camp-firewalker', '2026-10_07_CampFirewalker_Merch_WaterbottleProductPphoto-v02'), 'Water bottle']] },

  { slug: 'triton-studios', name: 'Triton Studios', where: 'Fort Lauderdale, Florida', disc: ['brand', 'web', 'campaign'], status: 'live', url: 'https://tritonstudios.com/', show: true, tone: 'ink',
    summary: 'A performance studio built so artists are seen, heard and remembered: brand, website and two paid campaigns aimed at the people who decide where artists record and perform.',
    body: 'The identity is a trident that reads as a microphone, two notes and a rising arrow, in navy and electric indigo with Syne and DM Sans, documented in a twelve-page guidelines book down to motion rules for lower thirds and a logo sting. The website runs through the studio, live concerts and recording. On top of it sit a five-post launch campaign and the Spirio campaign for South Florida classical musicians, in feed, story, carousel and retargeting sizes, with a Czárdás performance film.',
    deliverables: ['Logo, symbol and lockups', 'Brand guidelines and motion rules', 'Website design', 'Launch campaign', 'Spirio campaign and performance film'],
    cover: [...sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_HeroFeed_v01'), ...sel('triton-studios', '2026_07_21_Triton_Website_Homepage_v01')],
    gallery: [[sel('triton-studios', '2026_03_10_Triton_Brand_LogoStacked_v01'), 'Stacked logo'], [sel('triton-studios', '2026_03_10_Triton_Brand_LogoSymbol_v01'), 'Trident symbol'],
      [sel('triton-studios', '2026_06_29_Triton_Brand_BrandGuidelines_v01-p1'), 'Brand guidelines, cover'], [sel('triton-studios', '2026_06_29_Triton_Brand_BrandGuidelines_v01-p4'), 'Guidelines, colour'],
      [sel('triton-studios', '2026_06_29_Triton_Brand_BrandGuidelines_v01-p7'), 'Guidelines, type'], [sel('triton-studios', '2026_06_29_Triton_Brand_BrandGuidelines_v01-p11'), 'Guidelines, motion'],
      [sel('triton-studios', '2026_07_21_Triton_Website_Homepage_v01'), 'Website'], [sel('triton-studios', '2026_07_21_Triton_Website_Section02_v01'), 'The studio'],
      [sel('triton-studios', '2026_07_21_Triton_Website_Section03_v01'), 'Live concerts'], [sel('triton-studios', '2026_07_21_Triton_Website_Section04_v01'), 'Recording'],
      [sel('triton-studios', '2025_12_17_Triton_Website_SiteDesign_v01'), 'Full site design'],
      [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post01_v01'), 'Launch: just launched'], [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post02_v01'), 'Launch post 02'],
      [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post03_v01'), 'Launch post 03'], [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post04_v01'), 'Launch post 04'],
      [sel('triton-studios', '2026_07_21_Triton_LaunchCampaign_Post05_v01'), 'Launch: now live'],
      [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_HeroFeed_v01'), 'Spirio hero, feed'], [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_HeroStory_v01'), 'Spirio hero, story'],
      [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_Carousel01_v01'), 'Spirio carousel 1'], [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_Carousel03_v01'), 'Spirio carousel 2'],
      [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_Carousel04_v01'), 'Spirio carousel 3'], [sel('triton-studios', '2026_08_07_Triton_SpirioCampaign_RetargetingSquare_v01'), 'Retargeting'],
      [sel('triton-studios', '00_Creative Overview'), 'Campaign overview']],
    videos: [[vid('triton-studios', '2026_08_07_Triton_SpirioCampaign_CzardasVideoFeed_v01'), 'Spirio campaign film'],
      [vid('triton-studios', '2026_07_22_Triton_BrandVideo_SegmentVideo_v01'), 'Brand film']] },

  { slug: 'taylormade-law', name: 'TaylorMade Law', where: 'Dallas, Texas', disc: ['brand', 'campaign', 'web'], status: 'live', url: 'https://taylormadelaw.com/', show: true, tone: 'plum',
    summary: 'A brand developed from a napkin sketch into an attorney network, a media brand and an events programme, then put to work across print, merch, email and the web.',
    body: 'The identity runs on a “custom fit” idea: a bowtie mark drawn with measuring-tape lines, a five-colour palette and Montserrat, with a structure that lets the referral network, the media brand and the services directory each sit under one parent. The live site turns that into a three-step “Get Fitted” intake that matches a case to an attorney. Around it: business cards, the Real Lyfe Lawyer tee, a branded mic flag for TaylorMade Conversations, the TaylorMade for Lovers event campaign and the Mass Torts Unlocked presentation and dinner poster.',
    deliverables: ['Logo, from napkin to final', 'Brand architecture for the sub-brands', 'Website and Get Fitted intake flow', 'Business cards and merch', 'Event campaigns and presentations'],
    cover: [...sel('taylormade-law', '2026_10_07_taylormadeLaw_BusinessCard_ProductPhoto_v01')],
    gallery: [[sel('taylormade-law', '2026_05_18_TaylorMade_Brand_NapkinToFlesh_v01'), 'Napkin to final'], [sel('taylormade-law', '2025_06_17_TaylorMade_Brand_LogoStackedCrushed_v01'), 'Primary logo'],
      [sel('taylormade-law', '2026_10_05_TaylorMade_Website_LandingPageScreenshot_v01'), 'Website'],
      [sel('taylormade-law', '2026_10_05_TaylorMade_BusinessCards_CardProductPhoto_v01'), 'Business cards'],
      [sel('taylormade-law', '2026_10_07_taylormadeLaw_Merch_TshirtPhoto_v01'), 'Real Lyfe Lawyer tee'], [sel('taylormade-law', '2025_08_21_TaylorMade_Merch_ShirtMockup_v02'), 'Tee mockup'],
      [sel('taylormade-law', '2026_10_07_Merch_MicrophoneProductPhoto_v01'), 'Mic flag'],
      [sel('taylormade-law', '2025_12_05_TaylorMade_TaylorMadeForLove_SocialPost_v01'), 'TaylorMade for Lovers'], [sel('taylormade-law', '2025_10_21_TaylorMade_TaylorMadeForLove_Banner_v01'), 'Event banner'],
      [sel('taylormade-law', '2026_09_10_TaylorMade_TaylorMadeForLove_Postcard5x7Front_v01'), 'Event postcard'],
      [sel('taylormade-law', '2025_08_19_TaylorMade_Events_TradeshowPresentationPNG_v01'), 'Mass Torts Unlocked'], [sel('taylormade-law', '2025_08_20_TaylorMade_MassTorts_Poster_v01-p1'), 'Mass Torts poster']],
    videos: [[vid('taylormade-law', '2025_12_03_TaylorMade_Website_ScrollThroughVideo_v01'), 'Website walkthrough']] },

  { slug: 'catawba-yaupon', name: 'Catawba Yaupon', where: 'Kerrville, Texas', disc: ['brand'], status: 'live', url: 'https://catawbayaupon.com/', show: true, tone: 'aqua',
    summary: 'A rebrand and full packaging system for a yaupon tea crafted by a Catawba mother and daughter, built to hold its own on a retail shelf.',
    body: 'The system turns on one medallion that carries the whole story in a single seal: a Catawba woman facing the rising sun, the Catawba River and a yaupon garland. Around it sit a badge, a logotype and a tagline, five earthy spot colours, and Cinzel paired with Montserrat. On the packaging the story moved from the back panel to the front, a pattern drawn from Catawba pottery became the signature, and each flavour took its own colour inside one family.',
    deliverables: ['Logo suite and medallion', 'Brand guidelines', 'Illustration', 'Colour and pattern system', 'Packaging for 6 SKUs'],
    cover: [...sel('catawba-yaupon', '2026_09_02_CatawbaYaupon_Rebrand_IllustrationBird_v01')],
    gallery: [[sel('catawba-yaupon', '2026_08_21_CatawbaYaupon_Rebrand_LogoVersions_v01'), 'Logo suite'],
      [sel('catawba-yaupon', '2026_09_04_CatawbaYaupon_Rebrand_IllustrationTree_v01'), 'Yaupon branch'],
      [sel('catawba-yaupon', '2026_07_06_CatawbaYaupon_Rebrand_ColorPatternStudy_v01'), 'Colour and pattern'],
      [sel('catawba-yaupon', '2026_09_11_CatawbaYaupon_Packaging_LabelBlack_v01-p1'), 'Black Yaupon, front'],
      [sel('catawba-yaupon', '2026_09_11_CatawbaYaupon_Packaging_LabelBlack_v01-p2'), 'Black Yaupon, back'],
      [sel('catawba-yaupon', '2026_09_11_CatawbaYaupon_Packaging_LabelBlack_v01-p3'), 'Black Yaupon, dieline'],
      [sel('catawba-yaupon', '2026_09_04_CatawbaYaupon_Packaging_LabelRoasted_v01-p1'), 'Roasted Yaupon, front'],
      [sel('catawba-yaupon', '2026_09_04_CatawbaYaupon_Packaging_LabelRoasted_v01-p2'), 'Roasted Yaupon, back'],
      [sel('catawba-yaupon', '2026_09_04_CatawbaYaupon_Packaging_LabelRoasted_v01-p3'), 'Roasted Yaupon, dieline']] },

  { slug: 'sgi', name: 'Salcedo Group', where: 'Grand Prairie, Texas', disc: ['brand', 'web'], status: 'handoff', url: 'https://salcedogroupinc.com/', show: true, tone: 'ink',
    summary: 'A family-owned civil engineering, land surveying and GIS firm working in the Dallas-Fort Worth metroplex since 1983. The refreshed identity is built around a ring-and-triangle symbol with a single orange point, drawing on the idea of a survey marker.',
    body: 'The guidelines document the logo in three versions and six colourways, the colour and type system, and the brand in use on stationery, signage and a plan-sheet title block. The website redesign was delivered as high-fidelity design files: 42 pages structured for search and answer engines, with copy and structured data ready for development. The link goes to the firm’s current site, which is the one the redesign replaces.',
    deliverables: ['Logo and symbol', 'Brand guidelines', 'Website design (42 pages)', 'Copy and structured data'],
    cover: [...mm('sgi-brand-guidelines')],
    gallery: [[mm('sgi-website'), 'Website'], [mm('sgi-website-services'), 'Services page']] },

  { slug: 'whittle-watt', name: 'Whittle + Watt', where: 'Dallas-Fort Worth', disc: ['brand', 'web'], status: 'live', url: 'https://whittleandwatt.com/', show: true, tone: 'yellow',
    summary: 'Brand, product strategy, listing creative and a website for a maker shop running a CNC router, laser engraver, 3D printer and dye-sublimation printer.',
    body: 'The shop could make almost anything, which was the problem. Alongside the W x W mark and the website, the work included an analysis of more than twenty products on cost, margin, demand and the right sales channel for each, so the shop could choose what to make on something other than instinct. Then branded Etsy listing images, edited product photography and production artwork.',
    deliverables: ['Logo mark', 'Product and sales channel analysis', 'Etsy listing kit', 'Product photography', 'Website'],
    cover: [...sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_DragonflyWall_v01')],
    gallery: [[sel('whittle-watt', '2026_10_06_WhittleAndWatt_CaseStudy_Screenshot_v01'), 'Website'],
      [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Brand_LogoMark_v01'), 'W x W mark'],
      [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_DragonflyWindow_v01'), 'Stained dragonfly'],
      [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_DragonflyGarden_v01'), 'Garden dragonfly'],
      [sel('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_CNCModerna_v01'), 'CNC workshop banner']],
    videos: [[vid('whittle-watt', '2026_08_21_WhittleAndWatt_Etsy_Video_v01'), 'Shop walkthrough']] },

  { slug: 'dr-stuart-lipton', name: 'Dr. Stuart Lipton', where: 'Lewisville and Dallas, Texas', disc: ['brand', 'web', 'campaign'], status: 'live', url: 'https://go.drlipton.com/', show: true, tone: 'cream',
    // No performance figures: none are confirmed in writing. See CLAUDE.md §Non-negotiables 3.
    summary: 'A logo refresh, a patient-facing website and an ad campaign for a board-certified plastic surgeon with four service lines and no structure tying them to his name.',
    body: 'The logo was refreshed and delivered in transparent, reversed and beige versions. The website leads with the surgeon rather than the procedure list, and runs through the practice, the team and the patient coordinator who stays with you a year on. The ads are built around “You should still feel like yourself”, stressing natural-looking refinement and board-certified experience, and closing on “Request a private consultation”, in feed and story sizes plus a Lipton Inner Circle ad.',
    deliverables: ['Logo refresh in three versions', 'Website design', 'Ad concepts for feed and story', 'Email and campaign creative'],
    cover: [...sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Ads_AdConcept1Feed_v01')],
    gallery: [[sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Website_HomepageSS_v01'), 'Website'],
      [sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Website_Screen5SS_v01'), 'Website hero'],
      [sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Website_Screen3SS_v01'), 'The team'],
      [sel('dr-stuart-lipton', '2026_05_04_DrStuartLipton_LogoRefresh_RefreshPresentation_v01'), 'Logo refresh'],
      [sel('dr-stuart-lipton', '2026_05_05_DrStuartLipton_LogoRefresh_LogoBeige_v01'), 'Logo on beige'],
      [sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Ads_AdConcept2Feed_v01'), 'Ad concept 2'],
      [sel('dr-stuart-lipton', '2026_05_12_DrStuartLipton_Ads_LICAdFeed_v01'), 'Lipton Inner Circle']] },

  { slug: 'lisa-kalmin', name: 'Lisa Kalmin', where: 'Money-mindset coach and speaker', disc: ['web', 'brand', 'campaign'], status: 'live', url: 'https://lisakalmin.com/', show: true, tone: 'plum',
    summary: 'A website, brand and capture path for a breakthrough coach of thirty-nine years, built on one line: you are always one conversation away from a breakthrough.',
    body: 'The site’s idea is a threshold. A dark hallway of doors, a “Find your door” call to action, and a route for each way of working with her: group coaching, one to one, and keynotes for programmers and bureaus. A free money-mindset quiz sits beside it as the low-commitment first step, in deep green and cream with a rose accent. The logo directions pair an interlocking LK monogram with a bold wordmark and the line “Breakthrough Coach”.',
    deliverables: ['Website design and build', 'Logo directions', 'Money-mindset quiz', 'Email and campaign support'],
    cover: ['studio/lisa-kalmin/lk-hero.webp', ...mm('lisa-kalmin-website')],
    gallery: [['studio/lisa-kalmin/lk-doors.webp', 'Pick a door'], [mm('lisa-kalmin-logos'), 'Logo directions'], [mm('lisa-kalmin-brand'), 'LK monogram']] },

  { slug: 'fuller-classes', name: 'Fuller Classes', where: 'For boutique fitness studios', disc: ['web', 'product', 'brand'], status: 'live', url: 'https://fullerclasses.com/', show: true, tone: 'aqua',
    summary: 'A four-tool product suite for boutique fitness studios, built on one argument: most studios do not have a growth problem, they have a leak.',
    body: 'The site makes the case before it sells anything. New members arrive about as fast as old ones drift out, so the work starts with attendance rather than acquisition. Four tools sit under it, each with its own page, proof and price: a booking app that reserves a member’s usual week the moment the schedule opens, a retention brief that flags members slipping before they cancel, a nutrition line studios price themselves, and marketing. The entry point is a free studio snapshot.',
    deliverables: ['Brand and positioning', 'Website design and build', 'Four product pages', 'Capture path: free studio snapshot'],
    cover: [], gallery: [] },

  { slug: 'leviathan-ai', name: 'Leviathan AI Systems', where: 'AI guide for law firms', disc: ['web', 'brand'], status: 'live', url: 'https://www.leviathanaisystems.com/', show: true, tone: 'ink',
    summary: 'A directory and concierge connecting law firms to vetted AI tools, positioned on the promise that a firm chooses its own stack with no lock-in.',
    body: 'The site is built to make an unfamiliar category legible to a cautious buyer. Partners are presented by what they do rather than by what they are, one card each for intake and automation, litigation intelligence, client reception and the private attorney network, with a three-step path from browsing the guide to deploying with support. TaylorMade Law sits in the network as one of the partners.',
    deliverables: ['Brand and positioning', 'Website design and build', 'Partner directory structure', 'Demo capture path'],
    cover: [], gallery: [] },

  { slug: 'mercurian-studios', name: 'Mercurian Studios', where: 'Denver, Colorado', disc: ['web', 'brand'], status: 'live', url: 'https://www.mercurianstudios.com/', show: true, tone: 'ink',
    summary: 'A portfolio site for a producer, writer and director who ran aerospace programmes for twenty years before he ran sets.',
    body: 'The site is organised around the thing that makes him unusual rather than around a reel. “Stories, engineered.” leads, the credentials run as a ticker, and the selected work is framed as three projects and the constraint each one had. Triton Studios appears in it as ongoing brand and live-capture work, which is also a Kija client.',
    deliverables: ['Brand and positioning', 'Website design and build', 'Work presentation structure'],
    cover: [], gallery: [] },

  { slug: 'latino-arts', name: 'Latino Arts Project', where: 'Irving, Texas', disc: ['web', 'brand'], status: 'live', url: 'https://www.latinoartsproject.com/', show: true, tone: 'magenta',
    summary: 'A museum and arts nonprofit presenting exhibits, events and art consulting, with the calendar as the front door.',
    body: 'Upcoming events and exhibits lead the site, because for a museum the next date is the offer. Beneath them sit the store, art consulting, exhibit planning and news, with visitor quotes carrying the emotional register the work is actually about. There is a case study for this one too.',
    deliverables: ['Website design and build', 'Events and exhibits structure', 'Store and consulting pages'],
    cover: [], gallery: [] },

  { slug: 'dash-for-the-beads', name: 'Dash for the Beads', where: 'Oak Cliff, Dallas', disc: ['web', 'brand', 'campaign'], status: 'live', url: 'https://www.dashforthebeads.org/', show: true, tone: 'yellow',
    summary: 'A Mardi Gras 5K, one-mile fun run and family festival on Davis Street, run back to back with the Go Oak Cliff Mardi Gras Parade. Every dollar left over becomes grants for Oak Cliff kids.',
    body: 'The site has two audiences and gives each a front door: runners who need the date, the route and the start times, and sponsors who need to know how many people will see their logo. Race day sits above the fold with both start times, the three ways to take part run as cards, and the sponsorship case is made with the print deadline stated plainly rather than buried in a PDF.',
    deliverables: ['Website design and build', 'Race and route pages', 'Sponsorship path', 'Race update capture'],
    cover: [], gallery: [] },

  { slug: 'packorial', name: 'Packorial', disc: ['product', 'brand'], status: null, show: true, tone: 'aqua',
    summary: 'App prototype and brand for a travel packing service, renamed from Pack Perfect, that helps travellers build destination-specific wardrobes.',
    body: 'Interface design across the app’s key flows: signing up, searching products, and an AI try-on screen. The brand is a suitcase emblem with a bold P, a two-typeface system and a gold, midnight and black palette, written through four rounds of guidelines with rules for the app, merchandise and business cards.',
    deliverables: ['App prototype screens', 'Brand emblem and guidelines', 'Full rename'],
    cover: [...sel('packorial', '2026_10_06_Packorial_App_FindProductSS_v01')],
    gallery: [[sel('packorial', '2026_10_06_Packorial_App_SignupSS_v01'), 'Sign up'],
      [sel('packorial', '2026_10_06_Packorial_App_AITryonSS_v01'), 'AI try-on'],
      [['selects/packorial/2025_11_04_Packorial_Brand_Emblem_v01.svg'], 'Brand emblem']] },

  { slug: 'rio-jiu-jitsu', name: 'Rio Jiu-Jitsu Lifestyle', where: 'Dallas, Texas', disc: ['campaign', 'web'], status: 'live', url: 'https://riobjj.com/mat-pass', show: true, tone: 'magenta',
    summary: 'A Meta and Google campaign built around one low-risk first step, two classes for $25, with a landing page per audience instead of a homepage for everyone.',
    body: 'The academy was already paying for search clicks that landed on the homepage. The Mat Pass campaign gives each of three buyers their own answer: adults worried about being out of shape, parents worried about safety, and women worried about being the only one in the room. Twelve ad creatives across Meta feed, carousel, video and Google display point at matched pages, with retargeting across six audiences and a weekly scoreboard of four numbers.',
    deliverables: ['Logo', 'Four landing pages', '12 Meta and Google ad creatives', 'Retargeting across 6 audiences', 'Weekly four-number scoreboard'],
    cover: [...sel('rio-jiu-jitsu', '2026_10_06_RioJJ_25DollarClass_Campaign_v01')],
    gallery: [[sel('rio-jiu-jitsu', '2026_10_06_RioJJ_Website_LandingPageSS_v01'), 'Mat Pass landing page'],
      [sel('rio-jiu-jitsu', '2026_08_24_RioJJ_Brand_Logo_v01'), 'Logo'],
      [sel('rio-jiu-jitsu', '2026_10_06_RioJJ_25DollarClass_Campaign_v01'), '$25 mat pass creative']] },

  { slug: 'darling-reclaimed', name: 'Darling Reclaimed', disc: ['web'], status: null, show: true, tone: 'cream',
    // darlingreclaimed.com resolves to Shopify but answers 409: password-walled
    // or unpublished as of 2026-11-24. No link until it opens.
    summary: 'Website design and imagery for reclaimed-wood feature walls.',
    body: 'Bar, bedroom and living-room installations, and the salvage story behind the material. The store is not publicly reachable yet, so there is no link.',
    deliverables: ['Website design', 'Photography direction'],
    cover: [...sel('darling-reclaimed', 'bar-feature-wall')],
    gallery: [[sel('darling-reclaimed', 'living-room-wall'), 'Living room'], [sel('darling-reclaimed', 'bed-room'), 'Bedroom'],
      [sel('darling-reclaimed', 'salvage'), 'The salvage'], [sel('darling-reclaimed', 'Darling Reclaimed'), 'Website design']] },

  { slug: 'nonos', name: 'Nono’s', where: 'for Cliqbux', disc: ['brand'], status: null, show: true, tone: 'yellow',
    summary: 'Drink-cup branding for Nono’s.',
    body: 'Not live. The design is shown as it was delivered.',
    deliverables: ['Packaging'],
    cover: [...sel('nonos', 'Nonos Drink 1')],
    gallery: [[sel('nonos', 'Nonos Drink 1'), 'Drink cup']] },

  { slug: 'dimaco', name: 'Dimaco', disc: ['campaign'], status: null, show: true, tone: 'ink',
    summary: 'Print work: a flyer, shown as a rendering and as the outside spread.',
    body: 'Design for print, shown as delivered.',
    deliverables: ['Print design'],
    cover: [...sel('dimaco', 'Flyer Rendering')],
    gallery: [[sel('dimaco', 'Flyer Rendering'), 'Flyer rendering'], [sel('dimaco', 'New Dimaco Flier-Outside'), 'Outside spread']] },

  { slug: 'kink', name: 'Kink', disc: ['brand', 'campaign'], status: null, show: true, tone: 'magenta',
    // Cleared for display by the owner on 2026-11-24. The portfolio index tags
    // these files as mature content; collect-selects.ps1 still skips the
    // client, collect-selects.sh does not. See CLAUDE.md §Non-negotiables 12.
    mature: true,
    summary: 'Tradeshow graphics and a conversation-card deck for an intimacy brand.',
    body: 'An 8x8 backdrop and a table banner built to read across a busy hall, and a set of intimacy cards designed as prompts rather than instructions. A quiz was built alongside them; its assets are not in the portfolio folder.',
    deliverables: ['8x8 tradeshow backdrop', 'Table banner', 'Intimacy card deck', 'Quiz'],
    cover: [...sel('kink', '8x8Backdrop_Kink_v01')],
    gallery: [[sel('kink', 'TableBanner_Kink_v01'), 'Table banner'],
      [sel('kink', 'IntimacyCards_Kink_v01-p1'), 'Intimacy cards 1'], [sel('kink', 'IntimacyCards_Kink_v01-p2'), 'Intimacy cards 2'],
      [sel('kink', 'IntimacyCards_Kink_v01-p3'), 'Intimacy cards 3']] },

  { slug: 'society-sacred-honor', name: 'The Society of Our Sacred Honor', where: 'Founding chapter, Greensboro, NC', disc: ['web', 'brand'], status: 'concept', show: true, tone: 'ink',
    summary: 'A non-partisan society bringing Americans of every background and opinion together for productive discussion: to remember what shaped this country, rethink where it is, and renew what comes next.',
    body: 'A website built around the society’s three words: a next-meeting ticket on the front page, a plain-spoken FAQ (“Is it political? No. We don’t take sides. We set the table.”), the four commitments every member holds, a map of the founding and planned chapters, and a pledge.',
    deliverables: ['Website design', 'Messaging and FAQ', 'Chapter map', 'Pledge and membership flow'],
    cover: ['studio/society/society-hero.webp'],
    gallery: [['studio/society/society-faq.webp', 'Who is this? Is it political?'], ['studio/society/society-pillars.webp', 'Remember, rethink, renew'], ['studio/society/society-chapters.webp', 'One name. Any city.']] },

  { slug: 'enzos', name: 'Enzo’s Deli & Imports', where: 'Plano, Texas', disc: ['web', 'product'], status: 'concept', show: true, tone: 'ink',
    summary: 'An Italian deli and imports shop. This concept explores a scroll-driven menu site with an order drawer for pickup or delivery.',
    body: 'It is a design concept only: it isn’t live, and it doesn’t take orders or payments.',
    deliverables: ['Responsive menu site concept', 'Order flow: cart, pickup or delivery', 'Simpler landing-page alternative'],
    cover: ['studio/enzos/enzos-hero.webp', ...mm('enzos-concept')],
    gallery: [['studio/enzos/enzos-menu.webp', 'The menu as a book'], ['studio/enzos/enzos-hoagie.webp', 'Ordering a hoagie']] },

  { slug: 'palmers-lodge', name: 'Palmers Lodge', disc: ['web'], status: null, show: true, tone: 'cream',
    summary: 'A sixteen-page desktop website design for Palmers Lodge.',
    body: 'Delivered as a design document rather than a build. The pages below are that document.',
    deliverables: ['Website design, 16 pages'],
    cover: [...sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p1')],
    gallery: [[sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p1'), 'Home'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p2'), 'Page 2'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p3'), 'Page 3'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p4'), 'Page 4'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p5'), 'Page 5'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p6'), 'Page 6'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p7'), 'Page 7'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p8'), 'Page 8'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p9'), 'Page 9'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p10'), 'Page 10'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p11'), 'Page 11'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p12'), 'Page 12'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p13'), 'Page 13'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p14'), 'Page 14'], [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p15'), 'Page 15'],
      [sel('palmers-lodge', 'Palmers_Lodge_-_Website_Design_Desktop-p16'), 'Page 16']] },

  /* ---- held: pitches and unclear relationships (not on the site) ---- */
  { slug: 'sara-kolata', name: 'Sara Kolata', disc: ['brand', 'web'], status: 'concept', show: false, note: 'Still in pitch phase (owner, 2026-11-17). Confidential strategy never shown.' },
  { slug: 'corner-wines', name: 'Corner Wines', disc: ['brand'], status: 'concept', show: false, note: 'Proposal page, not a website.' },
  { slug: 'myogen', name: 'MyoGen Bioscience', disc: ['brand'], status: null, show: false, note: 'Logo system only; no website.' },
  { slug: 'cliqbux-analyzer', name: 'Cliqbux Restaurant Analyzer', disc: ['product'], status: null, show: false, note: 'An app rather than a website; confirm before showing.' }
  /* SSR Apparel (Monk Holdings) was removed from the site on 2026-11-24 at the
     owner's request. Its assets are still in the shared drive; collect-selects
     skips the folder. */
];

// display order: strongest visuals first
const ORDER = ['triton-studios', 'taylormade-law', 'catawba-yaupon', 'lisa-kalmin', 'root-pilates', 'society-sacred-honor', 'enzos',
  'camp-firewalker', 'whittle-watt', 'dr-stuart-lipton', 'fuller-classes', 'rio-jiu-jitsu', 'sgi', 'leviathan-ai', 'dash-for-the-beads',
  'latino-arts', 'mercurian-studios', 'packorial', 'palmers-lodge', 'darling-reclaimed', 'kink', 'nonos', 'dimaco'];
const rank = (p) => { const i = ORDER.indexOf(p.slug); return i < 0 ? 99 : i; };
export const shownStudio = () => studio.filter((p) => p.show).sort((a, b) => rank(a) - rank(b));
export const DISCIPLINES = [['brand', 'Brand'], ['web', 'Web'], ['campaign', 'Campaign'], ['product', 'Product']];
