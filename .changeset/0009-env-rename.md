---
'pca': minor
---

Fix telemetry configuration: the API URL was read from the feature flag variable, and the renderer never received its build-time values at all (Vite only exposes `VITE_`-prefixed variables). Environment variables are now prefixed `PCA_` instead of `ELECTRON_`.
