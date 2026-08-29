---
'pca': minor
---

Fix Starfield support, which could not compile anything: the game executable was looked up as `Startfield.exe`, its sources were expected in `Data/Source/Scripts` instead of `Data/Scripts/Source`, the config check looked for `Base/Actor.psc` when Starfield has no `Base` folder, and `Starfield_Papyrus_Flags.flg` was not a selectable flag. Selecting Starfield in the settings also silently reverted to Skyrim: the store's game type check listed the four other games and reset anything else, so the choice was overwritten on the next config check while the game path and flag stayed on Starfield. It now reuses the shared `validateGame.gameType()` instead of its own outdated list.

Starfield keeps every script under `Scripts/Source` — its subfolders are namespaces — so that folder is now its only import root.
