/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { IpcApi } from './ipc-api'

export function apiFactory() {
  return new IpcApi()
}
