import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useMemo, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { AddScriptsButton } from '../../components/app-add-scripts/app-add-scripts'
import AppContainerLogs from '../../components/app-compilation-logs/app-compilation-logs.container'
import AppOpenLogFile from '../../components/app-open-log-file/app-open-log-file.container'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'
import { format } from '../../utils/date/format'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'

interface Props {
  popupOpen: boolean
  isDragActive: boolean
  isHoveringScript?: ScriptModel
  compilationScripts: ScriptModel[]
  Button: AddScriptsButton
  onClickRemoveScriptFromScript(script: ScriptModel): () => void
  createOnMouseEvent(script: ScriptModel | undefined): () => void
}

const AppCompilationContent: React.FC<Props> = ({ popupOpen, isDragActive, isHoveringScript, compilationScripts, onClickRemoveScriptFromScript, createOnMouseEvent, Button }) => {
  const addScriptsButtonRef = useRef<HTMLButtonElement>()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return compilationScripts.map((script) => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)
      const onMouseMoveScript = createOnMouseEvent(script)

      return (
        <div
          key={script.id}
          className="list-group-item"
          onMouseEnter={onMouseEnterScript}
          onMouseLeave={onMouseLeaveScript}
          onMouseMove={onMouseMoveScript}
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
    <>
      {!popupOpen && (
        <>
          <CSSTransition
            timeout={300}
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
            <>
              <p className="text-secondary text-wrap">
                You can drag and drop psc files to load them into the
                application.

                <br />

                This is only available when not running in administrator.
              </p>
            </>
          )}
        </>
      )}

      <Button ref={addScriptsButtonRef} className="btn btn-outline-secondary mt-5 app-add-scripts-button position-relative">
        Add scripts
      </Button>

      <AppContainerLogs />
      <AppOpenLogFile />
    </>
  )
}

export default React.memo(AppCompilationContent)
