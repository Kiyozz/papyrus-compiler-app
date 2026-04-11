/*
 * 2022-2026 Kiyozz.
 */

import { useEffect, useState } from 'react'
import { bridge } from '../bridge'
import type { WindowState } from '../../common/types/window-state'

export const useWindowState = (): WindowState => {
  const [windowState, setWindowState] = useState<WindowState>('normal')

  useEffect(() => {
    const unsubscribe = bridge.window.onStateChange((state) => {
      setWindowState(state)
    })

    return () => unsubscribe.dispose()
  }, [])

  return windowState
}
