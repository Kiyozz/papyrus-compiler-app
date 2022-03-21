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
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DialogType } from '../../../common/types/dialog'
import bridge from '../../bridge'
import { useApp } from '../../hooks/use-app'

type Props = {
  id: string
  className?: string
  error?: boolean
  label?: ReactNode
  defaultValue: string
  onChange: (value: string) => void
  type: DialogType
}

const DialogTextField = ({
  error = false,
  id,
  label,
  defaultValue,
  onChange,
  type,
}: Props) => {
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
    <FormControl variant="outlined" fullWidth error={error}>
      <InputLabel htmlFor={id} className="flex items-center">
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
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
        size="small"
        label={label}
        placeholder={t('common.selectFolder')}
        onChange={onChangeInput}
        value={value}
        classes={{
          inputSizeSmall: '!text-xs',
        }}
      />
    </FormControl>
  )
}

export default DialogTextField
