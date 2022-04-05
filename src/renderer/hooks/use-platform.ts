/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { bridge } from '../bridge'
import type { Platform } from '../../common/types/platform'

const platform = bridge.os.platform()

export const usePlatform = (): Platform => {
  return platform
}
