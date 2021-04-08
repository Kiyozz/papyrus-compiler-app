/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import bridge from '../bridge'

let isProductionRegistered = false
let isProductionSaved = false

export function isProduction(): Promise<boolean> {
  if (isProductionRegistered) {
    return Promise.resolve(isProductionSaved)
  }

  return bridge.isProduction().then(isProd => {
    if (!isProductionRegistered) {
      isProductionRegistered = true
      isProductionSaved = isProd
    }

    return isProd
  })
}
