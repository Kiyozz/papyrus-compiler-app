/*
 * 2022-2026 Kiyozz.
 */

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@renderer/components/ui/form.tsx'
import { Trans } from '@lingui/react/macro'
import { Switch } from '@renderer/components/ui/switch.tsx'

function SettingsMo2Activation() {
  return (
    <FormField
      name="mo2"
      render={({ field }) => (
        <FormItem className="flex items-center">
          <div>
            <FormLabel className="text-base">
              <Trans>Activer</Trans>
            </FormLabel>
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
