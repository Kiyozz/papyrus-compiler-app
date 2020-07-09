import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import BugReportIcon from '@material-ui/icons/BugReport'
import React, { useCallback } from 'react'
import actions from '../../redux/actions'
import { useAction } from '../../redux/use-store-selector'

const OpenLogFileAction: React.FC = () => {
  const openLogFile = useAction(actions.openLogFile)

  const onClickButtonOpenLogFile = useCallback(() => {
    openLogFile()
  }, [openLogFile])

  return (
    <ListItem button onClick={onClickButtonOpenLogFile}>
      <ListItemIcon>
        <BugReportIcon />
      </ListItemIcon>
      <ListItemText primary="Application logs" />
    </ListItem>
  )
}

export default OpenLogFileAction
