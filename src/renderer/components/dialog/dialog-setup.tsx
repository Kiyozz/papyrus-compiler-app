/*
 * 2026 Kiyozz.
 */

import { Trans, useLingui } from '@lingui/react/macro'
import { GameType, toExecutable, toFlag } from '#common/game.ts'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { bridge } from '@renderer/bridge.ts'
import CkDiagnostic from '@renderer/components/ck-diagnostic.tsx'
import { Button } from '@renderer/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog.tsx'
import { Input } from '@renderer/components/ui/input.tsx'
import { Label } from '@renderer/components/ui/label.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@renderer/components/ui/select.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useSetup } from '@renderer/hooks/use-setup.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { useSettings } from '@renderer/pages/settings/use-settings.tsx'
import { CheckIcon, FolderOpenIcon, RotateCcwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const lastStep = 3

function DialogSetup() {
  const { isOpen, isBlocking, close, complete } = useSetup()
  const {
    config: { game, compilation },
    setConfig,
  } = useApp()
  const { diagnose, diagnostic, hasBlockingError } = useSettings()
  const { send } = useTelemetry()
  const { t } = useLingui()
  const [step, setStep] = useState(0)

  // the dialog stays mounted between two runs, its progress must not
  useEffect(() => {
    if (isOpen) {
      setStep(0)
    }
  }, [isOpen])

  // the game folder and the kit are read from the disk: every change to the
  // configuration can turn the current step green, or red again
  useEffect(() => {
    if (!isOpen || game.path === '') {
      return
    }

    void diagnose()
  }, [
    isOpen,
    // walking back and forth is how a user reacts to what the report said,
    // so every step change is worth a fresh look at the disk
    step,
    game.path,
    game.type,
    compilation.compilerPath,
    diagnose,
  ])

  const hasGame =
    game.path !== '' && !diagnostic.items.some((item) => item.id === 'game-exe')
  const canContinue =
    (step === 0 && true) ||
    (step === 1 && hasGame) ||
    (step === 2 && !hasBlockingError) ||
    step === lastStep

  const onClickSelectFolder = async () => {
    const path = await bridge.dialog.select('folder')

    if (path !== null) {
      setConfig({ game: { path } })
    }
  }

  const onClickNext = () => {
    if (step === lastStep) {
      send(TelemetryEvent.setupWizardCompleted, { step })
      complete()

      return
    }

    setStep((current) => current + 1)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isBlocking) {
          close()
        }
      }}
    >
      <DialogContent
        showCloseButton={!isBlocking}
        className="flex flex-col sm:max-w-lg"
        onEscapeKeyDown={(e) => {
          if (isBlocking) e.preventDefault()
        }}
        onInteractOutside={(e) => {
          if (isBlocking) e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <Trans>Configuration de PCA</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Étape {step + 1} sur {lastStep + 1}
            </Trans>
          </DialogDescription>
        </DialogHeader>

        {/* the dialog is capped to the window: the steps scroll, the header
            and the buttons stay in sight. The dialog is sized by its content,
            so the area has to keep its auto basis and only be allowed to
            shrink - min-h-0 - rather than grow into a height nobody set. The
            padding gives the 3px focus rings room to draw, the viewport clips
            whatever leaves it */}
        <ScrollArea className="-m-1 min-h-0">
          <div className="flex flex-col gap-6 p-1">
            {step === 0 && (
              <div className="flex flex-col gap-3">
                <Label>
                  <Trans>Quel jeu voulez-vous modder ?</Trans>
                </Label>
                <Select
                  value={game.type}
                  onValueChange={(value) => {
                    const type = value as GameType

                    send(TelemetryEvent.settingsGame, { game: type })
                    setConfig({
                      game: { type },
                      compilation: { flag: toFlag(type) },
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GameType.se}>{GameType.se}</SelectItem>
                    <SelectItem value={GameType.le}>{GameType.le}</SelectItem>
                    <SelectItem value={GameType.vr}>{GameType.vr}</SelectItem>
                    <SelectItem value={GameType.fo4}>{GameType.fo4}</SelectItem>
                    <SelectItem value={GameType.sf}>{GameType.sf}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-sm">
                  <Trans>
                    PCA compile les scripts Papyrus de ce jeu. Vous pourrez en
                    changer à tout moment dans les paramètres.
                  </Trans>
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-3">
                <Label>
                  <Trans>Où est installé {game.type} ?</Trans>
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="text-xs"
                    value={game.path}
                    placeholder={t`Sélectionner un dossier`}
                    onChange={(e) =>
                      setConfig({ game: { path: e.target.value } })
                    }
                  />
                  <Button onClick={onClickSelectFolder} variant="outline">
                    <FolderOpenIcon />
                    <Trans>Parcourir</Trans>
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  <Trans>
                    Choisissez le dossier qui contient {toExecutable(game.type)}
                    .
                  </Trans>
                </p>
                {/* an empty path is not a mistake, the user just has not chosen
                yet. A filled one that misses the executable always is, so the
                alert and the disabled Next button never disagree. The compiler
                is the next step's business. */}
                {game.path !== '' && <CkDiagnostic only={['game-exe']} />}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-3">
                {hasBlockingError ? (
                  <p className="text-sm">
                    <Trans>
                      Il reste quelque chose à faire avant de pouvoir compiler :
                    </Trans>
                  </p>
                ) : (
                  <p className="text-sm">
                    <Trans>
                      Le Creation Kit est correctement installé, tout est prêt.
                    </Trans>
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    <Trans>Compilateur utilisé</Trans>
                  </span>
                  <span className="break-all font-mono text-xs">
                    {compilation.compilerPath === '' ? (
                      <Trans>Aucun</Trans>
                    ) : (
                      compilation.compilerPath
                    )}
                  </span>
                </div>
                <CkDiagnostic />
                <div>
                  <Button
                    onClick={() => void diagnose()}
                    size="sm"
                    variant="outline"
                  >
                    <RotateCcwIcon />
                    <Trans>Vérifier à nouveau</Trans>
                  </Button>
                </div>
              </div>
            )}

            {step === lastStep && (
              <div className="flex flex-col gap-3">
                <p className="text-sm">
                  <Trans>
                    Tout est prêt. Glissez vos fichiers .psc dans la page
                    Compilation, ou utilisez le bouton d'ajout.
                  </Trans>
                </p>
                <CkDiagnostic />
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-between">
          <Button
            onClick={() => setStep((current) => current - 1)}
            disabled={step === 0}
            variant="ghost"
          >
            <Trans>Retour</Trans>
          </Button>
          <Button onClick={onClickNext} disabled={!canContinue}>
            {step === lastStep ? (
              <>
                <CheckIcon />
                <Trans>Terminer</Trans>
              </>
            ) : (
              <Trans>Suivant</Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSetup
