/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useCompilation } from '../../hooks/use-compilation'

interface Props {
  onClick: () => void
}

export function PlayButton({ onClick }: Props): JSX.Element {
  const { t } = useTranslation()
  const { isRunning, scripts } = useCompilation()

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
      disabled={scripts.length === 0 || isRunning}
    >
      <div className="icon">
        <Icon />
      </div>{' '}
      {t('page.compilation.actions.start')}
    </button>
  )
}
