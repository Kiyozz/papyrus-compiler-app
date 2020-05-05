import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'

import uniqBy from 'lodash-es/uniqBy'
import React from 'react'

import { GroupModel, ScriptModel } from '../../models'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import AppAddScripts from '../app-add-scripts/app-add-scripts'
import DropFilesOverlay from '../drop-files-overlay/drop-files-overlay'
import AppGroupsAddPopupActions from './app-groups-add-popup-actions'
import AppGroupsAddPopupScripts from './app-groups-add-popup-scripts'
import classes from './groups-dialog.module.scss'

interface Props {
  onGroupAdd: (group: GroupModel) => void
  onGroupEdit: (lastGroupName: string, group: GroupModel) => void
  onClose: () => void
  group?: GroupModel
  open: boolean
}

const AppGroupsAddPopup: React.FC<Props> = ({ onGroupAdd, onGroupEdit, open, onClose, group }) => {
  const [name, setName] = React.useState('')
  const [scripts, setScripts] = React.useState<ScriptModel[]>([])
  const [isEdit, setEdit] = React.useState(false)

  React.useEffect(() => {
    if (!group) {
      return
    }

    setName(group.name)
    setScripts(group.scripts)
    setEdit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      return
    }

    onGroupAdd({
      name: name.trim(),
      scripts
    })
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }

  const onDrop = (pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(uniqBy([...scripts, ...pscScripts], 'name'))
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="create-group-title"
    >
      <AppAddScripts
        onDrop={onDrop}
        accept=".psc"
        onlyClickButton
        Button={<Button startIcon={<SearchIcon />} variant="text" color="secondary">Search scripts</Button>}
      >
        {({ Button, isDragActive }) => (
          <>
            <DropFilesOverlay open={isDragActive} />

            <DialogTitle id="create-group-title">Create a new group</DialogTitle>
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
                    <AppGroupsAddPopupScripts
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
                <AppGroupsAddPopupActions AddScriptsButton={Button} onClose={onClose} isEdit={isEdit} />
              </DialogActions>
            </form>
          </>
        )}
      </AppAddScripts>
    </Dialog>
  )
}

export default AppGroupsAddPopup
