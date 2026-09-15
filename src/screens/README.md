# Screens

During the 2.0 refactor, each top-level experience will move out of `App.jsx` into this directory. Screens should compose reusable components and consume campaign state/actions; they should not own persistence or canonical game data.

The existing visual behavior is preserved during extraction. The Active Adventure redesign comes after these seams are stable so UX work can proceed without re-entangling application state.
