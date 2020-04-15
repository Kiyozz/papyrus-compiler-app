import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import useTimeout from '../../hooks/use-timeout'

const mountAnimation = keyframes`
  from {
    transform: translateX(50%) translateY(100%);
  }
  
  to {
    transform: translateX(50%) translateY(0);
  }
`

const unMountAnimation = keyframes`
  from {
    transform: translateX(50%) translateY(0);
  }

  to {
    transform: translateX(50%) translateY(100%);
  }
`

const AppSnackNotification = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 50%;
  background: black;
  transform: translateX(50%);
  padding: 1rem;
  animation: ${mountAnimation} 0.3s linear;
`

const AppSnackClose = styled(AppSnackNotification)`
  animation: ${unMountAnimation} 0.3s linear;
`

const AppSnack: React.FC = ({ children, ...props }) => {
  const [open, setOpened] = useState(true)

  useTimeout(() => {
    setOpened(false)
  }, { time: 3000 })

  if (open) {
    return (
      <AppSnackNotification {...props}>
        {children}
      </AppSnackNotification>
    )
  }

  return (
    <AppSnackClose {...props}>
      {children}
    </AppSnackClose>
  )
}

export default AppSnack
