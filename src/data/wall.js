/* ==========================================================================
   THE PROOF WALL — content from kijacreative.com (pulled 2026-11-17)
   Extra pieces for each live project, on top of the metrics and headline the
   wall already builds from cases.js. Palette hexes are the CLIENTS' colours,
   shown as content; they are not Kija tokens. Names are the live site's
   own; where it gives none, the hex is shown instead.
   `media` lists the live site's images for the project (logo: true = shown
   whole, never cropped); each one appears on
   the wall and the case page only once the file is in src/media/wp-uploads.
   ========================================================================== */
export const wall = {
  'oak-cliff-pilates': {
    pieces: [
      { kind: 'tagline', text: 'Pilates Reimagined, Energy Elevated.' },
      { kind: 'voice', label: 'Signature phrase', text: 'Are You Down with OCP?', note: 'A question that became a community password.' },
      { kind: 'place', name: 'Bishop Arts', label: 'Original studio · est. 2020', line: 'Where it started.' },
      { kind: 'place', name: 'Uptown', label: 'Expansion 01 · est. 2022', line: 'Strong before the inbox.' },
      { kind: 'place', name: 'Lower Greenville', label: 'Expansion 02 · est. 2024', line: 'Slow morning, strong week.' },
      { kind: 'voice', label: 'Brand promise', text: 'A studio that feels like the neighborhood you live in.' }
    ],
    /* The flagship. Ten years of work, grouped by discipline so the gallery
       reads in order: brand, then the studios themselves, then the website and
       app, then what fills the classes (email, digital, promos, print), then
       merch and the room. Paths with no prefix are live-site wp-uploads;
       `selects/` comes from the Portfolio Selects folder via
       content-import/collect-selects.sh. */
    media: [
      // Brand
      { src: '2026/06/OCP-Logo-Gold_cirlce.png', alt: 'Oak Cliff Pilates logo', caption: 'Mark', logo: true },
      { src: 'selects/oak-cliff-pilates/2024_12_01_OCP_Brand_LogoUptown_v01.webp', alt: 'Oak Cliff Pilates Uptown location logo', caption: 'Uptown lockup', logo: true },
      { src: 'selects/oak-cliff-pilates/2025_08_28_OCP_Brand_LogoLowerGreenville_v01.webp', alt: 'Oak Cliff Pilates Lower Greenville location logo', caption: 'Lower Greenville lockup', logo: true },
      { src: 'selects/oak-cliff-pilates/book-club-1color-gold.webp', alt: 'Oak Cliff Pilates Book Club mark in one colour gold', caption: 'Book Club mark', logo: true },
      { src: '2026/02/OCP-Case-Study-Wallpaper-scaled.webp', alt: 'Oak Cliff Pilates brand wallpaper', caption: 'Brand world' },

      // The studios
      { src: 'selects/oak-cliff-pilates/OCP Bishop Team.webp', alt: 'The Oak Cliff Pilates team outside the Bishop Arts storefront', caption: 'Bishop Arts, the team' },
      { src: 'selects/oak-cliff-pilates/OCP Bishop Interior.webp', alt: 'Inside the Bishop Arts studio', caption: 'Bishop Arts, inside' },
      { src: '2026/06/OCP-Uptown-scaled.webp', alt: 'Oak Cliff Pilates Uptown studio signage', caption: 'Uptown' },
      { src: '2026/06/LowerGreenville-scaled.webp', alt: 'Oak Cliff Pilates Lower Greenville studio', caption: 'Lower Greenville' },
      { src: 'selects/oak-cliff-pilates/OCP Uptown Sign.webp', alt: 'Uptown window graphic in place', caption: 'Uptown window' },
      { src: 'selects/oak-cliff-pilates/OCP Lower Greenville - Sign.webp', alt: 'Lower Greenville storefront signage', caption: 'Lower Greenville sign' },
      { src: 'selects/oak-cliff-pilates/2025_05_13_OCP_Uptown_WindowGraphics_v01.webp', alt: 'Uptown window graphics artwork', caption: 'Window graphics' },
      { src: 'selects/oak-cliff-pilates/2025_09_29_OCP_LowerGreenville_AFrame_v01.webp', alt: 'Lower Greenville A-frame pavement sign', caption: 'A-frame' },

      // Website and app
      { src: 'selects/oak-cliff-pilates/2026_10_06_OCP_Website_LocationsScreenshot_v01.webp', alt: 'The locations page on the Oak Cliff Pilates website', caption: 'Website, locations' },
      { src: 'selects/oak-cliff-pilates/2025_10_15_OCP_App_LoginBackground_v01.webp', alt: 'Oak Cliff Pilates app login screen background', caption: 'App login' },

      // Email and digital
      { src: 'selects/oak-cliff-pilates/Email Banner.webp', alt: 'Oak Cliff Pilates email banner', caption: 'Email banner' },
      { src: 'selects/oak-cliff-pilates/OCP 1200x1200.webp', alt: 'Square digital ad with the neon OCP sign and reformer straps', caption: 'Digital ad' },
      { src: 'selects/oak-cliff-pilates/Uptown 1200x1200.webp', alt: 'Square digital ad for the Uptown studio', caption: 'Digital ad, Uptown' },
      { src: 'selects/oak-cliff-pilates/Lower Greenville 1200x1200.webp', alt: 'Square digital ad for the Lower Greenville studio', caption: 'Digital ad, Lower Greenville' },
      { src: 'selects/oak-cliff-pilates/Bishop 1200x1200.webp', alt: 'Black and white community digital ad for the Bishop Arts studio', caption: 'Digital ad, Bishop Arts' },
      { src: 'selects/oak-cliff-pilates/OCP-BestOfDallas-300x600.webp', alt: 'Dallas Observer Best Of vote banner', caption: 'Best Of banner' },

      // Offers
      { src: 'selects/oak-cliff-pilates/2026_03_25_OCP_Promos_GuestPass_v01.webp', alt: 'Guest pass promotion', caption: 'Guest pass' },
      { src: 'selects/oak-cliff-pilates/2026_03_25_OCP_Promos_ComeBackOffer_v01.webp', alt: 'Come back offer promotion', caption: 'Come back offer' },
      { src: 'selects/oak-cliff-pilates/2026_03_25_OCP_Promos_Unlimited20Offer_v01.webp', alt: 'Unlimited twenty offer promotion', caption: 'Unlimited 20' },

      // Print
      { src: 'selects/oak-cliff-pilates/2026_08_25_OCP_PrintAds_BestStudioAd_v01.webp', alt: 'Best Pilates Studio print advertisement', caption: 'Best Studio, print' },
      { src: 'selects/oak-cliff-pilates/2026_08_21_OCP_PrintAds_MStreetsAd_v02.webp', alt: 'M Streets print advertisement', caption: 'M Streets, print' },
      { src: 'selects/oak-cliff-pilates/OCP-BestOfDallas-Print-1-8page-300dpi.webp', alt: 'Dallas Observer Best Of eighth-page print advertisement', caption: 'Best Of, print' },
      { src: 'selects/oak-cliff-pilates/2025_08_26_OCP_DirectMail_Postcards_v01-p1.webp', alt: 'Direct mail postcard, front', caption: 'Postcard, front' },
      { src: 'selects/oak-cliff-pilates/2025_08_26_OCP_DirectMail_Postcards_v01-p2.webp', alt: 'Direct mail postcard, back', caption: 'Postcard, back' },
      { src: 'selects/oak-cliff-pilates/2025_08_21_OCP_Events_TradeshowBackdrop_v01.webp', alt: 'Trade show backdrop', caption: 'Trade show backdrop' },

      // Merch
      { src: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_HoodieMockup_v01.webp', alt: 'Oak Cliff Pilates hoodie', caption: 'Hoodie' },
      { src: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_PulloverMockup_v01.webp', alt: 'Oak Cliff Pilates pullover', caption: 'Pullover' },
      { src: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_HatMockup_v01.webp', alt: 'Oak Cliff Pilates cap', caption: 'Cap' },
      { src: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_BagMockup_v01.webp', alt: 'Oak Cliff Pilates tote bag', caption: 'Tote' },
      { src: '2026/02/CharliesOCPCard-Not-So-AI.webp', alt: 'Oak Cliff Pilates business cards', caption: 'Identity detail' },

      // Events and community
      { src: '2026/02/OCP-Grand-Opening-308-scaled.webp', alt: 'Oak Cliff Pilates grand opening', caption: 'Launch energy' },
      { src: 'selects/oak-cliff-pilates/Private Parties - SMU.webp', alt: 'A private party at the studio', caption: 'Private parties' },
      { src: 'selects/oak-cliff-pilates/Halperin Park 1.webp', alt: 'A class in Halperin Park', caption: 'Pilates in the park' },
      { src: 'selects/oak-cliff-pilates/12.webp', alt: 'Cold Club ice bath event', caption: 'Cold Club' },
      { src: 'selects/oak-cliff-pilates/21.webp', alt: 'Cold Club event', caption: 'Cold Club' }
    ],
    videos: [
      { src: 'selects/oak-cliff-pilates/2025_12_03_OCP_Website_ScrollThroughVideo_v01.mp4', poster: 'selects/oak-cliff-pilates/2025_12_03_OCP_Website_ScrollThroughVideo_v01-poster.webp', caption: 'Website walkthrough' },
      { src: 'selects/oak-cliff-pilates/2026_10_06_OCP_Website_MenuScreenRecord_v01.mp4', poster: 'selects/oak-cliff-pilates/2026_10_06_OCP_Website_MenuScreenRecord_v01-poster.webp', caption: 'Menu in motion' },
      { src: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_Hoodie3DMockupVideo_v01.mp4', poster: 'selects/oak-cliff-pilates/2026_10_07_OCP_Merch_Hoodie3DMockupVideo_v01-poster.webp', caption: 'Hoodie, turned' }
    ]
  },
  honeycomb: {
    pieces: [
      { kind: 'tagline', text: 'Start with parking. Run your whole building.' },
      { kind: 'palette', label: 'Operator-first identity', colors: [['Signal Orange', '#FF7548'], ['Op Cyan', '#5FD4D4'], ['Data Violet', '#9966D4'], ['Deep Plum', '#0F0D14']] },
      { kind: 'list', label: 'Running it in real buildings', items: ['St. Paul Place', 'The Centrum', 'Tennyson', 'Seeker Labs', 'Founders Square', 'The Capital'] },
      { kind: 'voice', label: 'The identity reads', text: 'Direct, data-driven, and unpretentious, just like the product.' }
    ],
    media: []
  },
  'blue-plate-network': {
    pieces: [
      { kind: 'tagline', text: 'Your restaurant real estate partner for the long haul.' },
      { kind: 'palette', label: 'Identity built for the long haul', colors: [['Deep Navy', '#0A1A2E'], ['Brand Blue', '#1D3A5A'], ['Gold', '#D4AF37'], ['Cream', '#F5E9C4']] },
      { kind: 'voice', label: 'Voice', text: 'Calm, confident, partnership-first. Avoids hard sell.' }
    ],
    media: [
      { src: '2026/06/BluePlate-Brand-Identity-Evolution.webp', alt: 'Blue Plate identity evolution, pencil sketch to final mark', caption: 'Brand identity evolution' },
      { src: '2021/11/blueplate-SS.webp', alt: 'Blue Plate Network website', caption: 'Digital front door' },
      { src: '2022/08/Jakes_Gameday_Primary_Flat.png', alt: "Jake's Gameday logo", caption: 'Restaurant network' },
      { src: '2021/11/bowlounge.webp', alt: 'Bowlounge venue', caption: 'Client caliber' }
    ]
  },
  'latino-arts': {
    pieces: [
      { kind: 'pair', a: 'Latino Arts Project', b: 'Arte Latino Proyecto', label: 'Native in both registers' },
      { kind: 'tagline', text: 'Rooted. Modern. Bilingual.' },
      { kind: 'palette', label: 'Heritage and now', colors: [['Negro', '#151515'], ['Tierra', '#B04A18'], ['Naranja', '#EC7B3A'], ['Crema', '#FFF4D6']] },
      { kind: 'voice', label: 'Voice', text: 'Celebratory. Inclusive. Intentional.' },
      { kind: 'list', label: 'Programs', items: ['Exhibitions', 'Retail', 'Art consulting', 'Community events'] }
    ],
    media: [
      { src: '2026/06/Logo-Color@2x.png', alt: 'Latino Arts Project wordmark', caption: 'Mark', logo: true },
      { src: '2026/02/09042022-12.webp', alt: 'Latino Arts Project gallery interior', caption: 'Exhibition experience' },
      { src: '2026/02/Capture.webp', alt: 'Latino Arts Project website', caption: 'Digital access' },
      { src: '2026/02/Shopping.webp', alt: 'Latino Arts Project retail', caption: 'Takeaway moment' }
    ]
  },
  'mammogram-poster-girls': {
    pieces: [
      { kind: 'tagline', text: 'Saving lives, one mammogram at a time.' },
      { kind: 'voice', label: 'Man UP! To Breast Cancer · June', text: 'Real men know early detection saves the women they love.' },
      { kind: 'voice', label: 'Busted · poster series', text: 'Get it checked. Get it caught. Get on with it.' },
      { kind: 'list', label: 'Hospital partners', items: ['Methodist Health System', 'Parkland Moody Center', 'Hill Regional Hospital'] }
    ],
    media: [
      { src: '2026/02/ManUP-Logos-wh-OL-01.png', alt: 'Man UP! To Breast Cancer logo', caption: 'Man UP! sub-brand', logo: true },
      { src: '2026/06/MPG-Logo.png', alt: 'Mammogram Poster Girls logo', caption: 'Mark', logo: true },
      { src: '2026/02/MPG-Brand-Guide-Cover-1.webp', alt: 'Mammogram Poster Girls brand guide cover', caption: 'Brand foundation' },
      { src: '2026/02/Busted-Poster-scaled.webp', alt: 'Busted awareness poster', caption: 'Awareness poster' },
      { src: '2026/02/Banner-MAN-UP-Poster-Flyer-print-1.webp', alt: 'Man UP event flyer', caption: 'Event promotion' },
      { src: '2026/02/MPG-scaled.webp', alt: 'Mammogram Poster Girls campaign artwork', caption: 'Campaign system' }
    ]
  },
  'beverage-displays': {
    pieces: [
      { kind: 'tagline', text: 'Win the shelf.' },
      { kind: 'list', label: 'Engineered for', items: ['Veuve Clicquot', 'Bishop Cider', 'American Airlines', 'Shiner', 'Corralejo'] },
      { kind: 'list', label: 'And for', items: ['Korbel', 'Skyy', 'Deschutes', 'Interstate Batteries', 'Uncommon Brands'] },
      { kind: 'voice', label: 'The brief', text: 'What does the brand want to be remembered for from across the aisle?' },
      { kind: 'voice', label: 'The build', text: 'If a stocker cannot assemble it in twelve minutes, it does not ship.' },
      { kind: 'voice', label: 'The floor', text: 'From across the aisle, it has to read in three seconds or less.' },
      { kind: 'step', n: 'Bishop Cider', t: '48 × 40 in', d: 'Mass floor stack · 240 units' }
    ],
    media: [
      { src: '2026/02/Veuve-Deer-Head-scaled.webp', alt: 'Veuve Clicquot deer-head display', caption: 'Signature structure' },
      { src: '2026/06/Bishop-Sketch.webp', alt: 'Bishop Cider display concept sketch', caption: 'Sketch' },
      { src: '2026/06/Bishop-Rendering.webp', alt: 'Bishop Cider display 3D rendering', caption: 'Rendering' },
      { src: '2026/06/Bishop-Instore.webp', alt: 'Bishop Cider mass display in store', caption: 'In store' },
      { src: '2026/02/AmericanAirlines_Wallwraps_upscaled_4x-1.webp', alt: 'American Airlines wall wraps', caption: 'Environmental scale' },
      { src: '2026/02/ShinerTruckISORight.webp', alt: 'Shiner truck rig', caption: 'Mobile activation' },
      { src: '2026/02/CORRALEJO_Silver_NS-scaled.webp', alt: 'Corralejo Silver premium spirits display', caption: 'Product detail' },
      { src: '2026/02/WoodenDisplays-2.webp', alt: 'Wooden display series', caption: 'Production system' }
    ]
  },
  'van-country': {
    pieces: [
      { kind: 'tagline', text: 'North Texas Proud. Customer Service Driven.' },
      { kind: 'voice', label: 'The identity, built around', text: 'Ready to Roll?' },
      { kind: 'palette', label: 'Built to run on Texas roads', colors: [['Maroon', '#4D1816'], ['Maroon', '#712320'], ['Forest green', '#427962'], ['Cream', '#F4D27A']] },
      { kind: 'list', label: 'The fleet', items: ['VC Cruiser Collection', '12-passenger vans', '15-passenger vans', 'Luxury Mercedes-Benz Sprinters'] }
    ],
    media: [
      { src: '2026/06/VanCountry-Cream-Logo.png', alt: 'Van Country cream wordmark', caption: 'Brand mark', logo: true }
    ]
  },
  'event-weis': {
    pieces: [
      { kind: 'step', n: '01 · The brief', t: 'Define.', d: 'Goals, audience, success metrics.' },
      { kind: 'step', n: '02 · The build', t: 'Develop.', d: 'Vendors, run-of-show, permits, design.' },
      { kind: 'step', n: '03 · The day', t: 'Deploy.', d: 'Cheryl runs the floor while the client runs the room.' },
      { kind: 'tagline', text: 'Your trusted event partner.' },
      { kind: 'palette', label: 'Professional and calm', colors: [[null, '#0F1A14'], [null, '#1F3A2A'], [null, '#7DFFB6'], [null, '#FFEEC4']] }
    ],
    media: [
      { src: '2026/02/LogoCardsShot-scaled.webp', alt: 'Event Weis identity cards', caption: 'Founder credibility' },
      { src: '2026/02/LogoShot-1.webp', alt: 'Event Weis logo treatment', caption: 'Core mark' },
      { src: '2026/06/EventWeis-Napkin-to-Flesh.png', alt: 'Event Weis logo, napkin sketch to final mark', caption: 'Napkin to mark' },
      { src: '2026/02/SOM_SHirt-Mockup-scaled.webp', alt: 'Event Weis team shirt', caption: 'Team application' },
      { src: '2026/02/Banner.webp', alt: 'Event Weis promotional banner', caption: 'Marketing template' }
    ]
  }
};
