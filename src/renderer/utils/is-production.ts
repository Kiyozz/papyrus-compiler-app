/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { bridge } from '../bridge'

let isProductionRegistered = false
let isProductionSaved = false

export const isProduction = (): Promise<boolean> => {
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
