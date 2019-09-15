import React from 'react'
import './app-splash-screen.scss'
import appLogo from '../../assets/papyrus-compiler-app-@2x.png'
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
