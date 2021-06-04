/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useEffect } from 'react'

import { Delay, Scale } from './animations/scale'

interface Props {
  message: string
  actions?: JSX.Element
  onClose: () => void
  in: boolean
  speedMs: Delay
  autoCloseMs?: number
}

export function Toast({
  message,
  actions,
  onClose,
  in: enabled,
  speedMs,
  autoCloseMs = 4_000,
}: Props): JSX.Element {
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (enabled && autoCloseMs !== 0) {
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
  }, [autoCloseMs, enabled, onClose])

  return (
    <Scale
      in={enabled}
      speedMs={speedMs}
      className="toast fixed z-20 bottom-3 left-3 bg-light-800 dark:bg-gray-800 py-3 px-4 items-center rounded text-sm dark:text-white flex justify-between"
    >
      <div>{message}</div>
      <div className="inline-flex gap-2 ml-1 toast-actions">{actions}</div>
    </Scale>
  )
}
