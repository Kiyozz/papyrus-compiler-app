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

const DropScriptsButton: React.FC<Props> = ({ getInputProps, children, buttonRef, Button, className }) => {
  return (
    <div ref={buttonRef} className={cx(className)}>
      {Button}

      <input {...getInputProps()} />

      {children}
    </div>
  )
}

export default DropScriptsButton
