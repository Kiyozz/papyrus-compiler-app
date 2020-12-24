/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import ClearIcon from '@material-ui/icons/Clear'

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useCompilationContext } from './compilation-context'

interface Props {
  hasScripts: boolean
  onClearScripts: () => void
}

export function CompilationPageActions({ hasScripts, onClearScripts }: Props) {
  const { t } = useTranslation()
  const { isCompilationRunning } = useCompilationContext()

  const onClickEmpty = useCallback(() => {
    onClearScripts()
  }, [onClearScripts])

  return (
    <button
      className="btn btn-secondary"
      onClick={onClickEmpty}
      disabled={isCompilationRunning || !hasScripts}
    >
      <ClearIcon className="mr-2" /> {t('page.compilation.actions.clearList')}
    </button>
  )
}
