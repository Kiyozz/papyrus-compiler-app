/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect, useCallback } from 'react'
import { ipcRenderer } from '../../common/ipc'

export function useOnIpc<Args = any>(
  channel: string,
  listerner: (args: Args) => void
) {
  const callback = useCallback(
    (args: Args) => {
      listerner(args)
    },
    [listerner]
  )

  useEffect(() => {
    ipcRenderer.on(channel, callback)

    return () => ipcRenderer.off(channel, callback)
  }, [callback, channel])
}

export function useIpcSendSync<R = unknown>(channel: string, args: any[] = []) {
  const callback = useCallback(
    () => ipcRenderer.sendSync<R>(channel, ...args),
    [channel, args]
  )

  return callback
}
