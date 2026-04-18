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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
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
          <FormField
            name="locale"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  <Trans>Langue</Trans>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LogLevel.error}>
                        <Trans>Erreur</Trans>
                      </SelectItem>
                      <SelectItem value={LogLevel.warn}>
                        <Trans>Avertissement</Trans>
                      </SelectItem>
                      <SelectItem value={LogLevel.info}>
                        <Trans>Info</Trans>
                      </SelectItem>
                      <SelectItem value={LogLevel.debug}>
                        <Trans>Debug</Trans>
                      </SelectItem>
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
