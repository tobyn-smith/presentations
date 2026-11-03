#!/bin/sh
# Build a folder you can copy onto tobyn-smith/me as 6010/.
# Does not touch the live site. Run from the presentations repo root.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
DEST=${1:-"$ROOT/dist/6010"}
rm -rf "$DEST"
mkdir -p "$DEST"
# Static deck only. Skip git, node, audits, and the me-drop-in helper.
for f in \
  404.html README.md _headers _redirects \
  apply-content.js build-week.js config.js config.local.js config.local.example.js \
  deck.js desk.html edit.css edit.html edit.js gate.js \
  index.html join-qr.svg prompts.js roster.js \
  script-content.js script.css script.html script.js \
  slides.js slideshow.html slideshow.js start.html \
  style.css sync.js type.css uga-logo.png \
  fonts/FONTS.txt \
  fonts/lexend-regular.woff2 fonts/lexend-semibold.woff2 \
  fonts/merriweather-italic.woff2 fonts/merriweather-sans.woff2 \
  fonts/merriweather.woff2 fonts/oswald.woff2 \
  fonts/opendyslexic-bold.woff2 fonts/opendyslexic-regular.woff2 \
  present/index.html gate.js \
  adminpresentation.html adminpresentation/index.html \
  readings/geddes-1990.js \
  start/index.html slideshow/index.html script/index.html \
  edit/index.html desk/index.html
do
  src="$ROOT/$f"
  if [ -f "$src" ]; then
    mkdir -p "$DEST/$(dirname "$f")"
    cp "$src" "$DEST/$f"
  fi
done
# After you copy DEST to me/6010, also copy me-drop-in/presentations/ over me/presentations/.
printf '%s\n' "$DEST"
