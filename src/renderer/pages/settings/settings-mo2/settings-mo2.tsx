/*
 * 2022-2026 Kiyozz.
 */

import { SettingsSection, SettingsSectionContent } from '../settings-section'
import SettingsMo2Activation from './settings-mo2-activation'
import SettingsMo2Instance from './settings-mo2-instance'

function SettingsMo2() {
  return (
    <SettingsSection
      aria-label="Mod Organizer 2"
      title="Mod Organizer 2"
      titleId="settings-mo2"
    >
      <SettingsSectionContent>
        <SettingsMo2Activation />
        <SettingsMo2Instance />
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsMo2
