# Dragonholt Companion 2.0 architecture

The refactor moves the app toward five explicit layers:

- `data/`: canonical static reference data.
- `domain/`: pure game/campaign transformations and rules.
- `state/`: campaign persistence, actions, migrations, and selectors.
- `screens/`: major user-facing workflows.
- `components/`: reusable presentation primitives.

`App.jsx` will become a composition shell rather than the owner of every rule, mutation, and screen. The extraction is incremental so legacy saves and behavior can be verified after each major screen moves.
