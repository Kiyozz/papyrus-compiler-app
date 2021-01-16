/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback } from 'react'
import is from '@sindresorhus/is'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../components/page-context'
import { TextField } from '../../components/text-field'

const maxConcurrentCompilationScripts = 50

export function SettingsCompilation() {
  const { t } = useTranslation()
  const {
    config: { compilation },
    updateConfig
  } = usePageContext()

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

        updateConfig({ compilation: { concurrentScripts: parsedValue } })
      }
    },
    [updateConfig]
  )

  return (
    <div className="paper mt-4 relative">
      <h1 className="text-2xl text-white mb-3 flex items-center flex-wrap">
        Compilation
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
