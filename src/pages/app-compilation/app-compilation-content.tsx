import React, { useMemo } from 'react'
import DropFilesOverlay from '../../components/drop-files-overlay/drop-files-overlay'

import { ScriptModel } from '../../models'
import AppCompilationActions from './app-compilation-actions'
import AppCompilationScriptItem from './app-compilation-script-item'
import { useCompilationContext } from './compilation-context'

interface Props {
  isDragActive: boolean
  AddScriptsButton: JSX.Element
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
  onClear: () => void
}

const AppCompilationContent: React.FC<Props> = ({ isDragActive, onClear, onClickRemoveScriptFromScript, createOnMouseEvent, AddScriptsButton }) => {
  const { compilationScripts, hoveringScript } = useCompilationContext()

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
      <DropFilesOverlay open={isDragActive} />

      {compilationScripts.length > 0 ? (
        <div className="app-compilation-scripts-list">
          {scriptsList}
        </div>
      ) : (
        <p className="text-secondary text-wrap">
          You can drag and drop psc files to load them into the
          application.

          <br />

          This is only available when not running in administrator.
        </p>
      )}

      <AppCompilationActions hasScripts={scriptsList.length > 0} onClearScripts={onClear} />

      {AddScriptsButton}
    </>
  )
}

export default React.memo(AppCompilationContent)
