/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect, useState } from 'react'

import { isProduction } from '../utils/is-production'

export const useProduction = (): boolean => {
  const [isProductionState, setProduction] = useState(false)

  useEffect(() => {
    isProduction().then(value => setProduction(value))
  }, [])

  return isProductionState
}
