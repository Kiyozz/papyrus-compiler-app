/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import DeleteIcon from '@material-ui/icons/Delete'

import React, { useCallback } from 'react'

import { ScriptModel } from '../../models'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'

interface Props {
  script: ScriptModel
  onClickRemoveScript: (script: ScriptModel) => void
}

export function ScriptItem({ script, onClickRemoveScript }: Props) {
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
        <div
          className={`ml-auto font-sm italic ${getClassNameFromStatus(script)}`}
        >
          {getIconFromStatus(script)}
        </div>
      </div>
      <button
        className="btn-icon btn-danger"
        aria-label="delete"
        onClick={onClickRemove}
      >
        <div className="icon">
          <DeleteIcon />
        </div>
      </button>
    </div>
  )
}
