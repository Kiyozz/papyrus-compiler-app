import React, { useMemo } from 'react'

import DropFilesOverlay from '../../components/drop-files-overlay/drop-files-overlay'
import { ScriptModel } from '../../models'
import { useCompilationContext } from './compilation-context'
import CompilationPageActions from './compilation-page-actions'
import GroupsLoader from './groups-loader'
import ScriptItem from './script-item'
import classes from './compilation-page.module.scss'

interface Props {
  isDragActive: boolean
  AddScriptsButton: JSX.Element
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
  onClear: () => void
  onChangeGroup: (groupName: string) => void
}

const CompilationPageContent: React.FC<Props> = ({ isDragActive, onClear, onChangeGroup, onClickRemoveScriptFromScript, createOnMouseEvent, AddScriptsButton }) => {
  const { compilationScripts, hoveringScript, groups } = useCompilationContext()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return compilationScripts.map((script) => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)
      const onMouseMoveScript = createOnMouseEvent(script)

      return (
        <ScriptItem
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

      <CompilationPageActions hasScripts={scriptsList.length > 0} onClearScripts={onClear} />


      <div className={classes.fabs}>
        {AddScriptsButton}
        <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
      </div>
    </>
  )
}

export default CompilationPageContent
