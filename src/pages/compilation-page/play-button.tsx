import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import React from 'react'
import buttonsDisable from './action-buttons-disable'
import { useCompilationContext } from './compilation-context'
import classes from './compilation-page.module.scss'

interface Props {
  onClick: () => void
}

const PlayButton: React.FC<Props> = ({ onClick }) => {
  const { isCompilationRunning, compilationScripts, hoveringScript } = useCompilationContext()

  const Icon: React.FC<{ className: string }> = ({ className }) => {
    if (isCompilationRunning) {
      return (
        <CircularProgress size={18} className={className} />
      )
    }

    return (
      <PlayIcon className={className} />
    )
  }

  return (
    <Fade in={!buttonsDisable(compilationScripts, hoveringScript)}>
      <Fab
        variant="extended"
        color="primary"
        onClick={onClick}
        disabled={compilationScripts.length === 0 || isCompilationRunning}
      >
        <Icon className={classes.fabIcon} /> Start
      </Fab>
    </Fade>
  )
}

export default PlayButton
