/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { TriangleAlertIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@renderer/components/ui/alert.tsx'
import { SettingsSection, SettingsSectionContent } from '../settings-section'
import SettingsMo2Activation from './settings-mo2-activation'

function SettingsMo2() {
  const formContext = useFormContext()
  const mo2 = formContext.watch('mo2') as boolean

  return (
    <SettingsSection
      aria-label="Mod Organizer 2"
      title="Mod Organizer 2"
      titleId="settings-mo2"
    >
      <SettingsSectionContent className="gap-3 flex flex-col">
        <SettingsMo2Activation />
        {mo2 && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>
              <Trans>Intégration MO2 supprimée</Trans>
            </AlertTitle>
            <AlertDescription>
              <Trans>
                Depuis la version 5.9.0, l'intégration MO2 a été supprimée.
                Configurez PCA pour être lancé via MO2 à la place.
              </Trans>
            </AlertDescription>
          </Alert>
        )}
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsMo2
