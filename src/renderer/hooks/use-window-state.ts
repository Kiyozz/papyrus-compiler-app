import { useEffect, useState } from 'react'

import { WindowState } from '../../common/types/window-state'
import bridge from '../bridge'

export const useWindowState = (): WindowState => {
  const [windowState, setWindowState] = useState<WindowState>('normal')

  useEffect(() => {
    const unsubscribe = bridge.window.onStateChange(state => {
      setWindowState(state)
    })

    return () => unsubscribe.dispose()
  }, [])

  return windowState
}
