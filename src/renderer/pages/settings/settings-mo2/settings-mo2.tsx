/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import SettingsSection from '../settings-section'
import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

function SettingsMo2() {
  return (
    <SettingsSection
      className="[&_[data-slot=card-content]]:flex [&_[data-slot=card-content]]:flex-col [&_[data-slot=card-content]]:gap-4"
      aria-label="Mod Organizer 2"
      title="Mod Organizer 2"
      titleId="settings-mo2"
    >
      <SettingsMo2Activation />
      <SettingsMo2Instance />
    </SettingsSection>
  )
}

export default SettingsMo2
