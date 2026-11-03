# Copy this deck onto tobynsmith.me

After PR 5 and PR 6 are on `main`, a clean checkout of `tobyn-smith/presentations` is the site. Do not use a standalone export folder. Leave `me/6010/` alone.

The deck stays at the repo root (same as poems: copy the source repo into a folder). Dev-only files are deleted after the copy. GitHub Pages has no `_redirects` or `_headers`, so those stay out of `me/geddes/`.

## Exact exclude list

Delete these from `me/geddes/` after `cp -a`:

```
.git
.github
.gitignore
.agents
.cursor
docs
scripts
project
me-drop-in
me-export
node_modules
audit-out
dist
_site
README.md
test.js
audit-layout.mjs
_redirects
_headers
_config.yml
404.html
config.local.example.js
adminpresentation.html
adminpresentation/
```

Keep `index.html`, `present/index.html`, CSS, JS, fonts, `readings/`, `config.js`, `config.local.js`, `.nojekyll`.

## Cloudflare files that do not work on GitHub Pages

- `_redirects` (`/presentations` to `/geddes/`, `/geddes/*` rewrite on the preview host): Pages ignores this. The `/presentations` stub below is the stand-in. Files already live under `/geddes/` so no rewrite is needed.
- `_headers` (forced `text/css`, `text/javascript`, `font/woff2`): Pages already serves those from the file extension.
- repo-root `404.html`: Pages only uses the 404 at the `me` repo root, not a file inside `geddes/`.

## Bash step for `.github/workflows/sync-projects.yml`

Checkout `tobyn-smith/presentations` into `_src/presentations` (a path that is not `presentations/`, which is the stub). Then run this from the `me` repo root. Do not write `6010/`.

```bash
set -eu
rm -rf geddes
cp -a _src/presentations geddes
rm -rf \
  geddes/.git \
  geddes/.github \
  geddes/.agents \
  geddes/.cursor \
  geddes/docs \
  geddes/scripts \
  geddes/project \
  geddes/me-drop-in \
  geddes/me-export \
  geddes/node_modules \
  geddes/audit-out \
  geddes/dist \
  geddes/_site \
  geddes/adminpresentation
rm -f \
  geddes/.gitignore \
  geddes/README.md \
  geddes/test.js \
  geddes/audit-layout.mjs \
  geddes/_redirects \
  geddes/_headers \
  geddes/_config.yml \
  geddes/404.html \
  geddes/config.local.example.js \
  geddes/adminpresentation.html
find geddes -type f \( \
    -name '*.html' -o -name '*.js' -o -name '*.css' -o \
    -name '*.md' -o -name '*.svg' -o -name '*.yml' \
  \) -print0 |
  while IFS= read -r -d '' f; do
    sed -i \
      -e 's|https://tobyn-smith.github.io/presentations|https://tobynsmith.me/geddes|g' \
      -e 's|https://tobynsmith.me/presentations|https://tobynsmith.me/geddes|g' \
      "$f"
  done
rm -rf presentations
mkdir -p presentations/present
cat > presentations/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8" />
<meta name="robots" content="noindex" />
<title>Discussion</title>
<link rel="canonical" href="https://tobynsmith.me/geddes/" />
<meta http-equiv="refresh" content="0; url=/geddes/" />
<script>location.replace("/geddes/" + location.search + location.hash)</script>
</head>
<body>
<p><a href="/geddes/">Open the class deck</a></p>
</body>
</html>
EOF
cat > presentations/present/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8" />
<meta name="robots" content="noindex" />
<title>Presenter</title>
<link rel="canonical" href="https://tobynsmith.me/geddes/present/" />
<meta http-equiv="refresh" content="0; url=/geddes/present/" />
<script>location.replace("/geddes/present/" + location.search + location.hash)</script>
</head>
<body>
<p><a href="/geddes/present/">Open the presenter view</a></p>
</body>
</html>
EOF
test -f geddes/index.html
test -f geddes/present/index.html
```

The same stub files also live in this repo at `me-drop-in/presentations/` if you would rather `cp -a` them than `cat`.

Do not open a pull request on `tobyn-smith/me` from this repo. The `me` workflow owns that commit.
