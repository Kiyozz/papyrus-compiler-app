/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { useStoreSelector } from '../redux/use-store-selector'

interface Props {
  className?: string
  children: any
}

export function Page({ children, className }: React.PropsWithChildren<Props>) {
  const isDrawerExpand = useStoreSelector(
    store => store.settings.isDrawerExpand
  )

  return (
    <div
      className={cx(
        'container mx-auto p-6 overflow-overlay',
        className,
        isDrawerExpand ? 'pl-48' : 'pl-14'
      )}
    >
      {children}
    </div>
  )
}
