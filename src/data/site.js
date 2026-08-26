/* Site-wide constants. Everything a page needs about "the site" lives here. */

export const site = {
  name: 'Kija Creative',
  domain: 'kijacreative.com',
  url: 'https://kijacreative.com',
  tagline: 'Most brands are broken. We fix them by building systems, not visuals.',
  description:
    'Kija Creative is a Dallas growth partner. We build brand systems, conversion-focused websites and the automation behind them — then run the campaigns that feed them.',
  location: 'Dallas, Texas',
  email: 'hello@kijacreative.com',
  calendar: 'https://brand.kijacreative.com/widget/booking/IvRyDWXB23MJfz0G6ddg',

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
      { label: 'The Oak Cliff Pilates story', href: '/oak-cliff-pilates-story' },
      { label: 'Insights', href: '/insights' }
    ]
  }
];
