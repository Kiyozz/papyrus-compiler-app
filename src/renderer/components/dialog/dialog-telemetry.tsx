/*
 * 2026 Kiyozz.
 */

import { Trans } from '@lingui/react/macro'
import { bridge } from '@renderer/bridge.ts'
import { Button } from '@renderer/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog.tsx'
import { Env } from '@renderer/env.ts'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useSetup } from '@renderer/hooks/use-setup.tsx'

/**
 * Nothing is sent before the user said yes here. Waits for the setup wizard
 * so the two dialogs never stack.
 */
function DialogTelemetry() {
  const {
    config: { telemetry },
    setConfig,
  } = useApp()
  const { isOpen: isSetupOpen } = useSetup()

  const answer = (active: boolean) => {
    setConfig({ telemetry: { active, asked: true } })
    void bridge.telemetry.setActive(active)
  }

  return (
    <Dialog open={Env.telemetryEnabled && !telemetry.asked && !isSetupOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <Trans>Données d'utilisation anonymes</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              Acceptez-vous d'envoyer des données d'utilisation anonymes pour
              aider à améliorer PCA ?
            </Trans>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <p>
            <Trans>
              Si vous acceptez, PCA envoie les fonctionnalités utilisées (par
              exemple : nombre de scripts compilés, jeu choisi, thème, version
              de PCA) et les erreurs de l'application.
            </Trans>
          </p>
          <p>
            <Trans>
              Aucun identifiant, aucun contenu de script, aucun chemin de
              fichier ni nom d'utilisateur n'est envoyé.
            </Trans>
          </p>
          <p className="text-muted-foreground">
            <Trans>
              Rien n'est envoyé si vous refusez. Ce choix est modifiable à tout
              moment dans les paramètres.
            </Trans>
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => answer(false)}>
            <Trans>Refuser</Trans>
          </Button>
          <Button onClick={() => answer(true)}>
            <Trans>Accepter</Trans>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogTelemetry
