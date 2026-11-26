/* ==========================================================================
   POST /api/lead — the capture endpoint every form on the site posts to.

   NODE RUNTIME, not edge. Mail goes out over Google Workspace SMTP, which
   needs a TCP socket, and the edge runtime cannot open one.

   Three things happen, in this order of importance:

     1. Email kiel@kijacreative.com          always
     2. Email the visitor their result       signal test + fit finder only
     3. Upsert into GoHighLevel              only if the GHL env vars are set

   They are independent on purpose. GHL has been blocked on a Private
   Integration token since Phase 0, and the site must not depend on it to get
   a lead to a human. If mail succeeds and GHL is unconfigured, this still
   returns ok: a lead reached someone who can act on it.

   The visitor never sees a failure here. They have already seen their result
   on screen, and our plumbing is not their problem.
   ========================================================================== */
import { handleLead } from '../server/ghl-proxy.mjs';
import { notifyInternal, sendVisitorResults, mailConfigured } from '../server/mailer.mjs';

const env = (k, fallback = '') => (globalThis.process?.env?.[k] ?? fallback);

const ALLOWED = env('ALLOWED_ORIGINS', 'https://kijacreative.com,https://www.kijacreative.com')
  .split(',').map((s) => s.trim()).filter(Boolean);

const isEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s || ''));

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ALLOWED.includes(origin) ? origin : ALLOWED[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, reason: 'method' });

  if (origin && !ALLOWED.includes(origin)) {
    return res.status(403).json({ ok: false, reason: 'origin' });
  }

  let payload;
  try { payload = await readBody(req); }
  catch { return res.status(400).json({ ok: false, reason: 'bad_json' }); }

  if (payload.website) return res.status(200).json({ ok: true, skipped: 'spam' });
  if (!isEmail(payload.email)) return res.status(400).json({ ok: false, reason: 'invalid_email' });

  // All three run regardless of each other's outcome. settled, never rejected.
  const [internal, visitor, crm] = await Promise.allSettled([
    notifyInternal(payload),
    sendVisitorResults(payload),
    handleLead(payload, { origin })
  ]);

  const unwrap = (r) => (r.status === 'fulfilled' ? r.value : { ok: false, reason: String(r.reason?.message || r.reason) });
  const mailOut = unwrap(internal);
  const mailBack = unwrap(visitor);
  const ghl = unwrap(crm);

  if (!mailOut.ok) console.error('[lead] internal notification failed', payload.email, mailOut);

  // A lead that reached a human is a success, whatever GHL did.
  const ok = mailOut.ok || ghl.ok;
  if (!ok) console.error('[lead] NOTHING PERSISTED', JSON.stringify(payload));

  return res.status(ok ? 200 : 502).json({
    ok,
    mail: { configured: mailConfigured(), internal: mailOut.ok, visitor: mailBack.ok || mailBack.skipped || false },
    ghl: { ok: ghl.ok, reason: ghl.reason }
  });
}
