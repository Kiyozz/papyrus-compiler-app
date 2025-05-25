/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { Routes } from '@/routes.tsx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TelemetryEvent } from '../common/telemetry-event'
import { version as releaseVersion } from '../common/version'
import DialogChangelog from './components/dialog/dialog-changelog'
import TutorialSettings from './components/tutorials/tutorial-settings'
import TutorialTelemetry from './components/tutorials/tutorial-telemetry'
import { useApp } from './hooks/use-app'
import { useInitialization } from './hooks/use-initialization'
import { useSyncHtmlTheme } from './hooks/use-sync-html-theme'
import { useTelemetry } from './hooks/use-telemetry'
import { useVersion } from './hooks/use-version'

function App() {
  const { t } = useTranslation()
  const { done } = useInitialization()
  const { send } = useTelemetry()
  const [version] = useVersion()
  const {
    config: { tutorials },
  } = useApp()

  useSyncHtmlTheme()

  useEffect(() => {
    if (done) {
      send(TelemetryEvent.appLoaded, { version, releaseVersion })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, version])

  return (
    <>
      {!done && (
        <div className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-light-400 dark:bg-darker">
          <div className="text-center text-4xl">{t('loading')}</div>
        </div>
      )}

      <div className={`${!done ? 'opacity-0' : ''}`}>
        <DialogChangelog />
        {done && (
          <>
            {tutorials.settings && <TutorialSettings />}
            {tutorials.telemetry && !tutorials.settings && <TutorialTelemetry />}
            <Routes />
          </>
        )}
      </div>
    </>
  )
}

export default App
