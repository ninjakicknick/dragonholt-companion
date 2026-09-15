# 2.0 refactor

The current UI remains functional while responsibilities are moved out of `App.jsx`. The target is a small composition root that connects campaign state, domain logic, navigation, and extracted screens.

This phase intentionally avoids redesigning the visible app. It reduces the risk of the upcoming Active Adventure redesign by giving that UI stable APIs to build against.
