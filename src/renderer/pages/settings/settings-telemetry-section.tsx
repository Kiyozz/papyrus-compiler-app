/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { SettingsSection, SettingsSectionContent } from './settings-section'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/ui/form.tsx'
import { Switch } from '@renderer/components/ui/switch.tsx'

function SettingsTelemetrySection() {
  return (
    <SettingsSection
      id="settings-telemetry"
      title={<Trans>Données d'utilisation</Trans>}
    >
      <SettingsSectionContent>
        <FormField
          name="telemetry"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <div>
                <FormLabel className="text-base">
                  <Trans>Activer</Trans>
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsTelemetrySection
