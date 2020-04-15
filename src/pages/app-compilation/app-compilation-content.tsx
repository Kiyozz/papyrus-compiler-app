import React, { useMemo } from 'react'
import { CSSTransition } from 'react-transition-group'
import { ScriptModel } from '../../models'
import AppCompilationScriptItem from './app-compilation-script-item'
import { useCompilationContext } from './compilation-context'

interface Props {
  isDragActive: boolean
  Button: JSX.Element
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
}

const AppCompilationContent: React.FC<Props> = ({ isDragActive, onClickRemoveScriptFromScript, createOnMouseEvent, Button }) => {
  const { popupOpen, compilationScripts, hoveringScript } = useCompilationContext()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return compilationScripts.map((script) => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)
      const onMouseMoveScript = createOnMouseEvent(script)

      return (
        <AppCompilationScriptItem
          key={script.id}
          hovering={hoveringScript === script}
          onClickRemoveScript={onClickRemoveScriptFromScript(script)}
          onMouseEnter={onMouseEnterScript}
          onMouseLeave={onMouseLeaveScript}
          onMouseMove={onMouseMoveScript}
          script={script}
        />
      )
    })
  }, [compilationScripts, createOnMouseEvent, hoveringScript, onClickRemoveScriptFromScript])

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
            scriptsList
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

      {Button}
    </>
  )
}

export default React.memo(AppCompilationContent)
