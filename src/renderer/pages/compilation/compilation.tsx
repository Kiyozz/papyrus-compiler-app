/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ClearIcon from '@mui/icons-material/Clear'
import HistoryIcon from '@mui/icons-material/History'
import PlayIcon from '@mui/icons-material/PlayCircleFilled'
import SearchIcon from '@mui/icons-material/Search'
import {
  Alert,
  Button,
  ButtonProps,
  List,
  Snackbar,
  Stack,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { Script } from '../../../common/types/script'
import DialogRecentFiles from '../../components/dialog/dialog-recent-files'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isAllGroupsEmpty, ScriptRenderer } from '../../types'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { scriptsToRenderer } from '../../utils/scripts/scripts-to-renderer'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import { useSettings } from '../settings/use-settings'
import GroupsMenu from './groups-menu'
import ScriptLine from './script-line'

enum DialogRecentFilesState {
  open,
  close,
}

const RecentFilesButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  const { t } = useTranslation()

  return (
    <Button onClick={onClick} startIcon={<HistoryIcon />}>
      {t('page.compilation.actions.recentFiles')}
    </Button>
  )
}

const SearchButton = ({
  onClick,
  disabled,
  'aria-disabled': ariaDisabled,
}: { onClick: () => void } & Pick<
  ButtonProps,
  'disabled' | 'aria-disabled'
>) => {
  const { t } = useTranslation()

  return (
    <Button
      onClick={onClick}
      startIcon={<SearchIcon />}
      disabled={disabled}
      aria-disabled={ariaDisabled}
    >
      {t('page.compilation.actions.searchScripts')}
    </Button>
  )
}

const Compilation = () => {
  const { t } = useTranslation()
  const { groups } = useApp()
  const { scripts, start, setScripts, concurrentScripts, isRunning } =
    useCompilation()
  const { setRecentFiles } = useRecentFiles()
  const { send } = useTelemetry()
  const { drop, isFileDialogActive } = useDrop()
  const [dialogState, setDialogState] = useState(DialogRecentFilesState.close)
  const { checkConfig, configError, resetConfigError } = useSettings()

  useDidMount(() => {
    checkConfig()
  })

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
      setScripts(scriptsList => {
        send(TelemetryEvent.compilationRemoveScript, {
          remainingScripts: scriptsList.length - 1,
        })
        return scriptsList.filter(cs => cs !== script)
      })
    }
  }

  const onClickPlayCompilation = (script: ScriptRenderer) => {
    return () => {
      send(TelemetryEvent.compilationSinglePlay, {})

      start({ scripts: [script] })
    }
  }

  const onClickStart = () => {
    if (scripts.length === 0) {
      return
    }

    const files: Script[] = scripts.map(s => ({
      name: s.name,
      path: s.path,
    }))

    // noinspection JSIgnoredPromiseFromCall
    setRecentFiles(files)
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

  const onClearScripts = () => {
    setScripts(() => [])
  }

  const onClickEmpty = () => {
    send(TelemetryEvent.compilationListEmpty, { scripts: scripts.length })
    onClearScripts()
  }

  return (
    <>
      <PageAppBar title={t('page.compilation.title')}>
        <RecentFilesButton onClick={onClickRecentFiles} />
        <SearchButton
          onClick={drop}
          disabled={isFileDialogActive}
          aria-disabled={isFileDialogActive}
        />
        {!isAllGroupsEmpty(groups) && (
          <GroupsMenu groups={groups} onChangeGroup={onChangeGroup} />
        )}
      </PageAppBar>
      <Page>
        <DialogRecentFiles
          isOpen={dialogState == DialogRecentFilesState.open}
          onSelectFile={() => {
            setDialogState(DialogRecentFilesState.close)
          }}
          onClose={() => setDialogState(DialogRecentFilesState.close)}
        />

        <Snackbar open={!!configError} onClose={resetConfigError}>
          <Alert
            severity="error"
            action={
              <Stack direction="row" alignItems="center" gap={1}>
                <MuiLink component={Link} to="/settings">
                  {t('config.moreDetails')}
                </MuiLink>
                <Button onClick={checkConfig} size="small">
                  {t('common.refresh')}
                </Button>
              </Stack>
            }
          >
            {t('config.checkError', { context: configError })}
          </Alert>
        </Snackbar>

        <div className="mb-4 flex gap-2">
          <Button
            onClick={onClickStart}
            color="primary"
            variant="contained"
            disabled={!!configError || scripts.length === 0 || isRunning}
            aria-disabled={!!configError || scripts.length === 0 || isRunning}
            startIcon={<PlayIcon />}
          >
            {t('page.compilation.actions.start')}
          </Button>

          <Button
            onClick={onClickEmpty}
            disabled={isRunning || scripts.length === 0}
            aria-disabled={isRunning || scripts.length === 0}
            startIcon={<ClearIcon />}
          >
            {t('page.compilation.actions.clearList')}
          </Button>
        </div>

        {scripts.length > 0 ? (
          <List className="flex flex-col gap-2">
            {scripts.map(script => {
              return (
                <ScriptLine
                  key={script.id}
                  onClickRemoveScript={onClickRemoveScriptFromScript(script)}
                  onClickPlayCompilation={onClickPlayCompilation(script)}
                  script={script}
                />
              )
            })}
          </List>
        ) : (
          <>
            <Typography>{t('page.compilation.dragAndDropText')}</Typography>
            <Typography className="font-bold">
              {t('page.compilation.dragAndDropAdmin')}
            </Typography>
          </>
        )}
      </Page>
    </>
  )
}

export default Compilation
