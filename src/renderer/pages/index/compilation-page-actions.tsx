/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import ClearIcon from '@material-ui/icons/Clear'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useCompilation } from '../../hooks/use-compilation'
import { useTelemetry } from '../../hooks/use-telemetry'

interface Props {
  onClearScripts: () => void
}

export function CompilationPageActions({ onClearScripts }: Props): JSX.Element {
  const { t } = useTranslation()
  const { isRunning, scripts } = useCompilation()
  const { send } = useTelemetry()

  const onClickEmpty = useCallback(() => {
    send(TelemetryEvents.CompilationListEmpty, { scripts: scripts.length })
    onClearScripts()
  }, [onClearScripts, send, scripts])

  return (
    <button
      className="btn"
      onClick={onClickEmpty}
      disabled={isRunning || scripts.length === 0}
    >
      <ClearIcon className="mr-2" /> {t('page.compilation.actions.clearList')}
    </button>
  )
}
