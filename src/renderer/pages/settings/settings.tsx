/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import RefreshIcon from '@material-ui/icons/Refresh'
import debounce from 'debounce-fn'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { GameType } from '../../../common/game'
import { Page } from '../../components/page'
import { PageAppBar } from '../../components/page-app-bar'
import { useApp } from '../../hooks/use-app'
import { useLoading } from '../../hooks/use-loading'
import { SettingsCompilation } from './settings-compilation'
import { useSettings } from './settings-context'
import { SettingsGame } from './settings-game'
import { SettingsMo2 } from './settings-mo2'

export function Settings(): JSX.Element {
  const { t } = useTranslation()
  const {
    config: {
      game,
      compilation,
      mo2: { instance: mo2Instance }
    },
    setConfig,
    refreshConfig
  } = useApp()
  const {
    checkInstallation,
    isBadInstallation,
    resetBadInstallation
  } = useSettings()
  const { isLoading } = useLoading()

  const debouncedUpdateConfig = useMemo(
    () => debounce(setConfig, { wait: 500 }),
    [setConfig]
  )

  const setGame = useCallback(
    (gameType: GameType) => {
      setConfig({
        game: { type: gameType },
        compilation: {
          flag:
            gameType === GameType.Fo4
              ? 'Institute_Papyrus_Flags.flg'
              : 'TESV_Papyrus_Flags.flg'
        }
      })
    },
    [setConfig]
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
    (useMo2Updated: boolean) => setConfig({ mo2: { use: useMo2Updated } }),
    [setConfig]
  )
  const setMo2Instance = useCallback(
    (instance?: string) => debouncedUpdateConfig({ mo2: { instance } }),
    [debouncedUpdateConfig]
  )
  const setDisableMo2 = useCallback(
    () => setConfig({ mo2: { use: false, instance: undefined } }),
    [setConfig]
  )
  const debouncedcheckInstallation = useMemo(
    () => debounce(checkInstallation, { wait: 500 }),
    [checkInstallation]
  )

  const onClickRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      resetBadInstallation()
      const value = e.target.value as GameType

      if (
        ![GameType.Le, GameType.Se, GameType.Vr, GameType.Fo4].includes(value)
      ) {
        return
      }

      setGame(value)
    },
    [resetBadInstallation, setGame]
  )

  useEffect(() => {
    resetBadInstallation()

    if (!game.type || !game.path || !compilation.compilerPath) {
      return
    }

    debouncedcheckInstallation()
  }, [
    compilation.compilerPath,
    debouncedcheckInstallation,
    game.path,
    game.type,
    mo2Instance,
    resetBadInstallation
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

      checkInstallation()
    },
    [checkInstallation]
  )

  const onClickPageRefresh = useCallback(() => {
    if (isLoading) {
      return
    }

    if (isBadInstallation) {
      checkInstallation()
    }

    refreshConfig()
  }, [isLoading, isBadInstallation, refreshConfig, checkInstallation])

  return (
    <>
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
      </Page>
    </>
  )
}
