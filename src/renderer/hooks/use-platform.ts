/*
 * 2022-2026 Kiyozz.
 */

import { bridge } from '../bridge'
import type { Platform } from '../../common/types/platform'

const platform: Platform = await bridge.os.platform()

export const usePlatform = (): Platform => {
  return platform
}
