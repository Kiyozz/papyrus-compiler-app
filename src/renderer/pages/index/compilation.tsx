/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ClearIcon from '@material-ui/icons/Clear'
import HistoryIcon from '@material-ui/icons/History'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import SearchIcon from '@material-ui/icons/Search'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { Script } from '../../../common/types/script'
import DialogRecentFiles from '../../components/dialog/dialog-recent-files'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useRecentFiles } from '../../hooks/use-recent-files'
import { useTelemetry } from '../../hooks/use-telemetry'
import { ScriptRenderer } from '../../types'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import { reorderScripts } from '../../utils/scripts/reorder-scripts'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import GroupsLoader from './groups-loader'
import ScriptItem from './script-item'

enum DialogRecentFilesState {
  open,
  close,
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

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      setScripts((scriptsList: ScriptRenderer[]) => {
        const pscScripts: ScriptRenderer[] = pscFilesToPscScripts(
          pscFiles,
          scriptsList,
        )

        send(TelemetryEvents.compilationDropScripts, {
          scripts: pscScripts.length,
        })
        const newScripts = uniqScripts([...scriptsList, ...pscScripts])

        return reorderScripts(newScripts)
      })
    },
    [setScripts, send],
  )

  useSetDrop(onDrop)

  const onClickRemoveScriptFromScript = useCallback(
    (script: ScriptRenderer) => {
      return () => {
        setScripts(scriptsList => {
          send(TelemetryEvents.compilationRemoveScript, {
            remainingScripts: scriptsList.length - 1,
          })
          return scriptsList.filter((cs: ScriptRenderer) => cs !== script)
        })
      }
    },
    [setScripts, send],
  )

  const onClickStart = useCallback(() => {
    if (scripts.length === 0) {
      return
    }

    const files: Script[] = scripts.map(s => ({
      name: s.name,
      path: s.path,
    }))

    // noinspection JSIgnoredPromiseFromCall
    setRecentFiles(files)
    send(TelemetryEvents.compilationPlay, {
      scripts: scripts.length,
      concurrentScripts,
    })
    start({ scripts })
  }, [scripts, send, start, concurrentScripts, setRecentFiles])

  const onClickRecentFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur()

    setDialogState(DialogRecentFilesState.open)
  }

  const onChangeGroup = useCallback(
    (groupName: string) => {
      const group = groups.find(g => g.name === groupName)

      if (!group) {
        return
      }

      setScripts(scriptList =>
        reorderScripts(uniqScripts([...scriptList, ...group.scripts])),
      )
    },
    [setScripts, groups],
  )

  const onClearScripts = useCallback(() => {
    setScripts(() => [])
  }, [setScripts])

  const searchButton = useMemo(
    () => (
      <button className="btn" onClick={drop} key="search">
        <div className="icon">
          <SearchIcon />
        </div>
        {t('page.compilation.actions.searchScripts')}
      </button>
    ),
    [t, drop],
  )

  const recentFilesButton = useMemo(
    () => (
      <button className="btn" onClick={onClickRecentFiles} key="recent-files">
        <div className="icon">
          <HistoryIcon />
        </div>
        {t('page.compilation.actions.recentFiles')}
      </button>
    ),
    [t],
  )

  const pageActions = useMemo(() => {
    const possibleActions: ReactNode[] = [recentFilesButton, searchButton]

    if (groups.filter(group => !group.isEmpty).length > 0) {
      possibleActions.push(
        <GroupsLoader
          groups={groups}
          onChangeGroup={onChangeGroup}
          key="groups"
        />,
      )
    }

    return possibleActions
  }, [searchButton, recentFilesButton, groups, onChangeGroup])

  const scriptsList: ReactNode[] = useMemo(() => {
    return scripts.map(script => {
      return (
        <ScriptItem
          key={script.id}
          onClickRemoveScript={onClickRemoveScriptFromScript(script)}
          script={script}
        />
      )
    })
  }, [scripts, onClickRemoveScriptFromScript])

  const onClickEmpty = useCallback(() => {
    send(TelemetryEvents.compilationListEmpty, { scripts: scripts.length })
    onClearScripts()
  }, [onClearScripts, send, scripts])

  const Icon = useCallback(
    ({ className }: { className?: string }) => (
      <PlayIcon className={className} />
    ),
    [],
  )

  return (
    <>
      <PageAppBar title={t('page.compilation.title')} actions={pageActions} />
      <Page>
        <DialogRecentFiles
          isOpen={dialogState == DialogRecentFilesState.open}
          onSelectFile={() => {
            setDialogState(DialogRecentFilesState.close)
          }}
          onClose={() => setDialogState(DialogRecentFilesState.close)}
        />

        <div className="flex pb-4 gap-2">
          <button
            className="btn btn-primary"
            onClick={onClickStart}
            disabled={scripts.length === 0 || isRunning}
          >
            <div className="icon">
              <Icon />
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
            <p className="text-sm">{t('page.compilation.dragAndDropText')}</p>
            <p className="text-sm font-bold">
              {t('page.compilation.dragAndDropAdmin')}
            </p>
          </>
        )}
      </Page>
    </>
  )
}

export default Compilation
