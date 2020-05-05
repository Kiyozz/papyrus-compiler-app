import Backdrop from '@material-ui/core/Backdrop'
import React from 'react'
import classes from './drop-files-overlay.module.scss'

interface Props {
  open: boolean
}

const DropFilesOverlay: React.FC<Props> = ({ open }) => {
  return (
    <Backdrop open={open} className={classes.background}>
      Drop files
    </Backdrop>
  )
}

export default DropFilesOverlay
