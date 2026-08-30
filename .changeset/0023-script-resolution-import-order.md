---
'pca': patch
---

Compile the script that was picked, not a namesake found in the game sources. The compiler resolves a script name against the current working directory (always first) then the imports in order, keeping the first match: the folder of the script is now both the working directory and the first import. Fixes wrong script compiled when several import folders hold the same name, typically under MO2 where Data merges every mod.
