import cx from 'classnames'
import map from 'lodash-es/map'
import max from 'lodash-es/max'
import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useState } from 'react'
import AppAddScripts from '../../components/app-add-scripts/app-add-scripts'
import useTimeout from '../../hooks/use-timeout'
import { GroupModel, ScriptModel } from '../../models'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import AppCompilationContent from './app-compilation-content'
import AppCompilationTitle from './app-compilation-title'
import './app-compilation.scss'
import CompilationContextProvider from './compilation-context'

export interface StateProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
}

export interface DispatchesProps {
  startCompilation: (scripts: ScriptModel[]) => void
  setCompilationScripts: (scripts: ScriptModel[]) => void
}

type Props = StateProps & DispatchesProps

const AppCompilation: React.FC<Props> = ({ startCompilation, compilationScripts, setCompilationScripts, isCompilationRunning }) => {
  const onClickRemoveScriptFromScript = useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [setCompilationScripts, compilationScripts])
  const [justLoadedGroup, setJustLoadedGroup] = useState<GroupModel | undefined>(undefined)
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
  const onChangeGroup = useCallback(({ value: group }) => {
    const lastId = max(map(compilationScripts, 'id')) ?? 0
    const scripts: ScriptModel[] = group.scripts.map((script: ScriptModel) => {
      script.id = lastId + script.id

      return script
    })

    setJustLoadedGroup(group)
    setCompilationScripts(uniqBy([...compilationScripts, ...scripts], 'name'))
  }, [compilationScripts, setCompilationScripts])

  useTimeout(() => {
    if (!justLoadedGroup) {
      return
    }

    setJustLoadedGroup(undefined)
  }, { time: 3000 })

  return (
    <CompilationContextProvider hoveringScript={hoveringScript} justLoadedGroup={justLoadedGroup}>
      <AppAddScripts
        onDrop={onDrop}
        onClick={(e, buttonRef) => { // prevent click anywhere else button
          if (e.target !== buttonRef.current) {
            buttonRef.current?.blur()
            e.stopPropagation()
          }
        }}
        accept=".psc"
        className="app-compilation container"
        buttonClassName="btn btn-outline-secondary mt-5 app-add-scripts-button position-relative"
        buttonText="Add scripts"
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
                  Button={Button}
                  createOnMouseEvent={createOnMouseEvent}
                  onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
                />
              </div>
            </div>
          )
        }}
      </AppAddScripts>
    </CompilationContextProvider>
  )
}

export default AppCompilation
