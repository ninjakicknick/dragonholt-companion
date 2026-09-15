# App extraction plan

`App.jsx` currently owns both rendering and campaign mutations. The 2.0 refactor moves those responsibilities behind the state boundary before screens are redesigned.

The intended composition is:

```js
const campaign = useCampaign();
const actions = useCampaignActions(campaign);
```

Screens receive the smallest useful slice of state plus actions. Derived values should come from selectors. Static Dragonholt reference data should come from `src/data`.

Planned screen extraction order:

1. Party / story points
2. Hero roster and hero editor
3. Village tracker
4. Achievements
5. App shell/navigation

Once the old screens are separated and behavior remains stable, the app shell can be replaced by the new Active Adventure home experience without coupling that redesign to persistence or migration work.
