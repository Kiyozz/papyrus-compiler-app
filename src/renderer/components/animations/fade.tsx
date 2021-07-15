/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { memo, PropsWithChildren } from 'react'
import { CSSTransition } from 'react-transition-group'

interface Props {
  in: boolean
  timeout?: number
}

const Fade = ({
  in: on,
  timeout = 200,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
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
