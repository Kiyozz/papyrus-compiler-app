/*
 * 2022-2026 Kiyozz.
 */

import type { IpcMainEvent } from 'electron'

export interface EventSync {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSync: (ipcEvent: IpcMainEvent, args: any) => unknown
}
