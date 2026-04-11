/*
 * 2022-2026 Kiyozz.
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
