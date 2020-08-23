import { useEffect, useMemo } from 'react'
import type { RendererProcessIpc } from 'electron-better-ipc'

export function useOnIpcEvent(event: string, callback: (data: unknown) => void) {
  const ipc = useMemo<RendererProcessIpc>(() => window.require('electron-better-ipc').ipcRenderer, [])

  useEffect(() => {
    const cb = ipc.answerMain(event, data => callback(data))

    return () => {
      cb()
    }
  }, [event, ipc, callback])
}
