#!/usr/bin/env python3
"""
Build a single-file, clickable preview of the whole built site (dist/).

Every page renders in a full-screen iframe; internal links (and the ink-panel
exit) change page through window.KIJA_NAV instead of the browser, and the
address bar keeps a plain #name per page so links to the preview can be
shared. Shared CSS, scripts and media are stored once and stitched into each
page as it opens. A/B redirect scripts are stripped, so each page shows its
main variant.

Usage:  python3 scripts/site-preview.py  [out.html]  [media-uris.json]
media-uris.json (optional) maps /assets/media/... paths to lighter data URIs;
without it the full-size files in dist/assets/media are embedded.
"""
import base64, json, mimetypes, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
A = os.path.join(DIST, 'assets')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'site-preview.html')

def read(p): return open(p, encoding='utf-8').read()
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()

# shared CSS with fonts inlined
fonts = re.sub(r"url\((/assets/fonts/[^)]+)\)",
               lambda m: "url(data:font/woff2;base64," + b64(os.path.join(A, 'fonts', m.group(1).split('/')[-1])) + ")",
               read(os.path.join(A, 'fonts.css')))
CSS = fonts + read(os.path.join(A, 'tokens.css')) + read(os.path.join(A, 'global.css'))
JS = {
    'global.js': read(os.path.join(A, 'global.js')),
    'motion.js': read(os.path.join(A, 'motion.js')),
}
for f in os.listdir(os.path.join(A, 'widgets')):
    JS['widgets/' + f] = read(os.path.join(A, 'widgets', f))
for f in os.listdir(os.path.join(A, 'vendor')):
    JS['vendor/' + f] = read(os.path.join(A, 'vendor', f))

# media: lighter preview copies if provided, else the real files
if len(sys.argv) > 2 and os.path.exists(sys.argv[2]):
    MEDIA = json.load(open(sys.argv[2]))
else:
    MEDIA = {}
    for r, _, fs in os.walk(os.path.join(A, 'media')):
        for f in fs:
            p = os.path.join(r, f)
            if f.endswith('.md'): continue
            key = '/assets/' + os.path.relpath(p, A).replace(os.sep, '/')
            MEDIA[key] = 'data:%s;base64,%s' % (mimetypes.guess_type(f)[0] or 'application/octet-stream', b64(p))

manifest = json.load(open(os.path.join(DIST, 'ghl', 'manifest.json')))
PAGES = {}
for m in manifest:
    url = m['url']
    if m.get('variant') and url.count('/') > 1 and not url.startswith('/thanks'):
        continue                                  # alternate A/B variants: main version only
    f = os.path.join(DIST, 'index.html') if url == '/' else os.path.join(DIST, url.strip('/'), 'index.html')
    if url == '/404': f = os.path.join(DIST, '404.html')
    if not os.path.exists(f): continue
    h = read(f)
    h = re.sub(r'<link rel="preload"[^>]*>\n?', '', h)
    h = re.sub(r'<link rel="stylesheet" href="/assets/[^"]+">\n?', '', h)   # (any ?v= fingerprint included)
    h = h.replace('</head>', '<style>@@CSS@@</style></head>', 1)
    h = re.sub(r'<script>(?:(?!</script>).)*?kija_ab_.*?</script>', '', h, flags=re.S)   # A/B redirects
    h = re.sub(r'<script src="/assets/([^"?]+)(?:\?[^"]*)?" defer></script>',
               lambda mm: '@@JS:%s@@' % mm.group(1), h)
    h = re.sub(r'<source src="https://kijacreative\.com[^"]*" type="video/mp4">\s*', '', h)
    PAGES[url] = h

shell = r"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Kija Creative — site preview</title>
<style>
:root{color-scheme:light}
html,body{margin:0;height:100%;background:#F5F3EC}
iframe{position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:#F5F3EC}
.pv{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2;font:700 11px/1 system-ui,sans-serif;
  color:#F5F3EC;background:rgba(30,10,30,.86);padding:7px 10px;border-radius:999px;pointer-events:none;letter-spacing:.01em}
</style></head><body>
<iframe id="f" title="Kija Creative site"></iframe>
<div class="pv" id="pv">Site preview</div>
<script>
var PAGES=@@PAGES@@, CSS=@@CSSJSON@@, JS=@@JSJSON@@, MEDIA=@@MEDIA@@;
var keys=Object.keys(MEDIA).sort(function(a,b){return b.length-a.length;});
function toHash(p){return p==='/'?'home':p.replace(/^\/|\/$/g,'').replace(/\//g,'--');}
function fromHash(h){h=(h||'').replace(/^#/,'');if(!h||h==='home')return '/';return '/'+h.replace(/--/g,'/');}
var PRE='<script>window.KIJA_PREVIEW=true;window.KIJA_NAV=function(u){parent.postMessage({kijaNav:u},"*");};<\/script>';
var POST='<script>document.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0)return;var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target)return;var h=a.getAttribute("href")||"";if(h.charAt(0)!=="/")return;e.preventDefault();window.KIJA_NAV(h);});<\/script>';
function build(p){
  var h=PAGES[p];
  h=h.replace('@@CSS@@',function(){return CSS;});
  h=h.replace(/@@JS:([^@]+)@@/g,function(_,n){return JS[n]?'<script>'+JS[n].replace(/<\/script/gi,'<\\/script')+'<\/script>':'';});
  if(h.indexOf('widgets/work-explorer.js')>-1||/data-explore/.test(h)) h=h.replace('<\/body>','<script>'+JS['vendor/gsap.min.js']+'<\/script><\/body>');
  for(var i=0;i<keys.length;i++){h=h.split(keys[i]).join(MEDIA[keys[i]]);}
  h=h.replace('<head>','<head>'+PRE).replace('<\/body>',POST+'<\/body>');
  return h;
}
var f=document.getElementById('f'), pv=document.getElementById('pv'), pendingHash=null;
f.addEventListener('load',function(){ if(!pendingHash) return; var h=pendingHash; pendingHash=null;
  try{ var d=f.contentDocument, el=d&&d.getElementById(h); if(el) el.scrollIntoView(); }catch(e){} });
function show(path, push){
  pendingHash=(path.split('#')[1]||'').replace(/[^\w-]/g,'')||null;
  var p=path.split('#')[0].split('?')[0]; if(p.length>1)p=p.replace(/\/$/,'');
  if(!PAGES[p]) p=PAGES['/404']?'/404':'/';
  f.srcdoc=build(p); pv.textContent='Site preview · '+p;
  var h='#'+toHash(p); if(push){ if(location.hash!==h) history.pushState(null,'',h);} else history.replaceState(null,'',h);
}
window.addEventListener('message',function(e){if(e.data&&e.data.kijaNav)show(e.data.kijaNav,true);});
window.addEventListener('popstate',function(){show(fromHash(location.hash),false);});
show(fromHash(location.hash),false);
</script></body></html>"""

js_safe = {k: v for k, v in JS.items() if k != 'vendor/gsap.min.js'}
js_safe['vendor/gsap.min.js'] = JS['vendor/gsap.min.js']
def dump(o): return json.dumps(o).replace('</', '<\\/')
html = (shell.replace('@@PAGES@@', dump(PAGES)).replace('@@CSSJSON@@', dump(CSS))
        .replace('@@JSJSON@@', dump(js_safe)).replace('@@MEDIA@@', dump(MEDIA)))
open(out, 'w', encoding='utf-8').write(html)
print('%d pages, %.2f MB -> %s' % (len(PAGES), len(html) / 1048576, out))
