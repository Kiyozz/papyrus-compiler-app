---
'pca': patch
---

Files and folders that only live in Mod Organizer 2's virtual file system (mods, Root Builder) are now found even with an MO2 older than usvfs 0.5.7.1 on recent Windows 11 builds. This fixes the "Data\Scripts cannot be created (ENOENT)" error when compiling from MO2, and the SKSE check that missed the loader or the SKSE scripts. The SKSE scripts left in Data\Scripts\Source, where the SKSE archive puts them, no longer raise the legacy source folder warning, and the SKSE warning now tells MO2 users to install SKSE as a mod and launch PCA from MO2.

The folder pickers in the settings now open on the field's current path, or on the game folder for an empty output folder, instead of Windows' last folder, which MO2 users could not reach.
