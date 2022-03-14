/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import TextField from '../../components/text-field'
import { useApp } from '../../hooks/use-app'

const maxConcurrentCompilationScripts = 100

const SettingsCompilation = () => {
  const { t } = useTranslation()
  const {
    config: { compilation },
    setConfig,
  } = useApp()

  const onChangeConcurrentScripts = useCallback(
    (value: string | number) => {
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
    },
    [setConfig],
  )

  return (
    <div className="paper relative mt-4">
      <h1 className="mb-3 flex flex-wrap items-center text-3xl dark:text-white">
        {t('page.settings.compilation.title')}
      </h1>

      <div className="relative" id="compilation-concurrentScripts">
        <TextField
          id="compilation-concurrentScripts-input"
          value={
            compilation.concurrentScripts === 0
              ? ''
              : compilation.concurrentScripts
          }
          onChange={onChangeConcurrentScripts}
          label={t('page.settings.compilation.concurrentScripts.label')}
          name="compilation-concurrentScripts"
          infoText={t('page.settings.compilation.concurrentScripts.info')}
        />
      </div>
    </div>
  )
}

export default SettingsCompilation
