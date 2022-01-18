/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface Event<T = unknown> {
  on(ipcEvent: IpcMainEvent, args: T | undefined): void
}
