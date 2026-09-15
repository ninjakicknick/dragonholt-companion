# Campaign actions

The action hooks mirror the mutation logic currently embedded in `App.jsx`:

- `usePartyActions` owns story-point and achievement toggles.
- `useHeroActions` owns hero creation, editing, deletion, and skill state.
- `useVillageActions` owns time/day advancement and progress tracks.
- `useCampaignActions` composes those APIs for the app shell.

All updates use functional state setters so rapid interactions do not operate on stale render snapshots. New hero IDs use `crypto.randomUUID()` when available, with a browser-safe fallback.
