/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import SearchIcon from '@material-ui/icons/Search'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { usePageContext } from '../../components/page-context'
import { useDrop } from '../../hooks/use-drop'
import { ScriptInterface } from '../../interfaces'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import reorderScripts from '../../utils/scripts/reorder-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import { CompilationContextProvider } from './compilation-context'
import { CompilationPageContent } from './compilation-page-content'
import { GroupsLoader } from './groups-loader'

export function Compilation() {
  const { t } = useTranslation()
  const {
    groups,
    config: { compilation }
  } = usePageContext()
  const compilationScripts = useStoreSelector(
    state => state.compilation.compilationScripts
  )
  const startCompilation = useAction(
    actions.compilationPage.compilation.startWholeCompilation
  )
  const setCompilationScripts = useAction(actions.compilationPage.setScripts)

  const onClickRemoveScriptFromScript = useCallback(
    (script: ScriptInterface) => {
      return () => {
        const newListOfScripts = compilationScripts.filter(
          compilationScript => compilationScript !== script
        )

        setCompilationScripts(newListOfScripts)
      }
    },
    [compilationScripts, setCompilationScripts]
  )

  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation({
      allScripts: compilationScripts,
      concurrentScripts: compilation.concurrentScripts
    })
  }, [compilation.concurrentScripts, compilationScripts, startCompilation])

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts: ScriptInterface[] = pscFilesToPscScripts(
        pscFiles,
        compilationScripts
      )
      const newScripts = uniqScripts([...compilationScripts, ...pscScripts])

      setCompilationScripts(reorderScripts(newScripts))
    },
    [compilationScripts, setCompilationScripts]
  )

  const onChangeGroup = useCallback(
    (groupName: string) => {
      const group = groups.find(g => g.name === groupName)

      if (!group) {
        return
      }

      setCompilationScripts(
        reorderScripts(uniqScripts([...compilationScripts, ...group.scripts]))
      )
    },
    [setCompilationScripts, compilationScripts, groups]
  )

  const onClearScripts = useCallback(() => {
    setCompilationScripts([])
  }, [setCompilationScripts])

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
    <CompilationContextProvider>
      <PageAppBar title={t('page.compilation.title')} actions={pageActions} />

      <Page>
        <CompilationPageContent
          onClickPlayPause={onClickPlayPause}
          onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
          onClear={onClearScripts}
        />
      </Page>
    </CompilationContextProvider>
  )
}
