/*
 * 2022-2026 Kiyozz.
 */

import { DialogRecentFiles } from '@renderer/components/dialog/dialog-recent-files.tsx'
import { Button } from '@renderer/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useCompilation } from '@renderer/hooks/use-compilation.tsx'
import { useDrop, useSetDrop } from '@renderer/hooks/use-drop.tsx'
import { useRecentFiles } from '@renderer/hooks/use-recent-files.tsx'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import {
  LayoutHeader,
  LayoutHeaderActions,
  LayoutHeaderTitle,
} from '@renderer/pages/layout.tsx'
import { isAllGroupsEmpty, type ScriptRenderer } from '@renderer/types/index.ts'
import { scriptEquals } from '@renderer/utils/scripts/equals.ts'
import { pscFilesToScript } from '@renderer/utils/scripts/psc-files-to-script.ts'
import { scriptsToRenderer } from '@renderer/utils/scripts/scripts-to-renderer.ts'
import { uniqScripts } from '@renderer/utils/scripts/uniq-scripts.ts'
import {
  HistoryIcon,
  InfoIcon,
  PlayIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { Link } from '@tanstack/react-router'
import { useDidMount } from 'rooks'
import { toast } from 'sonner'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import type { Script } from '#common/types/script.ts'
import { useSettings } from '../settings/use-settings.tsx'
import GroupsMenu from './groups-menu.tsx'
import ScriptLine from './script-line.tsx'
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@renderer/components/ui/breadcrumb.tsx'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'

function SearchButton({
  onClick,
  disabled,
  'aria-disabled': ariaDisabled,
}: {
  onClick: () => void
  disabled?: boolean
  'aria-disabled'?: boolean
}) {
  return (
    <Button
      aria-disabled={ariaDisabled}
      disabled={disabled}
      onClick={onClick}
      size="icon"
    >
      <SearchIcon />
    </Button>
  )
}

export function CompilationPage() {
  const { t } = useLingui()
  const { groups } = useApp()
  const {
    scripts,
    start,
    setScripts,
    concurrentScripts,
    isRunning,
    clearCompilationLogs,
  } = useCompilation()
  const { setRecentFiles } = useRecentFiles()
  const { send } = useTelemetry()
  const { drop, isFileDialogActive } = useDrop()
  const { checkConfig, configError } = useSettings()
  const scrollRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: scripts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 32,
    getItemKey: (index) => scripts.at(index)?.id || index,
    overscan: 33,
  })

  useDidMount(() => {
    void checkConfig()
  })

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts = pscFilesToScript(pscFiles)
      send(TelemetryEvent.compilationDropScripts, {
        scripts: pscScripts.length,
      })
      setScripts((scriptsList) => {
        return uniqScripts([...scriptsList, ...pscScripts])
      })

      if (pscScripts.length > 5) {
        toast.info(<Trans>{pscScripts.length} scripts loaded.</Trans>)
      }
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

    setScripts((scriptList) =>
      uniqScripts(scriptsToRenderer(scriptList, group.scripts)),
    )
  }

  const onClickEmpty = () => {
    send(TelemetryEvent.compilationListEmpty, { scripts: scripts.length })
    clearCompilationLogs()
    setScripts(() => [])
  }

  useEffect(() => {
    let toastId = undefined as string | number | undefined

    if (configError !== false) {
      const checkErrorDescriptions: Record<string, string> = {
        game: t`Vérifiez le chemin du jeu.`,
        compiler: t`Vérifiez le chemin du compilateur.`,
        scripts: t`Vérifiez l'installation de Creation Kit.`,
      }
      toastId = toast.error(t`Configuration invalide`, {
        action: (
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              toast.dismiss(toastId)
            }}
            asChild
          >
            <Link to="/settings">
              <Trans>Plus de détails</Trans>
            </Link>
          </Button>
        ),
        description: checkErrorDescriptions[configError as string],
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
        <LayoutHeaderTitle>
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              <Trans>Compilation</Trans>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </LayoutHeaderTitle>
        <LayoutHeaderActions>
          <DialogRecentFiles>
            <Button size="icon">
              <HistoryIcon />
            </Button>
          </DialogRecentFiles>
          <SearchButton
            aria-disabled={isFileDialogActive}
            disabled={isFileDialogActive}
            onClick={drop}
          />
          {!isAllGroupsEmpty(groups) && (
            <GroupsMenu groups={groups} onChangeGroup={onChangeGroup} />
          )}
        </LayoutHeaderActions>
      </LayoutHeader>

      {scripts.length === 0 && (
        <div className="page flex flex-col min-h-page-with-titlebar">
          <div className="m-auto flex grow flex-col items-center justify-center gap-3 text-center tracking-tight px-4">
            <h5 className="text-xl">
              <span>
                <Trans>
                  Commencez par glisser-déposer des fichiers psc pour les
                  charger
                </Trans>
              </span>
            </h5>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-5" />
              </TooltipTrigger>
              <TooltipContent>
                <Trans>
                  Cette fonctionnalité n'est pas disponible si PCA est lancé en
                  mode administrateur.
                </Trans>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {scripts.length > 0 && (
        <>
          <div className="mb-4 flex gap-2 px-6">
            <Button
              aria-disabled={Boolean(configError) || isRunning}
              disabled={Boolean(configError) || isRunning}
              onClick={onClickStart}
            >
              <PlayIcon />
              <span>
                <Trans>Lancer</Trans>
              </span>
            </Button>

            <Button
              variant="ghost"
              aria-disabled={isRunning}
              disabled={isRunning}
              onClick={onClickEmpty}
            >
              <XIcon />
              <span>
                <Trans>Vider la liste</Trans>
              </span>
            </Button>
          </div>
          <ScrollArea className="page pb-4 grow h-px px-6" ref={scrollRef}>
            <div
              className="divide-y divide-accent rounded-xl border w-full relative"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const script = scripts[virtualRow.index]

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="group"
                  >
                    <ScriptLine
                      onClickPlayCompilation={onClickPlayCompilation(script)}
                      onClickRemoveScript={onClickRemoveScriptFromScript(
                        script,
                      )}
                      script={script}
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </>
      )}
    </>
  )
}
