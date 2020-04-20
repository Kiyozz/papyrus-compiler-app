import { Button } from '@material-ui/core'
import React from 'react'
import { DropzoneState } from 'react-dropzone'

type GetInputProps = DropzoneState['getInputProps']

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  buttonRef: React.RefObject<HTMLButtonElement>
  getInputProps: GetInputProps
}

const AppAddScriptsButton: React.FC<Props> = ({ getInputProps, children, buttonRef, ...shared }) => {
  return (
    <Button color="primary" variant="contained" ref={buttonRef}>
      <input {...getInputProps()} />

      {children}
    </Button>
  )
}

export default AppAddScriptsButton
