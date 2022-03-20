/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { TextField } from '@mui/material'
import is from '@sindresorhus/is'
import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { useApp } from '../../hooks/use-app'
import SettingsSection from './settings-section'

const maxConcurrentCompilationScripts = 100

const SettingsCompilation = () => {
  const { t } = useTranslation()
  const {
    config: { compilation },
    setConfig,
  } = useApp()

  const onChangeConcurrentScripts = (evt: ChangeEvent<HTMLInputElement>) => {
    let value = evt.currentTarget.value

    if (value === '') {
      value = '0'
    }

    if (is.numericString(value)) {
      let parsedValue = parseInt(value, 10)

      if (parsedValue > maxConcurrentCompilationScripts) {
        parsedValue = maxConcurrentCompilationScripts
      }

      if (parsedValue < 0) {
        parsedValue = 1
      }

      setConfig({ compilation: { concurrentScripts: parsedValue } })
    }
  }

  return (
    <SettingsSection
      title={t('page.settings.compilation.title')}
      className="relative"
      id="compilation-concurrentScripts"
    >
      <TextField
        id="compilation-concurrentScripts-input"
        value={
          compilation.concurrentScripts === 0
            ? ''
            : compilation.concurrentScripts
        }
        size="small"
        fullWidth
        onChange={onChangeConcurrentScripts}
        label={t('page.settings.compilation.concurrentScripts.label')}
        name="compilation-concurrentScripts"
        helperText={t('page.settings.compilation.concurrentScripts.info')}
      />
    </SettingsSection>
  )
}

export default SettingsCompilation
