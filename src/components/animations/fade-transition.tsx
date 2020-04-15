import React from 'react'
import { CSSTransition } from 'react-transition-group'

interface Props {
  active?: boolean
  timeout?: number
}

const FadeTransition: React.FC<Props> = ({ active, timeout = 300, children }) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      timeout={timeout}
      in={active}
      classNames="app-fade"
    >
      <>
        {children}
      </>
    </CSSTransition>
  )
}

export default FadeTransition
