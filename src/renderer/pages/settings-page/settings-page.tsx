import RefreshIcon from '@material-ui/icons/Refresh'
import React, { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { Games } from '../../enums/games.enum'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import { Mo2Service } from '../../services/mo2.service'
import SettingsContextProvider from './settings-context'
import SettingsGame from './settings-game'
import SettingsMo2 from './settings-mo2'
import classes from './settings-page.module.scss'
import SettingsVersion from './settings-version'

const mo2Service = new Mo2Service()

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const [actualMo2FolderStringLimitation, setStringLimitation] = useState<number>()
  const startingVersion = useStoreSelector(state => state.changelog.startingVersion)
  const game = useStoreSelector(state => state.settings.game)
  const gameFolder = useStoreSelector(state => state.settings.gameFolder)
  const mo2 = useStoreSelector(state => state.settings.mo2)
  const mo2Instance = useStoreSelector(state => state.settings.mo2Instance)
  const detectedMo2SourcesFolders = useStoreSelector(state => state.settings.mo2SourcesFolders)
  const loading = useStoreSelector(state => state.taskLoading)
  const detectSourcesFoldersError = useStoreSelector(state => state.settings.mo2DetectSourcesFoldersError)
  const installationIsBad = useStoreSelector(state => state.settings.installationIsBad)
  const detectBadInstallation = useAction(actions.settingsPage.detectBadInstallation.start)
  const setGame = useAction(actions.settingsPage.game.type)
  const setGameFolder = useAction(actions.settingsPage.game.folder)
  const setMo2 = useAction(actions.settingsPage.mo2.use)
  const setMo2Instance = useAction(actions.settingsPage.mo2.instance)
  const detectMo2SourcesFolder = useAction(actions.settingsPage.mo2.detectSources.start)

  const onClickRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as Games

      if (![Games.LE, Games.SE].includes(value)) {
        return
      }

      setGame(value)
    },
    [setGame]
  )

  useEffect(() => {
    if (!game || !gameFolder || (mo2 && !mo2Instance)) {
      return
    }

    detectBadInstallation({ gamePath: gameFolder, gameType: game, isUsingMo2: mo2, mo2Path: mo2Instance })
  }, [detectBadInstallation, gameFolder, game, mo2, mo2Instance])

  useEffect(() => {
    if (mo2 && !!mo2Instance && !!game) {
      detectMo2SourcesFolder([mo2Instance, game])
    }
  }, [detectMo2SourcesFolder, mo2, mo2Instance, game])

  useEffect(() => {
    if (!mo2 || typeof detectSourcesFoldersError !== 'undefined') {
      setStringLimitation(0)

      return
    }

    setStringLimitation(
      mo2Service.calculateLimitation({
        folders: detectedMo2SourcesFolders,
        game,
        gamePath: gameFolder,
        mo2Instance
      })
    )
  }, [detectedMo2SourcesFolders, detectSourcesFoldersError, game, gameFolder, mo2Instance, setStringLimitation, mo2])

  const onChangeGameFolder = useCallback(
    (value: string) => {
      setGameFolder(value)
    },
    [setGameFolder]
  )

  const onChangeMo2Instance = useCallback(
    (value: string) => {
      setStringLimitation(0)
      setMo2Instance(value)
    },
    [setMo2Instance]
  )

  const onChangeMo2 = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMo2(e.currentTarget.checked)
    },
    [setMo2]
  )

  const onClickRefreshInstallation = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      detectBadInstallation({ gamePath: gameFolder, gameType: game, isUsingMo2: mo2, mo2Path: mo2Instance })
    },
    [detectBadInstallation, gameFolder, game, mo2, mo2Instance]
  )

  const onClickPageRefresh = useCallback(() => {
    if (loading) {
      return
    }

    if (installationIsBad) {
      detectBadInstallation({ gamePath: gameFolder, gameType: game, isUsingMo2: mo2, mo2Path: mo2Instance })
    }

    if (!!mo2Instance) {
      detectMo2SourcesFolder([mo2Instance, game])
    }
  }, [loading, detectBadInstallation, detectMo2SourcesFolder, installationIsBad, gameFolder, game, mo2, mo2Instance])

  return (
    <SettingsContextProvider limitation={actualMo2FolderStringLimitation}>
      <PageAppBar
        title={t('page.settings.title')}
        actions={[
          {
            text: t('page.settings.actions.refresh'),
            icon: <RefreshIcon />,
            onClick: onClickPageRefresh
          }
        ]}
      />

      <Page>
        <div className={classes.page}>
          <SettingsVersion version={startingVersion} />

          <SettingsGame
            onClickRadio={onClickRadio}
            onChangeGameFolder={onChangeGameFolder}
            onClickRefreshInstallation={onClickRefreshInstallation}
          />

          <SettingsMo2 onChangeMo2={onChangeMo2} onChangeMo2Instance={onChangeMo2Instance} />
        </div>
      </Page>
    </SettingsContextProvider>
  )
}

export default SettingsPage
