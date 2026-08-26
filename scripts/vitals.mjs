#!/usr/bin/env node
/* Refresh the Core Web Vitals published in the footer.
   The numbers on the site are a promise, so they get updated from a real
   measurement at every deploy — never edited by hand to look better.

   Usage:  npx lighthouse https://kijacreative.com --output=json --output-path=./lh.json
           node scripts/vitals.mjs lh.json
*/
import { readFile, writeFile } from 'node:fs/promises';

const [file] = process.argv.slice(2);
if (!file) {
  console.error('usage: node scripts/vitals.mjs <lighthouse-report.json>');
  process.exit(1);
}

const lh = JSON.parse(await readFile(file, 'utf8'));
const a = lh.audits || {};
const pick = (k, d = '—') => a[k]?.displayValue?.trim() || d;

const vitals = {
  lcp: pick('largest-contentful-paint'),
  cls: pick('cumulative-layout-shift'),
  inp: pick('interaction-to-next-paint', pick('total-blocking-time')),
  weight: pick('total-byte-weight')
};

const path = 'src/data/site.js';
let src = await readFile(path, 'utf8');
src = src.replace(
  /vitals: \{[^}]*\}/,
  `vitals: { lcp: '${vitals.lcp}', cls: '${vitals.cls}', inp: '${vitals.inp}', weight: '${vitals.weight}' }`
);
await writeFile(path, src);
console.log('footer vitals updated:', vitals, '\nrun `npm run build` to publish.');
