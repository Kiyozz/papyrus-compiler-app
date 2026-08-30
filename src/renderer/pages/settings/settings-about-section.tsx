/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { publicVersion } from '#common/version.ts'
import { Button } from '@renderer/components/ui/button.tsx'
import { useSetup } from '@renderer/hooks/use-setup.tsx'
import { useVersion } from '@renderer/hooks/use-version.tsx'
import { WandSparklesIcon } from 'lucide-react'
import { SettingsSection, SettingsSectionContent } from './settings-section'

function SettingsAboutSection() {
  const [version] = useVersion()
  const { open: openSetup } = useSetup()

  return (
    <SettingsSection id="settings-about" title={<Trans>À propos</Trans>}>
      <SettingsSectionContent className="flex flex-col items-start gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-base">
            <Trans>Version</Trans>
          </span>
          <span className="font-mono text-base">{publicVersion}</span>
          <span className="font-mono text-muted-foreground text-sm">
            ({version})
          </span>
        </div>
        <Button onClick={openSetup} size="sm" variant="outline">
          <WandSparklesIcon />
          <Trans>Relancer l'assistant de configuration</Trans>
        </Button>
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsAboutSection
