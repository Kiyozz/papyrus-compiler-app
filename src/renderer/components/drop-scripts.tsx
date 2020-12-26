/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { HtmlNodeService } from '../services/html-node.service'
import { DropScriptsButton } from './drop-scripts-button'

type InputRef = React.RefObject<HTMLInputElement>
type ButtonRef = React.RefObject<HTMLDivElement>
type RootRef = React.RefObject<HTMLElement>

interface RenderChildren {
  isDragActive: boolean
  Button: AddScriptsButton
}

interface Props {
  className?: string
  accept?: string
  preventDropOnDocument?: boolean
  onDrop?: OnDropFunction
  onClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    buttonRef: ButtonRef,
    inputRef: InputRef,
    rootRef: RootRef
  ) => void
  onlyClickButton?: boolean
  children: (renderProps: RenderChildren) => React.ReactNode
  Button?: JSX.Element | null
  buttonClassName?: string
}

export type AddScriptsButton = JSX.Element
export type OnDropFunction = ((files: File[]) => void) | null

const htmlNodeService = new HtmlNodeService()

export function DropScripts({
  onDrop,
  onClick,
  className,
  buttonClassName,
  onlyClickButton = false,
  accept = '',
  preventDropOnDocument = true,
  children,
  Button
}: React.PropsWithChildren<Props>) {
  const {
    getRootProps,
    isDragActive,
    getInputProps,
    inputRef,
    rootRef
  } = useDropzone({
    onDrop: files => onDrop?.(files),
    accept,
    preventDropOnDocument
  })
  const buttonRef = useRef<HTMLDivElement>(null)

  const onClickRoot = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (onlyClickButton) {
        if (
          e.target !== buttonRef.current &&
          !htmlNodeService.isChildren(
            buttonRef.current,
            e.target as HTMLElement
          )
        ) {
          e.stopPropagation()

          return
        }
      }

      onClick?.(e, buttonRef, inputRef, rootRef)
    },
    [inputRef, onlyClickButton, buttonRef, rootRef, onClick]
  )

  const AddButton = (
    <DropScriptsButton
      className={buttonClassName}
      buttonRef={buttonRef}
      getInputProps={getInputProps}
      Button={Button}
    />
  )

  return (
    <div
      className={cx('w-full h-full flex', className)}
      {...getRootProps({
        onClick: onClickRoot
      })}
    >
      {children({ isDragActive, Button: AddButton })}
    </div>
  )
}
