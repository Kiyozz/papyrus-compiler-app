/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material'
import is from '@sindresorhus/is'
import cx from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { Group } from '../../types'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'
import type { Script } from '../../../common/types/script'
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react'

interface DialogGroupProps {
  onGroupAdd: (group: Group) => void
  onGroupEdit: (lastGroupName: string, group: Group) => void
  onClose: () => void
  group?: Group
  open: boolean
}

function DialogGroup({
  onGroupAdd,
  onGroupEdit,
  open: isOpen,
  onClose,
  group,
}: DialogGroupProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<Script[]>([])
  const [isEdit, setEdit] = useState(false)
  const { send } = useTelemetry()
  const { drop, isFileDialogActive } = useDrop()
  const isValid = is.nonEmptyStringAndNotWhitespace(name)

  const onSubmitGroup = (e?: FormEvent) => {
    e?.preventDefault()

    if (!isValid) {
      return
    }

    if (isEdit && group) {
      onGroupEdit(group.name, new Group(name.trim(), scripts))

      return
    }

    onGroupAdd(new Group(name.trim(), scripts))
  }

  const onDialogClose = () => {
    onClose()
  }

  const onDialogKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && isValid) {
      send(TelemetryEvent.groupCloseWithEnter, {})
      onSubmitGroup()
    }
  }

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen, group])

  const onClickRemoveScriptFromGroup = (script: Script) => {
    return () => {
      setScripts(s =>
        s.filter(scriptFromList => scriptFromList.name !== script.name),
      )
    }
  }

  const onChangeName = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value

    if (is.string(value)) {
      setName(value)
    }
  }

  const onDrop = useCallback(
    (pscFiles: File[]) => {
      const pscScripts = pscFilesToScript(pscFiles)

      send(TelemetryEvent.groupDropScripts, { scripts: pscScripts.length })
      setScripts(s => uniqScripts([...s, ...pscScripts]))
    },
    [send],
  )

  useSetDrop(onDrop)

  return (
    <Dialog
      aria-describedby="group-content"
      className="overflow-overlay"
      fullScreen
      onClose={onDialogClose}
      onKeyDown={onDialogKeyDown}
      open={isOpen}
    >
      <form className="flex min-h-full flex-col" onSubmit={onSubmitGroup}>
        <DialogTitle>
          <TextField
            autoFocus
            fullWidth
            id="group-name"
            name="group-name"
            onChange={onChangeName}
            placeholder={t('page.groups.dialog.name')}
            size="small"
            value={name}
          />
        </DialogTitle>
        <DialogContent
          className={cx(
            'px-0',
            scripts.length === 0 && 'flex items-center justify-center',
          )}
          dividers
          id="group-content"
        >
          {scripts.length > 0 ? (
            <List className="overflow-x-hidden" disablePadding>
              {scripts.map(script => (
                <ListItem
                  disablePadding
                  key={script.name}
                  secondaryAction={
                    <IconButton
                      aria-label={t('common.remove')}
                      onClick={onClickRemoveScriptFromGroup(script)}
                      size="small"
                    >
                      <DeleteOutlinedIcon color="error" fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    className="cursor-default"
                    disableRipple
                    role="listitem"
                  >
                    <ListItemText primary={script.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <DialogContentText className="py-12">
              {t('page.groups.dialog.dropScripts')}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            aria-disabled={isFileDialogActive}
            className="mr-auto"
            disabled={isFileDialogActive}
            onClick={drop}
            startIcon={<SearchIcon />}
          >
            {t('page.compilation.actions.searchScripts')}
          </Button>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button aria-disabled={!isValid} disabled={!isValid} type="submit">
            {isEdit
              ? t('page.groups.actions.edit')
              : t('page.groups.actions.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DialogGroup
