/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import DeleteIcon from '@material-ui/icons/Delete'

import React, { useCallback } from 'react'

import { ScriptInterface } from '../../interfaces'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'
import { useCompilation } from '../../hooks/use-compilation'

interface Props {
  script: ScriptInterface
  onClickRemoveScript: (script: ScriptInterface) => void
}

export function ScriptItem({ script, onClickRemoveScript }: Props) {
  const { isRunning } = useCompilation()
  const onClickRemove = useCallback(() => {
    onClickRemoveScript(script)
  }, [script, onClickRemoveScript])

  return (
    <div className="flex gap-2 select-none">
      <div
        className="relative w-full flex paper overflow-hidden"
        aria-label="script"
      >
        <div>{script.name}</div>
        <div className={`ml-auto font-sm ${getClassNameFromStatus(script)}`}>
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
          <DeleteIcon />
        </div>
      </button>
    </div>
  )
}
