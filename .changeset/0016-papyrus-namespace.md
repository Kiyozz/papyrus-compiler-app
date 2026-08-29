---
'pca': minor
---

Support Papyrus namespaces (Fallout 4, Starfield). The namespace declared in the psc header (`Scriptname MyMod:Script`) is now given to the compiler, the namespace root folder is imported instead of the script folder, and the pex is written to its namespace subfolder. Duplicate imports are removed to keep the command line shorter.
