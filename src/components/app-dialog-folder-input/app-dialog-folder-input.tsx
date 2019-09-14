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

  const onClickInput = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()

    const { dialog } = window.require('electron').remote

    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })

      if (result.canceled) {
        return
      }

      const [folder] = result.filePaths

      if (!folder) {
        return
      }

      onChange(folder)
    } catch (e) {
      console.log(e)
    }
  }, [onChange])

  return (
    <div
      className="app-dialog-folder-input"
      onClick={onClickInput}
    >
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
