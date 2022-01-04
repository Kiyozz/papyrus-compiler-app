/*
 * Copyright (c) 2021 Kiyozz.
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
  children: (renderProps: RenderChildren) => React.ReactNode
}

type OnDrop = ((files: File[]) => void) | null

const DropScripts = ({
  onDrop,
  className,
  children,
}: React.PropsWithChildren<Props>) => {
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

export type { OnDrop }

export default DropScripts
