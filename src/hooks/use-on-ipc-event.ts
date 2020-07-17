import { useCallback, useEffect, useMemo } from 'react'

export function useOnIpcEvent(event: string, callback: (...args: any[]) => void) {
  const ipcRenderer = useMemo(() => window.require('electron').ipcRenderer, [])

  const onEvent = useCallback(() => {
    callback()
  }, [callback])

  useEffect(() => {
    ipcRenderer?.on(event, onEvent)

    return () => {
      ipcRenderer?.removeListener(event, onEvent)
    }
  }, [event, onEvent, ipcRenderer])
}
