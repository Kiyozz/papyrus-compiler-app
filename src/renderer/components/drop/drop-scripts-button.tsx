/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { DropzoneState } from 'react-dropzone'

type GetInputProps = DropzoneState['getInputProps']

interface Props {
  buttonRef: React.RefObject<HTMLDivElement>
  getInputProps: GetInputProps
  Button?: JSX.Element | null
  className?: string
}

export function DropScriptsButton({
  getInputProps,
  children,
  buttonRef,
  Button,
  className
}: React.PropsWithChildren<Props>): JSX.Element {
  return (
    <div ref={buttonRef} className={cx(className)}>
      {Button}

      <input {...getInputProps()} />

      {children}
    </div>
  )
}
