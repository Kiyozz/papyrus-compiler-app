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

function SettingsTheme() {
  const { t } = useTranslation()
  const [theme, setTheme] = useTheme()

  const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Theme

    setTheme(value)
  }

  return (
    <SettingsSection id="settings-theme" title={t('page.settings.theme.title')}>
      <div className="relative">
        <FormControl component="fieldset" fullWidth>
          <RadioGroup onChange={onChangeTheme} row value={theme}>
            <FormControlLabel
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.system')}</>}
              value={Theme.system}
            />
            <FormControlLabel
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.light')}</>}
              value={Theme.light}
            />
            <FormControlLabel
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={<>{t('page.settings.theme.options.dark')}</>}
              value={Theme.dark}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </SettingsSection>
  )
}

export default SettingsTheme
