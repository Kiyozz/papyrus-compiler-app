/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface Event<T = unknown> {
  on(ipcEvent: IpcMainEvent, args: T | undefined): void
}
