# Domain logic

This directory is reserved for Dragonholt rule relationships that the companion app can safely automate from player-recorded state.

Examples include progression thresholds, eligibility checks, and suggested state updates. Adventure prose, hidden outcomes, and choice resolution do not belong here: the app remains a companion rather than an electronic edition of the game.

Keeping rule logic outside React makes it testable and lets both the current tracker screens and the future Active Adventure screen consume the same behavior.
