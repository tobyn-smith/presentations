# Geddes deck rehearsal

## Brief and visual reference

A 13-slide, 15-minute reading discussion for INTL 6010, taught by Tobyn and Raquel. The reference is the UGA navy / warm-paper / crimson / gold / sage slide supplied in the discussion. Stageshow is used as a design and rehearsal lens, not as a React dependency: keep the focal evidence large, use only the words needed to understand the point, avoid dead panels, and make motion explain a change rather than decorate it.

## Teaching arc

- Tobyn: framing the selection problem, the five fast growers, and the sample-design activity.
- Raquel: the regional comparison, wider samples, Figure 3 interpretation, and Skocpol's sequence and case comparisons.
- Tobyn: the Chile endpoint and the conclusion.
- Three class interactions: evidence sort; choose a better comparison and explain why; interpret Figure 3.

## Visual review

The Playwright workflow captures 13 slides in presenter and student modes at 1920×1080, 1366×768, 1280×720 and 1024×768. It checks horizontal overflow, nested clipping, figure sizing, Figure 3's graph/response layout, the student activity columns, title URL wrapping and Room status keyboard behaviour. Screenshots are uploaded as the `geddes-visual-review` artifact.

The screenshot pass uses reduced motion so each image shows a settled frame. In normal presentation mode, chart artwork and evidence cards enter with a short rise/fade; the Table 2 bars grow from their baseline. Reduced-motion preferences disable these effects.

## What has not been verified

- Real classroom projection, room lighting and legibility from the back of the room.
- Full live-room failure and recovery paths: Firebase write failure, backup delivery, retry, duplicate clicks, reconnection, presenter refresh and late student join. Follow `docs/live-room-verification.md` in a disposable room.
- A full-speed motion film of every transition. The screenshot workflow checks settled frames, not every animation frame.
- Final rehearsal timing with both presenters speaking aloud.

## Handover

The deck source is in `readings/geddes-1990.js` and `readings/geddes-visuals.js`. Keep the source repository as the source of truth. The public site copy is not updated by this branch. Do not sync or deploy until the PR is reviewed and explicitly approved.
