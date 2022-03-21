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
import { useDrop, useSetDrop } from '../../hooks/use-drop'
import { useTelemetry } from '../../hooks/use-telemetry'
import { GroupRenderer, ScriptRenderer } from '../../types'
import { pscFilesToScript } from '../../utils/scripts/psc-files-to-script'
import { uniqScripts } from '../../utils/scripts/uniq-scripts'

type Props = {
  onGroupAdd: (group: GroupRenderer) => void
  onGroupEdit: (lastGroupName: string, group: GroupRenderer) => void
  onClose: () => void
  group?: GroupRenderer
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
  const [scripts, setScripts] = useState<ScriptRenderer[]>([])
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

  const onClickRemoveScriptFromGroup = (script: ScriptRenderer) => {
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
      scroll="body"
      fullWidth
      maxWidth="xl"
      aria-describedby="group-content"
      className="overflow-overlay"
    >
      <form onSubmit={onSubmitGroup}>
        <DialogContent id="group-content">
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
        </DialogContent>
        <div
          className={cx(
            scripts.length === 0 && 'flex items-center justify-center',
          )}
        >
          {scripts.length > 0 ? (
            <List className="overflow-x-hidden">
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
        </div>
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
