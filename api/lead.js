/* ==========================================================================
   POST /api/lead — the capture endpoint every form on the site posts to.

   Thin Vercel wrapper around server/ghl-proxy.mjs, which is deliberately
   platform-agnostic so this can move to Netlify or Cloudflare unchanged.

   Edge runtime: the proxy is written against the fetch standard
   (Request in, Response out), which is exactly what the edge runtime gives us.

   Until the GHL env vars are set this returns {ok:false, reason:"not_configured"}
   and logs the payload. The site handles that: the visitor still reaches the
   right thank-you page, and nothing is lost that was not already unconfigured.
   ========================================================================== */
export const config = { runtime: 'edge' };

export { default } from '../server/ghl-proxy.mjs';
