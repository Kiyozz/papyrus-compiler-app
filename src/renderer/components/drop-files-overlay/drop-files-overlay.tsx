/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Backdrop from '@material-ui/core/Backdrop'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import React from 'react'

interface Props {
  open: boolean
}

export function DropFilesOverlay({ open }: Props) {
  return (
    <Backdrop
      open={open}
      className="fixed z-10 top-0 right-0 bottom-0 left-0 w-full h-full flex justify-center items-center font-bold text-center text-4xl"
    >
      <Box
        className="flex items-center justify-center h-full w-full"
        bgcolor="primary.main"
        color="text.primary"
      >
        <Typography variant="h1" component="div">
          Drop files
        </Typography>
      </Box>
    </Backdrop>
  )
}
