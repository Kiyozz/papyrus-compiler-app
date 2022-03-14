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

const SettingsTheme = () => {
  const { t } = useTranslation()
  const [theme, setTheme] = useTheme()

  const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Theme

    setTheme(value)
  }

  return (
    <div className="paper relative mt-4">
      <h1 className="mb-3 flex flex-wrap items-center text-3xl dark:text-white">
        {t('page.settings.theme.title')}
      </h1>

      <div className="relative" id="telemetry-active">
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
    </div>
  )
}

export default SettingsTheme
