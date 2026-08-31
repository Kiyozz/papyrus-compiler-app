/*
 * 2022-2026 Kiyozz.
 */

import { bridge } from '@renderer/bridge.ts'
import { Button } from '@renderer/components/ui/button.tsx'
import { Checkbox } from '@renderer/components/ui/checkbox.tsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/dialog.tsx'
import { Label } from '@renderer/components/ui/label.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { Switch } from '@renderer/components/ui/switch.tsx'
import { useCompilation } from '@renderer/hooks/use-compilation.tsx'
import { useIpc } from '@renderer/hooks/use-ipc.ts'
import { useRecentFiles } from '@renderer/hooks/use-recent-files.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { scriptsToRenderer } from '@renderer/utils/scripts/scripts-to-renderer.ts'
import { uniqScripts } from '@renderer/utils/scripts/uniq-scripts.ts'
import { TrashIcon } from 'lucide-react'
import React, { useId, useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react'
import { Trans } from '@lingui/react/macro'
import { useDidUpdate } from 'rooks'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import type { Script } from '#common/types/script.ts'

export function DialogRecentFiles({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false)
  const { send } = useTelemetry()
  const { setScripts, scripts: loadedScripts } = useCompilation()
  const {
    clearRecentFiles,
    removeRecentFile,
    recentFiles: rawRecentFiles,
    moreDetails: [isMoreDetails, setMoreDetails],
  } = useRecentFiles()
  const [selectedRecentFiles, setSelectedRecentFiles] = useState(
    new Map<string, Script>(),
  )
  const isValid = selectedRecentFiles.size > 0

  const isAlreadyLoaded = (script: Script) => {
    return Boolean(loadedScripts.find((s) => s.path === script.path))
  }

  const recentFiles = rawRecentFiles.filter(
    (script) => !isAlreadyLoaded(script),
  )

  useDidUpdate(() => {
    if (open) {
      bridge.recentFiles.dialog.open()
    } else {
      bridge.recentFiles.dialog.close()
    }
  }, [open])

  const notLoadedRecentFiles = useMemo(() => {
    return recentFiles.filter((rf) => {
      return !loadedScripts.find((ls) => ls.path === rf.path)
    })
  }, [recentFiles, loadedScripts])

  useIpc(bridge.recentFiles.select.onAll, () => {
    send(TelemetryEvent.recentFilesSelectAll, {})
    setSelectedRecentFiles(
      new Map(
        notLoadedRecentFiles.map((notLoadedFile) => [
          notLoadedFile.path,
          notLoadedFile,
        ]),
      ),
    )
  })

  useIpc(bridge.recentFiles.select.onNone, () => {
    send(TelemetryEvent.recentFilesSelectNone, {})
    setSelectedRecentFiles(new Map())
  })

  useIpc(bridge.recentFiles.select.onInvertSelection, () => {
    send(TelemetryEvent.recentFilesInvertSelection, {})

    setSelectedRecentFiles((selectedFiles) => {
      return new Map(
        notLoadedRecentFiles
          .filter((s) => {
            return !selectedFiles.has(s.path)
          })
          .map((s) => [s.path, s]),
      )
    })
  })

  useIpc(bridge.recentFiles.select.onClear, () => {
    send(TelemetryEvent.recentFilesClear, {})
    // noinspection JSIgnoredPromiseFromCall
    void clearRecentFiles()
    setSelectedRecentFiles(new Map())
  })

  const onClickClose = () => {
    setSelectedRecentFiles(new Map())
    setOpen(false)
  }

  const onClickLoad = () => {
    if (!isValid) {
      return
    }

    send(TelemetryEvent.recentFilesLoaded, {})
    setScripts((scripts) =>
      uniqScripts(
        scriptsToRenderer(scripts, Array.from(selectedRecentFiles.values())),
      ),
    )
    setSelectedRecentFiles(new Map())
    setOpen(false)
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && isValid) {
      send(TelemetryEvent.recentFilesCloseWithEnter, {})
      // noinspection JSIgnoredPromiseFromCall
      onClickLoad()
    }
  }

  const onClickItem = (script: Script) => {
    return (checked: boolean) => {
      if (!checked) {
        setSelectedRecentFiles((list) => {
          list.delete(script.path)

          return new Map(list)
        })
      } else {
        setSelectedRecentFiles((list) => {
          list.set(script.path, script)

          return new Map(list)
        })
      }
    }
  }

  const onClickDeleteFile = (script: Script) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.blur()

      await removeRecentFile(script)

      send(TelemetryEvent.recentFileRemove, {})
      setSelectedRecentFiles((srf) => {
        srf.delete(script.path)

        return new Map(srf)
      })
    }
  }

  function Item({
    onClickFile,
    onClickDelete,
    disabled = false,
    selected,
    script,
  }: {
    onClickFile: (checked: boolean) => void
    onClickDelete: (evt: MouseEvent<HTMLButtonElement>) => void
    selected: boolean
    disabled?: boolean
    script: Script
  }) {
    const id = useId()
    const scriptInfo = {
      path: script.path,
      filename: script.name,
    }

    return (
      <li className="flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl hover:bg-accent/75">
        <Label
          htmlFor={id}
          className="group grow pl-2 pr-1 py-1 min-w-0 grid grid-cols-[auto_1fr_auto] gap-3 aria-disabled:bg-muted aria-disabled:text-muted-foreground"
          aria-disabled={disabled}
        >
          <Checkbox
            id={id}
            checked={selected}
            disabled={disabled}
            onCheckedChange={onClickFile}
          />
          <div className="flex flex-col min-w-0">
            <span className="truncate leading-tight">
              {scriptInfo.filename}
            </span>
            {isMoreDetails && (
              <span
                className="text-muted-foreground text-xs leading-tight truncate"
                title={script.path}
                dir="rtl"
              >
                {scriptInfo.path}
              </span>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon-sm"
            className="size-6"
            onClick={onClickDelete}
            tabIndex={1}
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </Label>
      </li>
    )
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={children} />
      <DialogContent
        aria-describedby={undefined}
        onKeyDown={onDialogKeyDown}
        className="flex flex-col px-0"
      >
        <DialogHeader className="px-6">
          <DialogTitle className="grow">
            <Trans>Fichiers récents</Trans>
          </DialogTitle>
        </DialogHeader>
        {recentFiles.length === 0 ? (
          <p
            className="flex grow items-center justify-center px-6"
            data-partially-empty={recentFiles.length !== rawRecentFiles.length}
          >
            {recentFiles.length === rawRecentFiles.length ? (
              <Trans>Aucun fichiers récents.</Trans>
            ) : (
              <Trans>Tous les fichiers récents sont déjà chargés.</Trans>
            )}
          </p>
        ) : (
          <ScrollArea
            // min-h-0 is required: on a flex item `min-height: auto` resolves
            // to the specified height, so h-96 alone pins the minimum at 384px
            // and the list overflows the popup instead of shrinking with it
            className="w-full min-h-0 grow h-96"
          >
            <div className="grow px-6">
              <ul className="divide-y divide-accent rounded-xl border">
                {recentFiles.map((script) => {
                  return (
                    <Item
                      disabled={isAlreadyLoaded(script)}
                      key={script.path}
                      onClickDelete={onClickDeleteFile(script)}
                      onClickFile={onClickItem(script)}
                      script={script}
                      selected={selectedRecentFiles.has(script.path)}
                    />
                  )
                })}
              </ul>
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="px-6">
          <div className="flex grow items-center">
            <Label htmlFor="more-details" className="pr-2">
              <Trans>Plus de détails</Trans>
            </Label>
            <Switch
              id="more-details"
              checked={isMoreDetails}
              onCheckedChange={setMoreDetails}
            />
          </div>
          <Button onClick={onClickClose} tabIndex={4}>
            <Trans>Annuler</Trans>
          </Button>
          <Button
            disabled={selectedRecentFiles.size === 0}
            onClick={onClickLoad}
            tabIndex={3}
          >
            <Trans>Charger</Trans>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
