/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { useDropzone } from 'react-dropzone'

type RenderChildren = {
  isDragActive: boolean
  open: () => void
}

type Props = {
  className?: string
  onDrop?: OnDrop
  onFileDialogOpen: () => void
  onFileDialogCancel: () => void
  children: (renderProps: RenderChildren) => React.ReactNode
}

type OnDrop = ((files: File[]) => void) | null

const DropScripts = ({
  onDrop,
  onFileDialogOpen,
  onFileDialogCancel,
  className,
  children,
}: React.PropsWithChildren<Props>) => {
  const { getRootProps, isDragActive, getInputProps, open } = useDropzone({
    onDrop: files => onDrop?.(files),
    accept: '.psc',
    preventDropOnDocument: true,
    noClick: true,
    noKeyboard: true,
    useFsAccessApi: false,
    onFileDialogOpen,
    onFileDialogCancel,
  })

  const { role, ...rootProps } = getRootProps()

  return (
    <div className={cx('relative z-30', className)} {...rootProps}>
      <input {...getInputProps()} />
      {children({ isDragActive, open })}
    </div>
  )
}

export type { OnDrop }

export default DropScripts
