import { useState } from 'react'

import { Platform } from '../../common/interfaces/platform'
import bridge from '../bridge'

export const usePlatform = (): Platform => {
  const [platform] = useState(bridge.os.platform)

  return platform
}
