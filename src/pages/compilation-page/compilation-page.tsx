import Fab from '@material-ui/core/Fab'
import SearchIcon from '@material-ui/icons/Search'

import uniqBy from 'lodash-es/uniqBy'
import React from 'react'
import { connect } from 'react-redux'

import DropScripts from '../../components/drop-scripts/drop-scripts'
import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { GroupModel, ScriptModel } from '../../models'
import { actionSetCompilationScripts, actionStartCompilation } from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import CompilationContextProvider from './compilation-context'
import CompilationPageContent from './compilation-page-content'
import CompilationPageTitle from './compilation-page-title'
import classes from './compilation-page.module.scss'

export interface StateProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  groups: GroupModel[]
}

export interface DispatchesProps {
  startCompilation: (scripts: ScriptModel[]) => void
  setCompilationScripts: (scripts: ScriptModel[]) => void
}

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ startCompilation, groups, compilationScripts, setCompilationScripts, isCompilationRunning }) => {
  const onClickRemoveScriptFromScript = React.useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [setCompilationScripts, compilationScripts])
  const [hoveringScript, setHoveringScript] = React.useState<ScriptModel | undefined>(undefined)
  const createOnMouseEvent = React.useCallback((script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (hoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }, [setHoveringScript, hoveringScript, isCompilationRunning])
  const onClickPlayPause = React.useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])
  const onDrop = React.useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqBy([...compilationScripts, ...pscScripts], 'name')

    setCompilationScripts(newScripts.map((script, index) => ({ ...script, id: index })))
  }, [setCompilationScripts, compilationScripts])
  const onChangeGroup = React.useCallback((groupName: string) => {
    const group = groups.find(group => group.name === groupName)

    if (!group) {
      return
    }

    const scripts: ScriptModel[] = uniqBy([...compilationScripts, ...group.scripts], 'name')
      .map((script, index) => ({ ...script, id: index }))

    setCompilationScripts(scripts)
  }, [compilationScripts, setCompilationScripts, groups])

  const onClearScripts = () => {
    setCompilationScripts([])
  }

  return (
    <CompilationContextProvider hoveringScript={hoveringScript}>
      <PageAppBar title="Compilation" />

      <Page>
        <DropScripts
          onDrop={onDrop}
          accept=".psc"
          onlyClickButton
          Button={
            <Fab className={classes.fab} variant="extended" color="primary">
              <SearchIcon className={classes.fabIcon} /> Search scripts
            </Fab>
          }
        >
          {({ Button, isDragActive }) => (
            <>
              <CompilationPageTitle
                onClickPlayPause={onClickPlayPause}
              />

              <CompilationPageContent
                isDragActive={isDragActive}
                AddScriptsButton={Button}
                createOnMouseEvent={createOnMouseEvent}
                onChangeGroup={onChangeGroup}
                onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
                onClear={onClearScripts}
              />
            </>
          )}
        </DropScripts>
      </Page>
    </CompilationContextProvider>
  )
}

const CompilationPage = connect(
  (store: RootStore): StateProps => ({
    isCompilationRunning: store.compilation.isCompilationRunning,
    compilationScripts: store.compilation.compilationScripts,
    groups: store.groups.groups
  }),
  (dispatch): DispatchesProps => ({
    startCompilation: scripts => dispatch(actionStartCompilation(scripts)),
    setCompilationScripts: scripts => dispatch(actionSetCompilationScripts(scripts))
  })
)(Component)

export default CompilationPage
