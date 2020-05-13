import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'

import uniqBy from 'lodash-es/uniqBy'
import React from 'react'
import { useDrop } from '../../hooks/use-drop'

import { GroupModel, ScriptModel } from '../../models'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
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
  const [name, setName] = React.useState('')
  const [scripts, setScripts] = React.useState<ScriptModel[]>([])
  const [isEdit, setEdit] = React.useState(false)

  const onDialogClose = () => {
    empty()
    onClose()
  }

  React.useEffect(() => {
    if (!group) {
      empty()

      return
    }

    setName(group.name)
    setScripts(group.scripts)
    setEdit(true)
  }, [group])

  const empty = () => {
    setName('')
    setScripts([])
    setEdit(false)
  }

  const onClickRemoveScriptFromGroup = (script: ScriptModel) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()

      setScripts(scripts.filter(scriptFromList => scriptFromList.name !== script.name))
    }
  }

  const onSubmitAddGroup = (e: React.FormEvent) => {
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
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }

  const onDrop = (pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(uniqBy([...scripts, ...pscScripts], 'name'))
  }

  const addScriptsButton = useDrop({
    button: (
      <Button startIcon={<SearchIcon />} variant="text" color="secondary">Search scripts</Button>
    ),
    onDrop
  })

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      aria-labelledby="create-group-title"
    >
      {/*<DropScripts*/}
      {/*  onDrop={onDrop}*/}
      {/*  accept=".psc"*/}
      {/*  onlyClickButton*/}
      {/*  Button={<Button startIcon={<SearchIcon />} variant="text" color="secondary">Search scripts</Button>}*/}
      {/*>*/}
      {/*  {({ Button, isDragActive }) => (*/}
      {/*    <>*/}
      {/*      */}
      {/*    </>*/}
      {/*  )}*/}
      {/*</DropScripts>*/}

      <DialogTitle id="create-group-title">{isEdit ? 'Edit a group' : 'Create a new group'}</DialogTitle>
      <form onSubmit={onSubmitAddGroup}>
        <DialogContent className={classes.scriptsContent}>
          <TextField
            fullWidth
            label="Name"
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
                Drop your scripts files here
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
