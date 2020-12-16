/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import ClearIcon from '@material-ui/icons/Clear'

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import buttonsDisable from './action-buttons-disable'
import { useCompilationContext } from './compilation-context'

import classes from './compilation-page.module.scss'

interface Props {
  hasScripts: boolean
  onClearScripts: () => void
}

export function CompilationPageActions({ hasScripts, onClearScripts }: Props) {
  const { t } = useTranslation()
  const { compilationScripts, hoveringScript } = useCompilationContext()

  const onClickEmpty = useCallback(() => {
    onClearScripts()
  }, [onClearScripts])

  return (
    <Fade
      in={
        compilationScripts.length >= 1 &&
        !buttonsDisable(compilationScripts, hoveringScript)
      }
    >
      <Fab
        className={classes.fabsActions}
        onClick={onClickEmpty}
        variant="extended"
        disabled={!hasScripts}
      >
        <ClearIcon className={classes.fabsActionsIcon} />{' '}
        {t('page.compilation.actions.clearList')}
      </Fab>
    </Fade>
  )
}
