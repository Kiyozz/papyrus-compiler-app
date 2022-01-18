/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import React, { useCallback } from 'react'

import { useCompilation } from '../../hooks/use-compilation'
import { ScriptRenderer } from '../../types'
import {
  getClassNameFromStatus,
  getIconFromStatus,
} from '../../utils/scripts/from-status'

interface Props {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
}

const ScriptItem = ({ script, onClickRemoveScript }: Props) => {
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

export default ScriptItem
