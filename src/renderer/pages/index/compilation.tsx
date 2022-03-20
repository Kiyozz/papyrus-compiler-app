/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import ClearIcon from '@mui/icons-material/Clear'
import HistoryIcon from '@mui/icons-material/History'
import PlayIcon from '@mui/icons-material/PlayCircleFilled'
import SearchIcon from '@mui/icons-material/Search'
import { Button } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { Script } from '../../../common/types/script'
import DialogRecentFiles from '../../components/dialog/dialog-recent-files'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import Toast from '../../components/toast'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { isAllGroupsEmpty, ScriptRenderer } from '../../types'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import { useSettings } from '../settings/use-settings'
import GroupsLoader from './groups-loader'
import ScriptItem from './script-item'

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

const SearchButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation()

  return (
    <Button onClick={onClick} startIcon={<SearchIcon />}>
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
  const { drop } = useDrop()
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
        return scriptsList.filter((cs: ScriptRenderer) => cs !== script)
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

    setScripts(scriptList => uniqScripts([...scriptList, ...group.scripts]))
  }

  const onClearScripts = useCallback(() => {
    setScripts(() => [])
  }, [setScripts])

  const scriptsList = scripts.map(script => {
    return (
      <ScriptItem
        key={script.id}
        onClickRemoveScript={onClickRemoveScriptFromScript(script)}
        onClickPlayCompilation={onClickPlayCompilation(script)}
        script={script}
      />
    )
  })

  const onClickEmpty = useCallback(() => {
    send(TelemetryEvent.compilationListEmpty, { scripts: scripts.length })
    onClearScripts()
  }, [onClearScripts, scripts.length, send])

  return (
    <>
      <PageAppBar title={t('page.compilation.title')}>
        <RecentFilesButton onClick={onClickRecentFiles} />
        <SearchButton onClick={drop} />
        {!isAllGroupsEmpty(groups) && (
          <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
        )}
      </PageAppBar>
      {/*<PageAppBar
        title={t('page.compilation.title')}
        actions={
          <>
            <RecentFilesButton onClick={onClickRecentFiles} />
            <SearchButton onClick={drop} />
            {!isAllGroupsEmpty(groups) && (
              <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
            )}
          </>
        }
      />*/}
      <Page>
        <DialogRecentFiles
          isOpen={dialogState == DialogRecentFilesState.open}
          onSelectFile={() => {
            setDialogState(DialogRecentFilesState.close)
          }}
          onClose={() => setDialogState(DialogRecentFilesState.close)}
        />

        <Toast
          type="error"
          message={
            <Trans
              tOptions={{ context: configError }}
              i18nKey="config.checkError"
              components={{
                linkToSettings: <Link to="/settings" className="underline" />,
              }}
            />
          }
          onClose={resetConfigError}
          in={!!configError}
          speedMs={300}
          autoCloseMs={0}
          actions={
            <button className="btn" onClick={checkConfig}>
              {t('common.refresh')}
            </button>
          }
        />

        <div className="flex gap-2 pb-4">
          <button
            className="btn btn-primary"
            onClick={onClickStart}
            disabled={!!configError || scripts.length === 0 || isRunning}
          >
            <div className="icon">
              <PlayIcon />
            </div>{' '}
            {t('page.compilation.actions.start')}
          </button>

          <button
            className="btn"
            onClick={onClickEmpty}
            disabled={isRunning || scripts.length === 0}
          >
            <ClearIcon className="mr-2" />{' '}
            {t('page.compilation.actions.clearList')}
          </button>
        </div>

        {scripts.length > 0 ? (
          <div className="flex flex-col gap-2">{scriptsList}</div>
        ) : (
          <>
            <p>{t('page.compilation.dragAndDropText')}</p>
            <p className="font-bold">
              {t('page.compilation.dragAndDropAdmin')}
            </p>
          </>
        )}
      </Page>
    </>
  )
}

export default Compilation
