/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import { Theme } from '../../../common/theme'
import SettingsSection from './settings-section'
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
  const { t } = useTranslation()

  return (
    <SettingsSection id="settings-theme" title={t('page.settings.theme.title')}>
      <div className="relative">
        <FormField
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Select a theme</FormLabel>
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
                      {t('page.settings.theme.options.system')}
                    </SelectItem>
                    <SelectItem value={Theme.light}>
                      {t('page.settings.theme.options.light')}
                    </SelectItem>
                    <SelectItem value={Theme.dark}>
                      {t('page.settings.theme.options.dark')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SettingsSection>
  )
}

export default SettingsThemeSection
