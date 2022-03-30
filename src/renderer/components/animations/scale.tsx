/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import type { HTMLProps } from 'react';

interface Props {
  in: boolean
  speedMs: Delay
  className?: HTMLProps<HTMLDivElement>['className']
}

type Delay = 150 | 300

function Scale({
  in: enabled,
  speedMs,
  children,
  className,
}: React.PropsWithChildren<Props>) {
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
