/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import { IconButton } from '@mui/material'
import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptRenderer } from '../../types'
import { iconFromStatus } from '../../utils/scripts/from-status'
import { isRunningScript } from '../../utils/scripts/status'

interface Props {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

const ScriptLine = ({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: Props) => {
  const { t } = useTranslation()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  return (
    <div className="flex select-none gap-2 text-current dark:text-white">
      <div
        className="paper relative flex w-full overflow-hidden"
        aria-label="script"
      >
        <div>{script.name}</div>
        <div className={cx('font-sm ml-auto flex')}>
          {iconFromStatus(script)}
        </div>
        <IconButton
          onClick={onClickPlay}
          size="small"
          disabled={isRunningScript(script)}
          className="ml-1.5 p-0"
        >
          <PlayCircleIcon className="text-primary-400" />
        </IconButton>
      </div>
      <IconButton
        color="error"
        aria-label={t('common.remove')}
        disabled={isRunningScript(script)}
        aria-disabled={isRunningScript(script)}
        onClick={onClickRemove}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </div>
  )
}

export default ScriptLine
