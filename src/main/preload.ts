/*
 * 2022-2026 Kiyozz.
 */

import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { createSecureIpcBridge } from 'kkrpc/electron-ipc'

const securedIpcRenderer = createSecureIpcBridge({
  ipcRenderer,
  channelPrefix: 'kkrpc-',
})

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: securedIpcRenderer,
  webUtils: {
    getPathForFile: (file: File) => webUtils.getPathForFile(file),
  },
})
