/*
 * 2026 Kiyozz.
 */

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/dialog.tsx'
import type { ReactElement } from 'react'
import { Trans } from '@lingui/react/macro'
import { ExternalLinkIcon } from 'lucide-react'
import { Button } from '@renderer/components/ui/button.tsx'
import { useDocumentation } from '@renderer/hooks/use-documentation.ts'

export function DialogDocumentation({ children }: { children: ReactElement }) {
  const { open: openDocumentation, url } = useDocumentation()

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans>Documentation</Trans>
          </DialogTitle>
          <DialogDescription>
            <Trans>
              La documentation de PCA est en ligne : installation, configuration
              des jeux, Mod Organizer 2 et erreurs de compilation courantes.
            </Trans>
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-muted/50 px-4 py-3 font-mono text-xs break-all select-text">
          {url}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            <Trans>Fermer</Trans>
          </DialogClose>
          <DialogClose
            render={<Button />}
            onClick={() => openDocumentation('click')}
          >
            <ExternalLinkIcon />
            <Trans>Ouvrir la documentation</Trans>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
