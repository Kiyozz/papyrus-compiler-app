/*
 * 2022-2026 Kiyozz.
 */

import debounce from 'debounce-fn'
import { StrictMode } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { Toaster } from '@renderer/components/ui/sonner.tsx'
import { fromError } from '../common/from-error'
import { bridge } from './bridge'
import AppProvider from './hooks/use-app'
import CompilationProvider from './hooks/use-compilation'
import DrawerProvider from './hooks/use-drawer'
import DropProvider from './hooks/use-drop'
import FocusProvider from './hooks/use-focus'
import InitializationProvider from './hooks/use-initialization'
import RecentFilesProvider from './hooks/use-recent-files'
import TelemetryProvider from './hooks/use-telemetry'
import VersionProvider from './hooks/use-version'
import SettingsProvider from './pages/settings/use-settings'
import { isProduction } from './utils/is-production'
import { TooltipProvider } from '@renderer/components/ui/tooltip.tsx'
import { dynamicActivateLocale } from '@renderer/i18n.ts'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import 'unfonts.css'

const _initialConfig = await bridge.config.get()
const _initialLocale = _initialConfig.locale?.startsWith('fr') ? 'fr' : 'en'
await dynamicActivateLocale(_initialLocale)

async function start() {
  const root = document.getElementById('app')

  if (!root) {
    throw new Error('Something went wrong. #app element is missing.')
  }

  const rootReact = createRoot(root)

  const production = await isProduction()
  const App = await import('./app.tsx').then((m) => m.App)

  try {
    rootReact.render(
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <TooltipProvider>
            <VersionProvider>
              <AppProvider>
                <TelemetryProvider>
                  <InitializationProvider>
                    <RecentFilesProvider>
                      <CompilationProvider>
                        <SettingsProvider>
                          <FocusProvider>
                            <DrawerProvider>
                              <DropProvider>
                                <App />
                              </DropProvider>
                            </DrawerProvider>
                          </FocusProvider>
                        </SettingsProvider>
                      </CompilationProvider>
                    </RecentFilesProvider>
                  </InitializationProvider>
                </TelemetryProvider>
              </AppProvider>
            </VersionProvider>
            {createPortal(<Toaster />, document.body)}
          </TooltipProvider>
        </I18nProvider>
      </StrictMode>,
    )
  } catch (e) {
    let err: Error

    if (e instanceof Error) {
      err = e
    } else if (typeof e === 'string') {
      err = new Error(e)
    } else {
      err = new Error(`unknown error: ${fromError(e).message}`)
    }

    if (production) {
      await bridge.error(err)
    }
  }

  function sendIsOnline(): void {
    bridge.online(navigator.onLine)
  }

  sendIsOnline()

  window.addEventListener('online', () => sendIsOnline())
  window.addEventListener('offline', () => sendIsOnline())

  if (production) {
    const handle = debounce(
      (error: Error) => {
        void bridge.error(error)
      },
      { wait: 200 },
    )

    window.addEventListener('error', (event) => {
      event.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      handle(event.error || event)
    })

    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      handle(event.reason || event)
    })
  }
}

await start()
