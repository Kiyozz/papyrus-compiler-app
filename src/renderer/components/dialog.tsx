/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  maxWidth?: number
  fullWidth?: boolean
  onClose?: () => void
  actions?: JSX.Element
  title?: JSX.Element
  content?: (props: React.PropsWithChildren<unknown>) => JSX.Element
}

export function Dialog({
  open,
  maxWidth,
  fullWidth = false,
  onClose,
  actions,
  title,
  content: Content,
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

  const dialogContent = useMemo(
    () => (
      <>
        {title && (
          <div className="sticky top-0 w-full h-full flex text-xl font-medium py-4 px-5">
            {title}
          </div>
        )}
        <div className="w-full h-full overflow-auto">
          <div className="py-2 px-5">{children}</div>
        </div>
        {actions && (
          <div className="w-full h-full flex p-2 gap-2 justify-end">
            {actions}
          </div>
        )}
      </>
    ),
    [actions, children, title]
  )

  return createPortal(
    open ? (
      <div
        ref={container}
        className={`fixed top-0 left-0 flex justify-center items-center ${
          fullWidth ? ' w-full text-white' : ''
        } h-screen bg-black bg-opacity-70`}
      >
        <div
          className="paper paper-darker p-0 w-full flex flex-col"
          style={
            maxWidth !== undefined
              ? { maxWidth: `${maxWidth}%`, maxHeight: `${maxWidth}%` }
              : {}
          }
        >
          {Content ? <Content>{dialogContent}</Content> : dialogContent}
        </div>
      </div>
    ) : null,
    document.body
  )
}
