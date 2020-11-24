/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Fade from '@material-ui/core/Fade'

import React from 'react'

import appLogo from '../../assets/logo/app/icons/png/1024x1024.png'
import { useStoreSelector } from '../../redux/use-store-selector'

import classes from './splash-screen.module.scss'

export const SplashScreen: React.FC = () => {
  const initialized = useStoreSelector(state => state.initialization)

  return (
    <Fade in={!initialized} mountOnEnter unmountOnExit>
      <div className={classes.splash}>
        <img src={appLogo} alt="Application logo" />
      </div>
    </Fade>
  )
}
