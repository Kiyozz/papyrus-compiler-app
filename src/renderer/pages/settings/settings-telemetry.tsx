/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'
import SettingsSection from './settings-section'

const SettingsTelemetry = () => {
  const { t } = useTranslation()
  const {
    config: { telemetry },
    setConfig,
  } = useApp()
  const { send, setActive } = useTelemetry()

  const onChangeTelemetryActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked

    if (checked) {
      send(TelemetryEvent.telemetryEnabled, {})
    }

    setActive(checked)
    setConfig({ telemetry: { active: checked } })
  }

  return (
    <SettingsSection
      title={t('page.settings.telemetry.title')}
      id="settings-telemetry"
    >
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
    </SettingsSection>
  )
}

export default SettingsTelemetry
