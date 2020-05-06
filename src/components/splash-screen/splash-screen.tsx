import Fade from '@material-ui/core/Fade'

import React from 'react'
import { connect } from 'react-redux'

import appLogo from '../../assets/logo/app/icons/png/1024x1024.png'
import { RootStore } from '../../redux/stores/root.store'

import classes from './splash-screen.module.scss'

interface StateProps {
  initialized: boolean
}

type Props = StateProps

const Component: React.FC<Props> = ({ initialized }) => {
  return (
    <Fade
      in={!initialized}
      mountOnEnter
      unmountOnExit
    >
      <div className={classes.splash}>
        <img
          src={appLogo}
          alt="Application logo"
        />
      </div>
    </Fade>
  )
}

const SplashScreen = connect((store: RootStore): StateProps => ({
  initialized: store.initialization
}))(Component)

export default SplashScreen
