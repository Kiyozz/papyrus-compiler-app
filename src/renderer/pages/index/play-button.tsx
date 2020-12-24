/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCompilationContext } from './compilation-context'

interface Props {
  onClick: () => void
}

export function PlayButton({ onClick }: Props) {
  const { t } = useTranslation()
  const { isCompilationRunning, compilationScripts } = useCompilationContext()

  const Icon = useMemo(
    () =>
      function IconInPlayButton({ className }: { className?: string }) {
        return <PlayIcon className={className} />
      },
    []
  )

  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
      disabled={compilationScripts.length === 0 || isCompilationRunning}
    >
      <div className="icon">
        <Icon />
      </div>{' '}
      {t('page.compilation.actions.start')}
    </button>
  )
}
