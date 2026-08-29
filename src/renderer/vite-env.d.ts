/*
 * 2026 Kiyozz.
 */

/// <reference types="vite/client" />

import type { webUtils } from 'electron'
import type { SecureIpcBridge } from 'kkrpc/electron'

declare global {
  interface Window {
    electron: {
      ipcRenderer: SecureIpcBridge
      webUtils: Pick<typeof webUtils, 'getPathForFile'>
    }
  }
}
