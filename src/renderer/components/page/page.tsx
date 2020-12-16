/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Container from '@material-ui/core/Container'
import Fade from '@material-ui/core/Fade'

import cx from 'classnames'
import React from 'react'

import classes from './page.module.scss'

interface Props {
  className?: string
  children: any
}

export function Page({ children, className }: React.PropsWithChildren<Props>) {
  return (
    <Fade timeout={500} in appear exit={false} mountOnEnter unmountOnExit>
      <Container className={cx(classes.container, className)}>
        {children}
      </Container>
    </Fade>
  )
}
