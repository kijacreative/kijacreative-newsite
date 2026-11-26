#!/usr/bin/env bash
# Kija Creative: collect Portfolio Selects from the shared drive into src/media/selects.
#
# macOS counterpart to collect-selects.ps1. Run it from anywhere:
#
#     bash content-import/collect-selects.sh
#
# It writes src/media/selects/<slug>/<base>.webp, which is what sel(slug, base)
# in src/data/studio.js resolves against. The PowerShell script keeps the Drive
# display name ("Dr. Stuart Lipton"), which never matched sel()'s slug; the
# slug_for map below is the fix.
#
# Everything still becomes WebP. On the first run the folder came to 137 MB as
# PNG and JPEG; the same images as WebP are 20 MB, which is the difference
# between a repo you can clone and one you cannot. cwebp keeps alpha on its
# own, so there is no transparency check to get wrong.
#
# Videos stay H.264 MP4 (no browser plays WebP video) with a WebP poster, and
# /work loads them with preload="none" so none of that weight is on first paint.
#
# Idempotent: a file whose output already exists is skipped. Delete a slug
# folder to rebuild just that project.
#
# Tools: sips (built in), cwebp (brew install webp), pdftoppm (brew install
# poppler), ffmpeg (brew install ffmpeg).
set -uo pipefail

# Where the shared drive is mounted. Override with KIJA_SELECTS_SRC if Drive
# for desktop puts it somewhere else, or if you keep a local copy:
#   KIJA_SELECTS_SRC=~/selects bash content-import/collect-selects.sh
REL="Shared drives/KIJA CREATIVE/KIJA TOP-LEVEL/01_INTERNAL/Media/Portfolio Selects 2026-11"
SRC="${KIJA_SELECTS_SRC:-}"
if [ -z "$SRC" ]; then
  for mount in "$HOME"/Library/CloudStorage/GoogleDrive-*; do
    [ -d "$mount/$REL" ] && SRC="$mount/$REL" && break
  done
fi
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/src/media/selects"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

MAXEDGE=1800        # longest edge for stills, px
WEBPQ=80            # WebP quality
ALPHAQ=90           # WebP alpha quality
PDFDPI=150          # raster density for PDF pages
VIDW=1280           # video width, px
VIDCRF=28           # H.264 quality (lower = better)
MAXPAGES=16         # safety cap on PDF pages

# Drive folder -> slug used by sel() in src/data/studio.js
slug_for() {
  case "$1" in
    "Camp Firewalker")              echo camp-firewalker ;;
    "Catawba Yaupon")               echo catawba-yaupon ;;
    "Darling Reclaimed")            echo darling-reclaimed ;;
    "Dimaco")                       echo dimaco ;;
    "Dr. Stuart Lipton")            echo dr-stuart-lipton ;;
    "Event Weis")                   echo event-weis ;;
    "Honeycomb")                    echo honeycomb ;;
    "Kink")                         echo kink ;;
    "Mammogram Poster Girls")       echo mammogram-poster-girls ;;
    "Nono's (Cliqbux)")             echo nonos ;;
    "Oak Cliff Pilates")            echo oak-cliff-pilates ;;
    "Packorial")                    echo packorial ;;
    "Palmers Lodge")                echo palmers-lodge ;;
    "Rio Jiu-Jitsu Lifestyle")      echo rio-jiu-jitsu ;;
    "TaylorMade Law")               echo taylormade-law ;;
    "Triton Studios")               echo triton-studios ;;
    "Van Country")                  echo van-country ;;
    "Whittle + Watt")               echo whittle-watt ;;
    # SSR Apparel was pulled from the site on 2026-11-24, so it is not collected.
    "SSR Apparel (Monk Holdings)")  echo "" ;;
    *)                              echo "" ;;
  esac
}

[ -d "$SRC" ] || { echo "Can't find the Selects folder. Is Google Drive for desktop running?"; echo "  $SRC"; exit 1; }
for t in sips cwebp pdftoppm ffmpeg pdfinfo; do
  command -v "$t" >/dev/null || { echo "Missing $t. brew install webp poppler ffmpeg"; exit 1; }
done

mkdir -p "$DEST"
imgs=0; pages=0; vids=0; skipped=0; unmapped=""

# sips resizes (it reads everything Preview can), cwebp encodes.
do_image() {
  local in="$1" out="$2"
  [ -f "$out" ] && { skipped=$((skipped+1)); return; }
  local mid="$TMP/resized.png"
  rm -f "$mid"
  sips -s format png -Z "$MAXEDGE" "$in" --out "$mid" >/dev/null 2>&1
  [ -s "$mid" ] || { echo "  ! resize failed: $(basename "$in")"; return; }
  if cwebp -quiet -q "$WEBPQ" -alpha_q "$ALPHAQ" -m 6 "$mid" -o "$out" 2>/dev/null && [ -s "$out" ]; then
    imgs=$((imgs+1))
  else
    echo "  ! encode failed: $(basename "$in")"
  fi
}

# Single-page PDFs land as <base>.webp so sel() finds them with no suffix.
# Multi-page design documents land as <base>-p1.webp, -p2.webp, ...
do_pdf() {
  local in="$1" outdir="$2" base="$3"
  local n; n="$(pdfinfo "$in" 2>/dev/null | awk '/^Pages:/{print $2}')"
  [ -z "$n" ] && { echo "  ! unreadable pdf: $base"; return; }
  [ "$n" -gt "$MAXPAGES" ] && n="$MAXPAGES"
  local i out stem
  for i in $(seq 1 "$n"); do
    if [ "$n" -eq 1 ]; then out="$outdir/$base.webp"; else out="$outdir/$base-p$i.webp"; fi
    [ -f "$out" ] && { skipped=$((skipped+1)); continue; }
    stem="$TMP/page"
    rm -f "$stem.png"
    pdftoppm -png -r "$PDFDPI" -scale-to "$MAXEDGE" -f "$i" -l "$i" -singlefile "$in" "$stem" >/dev/null 2>&1
    [ -s "$stem.png" ] || { echo "  ! pdf page failed: $base p$i"; continue; }
    if cwebp -quiet -q "$WEBPQ" -m 6 "$stem.png" -o "$out" 2>/dev/null && [ -s "$out" ]; then
      pages=$((pages+1))
    else
      echo "  ! encode failed: $base p$i"
    fi
  done
}

# Video plus a poster frame. The poster takes a -poster suffix so it does not
# shadow the video in sel()'s lookup.
do_video() {
  local in="$1" outdir="$2" base="$3"
  local out="$outdir/$base.mp4" poster="$outdir/$base-poster.webp"
  if [ ! -f "$out" ]; then
    ffmpeg -nostdin -loglevel error -y -i "$in" \
      -vf "scale='min($VIDW,iw)':-2" -c:v libx264 -crf "$VIDCRF" -preset slow \
      -c:a aac -b:a 128k -movflags +faststart "$out" >/dev/null 2>&1
    [ -s "$out" ] && vids=$((vids+1)) || echo "  ! video failed: $base"
  else
    skipped=$((skipped+1))
  fi
  if [ ! -f "$poster" ]; then
    local frame="$TMP/poster.png"
    rm -f "$frame"
    ffmpeg -nostdin -loglevel error -y -ss 1 -i "$in" -frames:v 1 \
      -vf "scale='min($VIDW,iw)':-2" "$frame" >/dev/null 2>&1 \
      || ffmpeg -nostdin -loglevel error -y -i "$in" -frames:v 1 \
         -vf "scale='min($VIDW,iw)':-2" "$frame" >/dev/null 2>&1
    [ -s "$frame" ] && cwebp -quiet -q "$WEBPQ" -m 6 "$frame" -o "$poster" >/dev/null 2>&1
  fi
}

while IFS= read -r -d '' f; do
  rel="${f#"$SRC"/}"
  client="${rel%%/*}"
  name="$(basename "$f")"
  case "$name" in .DS_Store|_INDEX*) continue ;; esac
  [ "$client" = "$rel" ] && continue          # loose file at the root

  slug="$(slug_for "$client")"
  if [ -z "$slug" ]; then
    case "$unmapped" in *"[$client]"*) ;; *) unmapped="$unmapped[$client]" ;; esac
    continue
  fi

  outdir="$DEST/$slug"; mkdir -p "$outdir"
  base="${name%.*}"
  ext="$(printf '%s' "${name##*.}" | tr '[:upper:]' '[:lower:]')"

  case "$ext" in
    png|jpg|jpeg|webp|tif|tiff) do_image "$f" "$outdir/$base.webp" ;;
    pdf)                        do_pdf   "$f" "$outdir" "$base" ;;
    mp4|mov|m4v)                do_video "$f" "$outdir" "$base" ;;
    svg)                        [ -f "$outdir/$name" ] || cp "$f" "$outdir/$name" ;;   # vector ships as-is
    *)                          : ;;
  esac
done < <(find "$SRC" -type f -print0)

echo
echo "  selects collected → src/media/selects"
echo "  $imgs images · $pages pdf pages · $vids videos · $skipped already present"
[ -n "$unmapped" ] && echo "  not collected (no slug): $unmapped"
python3 -c "
import os,sys
d=sys.argv[1]; t=sum(os.path.getsize(os.path.join(r,f)) for r,_,fs in os.walk(d) for f in fs)
print(f'  on disk: {t/1048576:.1f} MB')" "$DEST" 2>/dev/null
