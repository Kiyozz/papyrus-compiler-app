/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { HTMLProps } from 'react'

interface Props {
  in: boolean
  speedMs: Delay
  className?: HTMLProps<HTMLDivElement>['className']
}

export type Delay = 150 | 300

export function Scale({
  in: enabled,
  speedMs,
  children,
  className,
}: React.PropsWithChildren<Required<Props>>): JSX.Element | null {
  if (!children) {
    return null
  }

  return (
    <div
      className={cx(
        className,
        `transform-gpu go-up-transition-${speedMs}`,
        !enabled ? 'scale-0 opacity-0' : '',
      )}
    >
      {children}
    </div>
  )
}
