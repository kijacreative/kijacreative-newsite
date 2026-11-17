# kijacreative.com → new site: content transfer report
Pulled 2026-11-17 from the live WordPress site with the owner's permission. No login was used; everything here is from the public pages.

## What was pulled

All **13 published pages** (the live `/our-work/` page lists every one of them):
home · /work · /our-work · 8 case studies · /the-kija-method · /brand-review · /blog (empty).

Files in this folder:

| File | What it is |
|---|---|
| `kijacreative-live-content.md` | Every page, verbatim, in reading order |
| `kijacreative-live-content.json` | The same content structured: site, contact, Signal Test, Brand Review, 8 cases (stats, quotes, services, palettes, process, image URLs) |
| `asset-manifest.txt` | All 39 Kija-hosted images and video on the live site |
| `download-assets.sh` | Downloads all of them into `wp-uploads/`, keeping WordPress's folder structure. Run it on your machine; this sandbox can't reach your domain. |

Already applied to the repo: **14 redirects** in `vercel.json`, so old WordPress URLs land on the new site instead of 404ing (details at the bottom).

## Applied in v5 (at the owner's direction: "add the content from kijacreative.com")

- **Case studies.** The eight live projects are now the first eight entries in `src/data/cases.js`, in the live portfolio order (`featured: 1–8`). The live copy replaced the repo's earlier narratives for Oak Cliff Pilates, Van Country, Mammogram Poster Girls and Blue Plate Network, which did not match the live site. Honeycomb, Latino Arts Project, Beverage Display Design and Event Weis are new pages at /work/<slug>.
- **Figures.** The live site's published figures are in, except the two items flagged below: Blue Plate "12 Year Partnership" and Honeycomb "85%+".
- **Client quotes.** Amanda Mecsey and Cheryl Weis are both published on their case pages.
- **Contact.** `site.js` now carries signal@kijacreative.com, +1 480-544-6204, 2000 Greenville Ave. #6, Dallas, TX 75206, Instagram and LinkedIn. These show in the footer on every page and in the homepage structured data.
- **Option B v2.** Uses the live homepage copy: "Make your brand unmissable", the Signal teaser, featured case studies, "Good taste will not be replaced", Who we are, and Let's talk.
- **Still open:**
  - §1: the five repo-only cases, kept after the live eight
  - §4: Calendly vs GHL booking (GHL kept)
  - §5: the 6 vs 12 question Signal Test (Option B avoids stating a count)
  - §6: Option A still leads with "Most brands are broken"
  - §7: the Oak Cliff Pilates relationship wording
  - §8: the medical claim, which isn't used on the new site

## Applied in v6

- **The proof wall uses the live site only.** /work, the explorer, the client tapes and every service and package "matched proof" now draw on the eight live projects. The five repo-only cases are `listed: false`: their pages still build, but nothing lists them or links to them.
- **Live material on the wall.** Taglines, client quotes, brand palettes, voice lines, Oak Cliff Pilates studio locations, partner and brand lists, Event Weis method steps and the Latino Arts bilingual wordmark (`src/data/wall.js`).
- **Option B hero.** The live homepage reel (`2026/02/02182.mp4`) plays faded behind the headline, with scroll parallax. It streams from the live WordPress URL until `download-assets.sh` has been run in `src/media`; then it plays from the new site.
- **Photos.** Project photos appear on the wall, in case panels, and in a "The work" gallery on case pages, as soon as they are present in `src/media/wp-uploads`.

## Applied in v7: media in place

- **37 of 39 files arrived** (from download-assets.ps1). The two missing files (Jake's Gameday logo, Event Weis napkin sketch) are no longer on the live site; the site simply omits them.
- **Optimised into `src/media/wp-uploads`: 93 MB → 9.3 MB.**
  - Photos are WebP, max 1600 px.
  - Logos are PNG, max 900 px.
  - The reel is cut for the hero: starts at 1.0 s (skips the black first frame), runs 36 s, 12% cropped from each side (most of the black side bars on the OCP footage gone), 640×910, no audio, 5.6 MB.
  - The poster is the OCP Lower Greenville wall.
- **Where it appears:**
  - Option B's hero reel, as a portrait panel on the sticker side.
  - 32 photo and logo tiles on the proof wall.
  - "The work" galleries in case panels and on case pages.
  - Kija's K mark in Option B's brand review badge.
  - The site favicon, from the stacked logo.
- **Still in Drive, not used yet:**
  - Portfolio Selects 2026-11: Catawba Yaupon, Camp Firewalker, Darling Reclaimed, Dr. Stuart Lipton, Dimaco, plus Event Weis and Honeycomb extras.
  - The KIJA-# studio photos.
  - The edited OCP reels.

## Could not be pulled

1. **The six Signal Test questions, answers, scoring and result copy.** The quiz (`#kmp-quiz`) is drawn by JavaScript, so it is not in the page HTML. Export it from WordPress (the plugin's settings, or paste the questions), and it can replace or merge with the new site's 12-question widget.
2. **The embedded scheduler on /the-kija-method** (below "Stop guessing at the gap"). It's an embed; tell me which calendar it is.
3. **Media files themselves.** Use `download-assets.sh`. Three Van Country images are hotlinked from vancountry.com rather than hosted by Kija; get the client's OK and host copies.

## Decisions needed (the live site and the new repo disagree)

### 1. Which case studies ship
| In both | Live site only | New repo only |
|---|---|---|
| Oak Cliff Pilates, Van Country, Mammogram Poster Girls, Blue Plate Network | **Honeycomb, Latino Arts Project, Beverage Display Design, Event Weis** | Altacrest Capital, Seismic, GES, PowerX, Piehole Project |

The four live-only projects have full content in the JSON and can become pages. The five repo-only projects have no live counterpart. Keep, cut, or hold them?

### 2. Numbers: the repo's proof rule vs what the live site publishes
CLAUDE.md says a metric ships only if the client confirmed it in writing. The live site publishes figures the repo deliberately left out. Confirm each one before it goes into `cases.js`:

| Case | Live figure | Repo today | Note |
|---|---|---|---|
| Oak Cliff Pilates | 400%+, 1→3, 2x, **1,100+ members** | 400%, 1→3, 2× | "+" and member count are new |
| Blue Plate Network | **+78% inquiries, 2.3x engagement** | none (pending sign-off) | |
| Blue Plate Network | **"12 Year Partnership"** | — | Kija was established in 2022, so this can't be Kija's partnership. Probably Blue Plate's years in business (founded 2012, which is 14 years). Reword or drop. |
| Mammogram Poster Girls | +49%, **1000s screenings funded, 3 partners** | +49% | |
| Honeycomb | +67% demos, −18% sales cycle, **85%+ parking revenue captured** | — | 85% is a product claim from an illustrative calculator, not a Kija result. Suggest dropping it from the stats. |
| Event Weis | 9 bookings in 90 days, 3x inquiries, −60% spend | — | |
| Beverage Displays | 9+ brand partners | — | Also lists American Airlines, Veuve Clicquot and others by name: confirm Kija may name them. |

### 3. Client quotes
The live site carries two attributed quotes the repo doesn't have: **Amanda Mecsey** (Oak Cliff Pilates, Co-Owner) and **Cheryl Weis** (Event Weis, Founder). The repo marks quotes as a launch blocker until signed off. If both are approved, they go straight in.

### 4. Contact and booking
- Email: live **signal@kijacreative.com** · repo hello@kijacreative.com
- Phone **+1 480-544-6204** and address **2000 Greenville Ave. #6, Dallas, TX 75206** are on the live site and missing from the repo.
- Booking runs on **two systems**: "Book a call" in the live nav goes to **Calendly** (kiel-kijacreative/30min), while Brand Review uses the **GHL** calendar, which the repo's whole lead pipeline is built on. Pick one. GHL keeps the CRM intact.

### 5. Signal Test format
Live: **6 questions, ~90 seconds, no email required**, scored on message · look · conversion · consistency.
Repo: **12 questions**, scored on positioning · identity · digital presence · system clarity, with an email gate after the score.
These are different products under the same name.

### 6. Positioning lines
- Live leads with **"Make your brand unmissable"**, "Creative direction for what's next", "Good taste will not be replaced", and "We're the intersection of design, strategy, and technical execution."
- Both homepage options lead with **"Most brands are broken. We fix them by building systems, not visuals."**

Pick the lead line; the others can still appear as secondary copy.

### 7. Oak Cliff Pilates relationship and dates
- The repo calls Oak Cliff Pilates "Kija-operated", and both homepages use that as a differentiator ("We run a business on this").
- The live site presents Amanda Mecsey and her co-founders as the owners and doesn't say Kija operates it. Kija's office address is the Lower Greenville studio address.
- Dates don't line up either: the repo dates the work 2021–present, the live site says Kija was established in 2022, and the Bishop Arts studio dates from 2020.

Confirm the wording before launch.

### 8. Medical claim on Mammogram Poster Girls
Live text: "Early detection raises five-year survival rates above 99 percent." That figure holds for breast cancer found at the **localized** stage, not for early detection in general. Suggest: "When breast cancer is caught at the localized stage, the five-year survival rate is above 99 percent."

## Bugs on the live WordPress site (worth fixing even before the switch)
- **Latino Arts:** raw page-builder code `[/vc_column_text][/vc_column][/vc_row]` shows on the page.
- **Every page:** "LETS TALK" is missing its apostrophe.
- **Slide-out menu:** the Instagram link ends in a stray `%20`.
- **Case pages:**
  - "← All Work" points to /our-work/ (an internal page list) instead of /work/.
  - Four "Next Project" links drop the /work/ prefix.
- **Portfolio cards:** stray "BP" and "9+" before the service tags on Blue Plate and Beverage Displays.
- **Oak Cliff Pilates:** the revenue counter reads "0%+" until its animation runs; crawlers and no-JS visitors see 0%.
- **Brand Review:** an empty image tag in the footer area.
- **/blog:** linked but empty.
- **Whole site:** set to `noindex, nofollow`. Fine before launch, but the new site must not inherit it. It doesn't: the new site is indexable apart from variant and thank-you pages.

## Redirects added to vercel.json
Permanent:
- /our-work → /work
- /blog → /insights
- /oak-cliff-pilates, /blue-plate-network, /mammogram-poster-girls, /van-country, /latino-arts, /beverage-displays, /event-weis, /honeycomb → /work/<same slug>

The four temporary redirects for /work/honeycomb, /work/latino-arts, /work/beverage-displays and /work/event-weis were removed once those case pages were built (v5). /the-kija-method, /brand-review and /work already exist at the same paths.
