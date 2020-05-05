import cx from 'classnames'
import React, { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { NodeService } from '../../services/node.service'
import AppAddScriptsButton, { AppAddScriptsButtonProps } from './app-add-scripts-button'

type InputRef = React.RefObject<HTMLInputElement>
type ButtonRef = React.RefObject<HTMLDivElement>
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
  onlyClickButton?: boolean
  children: (renderProps: RenderChildren) => React.ReactNode
  Button: JSX.Element
}

export type AddScriptsButton = JSX.Element

const nodeService = new NodeService()

const AppAddScripts: React.FC<Props> = ({ onDrop, onClick, className, onlyClickButton = false, accept = '', preventDropOnDocument = true, children, Button }) => {
  const { getRootProps, isDragActive, getInputProps, inputRef, rootRef } = useDropzone({
    onDrop,
    accept,
    preventDropOnDocument
  })
  const buttonRef = useRef<HTMLDivElement>(null)

  const onClickRoot = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onlyClickButton) {
      if (e.target !== buttonRef.current && !nodeService.isChildren(buttonRef.current, e.target as HTMLElement)) {
        e.stopPropagation()

        return
      }
    }

    onClick?.(e, buttonRef, inputRef, rootRef)
  }, [inputRef, onlyClickButton, buttonRef, rootRef, onClick])

  const AddButton = (
    <AppAddScriptsButton buttonRef={buttonRef} getInputProps={getInputProps} Button={Button} />
  )

  return (
    <div
      className={cx(className)}
      {...getRootProps({
        onClick: onClickRoot
      })}
    >
      {children({ isDragActive, Button: AddButton })}
    </div>
  )
}

export default AppAddScripts
