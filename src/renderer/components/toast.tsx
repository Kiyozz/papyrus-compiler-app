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
  in: isEnabled,
  speedMs,
  autoCloseMs = 4_000,
}: Props): JSX.Element {
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
      className="toast fixed z-20 bottom-3 left-3 bg-light-800 dark:bg-gray-800 py-1.5 px-4 items-center rounded text-sm dark:text-white flex gap-1.5"
    >
      <div className="flex-grow">{message}</div>
      <div className="flex gap-2">{actions}</div>
    </Scale>
  )
}
