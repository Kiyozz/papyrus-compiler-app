/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import RefreshIcon from '@material-ui/icons/Refresh'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import debounce from 'debounce-fn'
import { GameType } from '../../../common/game'

import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { usePageContext } from '../../components/page-context'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import { SettingsContextProvider } from './settings-context'
import { SettingsGame } from './settings-game'
import { SettingsMo2 } from './settings-mo2'
import { SettingsCompilation } from './settings-compilation'

export function Settings() {
  const { t } = useTranslation()
  const {
    config: {
      game,
      compilation,
      mo2: { instance: mo2Instance }
    },
    updateConfig,
    refreshConfig
  } = usePageContext()

  const debouncedUpdateConfig = useMemo(
    () => debounce(updateConfig, { wait: 500 }),
    [updateConfig]
  )

  const loading = useStoreSelector(state => state.taskLoading)
  const isInstallationBad = useStoreSelector(
    state => state.settings.isInstallationBad
  )
  const detectBadInstallation = useAction(
    actions.settingsPage.detectBadInstallation.start
  )
  const setGame = useCallback(
    (gameType: GameType) => updateConfig({ game: { type: gameType } }),
    [updateConfig]
  )
  const setGameFolder = useCallback(
    (gamePath: string) => debouncedUpdateConfig({ game: { path: gamePath } }),
    [debouncedUpdateConfig]
  )
  const setCompilerPath = useCallback(
    (compilerPath: string) =>
      debouncedUpdateConfig({ compilation: { compilerPath } }),
    [debouncedUpdateConfig]
  )
  const setMo2 = useCallback(
    (useMo2Updated: boolean) => updateConfig({ mo2: { use: useMo2Updated } }),
    [updateConfig]
  )
  const setMo2Instance = useCallback(
    (instance?: string) => debouncedUpdateConfig({ mo2: { instance } }),
    [debouncedUpdateConfig]
  )
  const setDisableMo2 = useCallback(
    () => updateConfig({ mo2: { use: false, instance: undefined } }),
    [updateConfig]
  )
  const setIsInstallationBad = useAction(actions.settingsPage.installationIsBad)

  const debouncedDetectBadInstallation = useMemo(
    () => debounce(detectBadInstallation, { wait: 500 }),
    [detectBadInstallation]
  )

  const onClickRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsInstallationBad(false)
      const value = e.target.value as GameType

      if (![GameType.Le, GameType.Se, GameType.Vr].includes(value)) {
        return
      }

      setGame(value)
    },
    [setGame, setIsInstallationBad]
  )

  useEffect(() => {
    setIsInstallationBad(false)

    if (!game.type || !game.path || !compilation.compilerPath) {
      return
    }

    debouncedDetectBadInstallation()
  }, [
    compilation.compilerPath,
    debouncedDetectBadInstallation,
    game.path,
    game.type,
    mo2Instance,
    setIsInstallationBad
  ])

  const onChangeGameFolder = useCallback(
    (value: string) => {
      setGameFolder(value)
    },
    [setGameFolder]
  )

  const onChangeCompilerPath = useCallback(
    (value: string) => {
      setCompilerPath(value)
    },
    [setCompilerPath]
  )

  const onChangeMo2Instance = useCallback(
    (value: string) => {
      if (value === '') {
        setMo2Instance(undefined)
      } else {
        setMo2Instance(value)
      }
    },
    [setMo2Instance]
  )

  const onChangeMo2 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.currentTarget.checked

      checked ? setMo2(checked) : setDisableMo2()
    },
    [setDisableMo2, setMo2]
  )

  const onClickRefreshInstallation = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      detectBadInstallation()
    },
    [detectBadInstallation]
  )

  const onClickPageRefresh = useCallback(() => {
    if (loading) {
      return
    }

    if (isInstallationBad) {
      detectBadInstallation()
    }

    refreshConfig()
  }, [loading, isInstallationBad, refreshConfig, detectBadInstallation])

  return (
    <SettingsContextProvider>
      <PageAppBar
        title={t('page.settings.title')}
        actions={[
          <button className="btn" key={1} onClick={onClickPageRefresh}>
            <div className="icon">
              <RefreshIcon />
            </div>
            {t('page.settings.actions.refresh')}
          </button>
        ]}
      />

      <Page>
        <div className="pb-4">
          <SettingsGame
            onClickRadio={onClickRadio}
            onChangeGameFolder={onChangeGameFolder}
            onClickRefreshInstallation={onClickRefreshInstallation}
            onChangeCompilerPath={onChangeCompilerPath}
          />

          <SettingsCompilation />

          <SettingsMo2
            onChangeMo2={onChangeMo2}
            onChangeMo2Instance={onChangeMo2Instance}
            onClickRefreshInstallation={onClickRefreshInstallation}
          />
        </div>
      </Page>
    </SettingsContextProvider>
  )
}
