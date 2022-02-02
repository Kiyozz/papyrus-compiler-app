/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { useEffect, ReactNode } from 'react'

import Scale, { Delay } from './animations/scale'

type ToastType = 'error' | 'normal'

type Props = {
  message?: ReactNode
  actions?: ReactNode
  onClose: () => void
  in: boolean
  speedMs: Delay
  autoCloseMs?: number
  type?: ToastType
}

const Toast = ({
  message,
  actions,
  onClose,
  in: isEnabled,
  speedMs,
  autoCloseMs = 4_000,
  type = 'normal',
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
        'toast',
        type === 'error' && 'toast-error',
        !isEnabled && 'pointer-events-none',
      )}
    >
      <div className="flex-grow">{message}</div>
      <div className="flex gap-2">{actions}</div>
    </Scale>
  )
}

export default Toast
