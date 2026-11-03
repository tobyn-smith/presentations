# Live-room verification

Use a disposable test room, never a live teaching room. Open one presenter window and at least two student windows with distinct browser sessions.

## Automated checks

Run these from the repository root after installing Playwright and Chromium:

```sh
node test.js
node visual-test.mjs
node live-room-test.mjs
```

- `test.js` checks the slide content, teaching assignments, accessible controls, figure assets and room-status wiring.
- `visual-test.mjs` captures all 13 slides in the real presenter and audience routes at 1920×1080, 1600×900, 1366×768, 1280×720, 1024×768 and the minimum supported 800×600. It checks stage overflow, page overflow, nested clipping, figure metadata, interaction bounds and the room-status dialog. The 800×600 layout may use a small amount of internal slide scrolling; larger displays should not.
- `live-room-test.mjs` uses mocked Firebase and ntfy transports. It tests a failed send when both transports are unavailable, a successful retry, rapid duplicate activation, presenter refresh while in backup mode, automatic restoration of the live room, Firebase reconnection, and persistence of the queued response after a normal refresh. It also uses the keyboard-operable placement selects rather than drag-and-drop.

The tests do not contact the production Firebase room or clear real student check-ins. Screenshots and JSON reports are written under `artifacts/geddes-visual/` and `artifacts/geddes-live-room/`.

## 1. Failed response delivery

1. In a disposable room, open a choice or placement interaction as a student.
2. Block Firebase and the backup transport.
3. Submit once.
4. Confirm the button changes to “Sending…” while pending, then shows an error.
5. Confirm the answer remains selected and the send control becomes available again.
6. Restore the backup transport and retry. Confirm the student sees the sent state only after delivery succeeds.

## 2. Duplicate submission

1. Throttle the network.
2. Double-click Send or rapidly activate the same choice twice.
3. Confirm the control disables immediately and only one response is stored for that student session and slide.
4. Confirm the presenter sees one response, not duplicate rows.

## 3. Firebase-to-backup failover and recovery

1. Start with the presenter and students connected to Firebase.
2. Block Firebase reads and writes while leaving the backup transport available.
3. Confirm Room status changes to the backup connection.
4. Submit a response and confirm it reaches the presenter.
5. Restore Firebase. The client retries the connection; confirm Room status returns to Firebase.
6. Confirm the queued backup response is written to Firebase, so it survives a later presenter refresh.

Backup delivery is temporary. Responses received over the backup transport are retained locally and replayed into Firebase when the connection returns. Room status warns the presenter when the room is using the temporary transport.

## 4. Presenter refresh

1. Collect at least two responses on one slide.
2. Refresh the presenter page while the room is live.
3. Confirm the presenter returns to the same slide, restores the room's live state, attendee count and existing responses.
4. Confirm students remain connected and new responses can still arrive.
5. Repeat after Firebase has recovered from backup mode; the responses should now restore from Firebase.

## 5. Student refresh

1. Submit an answer successfully.
2. Refresh that student's page in the same browser session.
3. Confirm the slide remains in its sent state and the student cannot submit a duplicate for that slide.

## 6. Room status controls

1. Open Room status using the keyboard and mouse.
2. Confirm the dialog traps Tab / Shift+Tab, Escape closes it, and focus returns to the Room status trigger.
3. In a test room, exercise Republish current slide, Refresh room data, Run connection test and Copy diagnostics.
4. Confirm Reset check-ins asks for confirmation and clearly warns that it disconnects active students. Only use it when the room is disposable and everyone should be removed.

## Record

For each manual run, note browser, viewport, transport state, expected result, actual result and any console/network errors. Do not use a real class room to test reset or wipe behaviour.
