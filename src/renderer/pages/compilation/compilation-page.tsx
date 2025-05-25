/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { DialogRecentFiles } from '@/components/dialog/dialog-recent-files.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { useApp } from '@/hooks/use-app.tsx'
import { useCompilation } from '@/hooks/use-compilation.tsx'
import { useDrop, useSetDrop } from '@/hooks/use-drop.tsx'
import { useRecentFiles } from '@/hooks/use-recent-files.tsx'
import { useTelemetry } from '@/hooks/use-telemetry.tsx'
import { LayoutHeader, LayoutHeaderTitle } from '@/pages/layout.tsx'
import { type ScriptRenderer, isAllGroupsEmpty } from '@/types/index.ts'
import { scriptEquals } from '@/utils/scripts/equals.ts'
import { pscFilesToScript } from '@/utils/scripts/psc-files-to-script.ts'
import { scriptsToRenderer } from '@/utils/scripts/scripts-to-renderer.ts'
import { uniqScripts } from '@/utils/scripts/uniq-scripts.ts'
import { HistoryIcon, InfoIcon, PlayIcon, SearchIcon, XIcon } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useDidMount } from 'rooks'
import { toast } from 'sonner'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'
import type { Script } from '../../../common/types/script.ts'
import { useSettings } from '../settings/use-settings.tsx'
import GroupsMenu from './groups-menu.tsx'
import ScriptLine from './script-line.tsx'

function SearchButton({
  onClick,
  disabled,
  'aria-disabled': ariaDisabled,
}: { onClick: () => void; disabled?: boolean; 'aria-disabled'?: boolean }) {
  return (
    <Button aria-disabled={ariaDisabled} disabled={disabled} onClick={onClick} size="icon">
      <SearchIcon />
    </Button>
  )
}

export function CompilationPage() {
  const { t } = useTranslation()
  const { groups } = useApp()
  const { scripts, start, setScripts, concurrentScripts, isRunning, clearCompilationLogs } = useCompilation()
  const { setRecentFiles } = useRecentFiles()
  const { send } = useTelemetry()
  const { drop, isFileDialogActive } = useDrop()
  const { checkConfig, configError } = useSettings()

  useDidMount(() => {
    void checkConfig(true)
  })

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      setScripts((scriptsList) => {
        const pscScripts = pscFilesToScript(pscFiles)

        send(TelemetryEvent.compilationDropScripts, {
          scripts: pscScripts.length,
        })

        return uniqScripts([...scriptsList, ...pscScripts])
      })
    },
    [send, setScripts],
  )

  useSetDrop(onDrop)

  const onClickRemoveScriptFromScript = (script: ScriptRenderer) => {
    return () => {
      clearCompilationLogs(script)
      setScripts((scriptsList) => {
        send(TelemetryEvent.compilationRemoveScript, {
          remainingScripts: scriptsList.length - 1,
        })
        return scriptsList.filter((cs) => !scriptEquals(script)(cs))
      })
    }
  }

  const onClickPlayCompilation = (script: ScriptRenderer) => {
    return () => {
      send(TelemetryEvent.compilationSinglePlay, {})
      clearCompilationLogs(script)

      start({ scripts: [script] })
    }
  }

  const onClickStart = () => {
    if (scripts.length === 0) {
      return
    }

    clearCompilationLogs()

    const files: Script[] = scripts.map((s) => ({
      name: s.name,
      path: s.path,
    }))

    void setRecentFiles(files)
    send(TelemetryEvent.compilationPlay, {
      scripts: scripts.length,
      concurrentScripts,
    })
    start({ scripts })
  }

  const onChangeGroup = (groupName: string) => {
    const group = groups.find((g) => g.name === groupName)

    if (!group) {
      return
    }

    setScripts((scriptList) => uniqScripts(scriptsToRenderer(scriptList, group.scripts)))
  }

  const onClickEmpty = () => {
    send(TelemetryEvent.compilationListEmpty, { scripts: scripts.length })
    clearCompilationLogs()
    setScripts(() => [])
  }

  useEffect(() => {
    let toastId = undefined as string | number | undefined

    if (configError !== false) {
      toastId = toast.error(t('config.errorTitle'), {
        action: (
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              toast.dismiss(toastId)
            }}
            asChild
          >
            <Link to="/settings">{t('common.moreDetails')}</Link>
          </Button>
        ),
        description: t('config.checkError', { context: configError }),
        duration: Infinity,
      })
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [])

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>{t('page.compilation.title')}</LayoutHeaderTitle>
        <div className="flex gap-2">
          <DialogRecentFiles>
            <Button size="icon">
              <HistoryIcon />
            </Button>
          </DialogRecentFiles>
          <SearchButton aria-disabled={isFileDialogActive} disabled={isFileDialogActive} onClick={drop} />
          {!isAllGroupsEmpty(groups) && <GroupsMenu groups={groups} onChangeGroup={onChangeGroup} />}
        </div>
      </LayoutHeader>

      <ScrollArea className="h-(--page-height)">
        <section className="flex h-full flex-col p-6">
          {scripts.length > 0 && (
            <div className="mb-4 flex gap-2">
              <Button
                aria-disabled={Boolean(configError) || isRunning}
                disabled={Boolean(configError) || isRunning}
                onClick={onClickStart}
              >
                <PlayIcon />
                <span>{t('page.compilation.actions.start')}</span>
              </Button>

              <Button variant="ghost" aria-disabled={isRunning} disabled={isRunning} onClick={onClickEmpty}>
                <XIcon />
                <span>{t('page.compilation.actions.clearList')}</span>
              </Button>
            </div>
          )}

          {scripts.length > 0 ? (
            <ul className="divide-y divide-accent rounded-md border">
              {scripts.map((script) => {
                return (
                  <ScriptLine
                    key={script.id}
                    onClickPlayCompilation={onClickPlayCompilation(script)}
                    onClickRemoveScript={onClickRemoveScriptFromScript(script)}
                    script={script}
                  />
                )
              })}
            </ul>
          ) : (
            <div className="m-auto flex grow flex-col items-center justify-center gap-3 text-center tracking-tight">
              <h5 className="text-xl">
                <span>{t('page.compilation.dragAndDropText')}</span>
              </h5>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>{t<string>('page.compilation.dragAndDropAdmin')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </section>
      </ScrollArea>
    </>
  )
}
