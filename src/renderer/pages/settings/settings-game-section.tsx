/*
 * 2022-2026 Kiyozz.
 */

import { useTranslation } from 'react-i18next'
import {
  GameType,
  toCompilerSourceFile,
  toExecutable,
} from '../../../common/game'
import DialogTextField from '@renderer/components/dialog/dialog-text-field.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { SettingsSection, SettingsSectionContent } from './settings-section.tsx'
import { useSettings } from './use-settings.tsx'
import { InfoIcon, TriangleAlertIcon } from 'lucide-react'
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip.tsx'
import {
  FormItem,
  FormControl,
  FormField,
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@renderer/components/ui/alert.tsx'

function SettingsGameSection() {
  const { t } = useTranslation()
  const {
    config: { game, compilation },
  } = useApp()
  const { configError } = useSettings()
  const exe = toExecutable(game.type)

  return (
    <SettingsSection title={t('page.settings.game')}>
      <SettingsSectionContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2" id="settings-game">
          <FormField
            name="game"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>Select your game</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GameType.se}>{GameType.se}</SelectItem>
                      <SelectItem value={GameType.le}>{GameType.le}</SelectItem>
                      <SelectItem value={GameType.vr}>{GameType.vr}</SelectItem>
                      <SelectItem value={GameType.fo4}>
                        {GameType.fo4}
                      </SelectItem>
                      <SelectItem value={GameType.sf}>{GameType.sf}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogTextField
            name="gamePath"
            label={
              <>
                <span>{t('page.settings.gameFolderInfo')}</span>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger className="flex items-center">
                    <InfoIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-balance">
                    {t<string>('page.settings.gameFolderTooltip', { exe })}
                  </TooltipContent>
                </Tooltip>
              </>
            }
            type="folder"
          />
        </div>

        <div className="relative" id="settings-compiler">
          <DialogTextField
            name="compilerPath"
            label={
              <>
                <span>{t('page.settings.compilerPath')}</span>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger className="flex items-center">
                    <InfoIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-balance">
                    {t('page.settings.compilerPathTooltip')}
                  </TooltipContent>
                </Tooltip>
              </>
            }
            type="file"
          />
        </div>

        {configError !== false &&
          configError !== 'mo2-instance' &&
          configError !== 'mo2-instance-mods' && (
            <Alert variant="destructive">
              <TriangleAlertIcon className="size-4" />
              <AlertTitle>
                {t('page.settings.errors.installationInvalid')}
              </AlertTitle>
              <AlertDescription>
                {configError === 'game' &&
                  t('page.settings.errors.game', { exe })}
                {configError === 'compiler' &&
                  t('page.settings.errors.compiler', {
                    compilerExe: compilation.compilerPath,
                  })}
                {configError === 'scripts' &&
                  t('page.settings.errors.scripts', {
                    file: toCompilerSourceFile(game.type),
                  })}
              </AlertDescription>
            </Alert>
          )}
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsGameSection
