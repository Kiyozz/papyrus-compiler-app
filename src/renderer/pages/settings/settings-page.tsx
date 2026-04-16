/*
 * 2022-2026 Kiyozz.
 */

import { bridge } from '@renderer/bridge.ts'
import { Button } from '@renderer/components/ui/button.tsx'
import { Form } from '@renderer/components/ui/form.tsx'
import { ScrollArea } from '@renderer/components/ui/scroll-area.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip.tsx'
import { useDocumentation } from '@renderer/hooks/use-documentation.ts'
import {
  LayoutHeader,
  LayoutHeaderActions,
  LayoutHeaderTitle,
} from '@renderer/pages/layout.tsx'
import is from '@sindresorhus/is'
import debounce from 'debounce-fn'
import { BookIcon, RotateCcwIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { GameType } from '../../../common/game'
import { TelemetryEvent } from '../../../common/telemetry-event'
import { Theme } from '../../../common/theme.ts'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'
import SettingsCompilation from './settings-compilation'
import SettingsGameSection from './settings-game-section.tsx'
import SettingsPreferencesSection from './settings-preferences-section.tsx'
import { useSettings } from './use-settings'
import { dynamicActivateLocale } from '@renderer/i18n.ts'
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@renderer/components/ui/breadcrumb.tsx'
import { Trans } from '@lingui/react/macro'

const maxConcurrentCompilationScripts = 100

export function SettingsPage() {
  const {
    config: {
      game,
      compilation,
      telemetry: { active: telemetry },
      theme,
      locale,
    },
    setConfig,
    refreshConfig,
  } = useApp()
  const { checkConfig, resetConfigError } = useSettings()
  const { send } = useTelemetry()
  const { open: openDocumentation } = useDocumentation()

  const form = useForm({
    defaultValues: {
      game: game.type,
      gamePath: game.path,
      compilerPath: compilation.compilerPath,
      concurrentScripts: compilation.concurrentScripts,
      telemetry,
      theme,
      locale: ['en', 'fr'].includes(locale) ? locale : 'fr',
    },
    mode: 'onChange',
    delayError: 400,
  })

  const debouncedSetConfig = useMemo(
    () => debounce(setConfig, { wait: 500 }),
    [setConfig],
  )
  const debouncedCheckInstallation = useMemo(
    () => debounce(checkConfig, { wait: 500 }),
    [checkConfig],
  )

  useEffect(() => {
    resetConfigError()

    if (!game.path || !compilation.compilerPath) {
      return
    }

    void debouncedCheckInstallation()
  }, [
    compilation.compilerPath,
    debouncedCheckInstallation,
    game.path,
    game.type,
    resetConfigError,
  ])

  const onClickPageRefresh = useCallback(async () => {
    send(TelemetryEvent.settingsRefresh, {})
    await refreshConfig()
    await checkConfig()
  }, [refreshConfig, checkConfig, send])

  useEffect(() => {
    const { unsubscribe } = form.watch((value, info) => {
      if (info.type === 'change') {
        switch (info.name) {
          case 'game': {
            const gameType = value.game as GameType

            if (
              ![
                GameType.le,
                GameType.se,
                GameType.vr,
                GameType.fo4,
                GameType.sf,
              ].includes(gameType)
            ) {
              return
            }

            resetConfigError()
            send(TelemetryEvent.settingsGame, { game: gameType })
            setConfig({
              game: { type: gameType },
              compilation: {
                flag:
                  gameType === GameType.fo4
                    ? 'Institute_Papyrus_Flags.flg'
                    : 'TESV_Papyrus_Flags.flg',
              },
            })

            break
          }
          case 'gamePath': {
            const gamePath = value.gamePath

            debouncedSetConfig({ game: { path: gamePath?.trim() } })

            break
          }
          case 'compilerPath': {
            const compilerPath = value.compilerPath?.trim()

            debouncedSetConfig({
              compilation: {
                compilerPath,
              },
            })

            break
          }
          case 'concurrentScripts': {
            let concurrentScripts = value.concurrentScripts as
              | number
              | string
              | undefined

            if (concurrentScripts === '') {
              concurrentScripts = '0'
            }

            if (is.numericString(concurrentScripts)) {
              let parsedValue = parseInt(concurrentScripts, 10)

              if (parsedValue > maxConcurrentCompilationScripts) {
                parsedValue = maxConcurrentCompilationScripts
              }

              if (parsedValue < 0) {
                parsedValue = 1
              }

              setConfig({ compilation: { concurrentScripts: parsedValue } })
            }

            break
          }
          case 'theme': {
            const newTheme = value.theme!

            if (![Theme.system, Theme.light, Theme.dark].includes(newTheme)) {
              return
            }

            send(TelemetryEvent.settingsTheme, { theme: newTheme })
            setConfig({ theme: newTheme })

            break
          }
          case 'locale': {
            const newLocale = value.locale as string

            if (!['en', 'fr'].includes(newLocale)) return

            void dynamicActivateLocale(newLocale)
            setConfig({ locale: newLocale })

            break
          }
          case 'telemetry': {
            const checked = value.telemetry === true

            if (checked) {
              send(TelemetryEvent.telemetryEnabled, {})
            }

            setConfig({ telemetry: { active: checked } })
            bridge.telemetry.setActive(checked)
          }
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [send, setConfig, debouncedSetConfig, resetConfigError])

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Trans>Paramètres</Trans>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </LayoutHeaderTitle>
        <LayoutHeaderActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => openDocumentation('settings-app-bar')}
                size="icon"
              >
                <BookIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Trans>Documentation</Trans>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onClickPageRefresh} size="icon">
                <RotateCcwIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Trans>Rafraîchir</Trans>
            </TooltipContent>
          </Tooltip>
        </LayoutHeaderActions>
      </LayoutHeader>

      <Form {...form}>
        <form>
          <ScrollArea className="page w-full">
            <div className="flex flex-col gap-4 p-4">
              <SettingsGameSection />
              <div className="grid grid-cols-2 gap-4 pb-10">
                <SettingsCompilation />
                <SettingsPreferencesSection />
              </div>
            </div>
          </ScrollArea>
        </form>
      </Form>
    </>
  )
}
