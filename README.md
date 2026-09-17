# presentations

Live slides with phone check-in.

- Students: `/` (on a computer, `/desk` if you want the wide layout)
- Presenter: `/adminpresentation`
- Backup, no phones: `/slideshow`
- Script: `/script`

## Set up

1. Copy this repo.
2. GitHub Pages: Settings, Pages, deploy from `main`, root.
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
