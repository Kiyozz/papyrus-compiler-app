import { makeStyles, Theme } from '@material-ui/core/styles'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SettingsIcon from '@material-ui/icons/Settings'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import React, { useCallback, useState } from 'react'
import AppCompilationLogs from '../../components/app-compilation-logs/app-compilation-logs.container'
import AppOpenLogFile from '../../components/app-open-log-file/app-open-log-file.container'

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  fabs: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}))

const AppCompilationActions: React.FC<Props> = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <SpeedDial
      className={classes.fabs}
      icon={<SpeedDialIcon icon={<SettingsIcon />} />}
      ariaLabel="Compilation actions"
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <AppOpenLogFile open={open} />
      <AppCompilationLogs open={open} />
    </SpeedDial>
  )
}

export default React.memo(AppCompilationActions)
