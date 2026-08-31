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
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { GameType, toFlag } from '#common/game.ts'
import { LogLevel } from '#common/log-level.ts'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { Theme } from '#common/theme.ts'
import { useApp } from '../../hooks/use-app'
import { useTelemetry } from '../../hooks/use-telemetry'
import SettingsAboutSection from './settings-about-section.tsx'
import SettingsCompilation from './settings-compilation'
import SettingsGameSection from './settings-game-section.tsx'
import SettingsMo2 from './settings-mo2/settings-mo2'
import SettingsPreferencesSection from './settings-preferences-section.tsx'
import { useSettings } from './use-settings'
import { dynamicActivateLocale } from '@renderer/i18n.ts'
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@renderer/components/ui/breadcrumb.tsx'
import { Trans } from '@lingui/react/macro'

const maxConcurrentCompilationScripts = 100

const supportedLocales = ['en', 'fr']

const toFormLocale = (locale: string) =>
  supportedLocales.includes(locale) ? locale : 'fr'

export function SettingsPage() {
  const {
    config: {
      game,
      compilation,
      mo2,
      telemetry: { active: telemetry },
      theme,
      locale,
      logLevel,
    },
    setConfig,
    refreshConfig,
  } = useApp()
  const { diagnose, resetDiagnostic } = useSettings()
  const { send } = useTelemetry()
  const { open: openDocumentation } = useDocumentation()

  const form = useForm({
    defaultValues: {
      game: game.type,
      gamePath: game.path,
      compilerPath: compilation.compilerPath,
      concurrentScripts: compilation.concurrentScripts,
      output: compilation.output,
      anonymize: compilation.anonymize,
      mo2: mo2.use,
      telemetry,
      theme,
      locale: toFormLocale(locale),
      logLevel,
    },
    mode: 'onChange',
    delayError: 400,
  })

  // what this form last pushed to the configuration, per field: the mirror
  // below must not fight a write that has not landed yet
  const sentRef = useRef<Record<string, unknown>>({})

  const debouncedSetConfig = useMemo(
    () => debounce(setConfig, { wait: 500 }),
    [setConfig],
  )
  const debouncedDiagnose = useMemo(
    () => debounce(diagnose, { wait: 500 }),
    [diagnose],
  )

  useEffect(() => {
    resetDiagnostic()

    if (!game.path || !compilation.compilerPath) {
      return
    }

    void debouncedDiagnose()
  }, [
    compilation.compilerPath,
    debouncedDiagnose,
    game.path,
    game.type,
    resetDiagnostic,
  ])

  // the configuration also changes outside of this form: the diagnostic picks
  // a compiler on its own, the setup wizard sets the game folder. React Hook
  // Form reads `defaultValues` once, so without mirroring it back the fields
  // keep showing the previous value until the page is mounted again.
  useEffect(() => {
    const values: Record<string, unknown> = {
      game: game.type,
      gamePath: game.path,
      compilerPath: compilation.compilerPath,
      concurrentScripts: compilation.concurrentScripts,
      output: compilation.output,
      anonymize: compilation.anonymize,
      mo2: mo2.use,
      telemetry,
      theme,
      locale: toFormLocale(locale),
      logLevel,
    }

    for (const [name, value] of Object.entries(values)) {
      if (name in sentRef.current) {
        // the configuration caught up with the form: stop shielding the field
        if (sentRef.current[name] === value) {
          delete sentRef.current[name]
        }

        continue
      }

      const current = form.getValues(name as never) as unknown
      // the number input hands its value back as a string, the configuration
      // keeps a number
      const same =
        name === 'concurrentScripts'
          ? Number(current) === value
          : current === value

      if (same) {
        continue
      }

      form.setValue(name as never, value as never)
    }
  }, [
    game.type,
    game.path,
    compilation.compilerPath,
    compilation.concurrentScripts,
    compilation.output,
    compilation.anonymize,
    mo2.use,
    telemetry,
    theme,
    locale,
    logLevel,
    form,
  ])

  const onClickPageRefresh = useCallback(async () => {
    send(TelemetryEvent.settingsRefresh, {})
    await refreshConfig()
    await diagnose()
  }, [refreshConfig, diagnose, send])

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

            resetDiagnostic()
            send(TelemetryEvent.settingsGame, { game: gameType })
            sentRef.current.game = gameType
            setConfig({
              game: { type: gameType },
              compilation: {
                flag: toFlag(gameType),
              },
            })

            break
          }
          case 'gamePath': {
            const gamePath = value.gamePath?.trim()

            sentRef.current.gamePath = gamePath
            debouncedSetConfig({ game: { path: gamePath } })

            break
          }
          case 'compilerPath': {
            const compilerPath = value.compilerPath?.trim()

            sentRef.current.compilerPath = compilerPath
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

              sentRef.current.concurrentScripts = parsedValue
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
            sentRef.current.theme = newTheme
            setConfig({ theme: newTheme })

            break
          }
          case 'locale': {
            const newLocale = value.locale as string

            if (!['en', 'fr'].includes(newLocale)) return

            void dynamicActivateLocale(newLocale)
            sentRef.current.locale = newLocale
            setConfig({ locale: newLocale })

            break
          }
          case 'logLevel': {
            const newLogLevel = value.logLevel as LogLevel

            if (!(Object.values(LogLevel) as string[]).includes(newLogLevel)) {
              return
            }

            sentRef.current.logLevel = newLogLevel
            setConfig({ logLevel: newLogLevel })

            break
          }
          case 'output': {
            const output = (value.output ?? '').trim()

            sentRef.current.output = output
            debouncedSetConfig({
              compilation: { output },
            })

            break
          }
          case 'anonymize': {
            sentRef.current.anonymize = value.anonymize === true
            setConfig({
              compilation: { anonymize: value.anonymize === true },
            })

            break
          }
          case 'mo2': {
            sentRef.current.mo2 = value.mo2 === true
            setConfig({ mo2: { use: value.mo2 === true } })

            break
          }
          case 'telemetry': {
            const checked = value.telemetry === true

            if (checked) {
              send(TelemetryEvent.telemetryEnabled, {})
            }

            sentRef.current.telemetry = checked
            setConfig({ telemetry: { active: checked } })
            bridge.telemetry.setActive(checked)
          }
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [send, setConfig, debouncedSetConfig, resetDiagnostic])

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
          <Tooltip disableHoverablePopup>
            <TooltipTrigger
              render={
                <Button
                  onClick={() => openDocumentation('settings-app-bar')}
                  size="icon"
                />
              }
            >
              <BookIcon />
            </TooltipTrigger>
            <TooltipContent>
              <Trans>Documentation</Trans>
            </TooltipContent>
          </Tooltip>
          <Tooltip disableHoverablePopup>
            <TooltipTrigger
              render={<Button onClick={onClickPageRefresh} size="icon" />}
            >
              <RotateCcwIcon />
            </TooltipTrigger>
            <TooltipContent>
              <Trans>Rafraîchir</Trans>
            </TooltipContent>
          </Tooltip>
        </LayoutHeaderActions>
      </LayoutHeader>

      <Form {...form}>
        {/* h-px + grow keeps the form from growing past the window: without it
            the content overflows a body that has `overflow: hidden`, the
            ScrollArea never scrolls and the last section gets cut off. */}
        <form className="flex h-px grow flex-col">
          <ScrollArea className="page h-px w-full grow">
            <div className="flex flex-col gap-4 p-4">
              <SettingsGameSection />
              <div className="grid grid-cols-2 gap-4">
                <SettingsCompilation />
                <SettingsPreferencesSection />
              </div>
              <SettingsMo2 />
              <SettingsAboutSection />
            </div>
          </ScrollArea>
        </form>
      </Form>
    </>
  )
}
