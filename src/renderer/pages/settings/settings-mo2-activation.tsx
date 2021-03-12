/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SettingsMo2Activation({ onChangeMo2 }: Props): JSX.Element {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = useApp()

  return (
    <FormControlLabel
      control={
        <Checkbox
          id="mo2"
          name="mo2"
          checked={mo2.use}
          onChange={onChangeMo2}
        />
      }
      label={
        <span className="dark:text-white">{t('page.settings.mo2.enable')}</span>
      }
    />
  )
}
