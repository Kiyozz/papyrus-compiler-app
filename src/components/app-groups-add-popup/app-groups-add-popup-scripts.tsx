import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'

import { ScriptModel } from '../../models'

interface Props {
  scripts: ScriptModel[]
  onClickRemoveScriptFromGroup: (script: ScriptModel) => (e: React.MouseEvent) => void
}

const AppGroupsAddPopupScripts: React.FC<Props> = ({ scripts, onClickRemoveScriptFromGroup }) => (
  <List>
    {scripts.map((script, index) => (
      <ListItem key={script.id + index}>
        <ListItemText>
          {script.name}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={onClickRemoveScriptFromGroup(script)}>
            <DeleteIcon color="error" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
)

export default AppGroupsAddPopupScripts
