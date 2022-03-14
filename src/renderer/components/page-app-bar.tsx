/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { ReactNode } from 'react'

import { useFocus } from '../hooks/use-focus'

type Props = {
  title?: string
  actions?: ReactNode[]
}

const PageAppBar = ({ title, actions = [] }: Props) => {
  const isFocus = useFocus()

  return (
    <div
      className={`sticky z-10 w-full ${
        isFocus
          ? 'bg-light-400 dark:bg-black-400'
          : 'bg-light-600 dark:bg-black-600'
      } text-black select-none shadow-b dark:text-white`}
    >
      <div className="flex h-16 items-center px-4">
        <h2 className="font-nova text-3xl font-bold">{title}</h2>
        <div className="ml-auto flex items-center gap-2">
          {actions.map((action, index) => {
            return <React.Fragment key={index}>{action}</React.Fragment>
          })}
        </div>
      </div>
    </div>
  )
}

export default PageAppBar
