/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import buttonsDisable from './action-buttons-disable'
import { useCompilationContext } from './compilation-context'
import classes from './compilation-page.module.scss'

interface Props {
  onClick: () => void
}

export function PlayButton({ onClick }: Props) {
  const { t } = useTranslation()
  const {
    isCompilationRunning,
    compilationScripts,
    hoveringScript
  } = useCompilationContext()

  const Icon = useMemo(
    () =>
      function IconInPlayButton({ className }: { className: string }) {
        if (isCompilationRunning) {
          return <CircularProgress size={18} className={className} />
        }

        return <PlayIcon className={className} />
      },
    [isCompilationRunning]
  )

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
