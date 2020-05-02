import { makeStyles, Theme } from '@material-ui/core/styles'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import Backdrop from '@material-ui/core/Backdrop'
import ClearIcon from '@material-ui/icons/Clear'
import React, { useState } from 'react'
import AppCompilationLogs from '../../components/app-compilation-logs/app-compilation-logs.container'
import AppOpenLogFile from '../../components/app-open-log-file/app-open-log-file.container'

interface Props {
  hasScripts: boolean
  onClearScripts: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  fabs: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.speedDial - 1
  }
}))

const AppCompilationActions: React.FC<Props> = ({ hasScripts, onClearScripts }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const onClickEmpty = () => {
    onClearScripts()
  }

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
        <SpeedDialAction
          onClick={onClickEmpty}
          title="Empty list"
          open={open && hasScripts}
          icon={<ClearIcon />}
        />
        <AppOpenLogFile open={open} />
        <AppCompilationLogs open={open} />
      </SpeedDial>
      <Backdrop open={open} className={classes.backdrop} />
    </>
  )
}

export default React.memo(AppCompilationActions)
