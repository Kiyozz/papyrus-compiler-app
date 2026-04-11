/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import { SettingsSection, SettingsSectionContent } from './settings-section'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/ui/form.tsx'
import { Switch } from '@renderer/components/ui/switch.tsx'

function SettingsTelemetrySection() {
  const { t } = useTranslation()

  return (
    <SettingsSection
      id="settings-telemetry"
      title={t('page.settings.telemetry.title')}
    >
      <SettingsSectionContent>
        <FormField
          name="telemetry"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <div>
                <FormLabel className="text-base">
                  {t('page.settings.telemetry.enable')}
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
