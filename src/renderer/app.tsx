/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React, { useCallback, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { DialogChangelog } from './components/dialog-changelog'
import { PageContextProvider } from './components/page-context'
import { PageDrawer } from './components/page-drawer'
import actions from './redux/actions'
import { useAction, useStoreSelector } from './redux/use-store-selector'
import { Routes } from './routes'
import { TutorialSettings } from './components/tutorials/tutorial-settings'

export function App() {
  const initialization = useAction(actions.initialization.start)
  const getLatestNotes = useAction(actions.changelog.latestNotes.start)
  const setShowNotes = useAction(actions.changelog.showNotes)
  const initialized = useStoreSelector(state => state.initialization)
  const { t } = useTranslation()

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
    <>
      {!initialized && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-darker z-20">
          <div className="text-center text-4xl">{t('loading')}</div>
        </div>
      )}

      <div className={`flex min-h-full ${!initialized ? 'opacity-0' : ''}`}>
        <DialogChangelog onClose={onClickCloseChangelogPopup} />

        <PageContextProvider>
          <PageDrawer />

          {initialized && <TutorialSettings />}

          <div
            className={`h-full ${isDrawerExpand ? 'pl-48' : 'pl-14'} w-full`}
          >
            <Routes />
          </div>
        </PageContextProvider>
      </div>
    </>
  )
}
