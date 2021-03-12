/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import SearchIcon from '@material-ui/icons/Search'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useCompilation } from '../../hooks/use-compilation'
import { useDrop } from '../../hooks/use-drop'
import { ScriptInterface } from '../../interfaces'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import reorderScripts from '../../utils/scripts/reorder-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import { CompilationPageContent } from './compilation-page-content'
import { GroupsLoader } from './groups-loader'

export function Compilation(): JSX.Element {
  const { t } = useTranslation()
  const { groups } = useApp()
  const { scripts, start, setScripts } = useCompilation()

  const onClickRemoveScriptFromScript = useCallback(
    (script: ScriptInterface) => {
      return () => {
        setScripts(scriptsList =>
          scriptsList.filter((cs: ScriptInterface) => cs !== script)
        )
      }
    },
    [setScripts]
  )

  const onClickStart = useCallback(() => {
    if (scripts.length === 0) {
      return
    }

    start({ scripts })
  }, [scripts, start])

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      setScripts((scriptsList: ScriptInterface[]) => {
        const pscScripts: ScriptInterface[] = pscFilesToPscScripts(
          pscFiles,
          scriptsList
        )
        const newScripts = uniqScripts([...scriptsList, ...pscScripts])

        return reorderScripts(newScripts)
      })
    },
    [setScripts]
  )

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

  const addScriptsButton = useDrop({
    button: (
      <button className="btn">
        <div className="icon">
          <SearchIcon />
        </div>
        {t('page.compilation.actions.searchScripts')}
      </button>
    ),
    onDrop
  })

  const pageActions = useMemo(() => {
    const possibleActions: JSX.Element[] = []

    if (addScriptsButton) {
      possibleActions.push(addScriptsButton)
    }

    if (groups.filter(group => !group.isEmpty()).length > 0) {
      possibleActions.push(
        <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
      )
    }

    return possibleActions
  }, [addScriptsButton, groups, onChangeGroup])

  return (
    <>
      <PageAppBar title={t('page.compilation.title')} actions={pageActions} />

      <Page>
        <CompilationPageContent
          onClickStart={onClickStart}
          onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
          onClear={onClearScripts}
        />
      </Page>
    </>
  )
}
