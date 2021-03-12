/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

import { useApp } from '../hooks/use-app'

interface Props {
  className?: string
}

export function Page({
  children,
  className
}: React.PropsWithChildren<Props>): JSX.Element {
  const { isDrawerExpand } = useApp()

  return (
    <div
      className={cx(
        'page h-screen w-screen p-6 overflow-overlay bg-light-600 dark:bg-black-800',
        className,
        isDrawerExpand ? 'pl-48' : 'pl-14'
      )}
    >
      <main>{children}</main>
    </div>
  )
}
