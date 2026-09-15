# Save compatibility

Screen extraction must not rename persisted campaign fields. Any future schema change goes through `campaignSave.js` migration/normalization rather than being handled ad hoc in a screen.
