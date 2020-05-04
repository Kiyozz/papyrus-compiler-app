import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import Fade from '@material-ui/core/Fade'

import React from 'react'
import { connect } from 'react-redux'

import appLogo from '../../assets/logo/app/icons/png/1024x1024.png'
import { RootStore } from '../../redux/stores/root.store'

interface StateProps {
  initialized: boolean
}

type Props = StateProps

const LogoGrow = keyframes`
  0%, 100% {
    width: 125px;
  }

  50% {
    width: 150px;
  }
`

const SplashScreen = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1500;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  img {
    width: 125px;
    animation: ${LogoGrow} 1.75s ease-in-out infinite;
    animation-delay: 1s;
  }
`

const Component: React.FC<Props> = ({ initialized }) => {
  return (
    <Fade
      in={!initialized}
      mountOnEnter
      unmountOnExit
    >
      <SplashScreen>
        <img
          src={appLogo}
          alt="Application logo"
        />
      </SplashScreen>
    </Fade>
  )
}

const AppSplashScreen = connect((store: RootStore): StateProps => ({
  initialized: store.initialization
}))(Component)

export default AppSplashScreen
