/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import React from 'react'

import { ScriptRenderer } from '../../types'

type Props = {
  scripts: ScriptRenderer[]
  onClickRemoveScriptFromGroup: (
    script: ScriptRenderer,
  ) => (e: React.MouseEvent) => void
}

const GroupsDialogList = ({ scripts, onClickRemoveScriptFromGroup }: Props) => (
  <ul className="flex flex-col flex-grow">
    {scripts.map(script => (
      <li
        className="flex items-center dark:text-white text-sm"
        key={script.name}
      >
        <div className="w-full">{script.name}</div>
        <button
          className="btn-icon btn-danger !p-0.5"
          type="button"
          aria-label="delete"
          onClick={onClickRemoveScriptFromGroup(script)}
        >
          <DeleteOutlinedIcon color="error" fontSize="small" />
        </button>
      </li>
    ))}
  </ul>
)

export default GroupsDialogList
