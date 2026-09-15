# Campaign state boundary

The UI should consume campaign data through `useCampaign`, state changes through `useCampaignActions`, and derived display values through `campaignSelectors`.

This keeps persistence, mutations, and game-state calculations out of screen components. As the 2.0 UI is extracted from `App.jsx`, screens should not write to localStorage directly or duplicate hero/village/party mutation logic.

Rule-specific progression logic belongs in dedicated domain modules rather than inside React components. This is intentionally separate from canonical static data in `src/data`.
