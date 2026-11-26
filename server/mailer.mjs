/* ==========================================================================
   MAILER — Google Workspace SMTP

   Two jobs, both best-effort. A mail failure is logged and swallowed: the
   visitor has already seen their result on screen and there is nothing
   useful they can do about our infrastructure.

     1. notifyInternal()      every capture path, to site.notifyEmail,
                              Reply-To set to the visitor so a reply just works
     2. sendVisitorResults()  the diagnostic paths only (signal test, fit
                              finder), sending the person what they asked for

   NODE RUNTIME ONLY. nodemailer opens a TCP socket, which the edge runtime
   cannot do. `api/lead.js` therefore runs on Node, not edge. If this ever
   moves to Cloudflare Workers, this file has to be swapped for an HTTP mail
   API; `server/ghl-proxy.mjs` stays portable either way.

   Required env (see CLAUDE.md):
     SMTP_USER   the Workspace mailbox doing the sending
     SMTP_PASS   a Google App Password, not the account password
   Optional:
     SMTP_HOST (smtp.gmail.com) · SMTP_PORT (465) · MAIL_FROM · NOTIFY_EMAIL
   ========================================================================== */

import nodemailer from 'nodemailer';
import { site } from '../src/data/site.js';

const env = (k, fallback = '') => (globalThis.process?.env?.[k] ?? fallback);

const CONFIG = {
  host: env('SMTP_HOST', 'smtp.gmail.com'),
  port: Number(env('SMTP_PORT', '465')),
  user: env('SMTP_USER'),
  pass: env('SMTP_PASS'),
  from: env('MAIL_FROM'),
  notify: env('NOTIFY_EMAIL', site.notifyEmail)
};

export const mailConfigured = () => Boolean(CONFIG.user && CONFIG.pass);

let transport;
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: CONFIG.host,
      port: CONFIG.port,
      secure: CONFIG.port === 465,          // 465 implicit TLS, 587 STARTTLS
      auth: { user: CONFIG.user, pass: CONFIG.pass }
    });
  }
  return transport;
}

/* ---------- formatting ---------------------------------------------------- */
const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const LABELS = {
  first_name: 'First name', email: 'Email', company: 'Company', url: 'Website',
  capture_path: 'Capture path', variant_id: 'Variant', signal_score: 'Signal score',
  signal_band: 'Band', weak_areas: 'Weakest areas', weak_fixes: 'Written diagnosis',
  pillar_scores: 'Pillar scores', industry: 'Industry', company_size: 'Company size',
  current_state: 'Brand today', primary_constraint: 'Main constraint',
  timeline: 'Timeline', budget_band: 'Budget band', recommended_offer: 'Recommended package',
  recommended_sequence: 'Recommended sequence', context: 'Context',
  utm_source: 'UTM source', utm_medium: 'UTM medium', utm_campaign: 'UTM campaign',
  landing_page: 'Landing page', referrer: 'Referrer', source_path: 'Submitted from',
  submitted_at: 'Submitted at'
};

const SKIP = new Set(['tags', 'website']);

const rows = (payload) => Object.entries(payload)
  .filter(([k, v]) => !SKIP.has(k) && v !== undefined && v !== null && String(v).trim() !== '')
  .map(([k, v]) => [LABELS[k] || k.replace(/_/g, ' '), String(v)]);

const textTable = (pairs) => pairs.map(([k, v]) => `${k}: ${v}`).join('\n');

const htmlTable = (pairs) => `
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font:14px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E">
${pairs.map(([k, v]) => `  <tr>
    <td style="padding:7px 18px 7px 0;vertical-align:top;color:#6b6b6b;white-space:nowrap">${esc(k)}</td>
    <td style="padding:7px 0;vertical-align:top;white-space:pre-wrap">${esc(v)}</td>
  </tr>`).join('\n')}
</table>`;

const button = (href, label) =>
  `<a href="${esc(href)}" style="display:inline-block;background:#1E0A1E;color:#F5F3EC;text-decoration:none;padding:13px 22px;border-radius:999px;font:600 14px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${esc(label)}</a>`;

const shell = (inner) => `<!doctype html><html><body style="margin:0;padding:28px;background:#F5F3EC">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:30px">
${inner}
<p style="margin:30px 0 0;font:12px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#9a9a9a">
Kija Creative · ${esc(site.location)} · <a href="${esc(site.url)}" style="color:#9a9a9a">${esc(site.domain)}</a>
</p></div></body></html>`;

async function send(message) {
  if (!mailConfigured()) {
    console.error('[mailer] SMTP_USER / SMTP_PASS not set, mail not sent:', message.subject);
    return { ok: false, reason: 'not_configured' };
  }
  try {
    const info = await getTransport().sendMail({
      from: CONFIG.from || `Kija Creative <${CONFIG.user}>`,
      ...message
    });
    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error('[mailer] send failed:', message.subject, err?.message);
    return { ok: false, reason: 'send_failed', message: err?.message };
  }
}

/* ---------- 1 · internal notification ------------------------------------- */
export async function notifyInternal(payload) {
  const pairs = rows(payload);
  const who = payload.first_name || payload.company || payload.email || 'someone';
  const path = payload.capture_path || 'website';

  return send({
    to: CONFIG.notify,
    replyTo: payload.email || undefined,
    subject: `New lead · ${path} · ${who}`,
    text: `${who} came through ${path}.\n\n${textTable(pairs)}\n`,
    html: shell(`
<p style="margin:0 0 4px;font:600 12px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#C21E7A">New lead</p>
<h1 style="margin:0 0 22px;font:700 22px/1.25 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E">${esc(who)} came through ${esc(path)}</h1>
${htmlTable(pairs)}
${payload.email ? `<p style="margin:24px 0 0;font:14px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Reply to this email and it goes straight to ${esc(payload.email)}.</p>` : ''}`)
  });
}

/* ---------- 2 · results back to the visitor ------------------------------- */
const RESULT_PATHS = new Set(['brand_signal_test', 'fit_finder']);

export async function sendVisitorResults(payload) {
  if (!RESULT_PATHS.has(payload.capture_path)) return { ok: true, skipped: 'not_a_result_path' };
  if (!payload.email) return { ok: false, reason: 'no_recipient' };

  const name = payload.first_name ? `${payload.first_name}, ` : '';
  const isSignal = payload.capture_path === 'brand_signal_test';

  const body = isSignal ? signalBody(payload, name) : fitBody(payload, name);
  return send({ to: payload.email, replyTo: CONFIG.notify, ...body });
}

function signalBody(p, name) {
  const pillars = String(p.pillar_scores || '').split('|').filter(Boolean)
    .map((s) => { const [n, v] = s.split(':'); return [n, `${v}%`]; });

  return {
    subject: `Your brand signal score: ${p.signal_score ?? ''}`.trim(),
    text:
`${name}here is your brand signal result.

Score: ${p.signal_score} out of 100
Band: ${p.signal_band}

${pillars.length ? 'By pillar\n' + textTable(pillars) + '\n\n' : ''}${p.weak_fixes ? `Your weakest areas, and what we would do about each\n\n${p.weak_fixes}\n\n` : ''}Want to walk through it? Book a free brand review:
${site.calendly.brandReview}

Kija Creative`,
    html: shell(`
<p style="margin:0 0 4px;font:600 12px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#C21E7A">Brand signal test</p>
<h1 style="margin:0 0 6px;font:700 40px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E">${esc(p.signal_score)}<span style="font-size:20px;color:#9a9a9a">/100</span></h1>
<p style="margin:0 0 24px;font:600 15px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#C21E7A">${esc(p.signal_band)}</p>
${pillars.length ? `<h2 style="margin:0 0 10px;font:600 14px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b">By pillar</h2>${htmlTable(pillars)}` : ''}
${p.weak_fixes ? `<h2 style="margin:28px 0 10px;font:600 14px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b">Your weakest areas</h2>
<p style="margin:0;font:14px/1.7 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E;white-space:pre-wrap">${esc(p.weak_fixes)}</p>` : ''}
<p style="margin:30px 0 14px;font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E">Want to walk through it with us? Thirty minutes, no charge, no deck.</p>
${button(site.calendly.brandReview, 'Book a free brand review')}`)
  };
}

function fitBody(p, name) {
  const pairs = rows({
    recommended_offer: p.recommended_offer,
    recommended_sequence: p.recommended_sequence,
    industry: p.industry,
    company_size: p.company_size,
    primary_constraint: p.primary_constraint,
    timeline: p.timeline
  });

  return {
    subject: `Your Fit Finder result: ${p.recommended_offer || 'recommendation'}`,
    text:
`${name}here is what the Fit Finder landed on.

${textTable(pairs)}

This is a starting point, not a quote. What it costs and how long it takes are
both call conversations, because a number without scope is a guess.

Book a free consultation:
${site.calendly.consultation}

Kija Creative`,
    html: shell(`
<p style="margin:0 0 4px;font:600 12px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#C21E7A">Fit Finder</p>
<h1 style="margin:0 0 22px;font:700 22px/1.25 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1E0A1E">${esc(name)}here is what we would start with</h1>
${htmlTable(pairs)}
<p style="margin:26px 0 14px;font:14px/1.7 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6b6b6b">This is a starting point, not a quote. What it costs and how long it takes are both call conversations, because a number without scope is a guess.</p>
${button(site.calendly.consultation, 'Book a free consultation')}`)
  };
}
