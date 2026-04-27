/*
 * 2022-2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { GameType, toCompilerSourceFile, toExecutable } from '#common/game.ts'
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
  const {
    config: { game, compilation },
  } = useApp()
  const { configError } = useSettings()
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
                <span>
                  <Trans>Dossier du jeu</Trans>
                </span>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger className="flex items-center">
                    <InfoIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-balance">
                    <Trans>Dossier où se trouve {exe}</Trans>
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
                <span>
                  <Trans>Compilateur Papyrus</Trans>
                </span>
                <Tooltip delayDuration={150}>
                  <TooltipTrigger className="flex items-center">
                    <InfoIcon className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-balance">
                    <Trans>
                      Chemin vers le fichier PapyrusCompiler.exe. Le fichier est
                      disponible après l'installation de CreationKit. Plus
                      d'informations sur la documentation de PCA.
                    </Trans>
                  </TooltipContent>
                </Tooltip>
              </>
            }
            type="file"
          />
        </div>

        {configError !== false && (
          <Alert variant="destructive">
            <TriangleAlertIcon className="size-4" />
            <AlertTitle>
              <Trans>La configuration semble invalide :</Trans>
            </AlertTitle>
            <AlertDescription>
              {configError === 'game' && (
                <Trans>
                  Vérifiez que "{exe}" existe dans le dossier du jeu.
                </Trans>
              )}
              {configError === 'compiler' && (
                <Trans>Vérifiez que "{compilation.compilerPath}" existe.</Trans>
              )}
              {configError === 'scripts' && (
                <Trans>
                  Vérifiez que votre installation de Creation Kit est valide.
                  PCA vérifie la présence du fichier{' '}
                  {toCompilerSourceFile(game.type)} dans les dossiers
                  Scripts\Source ou Source\Scripts pour valider l'installation
                  de votre Creation Kit. Si vous utilisez l'integration MO2 de
                  PCA, les dossiers overwrite et mods sont également vérifiés.
                </Trans>
              )}
            </AlertDescription>
          </Alert>
        )}
      </SettingsSectionContent>
    </SettingsSection>
  )
}

export default SettingsGameSection
