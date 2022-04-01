/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import is from '@sindresorhus/is'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { bridge } from '../../bridge'
import { useApp } from '../../hooks/use-app'
import type { DialogType } from '../../../common/types/dialog'
import type { ChangeEvent, ReactNode } from 'react'

interface DialogTextFieldProps {
  id: string
  className?: string
  error?: boolean
  label?: ReactNode
  defaultValue: string
  onChange: (value: string) => void
  type: DialogType
}

function DialogTextField({
  error = false,
  id,
  label,
  defaultValue,
  onChange,
  type,
  className,
}: DialogTextFieldProps) {
  const { onRefreshConfig } = useApp()
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  const [isHover, setHover] = useState(false)

  const onClickInput = async (e: React.MouseEvent<HTMLElement>) => {
    setHover(false)
    e.preventDefault()
    e.currentTarget.blur()

    try {
      const result = await bridge.dialog.select(type).then(response => {
        if (is.null_(response)) {
          return
        }

        return response
      })

      if (typeof result !== 'undefined') {
        setValue(result)
        onChange(result)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const sub = onRefreshConfig.subscribe(() => {
      setValue(defaultValue)
    })

    return () => sub.unsubscribe()
  }, [defaultValue, onRefreshConfig])

  const onMouseEnter = () => {
    setHover(true)
  }
  const onMouseLeave = () => {
    setHover(false)
  }

  const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.currentTarget.value

    setValue(newValue)
    onChange(newValue)
  }

  return (
    <FormControl
      className={className}
      error={error}
      fullWidth
      variant="outlined"
    >
      <InputLabel className="flex items-center" htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput
        classes={{
          inputSizeSmall: '!text-xs',
        }}
        id={id}
        label={label}
        onChange={onChangeInput}
        placeholder={t('common.selectFolder')}
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              edge="start"
              onClick={onClickInput}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {isHover ? <FolderOpenIcon /> : <FolderIcon />}
            </IconButton>
          </InputAdornment>
        }
        value={value}
      />
    </FormControl>
  )
}

export default DialogTextField
