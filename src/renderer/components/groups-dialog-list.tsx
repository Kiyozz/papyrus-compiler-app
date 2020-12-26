/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import DeleteIcon from '@material-ui/icons/Delete'

import React from 'react'

import { ScriptModel } from '../models'

interface Props {
  scripts: ScriptModel[]
  onClickRemoveScriptFromGroup: (
    script: ScriptModel
  ) => (e: React.MouseEvent) => void
}

export function GroupsDialogList({
  scripts,
  onClickRemoveScriptFromGroup
}: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {scripts.map((script, index) => (
        <li className="flex items-center text-white" key={script.id + index}>
          <div className="w-full">{script.name}</div>
          <div>
            <button
              className="btn-icon btn-danger"
              type="button"
              aria-label="delete"
              onClick={onClickRemoveScriptFromGroup(script)}
            >
              <DeleteIcon color="error" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
