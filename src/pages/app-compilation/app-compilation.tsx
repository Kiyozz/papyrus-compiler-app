import classNames from 'classnames'
import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CSSTransition } from 'react-transition-group'
import './app-compilation.scss'
import AppTitle from '../../components/app-title/app-title'
import AppContainerLogs from '../../containers/app-compilation-logs/app-compilation-logs.container'
import { ScriptModel } from '../../models'
import { format } from '../../utils/date/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ScriptStatus } from '../../enums/script-status.enum'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'

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

  const [isHoveringScript, setHoveringScript] = useState<ScriptModel | undefined>(undefined)
  const createOnMouseEvent = useCallback((script?: ScriptModel) => {
    return () => {
      setHoveringScript(script)
    }
  }, [setHoveringScript])

  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFiles.map(({ name, path, lastModified }, index) => {
      return {
        id: compilationScripts.length + index + 1,
        name,
        path,
        lastModified,
        status: ScriptStatus.IDLE
      }
    })

    setCompilationScripts(uniqBy([...compilationScripts, ...pscScripts], 'name'))
  }, [setCompilationScripts, compilationScripts])
  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.psc',
    preventDropOnDocument: true
  })

  const scriptsList = useMemo(() => {
    return compilationScripts.map((script) => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)

      return (
        <div
          key={script.id}
          className="list-group-item"
          onMouseEnter={onMouseEnterScript}
          onMouseLeave={onMouseLeaveScript}
        >
          <CSSTransition
            timeout={150}
            in={isHoveringScript === script}
            classNames="app-fade-grow"
            mountOnEnter
            unmountOnExit
          >
            <div className="app-list-group-item-script-hover">
              <span onClick={onClickRemoveScriptFromScript(script)}>
                <FontAwesomeIcon icon="trash" />
              </span>
            </div>
          </CSSTransition>
          <div className="app-list-group-item-script-name">{script.name}</div>
          <div className="app-list-group-item-script-path ml-2 mt-2">
            Last edited at {format(script.lastModified, 'PPpp')}
            <span className={classNames(['app-list-group-item-script-status', getClassNameFromStatus(script)])}>
              <FontAwesomeIcon
                spin={script.status === ScriptStatus.RUNNING}
                icon={getIconFromStatus(script)}
              />
            </span>
          </div>
        </div>
      )
    })
  }, [compilationScripts, createOnMouseEvent, isHoveringScript, onClickRemoveScriptFromScript])

  return (
    <div
      className={classNames({
        'app-compilation container': true,
        'app-compilation-is-dragging': isDragActive
      })}
      {...getRootProps()}
    >
      <AppTitle className="d-flex">
        Compilation

        <CSSTransition
          timeout={300}
          in={compilationScripts.length > 0}
          classNames="app-fade"
          mountOnEnter
        >
          <div className="app-compilation-actions">
            <div
              className={classNames({
                'app-compilation-action': true,
                'app-compilation-action-disable': isCompilationRunning || compilationScripts.length === 0
              })}
              onClick={onClickPlayPause}
            >
              <FontAwesomeIcon
                spin={isCompilationRunning}
                icon={isCompilationRunning ? 'circle-notch' : 'play-circle'}
              />
            </div>
          </div>
        </CSSTransition>
      </AppTitle>

      <div className="app-compilation-content">
        <CSSTransition
          timeout={150}
          in={isDragActive}
          classNames="app-fade"
          mountOnEnter
          unmountOnExit
        >
          <div className="app-compilation-is-dragging-container">
            Drop files here...
          </div>
        </CSSTransition>

        {scriptsList.length > 0 ? (
          <>
            {scriptsList}
          </>
        ) : (
          <p className="text-secondary text-wrap">You can drag and drop psc files to load them into the application.</p>
        )}

        <AppContainerLogs />
      </div>
    </div>
  )
}

export default AppCompilation
