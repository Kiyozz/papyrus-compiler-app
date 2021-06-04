/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { useEffect } from 'react'

import { Disposable } from '../../common/interfaces/disposable'

export function useIpc(
  start: (cb: () => void) => Disposable,
  cb: () => unknown,
): void {
  useEffect(() => {
    const disposable = start(cb)

    return () => {
      disposable.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, start])
}
