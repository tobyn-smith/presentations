# Presentations

People join from a phone. You run the boards. If check-in dies, the slideshow still works.

Live copy: **[tobynsmith.me/presentations](https://tobynsmith.me/presentations/)**

If you have not used this, open **[Start](https://tobynsmith.me/presentations/start/)**. That page is the map. You can ignore the files.

## Running a room

1. Open [Start](https://tobynsmith.me/presentations/start/), then Present. On this example the key is `example`.
2. Leave the title up. People scan the QR, or you send them the student link.
3. Names show on the right when they are in.
4. Hit **Go live**.
5. Next and Back as usual. Question boards collect answers. Hands show at the top.

If phones sit on Hold, open Room tools and tap **Push live again**. If that still fails, open the [slideshow](https://tobynsmith.me/presentations/slideshow/) and keep talking. I do that more often than I want to admit.

## Changing the slides

Open [Edit](https://tobynsmith.me/presentations/edit/). Type in the boxes. It saves on that computer.

Do this on the laptop you will present from. Present and the slideshow on that same computer will use your copy. Students get it too once you Go live.

The class list is one name per line. Leave it blank if people can type their own names.

If you switch computers, tap **Download a backup** at the bottom of Edit, then **Open a backup** on the other one.

If someone else might be using this live example at the same time, put a room word on Edit (something like `period3`). The student link updates. Give people that link, not the bare homepage.

## Pages

- [Start](https://tobynsmith.me/presentations/start/) — the map
- [Students](https://tobynsmith.me/presentations/) — phones
- [Present](https://tobynsmith.me/presentations/adminpresentation/) — you. Key on the example: `example`
- [Slideshow](https://tobynsmith.me/presentations/slideshow/) — boards only
- [Edit](https://tobynsmith.me/presentations/edit/) — change slides and names
- [Script](https://tobynsmith.me/presentations/script/) — what you say
- [Computer layout](https://tobynsmith.me/presentations/desk/) — student view, wide

GitHub also serves the same files at [tobyn-smith.github.io/presentations](https://tobyn-smith.github.io/presentations/). The QR still points at tobynsmith.me.

## Your own copy

Drop this folder onto a site the same way `/reader` and `/poems` sit on [tobynsmith.me](https://tobynsmith.me/). Then change the student link on Edit so the QR matches that address.

<details>
<summary>Campus is blocking the room</summary>

<br>

If ntfy never connects, someone tech-y can add a Firebase Realtime Database, put the `databaseURL` in `config.js`, and use rules like:

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

You still do not need that for the slideshow.

</details>
