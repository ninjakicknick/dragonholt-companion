# Dragonholt Companion 2.0 architecture

The refactor separates the application into four responsibilities:

- `data/` — canonical static reference data used by the companion.
- `domain/` — pure game-state calculations and relationships.
- `state/` — campaign persistence, migrations, state ownership, mutations, and selectors.
- `screens/` + `components/` — presentation and interaction.

`App.jsx` is temporarily the legacy composition root. Its responsibilities will be extracted screen-by-screen while preserving behavior and save compatibility. Once the old monolith is reduced to an app shell, the shell can be redesigned around Active Adventure without rewriting persistence or domain logic at the same time.

The companion intentionally stores player-visible state and reference information only. Adventure prose and hidden choice resolution remain in the physical game materials.
