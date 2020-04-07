import classNames from 'classnames'
import map from 'lodash-es/map'
import max from 'lodash-es/max'
import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useRef, useState } from 'react'
import AppAddScripts from '../../components/app-add-scripts/app-add-scripts'
import useTimeout from '../../hooks/use-timeout'
import { GroupModel, ScriptModel } from '../../models'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import AppCompilationContent from './app-compilation-content'
import AppCompilationTitle from './app-compilation-title'
import './app-compilation.scss'

export interface StateProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  popupOpen: boolean
  groups: GroupModel[]
}

export interface DispatchesProps {
  startCompilation: (scripts: ScriptModel[]) => void
  setCompilationScripts: (scripts: ScriptModel[]) => void
}

type Props = StateProps & DispatchesProps

const AppCompilation: React.FC<Props> = ({ startCompilation, compilationScripts, setCompilationScripts, isCompilationRunning, popupOpen, groups }) => {
  const addScriptsButtonRef = useRef<HTMLButtonElement>(null)

  const onClickRemoveScriptFromScript = useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [setCompilationScripts, compilationScripts])

  const [justLoadedGroup, setJustLoadedGroup] = useState<GroupModel | undefined>(undefined)

  const [isHoveringScript, setHoveringScript] = useState<ScriptModel | undefined>(undefined)
  const createOnMouseEvent = useCallback((script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (isHoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }, [setHoveringScript, isHoveringScript, isCompilationRunning])

  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqBy([...compilationScripts, ...pscScripts], 'name')

    setCompilationScripts(
      newScripts.map((script, index) => ({ ...script, id: index }))
    )
  }, [setCompilationScripts, compilationScripts])

  const onChangeGroup = useCallback(({ value: group }) => {
    const lastId = max(map(compilationScripts, 'id'))
    const scripts: ScriptModel[] = group.scripts.map((script: ScriptModel) => {
      script.id = (lastId || 0) + script.id

      return script
    })

    setJustLoadedGroup(group)
    setCompilationScripts(
      uniqBy([...compilationScripts, ...scripts], 'name')
    )
  }, [compilationScripts, setCompilationScripts])

  useTimeout(() => {
    if (!justLoadedGroup) {
      return
    }

    setJustLoadedGroup(undefined)
  }, { time: 3000 })

  return (
    <AppAddScripts
      onDrop={onDrop}
      onClick={(e) => { // prevent click anywhere else button
        if (e.target !== addScriptsButtonRef.current) {
          addScriptsButtonRef.current?.blur()
          e.stopPropagation()
        }
      }}
      accept=".psc"
      className="app-compilation container"
    >
      {({ Button, isDragActive }) => {
        return (
          <div className={classNames({ 'app-compilation-is-dragging': isDragActive })}>
            <AppCompilationTitle
              onChangeGroup={onChangeGroup}
              onClickPlayPause={onClickPlayPause}
              groups={groups}
              compilationScripts={compilationScripts}
              isCompilationRunning={isCompilationRunning}
              justLoadedGroup={justLoadedGroup}
            />

            <div className="app-compilation-content">
              <AppCompilationContent
                isDragActive={isDragActive}
                Button={Button}
                compilationScripts={compilationScripts}
                createOnMouseEvent={createOnMouseEvent}
                isHoveringScript={isHoveringScript}
                onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
                popupOpen={popupOpen}
              />
            </div>
          </div>
        )
      }}
    </AppAddScripts>
  )
}

export default AppCompilation
