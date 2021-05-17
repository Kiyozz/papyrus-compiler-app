/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'

export function SettingsTelemetry(): JSX.Element {
  const { t } = useTranslation()
  const {
    config: { telemetry },
    setConfig,
  } = useApp()
  const { send, setActive } = useTelemetry()

  const onChangeTelemetryActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked

    if (checked) {
      send(TelemetryEvents.telemetryEnabled, {})
    }

    setActive(checked)
    setConfig({ telemetry: { active: checked } })
  }

  return (
    <div className="paper mt-4 relative">
      <h1 className="text-2xl dark:text-white mb-3 flex items-center flex-wrap">
        {t('page.settings.telemetry.title')}
      </h1>

      <div className="relative" id="telemetry-active">
        <FormControlLabel
          control={
            <Checkbox
              id="mo2"
              name="mo2"
              checked={telemetry.active}
              onChange={onChangeTelemetryActive}
            />
          }
          label={
            <span className="dark:text-white">
              {t('page.settings.telemetry.enable')}
            </span>
          }
        />
      </div>
    </div>
  )
}
