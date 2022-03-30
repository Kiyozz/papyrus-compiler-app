/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useState } from 'react'
import { useDidMount } from 'rooks'
import { isProduction } from '../utils/is-production'

export const useProduction = (): boolean => {
  const [isProductionState, setProduction] = useState(false)

  useDidMount(async () => {
    setProduction(await isProduction())
  })

  return isProductionState
}
