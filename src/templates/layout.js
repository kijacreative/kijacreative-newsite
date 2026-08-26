import { site, nav, footerNav } from '../data/site.js';

export const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- head ---------------------------------------------------------- */
function head(p) {
  const title = p.title ? `${p.title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = p.description || site.description;
  const url = site.url + (p.path === '/' ? '' : p.path);
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
${p.noindex ? '<meta name="robots" content="noindex,follow">\n' : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1E0A1E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="/assets/tokens.css">
<link rel="stylesheet" href="/assets/global.css">
${p.schema ? `<script type="application/ld+json">${JSON.stringify(p.schema)}</script>` : ''}
${p.headInline ? `<script>${p.headInline}</script>` : ''}`;
}

/* ---------- nav ----------------------------------------------------------- */
function navbar(p) {
  const link = (l) => `<a href="${l.href}"${p.path.startsWith(l.href) && l.href !== '/' ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`;
  return `<nav class="k-nav">
  <div class="k-nav__in">
    <a class="k-mark" href="/" aria-label="${esc(site.name)} home">KIJA<span>/</span>CREATIVE</a>
    <div class="k-nav__links">
      ${nav.map(link).join('\n      ')}
      <a class="k-btn k-btn--primary k-btn--sm k-nav__cta" href="/book" data-track="cta_nav_book">Book a call</a>
    </div>
    <button class="k-burger" data-burger aria-expanded="false" aria-controls="k-drawer">Menu</button>
  </div>
</nav>
<div class="k-drawer" id="k-drawer" data-drawer data-open="false">
  ${nav.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('\n  ')}
  <a href="/the-kija-method">Brand Signal Test</a>
  <a class="k-btn k-btn--primary k-btn--lg" href="/book" data-track="cta_drawer_book">Book a call</a>
</div>`;
}

/* ---------- footer -------------------------------------------------------- */
function footer() {
  const v = site.vitals;
  return `<footer class="k-foot" id="footer">
  <div class="k-wrap">
    <div class="k-foot__grid">
      <div>
        <a class="k-mark" href="/" style="font-size:32px">KIJA<span>/</span>CREATIVE</a>
        <p class="k-dim k-sm" style="margin-top:16px;max-width:34ch">${esc(site.tagline)}</p>
        <p class="k-sm" style="margin-top:20px"><a class="k-link" href="/book" data-track="cta_footer_book">Book a call</a></p>
      </div>
      ${footerNav.map((col) => `<div>
        <h4>${esc(col.title)}</h4>
        ${col.links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('\n        ')}
      </div>`).join('\n      ')}
    </div>
    <div class="k-foot__base">
      <div>
        <span>&copy; ${new Date().getFullYear()} ${esc(site.name)}. ${esc(site.location)}.</span>
        <span class="k-foot__legal"><a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a></span>
      </div>
      <!-- Website Design self-demonstration: published every deploy. -->
      <div class="k-vitals" title="Core Web Vitals, measured at last deploy">
        <span>LCP <b>${esc(v.lcp)}</b></span><span>CLS <b>${esc(v.cls)}</b></span>
        <span>INP <b>${esc(v.inp)}</b></span><span>Page <b>${esc(v.weight)}</b></span>
      </div>
    </div>
  </div>
</footer>
<div class="k-stripe"></div>`;
}

/* ---------- sticky mobile CTA -------------------------------------------- */
function sticky(p) {
  if (p.noSticky) return '';
  const secondary = p.stickySecondary || { label: 'Brand Signal Test', href: '/the-kija-method' };
  return `<div class="k-sticky" data-sticky data-show="false">
  <a class="k-btn k-btn--ghost k-btn--sm" href="${secondary.href}" data-track="cta_sticky_secondary">${esc(secondary.label)}</a>
  <a class="k-btn k-btn--primary k-btn--sm" href="/book" data-track="cta_sticky_book">Book a call</a>
</div>`;
}

/* ---------- assembly ------------------------------------------------------ */
export function page(p) {
  const scripts = ['/assets/global.js', ...(p.scripts || [])]
    .map((s) => `<script src="${s}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="en"${p.variant ? ` data-variant="${p.variant}"` : ''}>
<head>
${head(p)}
</head>
<body>
<a class="k-skip" href="#main">Skip to content</a>
<div class="k-stripe"></div>
${navbar(p)}
<main id="main">
${p.body}
</main>
${footer()}
${sticky(p)}
${scripts}
${p.inline ? `<script>${p.inline}</script>` : ''}
</body>
</html>`;
}

/* ---------- A/B assignment ------------------------------------------------
   Emitted in <head> so the redirect happens before first paint. GHL native
   split testing is preferred where the funnel supports it; this is the
   fallback for the steps where it does not. Assignment is sticky for 30 days.
   -------------------------------------------------------------------------- */
export function abRedirect(testId, basePath, variantPaths) {
  return `(function(){try{
  var k='kija_ab_${testId}',q=new URLSearchParams(location.search),m=${JSON.stringify(variantPaths)};
  var keys=Object.keys(m),f=q.get('v');
  if(f&&keys.indexOf(f)>-1){document.cookie=k+'='+f+';max-age=2592000;path=/;SameSite=Lax';}
  // Split rather than match: a regex built from a string literal inside a
  // generated script is one backslash away from silently never matching.
  var v=null,parts=document.cookie.split(';');
  for(var i=0;i<parts.length;i++){var kv=parts[i].split('='),n=kv[0].trim();
    if(n===k){v=(kv[1]||'').trim();break;}}
  if(!v||keys.indexOf(v)<0){v=keys[Math.floor(Math.random()*keys.length)];
    document.cookie=k+'='+v+';max-age=2592000;path=/;SameSite=Lax';}
  // Compare normalised paths. Hosts differ on trailing slashes, and a naive
  // string compare turns this into an infinite redirect loop.
  var dest=m[v],norm=function(x){return (x||'').replace(/\\/+$/,'')||'/';};
  if(dest&&norm(dest)!==norm(location.pathname)){location.replace(dest+location.search+location.hash);}
}catch(e){}})();`;
}

/* Body-only output for pasting into a GHL custom code block.
   Global CSS/JS are already injected at the funnel level, so they are
   deliberately absent here — see CLAUDE.md §Deploy. */
export function fragment(p) {
  return `<!-- ${site.name} — ${p.path} ${p.variant ? `(variant ${p.variant})` : ''}
     Paste into the GHL page's custom code block.
     Requires funnel-level global.css + global.js. -->
${p.variant ? `<script>document.documentElement.setAttribute('data-variant','${p.variant}');</script>\n` : ''}${p.body}
${(p.scripts || []).map((s) => `<script src="${s}" defer></script>`).join('\n')}
${p.inline ? `<script>${p.inline}</script>` : ''}`;
}
