/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface EventSyncInterface<T = unknown, R = unknown> {
  onSync(ipcEvent: IpcMainEvent, args: T | undefined): R
}
