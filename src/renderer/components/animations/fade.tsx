/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { memo, PropsWithChildren } from 'react'
import { CSSTransition } from 'react-transition-group'

type Props = {
  in: boolean
  timeout?: 100 | 150 | 200
}

const Fade = ({
  in: on,
  timeout = 200,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CSSTransition
      in={on}
      timeout={timeout}
      unmountOnExit
      classNames={`fade-${timeout}`}
    >
      {children}
    </CSSTransition>
  )
}

export default memo(Fade)
