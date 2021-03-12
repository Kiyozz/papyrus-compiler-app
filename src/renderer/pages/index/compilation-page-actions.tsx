/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ClearIcon from '@material-ui/icons/Clear'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useCompilation } from '../../hooks/use-compilation'

interface Props {
  onClearScripts: () => void
}

export function CompilationPageActions({ onClearScripts }: Props): JSX.Element {
  const { t } = useTranslation()
  const { isRunning, scripts } = useCompilation()

  const onClickEmpty = useCallback(() => {
    onClearScripts()
  }, [onClearScripts])

  return (
    <button
      className="btn btn-secondary"
      onClick={onClickEmpty}
      disabled={isRunning || scripts.length === 0}
    >
      <ClearIcon className="mr-2" /> {t('page.compilation.actions.clearList')}
    </button>
  )
}
