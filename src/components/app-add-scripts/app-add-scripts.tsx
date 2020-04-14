import cx from 'classnames'
import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import AppAddScriptsButton from './app-add-scripts-button'

type InputRef = React.RefObject<HTMLInputElement>
type ButtonRef = React.RefObject<HTMLButtonElement>
type RootRef = React.RefObject<HTMLElement>

interface RenderChildren {
  isDragActive: boolean
  Button: AddScriptsButton
}

interface Props {
  className?: string
  buttonClassName?: string
  buttonText?: string
  accept?: string
  preventDropOnDocument?: boolean
  onDrop(files: File[]): void
  onClick?: (e: React.MouseEvent<HTMLDivElement>, buttonRef: ButtonRef, inputRef: InputRef, rootRef: RootRef) => void
  children: (renderProps: RenderChildren) => React.ReactNode
}

export type AddScriptsButton = JSX.Element

const AppAddScripts: React.FC<Props> = ({ onDrop, onClick, className, accept = '', preventDropOnDocument = true, children, buttonClassName, buttonText }) => {
  const { getRootProps, isDragActive, getInputProps, inputRef, rootRef } = useDropzone({
    onDrop,
    accept,
    preventDropOnDocument
  })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onClickRoot = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e, buttonRef, inputRef, rootRef)
  }, [inputRef, buttonRef, rootRef, onClick])

  const Button = (
    <AppAddScriptsButton buttonRef={buttonRef} getInputProps={getInputProps} className={cx(buttonClassName)}>
      {buttonText}
    </AppAddScriptsButton>
  )

  return (
    <div
      className={cx(className)}
      {...getRootProps({
        onClick: onClickRoot
      })}
    >
      {children({ isDragActive, Button })}
    </div>
  )
}

export default AppAddScripts
