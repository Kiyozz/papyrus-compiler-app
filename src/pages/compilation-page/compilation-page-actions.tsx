import Fade from '@material-ui/core/Fade'
import Fab from '@material-ui/core/Fab'
import ClearIcon from '@material-ui/icons/Clear'

import React from 'react'
import { useCompilationContext } from './compilation-context'

import classes from './compilation-page.module.scss'

interface Props {
  hasScripts: boolean
  onClearScripts: () => void
}

const CompilationPageActions: React.FC<Props> = ({ hasScripts, onClearScripts }) => {
  const { compilationScripts } = useCompilationContext()

  const onClickEmpty = () => {
    onClearScripts()
  }

  return (
    <Fade in={compilationScripts.length >= 3}>
      <Fab
        className={classes.fabsActions}
        onClick={onClickEmpty}
        variant="extended"
        color="secondary"
        disabled={!hasScripts}
      >
        <ClearIcon className={classes.fabsActionsIcon} /> Clear list
      </Fab>
    </Fade>
  )
}

export default CompilationPageActions
