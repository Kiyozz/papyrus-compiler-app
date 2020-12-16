/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Backdrop from '@material-ui/core/Backdrop'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import classes from './drop-files-overlay.module.scss'

interface Props {
  open: boolean
}

export function DropFilesOverlay({ open }: Props) {
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
