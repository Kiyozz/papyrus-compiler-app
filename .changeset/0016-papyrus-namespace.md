---
'pca': minor
---

Support Papyrus namespaces (Fallout 4, Starfield). The namespace declared in the psc header (`Scriptname MyMod01:Script`) is now given to the compiler, the namespace root folder is imported instead of the script folder, and the pex is written to its namespace subfolder.

Fallout 4 imports are reduced to the three roots the game actually uses — `Scripts/Source`, `Scripts/Source/Base` and `Scripts/Source/User` — instead of globbing every subfolder four levels deep. Those subfolders are namespace folders, not roots: the compiler walks down to them on its own. On a stock Fallout 4 install this takes the command line from 64 imports to 4, which makes the `ENAMETOOLONG` limit much harder to hit.
