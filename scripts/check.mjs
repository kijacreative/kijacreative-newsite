#!/usr/bin/env node
/* Pre-launch checks over dist/. Run after `npm run build`. */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
async function walk(d, out = []) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'ghl') await walk(p, out); }
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const files = await walk(dist);
const problems = [];
const add = (f, m) => problems.push(`${f.replace('dist/', '/').replace('/index.html', '') || '/'} — ${m}`);

for (const f of files) {
  const h = await readFile(f, 'utf8');
  const main = (h.match(/<main id="main">([\s\S]*?)<\/main>/) || [])[1] || '';

  if (!/<title>.+<\/title>/.test(h)) add(f, 'missing title');
  if (!/name="description" content=".+"/.test(h)) add(f, 'missing meta description');
  if ((h.match(/<h1/g) || []).length !== 1) add(f, `expected exactly one h1, found ${(h.match(/<h1/g) || []).length}`);
  if (main.length < 600) add(f, `body looks thin (${main.length} chars)`);
  if (/undefined|\[object Object\]|NaN/.test(main)) add(f, 'template leak (undefined/NaN in output)');

  // every image must carry alt text (there are no <img> today — this guards
  // the moment photography lands)
  for (const img of main.match(/<img[^>]*>/g) || []) {
    if (!/\salt=/.test(img)) add(f, 'image without alt text');
  }
  // links that open elsewhere need the security pair
  for (const a of main.match(/<a[^>]*target="_blank"[^>]*>/g) || []) {
    if (!/rel="[^"]*noopener/.test(a)) add(f, 'target=_blank without rel=noopener');
  }
  // the proof standard: mint metric tags must not appear with unverified copy
  if (/k-tag--mint">\s*(up to|approx|~)/i.test(main)) add(f, 'hedged figure in a verified-metric tag');
}

console.log(`\n  checked ${files.length} pages`);
if (problems.length) {
  console.error('\n  problems:\n' + problems.map((p) => '   ✗ ' + p).join('\n') + '\n');
  process.exit(1);
}
console.log('  no problems found\n');
