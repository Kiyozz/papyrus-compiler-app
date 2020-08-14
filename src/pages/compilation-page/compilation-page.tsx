import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import { RouteComponentProps } from '@reach/router'

import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { useDrop } from '../../hooks/use-drop'
import { Group, ScriptModel } from '../../models'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import reorderScripts from '../../utils/scripts/reorder-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import CompilationContextProvider from './compilation-context'
import CompilationPageContent from './compilation-page-content'
import GroupsLoader from './groups-loader'

type Props = RouteComponentProps

const CompilationPage: React.FC<Props> = () => {
  const { t } = useTranslation()
  const groups = useStoreSelector(state => state.groups.groups.map(group => new Group(group.name, group.scripts)))
  const isCompilationRunning = useStoreSelector(state => state.compilation.isCompilationRunning)
  const compilationScripts = useStoreSelector(state => state.compilation.compilationScripts)
  const startCompilation = useAction(actions.compilationPage.compilation.startWholeCompilation)
  const setCompilationScripts = useAction(actions.compilationPage.setScripts)

  const [hoveringScript, setHoveringScript] = useState<ScriptModel | undefined>(undefined)
  const onClickRemoveScriptFromScript = useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [compilationScripts, setCompilationScripts])
  const createOnMouseEvent = useCallback((script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (hoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }, [isCompilationRunning, hoveringScript])

  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqScripts([...compilationScripts, ...pscScripts])

    setCompilationScripts(reorderScripts(newScripts))
  }, [compilationScripts, setCompilationScripts])

  const onChangeGroup = useCallback((groupName: string) => {
    const group = groups.find(group => group.name === groupName)

    if (!group) {
      return
    }

    setCompilationScripts(reorderScripts(uniqScripts([...compilationScripts, ...group.scripts])))
  }, [setCompilationScripts, compilationScripts, groups])

  const onClearScripts = useCallback(() => {
    setCompilationScripts([])
  }, [setCompilationScripts])

  const addScriptsButton = useDrop({
    button: (
      <Button color="inherit" startIcon={<SearchIcon />}>
        {t('page.compilation.actions.searchScripts')}
      </Button>
    ),
    onDrop
  })

  return (
    <CompilationContextProvider hoveringScript={hoveringScript}>
      <PageAppBar
        title={t('page.compilation.title')}
        actions={[
          {
            button: addScriptsButton
          },
          {
            button: (
              <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
            )
          }
        ]}
      />

      <Page>
        <CompilationPageContent
          createOnMouseEvent={createOnMouseEvent}
          onClickPlayPause={onClickPlayPause}
          onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
          onClear={onClearScripts}
        />
      </Page>
    </CompilationContextProvider>
  )
}

export default CompilationPage
