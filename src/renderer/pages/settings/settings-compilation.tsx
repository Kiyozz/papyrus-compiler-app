/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { SettingsSection, SettingsSectionContent } from './settings-section.tsx'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/ui/form.tsx'
import { Input } from '@renderer/components/ui/input.tsx'
import DialogTextField from '@renderer/components/dialog/dialog-text-field.tsx'

function SettingsCompilation() {
  return (
    <SettingsSection
      id="compilation-concurrentScripts"
      title={<Trans>Compilation</Trans>}
    >
      <SettingsSectionContent className="flex flex-col gap-4">
        <FormField
          name="concurrentScripts"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans>Nombre de scripts compilés simultanéments</Trans>
                </FormLabel>
                <FormControl>
                  <Input id="compilation-concurrentScripts-input" {...field} />
                </FormControl>
                <FormDescription>
                  <Trans>
                    Réduisez si vous rencontrez des blocages quand vous lancez
                    la compilation
                  </Trans>
                </FormDescription>
              </FormItem>
            )
          }}
        />

        <DialogTextField
          name="output"
          label={<Trans>Dossier de sortie</Trans>}
          description={
            <Trans>
              Laissez vide pour utiliser le dossier par défaut du jeu
              (Data/Scripts).
            </Trans>
          }
          type="folder"
        />
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsCompilation
