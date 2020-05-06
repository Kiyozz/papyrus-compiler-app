import React from 'react'
import { DropzoneState } from 'react-dropzone'

type GetInputProps = DropzoneState['getInputProps']

interface Props {
  buttonRef: React.RefObject<HTMLDivElement>
  getInputProps: GetInputProps
  Button: JSX.Element
}

const DropScriptsButton: React.FC<Props> = ({ getInputProps, children, buttonRef, Button }) => {
  return (
    <div ref={buttonRef}>
      {Button}

      <input {...getInputProps()} />

      {children}
    </div>
  )
}

export default DropScriptsButton
