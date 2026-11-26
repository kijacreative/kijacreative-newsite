/* Site-wide constants. Everything a page needs about "the site" lives here. */

export const site = {
  name: 'Kija Creative',
  domain: 'kijacreative.com',
  url: 'https://kijacreative.com',
  tagline: 'Make your brand unmissable. Creative direction for what’s next.',
  description:
    'Kija Creative is a Dallas growth partner. We build brand systems, conversion-focused websites and the automation behind them — then run the campaigns that feed them.',
  location: 'Dallas, Texas',
  // Contact details as published on the live site (pulled 2026-11-17).
  email: 'signal@kijacreative.com',
  phone: '+1 480-544-6204',
  phoneHref: 'tel:+14805446204',
  address: { street: '2000 Greenville Ave. #6', city: 'Dallas', region: 'TX', postal: '75206' },
  established: '2022',
  // Brand marks from the live site (wp-uploads). The K mark carries the same offset as the site's split-text motif.
  logo: { mark: '2026/01/Kija-K-Dark-1.png', icon: '2026/01/cropped-Kija-Stacked-Multicolored.png', iconSmall: '2026/01/cropped-Kija-Stacked-Multicolored-270x270.png' },
  // The reel from the live homepage hero. Path is inside wp-uploads (see src/media/README.md).
  heroVideo: { src: '2026/02/02182.mp4', poster: '2026/02/02182-poster.jpg' },
  social: {
    instagram: 'https://www.instagram.com/kijacreative/',
    linkedin: 'https://www.linkedin.com/company/kijacreative/'
  },
  // Calendly is the only booking system. The GHL booking widget was removed
  // 2026-11-18; `ghl.calendarId` below is kept only as a record of the id.
  // These are injected into every page as window.KIJA_LINKS, because the
  // widgets are copied to dist verbatim rather than templated and so cannot
  // import from src/data.
  calendly: {
    consultation: 'https://calendly.com/kiel-kijacreative/free-consultation',
    brandReview: 'https://calendly.com/kiel-kijacreative/free-brand-review'
  },

  // Where every capture path is emailed. Separate from `email`, which is the
  // public address published in the footer.
  notifyEmail: 'kiel@kijacreative.com',

  // Where every capture path posts. Relative works on Vercel, where the
  // function ships with the site. Change to the absolute URL when the pages
  // are pasted into GHL, since the site is then on a different origin.
  leadEndpoint: '/api/lead',

  // GHL — see CLAUDE.md before changing any of these.
  ghl: {
    locationId: 'pPvsVabo4AEGhFUMtk0e',
    pipelineId: '1jAQxcIIIG1G1cx8c1nG',
    calendarId: 'IvRyDWXB23MJfz0G6ddg'
  },

  // Published in the footer as the Website Design self-demonstration.
  // Update at every deploy from the Lighthouse run — see `npm run vitals`.
  vitals: { lcp: '1.1s', cls: '0.00', inp: '38ms', weight: '184 KB' }
};

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'About', href: '/about' }
];

export const footerNav = [
  {
    title: 'Work',
    links: [
      { label: 'All projects', href: '/work' },
      { label: 'Oak Cliff Pilates', href: '/work/oak-cliff-pilates' },
      { label: 'Van Country', href: '/work/van-country' },
      { label: 'Mammogram Poster Girls', href: '/work/mammogram-poster-girls' }
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Creative Strategy', href: '/services/creative-strategy' },
      { label: 'Brand Development', href: '/services/brand-development' },
      { label: 'Website Design', href: '/services/website-design' },
      { label: 'Marketing Automation', href: '/services/marketing-automation' },
      { label: 'Ongoing Marketing', href: '/services/ongoing-marketing' }
    ]
  },
  {
    title: 'Proof of practice',
    links: [
      { label: 'Our brand system', href: '/brand-system' },
      { label: 'What we are running now', href: '/now' },
      // '/oak-cliff-pilates-story' hidden until the OCP relationship wording is confirmed (TRANSFER-REPORT §7)
      { label: 'Insights', href: '/insights' }
    ]
  }
];
