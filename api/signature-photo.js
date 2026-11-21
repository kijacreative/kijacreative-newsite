/* ==========================================================================
   POST /api/signature-photo — stores a signature headshot and returns its URL.

   NODE RUNTIME. The body is raw image bytes, already cropped to a 1:1 square
   by the browser, so this function never decodes or resizes an image: it
   validates, stores, and hands back a permanent public URL.

   Why a hosted URL at all: an email signature's photo is fetched by every
   recipient's mail client. A data: URI gets stripped by most of them, and a
   file on someone's laptop is not a URL. The photo has to live somewhere
   public and permanent, which is what Vercel Blob is for here.

   THIS ENDPOINT IS PUBLIC. Anything on kijacreative.com/api is reachable by
   anyone who finds it, so an unguarded upload route is a free file host on our
   account. Two gates, both fail closed:

     1. SIGNATURE_UPLOAD_KEY must be set, and the caller must send it.
        No env var -> every upload is refused, nothing is stored.
     2. Origin must be one of ALLOWED_ORIGINS.

   Neither is real authentication. They stop drive-by abuse of a URL that is
   not linked from anywhere; they would not stop someone inside the team
   sharing the key. If this ever needs to be properly locked down, put it
   behind Vercel Authentication rather than growing this check.
   ========================================================================== */

const env = (k, fallback = '') => (globalThis.process?.env?.[k] ?? fallback);

const ALLOWED = env('ALLOWED_ORIGINS', 'https://kijacreative.com,https://www.kijacreative.com')
  .split(',').map((s) => s.trim()).filter(Boolean);

/* Matches the 1:1 crop the browser sends. Anything else is a bug or an abuse
   attempt, not a photo we asked for. */
const MAX_BYTES = 2 * 1024 * 1024;

const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

/**
 * Read the raw request body, refusing anything over the cap.
 *
 * Vercel's helpers leave a non-JSON body as a Buffer, but fall back to the
 * stream so this works whichever way it arrives.
 *
 * @param {object} req Request.
 * @returns {Promise<Buffer>} Body bytes.
 */
async function readBytes(req) {
  if (Buffer.isBuffer(req.body)) {
    if (req.body.length > MAX_BYTES) throw new Error('too_large');
    return req.body;
  }

  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BYTES) throw new Error('too_large');
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * Constant-time-ish comparison, so a wrong key does not leak its length.
 *
 * @param {string} a First value.
 * @param {string} b Second value.
 * @returns {boolean} Whether they match.
 */
function same(a, b) {
  const left = String(a || '');
  const right = String(b || '');
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ALLOWED.includes(origin) ? origin : ALLOWED[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Signature-Key');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, reason: 'method' });

  if (origin && !ALLOWED.includes(origin)) {
    return res.status(403).json({ ok: false, reason: 'origin' });
  }

  const expected = env('SIGNATURE_UPLOAD_KEY');

  // Fail closed: with no key configured, this route stores nothing at all.
  if (!expected) {
    return res.status(503).json({ ok: false, reason: 'not_configured' });
  }

  if (!same(req.headers['x-signature-key'], expected)) {
    return res.status(401).json({ ok: false, reason: 'bad_key' });
  }

  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  const extension = TYPES[contentType];

  if (!extension) {
    return res.status(415).json({ ok: false, reason: 'unsupported_type' });
  }

  let bytes;
  try {
    bytes = await readBytes(req);
  } catch (error) {
    const reason = error?.message === 'too_large' ? 'too_large' : 'bad_body';
    return res.status(reason === 'too_large' ? 413 : 400).json({ ok: false, reason });
  }

  if (!bytes.length) {
    return res.status(400).json({ ok: false, reason: 'empty' });
  }

  // Imported here so a missing dependency degrades to a clear error instead of
  // taking down the whole function at module load.
  let put;
  try {
    ({ put } = await import('@vercel/blob'));
  } catch {
    console.error('[signature-photo] @vercel/blob is not installed');
    return res.status(503).json({ ok: false, reason: 'storage_missing' });
  }

  if (!env('BLOB_READ_WRITE_TOKEN')) {
    console.error('[signature-photo] no Blob store connected to this project');
    return res.status(503).json({ ok: false, reason: 'storage_missing' });
  }

  try {
    const blob = await put(`signature-photos/photo.${extension}`, bytes, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error('[signature-photo] upload failed', error?.message || error);
    return res.status(502).json({ ok: false, reason: 'upload_failed' });
  }
}
