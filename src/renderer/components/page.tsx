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
  className?: string
}

const Page = ({ children, className }: React.PropsWithChildren<Props>) => {
  const [isDrawerExpand] = useDrawer()

  return (
    <Paper
      className={cx(
        'page overflow-overlay h-screen w-screen p-6 transition-[padding] duration-225 ease-sharp',
        isDrawerExpand ? 'pl-48' : 'pl-14',
        className,
      )}
    >
      <main className="flex min-h-full flex-col">{children}</main>
    </Paper>
  )
}

export default Page
