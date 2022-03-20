/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Paper } from '@mui/material'
import cx from 'classnames'
import React from 'react'

import { useDrawer } from '../hooks/use-drawer'

type Props = {
  classes?: {
    main?: string
  }
}

const Page = ({ children, classes }: React.PropsWithChildren<Props>) => {
  const [isDrawerExpand] = useDrawer()

  return (
    <Paper
      className={cx(
        'page overflow-overlay h-screen w-screen p-6',
        isDrawerExpand ? 'pl-48' : 'pl-14',
      )}
      sx={theme => ({
        transition: theme.transitions.create('padding', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      })}
    >
      <main className={classes?.main}>{children}</main>
    </Paper>
  )
}

export default Page
