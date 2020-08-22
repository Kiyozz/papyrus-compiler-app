import Container from '@material-ui/core/Container'
import Fade from '@material-ui/core/Fade'

import cx from 'classnames'
import React from 'react'

import classes from './page.module.scss'

interface Props {
  className?: string
  children: any
}

const Page: React.FC<Props> = ({ children, className }) => {
  return (
    <Fade timeout={500} in appear exit={false} mountOnEnter unmountOnExit>
      <Container className={cx(classes.container, className)}>
        {children}
      </Container>
    </Fade>
  )
}

export default Page
