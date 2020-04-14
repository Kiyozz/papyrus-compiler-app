import React from 'react'
import { DropzoneState } from 'react-dropzone'

type GetInputProps = DropzoneState['getInputProps']

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  buttonRef: React.RefObject<HTMLButtonElement>
  getInputProps: GetInputProps
}

const AppAddScriptsButton: React.FC<Props> = ({ getInputProps, children, buttonRef, ...shared }) => {
  return (
    <button ref={buttonRef} {...shared}>
      <input {...getInputProps()} />

      {children}
    </button>
  )
}

export default AppAddScriptsButton
