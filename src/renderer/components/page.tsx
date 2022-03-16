/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

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
    <div
      className={cx(
        'page overflow-overlay h-screen w-screen bg-light-600 p-6 transition-all duration-300 dark:bg-black-800',
        isDrawerExpand ? 'pl-48' : 'pl-14',
      )}
    >
      <main className={classes?.main}>{children}</main>
    </div>
  )
}

export default Page
