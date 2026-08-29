---
'pca': patch
---

Pin Lingui's `descriptorFields` in the main process build.

It defaults to `auto`, which resolves through `process.env.NODE_ENV` while
transforming — inside rolldown's workers, where the value electron-tsdown sets
is not reliably visible. Two consecutive production builds could disagree on
whether the `message` fallback field was stripped. The value is now resolved
once, when the config is evaluated.
