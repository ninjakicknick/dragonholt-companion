# App shell handoff

The next wiring commit should replace the legacy Party renderer with `PartyScreen` using `useCampaignFacade()` and `getPartyScreenProps()`.

The handoff is intentionally explicit so `App.jsx` stops knowing how persistence and domain actions work. Once Party is verified, repeat the same pattern for Heroes, Village, and Achievements, then delete the corresponding legacy render functions and constants from `App.jsx`.
