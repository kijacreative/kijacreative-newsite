# Live-site media

Photos and video from kijacreative.com go here, keeping WordPress's folders:

    cd src/media
    bash ../../content-import/download-assets.sh     # creates ./wp-uploads/<year>/<month>/<file>

Then rebuild. The build only references files that exist, so:
- the Option B hero plays the reel from here (until then it streams it from
  the live WordPress URL, which stops working once the domain moves);
- project photos appear on the proof wall, in its case panels, and in a
  "The work" gallery on each case page.

Large files: the "-scaled" JPEGs are up to 2560px. Run them through an image
optimiser (or export 1600px WebP) before committing.
