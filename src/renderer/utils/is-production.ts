/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Events } from '../../common/events'
import { ipcRenderer } from '../../common/ipc'

let isProductionRegistered = false
let isProductionSaved = false

export function isProduction(): Promise<boolean> {
  if (isProductionRegistered) {
    return Promise.resolve(isProductionSaved)
  }

  return ipcRenderer.invoke<boolean>(Events.IsProduction).then(isProd => {
    if (!isProductionRegistered) {
      isProductionRegistered = true
      isProductionSaved = isProd
    }

    return isProd
  })
}
