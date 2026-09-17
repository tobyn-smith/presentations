# Presentations

People join from a phone. You run the boards. If check-in dies, the slideshow still works.

Live copy: **[tobynsmith.me/presentations](https://tobynsmith.me/presentations/)**

New here? Open **[Start](https://tobynsmith.me/presentations/start/)**. The cards are the whole thing. You do not need to touch the files.

## Running a room

1. Open [Start](https://tobynsmith.me/presentations/start/), then Present. On this example the key is `example`.
2. Leave the title up. People scan the QR, or you text them the student link.
3. Names show on the right when they are in.
4. Hit **Go live**.
5. Next and Back as usual. Question boards collect answers. Hands show at the top.

If phones sit on Hold, open Room tools and tap **Push live again**. If that still fails, open the [slideshow](https://tobynsmith.me/presentations/slideshow/) and keep talking. I do that more often than I want to admit.

## Changing the slides

Open [Edit](https://tobynsmith.me/presentations/edit/). Type in the boxes. It saves on that computer.

Do this on the laptop you will present from. Present and the slideshow on that same computer will use your copy. Students get it too once you Go live.

The class list is one name per line. Leave it blank if people can type their own names.

Switching computers: **Download a backup** at the bottom of Edit, then **Open a backup** on the other one.

If someone else might be using this live example at the same time, put a room word on Edit (something like `period3`). The student link updates. Give people that link, not the bare homepage.

## Pages

[Start](https://tobynsmith.me/presentations/start/) is the card page. [Students](https://tobynsmith.me/presentations/) is what phones open. You present from [here](https://tobynsmith.me/presentations/adminpresentation/) (key on the example: `example`). [Slideshow](https://tobynsmith.me/presentations/slideshow/) is the same boards with no phones. [Edit](https://tobynsmith.me/presentations/edit/) is names and slides. [Script](https://tobynsmith.me/presentations/script/) is what you say. [Computer layout](https://tobynsmith.me/presentations/desk/) is the student page, wide.

GitHub also serves the same files at [tobyn-smith.github.io/presentations](https://tobyn-smith.github.io/presentations/). The QR still points at tobynsmith.me.

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
