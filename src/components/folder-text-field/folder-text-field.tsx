import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import FolderIcon from '@material-ui/icons/Folder'

import React from 'react'

import classes from './folder-text-field.module.scss'

export interface Props {
  error?: boolean
  label?: string
  value: string
  onChange: (value: string) => void
}

const FolderTextField: React.FC<Props> = ({ error = false, label, value, onChange }) => {
  const onClickInput = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.blur()

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
  }

  return (
    <TextField
      error={error}
      fullWidth
      className={classes.textField}
      value={value}
      onClick={onClickInput}
      label={label}
      placeholder="Select a folder"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FolderIcon />
          </InputAdornment>
        )
      }}
    />
  )
}

export default FolderTextField
