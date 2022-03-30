/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../../hooks/use-app'

interface SettingsMo2ActivationProps {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SettingsMo2Activation({ onChangeMo2 }: SettingsMo2ActivationProps) {
  const { t } = useTranslation()
  const {
    config: { mo2 },
  } = useApp()

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={mo2.use}
          id="mo2"
          name="mo2"
          onChange={onChangeMo2}
        />
      }
      label={
        <span className="dark:text-white">{t('page.settings.mo2.enable')}</span>
      }
    />
  )
}

export default SettingsMo2Activation
