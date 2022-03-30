/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import HelpIcon from '@mui/icons-material/Help'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Button } from '@mui/material'
import is from '@sindresorhus/is'
import debounce from 'debounce-fn'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GameType } from '../../../common/game'
import { TelemetryEvent } from '../../../common/telemetry-event'
import Page from '../../components/page'
import PageAppBar from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useDocumentation } from '../../hooks/use-documentation'
import { useTelemetry } from '../../hooks/use-telemetry'
import SettingsCompilation from './settings-compilation'
import SettingsGame from './settings-game'
import SettingsMo2 from './settings-mo2/settings-mo2'
import SettingsTelemetry from './settings-telemetry'
import SettingsTheme from './settings-theme'
import { useSettings } from './use-settings'

function Settings() {
  const { t } = useTranslation()
  const {
    config: {
      game,
      compilation,
      mo2: { instance: mo2Instance },
    },
    setConfig,
    refreshConfig,
  } = useApp()
  const { checkConfig, resetConfigError } = useSettings()
  const { send } = useTelemetry()
  const { open: openDocumentation } = useDocumentation()

  const debouncedUpdateConfig = useMemo(
    () => debounce(setConfig, { wait: 500 }),
    [setConfig],
  )

  const setGame = useCallback(
    (gameType: GameType) => {
      setConfig({
        game: { type: gameType },
        compilation: {
          flag:
            gameType === GameType.fo4
              ? 'Institute_Papyrus_Flags.flg'
              : 'TESV_Papyrus_Flags.flg',
        },
      })
    },
    [setConfig],
  )
  const setGameFolder = useCallback(
    (gamePath: string) => debouncedUpdateConfig({ game: { path: gamePath } }),
    [debouncedUpdateConfig],
  )
  const setCompilerPath = useCallback(
    (compilerPath: string) =>
      debouncedUpdateConfig({ compilation: { compilerPath } }),
    [debouncedUpdateConfig],
  )
  const setMo2 = useCallback(
    (useMo2Updated: boolean) => setConfig({ mo2: { use: useMo2Updated } }),
    [setConfig],
  )
  const setMo2Instance = useCallback(
    (instance?: string) => debouncedUpdateConfig({ mo2: { instance } }),
    [debouncedUpdateConfig],
  )
  const setDisableMo2 = useCallback(
    () => setConfig({ mo2: { use: false, instance: undefined } }),
    [setConfig],
  )
  const debouncedCheckInstallation = useMemo(
    () => debounce(checkConfig, { wait: 500 }),
    [checkConfig],
  )

  const onClickRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as GameType

      if (
        ![GameType.le, GameType.se, GameType.vr, GameType.fo4].includes(value)
      ) {
        return
      }

      resetConfigError()
      send(TelemetryEvent.settingsGame, { game: value })
      setGame(value)
    },
    [resetConfigError, setGame, send],
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
    mo2Instance,
    resetConfigError,
  ])

  const onChangeGameFolder = useCallback(
    (value: string) => {
      setGameFolder(value)
    },
    [setGameFolder],
  )

  const onChangeCompilerPath = useCallback(
    (value: string) => {
      setCompilerPath(value)
    },
    [setCompilerPath],
  )

  const onChangeMo2Instance = useCallback(
    (value: string) => {
      if (is.emptyStringOrWhitespace(value)) {
        setMo2Instance(undefined)
      } else {
        setMo2Instance(value)
      }
    },
    [setMo2Instance],
  )

  const onChangeMo2 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked

      send(TelemetryEvent.modOrganizerActive, { active: checked })
      checked ? setMo2(checked) : setDisableMo2()
    },
    [setDisableMo2, setMo2, send],
  )

  const onClickRefreshInstallation = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      send(TelemetryEvent.settingsRefresh, {})
      void checkConfig()
    },
    [checkConfig, send],
  )

  const onClickPageRefresh = useCallback(() => {
    void checkConfig()
    refreshConfig()
    send(TelemetryEvent.settingsRefresh, {})
  }, [refreshConfig, checkConfig, send])

  return (
    <>
      <PageAppBar title={t('page.settings.title')}>
        <Button
          onClick={() => openDocumentation('settings-app-bar')}
          startIcon={<HelpIcon />}
        >
          {t('common.documentation')}
        </Button>
        <Button onClick={onClickPageRefresh} startIcon={<RefreshIcon />}>
          {t('common.refresh')}
        </Button>
      </PageAppBar>

      <Page>
        <SettingsGame
          onChangeCompilerPath={onChangeCompilerPath}
          onChangeGameFolder={onChangeGameFolder}
          onClickRadio={onClickRadio}
          onClickRefreshInstallation={onClickRefreshInstallation}
        />

        <SettingsCompilation />

        <SettingsMo2
          onChangeMo2={onChangeMo2}
          onChangeMo2Instance={onChangeMo2Instance}
          onClickRefreshInstallation={onClickRefreshInstallation}
        />

        <SettingsTheme />

        <SettingsTelemetry />
      </Page>
    </>
  )
}

export default Settings
