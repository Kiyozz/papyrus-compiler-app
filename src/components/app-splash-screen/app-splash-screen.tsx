import React from 'react'
import './app-splash-screen.scss'
import appLogo from '../../assets/logo/app/icons/png/1024x1024.png'
import { CSSTransition } from 'react-transition-group'

export interface StateProps {
  initialized: boolean
}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppSplashScreen: React.FC<Props> = ({ initialized }) => {
  return (
    <CSSTransition
      in={!initialized}
      classNames="app-fade"
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <div className="app-splash-screen">
        <img
          src={appLogo}
          alt="Application logo"
        />
      </div>
    </CSSTransition>
  )
}

export default AppSplashScreen
