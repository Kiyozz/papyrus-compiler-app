/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useCallback, useEffect } from 'react'

export const useDocumentClick = (
  cb: () => void,
  check: (clicked: HTMLElement | null) => boolean,
): void => {
  const onClickOut = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (check(target)) {
        cb()
      }
    },
    [check, cb],
  )

  useEffect(() => {
    document.addEventListener('click', onClickOut)

    return () => document.removeEventListener('click', onClickOut)
  }, [onClickOut])
}
