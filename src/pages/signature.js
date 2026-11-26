/* ==========================================================================
   /signature — the team's email signature builder.

   An internal tool, not a marketing page: noindex, no sticky CTA, not in the
   nav. It is on the site rather than somewhere else because the headshot has
   to be uploaded somewhere public, and /api/signature-photo is here.

   EXCEPTION TO NON-NEGOTIABLE 1 (no raw hex outside tokens.css).
   SIGNATURE_PALETTE below is literal hex on purpose. Its values are written
   into email HTML as inline styles, and no mail client resolves a CSS custom
   property — Outlook renders through Word, which barely resolves CSS at all.
   These four values mirror tokens and must be changed with them:

     accent -> --k-magenta   c2 -> --k-yellow
     c3     -> --k-mint      bar -> --k-ink

   The mint here is trim on a printed-looking rule, not an action colour, so
   non-negotiable 2 is intact: nothing mint in the signature is clickable, and
   the one clickable thing (the booking button) is magenta.
   ========================================================================== */
import { hero, head } from '../templates/blocks.js';
import { site } from '../data/site.js';

const SIGNATURE_PALETTE = {
  accent: '#C21E7A',
  c2: '#F5E61A',
  c3: '#3DFFAE',
  bar: '#1E0A1E'
};

const STYLE = `
<style>
  .sig-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--k-s5);align-items:start}
  @media (max-width:980px){.sig-grid{grid-template-columns:minmax(0,1fr)}}

  .sig-panel{padding:var(--k-s5);background:var(--k-print);border-radius:var(--k-r-lg);box-shadow:var(--k-shadow-soft)}
  .sig-set{border:0;padding:0;margin:0 0 var(--k-s6)}
  .sig-set:last-child{margin-bottom:0}
  .sig-set legend{padding:0 0 var(--k-s3);font-size:var(--k-t-xs);font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--k-dim)}
  .sig-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--k-s4)}
  @media (max-width:620px){.sig-two{grid-template-columns:minmax(0,1fr)}}

  .sig-check{display:flex;align-items:center;gap:var(--k-s2);margin-bottom:var(--k-s3);cursor:pointer}
  .sig-check input{width:17px;height:17px;accent-color:var(--k-magenta)}

  .sig-drop{display:flex;align-items:center;gap:var(--k-s4);flex-wrap:wrap;padding:var(--k-s4);border:1px dashed var(--k-ink-line-2);border-radius:var(--k-r-lg)}
  .sig-drop.is-over{border-color:var(--k-magenta)}
  .sig-thumb{flex:0 0 auto;width:58px;height:58px;border-radius:50%;border:2px solid var(--k-magenta);background:var(--k-print) center/cover no-repeat}
  .sig-drop__copy{flex:1 1 180px;min-width:0}
  .sig-status--ok{color:var(--k-magenta);font-weight:700}
  .sig-status--warn{color:var(--k-ink);font-weight:700}

  .sig-linkrow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) auto;gap:var(--k-s3);align-items:center;margin-bottom:var(--k-s3)}
  @media (max-width:620px){.sig-linkrow{grid-template-columns:minmax(0,1fr)}}
  .sig-remove{border:0;background:none;padding:0;color:var(--k-magenta);font:inherit;font-size:var(--k-t-xs);font-weight:700;cursor:pointer}

  .sig-colors{display:flex;flex-wrap:wrap;gap:var(--k-s4)}
  .sig-colors label{display:flex;align-items:center;gap:var(--k-s2);font-size:var(--k-t-xs);color:var(--k-dim);cursor:pointer}
  .sig-color{width:36px;height:30px;padding:2px;border:1px solid var(--k-ink-line-2);border-radius:var(--k-r-sm);background:none;cursor:pointer}

  .sig-stage{padding:var(--k-s5);background:var(--k-print);border-radius:var(--k-r-lg);box-shadow:var(--k-shadow-soft);overflow-x:auto}
  .sig-stage__rule{height:1px;margin-bottom:var(--k-s5);background:var(--k-ink-line)}
  .sig-actions{display:flex;flex-wrap:wrap;gap:var(--k-s3);margin-top:var(--k-s4)}
  .sig-code{max-height:240px;overflow:auto;margin-top:var(--k-s4);padding:var(--k-s3);background:var(--k-print);border:1px solid var(--k-ink-line);border-radius:var(--k-r-sm);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.55;white-space:pre-wrap;word-break:break-word;color:var(--k-dim)}
</style>`;

export function signaturePage() {
  const body = `
${hero({
    eyebrow: 'Internal tool',
    title: 'Email<br>signature',
    lede: '<b>Fill this in once and paste it into Gmail.</b> The headshot is cropped to a square and uploaded to the site, so it loads for everyone you email — not just the people whose mail client happens to allow embedded images.'
  })}
${STYLE}
<section class="k-section" style="padding-top:0">
  <div class="k-wrap">
    <div class="sig-grid">

      <div class="sig-panel">
        <fieldset class="sig-set">
          <legend>Person</legend>
          <div class="sig-two">
            <label class="k-field"><span class="k-field__l">Name</span>
              <input class="k-input" id="sig-name" data-sig="name" type="text" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Title</span>
              <input class="k-input" id="sig-role" data-sig="role" type="text" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Company</span>
              <input class="k-input" id="sig-company" data-sig="company" type="text" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Website</span>
              <input class="k-input" id="sig-website" data-sig="website" type="text" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Email</span>
              <input class="k-input" id="sig-email" data-sig="email" type="email" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Phone</span>
              <input class="k-input" id="sig-phone" data-sig="phone" type="tel" autocomplete="off"></label>
          </div>
        </fieldset>

        <fieldset class="sig-set">
          <legend>Photo</legend>
          <label class="sig-check"><input id="sig-photoOn" data-sig="photoOn" type="checkbox"> <span>Show photo</span></label>

          <div class="sig-drop" id="sig-drop">
            <span class="sig-thumb" id="sig-thumb" aria-hidden="true"></span>
            <div class="sig-drop__copy">
              <p class="k-sm"><b>Drop a photo here, or choose a file.</b></p>
              <p class="k-sm k-dim">Cropped to a 1:1 square at 208px, then uploaded to the site.</p>
            </div>
            <input id="sig-file" type="file" accept="image/*" hidden>
            <button class="k-btn k-btn--ghost k-btn--sm" id="sig-pick" type="button">Choose</button>
          </div>

          <p class="k-sm" id="sig-photo-status" role="status" aria-live="polite"></p>

          <label class="k-field"><span class="k-field__l">Upload key</span>
            <input class="k-input" id="sig-key" type="password" autocomplete="off" placeholder="Ask Kiel for this">
          </label>
          <p class="k-sm k-dim">Stops the upload route being a free file host for anyone who finds it. Stored in this browser only.</p>

          <label class="k-field"><span class="k-field__l">Photo URL</span>
            <input class="k-input" id="sig-photoUrl" data-sig="photoUrl" type="url" autocomplete="off">
          </label>
          <button class="sig-remove" id="sig-clear-photo" type="button">Remove photo</button>
        </fieldset>

        <fieldset class="sig-set">
          <legend>Links</legend>
          <div id="sig-links"></div>
          <button class="k-btn k-btn--ghost k-btn--sm" id="sig-add-link" type="button">Add link</button>
        </fieldset>

        <fieldset class="sig-set">
          <legend>Booking button</legend>
          <label class="sig-check"><input id="sig-bookingOn" data-sig="bookingOn" type="checkbox"> <span>Show booking button</span></label>
          <div class="sig-two">
            <label class="k-field"><span class="k-field__l">Button text</span>
              <input class="k-input" id="sig-bookingLabel" data-sig="bookingLabel" type="text" autocomplete="off"></label>
            <label class="k-field"><span class="k-field__l">Booking link</span>
              <input class="k-input" id="sig-bookingUrl" data-sig="bookingUrl" type="url" autocomplete="off"></label>
          </div>
        </fieldset>

        <fieldset class="sig-set">
          <legend>Colours</legend>
          <div class="sig-colors">
            <label><input class="sig-color" id="sig-accent" data-sig="accent" type="color"> Accent</label>
            <label><input class="sig-color" id="sig-c2" data-sig="c2" type="color"> Rule 2</label>
            <label><input class="sig-color" id="sig-c3" data-sig="c3" type="color"> Rule 3</label>
            <label><input class="sig-color" id="sig-barColor" data-sig="barColor" type="color"> Bar</label>
          </div>
        </fieldset>
      </div>

      <div>
        <div class="sig-stage">
          <div class="sig-stage__rule"></div>
          <div id="sig-out"></div>
        </div>
        <div class="sig-actions">
          <button class="k-btn k-btn--primary" id="sig-copy" type="button" data-track="signature_copy">Copy signature</button>
          <button class="k-btn k-btn--ghost" id="sig-copy-html" type="button" data-track="signature_copy_html">Copy HTML</button>
        </div>
        <pre class="sig-code" id="sig-code"></pre>
      </div>

    </div>
  </div>
</section>

<section class="k-section k-section--line">
  <div class="k-wrap">
    ${head({ title: 'Putting it in Gmail', sub: 'Four steps, once per person.' })}
    <ol class="k-sm" style="max-width:62ch;line-height:1.7">
      <li>Fill in the fields, add your photo, then press <b>Copy signature</b>.</li>
      <li>In Gmail: <b>Settings</b> &rarr; <b>See all settings</b> &rarr; <b>General</b> &rarr; <b>Signature</b>.</li>
      <li>Create or pick your signature, paste into the box, <b>Save changes</b>, and send yourself a test.</li>
      <li>If the paste comes out plain, use <b>Copy HTML</b> and paste that into an editor that accepts raw HTML.</li>
    </ol>
  </div>
</section>`;

  return {
    path: '/signature',
    title: 'Email signature builder',
    description: 'Internal tool: build the Kija Creative email signature and upload a headshot that loads for every recipient.',
    noindex: true,
    noSticky: true,
    scripts: ['/assets/widgets/signature-builder.js'],
    inline: `window.KIJA_SIGNATURE=${JSON.stringify({
      endpoint: '/api/signature-photo',
      palette: SIGNATURE_PALETTE,
      // Optional on purpose: site.calendly does not exist on every branch, and
      // site.calendar is the GHL widget being retired. Empty is a fine default
      // — the field is editable, and nobody wants a dead booking URL baked
      // into their signature.
      bookingUrl: site.calendly?.consultation || ''
    })};`,
    body
  };
}
