/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { Theme } from '../../../common/theme'
import { SettingsSection, SettingsSectionContent } from './settings-section'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@renderer/components/ui/form.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select.tsx'

function SettingsThemeSection() {
  return (
    <SettingsSection id="settings-theme" title={<Trans>Thème</Trans>}>
      <SettingsSectionContent>
        <FormField
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>
                <Trans>Sélectionner un thème</Trans>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Theme.system}>
                      <Trans>Système</Trans>
                    </SelectItem>
                    <SelectItem value={Theme.light}>
                      <Trans>Clair</Trans>
                    </SelectItem>
                    <SelectItem value={Theme.dark}>
                      <Trans>Sombre</Trans>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsThemeSection
