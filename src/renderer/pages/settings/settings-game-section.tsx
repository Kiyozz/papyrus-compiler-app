/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { GameType, toExecutable } from '#common/game.ts'
import CkDiagnostic from '@renderer/components/ck-diagnostic.tsx'
import DialogTextField from '@renderer/components/dialog/dialog-text-field.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { SettingsSection, SettingsSectionContent } from './settings-section.tsx'
import { InfoIcon } from 'lucide-react'
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
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

function SettingsGameSection() {
  const {
    config: { game },
  } = useApp()
  const exe = toExecutable(game.type)

  return (
    <SettingsSection title={<Trans>Jeu</Trans>}>
      <SettingsSectionContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2" id="settings-game">
          <FormField
            name="game"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  <Trans>Sélectionner votre jeu</Trans>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                <span>
                  <Trans>Dossier du jeu</Trans>
                </span>
                <TooltipProvider delay={150}>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      <InfoIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-balance">
                      <Trans>Dossier où se trouve {exe}</Trans>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                <span>
                  <Trans>Compilateur Papyrus</Trans>
                </span>
                <TooltipProvider delay={150}>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center">
                      <InfoIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-balance">
                      <Trans>
                        Chemin vers le fichier PapyrusCompiler.exe. Le fichier
                        est disponible après l'installation de CreationKit. Plus
                        d'informations sur la documentation de PCA.
                      </Trans>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            }
            type="file"
          />
        </div>

        <CkDiagnostic />
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsGameSection
