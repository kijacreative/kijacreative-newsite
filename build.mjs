#!/usr/bin/env node
/* ==========================================================================
   KIJA REBUILD — BUILD
   Emits two things from one source:
     dist/            a complete standalone static site (preview + QA + audits)
     dist/ghl/        one body-only fragment per page, for pasting into the
                      matching GHL custom code block
   Run: node build.mjs
   ========================================================================== */
import { mkdir, writeFile, readFile, copyFile, readdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page, fragment } from './src/templates/layout.js';
import { site } from './src/data/site.js';

import homeB from './src/pages/home-b.js';
import { workIndex, casePages } from './src/pages/work.js';
import { servicesIndex, servicePages } from './src/pages/services.js';
import { packagesIndex, offerPages } from './src/pages/packages.js';
import { capturePages } from './src/pages/capture.js';
import { brandSystemPage, nowPage, ocpStoryPage } from './src/pages/proof.js';
import { aboutPage, privacyPage, termsPage, notFoundPage } from './src/pages/misc.js';
import { insightsIndex, articlePages } from './src/pages/insights.js';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

/* ---------- ProofMail ----------------------------------------------------
   The Kija x DIMACO direct-mail program. These two pages are complete HTML
   documents rather than page modules: ProofMail is a co-branded sub-brand
   with its own palette (src/proofmail/proofmail.css), so it does not go
   through layout.js and never inherits the Kija nav, footer or tokens. The
   build copies them verbatim, substituting the handful of values that must
   stay in sync with src/data/site.js.

   They still load /assets/global.js, so attribution, event names and the
   /api/lead endpoint are shared with the rest of the site.
   -------------------------------------------------------------------------- */
const proofmail = [
  { src: 'index.html', out: 'proofmail/index.html', path: '/proofmail', noindex: false },
  { src: 'toolkit.html', out: 'proofmail/toolkit/index.html', path: '/proofmail/toolkit', noindex: true }
];
const proofmailSubs = {
  __SITE_URL__: site.url,
  __KIJA_ENDPOINT__: site.leadEndpoint,
  __KIJA_LINKS__: JSON.stringify(site.calendly),
  __CALENDLY_CONSULT__: site.calendly.consultation
};

/* ---------- page manifest ------------------------------------------------- */
const pages = [
  homeB(),
  workIndex(), ...casePages(),
  servicesIndex(), ...servicePages(),
  packagesIndex(), ...offerPages(),
  ...capturePages(),
  brandSystemPage(), nowPage(), ocpStoryPage(),
  aboutPage(), insightsIndex(),
  ...articlePages(),
  privacyPage(), termsPage(), notFoundPage()
];

/* ---------- validation ---------------------------------------------------
   Cheap invariants that catch the mistakes that actually happen: two pages
   claiming one URL, and internal links pointing at pages that do not exist.
   -------------------------------------------------------------------------- */
function validate(list) {
  const errors = [];
  const seen = new Map();
  list.forEach((p) => {
    if (seen.has(p.path)) errors.push(`duplicate path: ${p.path}`);
    seen.set(p.path, p);
  });

  const known = new Set([...seen.keys(), '/404']);
  const external = /^(https?:|mailto:|tel:|#)/;
  list.forEach((p) => {
    const hrefs = [...p.body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    hrefs.forEach((h) => {
      if (external.test(h)) return;
      const clean = h.split('?')[0].split('#')[0];
      if (!clean) return;
      if (!known.has(clean)) errors.push(`${p.path} → broken internal link: ${h}`);
    });
  });
  return errors;
}

/* ---------- helpers ------------------------------------------------------- */
const outFileFor = (p) => (p.path === '/' ? 'index.html' : `${p.path.replace(/^\//, '')}/index.html`);
const ghlFileFor = (p) => `${(p.path === '/' ? 'home' : p.path.replace(/^\//, '').replace(/\//g, '--'))}.html`;

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const src = join(from, entry.name), dst = join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dst);
    else await copyFile(src, dst);
  }
}

/* ---------- build --------------------------------------------------------- */
const errors = validate(pages);
if (errors.length) {
  console.error('\nBuild failed — fix these first:\n');
  errors.forEach((e) => console.error('  ✗ ' + e));
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'ghl'), { recursive: true });

// assets: global css/js + widgets
await mkdir(join(dist, 'assets', 'widgets'), { recursive: true });
for (const f of ['fonts.css', 'tokens.css', 'global.css', 'global.js', 'motion.js']) {
  await copyFile(join(root, 'src', f), join(dist, 'assets', f));
}
await copyDir(join(root, 'src', 'widgets'), join(dist, 'assets', 'widgets'));
await copyDir(join(root, 'src', 'fonts'), join(dist, 'assets', 'fonts'));
await copyDir(join(root, 'src', 'vendor'), join(dist, 'assets', 'vendor'));
// Live-site media (src/media/wp-uploads, filled by content-import/download-assets.sh).
// Optional: pages only reference files that exist, so an empty folder is fine.
try { await copyDir(join(root, 'src', 'media'), join(dist, 'assets', 'media')); } catch (e) { /* no media yet */ }

// ProofMail: sub-brand assets, then the two standalone documents
await copyDir(join(root, 'src', 'proofmail'), join(dist, 'assets', 'proofmail'));
for (const f of proofmail) {
  // The HTML lives beside its css/js in src; only the css/js belong in /assets.
  await rm(join(dist, 'assets', 'proofmail', f.src), { force: true });
  let html = await readFile(join(root, 'src', 'proofmail', f.src), 'utf8');
  for (const [token, value] of Object.entries(proofmailSubs)) html = html.split(token).join(value);
  const leftover = html.match(/__[A-Z_]+__/g);
  if (leftover) {
    console.error(`\nBuild failed — ${f.path} has unsubstituted tokens: ${[...new Set(leftover)].join(', ')}\n`);
    process.exit(1);
  }
  const file = join(dist, f.out);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

// pages
for (const p of pages) {
  const file = join(dist, outFileFor(p));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(p));
  await writeFile(join(dist, 'ghl', ghlFileFor(p)), fragment(p));
}

// 404 at the root too, for static hosts that look for it there
await copyFile(join(dist, '404', 'index.html'), join(dist, '404.html'));

/* ---------- sitemap + robots ---------------------------------------------- */
const indexable = [...pages, ...proofmail].filter((p) => !p.noindex);
await writeFile(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${site.url}${p.path === '/' ? '/' : p.path}</loc><changefreq>${p.path === '/now' ? 'monthly' : 'yearly'}</changefreq></url>`).join('\n')}
</urlset>\n`);

// The toolkit is internal. noindex keeps it out of results; this keeps
// well-behaved crawlers from spending time on it at all.
await writeFile(join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /thanks/\nDisallow: /proofmail/toolkit\nSitemap: ${site.url}/sitemap.xml\n`);

/* ---------- GHL paste manifest -------------------------------------------- */
const manifest = pages.map((p) => ({
  url: p.path,
  title: p.title || 'Home',
  variant: p.variant || null,
  noindex: !!p.noindex,
  widgets: (p.scripts || []).map((s) => s.split('/').pop().replace('.js', '')),
  ghlFragment: `ghl/${ghlFileFor(p)}`
}));
await writeFile(join(dist, 'ghl', 'manifest.json'), JSON.stringify(manifest, null, 2));

/* ---------- report -------------------------------------------------------- */
console.log(`\n  Kija rebuild — build complete\n`);
console.log(`  ${pages.length + proofmail.length} pages  ·  ${indexable.length} indexable  ·  ${pages.length + proofmail.length - indexable.length} noindex (variants + thank-you + toolkit)`);
console.log(`  ProofMail      → ${proofmail.map((p) => p.path).join('  ')}`);
console.log(`  ${manifest.filter((m) => m.variant).length} A/B variant pages`);
console.log(`  Standalone site → dist/`);
console.log(`  GHL fragments   → dist/ghl/  (manifest.json maps URL → file)\n`);
