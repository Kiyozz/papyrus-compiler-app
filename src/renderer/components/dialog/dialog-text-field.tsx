/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import is from '@sindresorhus/is'

import { DialogType } from '../../../common/interfaces/dialog.interface'
import { ipcRenderer } from '../../../common/ipc'
import { Events } from '../../../common/events'
import { useApp } from '../../hooks/use-app'
import { TextField } from '../text-field'

export interface Props {
  id: string
  className?: string
  error?: boolean
  label?: string
  defaultValue: string
  onChange: (value: string) => void
  type: DialogType
}

export function DialogTextField({
  error = false,
  id,
  label,
  defaultValue,
  onChange,
  type
}: Props) {
  const { onRefreshConfig } = useApp()
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  const [isHover, setHover] = useState(false)
  const onClickInput = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      setHover(false)
      e.preventDefault()
      e.currentTarget.blur()

      try {
        const result = await ipcRenderer
          .invoke<string | null>(Events.OpenDialog, { type })
          .then(response => {
            if (response === null) {
              return
            }

            return response
          })

        if (typeof result !== 'undefined') {
          setValue(result)
          onChange(result)
        }
      } catch (err) {
        console.log(err?.message)
      }
    },
    [onChange, type]
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
    (newValue: string | number) => {
      if (is.string(newValue)) {
        setValue(newValue)
        onChange(newValue)
      }
    },
    [onChange]
  )

  return (
    <TextField
      id={id}
      error={error}
      startIcon={isHover ? <FolderOpenIcon /> : <FolderIcon />}
      value={value}
      onChange={onChangeInput}
      label={label}
      placeholder={t('common.selectFolder')}
      iconOnMouseEnter={handleMouseEnter}
      iconOnMouseLeave={handleMouseLeave}
      iconOnClick={onClickInput}
      inputClassName="text-xs"
    />
  )
}