---
'pca': minor
---

Setup wizard on first launch (game, folder, Creation Kit) and a detailed Creation Kit report in the settings.

PCA now tells apart a missing Creation Kit, source archives nobody extracted, a compiler that cannot be found and missing sources, each with the matching action: install from Steam, extract the .zip archives from PCA (Fallout 4 Base and DLC, Skyrim SE Scripts.zip, Starfield ContentResources.zip), open the folder or pick PapyrusCompiler.exe.

An archive is read to know whether it was already extracted and where it unfolds, so the Fallout 4 archives are found wherever the kit dropped them.

Errors when the configured compiler belongs to another, incompatible game, and a non blocking warning when SKSE or F4SE is installed without its .psc source scripts.

Fix: the default compiler path for Starfield points at `Tools\Papyrus Compiler`, and it is found again when the game or its folder changes.

Fix: a dialog no longer grows past the window, its body scrolls instead.
