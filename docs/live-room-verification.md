# Live room verification

Use a disposable test room, not a live teaching room. Open one presenter window and at least two student windows with distinct browser sessions.

## 1. Failed response delivery
1. Open a choice or text interaction as a student.
2. In browser DevTools, block both the Firebase database host and the configured backup transport.
3. Submit once.
4. Confirm the button changes to “Sending…” while the request is pending.
5. Confirm failure is shown as an alert, the answer remains selected/typed, and the send control becomes available again.
6. Restore the network and retry. Confirm the student receives the sent state only after a successful write.

## 2. Duplicate submission
1. Throttle the network to Slow 3G.
2. Double-click Send or rapidly activate the same choice twice.
3. Confirm the control disables immediately and only one response is stored for that student session and slide.
4. Confirm the presenter sees one response, not duplicate rows.

## 3. Firebase-to-backup failover
1. Start with the presenter and students connected to Firebase.
2. Block Firebase writes but leave the backup transport available.
3. Submit a response.
4. Confirm Room status reports the backup connection and the response reaches the presenter.
5. Restore Firebase. Allow the retry interval to run, then confirm the connection returns to Firebase without losing the response.

## 4. Presenter refresh
1. Collect at least two responses on one slide.
2. Refresh the presenter page while the room is live.
3. Confirm the current slide, attendee count and existing responses are restored from the room state.
4. Confirm new responses still arrive after the refresh.

## 5. Student refresh
1. Submit an answer successfully.
2. Refresh that student's page in the same browser session.
3. Confirm the slide remains in its sent state and the student cannot submit a duplicate for that slide.

## 6. Room status controls
1. Open Room status using the keyboard and mouse.
2. Confirm the dialog traps Tab / Shift+Tab, Escape closes it, and focus returns to the Room status trigger.
3. In a test room, exercise Republish current slide, Refresh room data, Run connection test and Copy diagnostics.
4. Only use Clear stale check-ins when the room is disposable and stale seats are present.

## Record
For each run, note browser, viewport, transport state, expected result, actual result and any console/network errors. Do not use a real class room to test clear-seat or wipe behaviour.
