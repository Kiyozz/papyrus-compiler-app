/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface EventSync<T = unknown, R = unknown> {
  onSync(ipcEvent: IpcMainEvent, args: T | undefined): R
}
