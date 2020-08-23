import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import FolderIcon from '@material-ui/icons/Folder'
import is from '@sindresorhus/is'

import React from 'react'
import { usePageContext } from '../../components/page/page-context'

import { useSettings } from './settings-context'
import classes from './settings-page.module.scss'

interface Props {
  limitationText: string
}

const SettingsMo2List: React.FC<Props> = ({ limitationText }) => {
  const {
    config: { mo2 }
  } = usePageContext()
  const {
    mo2: { sources }
  } = useSettings()

  if (is.undefined(mo2.instance) || is.undefined(sources)) {
    return null
  }

  const folders = new Set(sources.map(folder => folder.replace(/.*([/\\])mods([/\\])/gi, '')))

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
        {Array.from(folders).map(folder => (
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
