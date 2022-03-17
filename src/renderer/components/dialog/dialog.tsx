/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react'
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
  content?: ComponentType
  contentClassNames?: {
    content?: string
    child?: string
  }
  id: string
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
  id,
}: React.PropsWithChildren<DialogProps>) => {
  const container = useRef<HTMLDivElement | null>(null)

  useDocumentClick(
    () => {
      if (open) {
        onClose?.(CloseReason.outside)
      }
    },
    clicked => clicked === container.current,
  )

  const onEscape = useCallback(() => {
    if (open) {
      onClose?.(CloseReason.escape)
    }
  }, [onClose, open])

  const onEnter = useCallback(() => {
    if (open) {
      onClose?.(CloseReason.enter)
    }
  }, [onClose, open])

  useOnKeyUp('Escape', onEscape, open)
  useOnKeyUp('Enter', onEnter, open)

  const dialogContent = useMemo(
    () => (
      <>
        {title && (
          <div className="sticky top-0 flex flex-initial items-center py-4 px-6 text-2xl font-medium">
            {title}
          </div>
        )}
        <div
          className={cx(
            'overflow-overlay flex-auto',
            contentClassNames.content,
          )}
        >
          <div className={cx('py-2 px-6', contentClassNames.child)}>
            {children}
          </div>
        </div>
        {actions && (
          <div className="flex flex-initial justify-end gap-2 p-2">
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
        <div className="fixed top-0 left-0 z-10 h-screen w-full bg-black-800 bg-opacity-50 dark:bg-opacity-70" />
        <div
          ref={container}
          className={`fixed top-0 bottom-0 left-0 z-10 flex h-screen w-full items-center justify-center p-8 pt-16`}
        >
          <Paper
            className="flex max-h-full w-full flex-col p-0 text-black-600 dark:text-light-400"
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
    id,
  )
}

export { CloseReason }

export default Dialog
