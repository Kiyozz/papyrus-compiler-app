/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import type { AriaRole } from 'react'

interface RenderChildren {
  isDragActive: boolean
  open: () => void
}

interface DropScriptsProps {
  className?: string
  onDrop?: OnDrop
  onFileDialogOpen: () => void
  onFileDialogCancel: () => void
  children: (renderProps: RenderChildren) => React.ReactNode
}

type OnDrop = ((files: File[]) => void) | null

function DropScripts({
  onDrop,
  onFileDialogOpen,
  onFileDialogCancel,
  className,
  children,
}: DropScriptsProps) {
  const { getRootProps, isDragActive, getInputProps, open } = useDropzone({
    onDrop: files => onDrop?.(files),
    accept: {
      'text/psc': ['.psc'],
    },
    preventDropOnDocument: true,
    noClick: true,
    noKeyboard: true,
    useFsAccessApi: false,
    onFileDialogOpen,
    onFileDialogCancel,
  })

  const { role, ...rootProps } = getRootProps<{ role: AriaRole }>()

  return (
    <div className={cx('relative z-30', className)} {...rootProps}>
      <input {...getInputProps()} />
      {children({ isDragActive, open })}
    </div>
  )
}

export type { OnDrop }

export default DropScripts
