/* ==========================================================================
   GHL LEAD PROXY
   The one piece that must not run in the browser: it holds the GoHighLevel
   Private Integration token. Every capture path on the site posts here.

   Deploy as a single serverless function (Vercel / Netlify / Cloudflare) and
   set window.KIJA_ENDPOINT to its URL — see CLAUDE.md §Deploy.

   Does, in order:
     1. upsert the contact
     2. write the custom fields the capture path produced
     3. apply source + variant tags   (workflows trigger on these)
     4. create an opportunity in the pipeline at the right stage
     5. post the structured brief to Slack

   Every step after the upsert is best-effort: a failure is logged and the
   request still returns ok, because losing the contact is the only failure
   that actually costs money.
   ========================================================================== */

const GHL = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

const env = (k, fallback = '') => (globalThis.process?.env?.[k] ?? fallback);

const CONFIG = {
  token: env('GHL_PIT_TOKEN'),
  locationId: env('GHL_LOCATION_ID', 'pPvsVabo4AEGhFUMtk0e'),
  pipelineId: env('GHL_PIPELINE_ID', '1jAQxcIIIG1G1cx8c1nG'),
  stages: {
    // BLOCKER (Phase 0): create these in GHL and paste the IDs in.
    booked: env('GHL_STAGE_BOOKED'),      // "Strategy Call Booked"
    nurture: env('GHL_STAGE_NURTURE')     // "Nurture"
  },
  slackWebhook: env('SLACK_WEBHOOK_URL'),
  allowedOrigins: env('ALLOWED_ORIGINS', 'https://kijacreative.com,https://www.kijacreative.com')
    .split(',').map((s) => s.trim()).filter(Boolean)
};

/* --------------------------------------------------------------------------
   CUSTOM FIELD MAP
   Left: the key the browser sends. Right: the env var holding that field's
   GHL id. Create the fields in GHL, export the ids, set the vars.
   An unmapped key is skipped and reported in the response under
   `unmappedFields` rather than silently dropped.
   -------------------------------------------------------------------------- */
const FIELD_MAP = {
  capture_path:         'GHL_FIELD_CAPTURE_PATH',
  variant_id:           'GHL_FIELD_VARIANT_ID',
  signal_score:         'GHL_FIELD_SIGNAL_SCORE',
  signal_band:          'GHL_FIELD_SIGNAL_BAND',
  weak_areas:           'GHL_FIELD_WEAK_AREAS',
  pillar_scores:        'GHL_FIELD_PILLAR_SCORES',
  industry:             'GHL_FIELD_INDUSTRY',
  company_size:         'GHL_FIELD_COMPANY_SIZE',
  current_state:        'GHL_FIELD_CURRENT_STATE',
  primary_constraint:   'GHL_FIELD_PRIMARY_CONSTRAINT',
  timeline:             'GHL_FIELD_TIMELINE',
  budget_band:          'GHL_FIELD_BUDGET_BAND',
  recommended_offer:    'GHL_FIELD_RECOMMENDED_OFFER',
  recommended_sequence: 'GHL_FIELD_RECOMMENDED_SEQUENCE',
  context:              'GHL_FIELD_CONTEXT',
  utm_source:           'GHL_FIELD_UTM_SOURCE',
  utm_medium:           'GHL_FIELD_UTM_MEDIUM',
  utm_campaign:         'GHL_FIELD_UTM_CAMPAIGN',
  landing_page:         'GHL_FIELD_LANDING_PAGE',
  referrer:             'GHL_FIELD_REFERRER'
};

/* ---------- helpers ------------------------------------------------------- */
const headers = () => ({
  Authorization: `Bearer ${CONFIG.token}`,
  Version: API_VERSION,
  'Content-Type': 'application/json',
  Accept: 'application/json'
});

async function ghl(path, body, method = 'POST') {
  const res = await fetch(GHL + path, { method, headers: headers(), body: body && JSON.stringify(body) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`GHL ${method} ${path} → ${res.status}`);
    err.status = res.status; err.body = json;
    throw err;
  }
  return json;
}

const clean = (s, max = 500) => String(s ?? '').trim().slice(0, max);
const isEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s || ''));

/* Which pipeline stage a capture path lands in. Booking is the only path
   that means a call actually exists; everything else is nurture. */
const stageFor = (capturePath) =>
  capturePath === 'book_qualified' || capturePath === 'book'
    ? CONFIG.stages.booked
    : CONFIG.stages.nurture;

const opportunityName = (p) => {
  const who = p.company || p.first_name || p.email;
  const what = p.recommended_offer || p.capture_path?.replace(/_/g, ' ') || 'enquiry';
  return clean(`${who} — ${what}`, 120);
};

/* ---------- the handler --------------------------------------------------- */
export async function handleLead(payload, { origin } = {}) {
  if (!CONFIG.token) {
    // Fail loudly in logs, quietly to the visitor: they have already seen a
    // confirmation and there is nothing useful they can do about our config.
    console.error('[ghl-proxy] GHL_PIT_TOKEN is not set — lead not persisted', payload.email);
    return { ok: false, reason: 'not_configured' };
  }
  if (!isEmail(payload.email)) return { ok: false, reason: 'invalid_email' };

  const warnings = [];
  const unmappedFields = [];

  /* 1 — custom fields */
  const customFields = [];
  for (const [key, envVar] of Object.entries(FIELD_MAP)) {
    if (payload[key] === undefined || payload[key] === '') continue;
    const id = env(envVar);
    if (!id) { unmappedFields.push(key); continue; }
    customFields.push({ id, field_value: clean(payload[key]) });
  }

  /* 2 — upsert contact */
  const tags = Array.isArray(payload.tags) ? payload.tags.map((t) => clean(t, 60)) : [];
  const contactBody = {
    locationId: CONFIG.locationId,
    email: clean(payload.email, 200).toLowerCase(),
    firstName: clean(payload.first_name, 80) || undefined,
    companyName: clean(payload.company, 120) || undefined,
    website: clean(payload.url, 200) || undefined,
    source: clean(payload.capture_path || 'website', 80),
    tags,
    customFields
  };

  const upserted = await ghl('/contacts/upsert', contactBody);
  const contactId = upserted?.contact?.id || upserted?.id;
  if (!contactId) return { ok: false, reason: 'no_contact_id', detail: upserted };

  /* 3 — opportunity */
  const stage = stageFor(payload.capture_path);
  if (stage) {
    try {
      await ghl('/opportunities/', {
        pipelineId: CONFIG.pipelineId,
        locationId: CONFIG.locationId,
        pipelineStageId: stage,
        contactId,
        name: opportunityName(payload),
        status: 'open'
      });
    } catch (err) {
      warnings.push(`opportunity: ${err.message}`);
      console.error('[ghl-proxy] opportunity failed', err.body || err);
    }
  } else {
    warnings.push('no pipeline stage id configured — opportunity skipped');
  }

  /* 4 — Slack brief */
  if (CONFIG.slackWebhook) {
    const lines = Object.entries(payload)
      .filter(([k, v]) => v && !['tags', 'submitted_at'].includes(k))
      .map(([k, v]) => `• *${k.replace(/_/g, ' ')}*: ${clean(v, 200)}`);
    try {
      await fetch(CONFIG.slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New lead — ${payload.capture_path} — ${payload.email}`,
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: `New lead: ${clean(payload.capture_path, 40)}` } },
            { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n').slice(0, 2900) } }
          ]
        })
      });
    } catch (err) {
      warnings.push(`slack: ${err.message}`);
    }
  }

  if (unmappedFields.length) {
    console.warn('[ghl-proxy] unmapped custom fields (set the env vars):', unmappedFields.join(', '));
  }

  return { ok: true, contactId, warnings, unmappedFields };
}

/* ---------- fetch-standard entry point (Vercel / Netlify / Cloudflare) ----- */
export default async function handler(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = CONFIG.allowedOrigins.includes(origin) ? origin : CONFIG.allowedOrigins[0];
  const cors = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return new Response('{"ok":false,"reason":"method"}', { status: 405, headers: cors });

  // Only accept posts from our own origins. Not security on its own — the
  // proxy writes to one location and cannot read — but it keeps the junk out.
  if (origin && !CONFIG.allowedOrigins.includes(origin)) {
    return new Response('{"ok":false,"reason":"origin"}', { status: 403, headers: cors });
  }

  let payload;
  try { payload = await request.json(); }
  catch { return new Response('{"ok":false,"reason":"bad_json"}', { status: 400, headers: cors }); }

  if (payload.website) {                       // honeypot survived the client
    return new Response('{"ok":true,"skipped":"spam"}', { status: 200, headers: cors });
  }

  try {
    const result = await handleLead(payload, { origin });
    return new Response(JSON.stringify(result), { status: result.ok ? 200 : 502, headers: cors });
  } catch (err) {
    console.error('[ghl-proxy] fatal', err, err.body);
    return new Response(JSON.stringify({ ok: false, reason: 'upstream', message: err.message }),
      { status: 502, headers: cors });
  }
}
