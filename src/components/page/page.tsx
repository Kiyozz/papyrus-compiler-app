import Fade from '@material-ui/core/Fade'
import Container from '@material-ui/core/Container'

import React from 'react'

interface Props {
  className?: string
}

const Page: React.FC<Props> = ({ children, className }) => {
  return (
    <Fade timeout={500} in appear exit={false} mountOnEnter unmountOnExit>
      <Container className={className}>
        {children}
      </Container>
    </Fade>
  )
}

export default Page
