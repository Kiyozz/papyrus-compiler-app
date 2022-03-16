/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect, useState } from 'react'

import { WindowState } from '../../common/types/window-state'
import { useBridge } from './use-bridge'

export const useWindowState = (): WindowState => {
  const bridge = useBridge()
  const [windowState, setWindowState] = useState<WindowState>('normal')

  useEffect(() => {
    const unsubscribe = bridge.window.onStateChange(state => {
      setWindowState(state)
    })

    return () => unsubscribe.dispose()
  }, [bridge.window])

  return windowState
}
