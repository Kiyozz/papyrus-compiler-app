/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { PropsWithChildren, ReactNode } from 'react'

interface PageAppBarProps {
  title?: string
  actions?: ReactNode
}

function PageAppBar({ title, children }: PropsWithChildren<PageAppBarProps>) {
  return (
    <div aria-label={title} className="pl-40">
      <div className="pr-6 pl-4">
        <h4>{title}</h4>
        {children}
      </div>
    </div>
  )
}

export default PageAppBar
