/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { memo } from 'react'
import { CSSTransition } from 'react-transition-group'
import type { PropsWithChildren } from 'react';

interface Props {
  in: boolean
  timeout?: 100 | 150 | 200
}

function Fade({
  in: on,
  timeout = 200,
  children,
}: PropsWithChildren<Props>) {
  return (
    <CSSTransition
      classNames={`fade-${timeout}`}
      in={on}
      timeout={timeout}
      unmountOnExit
    >
      {children}
    </CSSTransition>
  )
}

export default memo(Fade)
