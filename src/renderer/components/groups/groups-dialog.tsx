/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import SearchIcon from '@material-ui/icons/Search'
import is from '@sindresorhus/is'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvents } from '../../../common/telemetry-events'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { GroupInterface, ScriptInterface } from '../../interfaces'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import { Dialog } from '../dialog/dialog'
import { TextField } from '../text-field'
import { GroupsDialogList } from './groups-dialog-list'

interface Props {
  onGroupAdd: (group: GroupInterface) => void
  onGroupEdit: (lastGroupName: string, group: GroupInterface) => void
  onClose: () => void
  group?: GroupInterface
  open: boolean
}

export function GroupsDialog({
  onGroupAdd,
  onGroupEdit,
  open,
  onClose,
  group,
}: Props): JSX.Element {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptInterface[]>([])
  const [isEdit, setEdit] = useState(false)
  const { send } = useTelemetry()
  const { drop } = useDrop()

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

  const onClickRemoveScriptFromGroup = useCallback(
    (script: ScriptInterface) => {
      return () => {
        setScripts(s =>
          s.filter(scriptFromList => scriptFromList.name !== script.name),
        )
      }
    },
    [],
  )

  const onSubmitGroup = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!name || !name.trim()) {
        return
      }

      if (isEdit && group) {
        onGroupEdit(group.name, {
          name: name.trim(),
          scripts,
        })

        return
      }

      onGroupAdd({
        name: name.trim(),
        scripts,
      })
    },
    [name, isEdit, group, scripts, onGroupAdd, onGroupEdit],
  )

  const onChangeName = useCallback((e: string | number) => {
    if (is.string(e)) {
      setName(e)
    }
  }, [])

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts = pscFilesToPscScripts(pscFiles)

      send(TelemetryEvents.groupDropScripts, { scripts: pscScripts.length })
      setScripts(s => uniqScripts([...s, ...pscScripts]))
    },
    [send],
  )

  useSetDrop(onDrop)

  const dialogContent = useCallback(
    ({ children }: React.PropsWithChildren<unknown>) => (
      <form onSubmit={onSubmitGroup}>{children}</form>
    ),
    [onSubmitGroup],
  )

  return (
    <Dialog
      open={open}
      maxWidth={80}
      onClose={onDialogClose}
      actions={
        <>
          <div className="mr-auto">
            <button type="button" className="btn" onClick={drop}>
              <div className="icon">
                <SearchIcon />
              </div>
              {t('page.compilation.actions.searchScripts')}
            </button>
          </div>
          <button className="btn" type="button" onClick={onClose}>
            {t('page.groups.dialog.close')}
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={name === ''}
          >
            {isEdit
              ? t('page.groups.actions.edit')
              : t('page.groups.actions.create')}
          </button>
        </>
      }
      title={
        isEdit
          ? t('page.groups.dialog.editGroup')
          : t('page.groups.dialog.createGroup')
      }
      content={dialogContent}
    >
      <TextField
        label={t('page.groups.dialog.name')}
        name="group-name"
        id="group-name"
        autoFocus
        value={name}
        onChange={onChangeName}
      />
      <div className="paper paper-darker overflow-overlay max-h-36 h-full mt-4 outline-none">
        {scripts.length > 0 ? (
          <GroupsDialogList
            scripts={scripts}
            onClickRemoveScriptFromGroup={onClickRemoveScriptFromGroup}
          />
        ) : (
          <p className="dark:text-gray-400">
            {t('page.groups.dialog.dropScripts')}
          </p>
        )}
      </div>
    </Dialog>
  )
}
