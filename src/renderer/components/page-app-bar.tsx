/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'

interface Props {
  title?: string
  actions?: JSX.Element[]
}

export function PageAppBar({ title, actions = [] }: Props): JSX.Element {
  return (
    <div className="sticky w-full z-10 bg-purple-700 text-white select-none">
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
