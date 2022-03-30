/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useState } from 'react'
import bridge from '../bridge'
import type { Platform } from '../../common/types/platform'

export const usePlatform = (): Platform => {
  const [platform] = useState(bridge.os.platform)

  return platform
}
