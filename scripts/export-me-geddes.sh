#!/bin/sh
# Write the two folders that belong in tobyn-smith/me.
#   me-export/geddes/          student site plus present/
#   me-export/presentations/   stub that sends old links to /geddes/
# Does not touch me/6010. Does not open a PR.
# Run from the presentations repo root: scripts/export-me-geddes.sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
DEST=${1:-"$ROOT/me-export"}
GEDDES="$DEST/geddes"
PRES="$DEST/presentations"

rm -rf "$DEST"
mkdir -p "$GEDDES" "$PRES/present"

# Pages-safe deck only. No _headers, _redirects, README, tests, or 6010 hop.
for f in \
  apply-content.js build-week.js config.js config.local.js \
  deck.js desk.html edit.css edit.html edit.js gate.js \
  index.html join-qr.svg prompts.js roster.js \
  script-content.js script.css script.html script.js \
  slides.js slideshow.html slideshow.js start.html \
  style.css sync.js type.css uga-logo.png \
  fonts/lexend-regular.woff2 fonts/lexend-semibold.woff2 \
  fonts/merriweather-italic.woff2 fonts/merriweather-sans.woff2 \
  fonts/merriweather.woff2 fonts/oswald.woff2 \
  fonts/opendyslexic-bold.woff2 fonts/opendyslexic-regular.woff2 \
  present/index.html \
  readings/geddes-1990.js \
  start/index.html slideshow/index.html script/index.html \
  edit/index.html desk/index.html
do
  src="$ROOT/$f"
  if [ -f "$src" ]; then
    mkdir -p "$GEDDES/$(dirname "$f")"
    cp "$src" "$GEDDES/$f"
  fi
done

write_stub() {
  dest="$1"
  title="$2"
  url="$3"
  cat > "$dest" <<EOF
<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8" />
<meta name="robots" content="noindex" />
<title>$title</title>
<link rel="canonical" href="$url" />
<meta http-equiv="refresh" content="0; url=$url" />
<script>location.replace("$url" + location.search + location.hash)</script>
</head>
<body>
<p><a href="$url">Open the class deck</a></p>
</body>
</html>
EOF
}

write_stub "$PRES/index.html" "Discussion" "/geddes/"
write_stub "$PRES/present/index.html" "Presenter" "/geddes/present/"

printf '%s\n' "$DEST"
