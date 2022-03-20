/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { AppBar, Toolbar, Typography } from '@mui/material'
import React, { PropsWithChildren, ReactNode } from 'react'

type Props = {
  title?: string
  actions?: ReactNode
}

const PageAppBar = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <AppBar aria-label={title}>
      <Toolbar disableGutters className="pr-6 pl-4">
        <Typography variant="h4" className="grow font-nova" fontWeight="bold">
          {title}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  )
}

export default PageAppBar
