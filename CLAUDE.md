# kijacreative.com — rebuild

Source of truth for the new site. **The repo is authoritative; GoHighLevel is a
deploy target.** Never edit a page inside the GHL editor — the next build will
overwrite it and the change will be lost with no record of what it was.

---

## What this is

One data-driven build that emits two things:

| Output | What it is | Used for |
| --- | --- | --- |
| `dist/` | A complete standalone static site | Preview, QA, Lighthouse, client review, and a fallback host if GHL becomes the wrong answer |
| `dist/ghl/` | One body-only fragment per page | Pasting into the matching GHL page's custom code block |

`dist/ghl/manifest.json` maps every URL to its fragment file, its variant, and
which widget scripts it needs.

```bash
npm run build     # emit dist/
npm run dev       # build, then serve dist/ on :8080
npm run check     # build + pre-launch checks (titles, h1s, alt text, template leaks)
npm run vitals    # refresh the published Core Web Vitals from a Lighthouse run
```

## Layout

```
src/
  tokens.css            48 custom properties. The single source of truth for the brand.
  global.css            Component library. Paste once at the GHL funnel level.
  global.js             Runtime: nav, accordion, reveal, A/B, attribution, analytics, submit.
  data/                 Content. Edit here, never in a template.
    site.js             Nav, footer, GHL ids, published vitals.
    cases.js            9 case studies. PROOF RULE enforced in comments.
    services.js         5 capability lines against the 8-block skeleton.
    offers.js           5 packages. Pricing posture lives here.
  templates/            layout.js (page shell, A/B redirect), blocks.js (reusable blocks).
  pages/                One module per page family.
  widgets/              brand-signal-test.js, fit-finder.js, lead-form.js
server/
  ghl-proxy.mjs         The only code that may hold the GHL token.
scripts/                check.mjs, vitals.mjs
build.mjs               Assembles everything. Fails the build on broken internal links.
```

## Non-negotiables

These are load-bearing. Changing one is a decision, not a tweak.

1. **No raw hex outside `tokens.css`.** If you need a colour that is not a
   token, the answer is usually that you need a different token.
2. **Mint is the action colour and nothing else.** The moment a mint element is
   not clickable, every mint element stops meaning anything.
3. **Verified numbers only.** A figure may appear on the site only if the client
   confirmed it in writing. No extrapolation, no "up to", no invented dollar
   figures. `cases[].metrics` is the only place figures live; leave it empty
   rather than soften a number.
4. **No stock photography.** Anywhere. The case study thumbnails are typographic
   by design until real photography exists.
5. **No countdown timers or manufactured urgency.** We flagged it as a red flag
   in a client audit; running it ourselves would be the one thing this whole
   site is arguing against.
6. **The Fit Finder never quotes a price and never promises a timeline.** Both
   are call conversations. The guardrail is asserted in the widget's header
   comment and should stay there.
7. **Content is visible unless JS proves it can hide it.** Scroll reveals and
   accordions both fail open. GHL's editor and some in-app browsers do not run
   observers or transitions reliably, and a page that renders blank there is
   worse than one that renders unanimated.
8. **The footer vitals are a promise.** Update them from a real Lighthouse run
   (`npm run vitals`), never by hand.

## Deploy

### 1. Funnel-level assets (once per funnel, re-paste when they change)

In GHL → Funnel → Settings → Custom CSS/JS, paste:

- `dist/assets/tokens.css` then `dist/assets/global.css` into **Custom CSS**
- `dist/assets/global.js` into **Custom JS (footer)**

Widget scripts (`brand-signal-test.js`, `fit-finder.js`, `lead-form.js`) go on
the pages that need them — `manifest.json` says which. Host them somewhere with
a stable URL, or inline them into the page's code block.

Build one funnel per section (Work, Services, Packages, Capture) rather than one
monolith. It keeps step counts manageable and lets variants live as sibling
steps with independent URLs.

### 2. Pages

For each entry in `manifest.json`, create the GHL page at `url` and paste the
contents of `ghlFragment` into a single custom code block. Nothing goes in the
WYSIWYG — GHL strips structural tags there.

Every fragment sets its own `data-variant` when it is a variant page. The
canonical page carries the A/B assignment script in `<head>`; if you use GHL
native split testing instead, delete that script from the canonical page so the
two mechanisms do not fight.

### 3. The lead proxy

`server/ghl-proxy.mjs` is a fetch-standard handler. Deploy it to Vercel,
Netlify or Cloudflare Workers, then set the endpoint on the site:

```html
<script>window.KIJA_ENDPOINT = 'https://api.kijacreative.com/lead';</script>
```

Put that above `global.js` in the funnel's custom JS.

**Without an endpoint the site still works** — forms validate, widgets score,
visitors reach the right thank-you page — but nothing reaches the CRM. The
payload is logged to the console when `?kdebug=1` is present.

Required environment variables:

| Variable | What | Status |
| --- | --- | --- |
| `GHL_PIT_TOKEN` | Private Integration token, 4 scopes: contacts.write, contacts.readonly, opportunities.write, locations/customFields.readonly | **BLOCKED — Phase 0** |
| `GHL_LOCATION_ID` | `pPvsVabo4AEGhFUMtk0e` | known |
| `GHL_PIPELINE_ID` | `1jAQxcIIIG1G1cx8c1nG` | known |
| `GHL_STAGE_BOOKED` | "Strategy Call Booked" stage id | **BLOCKED — Phase 0** |
| `GHL_STAGE_NURTURE` | "Nurture" stage id | **BLOCKED — Phase 0** |
| `SLACK_WEBHOOK_URL` | Internal ping to Kiel + Abby | optional |
| `ALLOWED_ORIGINS` | Comma-separated. Defaults to the two production origins. | set on deploy |
| `GHL_FIELD_*` | One per custom field — see `FIELD_MAP` in the proxy | **BLOCKED — Phase 0** |

Custom fields to create in GHL (20, not 14 — the Fit Finder and attribution
capture more than the original estimate):

```
capture_path · variant_id · signal_score · signal_band · weak_areas ·
pillar_scores · industry · company_size · current_state · primary_constraint ·
timeline · budget_band · recommended_offer · recommended_sequence · context ·
utm_source · utm_medium · utm_campaign · landing_page · referrer
```

An unmapped field is skipped and reported in the proxy response under
`unmappedFields`, so a missing id degrades one field rather than the lead.

### 4. Before you call it launched

Test every capture path end to end and confirm, for each: contact created,
correct tags applied, correct pipeline stage set, correct sequence fired,
variant id recorded.

```
/the-kija-method  (b1, b2, b3)   /brand-review  (c1, c2)
/fit-finder       (d1, d2)       /book          (a1, a2)
```

## A/B tests running at launch

Nine capture variants from the plan, plus a pricing-posture test on the two
flagship packages. One test dimension per pair — otherwise the result teaches
you nothing. **Minimum 200 sessions per variant before calling anything.**

| Test | Variants | Dimension |
| --- | --- | --- |
| `book` | a1 calendar first / a2 three questions first | Qualification placement |
| `signal_test` | b1 score free / b2 email gate / b3 short ungated | Gate position and length |
| `brand_review` | c1 "free" / c2 "apply, limited slots" | Value framing |
| `fit_finder` | d1 conversational / d2 structured | Interaction model |
| `launch_kit` | a price shown / b price hidden | Pricing posture (Decision 5) |
| `growth_engine` | a price shown / b price hidden | Pricing posture (Decision 5) |

Force a variant for testing with `?v=b2`. Assignment is sticky for 30 days.

## Analytics

Every CTA carries `data-track="<stable_event_name>"`. `KIJA.track()` fans out to
PostHog, GA4 and `dataLayer`, and never throws when a sink is absent. Event
names are stable — rename one and you break the historical series.

Key events: `page_view`, `variant_assigned`, `lead_submitted`,
`signal_test_started|answer|completed`, `fit_finder_started|answer|completed`,
`objection_opened`, `work_filtered`, `scroll_depth`, plus one per CTA.

## Known open decisions

Tracked in full in the strategy doc. The three that block content:

1. **Final offer architecture** — `src/data/offers.js` is built to section 02 of
   the plan, which was a read of where the offers are heading, not confirmed.
   Renaming an offer propagates to nav, `/packages`, every cross-link and the
   Fit Finder's routing rules.
2. **What changed in the brand** — `tokens.css` implements the palette and type
   from the plan. If the brand shifted, change the tokens and the whole site
   follows.
3. **Client permissions** — Van Country and Mammogram Poster Girls metrics and
   quotes. `cases[].quote` is `null` for all three flagships; nothing attributed
   publishes until it is confirmed in writing.

Smaller, marked in code:

- `offers[].price` is `null` for every tier. Set the three productized strings
  and the pages switch from "Quoted after scope" to "Starting at X" on their own.
- `/privacy` and `/terms` are working drafts written to match what the site
  actually does. They need a lawyer before launch.
- `/now` must be updated monthly. A stale campaign shelf is worse than no
  campaign shelf.
- Self-host the three font families before launch. Google Fonts is a third-party
  request on the critical path and it will show up in the LCP we publish.
