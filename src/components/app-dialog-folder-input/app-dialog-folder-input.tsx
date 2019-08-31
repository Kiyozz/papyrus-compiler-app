import React, { useCallback } from 'react'
import './app-dialog-folder-input.scss'

interface Props {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
}

const AppDialogFolderInput: React.FC<Props> = ({ id, name, value, onChange }) => {
  const onChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    onChange(value)
  }, [onChange])

  return (
    <div className="app-dialog-folder-input">
      <input
        id={id}
        className="form-control"
        name={name}
        onChange={onChangeInput}
        defaultValue={value}
      />
    </div>
  )
}

export default AppDialogFolderInput
