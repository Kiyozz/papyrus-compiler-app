import Fab from '@material-ui/core/Fab'
import SearchIcon from '@material-ui/icons/Search'
import cx from 'classnames'
import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'

import AppAddScripts from '../../components/app-add-scripts/app-add-scripts'
import { GroupModel, ScriptModel } from '../../models'
import { actionSetCompilationScripts, actionStartCompilation } from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import AppCompilationContent from './app-compilation-content'
import AppCompilationTitle from './app-compilation-title'
import './app-compilation.scss'
import classes from './app-compilation.module.scss'
import CompilationContextProvider from './compilation-context'

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
  const onClickRemoveScriptFromScript = useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [setCompilationScripts, compilationScripts])
  const [hoveringScript, setHoveringScript] = useState<ScriptModel | undefined>(undefined)
  const createOnMouseEvent = useCallback((script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (hoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }, [setHoveringScript, hoveringScript, isCompilationRunning])
  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])
  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqBy([...compilationScripts, ...pscScripts], 'name')

    setCompilationScripts(newScripts.map((script, index) => ({ ...script, id: index })))
  }, [setCompilationScripts, compilationScripts])
  const onChangeGroup = useCallback((groupName: string) => {
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
      <AppAddScripts
        onDrop={onDrop}
        accept=".psc"
        className="app-compilation container"
        buttonClassName="app-add-scripts-button position-relative"
        buttonText="Add scripts"
        onlyClickButton
        Button={<Fab className={classes.fab} variant="extended" color="primary"><SearchIcon className={classes.fabIcon} /> Search scripts</Fab>}
      >
        {({ Button, isDragActive }) => {
          return (
            <div className={cx({ 'app-compilation-is-dragging': isDragActive })}>
              <AppCompilationTitle
                onChangeGroup={onChangeGroup}
                onClickPlayPause={onClickPlayPause}
              />

              <div className="app-compilation-content">
                <AppCompilationContent
                  isDragActive={isDragActive}
                  AddScriptsButton={Button}
                  createOnMouseEvent={createOnMouseEvent}
                  onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
                  onClear={onClearScripts}
                />
              </div>
            </div>
          )
        }}
      </AppAddScripts>
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
