/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

import { useDrawer } from '../hooks/use-drawer'

type Props = {
  className?: string
  mainClassName?: string
}

const Page = ({
  children,
  className,
  mainClassName,
}: React.PropsWithChildren<Props>) => {
  const [isDrawerExpand] = useDrawer()

  return (
    <div
      className={cx(
        'page h-screen w-screen p-6 overflow-overlay bg-light-600 dark:bg-black-800 transition-all duration-300',
        className,
        isDrawerExpand ? 'pl-48' : 'pl-14',
      )}
    >
      <main className={mainClassName}>{children}</main>
    </div>
  )
}

export default Page
