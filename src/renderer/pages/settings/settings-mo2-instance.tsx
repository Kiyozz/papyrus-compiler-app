/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogTextField } from '../../components/dialog-text-field'
import { usePageContext } from '../../components/page-context'

interface Props {
  onChangeMo2Instance: (value: string) => void
}

export function SettingsMo2Instance({ onChangeMo2Instance }: Props) {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = usePageContext()

  if (!mo2.use) {
    return null
  }

  return (
    <DialogTextField
      defaultValue={mo2.instance ?? ''}
      label={t('page.settings.mo2.instance')}
      onChange={onChangeMo2Instance}
      type="folder"
    />
  )
}
