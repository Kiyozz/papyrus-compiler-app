/*
 * 2022-2026 Kiyozz.
 */

import { Trans, useLingui } from '@lingui/react/macro'
import { Button } from '@renderer/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { DownloadIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ImgHTMLAttributes, MouseEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { GITHUB_LINK } from '../../../common/constants'
import { bridge } from '../../bridge'
import { Env } from '../../env'
import { useApp } from '../../hooks/use-app'
import { useInitialization } from '../../hooks/use-initialization'
import Anchor from '../anchor'

const LATEST_VERSION_TOAST_ID = 'changelog-latest-version'
const NEW_VERSION_TOAST_ID = 'changelog-new-version'

function Img({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const newSrc = src?.startsWith('docs')
    ? `${GITHUB_LINK}/blob/master/${src}?raw=true`
    : src

  return (
    <img
      alt={alt}
      className="mt-2 max-w-full rounded-sm"
      src={newSrc}
      {...props}
    />
  )
}

function DialogChangelog() {
  const { t } = useLingui()
  const {
    showChangelogs: [isShowChangelogs, setShowChangelogs],
    changelogs: [changelogs],
    showLatestVersionAlert: [
      isShowLatestVersionAlert,
      setShowLastestVersionAlert,
    ],
  } = useApp()
  const { latestVersion } = useInitialization()

  const [isShowChangelogsDialoag, setShowChangelogsDialog] = useState(false)

  useEffect(() => {
    if (!isShowLatestVersionAlert) {
      toast.dismiss(LATEST_VERSION_TOAST_ID)

      return
    }

    toast.info(t`Vous disposez de la dernière version`, {
      id: LATEST_VERSION_TOAST_ID,
      duration: 3_000,
      onAutoClose: () => setShowLastestVersionAlert(false),
    })
  }, [isShowLatestVersionAlert, setShowLastestVersionAlert, t])

  useEffect(() => {
    if (
      !isShowChangelogs ||
      isShowLatestVersionAlert ||
      isShowChangelogsDialoag
    ) {
      toast.dismiss(NEW_VERSION_TOAST_ID)

      return
    }

    const onClickShowChangelogs = () => {
      toast.dismiss(NEW_VERSION_TOAST_ID)
      setShowChangelogsDialog(true)
    }

    toast.info(t`Nouvelle version disponible : ${latestVersion}`, {
      id: NEW_VERSION_TOAST_ID,
      duration: 8_000,
      onAutoClose: () => setShowChangelogs(false),
      // a plain sonner action is a bare <button> its own stylesheet wins over
      // any utility class on: passing an element bypasses it entirely
      action: (
        <Button className="ml-auto" onClick={onClickShowChangelogs} size="xs">
          <Trans>Nouveautés</Trans>
        </Button>
      ),
    })
  }, [
    isShowChangelogs,
    isShowLatestVersionAlert,
    isShowChangelogsDialoag,
    latestVersion,
    setShowChangelogs,
    t,
  ])

  const onClickDownloadRelease = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()

    void bridge.shell.openExternal(Env.modUrl)
  }

  const onOpenChangeChangelogsDialog = (open: boolean) => {
    setShowChangelogsDialog(open)

    if (!open) {
      setShowChangelogs(false)
    }
  }

  return (
    <Dialog
      onOpenChange={onOpenChangeChangelogsDialog}
      open={isShowChangelogsDialoag}
    >
      <DialogContent
        aria-describedby={undefined}
        className="grid-rows-[1.25rem_1fr_2.25rem]"
        fullscreen
      >
        <DialogHeader className="no-drag px-6">
          <DialogTitle>
            <Trans>Notes de mise à jour</Trans>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full min-h-auto overflow-hidden">
          <div className="prose prose-sm max-w-none px-6 dark:prose-invert">
            {changelogs && (
              <ReactMarkdown
                components={{
                  a: Anchor,
                  img: Img,
                }}
              >
                {changelogs}
              </ReactMarkdown>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="px-6">
          <DialogClose render={<Button variant="outline" />}>
            <Trans>Fermer</Trans>
          </DialogClose>
          <Button onClick={onClickDownloadRelease}>
            <DownloadIcon />
            <span>
              <Trans>Télécharger</Trans>
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogChangelog
