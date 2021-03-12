/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface EventSync<T = unknown, R = unknown> {
  onSync(ipcEvent: IpcMainEvent, args: T | undefined): R
}
