/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import React from 'react'
import { useTranslation } from 'react-i18next'
import buttonsDisable from './action-buttons-disable'
import { useCompilationContext } from './compilation-context'
import classes from './compilation-page.module.scss'

interface Props {
  onClick: () => void
}

const PlayButton: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslation()
  const {
    isCompilationRunning,
    compilationScripts,
    hoveringScript
  } = useCompilationContext()

  const Icon: React.FC<{ className: string }> = ({ className }) => {
    if (isCompilationRunning) {
      return <CircularProgress size={18} className={className} />
    }

    return <PlayIcon className={className} />
  }

  return (
    <Fade in={!buttonsDisable(compilationScripts, hoveringScript)}>
      <Fab
        variant="extended"
        color="secondary"
        onClick={onClick}
        disabled={compilationScripts.length === 0 || isCompilationRunning}
      >
        <Icon className={classes.fabIcon} />{' '}
        {t('page.compilation.actions.start')}
      </Fab>
    </Fade>
  )
}

export default PlayButton
