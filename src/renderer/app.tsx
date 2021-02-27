/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'

import { useTranslation } from 'react-i18next'
import { DialogChangelog } from './components/dialog/dialog-changelog'
import { PageDrawer } from './components/page-drawer'
import { Routes } from './routes'
import { TutorialSettings } from './components/tutorials/tutorial-settings'
import { useInitialization } from './hooks/use-initialization'

export function App() {
  const { t } = useTranslation()
  const { done } = useInitialization()

  return (
    <>
      {!done && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-darker z-20">
          <div className="text-center text-4xl">{t('loading')}</div>
        </div>
      )}

      <div className={`${!done ? 'opacity-0' : ''}`}>
        <DialogChangelog />
        <PageDrawer />

        {done && (
          <>
            <TutorialSettings />
            <Routes />
          </>
        )}
      </div>
    </>
  )
}
