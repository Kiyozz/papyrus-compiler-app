/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'
import SettingsSection from '../settings-section'
import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

interface SettingsMo2Props {
  onChangeMo2: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMo2Instance: (value: string) => void
  onClickRefreshInstallation: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function SettingsMo2({
  onChangeMo2,
  onChangeMo2Instance,
  onClickRefreshInstallation,
}: SettingsMo2Props) {
  return (
    <SettingsSection
      aria-label="Mod Organizer 2"
      title="Mod Organizer 2"
      titleId="settings-mo2"
    >
      <SettingsMo2Activation onChangeMo2={onChangeMo2} />
      <SettingsMo2Instance
        onChangeMo2Instance={onChangeMo2Instance}
        onClickRefreshInstallation={onClickRefreshInstallation}
      />
    </SettingsSection>
  )
}

export default SettingsMo2
