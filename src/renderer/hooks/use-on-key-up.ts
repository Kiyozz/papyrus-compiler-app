/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useCallback, useEffect } from 'react'

interface UseOnKeyUpOptions {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
}

export const useOnKeyUp = (
  key: string,
  action: () => void,
  isActive: boolean,
  options?: UseOnKeyUpOptions,
) => {
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== key) {
        return
      }

      if (options) {
        if (options.ctrl && !e.ctrlKey) {
          return
        }

        if (options.alt && !e.altKey) {
          return
        }

        if (options.shift && !e.shiftKey) {
          return
        }
      }

      action()
    },
    [action, key, options],
  )

  useEffect(() => {
    const unSub = () => {
      document.body.removeEventListener('keyup', onKeyUp)
    }

    if (isActive) {
      document.body.addEventListener('keyup', onKeyUp)
    } else {
      unSub()
    }

    return () => {
      unSub()
    }
  }, [onKeyUp, isActive])
}
