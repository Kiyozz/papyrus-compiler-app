/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import is from '@sindresorhus/is'
import { apiFactory } from '../redux/api/api-factory'

import { DialogType } from '../../common/interfaces/dialog.interface'
import { TextField } from './text-field'
import { usePageContext } from './page-context'

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
  const { onRefreshConfig } = usePageContext()
  const { t } = useTranslation()
  const [value, setValue] = useState(defaultValue)
  const [isHover, setHover] = useState(false)
  const api = useMemo(() => apiFactory(), [])
  const onClickInput = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      setHover(false)
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
