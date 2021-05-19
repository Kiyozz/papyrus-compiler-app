/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useDocumentClick } from '../../hooks/use-document-click'
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
  children,
}: React.PropsWithChildren<DialogProps>): JSX.Element {
  const container = useRef<HTMLDivElement | null>(null)

  useDocumentClick(
    () => {
      onClose?.()
    },
    clicked => clicked === container.current,
  )

  const onEscape = useCallback(() => {
    onClose?.()
  }, [onClose])

  useOnKeyUp('Escape', onEscape)

  const dialogContent = useMemo(
    () => (
      <>
        {title && (
          <div className="sticky top-0 flex-initial flex text-xl font-medium py-4 px-6">
            {title}
          </div>
        )}
        <div className="flex-auto overflow-overlay">
          <div className="py-2 px-6">{children}</div>
        </div>
        {actions && (
          <div className="flex-initial flex p-2 gap-2 justify-end">
            {actions}
          </div>
        )}
      </>
    ),
    [actions, children, title],
  )

  return createPortal(
    open ? (
      <>
        <div className="fixed top-0 left-0 z-10 w-full h-screen bg-black-800 bg-opacity-50 dark:bg-opacity-70" />
        <div
          ref={container}
          className={`fixed top-0 bottom-0 p-8 pt-16 left-0 z-10 flex justify-center items-center w-full h-screen`}
        >
          <div
            className="paper text-black-600 dark:text-light-400 p-0 w-full max-h-full flex flex-col"
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
    document.body,
  )
}
