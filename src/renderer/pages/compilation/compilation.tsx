/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ClearIcon from '@mui/icons-material/Clear'
import HelpIcon from '@mui/icons-material/Help'
import HistoryIcon from '@mui/icons-material/History'
import PlayIcon from '@mui/icons-material/PlayCircleFilled'
import SearchIcon from '@mui/icons-material/Search'
import {
  Alert,
  Button,
  List,
  Snackbar,
  Stack,
  Typography,
  Link as MuiLink,
  Tooltip,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'
import { TelemetryEvent } from '../../../common/telemetry-event'
import DialogRecentFiles from '../../components/dialog/dialog-recent-files'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isAllGroupsEmpty } from '../../types'
import { scriptEquals } from '../../utils/scripts/equals'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { scriptsToRenderer } from '../../utils/scripts/scripts-to-renderer'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import { useSettings } from '../settings/use-settings'
import GroupsMenu from './groups-menu'
import ScriptLine from './script-line'
import type { ScriptRenderer } from '../../types'
import type { Script } from '../../../common/types/script'
import type { ButtonProps } from '@mui/material'

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
    <Button onClick={onClick} startIcon={<HistoryIcon />}>
      {t('page.compilation.actions.recentFiles')}
    </Button>
  )
}

function SearchButton({
  onClick,
  disabled,
  'aria-disabled': ariaDisabled,
}: { onClick: () => void } & Pick<ButtonProps, 'disabled' | 'aria-disabled'>) {
  const { t } = useTranslation()

  return (
    <Button
      aria-disabled={ariaDisabled}
      disabled={disabled}
      onClick={onClick}
      startIcon={<SearchIcon />}
    >
      {t('page.compilation.actions.searchScripts')}
    </Button>
  )
}

function Compilation() {
  const { t } = useTranslation()
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
      setScripts(scriptsList => {
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
      setScripts(scriptsList => {
        send(TelemetryEvent.compilationRemoveScript, {
          remainingScripts: scriptsList.length - 1,
        })
        return scriptsList.filter(cs => !scriptEquals(script)(cs))
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

    const files: Script[] = scripts.map(s => ({
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
    const group = groups.find(g => g.name === groupName)

    if (!group) {
      return
    }

    setScripts(scriptList =>
      uniqScripts(scriptsToRenderer(scriptList, group.scripts)),
    )
  }

  const onClickEmpty = () => {
    send(TelemetryEvent.compilationListEmpty, { scripts: scripts.length })
    clearCompilationLogs()
    setScripts(() => [])
  }

  return (
    <>
      <PageAppBar title={t('page.compilation.title')}>
        <RecentFilesButton onClick={onClickRecentFiles} />
        <SearchButton
          aria-disabled={isFileDialogActive}
          disabled={isFileDialogActive}
          onClick={drop}
        />
        {!isAllGroupsEmpty(groups) && (
          <GroupsMenu groups={groups} onChangeGroup={onChangeGroup} />
        )}
      </PageAppBar>
      <Page>
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
                <Button onClick={onClickRefreshCheckConfig} size="small">
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
              color="primary"
              disabled={Boolean(configError) || isRunning}
              onClick={onClickStart}
              startIcon={<PlayIcon />}
              variant="contained"
            >
              {t('page.compilation.actions.start')}
            </Button>

            <Button
              aria-disabled={isRunning}
              disabled={isRunning}
              onClick={onClickEmpty}
              startIcon={<ClearIcon />}
            >
              {t('page.compilation.actions.clearList')}
            </Button>
          </div>
        )}

        {scripts.length > 0 ? (
          <List className="flex flex-col gap-0.5">
            {scripts.map(script => {
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
              <HelpIcon className="mt-3" />
            </Tooltip>
          </div>
        )}
      </Page>
    </>
  )
}

export default Compilation
