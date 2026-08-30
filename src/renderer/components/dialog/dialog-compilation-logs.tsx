/*
 * 2026 Kiyozz.
 */

import { Button } from '@renderer/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@renderer/components/ui/dialog.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useCompilation } from '@renderer/hooks/use-compilation.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { logsState } from '@renderer/lib/logs.ts'
import {
  ClipboardIcon,
  FileXIcon,
  FolderOpenIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ReactElement, useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { toast } from 'sonner'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { Switch } from '@renderer/components/ui/switch.tsx'
import { Label } from '@renderer/components/ui/label.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip.tsx'
import { Badge } from '../ui/badge.tsx'
import { useOpenCompiledFolder } from '@renderer/hooks/use-open-compiled-folder.ts'

export function DialogCompilationLogs({
  children,
}: {
  children: ReactElement
}) {
  const { t } = useLingui()
  const { logs: rawLogs, clearCompilationLogs } = useCompilation()
  const { hasNoLogs, hasErrorsInLogs, isAllScriptsSuccessInLogs } =
    logsState(rawLogs)
  const { send } = useTelemetry()
  const { copyToClipboard } = useApp()
  const openCompiledFolder = useOpenCompiledFolder()
  const [showErrorOnly, setShowErrorOnly] = useState(false)
  const [showFullPath, setShowFullPath] = useState(false)

  const logs = showErrorOnly ? rawLogs.filter((log) => !log.success) : rawLogs

  const onClickClearLogs = () => {
    clearCompilationLogs()
  }

  let compilationState = 'running'

  if (isAllScriptsSuccessInLogs) {
    compilationState = 'success'
  } else if (hasErrorsInLogs) {
    compilationState = 'error'
  }

  return (
    <Dialog>
      <DialogTrigger
        render={children}
        data-state={compilationState}
        className="data-[state=error]:text-destructive data-[state=success]:text-green-500 data-[state=error]:[&_button]:hover:bg-destructive data-[state=success]:[&_button]:hover:bg-green-500 data-[state=error]:[&_button]:hover:text-destructive-foreground"
      />
      <DialogContent
        className="grid-rows-[1.25rem_1fr_2.25rem]"
        aria-describedby={undefined}
        fullscreen
      >
        <DialogHeader
          aria-describedby={undefined}
          className="pl-6 pr-15 no-drag flex-row"
        >
          <DialogTitle className="grow">
            <Trans>Logs de compilation</Trans>
          </DialogTitle>
          <div className="flex items-center">
            <Label htmlFor="show-errors-only" className="pr-2">
              <Trans>Erreurs uniquement</Trans>
            </Label>
            <Switch
              id="show-errors-only"
              onCheckedChange={setShowErrorOnly}
              checked={showErrorOnly}
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="show-full-path" className="pr-2">
              <Trans>Chemin complet</Trans>
            </Label>
            <Switch
              id="show-full-path"
              onCheckedChange={setShowFullPath}
              checked={showFullPath}
            />
          </div>
        </DialogHeader>
        {hasNoLogs && (
          <p className="flex h-full grow items-center justify-center">
            <Trans>Aucun logs</Trans>
          </p>
        )}
        {!hasNoLogs && (
          <ScrollArea className="min-h-auto h-full overflow-hidden">
            <div className="px-6">
              <ul className="gap-2 flex flex-col">
                {logs.length === 0 && (
                  <li className="text-center">
                    <Trans>Aucune erreur !</Trans>
                  </li>
                )}
                {logs.map(({ script, output, success, pexPath }) => {
                  const onClickCopy = () => {
                    send(TelemetryEvent.compilationLogsCopy, {})
                    copyToClipboard(
                      `${script.name}-${script.path}\n\n${output.trim()}\n`,
                    )
                    toast.info(t`Copier avec succès`, {
                      duration: Infinity,
                    })
                  }

                  const onClickDelete = () => {
                    clearCompilationLogs(script)
                  }

                  const onClickOpenFolder = () => {
                    if (pexPath === undefined) return

                    void openCompiledFolder(pexPath, 'logs')
                  }

                  return (
                    <li
                      key={script.id}
                      aria-describedby={`${script.id}-logs`}
                      aria-labelledby={`${script.id}-title`}
                      className="bg-popover"
                    >
                      <div className="border-x border-t rounded-t-4xl bg-white pl-4 pr-2 py-2 dark:bg-gray-800">
                        <div
                          id={`${script.id}-title`}
                          aria-label={script.name}
                          className="flex items-center justify-between rounded-t-4xl"
                        >
                          <div className="flex items-center gap-2 overflow-x-hidden">
                            {showFullPath ? (
                              <span className="text-xs">{script.path}</span>
                            ) : (
                              <span>{script.name}</span>
                            )}
                            {success && (
                              <Badge variant="success">
                                <Trans>Succès</Trans>
                              </Badge>
                            )}
                            {!success && (
                              <Badge variant="destructive">
                                <Trans>Échec</Trans>
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <TooltipProvider delay={500}>
                              <Tooltip disableHoverablePopup>
                                <TooltipTrigger
                                  render={
                                    <Button
                                      onClick={onClickOpenFolder}
                                      size="icon"
                                      disabled={pexPath === undefined}
                                      aria-label={t`Ouvrir le dossier du script compilé`}
                                    />
                                  }
                                >
                                  <FolderOpenIcon />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <Trans>
                                    Ouvrir le dossier du script compilé
                                  </Trans>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button onClick={onClickCopy} size="icon">
                              <ClipboardIcon />
                            </Button>
                            <Button variant="secondary" onClick={onClickDelete}>
                              <Trash2Icon />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <code
                        className="block w-full bg-gray-800 p-4 text-white dark:bg-black border-x border-b rounded-b-4xl"
                        id={`${script.id}-logs`}
                        role="log"
                      >
                        {output.split('\n').map((outputLine, i) => (
                          <span
                            className="block select-text wrap-break-word text-balance font-mono text-xs leading-6"
                            key={i}
                          >
                            {outputLine}
                          </span>
                        ))}
                      </code>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="px-6 sm:justify-start">
          <Button disabled={hasNoLogs} onClick={onClickClearLogs}>
            <FileXIcon />
            <span>
              <Trans>Vider</Trans>
            </span>
          </Button>
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end">
            <DialogClose render={<Button />}>
              <Trans>Annuler</Trans>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
