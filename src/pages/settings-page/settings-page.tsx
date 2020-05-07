import RefreshIcon from '@material-ui/icons/Refresh'
import debounce from 'lodash-es/debounce'
import React from 'react'
import { connect } from 'react-redux'

import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { Games } from '../../enums/games.enum'
import {
  actionDetectBadInstallation,
  actionDetectMo2SourcesFolders,
  actionSetGame,
  actionSetGameFolder,
  actionSetMo2Instance,
  actionSetUseMo2
} from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'
import { Mo2Service } from '../../services/mo2.service'
import SettingsContextProvider from './settings-context'
import SettingsGame from './settings-game'
import SettingsMo2 from './settings-mo2'
import classes from './settings-page.module.scss'
import SettingsVersion from './settings-version'

export interface StateProps {
  game: Games
  gameFolder: string
  mo2: boolean
  mo2Instance: string
  detectedMo2SourcesFolders: string[]
  loading: boolean
  detectSourcesFoldersError: string | undefined
  installationIsBad: boolean
  startingVersion: string
}

export interface DispatchesProps {
  setGame: (game: Games) => void
  setGameFolder: (gameFolder: string) => void
  setMo2: (mo2: boolean) => void
  setMo2Instance: (mo2Instance: string) => void
  detectMo2SourcesFolder: (mo2Instance: string, game: string) => void
  detectBadInstallation: (gamePath: string, gameType: Games, isUsingMo2: boolean, mo2Path: string) => void
}

const mo2Service = new Mo2Service()

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ startingVersion, game, gameFolder, installationIsBad, mo2, mo2Instance, detectedMo2SourcesFolders, detectBadInstallation, loading, detectSourcesFoldersError, setGame, setGameFolder, setMo2, setMo2Instance, detectMo2SourcesFolder }) => {
  const [actualMo2FolderStringLimitation, setStringLimitation] = React.useState<number>()
  const onClickRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Games

    if (![Games.LE, Games.SE].includes(value)) {
      return
    }

    setGame(value)
  }

  React.useEffect(() => {
    if (!gameFolder || (mo2 && !mo2Instance)) {
      return
    }

    detectBadInstallation(gameFolder, game, mo2, mo2Instance)
  }, [detectBadInstallation, gameFolder, game, mo2, mo2Instance])

  const onChangeGameFolder = debounce((value: string) => {
    setGameFolder(value)
    detectBadInstallation(value, game, mo2, mo2Instance)
  }, 300)

  const onChangeMo2Instance = debounce((value: string) => {
    setStringLimitation(0)
    setMo2Instance(value)

    if (value) {
      detectMo2SourcesFolder(value, game)
    }
  }, 300)

  const onChangeMo2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMo2(e.currentTarget.checked)
  }

  const onClickRefreshInstallation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    detectBadInstallation(gameFolder, game, mo2, mo2Instance)
  }

  React.useEffect(() => {
    if (mo2 && !!mo2Instance && !!game) {
      detectMo2SourcesFolder(mo2Instance, game)
    }
  }, [detectMo2SourcesFolder, mo2, mo2Instance, game])

  React.useEffect(() => {
    if (!mo2 || typeof detectSourcesFoldersError !== 'undefined') {
      setStringLimitation(0)

      return
    }

    setStringLimitation(mo2Service.calculateLimitation({
      folders: detectedMo2SourcesFolders,
      game,
      gamePath: gameFolder,
      mo2Instance
    }))
  }, [detectedMo2SourcesFolders, detectSourcesFoldersError, game, gameFolder, mo2Instance, setStringLimitation, mo2])

  const onClickPageRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      return
    }

    if (installationIsBad) {
      detectBadInstallation(gameFolder, game, mo2, mo2Instance)
    }

    detectMo2SourcesFolder(mo2Instance, game)
  }

  return (
    <SettingsContextProvider limitation={actualMo2FolderStringLimitation}>
      <PageAppBar
        title="Settings"
        actions={[{
          text: 'Refresh',
          icon: <RefreshIcon />,
          onClick: onClickPageRefresh
        }]}
      />

      <Page>
        <div className={classes.page}>
          <SettingsVersion version={startingVersion} />

          <SettingsGame
            onClickRadio={onClickRadio}
            onChangeGameFolder={onChangeGameFolder}
            onClickRefreshInstallation={onClickRefreshInstallation}
          />

          <SettingsMo2
            onChangeMo2={onChangeMo2}
            onChangeMo2Instance={onChangeMo2Instance}
          />
        </div>
      </Page>
    </SettingsContextProvider>
  )
}

const SettingsPage = connect(
  ({ settings, taskLoading: loading, error, changelog }: RootStore): StateProps => ({
    game: settings.game,
    gameFolder: settings.gameFolder,
    mo2: settings.mo2,
    mo2Instance: settings.mo2Instance,
    detectedMo2SourcesFolders: settings.mo2SourcesFolders,
    loading,
    detectSourcesFoldersError: error.detectSourcesFoldersFailed,
    installationIsBad: settings.installationIsBad,
    startingVersion: changelog.startingVersion
  }),
  (dispatch): DispatchesProps => ({
    setGame: game => dispatch(actionSetGame(game)),
    setGameFolder: gameFolder => dispatch(actionSetGameFolder(gameFolder)),
    setMo2: mo2 => dispatch(actionSetUseMo2(mo2)),
    setMo2Instance: mo2Instance => dispatch(actionSetMo2Instance(mo2Instance)),
    detectMo2SourcesFolder: (mo2Instance, game) => dispatch(actionDetectMo2SourcesFolders([mo2Instance, game])),
    detectBadInstallation: (gamePath, gameType, isUsingMo2, mo2Path ) => dispatch(actionDetectBadInstallation({ gamePath, gameType, isUsingMo2, mo2Path }))
  })
)(Component)

export default SettingsPage
