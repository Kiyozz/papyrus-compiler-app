import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'

import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDrop } from '../../hooks/use-drop'

import { GroupModel, ScriptModel } from '../../models'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import uniqScripts from '../../utils/scripts/uniq-scripts'
import GroupsDialogActions from './groups-dialog-actions'
import GroupsDialogList from './groups-dialog-list'
import classes from './groups-dialog.module.scss'

interface Props {
  onGroupAdd: (group: GroupModel) => void
  onGroupEdit: (lastGroupName: string, group: GroupModel) => void
  onClose: () => void
  group?: GroupModel
  open: boolean
}

const GroupsDialog: React.FC<Props> = ({ onGroupAdd, onGroupEdit, open, onClose, group }) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptModel[]>([])
  const [isEdit, setEdit] = useState(false)

  const empty = useCallback(() => {
    setName('')
    setScripts([])
    setEdit(false)
  }, [])

  const onDialogClose = useCallback(() => {
    empty()
    onClose()
  }, [empty, onClose])

  React.useEffect(() => {
    if (!group) {
      empty()

      return
    }

    setName(group.name)
    setScripts(group.scripts)
    setEdit(true)
  }, [group, empty])

  const onClickRemoveScriptFromGroup = useCallback((script: ScriptModel) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()

      setScripts(s => s.filter(scriptFromList => scriptFromList.name !== script.name))
    }
  }, [])

  const onSubmitAddGroup = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !name.trim()) {
      return
    }

    if (isEdit && group) {
      onGroupEdit(group.name, {
        name: name.trim(),
        scripts
      })

      empty()

      return
    }

    onGroupAdd({
      name: name.trim(),
      scripts
    })

    empty()
  }, [name, isEdit, group, scripts, empty, onGroupAdd, onGroupEdit])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }, [])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(s => uniqScripts([...s, ...pscScripts]))
  }, [])

  const addScriptsButton = useDrop({
    button: (
      <Button startIcon={<SearchIcon />} variant="text" color="secondary">{t('page.groups.dialog.searchScripts')}</Button>
    ),
    onDrop
  })

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      aria-labelledby="create-group-title"
    >
      <DialogTitle id="create-group-title">{isEdit ? t('page.groups.dialog.editGroup') : t('page.groups.dialog.createGroup')}</DialogTitle>
      <form onSubmit={onSubmitAddGroup}>
        <DialogContent className={classes.scriptsContent}>
          <TextField
            fullWidth
            label={t('page.groups.dialog.name')}
            name="group-name"
            id="group-name"
            value={name}
            onChange={onChangeName}
          />
          <div className={classes.content}>
            {scripts.length > 0 ? (
              <GroupsDialogList
                scripts={scripts}
                onClickRemoveScriptFromGroup={onClickRemoveScriptFromGroup}
              />
            ) : (
              <DialogContentText>
                {t('page.groups.dialog.dropScripts')}
              </DialogContentText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <GroupsDialogActions AddScriptsButton={addScriptsButton} onClose={onClose} isEdit={isEdit} />
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default GroupsDialog
