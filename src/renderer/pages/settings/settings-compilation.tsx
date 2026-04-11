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

function SettingsCompilation() {
  return (
    <SettingsSection
      id="compilation-concurrentScripts"
      title={<Trans>Compilation</Trans>}
    >
      <SettingsSectionContent>
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
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsCompilation
