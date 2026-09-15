# Component boundaries

Shared components are intentionally presentation-only. They should not read localStorage, mutate campaign state directly, or encode Dragonholt progression rules. Screens compose them; state hooks and domain modules own behavior.
