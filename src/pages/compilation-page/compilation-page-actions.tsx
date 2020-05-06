import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import ClearIcon from '@material-ui/icons/Clear'

import React from 'react'

import AppCompilationLogs from '../../components/compilation-logs/compilation-logs'
import OpenLogFileAction from '../../components/open-log-file-action/open-log-file-action'
import classes from './compilation-page.module.scss'

interface Props {
  hasScripts: boolean
  onClearScripts: () => void
}

const CompilationPageActions: React.FC<Props> = ({ hasScripts, onClearScripts }) => {
  const [open, setOpen] = React.useState(false)

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
        <OpenLogFileAction open={open} />
        <AppCompilationLogs open={open} />
      </SpeedDial>
    </>
  )
}

export default CompilationPageActions
