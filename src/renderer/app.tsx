/*
 * 2022-2026 Kiyozz.
 */

import { RouterProvider } from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { TelemetryEvent } from '../common/telemetry-event'
import { version as releaseVersion } from '../common/version'
import DialogChangelog from './components/dialog/dialog-changelog'
import { useInitialization } from './hooks/use-initialization'
import { useSyncHtmlTheme } from './hooks/use-sync-html-theme'
import { useTelemetry } from './hooks/use-telemetry'
import { useVersion } from './hooks/use-version'
import { router } from './router'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )

function App() {
  const { done } = useInitialization()
  const { send } = useTelemetry()
  const [version] = useVersion()
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
          <div className="text-center text-4xl">
            <Trans>Chargement</Trans>
          </div>
        </div>
      )}

      <div className={`${!done ? 'opacity-0' : ''}`}>
        <DialogChangelog />
        {done && (
          <>
            <RouterProvider router={router} />
            <Suspense>
              <TanStackRouterDevtools router={router} position="bottom-right" />
            </Suspense>
          </>
        )}
      </div>
    </>
  )
}

export { App }
