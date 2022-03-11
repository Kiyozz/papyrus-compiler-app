/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import { IconButton } from '@mui/material'
import cx from 'classnames'
import React, { useCallback } from 'react'

import { ScriptRenderer } from '../../types'
import {
  classNameFromStatus,
  iconFromStatus,
} from '../../utils/scripts/from-status'
import { isRunningScript } from '../../utils/scripts/status'

interface Props {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

const ScriptItem = ({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: Props) => {
  const onClickRemove = useCallback(() => {
    onClickRemoveScript(script)
  }, [script, onClickRemoveScript])

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  return (
    <div className="flex gap-2 select-none text-current dark:text-white">
      <div
        className="relative w-full flex paper overflow-hidden"
        aria-label="script"
      >
        <div>{script.name}</div>
        <div
          className={cx('ml-auto font-sm flex', classNameFromStatus(script))}
        >
          {iconFromStatus(script)}
        </div>
        <IconButton
          onClick={onClickPlay}
          size="small"
          disabled={isRunningScript(script)}
          classes={{
            root: 'p-0 ml-1.5',
          }}
        >
          <PlayCircleIcon className="text-primary-400" />
        </IconButton>
      </div>
      <button
        className="btn-icon btn-danger"
        aria-label="delete"
        disabled={isRunningScript(script)}
        onClick={onClickRemove}
      >
        <div className="icon">
          <DeleteOutlinedIcon />
        </div>
      </button>
    </div>
  )
}

export default ScriptItem
