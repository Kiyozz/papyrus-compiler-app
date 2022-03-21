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
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  KeyboardEvent,
  FormEvent,
} from 'react'
import { useTranslation } from 'react-i18next'

import { TelemetryEvent } from '../../../common/telemetry-event'
import { Script } from '../../../common/types/script'
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { Group } from '../../types'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'

type Props = {
  onGroupAdd: (group: Group) => void
  onGroupEdit: (lastGroupName: string, group: Group) => void
  onClose: () => void
  group?: Group
  open: boolean
}

const DialogGroup = ({
  onGroupAdd,
  onGroupEdit,
  open: isOpen,
  onClose,
  group,
}: Props) => {
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
      open={isOpen}
      onClose={onDialogClose}
      onKeyDown={onDialogKeyDown}
      fullScreen
      aria-describedby="group-content"
      className="overflow-overlay"
    >
      <form onSubmit={onSubmitGroup} className="flex min-h-full flex-col">
        <DialogTitle>
          <TextField
            placeholder={t('page.groups.dialog.name')}
            name="group-name"
            id="group-name"
            autoFocus
            value={name}
            onChange={onChangeName}
            fullWidth
            size="small"
          />
        </DialogTitle>
        <DialogContent
          id="group-content"
          className={cx(
            'px-0',
            scripts.length === 0 && 'flex items-center justify-center',
          )}
          dividers
        >
          {scripts.length > 0 ? (
            <List className="overflow-x-hidden" disablePadding>
              {scripts.map(script => (
                <ListItem
                  key={script.name}
                  disablePadding
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
                    role="listitem"
                    disableRipple
                    className="cursor-default"
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
            className="mr-auto"
            onClick={drop}
            startIcon={<SearchIcon />}
            disabled={isFileDialogActive}
            aria-disabled={isFileDialogActive}
          >
            {t('page.compilation.actions.searchScripts')}
          </Button>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" aria-disabled={!isValid} disabled={!isValid}>
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
