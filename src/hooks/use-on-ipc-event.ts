import { useCallback, useEffect } from 'react'

const ipcRenderer = window.require('electron').ipcRenderer

export function useOnIpcEvent(event: string, callback: (...args: any[]) => void) {
  const onEvent = useCallback(() => {
    callback()
  }, [callback])

  useEffect(() => {
    ipcRenderer.on(event, onEvent)

    return () => {
      ipcRenderer.removeListener(event, onEvent)
    }
  })
}
