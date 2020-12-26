/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  maxWidth?: number
  fullWidth?: boolean
  onClose?: () => void
}

export function Dialog({
  open,
  maxWidth,
  fullWidth = false,
  onClose,
  children
}: React.PropsWithChildren<DialogProps>) {
  const container = useRef<HTMLDivElement | null>(null)
  const onDialogClose = useCallback(
    (e: MouseEvent) => {
      const clicked = e.target as HTMLElement | null

      if (clicked === container.current) {
        onClose?.()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('click', onDialogClose)

    return () => {
      document.removeEventListener('click', onDialogClose)
    }
  }, [onDialogClose])

  return createPortal(
    open ? (
      <div
        ref={container}
        className={`fixed top-0 left-0 flex justify-center items-center${
          fullWidth ? ' w-full text-white' : ''
        } h-full bg-black bg-opacity-70`}
      >
        <div
          className="paper paper-darker p-0 w-full"
          style={maxWidth !== undefined ? { maxWidth: `${maxWidth}%` } : {}}
        >
          {children}
        </div>
      </div>
    ) : null,
    document.body
  )
}

export function DialogTitle({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h1
      className={`text-xl font-medium py-4 px-5${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </h1>
  )
}

export function DialogContent({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`py-2 px-5${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

export function DialogActions({ children }: React.PropsWithChildren<unknown>) {
  return <div className="p-2 flex gap-2 justify-end">{children}</div>
}
