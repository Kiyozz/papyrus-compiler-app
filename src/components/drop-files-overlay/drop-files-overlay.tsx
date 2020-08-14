import Backdrop from '@material-ui/core/Backdrop'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import classes from './drop-files-overlay.module.scss'

interface Props {
  open: boolean
}

const DropFilesOverlay: React.FC<Props> = ({ open }) => {
  return (
    <Backdrop open={open} className={classes.background}>
      <Box className={classes.box} bgcolor="primary.main" color="text.primary">
        <Typography variant="h1" component="div">
          Drop files
        </Typography>
      </Box>
    </Backdrop>
  )
}

export default DropFilesOverlay
