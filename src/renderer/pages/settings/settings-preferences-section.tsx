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
  FormMessage,
} from '@renderer/components/ui/form.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select.tsx'
import { Switch } from '@renderer/components/ui/switch.tsx'
import { Separator } from '@renderer/components/ui/separator.tsx'
import { LogLevel } from '../../../common/log-level'
import { Theme } from '../../../common/theme'

const themeItems = [
  { value: Theme.system, label: <Trans>Système</Trans> },
  { value: Theme.light, label: <Trans>Clair</Trans> },
  { value: Theme.dark, label: <Trans>Sombre</Trans> },
]

const localeItems = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
]

const logLevelItems = [
  { value: LogLevel.error, label: <Trans>Erreur</Trans> },
  { value: LogLevel.warn, label: <Trans>Avertissement</Trans> },
  { value: LogLevel.info, label: <Trans>Info</Trans> },
  { value: LogLevel.debug, label: <Trans>Debug</Trans> },
]

function SettingsPreferencesSection() {
  return (
    <SettingsSection
      id="settings-preferences"
      title={<Trans>Préférences</Trans>}
    >
      <SettingsSectionContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="theme"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  <Trans>Thème</Trans>
                </FormLabel>
                <FormControl>
                  <Select
                    items={themeItems}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="locale"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  <Trans>Langue</Trans>
                </FormLabel>
                <FormControl>
                  <Select
                    items={localeItems}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {localeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="logLevel"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  <Trans>Niveau de log</Trans>
                </FormLabel>
                <FormControl>
                  <Select
                    items={logLevelItems}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {logLevelItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <FormField
          name="telemetry"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>
                <Trans>Données d'utilisation</Trans>
              </FormLabel>
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

export default SettingsPreferencesSection
