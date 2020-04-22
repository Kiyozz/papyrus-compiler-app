import { makeStyles, Theme } from '@material-ui/core/styles'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import Backdrop from '@material-ui/core/Backdrop'
import React, { useCallback, useState } from 'react'
import AppCompilationLogs from '../../components/app-compilation-logs/app-compilation-logs.container'
import AppOpenLogFile from '../../components/app-open-log-file/app-open-log-file.container'

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  fabs: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.speedDial - 1
  }
}))

const AppCompilationActions: React.FC<Props> = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <>
      <SpeedDial
        className={classes.fabs}
        icon={<SpeedDialIcon />}
        ariaLabel="Compilation actions"
        onOpen={handleOpen}
        onClose={handleClose}
        open={open}
      >
        <AppOpenLogFile open={open} />
        <AppCompilationLogs open={open} />
      </SpeedDial>
      <Backdrop open={open} className={classes.backdrop} />
    </>
  )
}

export default React.memo(AppCompilationActions)
