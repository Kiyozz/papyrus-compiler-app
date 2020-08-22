import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import FolderIcon from '@material-ui/icons/Folder'

import React from 'react'

import { useSettings } from './settings-context'
import classes from './settings-page.module.scss'

interface Props {
  limitationText: string
}

const SettingsMo2List: React.FC<Props> = ({ limitationText }) => {
  const { mo2Instance, mo2Folders } = useSettings()

  const folders = mo2Folders.map(folder => folder.replace(`${mo2Instance}\\mods\\`, ''))

  return (
    <>
      <List
        subheader={
          <ListSubheader className={classes.listHeader}>
            Sources
            <div className={classes.listHeaderRightText}>{limitationText}</div>
          </ListSubheader>
        }
      >
        {folders.map(folder => (
          <ListItem key={folder}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={folder} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SettingsMo2List
