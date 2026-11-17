/* What the proof wall explorer receives: the live projects only, with the
   live site's extra pieces and any project photos present in the repo. */
import { listed } from './cases.js';
import { wall } from './wall.js';
import { hasMedia, mediaUrl } from './media.js';

export const explorerPayload = () => listed().map((c) => {
  const w = wall[c.slug] || { pieces: [], media: [] };
  return {
    slug: c.slug, client: c.client, industry: c.industry, year: c.year || null,
    headline: c.headline, tagline: c.tagline || null, quote: c.quote || null,
    thumb: c.thumb, metrics: c.metrics, situation: c.situation || null, diagnosis: c.diagnosis || null,
    system: c.system || [], result: c.result || null,
    pieces: w.pieces,
    media: w.media.filter((m) => hasMedia(m.src)).map((m) => ({ src: mediaUrl(m.src), alt: m.alt, caption: m.caption, logo: !!m.logo }))
  };
});
export const explorerJSON = () => JSON.stringify(explorerPayload()).replace(/</g, '\\u003c');
