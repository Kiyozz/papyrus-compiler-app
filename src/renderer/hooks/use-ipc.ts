/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'
import type { Disposable } from '../../common/types/disposable'

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
  }, [cb, start])
}
