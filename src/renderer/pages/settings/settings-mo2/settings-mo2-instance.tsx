/*
 * 2022-2026 Kiyozz.
 */

import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { configError } = useSettings()
  const formContext = useFormContext()
  const mo2 = formContext.watch('mo2') as boolean
  const mo2Instance = formContext.watch('mo2Instance') as boolean

  if (!mo2) {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <DialogTextField
          name="mo2Instance"
          label={t('page.settings.mo2.instance')}
          type="folder"
        />

        {(configError === 'mo2-instance' ||
          configError === 'mo2-instance-mods') && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>
              {t('page.settings.errors.installationInvalid')}
            </AlertTitle>
            <AlertDescription>
              {configError === 'mo2-instance'
                ? t('page.settings.errors.mo2Instance', {
                    mo2Instance,
                  })
                : t('page.settings.errors.mo2InstanceMods')}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  )
}

export default SettingsMo2Instance
