/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { useTranslation } from 'react-i18next'
import SettingsSection from './settings-section.tsx'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'

function SettingsCompilation() {
  const { t } = useTranslation()

  return (
    <SettingsSection
      className="relative"
      id="compilation-concurrentScripts"
      title={t('page.settings.compilation.title')}
    >
      <FormField
        name="concurrentScripts"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{t('page.settings.compilation.concurrentScripts.label')}</FormLabel>
              <FormControl>
                <Input id="compilation-concurrentScripts-input" {...field} />
              </FormControl>
              <FormDescription>{t('page.settings.compilation.concurrentScripts.info')}</FormDescription>
            </FormItem>
          )
        }}
      />
    </SettingsSection>
  )
}

export default SettingsCompilation
