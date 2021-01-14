/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ipcRenderer } from '../../common/ipc'
import { IS_PRODUCTION } from '../../common/events'

let isProductionRegistered = false
let isProductionSaved = false

export function isProduction(): Promise<boolean> {
  if (isProductionRegistered) {
    return Promise.resolve(isProductionSaved)
  }

  return ipcRenderer.invoke(IS_PRODUCTION).then(isProd => {
    if (!isProductionRegistered) {
      isProductionRegistered = true
      isProductionSaved = isProd
    }

    return isProd
  })
}
