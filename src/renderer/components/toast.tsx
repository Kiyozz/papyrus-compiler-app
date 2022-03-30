/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { useEffect } from 'react'
import Scale from './animations/scale'
import type { Delay } from './animations/scale';
import type { ReactNode } from 'react';

type ToastType = 'error' | 'normal'

interface Props {
  message?: ReactNode
  actions?: ReactNode
  onClose: () => void
  in: boolean
  speedMs: Delay
  autoCloseMs?: number
  type?: ToastType
}

function Toast({
  message,
  actions,
  onClose,
  in: isEnabled,
  speedMs,
  autoCloseMs = 4_000,
  type = 'normal',
}: Props) {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (isEnabled && autoCloseMs !== 0) {
      const handler = () => {
        onClose()
      }

      timer = setTimeout(handler, autoCloseMs)
    }

    return () => {
      if (!is.undefined(timer)) {
        clearTimeout(timer)
      }
    }
  }, [autoCloseMs, isEnabled, onClose])

  return (
    <Scale
      className={cx(
        'toast',
        type === 'error' && 'toast-error',
        !isEnabled && 'pointer-events-none',
      )}
      in={isEnabled}
      speedMs={speedMs}
    >
      <div className="grow">{message}</div>
      <div className="flex gap-2">{actions}</div>
    </Scale>
  )
}

export default Toast
