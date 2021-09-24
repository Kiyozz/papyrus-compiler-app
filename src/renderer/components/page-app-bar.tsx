/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback } from 'react'

import bridge from '../bridge'
import { useFocus } from '../hooks/use-focus'

interface Props {
  title?: string
  actions?: JSX.Element[]
}

export function PageAppBar({ title, actions = [] }: Props): JSX.Element {
  const isFocus = useFocus()

  const handleClickMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.blur()
      bridge.titlebar.openMenu({ x: e.pageX, y: e.pageY })
    },
    [],
  )

  return (
    <div
      className={`sticky w-full z-10 ${
        isFocus
          ? 'bg-light-400 dark:bg-black-400'
          : 'bg-light-600 dark:bg-black-600'
      } shadow text-black select-none  dark:text-white`}
    >
      <div className="flex h-16 px-4 items-center">
        <button className="btn mr-4" onClick={handleClickMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
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
