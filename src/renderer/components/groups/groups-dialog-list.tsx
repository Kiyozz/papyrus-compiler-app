/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import React from 'react'

import { ScriptInterface } from '../../interfaces'

interface Props {
  scripts: ScriptInterface[]
  onClickRemoveScriptFromGroup: (
    script: ScriptInterface,
  ) => (e: React.MouseEvent) => void
}

export function GroupsDialogList({
  scripts,
  onClickRemoveScriptFromGroup,
}: Props): JSX.Element {
  return (
    <ul className="flex flex-col flex-grow">
      {scripts.map((script, index) => (
        <li
          className="flex items-center dark:text-white text-sm"
          key={script.id + index}
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
}
