# Presentations

People join from a phone. You run the boards. If check-in dies, the slideshow still works.

Live copy (after this ships): **[tobynsmith.me/6010](https://tobynsmith.me/6010/)**. Old **[/presentations](https://tobynsmith.me/presentations/)** links redirect there.

New here? Open **[Start](https://tobynsmith.me/6010/start.html)**. Three cards: Admin, Audience, Backup.

## Three views

1. **Admin** — [Present](https://tobynsmith.me/6010/present/). Go live, next and back, reveal answers. Script is [here](https://tobynsmith.me/6010/script.html). The presenter key is not in this repo. Set it on the teaching laptop (first visit to Present, or `config.local.js`).
2. **Audience** — [Phones](https://tobynsmith.me/6010/). Check in, then type when a question is up.
3. **Backup** — [Slideshow](https://tobynsmith.me/6010/slideshow.html). Same boards, no phones.

## Running a room

1. Open [Start](https://tobynsmith.me/6010/start.html), then Admin. Use the presenter key stored on that computer.
2. Leave the title up. People scan the QR, or you text them the Audience link.
3. Names show on the right when they are in.
4. Hit **Go live**.
5. Next and Back as usual. On a question, **Reveal** shows what people typed.

If phones sit on Hold, open Room tools and tap **Push live again**. If that still fails, open the [slideshow](https://tobynsmith.me/6010/slideshow.html) and keep talking. I do that more often than I want to admit.

## Adding a week

Each week is one small file in `readings/`. This week is Geddes (1990) in `readings/geddes-1990.js`: one continuous deck, about twenty minutes, her numbers and charts, two write-in boards. Methods files stay in the folder and are not loaded.

Add one script tag for a new week file in `index.html`, `desk.html`, `present/index.html`, `slideshow.html`, `edit.html`, and `script.html`. Take out last week’s file if you do not want it in the room.

If a week file has its own `slides`, those boards are used as written. Otherwise `build-week.js` makes a grid from `prompts.js`. Do not put tool lines on the boards (no “Phones:”, tap counts, or bar captions).

Edit has a switch, **Use week files**. Leave it on so a leftover browser copy does not hide the generated boards. Turn it off before you rely on typed boards, a downloaded backup, or **Open a backup**. Restore will not show while the switch is on.

## Changing the slides

Open [Edit](https://tobynsmith.me/6010/edit.html). Type in the boxes. It saves on that computer.

Do this on the laptop you will present from. Present and the slideshow on that same computer will use your copy. Students get it too once you Go live.

The class list is one name per line. Leave it blank if people can type their own names.

Switching computers: **Download a backup** at the bottom of Edit, then **Open a backup** on the other one. If **Use week files** is on, turn it off after you restore or those boards stay hidden.

If someone else might be using this live example at the same time, put a room word on Edit (something like `period3`). The student link updates. Give people that link, not the bare homepage.

## Pages

[Start](https://tobynsmith.me/6010/start.html) lists the three views. [Admin](https://tobynsmith.me/6010/present/) is you. [Audience](https://tobynsmith.me/6010/) is phones. [Backup](https://tobynsmith.me/6010/slideshow.html) is the plain slideshow. [Edit](https://tobynsmith.me/6010/edit.html) is names and slides. [Script](https://tobynsmith.me/6010/script.html) is what you say. [Computer layout](https://tobynsmith.me/6010/desk.html) is the audience page, wide.

GitHub also serves the same files at [tobyn-smith.github.io/presentations](https://tobyn-smith.github.io/presentations/). The QR points at tobynsmith.me/6010/.

To put this on the personal site, run `scripts/export-me-6010.sh` and copy the folder to `me/6010/`. Replace `me/presentations/` with `me-drop-in/presentations/` so old links go to `/6010/`.

## Your own copy

Drop this folder onto a site the same way `/reader` and `/poems` sit on [tobynsmith.me](https://tobynsmith.me/). Then change the student link on Edit so the QR matches that address.

<details>
<summary>Campus is blocking the room</summary>

<br>

If ntfy never connects, someone who does not mind config files can add a Firebase Realtime Database, put the `databaseURL` in `config.js`, and use rules like:

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

The slideshow does not need any of that.

</details>
