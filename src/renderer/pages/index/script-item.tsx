/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import React, { useCallback } from 'react'

import { useCompilation } from '../../hooks/use-compilation'
import { ScriptInterface } from '../../interfaces'
import {
  getClassNameFromStatus,
  getIconFromStatus,
} from '../../utils/scripts/from-status'

interface Props {
  script: ScriptInterface
  onClickRemoveScript: (script: ScriptInterface) => void
}

export function ScriptItem({
  script,
  onClickRemoveScript,
}: Props): JSX.Element {
  const { isRunning } = useCompilation()
  const onClickRemove = useCallback(() => {
    onClickRemoveScript(script)
  }, [script, onClickRemoveScript])

  return (
    <div className="flex gap-2 select-none text-current dark:text-white">
      <div
        className="relative w-full flex paper overflow-hidden"
        aria-label="script"
      >
        <div>{script.name}</div>
        <div
          className={`ml-auto font-sm flex ${getClassNameFromStatus(script)}`}
        >
          {getIconFromStatus(script)}
        </div>
      </div>
      <button
        className="btn-icon btn-danger"
        aria-label="delete"
        disabled={isRunning}
        onClick={onClickRemove}
      >
        <div className="icon">
          <DeleteOutlinedIcon />
        </div>
      </button>
    </div>
  )
}
