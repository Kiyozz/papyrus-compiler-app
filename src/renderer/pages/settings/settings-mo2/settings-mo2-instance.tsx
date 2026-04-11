/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import DialogTextField from '@renderer/components/dialog/dialog-text-field.tsx'
import { useSettings } from '../use-settings'
import { useFormContext } from 'react-hook-form'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@renderer/components/ui/alert.tsx'
import { TriangleAlertIcon } from 'lucide-react'

function SettingsMo2Instance() {
  const { configError } = useSettings()
  const formContext = useFormContext()
  const mo2 = formContext.watch('mo2') as boolean
  const mo2Instance = formContext.watch('mo2Instance') as string

  if (!mo2) {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <DialogTextField
          name="mo2Instance"
          label={<Trans>Dossier de l'instance</Trans>}
          type="folder"
        />

        {(configError === 'mo2-instance' ||
          configError === 'mo2-instance-mods') && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>
              <Trans>La configuration semble invalide :</Trans>
            </AlertTitle>
            <AlertDescription>
              {configError === 'mo2-instance' ? (
                <Trans>
                  Vérifiez que le dossier de l'instance "{mo2Instance}" existe.
                </Trans>
              ) : (
                <Trans>Vérifiez que le dossier "mods" existe.</Trans>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  )
}

export default SettingsMo2Instance
