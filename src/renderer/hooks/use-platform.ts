/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useState } from 'react'

import { Platform } from '../../common/types/platform'
import { useBridge } from './use-bridge'

export const usePlatform = (): Platform => {
  const { os } = useBridge()
  const [platform] = useState(os.platform)

  return platform
}
