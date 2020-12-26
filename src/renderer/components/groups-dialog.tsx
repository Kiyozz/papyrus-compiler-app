/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import SearchIcon from '@material-ui/icons/Search'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDrop } from '../hooks/use-drop'
import { GroupModel, ScriptModel } from '../models'
import { pscFilesToPscScripts } from '../utils/scripts/psc-files-to-psc-scripts'
import uniqScripts from '../utils/scripts/uniq-scripts'
import { GroupsDialogActions } from './groups-dialog-actions'
import { GroupsDialogList } from './groups-dialog-list'
import { TextField } from './text-field'
import { Dialog, DialogTitle, DialogContent, DialogActions } from './dialog'

interface Props {
  onGroupAdd: (group: GroupModel) => void
  onGroupEdit: (lastGroupName: string, group: GroupModel) => void
  onClose: () => void
  group?: GroupModel
  open: boolean
}

export function GroupsDialog({
  onGroupAdd,
  onGroupEdit,
  open,
  onClose,
  group
}: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptModel[]>([])
  const [isEdit, setEdit] = useState(false)

  const onDialogClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      if (!group) {
        setName('')
        setScripts([])
        setEdit(false)

        return
      }

      setName(group.name)
      setScripts(group.scripts)
      setEdit(true)
    }
  }, [open, group])

  const onClickRemoveScriptFromGroup = useCallback((script: ScriptModel) => {
    return () => {
      setScripts(s =>
        s.filter(scriptFromList => scriptFromList.name !== script.name)
      )
    }
  }, [])

  const onSubmitGroup = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!name || !name.trim()) {
        return
      }

      if (isEdit && group) {
        onGroupEdit(group.name, {
          name: name.trim(),
          scripts
        })

        return
      }

      onGroupAdd({
        name: name.trim(),
        scripts
      })
    },
    [name, isEdit, group, scripts, onGroupAdd, onGroupEdit]
  )

  const onChangeName = useCallback((e: string) => {
    setName(e)
  }, [])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(s => uniqScripts([...s, ...pscScripts]))
  }, [])

  const addScriptsButton = useDrop({
    button: (
      <button className="btn" type="button">
        <div className="icon">
          <SearchIcon />
        </div>
        {t('page.groups.dialog.searchScripts')}
      </button>
    ),
    onDrop
  })

  return (
    <Dialog open={open} maxWidth={80} fullWidth onClose={onDialogClose}>
      <DialogTitle>
        {isEdit
          ? t('page.groups.dialog.editGroup')
          : t('page.groups.dialog.createGroup')}
      </DialogTitle>
      <form onSubmit={onSubmitGroup}>
        <DialogContent>
          <TextField
            label={t('page.groups.dialog.name')}
            name="group-name"
            id="group-name"
            autoFocus
            value={name}
            onChange={onChangeName}
          />
          {scripts.length > 0 ? (
            <div className="paper overflow-auto max-h-36 h-full mt-4 outline-none">
              <GroupsDialogList
                scripts={scripts}
                onClickRemoveScriptFromGroup={onClickRemoveScriptFromGroup}
              />
            </div>
          ) : (
            <div className="paper overflow-auto max-h-36 h-full mt-4 outline-none">
              <p className="text-gray-400">
                {t('page.groups.dialog.dropScripts')}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <GroupsDialogActions
            name={name}
            AddScriptsButton={addScriptsButton}
            onClose={onDialogClose}
            isEdit={isEdit}
          />
        </DialogActions>
      </form>
    </Dialog>
  )
}
