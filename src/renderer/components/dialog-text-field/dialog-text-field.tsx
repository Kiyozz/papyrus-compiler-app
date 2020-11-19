import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import cx from 'classnames'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiFactory } from '../../redux/api/api-factory'

import classes from './dialog-text-field.module.scss'
import { DialogType } from '../../../common/interfaces/dialog.interface'
import { usePageContext } from '../page/page-context'

export interface Props {
  className?: string
  error?: boolean
  label?: string
  defaultValue: string
  onChange: (value: string) => void
  type: DialogType
}

const DialogTextField: React.FC<Props> = ({
  error = false,
  label,
  defaultValue,
  onChange,
  className = '',
  type
}) => {
  const { onRefreshConfig } = usePageContext()
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  const [isHover, setHover] = useState(false)
  const api = useMemo(() => apiFactory(), [])
  const onClickInput = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.currentTarget.blur()

      try {
        const result = await api.openDialog({ type })

        if (typeof result !== 'undefined') {
          setValue(result)
          onChange(result)
        }
      } catch (err) {
        console.log(err?.message)
      }
    },
    [api, onChange, type]
  )

  useEffect(() => {
    const sub = onRefreshConfig.subscribe(() => {
      setValue(defaultValue)
    })

    return () => sub.unsubscribe()
  }, [defaultValue, onRefreshConfig])

  const handleMouseEnter = useCallback(() => {
    setHover(true)
  }, [])
  const handleMouseLeave = useCallback(() => {
    setHover(false)
  }, [])

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value

      setValue(newValue)
      onChange(newValue)
    },
    [onChange]
  )

  return (
    <TextField
      error={error}
      fullWidth
      className={cx(classes.textField, { [className]: !!className })}
      value={value}
      onChange={onChangeInput}
      label={label}
      placeholder={t('common.selectFolder')}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            onClick={onClickInput}
            className={classes.icon}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isHover ? <FolderOpenIcon /> : <FolderIcon />}
          </InputAdornment>
        )
      }}
    />
  )
}

export default DialogTextField
