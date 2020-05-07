import Typography from '@material-ui/core/Typography'

import React, { useMemo } from 'react'

import DropFilesOverlay from '../../components/drop-files-overlay/drop-files-overlay'
import { ScriptModel } from '../../models'
import { useCompilationContext } from './compilation-context'
import CompilationPageActions from './compilation-page-actions'
import PlayButton from './play-button'
import ScriptItem from './script-item'
import classes from './compilation-page.module.scss'

interface Props {
  isDragActive: boolean
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
  onClear: () => void
  onClickPlayPause: () => void
}

const CompilationPageContent: React.FC<Props> = ({ isDragActive, onClear, onClickPlayPause, onClickRemoveScriptFromScript, createOnMouseEvent }) => {
  const { compilationScripts, hoveringScript } = useCompilationContext()

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
        <>
          <Typography variant="body1">
            You can drag and drop psc files to load them into the
            application.
          </Typography>
          <Typography variant="body1">
            This is only available when not running in administrator.
          </Typography>
        </>
      )}

      <CompilationPageActions hasScripts={scriptsList.length > 0} onClearScripts={onClear} />

      <div className={classes.fabs}>
        <PlayButton onClick={onClickPlayPause} />
      </div>
    </>
  )
}

export default CompilationPageContent
