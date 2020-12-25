/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useEffect } from 'react'

import { DialogChangelog } from './components/dialog-changelog/dialog-changelog'
import { PageContextProvider } from './components/page/page-context'
import { PageDrawer } from './components/page/page-drawer'
import { SplashScreen } from './components/splash-screen/splash-screen'
import actions from './redux/actions'
import { useAction, useStoreSelector } from './redux/use-store-selector'
import { Routes } from './routes'

export function App() {
  const initialization = useAction(actions.initialization.start)
  const getLatestNotes = useAction(actions.changelog.latestNotes.start)
  const setShowNotes = useAction(actions.changelog.showNotes)
  const initialized = useStoreSelector(state => state.initialization)

  useEffect(() => {
    initialization()
  }, [initialization])

  useEffect(() => {
    getLatestNotes()
    // eslint-disable-next-line
  }, [])

  const onClickCloseChangelogPopup = useCallback(() => {
    setShowNotes(false)
  }, [setShowNotes])

  const isDrawerExpand = useStoreSelector(
    store => store.settings.isDrawerExpand
  )

  return (
    <div className="flex min-h-full">
      {initialized && <DialogChangelog onClose={onClickCloseChangelogPopup} />}

      <SplashScreen />

      <PageContextProvider>
        <PageDrawer />

        <div className={`h-full ${isDrawerExpand ? 'pl-48' : 'pl-14'} w-full`}>
          <Routes />
        </div>
      </PageContextProvider>
    </div>
  )
}
