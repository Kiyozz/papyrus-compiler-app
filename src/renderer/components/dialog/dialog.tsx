/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import useOnKeyUp from '../../hooks/use-on-key-up'

interface DialogProps {
  open: boolean
  maxWidth?: number
  onClose?: () => void
  actions?: JSX.Element
  title?: JSX.Element
  content?: (props: React.PropsWithChildren<unknown>) => JSX.Element
}

export function Dialog({
  open,
  maxWidth,
  onClose,
  actions,
  title,
  content: Content,
  children
}: React.PropsWithChildren<DialogProps>): JSX.Element {
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

  const onEscape = useCallback(() => {
    onClose?.()
  }, [onClose])

  useOnKeyUp('Escape', onEscape)

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
        <div className="w-full h-full overflow-overlay">
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
      <>
        <div className="fixed top-0 left-0 z-10 w-full h-screen bg-black-800 bg-opacity-50 dark:bg-opacity-70" />
        <div
          ref={container}
          className={`fixed top-0 left-0 z-10 flex justify-center items-center w-full h-screen`}
        >
          <div
            className="paper text-black-400 dark:text-light-400 p-0 w-full flex flex-col"
            style={
              maxWidth !== undefined
                ? { maxWidth: `${maxWidth}%`, maxHeight: `${maxWidth}%` }
                : {}
            }
          >
            {Content ? <Content>{dialogContent}</Content> : dialogContent}
          </div>
        </div>
      </>
    ) : null,
    document.body
  )
}
