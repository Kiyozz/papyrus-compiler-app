/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { useEffect, ReactNode } from 'react'

import Scale, { Delay } from './animations/scale'

type Props = {
  message?: string
  actions?: ReactNode
  onClose: () => void
  in: boolean
  speedMs: Delay
  autoCloseMs?: number
}

const Toast = ({
  message,
  actions,
  onClose,
  in: isEnabled,
  speedMs,
  autoCloseMs = 4_000,
}: Props) => {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (isEnabled && autoCloseMs !== 0) {
      const handler = () => {
        onClose()
      }

      timer = setTimeout(handler, autoCloseMs)
    }

    return () => {
      if (timer !== undefined) {
        clearTimeout(timer)
      }
    }
  }, [autoCloseMs, isEnabled, onClose])

  return (
    <Scale
      in={isEnabled}
      speedMs={speedMs}
      className={cx(
        'toast fixed z-20 bottom-3 left-3 bg-light-800 dark:bg-gray-800 py-1.5 px-4 items-center rounded text-sm dark:text-white flex gap-1.5',
        !isEnabled && 'pointer-events-none',
      )}
    >
      <div className="flex-grow">{message}</div>
      <div className="flex gap-2">{actions}</div>
    </Scale>
  )
}

export default Toast
