/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React, { HTMLProps } from 'react'

type Props = {
  in: boolean
  speedMs: Delay
  className?: HTMLProps<HTMLDivElement>['className']
}

type Delay = 150 | 300

const Scale = ({
  in: enabled,
  speedMs,
  children,
  className,
}: React.PropsWithChildren<Props>) => {
  if (!children) {
    return null
  }

  return (
    <div
      className={cx(
        className,
        `transform-gpu scale-transition-${speedMs}`,
        !enabled ? 'scale-0 opacity-0' : '',
      )}
    >
      {children}
    </div>
  )
}

export type { Delay }

export default Scale
