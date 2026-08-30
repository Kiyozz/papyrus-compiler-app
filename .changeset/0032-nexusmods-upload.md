---
'pca': patch
---

CI: upload every release to the NexusMods pages (Skyrim LE, Skyrim SE, Fallout 4, Starfield) with `Nexus-Mods/upload-action`, changelog included, then publish the GitHub release that stays a draft until the archive is there. The `mod_id`/`file_id` pair of a page comes from repository variables, an unset pair skips it, and `scripts/nexus-ids.mjs` resolves them.
