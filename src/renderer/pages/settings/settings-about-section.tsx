/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { publicVersion } from '#common/version.ts'
import { useVersion } from '@renderer/hooks/use-version.tsx'
import { SettingsSection, SettingsSectionContent } from './settings-section'

function SettingsAboutSection() {
  const [version] = useVersion()

  return (
    <SettingsSection id="settings-about" title={<Trans>À propos</Trans>}>
      <SettingsSectionContent className="flex items-baseline gap-2">
        <span className="text-base">
          <Trans>Version</Trans>
        </span>
        <span className="font-mono text-base">{publicVersion}</span>
        <span className="font-mono text-muted-foreground text-sm">
          ({version})
        </span>
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsAboutSection
