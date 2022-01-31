/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
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
    <div className="paper mt-4 relative">
      <h1 className="text-3xl dark:text-white mb-3 flex items-center flex-wrap">
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
              label={t('page.settings.theme.options.system')}
            />
            <FormControlLabel
              value={Theme.light}
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={t('page.settings.theme.options.light')}
            />
            <FormControlLabel
              value={Theme.dark}
              classes={{
                label: 'dark:text-white',
              }}
              control={<Radio />}
              label={t('page.settings.theme.options.dark')}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  )
}

export default SettingsTheme
