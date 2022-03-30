/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { IpcMainEvent } from 'electron'

export interface Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (ipcEvent: IpcMainEvent, args: any) => void
}
