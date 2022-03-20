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

interface Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SettingsMo2Activation = ({ onChangeMo2 }: Props) => {
  const { t } = useTranslation()
  const {
    config: { mo2 },
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

export default SettingsMo2Activation