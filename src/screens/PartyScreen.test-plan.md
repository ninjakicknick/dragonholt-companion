# Party screen regression checklist

Before wiring `PartyScreen` into the app shell, verify these legacy behaviors remain unchanged:

- Fame starts from saved state, cannot decrement below zero, and increments one at a time.
- Gold starts from saved state, changes in increments of five from buttons, accepts direct numeric entry, and does not go below zero through controls.
- All story points A1 through Z8 render and can be toggled independently.
- The tracked story-point count updates with the selection.
- Campaign notes remain editable and persist through campaign state.
- Horizontal scrolling keeps the full story-point grid usable on narrow screens.

Accessibility added during extraction:

- Story-point buttons expose pressed state and descriptive labels.
- Fame and gold controls have explicit labels.
