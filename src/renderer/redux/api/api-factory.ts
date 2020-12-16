/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcApi } from './ipc-api'

export function apiFactory() {
  return new IpcApi()
}
