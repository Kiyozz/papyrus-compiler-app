import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import FolderIcon from '@material-ui/icons/Folder'

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import apiFactory from '../../redux/api/api-factory'

import classes from './folder-text-field.module.scss'

export interface Props {
  error?: boolean
  label?: string
  value: string
  onChange: (value: string) => void
}

const FolderTextField: React.FC<Props> = ({ error = false, label, value, onChange }) => {
  const { t } = useTranslation()
  const api = useMemo(() => apiFactory(), [])
  const onClickInput = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.blur()

    try {
      const result = await api.openDialog()

      if (typeof result !== 'undefined') {
        onChange(result)
      }
    } catch (err) {
      console.log(err?.message)
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
      placeholder={t('common.selectFolder')}
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
