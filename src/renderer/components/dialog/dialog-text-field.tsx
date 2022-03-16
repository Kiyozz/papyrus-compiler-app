/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import is from '@sindresorhus/is'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DialogType } from '../../../common/types/dialog'
import { useApp } from '../../hooks/use-app'
import { useBridge } from '../../hooks/use-bridge'
import TextField from '../text-field'

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
  const { dialog } = useBridge()
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
        const result = await dialog.select(type).then(response => {
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
    },
    [dialog, onChange, type],
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
    [onChange],
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

export default DialogTextField
