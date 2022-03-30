/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { IpcMainEvent } from 'electron'

export interface EventSync {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSync: (ipcEvent: IpcMainEvent, args: any) => unknown
}
