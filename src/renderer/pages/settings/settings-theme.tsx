/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Theme } from '../../../common/theme'
import { useTheme } from '../../hooks/use-theme'
import SettingsSection from './settings-section'

const SettingsTheme = () => {
  const { t } = useTranslation()
  const [theme, setTheme] = useTheme()

  const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Theme

    setTheme(value)
  }

  return (
    <SettingsSection title={t('page.settings.theme.title')} id="settings-theme">
      <div className="relative">
        <FormControl component="fieldset" fullWidth>
          <RadioGroup row value={theme} onChange={onChangeTheme}>
            <FormControlLabel
              value={Theme.system}
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.system')}</>}
            />
            <FormControlLabel
              value={Theme.light}
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.light')}</>}
            />
            <FormControlLabel
              value={Theme.dark}
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.dark')}</>}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </SettingsSection>
  )
}

export default SettingsTheme
