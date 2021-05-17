/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { useDropzone } from 'react-dropzone'

interface RenderChildren {
  isDragActive: boolean
  open: () => void
}

interface Props {
  className?: string
  onDrop?: OnDropFunction
  children: (renderProps: RenderChildren) => React.ReactNode
}

export type AddScriptsButton = JSX.Element
export type OnDropFunction = ((files: File[]) => void) | null

export function DropScripts({
  onDrop,
  className,
  children,
}: React.PropsWithChildren<Props>): JSX.Element {
  const { getRootProps, isDragActive, getInputProps, open } = useDropzone({
    onDrop: files => onDrop?.(files),
    accept: '.psc',
    preventDropOnDocument: true,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div className={cx('w-full h-full', className)} {...getRootProps()}>
      <input {...getInputProps()} />
      {children({ isDragActive, open })}
    </div>
  )
}
