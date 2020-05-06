import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import React from 'react'

import { useCompilationContext } from './compilation-context'
import classes from './compilation-page.module.scss'

interface Props {
  onClickPlayPause: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CompilationPageTitle: React.FC<Props> = ({ onClickPlayPause }) => {
  const { isCompilationRunning, compilationScripts } = useCompilationContext()

  return (
    <div className={classes.actions}>
      <Button
        onClick={onClickPlayPause}
        color="primary"
        aria-label="play"
        variant="contained"
        disabled={isCompilationRunning || compilationScripts.length === 0}
        startIcon={(
          isCompilationRunning ? (
            <CircularProgress size={18} />
          ) : (
            <PlayCircleFilledIcon />
          )
        )}
      >
        Play
      </Button>
    </div>
  )
}

export default CompilationPageTitle
