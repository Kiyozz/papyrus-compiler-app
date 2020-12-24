/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import Fade from '@material-ui/core/Fade'

import React from 'react'

import appLogo from '../../assets/logo/app/icons/png/1024x1024.png'
import { useStoreSelector } from '../../redux/use-store-selector'

export function SplashScreen() {
  const initialized = useStoreSelector(state => state.initialization)

  return (
    <Fade in={!initialized} mountOnEnter unmountOnExit>
      <div className="fixed top-0 right-0 bottom-0 left-0 z-50 w-full h-full bg-gray-900 text-white flex justify-center items-center text-center">
        <img className="w-48" src={appLogo} alt="Application logo" />
      </div>
    </Fade>
  )
}
