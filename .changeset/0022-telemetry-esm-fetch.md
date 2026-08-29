---
'pca': patch
---

Fix telemetry never being sent: `electron-fetch` only ships CommonJS, so its default import resolved to the module object instead of the fetch function in the ESM main process. Replaced by Electron `net.fetch` and the dependency is dropped.
