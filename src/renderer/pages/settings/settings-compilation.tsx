/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { TextField } from '@mui/material'
import is from '@sindresorhus/is'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/use-app'
import SettingsSection from './settings-section'
import type { ChangeEvent } from 'react'

const maxConcurrentCompilationScripts = 100

function SettingsCompilation() {
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
      className="relative"
      id="compilation-concurrentScripts"
      title={t('page.settings.compilation.title')}
    >
      <TextField
        fullWidth
        helperText={t('page.settings.compilation.concurrentScripts.info')}
        id="compilation-concurrentScripts-input"
        label={t('page.settings.compilation.concurrentScripts.label')}
        name="compilation-concurrentScripts"
        onChange={onChangeConcurrentScripts}
        size="small"
        value={
          compilation.concurrentScripts === 0
            ? ''
            : compilation.concurrentScripts
        }
      />
    </SettingsSection>
  )
}

export default SettingsCompilation
