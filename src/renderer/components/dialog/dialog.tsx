/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { ReactNode, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useDocumentClick } from '../../hooks/use-document-click'
import { useOnKeyUp } from '../../hooks/use-on-key-up'
import Paper from '../paper'

type DialogProps = {
  open: boolean
  maxWidth?: number
  onClose?: (reason: CloseReason) => void
  actions?: ReactNode
  title?: ReactNode
  content?: (props: React.PropsWithChildren<unknown>) => JSX.Element
  contentClassNames?: {
    content?: string
    child?: string
  }
}

enum CloseReason {
  escape,
  outside,
  enter,
}

const Dialog = ({
  open,
  maxWidth,
  onClose,
  actions,
  title,
  content: Content,
  contentClassNames = {},
  children,
}: React.PropsWithChildren<DialogProps>) => {
  const container = useRef<HTMLDivElement | null>(null)

  useDocumentClick(
    () => {
      onClose?.(CloseReason.outside)
    },
    clicked => clicked === container.current,
  )

  const onEscape = useCallback(() => {
    onClose?.(CloseReason.escape)
  }, [onClose])

  const onEnter = useCallback(() => {
    onClose?.(CloseReason.enter)
  }, [onClose])

  useOnKeyUp('Escape', onEscape)
  useOnKeyUp('Enter', onEnter)

  const dialogContent = useMemo(
    () => (
      <>
        {title && (
          <div className="sticky top-0 flex-initial flex text-xl font-medium py-4 px-6">
            {title}
          </div>
        )}
        <div
          className={cx(
            'flex-auto overflow-overlay',
            contentClassNames.content,
          )}
        >
          <div className={cx('py-2 px-6', contentClassNames.child)}>
            {children}
          </div>
        </div>
        {actions && (
          <div className="flex-initial flex p-2 gap-2 justify-end">
            {actions}
          </div>
        )}
      </>
    ),
    [actions, children, title, contentClassNames],
  )

  return createPortal(
    open ? (
      <>
        <div className="fixed top-0 left-0 z-10 w-full h-screen bg-black-800 bg-opacity-50 dark:bg-opacity-70" />
        <div
          ref={container}
          className={`fixed top-0 bottom-0 p-8 pt-16 left-0 z-10 flex justify-center items-center w-full h-screen`}
        >
          <Paper
            className="text-black-600 dark:text-light-400 p-0 w-full max-h-full flex flex-col"
            style={
              maxWidth !== undefined
                ? { maxWidth: `${maxWidth}%`, maxHeight: `${maxWidth}%` }
                : {}
            }
          >
            {Content ? <Content>{dialogContent}</Content> : dialogContent}
          </Paper>
        </div>
      </>
    ) : null,
    document.body,
  )
}

export { CloseReason }

export default Dialog
