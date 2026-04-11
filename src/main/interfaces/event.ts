/*
 * 2022-2026 Kiyozz.
 */

import type { IpcMainEvent } from 'electron'

export interface Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (ipcEvent: IpcMainEvent, args: any) => void
}
