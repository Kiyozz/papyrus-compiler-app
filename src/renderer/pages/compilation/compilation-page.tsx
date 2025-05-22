/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Alert, List, Snackbar, Stack, Typography, Link as MuiLink, Tooltip } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'
import { TelemetryEvent } from '../../../common/telemetry-event.ts'
import DialogRecentFiles from '@/components/dialog/dialog-recent-files.tsx'
import { useApp } from '@/hooks/use-app.tsx'
import { useCompilation } from '@/hooks/use-compilation.tsx'
import { useDrop, useSetDrop } from '@/hooks/use-drop.tsx'
import { useRecentFiles } from '@/hooks/use-recent-files.tsx'
import { useTelemetry } from '@/hooks/use-telemetry.tsx'
import { isAllGroupsEmpty, type ScriptRenderer } from '@/types'
import { scriptEquals } from '@/utils/scripts/equals.ts'
import { pscFilesToScript } from '@/utils/scripts/psc-files-to-script.ts'
import { scriptsToRenderer } from '@/utils/scripts/scripts-to-renderer.ts'
import { uniqScripts } from '@/utils/scripts/uniq-scripts.ts'
import { useSettings } from '../settings/use-settings.tsx'
import GroupsMenu from './groups-menu.tsx'
import ScriptLine from './script-line.tsx'
import type { Script } from '../../../common/types/script.ts'
import { LayoutHeader, LayoutHeaderTitle } from '@/pages/layout.tsx'
import { Button } from '@/components/ui/button.tsx'
import { HistoryIcon, InfoIcon, PlayIcon, SearchIcon, XIcon } from 'lucide-react'

enum DialogRecentFilesState {
  open,
  close,
}

function RecentFilesButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const { t } = useTranslation()

  return (
    <Button onClick={onClick}>
      <HistoryIcon />
      <span>{t('page.compilation.actions.recentFiles')}</span>
    </Button>
  )
}

function SearchButton({
  onClick,
  disabled,
  'aria-disabled': ariaDisabled,
}: { onClick: () => void; disabled?: boolean; 'aria-disabled'?: boolean }) {
  const { t } = useTranslation()

  return (
    <Button aria-disabled={ariaDisabled} disabled={disabled} onClick={onClick}>
      <SearchIcon />
      <span>{t('page.compilation.actions.searchScripts')}</span>
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
  const [dialogState, setDialogState] = useState(DialogRecentFilesState.close)
  const { checkConfig, configError } = useSettings()

  useDidMount(() => {
    void checkConfig(true)
  })

  const onClickRefreshCheckConfig = () => {
    void checkConfig(true)
  }

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

  const onClickRecentFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()

    setDialogState(DialogRecentFilesState.open)
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

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>{t('page.compilation.title')}</LayoutHeaderTitle>
        <div className="flex gap-2">
          <RecentFilesButton onClick={onClickRecentFiles} />
          <SearchButton aria-disabled={isFileDialogActive} disabled={isFileDialogActive} onClick={drop} />
          {!isAllGroupsEmpty(groups) && <GroupsMenu groups={groups} onChangeGroup={onChangeGroup} />}
        </div>
      </LayoutHeader>
      <DialogRecentFiles
        isOpen={dialogState === DialogRecentFilesState.open}
        onClose={() => setDialogState(DialogRecentFilesState.close)}
        onSelectFile={() => {
          setDialogState(DialogRecentFilesState.close)
        }}
      />

      <Snackbar open={Boolean(configError)}>
        <Alert
          action={
            <Stack alignItems="center" direction="row" gap={1}>
              <MuiLink component={Link} to="/settings">
                {t('common.moreDetails')}
              </MuiLink>
              <Button onClick={onClickRefreshCheckConfig} size="sm">
                {t('common.refresh')}
              </Button>
            </Stack>
          }
          severity="error"
        >
          {t('config.checkError', { context: configError })}
        </Alert>
      </Snackbar>

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

          <Button aria-disabled={isRunning} disabled={isRunning} onClick={onClickEmpty}>
            <XIcon />
            <span>{t('page.compilation.actions.clearList')}</span>
          </Button>
        </div>
      )}

      {scripts.length > 0 ? (
        <List className="flex flex-col gap-0.5">
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
        </List>
      ) : (
        <div className="m-auto text-center">
          <Typography variant="h5">
            <span>{t('page.compilation.dragAndDropText')}</span>
          </Typography>
          <Tooltip title={t<string>('page.compilation.dragAndDropAdmin')}>
            <InfoIcon className="mt-3" />
          </Tooltip>
        </div>
      )}
    </>
  )
}
