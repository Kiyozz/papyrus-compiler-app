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
      className={`sticky w-full z-10 ${
        isFocus
          ? 'bg-light-400 dark:bg-black-400'
          : 'bg-light-600 dark:bg-black-600'
      } shadow-b text-black select-none dark:text-white`}
    >
      <div className="flex h-16 px-4 items-center">
        <h2 className="text-xl font-bold font-nova">{title}</h2>
        <div className="flex items-center ml-auto gap-2">
          {actions.map((action, index) => {
            return <React.Fragment key={index}>{action}</React.Fragment>
          })}
        </div>
      </div>
    </div>
  )
}

export default PageAppBar
