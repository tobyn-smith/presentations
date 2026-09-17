# presentations

Live slides with phone check-in.

**Live example:** [tobyn-smith.github.io/presentations](https://tobyn-smith.github.io/presentations/)

- Students: [/](https://tobyn-smith.github.io/presentations/) (on a computer, [/desk](https://tobyn-smith.github.io/presentations/desk/) for the wide layout)
- Presenter: [/adminpresentation](https://tobyn-smith.github.io/presentations/adminpresentation/) — key `example`
- Backup, no phones: [/slideshow](https://tobyn-smith.github.io/presentations/slideshow/)
- Script: [/script](https://tobyn-smith.github.io/presentations/script/)

The slideshow is the always-on demo. Student and presenter views share a room, so open presenter first if you want phones to follow the boards.

Turn the site on once: Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Same as the other public pages repos. Until that switch is on, the URL above 404s.

## Set up

1. Copy this repo.
2. GitHub Pages: Settings, Pages, deploy from `main`, root. `.nojekyll` is already in the repo so Pages serves the files as-is.
3. `config.js`: title, `presenterKey`, `joinUrl` (your Pages URL), and `room` (pick a unique ntfy topic).
4. `roster.js`: names as strings in `NAMES`.
5. `slides.js`: the boards.
6. `script.html`: what you say.

The presenter key in Room tools only sticks on that browser. Change `presenterKey` in `config.js` to make it permanent.

Firebase is optional. If you add a Realtime Database, put `databaseURL` in `config.js` and use rules like:

```json
{
  "rules": {
    "deck": {
      ".read": true,
      ".write": true
    }
  }
}
```

`?local=1` stays on this computer. Bump `session` if leftover ntfy messages are still hanging around.
