<h1 align="center">Presentations</h1>

<p align="center">
  Live slides with phone check-in.<br>
  Students join from a phone. You drive the boards. A backup slideshow sits ready if the room will not start.
</p>

<p align="center">
  <b><a href="https://tobynsmith.me/presentations/">tobynsmith.me/presentations</a></b>
</p>

<p align="center">
  <a href="https://tobynsmith.me/presentations/">Students</a> ·
  <a href="https://tobynsmith.me/presentations/desk/">Computer</a> ·
  <a href="https://tobynsmith.me/presentations/adminpresentation/">Presenter</a> ·
  <a href="https://tobynsmith.me/presentations/slideshow/">Slideshow</a> ·
  <a href="https://tobynsmith.me/presentations/script/">Script</a>
</p>

**Contents** ·
[Open a page](#open-a-page) ·
[Run a room](#run-a-room) ·
[Make it yours](#make-it-yours) ·
[If something sticks](#if-something-sticks)

## Open a page

The live copy is [tobynsmith.me/presentations](https://tobynsmith.me/presentations/). Same shape as `/reader` and `/poems` on the homepage.

| Who | Open this | What you get |
|---|---|---|
| Students | [the home page](https://tobynsmith.me/presentations/) | Check in, pick a name, follow the boards |
| On a computer | [`/desk`](https://tobynsmith.me/presentations/desk/) | The same view, wide |
| You | [`/adminpresentation`](https://tobynsmith.me/presentations/adminpresentation/) | QR, Go live, next / back. Key: `example` |
| Backup | [`/slideshow`](https://tobynsmith.me/presentations/slideshow/) | The boards only. No phones, no key |
| Notes | [`/script`](https://tobynsmith.me/presentations/script/) | What you say, with bigger type if you want it |

The slideshow is the always-on demo. Open it if you only want to click through the boards.

GitHub also serves the same files at [tobyn-smith.github.io/presentations](https://tobyn-smith.github.io/presentations/). The join code and QR use the `tobynsmith.me` link.

## Run a room

1. Open the [presenter page](https://tobynsmith.me/presentations/adminpresentation/). Type `example`.
2. Leave the title up so people can scan the QR, or send them [the home page](https://tobynsmith.me/presentations/).
3. Wait until names show on the right.
4. Press **Go live**.
5. Step through the boards. People type on question slides; hands show up at the top.
6. If phones will not join, open the [slideshow](https://tobynsmith.me/presentations/slideshow/) and keep going.

Room tools (the button on the presenter bar) republish a slide, free leftover names, or end the room.

## Make it yours

Four files. That is the whole edit.

| File | Change this |
|---|---|
| `config.js` | Title, presenter key, `joinUrl`, and `room` (a unique ntfy topic) |
| `roster.js` | Names in `NAMES`, one string each |
| `slides.js` | The boards |
| `script.html` | What you say |

Then:

1. Copy the repo, or fork it.
2. GitHub Pages is already on: `main`, root, via `.github/workflows/jekyll-gh-pages.yml`.
3. Point `joinUrl` at your own Pages URL so the QR matches.
4. Put this folder on the homepage site as `presentations/`, the same way `/reader` and `/poems` sit on [tobynsmith.me](https://tobynsmith.me/).

A key saved in Room tools only sticks on that browser. Change `presenterKey` in `config.js` if you want it permanent.

`?local=1` on any page keeps the room on this computer. Bump `session` in `config.js` if leftover ntfy messages are still hanging around.

<details>
<summary><b>Optional: Firebase, if campus blocks ntfy</b></summary>

<br>

Add a Realtime Database, put `databaseURL` in `config.js`, and use rules like:

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

</details>

## If something sticks

| What you see | What to try |
|---|---|
| Phones stay on Hold | Presenter: Room tools → **Push live again** |
| Late phones on the wrong board | **Republish this slide** |
| Yesterday's names still Taken | **Free leftover names** |
| The room will not start | Open [`/slideshow`](https://tobynsmith.me/presentations/slideshow/) |
