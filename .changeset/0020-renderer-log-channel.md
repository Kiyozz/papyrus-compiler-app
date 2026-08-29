---
'pca': patch
---

Give the renderer a way to write to the electron-log files. It had no logger at all: its few `console` calls only ever reached the devtools and were lost once the app was packaged. Renderer entries now go through the bridge and are written by the main process under a `Renderer:<scope>` scope, so they show up in the log files users send along with a bug report.
