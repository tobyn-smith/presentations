# Geddes deck: visual and teaching direction

This is a classroom presentation, not a faux product interface. The useful part of Benji Taylor's [Stageshow skill](https://github.com/benjitaylor/skills/tree/main/stageshow) is its discipline around composition, hierarchy, purposeful motion and fresh-eye review. We should borrow those principles without turning the slides into a dashboard or a fake app.

## The visual language

- Keep the UGA palette already used by the board: deep navy, crimson, warm paper and restrained gold.
- Let the board do the framing. Keep the 16:9 classroom stage consistent between student and presenter views.
- Give each slide one focal point: a figure, a case matrix or a student task. Avoid putting every item in an identical bordered card.
- Use supporting cards only when they make a comparison easier to read. Figures 1 and 6 use short interpretation panels; Figure 2 gets one prominent statistic; Figures 4 and 5 keep the full board for the case matrix.
- Use space deliberately. A chart should be large enough to read, and a short takeaway should explain what students should notice. Do not fill empty space with decorative widgets.
- Keep on-screen language short and natural. The slide should make sense on its own, while the speaker notes carry the fuller explanation and the hand-off between Tobyn and Raquel.

## Motion

- Bars grow into place where the visual represents a quantity.
- The scatterplots and Chile series reveal from left to right, helping students follow the relationship or timeline.
- Motion is brief and happens on slide entry. No looping or movement that competes with the explanation.
- Respect `prefers-reduced-motion`; all content remains visible without animation.

## Interaction

The 13-slide sequence keeps three class interactions:
1. Place the claims into the right groups. The selects are keyboard-operable alternatives to dragging.
2. Choose which cases would make the sample more convincing.
3. Read Figure 3 and choose the interpretation that best fits the evidence.

Each task needs a clear prompt, a visible response control and enough room to answer without a nested scroll panel. Focus states must be visible, and a failed send must leave the student's answer available for retry.

## Review standard

- Check all 13 slides in both the actual presenter route and the student route.
- Review at 1920×1080, 1600×900, 1366×768, 1280×720, 1024×768 and 800×600.
- At normal laptop and projector sizes, slide content should fit without scrolling. At 800×600, allow only limited internal scrolling on the densest figures; never clip an interaction or hide its controls.
- Check Figures 2, 4, 5 and 6 for label size, spacing, figure proportions and board fit.
- Test keyboard-only interaction, failed delivery, duplicate sends, backup failover, presenter refresh and Firebase recovery.
- Keep the screenshots and JSON reports from `visual-test.mjs` and `live-room-test.mjs` as the review record.

The standard is a calm, clear teaching deck: one strong visual idea at a time, enough context to understand it, and no decoration that gets in the way.
