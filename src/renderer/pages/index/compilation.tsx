/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ClearIcon from '@material-ui/icons/Clear'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import SearchIcon from '@material-ui/icons/Search'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { ScriptInterface } from '../../interfaces'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import reorderScripts from '../../utils/scripts/reorder-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import { GroupsLoader } from './groups-loader'
import { ScriptItem } from './script-item'

export function Compilation(): JSX.Element {
  const { t } = useTranslation()
  const { groups } = useApp()
  const {
    scripts,
    start,
    setScripts,
    concurrentScripts,
    isRunning
  } = useCompilation()
  const { send } = useTelemetry()
  const { drop } = useDrop()

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      setScripts((scriptsList: ScriptInterface[]) => {
        const pscScripts: ScriptInterface[] = pscFilesToPscScripts(
          pscFiles,
          scriptsList
        )
        send(TelemetryEvents.CompilationDropScripts, {
          scripts: pscScripts.length
        })
        const newScripts = uniqScripts([...scriptsList, ...pscScripts])

        return reorderScripts(newScripts)
      })
    },
    [setScripts, send]
  )

  useSetDrop(onDrop)

  const onClickRemoveScriptFromScript = useCallback(
    (script: ScriptInterface) => {
      return () => {
        setScripts(scriptsList => {
          send(TelemetryEvents.CompilationRemoveScript, {
            remainingScripts: scriptsList.length - 1
          })
          return scriptsList.filter((cs: ScriptInterface) => cs !== script)
        })
      }
    },
    [setScripts, send]
  )

  const onClickStart = useCallback(() => {
    if (scripts.length === 0) {
      return
    }

    send(TelemetryEvents.CompilationPlay, {
      scripts: scripts.length,
      concurrentScripts
    })
    start({ scripts })
  }, [scripts, send, start, concurrentScripts])

  const onChangeGroup = useCallback(
    (groupName: string) => {
      const group = groups.find(g => g.name === groupName)

      if (!group) {
        return
      }

      setScripts(scriptList =>
        reorderScripts(uniqScripts([...scriptList, ...group.scripts]))
      )
    },
    [setScripts, groups]
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
    [t, drop]
  )

  const pageActions = useMemo(() => {
    const possibleActions: JSX.Element[] = [searchButton]

    if (groups.filter(group => !group.isEmpty()).length > 0) {
      possibleActions.push(
        <GroupsLoader
          groups={groups}
          onChangeGroup={onChangeGroup}
          key="groups"
        />
      )
    }

    return possibleActions
  }, [groups, searchButton, onChangeGroup])

  const scriptsList: JSX.Element[] = useMemo(() => {
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
    send(TelemetryEvents.CompilationListEmpty, { scripts: scripts.length })
    onClearScripts()
  }, [onClearScripts, send, scripts])

  const Icon = useCallback(
    ({ className }: { className?: string }) => (
      <PlayIcon className={className} />
    ),
    []
  )

  return (
    <>
      <PageAppBar title={t('page.compilation.title')} actions={pageActions} />
      <Page>
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
            <p>{t('page.compilation.dragAndDropText')}</p>
            <p>{t('page.compilation.dragAndDropAdmin')}</p>
          </>
        )}
      </Page>
    </>
  )
}
