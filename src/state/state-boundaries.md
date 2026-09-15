# State layer

`useCampaign` owns persisted campaign values. `useCampaignActions` composes mutation hooks. `campaignSelectors` derives read-only view data. `campaignFacade` is the app-shell entry point.

Screens should not know the localStorage key or save-file version, and persistence should not import UI modules.
