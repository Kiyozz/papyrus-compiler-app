/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'

import { Disposable } from '../../common/types/disposable'

export const useIpc = <
  IpcCb extends (cb: (...args: unknown[]) => void) => Disposable,
  Cb extends Parameters<IpcCb>[0],
>(
  start: IpcCb,
  cb: Cb,
): void => {
  useEffect(() => {
    const disposable = start(cb)

    return () => {
      disposable.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, start])
}
