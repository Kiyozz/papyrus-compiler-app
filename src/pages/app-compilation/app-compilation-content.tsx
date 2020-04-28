import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import Fade from '@material-ui/core/Fade'
import { ScriptModel } from '../../models'
import AppCompilationActions from './app-compilation-actions'
import AppCompilationScriptItem from './app-compilation-script-item'
import { useCompilationContext } from './compilation-context'

interface Props {
  isDragActive: boolean
  Button: JSX.Element
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
  onClear: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonWrapper: {
    marginTop: theme.spacing(1)
  }
}))

const AppCompilationContent: React.FC<Props> = ({ isDragActive, onClear, onClickRemoveScriptFromScript, createOnMouseEvent, Button }) => {
  const classes = useStyles()
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
      <Fade
        in={isDragActive}
        mountOnEnter
        unmountOnExit
      >
        <div className="app-compilation-is-dragging-container">
          Drop files here...
        </div>
      </Fade>

      <Fade in={scriptsList.length > 0}>
        <div className="app-compilation-scripts-list">
          {scriptsList}
        </div>
      </Fade>

      <Fade in={scriptsList.length === 0} mountOnEnter unmountOnExit>
        <p className="text-secondary text-wrap">
          You can drag and drop psc files to load them into the
          application.

          <br />

          This is only available when not running in administrator.
        </p>
      </Fade>

      <AppCompilationActions hasScripts={scriptsList.length > 0} onClearScripts={onClear} />

      <Box className={classes.buttonWrapper}>
        {Button}
      </Box>
    </>
  )
}

export default React.memo(AppCompilationContent)
