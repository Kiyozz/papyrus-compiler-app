import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
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
  const [hoveringScript, setHoveringScript] = React.useState<ScriptModel | undefined>(undefined)
  const onClickRemoveScriptFromScript = (script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }
  const createOnMouseEvent = (script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (hoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }
  const onClickPlayPause = () => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }
  const onDrop = (pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqBy([...compilationScripts, ...pscScripts], 'name')

    setCompilationScripts(newScripts.map((script, index) => ({ ...script, id: index })))
  }
  const onChangeGroup = (groupName: string) => {
    const group = groups.find(group => group.name === groupName)

    if (!group) {
      return
    }

    const scripts: ScriptModel[] = uniqBy([...compilationScripts, ...group.scripts], 'name')
      .map((script, index) => ({ ...script, id: index }))

    setCompilationScripts(scripts)
  }
  const onClearScripts = () => {
    setCompilationScripts([])
  }

  return (
    <CompilationContextProvider hoveringScript={hoveringScript}>
      <PageAppBar
        title="Compilation"
        actions={[
          {
            icon: (
              isCompilationRunning ? (
                <CircularProgress size={18} />
              ) : (
                <PlayCircleFilledIcon />
              )
            ),
            onClick: onClickPlayPause,
            iconButtonProps: {
              disabled: compilationScripts.length === 0 || isCompilationRunning
            }
          }
        ]}
      />

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
