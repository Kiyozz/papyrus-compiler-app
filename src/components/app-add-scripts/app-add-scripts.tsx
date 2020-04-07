import cx from 'classnames'
import React from 'react'
import { useDropzone } from 'react-dropzone'

interface RenderChildren {
  isDragActive: boolean
  Button: AddScriptsButton
}

interface Props {
  className?: string
  accept?: string
  preventDropOnDocument?: boolean
  onDrop(files: File[]): void
  onClick(e: React.MouseEvent<HTMLButtonElement>): void
  children: (renderProps: RenderChildren) => React.ReactNode
}

export type AddScriptsButton = React.FC<React.HTMLAttributes<HTMLButtonElement> & { ref?: any }>

const AppAddScripts: React.FC<Props> = ({ onDrop, onClick, className, accept = '', preventDropOnDocument = true, children }) => {
  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    onDrop,
    accept: '.psc',
    preventDropOnDocument
  })

  const Button: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({ children: buttonChildren, className: buttonClassName }) => (
    <button className={cx(buttonClassName)}>
      <input {...getInputProps()} />

      {buttonChildren}
    </button>
  )

  return (
    <div
      className={cx(className)}
      {...getRootProps({
        onClick
      })}
    >
      {children({ isDragActive, Button })}
    </div>
  )
}

export default AppAddScripts
