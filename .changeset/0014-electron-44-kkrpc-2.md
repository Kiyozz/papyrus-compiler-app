---
'pca': minor
---

Upgrade Electron 41 -> 44, electron-builder 26.15, tsdown 0.22,
electron-tsdown 12 and kkrpc 0.6 -> 2.

kkrpc v2 replaces the `kkrpc/electron-ipc` IO adapters with transports from
`kkrpc/electron`, and the main/renderer channels now take their local API
through the channel options instead of `RPCChannel.expose()`. Its default IPC
channel is also renamed, so the preload bridge allows the `kkrpc:` prefix.

Electron 44 removed the two-argument `clipboard.writeText(text, 'selection')`
form; the Linux selection clipboard now lives under `clipboard.selection`.
