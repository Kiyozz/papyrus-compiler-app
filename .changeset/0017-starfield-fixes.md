---
'pca': minor
---

Fix Starfield support, which could not compile anything: the game executable was looked up as `Startfield.exe`, its sources were expected in `Data/Source/Scripts` instead of `Data/Scripts/Source`, the config check looked for `Base/Actor.psc` when Starfield has no `Base` folder, and `Starfield_Papyrus_Flags.flg` was not a selectable flag. Starfield keeps every script under `Scripts/Source` — its subfolders are namespaces — so that folder is now its only import root.
