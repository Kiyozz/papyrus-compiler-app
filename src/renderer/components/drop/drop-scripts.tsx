/*
 * 2022-2026 Kiyozz.
 */

import cx from 'classnames'
import React, { useCallback, useEffect, useRef } from 'react'
import { useDropzone } from '#/hooks/use-dropzone.ts'

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
  const { isDragging } = useDropzone({
    onDrop: (files) => {
      onDrop?.(files)
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  // closing the picker without picking anything fires cancel, never change
  useEffect(() => {
    const input = inputRef.current

    if (input === null) return

    const onCancel = () => onFileDialogCancel()

    input.addEventListener('cancel', onCancel)

    return () => input.removeEventListener('cancel', onCancel)
  }, [onFileDialogCancel])

  const open = useCallback(() => {
    if (inputRef.current) {
      onFileDialogOpen()
      inputRef.current.value = ''
      inputRef.current?.click()
    }
  }, [])

  return (
    <div className={cx('relative z-30', className)}>
      <input
        ref={inputRef}
        type="file"
        accept=".psc"
        multiple
        tabIndex={-1}
        className="sr-only"
        onChange={(evt) => {
          onDrop?.(Array.from(evt.target.files ?? []))
          onFileDialogCancel()
        }}
      />
      {children({ isDragActive: isDragging, open })}
    </div>
  )
}

export type { OnDrop }

export default DropScripts
