/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'

interface PageAppBarProps {
  title?: string
  actions?: ReactNode
}

function PageAppBar({ title, children }: PropsWithChildren<PageAppBarProps>) {
  return (
    <AppBar aria-label={title}>
      <Toolbar className="pr-6 pl-4" disableGutters>
        <Typography className="grow font-nova" fontWeight="bold" variant="h4">
          {title}
        </Typography>
        {children}
      </Toolbar>
    </AppBar>
  )
}

export default PageAppBar
