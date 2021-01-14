/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcMainEvent } from 'electron'

export interface EventInterface<T = unknown> {
  on(ipcEvent: IpcMainEvent, args: T | undefined): void
}
