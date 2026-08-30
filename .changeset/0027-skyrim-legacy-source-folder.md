---
'pca': minor
---

Skyrim SE and VR: a warning when source scripts are left in `Data\Scripts\Source`, the Skyrim LE folder. Their Creation Kit only reads `Data\Source\Scripts`, and PCA imports the LE folder first, so an outdated copy of the game scripts left in there shadows the one the game ships and the compilation fails for no apparent reason. The report recommends moving everything to `Data\Source\Scripts` and opens the folder.

The Compilation page now also raises the non blocking warnings, this one and the script extender without its sources, and no longer the errors only. An error still comes first when there is one.
