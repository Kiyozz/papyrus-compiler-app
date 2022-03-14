/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import SearchIcon from '@mui/icons-material/Search'
import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { GroupRenderer, ScriptRenderer } from '../../types'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import Dialog, { CloseReason } from '../dialog/dialog'
import Paper from '../paper'
import TextField from '../text-field'
import GroupsDialogList from './groups-dialog-list'

type Props = {
  onGroupAdd: (group: GroupRenderer) => void
  onGroupEdit: (lastGroupName: string, group: GroupRenderer) => void
  onClose: () => void
  group?: GroupRenderer
  open: boolean
}

const GroupsDialog = ({
  onGroupAdd,
  onGroupEdit,
  open,
  onClose,
  group,
}: Props) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptRenderer[]>([])
  const [isEdit, setEdit] = useState(false)
  const { send } = useTelemetry()
  const { drop } = useDrop()
  const isValid = useCallback(() => name.trim().length > 0, [name])

  const onSubmitGroup = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()

      if (!isValid()) {
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
    [name, isEdit, group, scripts, onGroupAdd, onGroupEdit, isValid],
  )

  const onDialogClose = useCallback(
    (reason: CloseReason) => {
      if (reason === CloseReason.enter && isValid()) {
        send(TelemetryEvent.groupCloseWithEnter, {})
        onSubmitGroup()
      } else {
        onClose()
      }
    },
    [isValid, send, onSubmitGroup, onClose],
  )

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

  const onClickRemoveScriptFromGroup = useCallback((script: ScriptRenderer) => {
    return () => {
      setScripts(s =>
        s.filter(scriptFromList => scriptFromList.name !== script.name),
      )
    }
  }, [])

  const onChangeName = useCallback((e: string | number) => {
    if (is.string(e)) {
      setName(e)
    }
  }, [])

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts = pscFilesToPscScripts(pscFiles)

      send(TelemetryEvent.groupDropScripts, { scripts: pscScripts.length })
      setScripts(s => uniqScripts([...s, ...pscScripts]))
    },
    [send],
  )

  useSetDrop(onDrop)

  const dialogContent = useCallback(
    ({ children }: React.PropsWithChildren<unknown>) => (
      <form
        onSubmit={onSubmitGroup}
        className="flex h-screen flex-col overflow-hidden"
      >
        {children}
      </form>
    ),
    [onSubmitGroup],
  )

  return (
    <Dialog
      open={open}
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
            {t('common.cancel')}
          </button>
          <button className="btn" type="submit" disabled={name === ''}>
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
      contentClassNames={{ child: 'flex flex-col h-full' }}
    >
      <TextField
        label={t('page.groups.dialog.name')}
        name="group-name"
        id="group-name"
        autoFocus
        value={name}
        onChange={onChangeName}
      />
      <Paper
        darker
        className={cx(
          'overflow-overlay mt-4 h-full outline-none',
          scripts.length === 0 && 'flex items-center justify-center',
        )}
      >
        {scripts.length > 0 ? (
          <GroupsDialogList
            scripts={scripts}
            onClickRemoveScriptFromGroup={onClickRemoveScriptFromGroup}
          />
        ) : (
          <p className="text-center dark:text-gray-400">
            {t('page.groups.dialog.dropScripts')}
          </p>
        )}
      </Paper>
    </Dialog>
  )
}

export default GroupsDialog
