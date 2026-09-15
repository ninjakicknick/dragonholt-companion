# State contract

Existing local saves remain stored under `dragonholt-companion-save-v1` while the internal architecture changes. This is deliberate: changing the storage key during a refactor would make an existing campaign appear to disappear.

`campaignSave.js` is the only module that should know the storage key. Future schema changes should be introduced as migrations there. UI components should operate on the normalized campaign shape only.

The exported JSON version is independent of the localStorage key and can advance as migrations are added.
