/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch.tsx'

function SettingsMo2Activation() {
  const { t } = useTranslation()

  return (
    <FormField
      name="mo2"
      render={({ field }) => (
        <FormItem className="flex items-center">
          <div>
            <FormLabel className="text-base">{t('page.settings.mo2.enable')}</FormLabel>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default SettingsMo2Activation
