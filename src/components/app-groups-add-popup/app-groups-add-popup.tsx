import cx from 'classnames'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './app-groups-add-popup.scss'
import { GroupModel, ScriptModel } from '../../models'
import { useDropzone } from 'react-dropzone'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import uniqBy from 'lodash-es/uniqBy'
import useOnKeyUp from '../../hooks/use-on-key-up'

interface Props {
  onGroupAdd: (group: GroupModel) => void
  onGroupEdit: (lastGroupName: string, group: GroupModel) => void
  onClose: () => void
  group?: GroupModel
  open: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  },
  list: {
    width: '100%'
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  emptyText: {
    width: '100%',
    height: 150
  }
}))

const AppGroupsAddPopup: React.FC<Props> = ({ onGroupAdd, onGroupEdit, open, onClose, group }) => {
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptModel[]>([])
  const popupRef = useRef<HTMLDivElement>(null)
  const [isEdit, setEdit] = useState(false)
  const classes = useStyles()

  useOnKeyUp('Escape', () => {
    onClose()
  })

  useEffect(() => {
    if (!group) {
      return
    }

    setName(group.name)
    setScripts(group.scripts)
    setEdit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickRemoveScriptFromGroup = useCallback((script: ScriptModel) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()

      setScripts(scripts.filter(scriptFromList => scriptFromList.id !== script.id))
    }
  }, [setScripts, scripts])

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

      return
    }

    onGroupAdd({
      name: name.trim(),
      scripts
    })
  }, [name, isEdit, group, onGroupAdd, scripts, onGroupEdit])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    setName(value)
  }, [setName])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(uniqBy([...scripts, ...pscScripts], 'name'))
  }, [setScripts, scripts])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.psc',
    preventDropOnDocument: true
  })

  const scriptsList = useMemo(() => {
    return scripts.map((script, index) => {
      return (
        <ListItem
          key={script.id + index}
          className={classes.listItem}
        >
          <ListItemText>
            {script.name}
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={onClickRemoveScriptFromGroup(script)}>
              <DeleteIcon color="error" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  }, [scripts, onClickRemoveScriptFromGroup, classes.listItem])

  const onClickPopupToClose = useCallback((e: React.MouseEvent) => {
    if (!popupRef.current) {
      return
    }

    if (e.target !== popupRef.current) {
      return
    }

    onClose()
  }, [onClose])

  const onClickCancel = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Backdrop
      open={open}
      className={classes.backdrop}
      onClick={onClickPopupToClose}
    >
      <Card className="app-groups-add-popup-container">
        <form
          className="h-100 d-flex flex-column"
          onSubmit={onSubmitAddGroup}
        >
          <CardContent>
            <TextField
              fullWidth
              label="Name"
              name="group-name"
              id="group-name"
              value={name}
              onChange={onChangeName}
            />
            <div
              title="Add scripts"
              className="app-groups-add-popup-scripts"
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              {scripts.length === 0 && (
                <div className={classes.emptyText}>Drop your scripts files here or click here</div>
              )}

              <Fade
                in={isDragActive}
                mountOnEnter
                unmountOnExit
              >
                <div className="app-groups-is-dragging-container">
                  Drop files here...
                </div>
              </Fade>

              <Fade in={scriptsList.length > 0}>
                <List className={cx(['app-groups-popup-scripts', classes.list])}>
                  {scriptsList}
                </List>
              </Fade>
            </div>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
            >
              {isEdit ? 'Edit' : 'Add'}
            </Button>
            <Button
              onClick={onClickCancel}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    </Backdrop>
  )
}

export default AppGroupsAddPopup
