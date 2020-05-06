import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import RefreshIcon from '@material-ui/icons/Refresh'
import Alert from '@material-ui/lab/Alert'

import cx from 'classnames'
import debounce from 'lodash-es/debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import Title from '../../components/title/title'
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
import { GameService } from '../../services/game.service'
import { Mo2Service } from '../../services/mo2.service'
import SettingsContextProvider from './settings-context'
import SettingsMo2 from './settings-mo2'
import classes from './settings-page.module.scss'

export interface StateProps {
  game: Games
  gameFolder: string
  mo2: boolean
  mo2Instance: string
  detectedMo2SourcesFolders: string[]
  loading: boolean
  detectSourcesFoldersError: string | undefined
  installationIsBad: boolean
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
const gameService = new GameService()

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ game, gameFolder, installationIsBad, mo2, mo2Instance, detectedMo2SourcesFolders, detectBadInstallation, loading, detectSourcesFoldersError, setGame, setGameFolder, setMo2, setMo2Instance, detectMo2SourcesFolder }) => {
  const [actualMo2FolderStringLimitation, setStringLimitation] = useState<number>()
  const onClickRadio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Games

    if (![Games.LE, Games.SE].includes(value)) {
      return
    }

    setGame(value)

    if (mo2 && mo2Instance.length > 0) {
      detectMo2SourcesFolder(mo2Instance, value)
    }

    detectBadInstallation(gameFolder, value, mo2, mo2Instance)
  }, [setGame, mo2Instance, detectMo2SourcesFolder, mo2, detectBadInstallation, gameFolder])

  useEffect(() => {
    detectBadInstallation(gameFolder, game, mo2, mo2Instance)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeGameFolder = useCallback(debounce((value: string) => {
    setGameFolder(value)
    detectBadInstallation(value, game, mo2, mo2Instance)
  }, 300), [setGameFolder, detectBadInstallation, game])

  const onChangeMo2Instance = useCallback(debounce((value: string) => {
    setStringLimitation(0)
    setMo2Instance(value)

    if (value) {
      detectMo2SourcesFolder(value, game)
    }
  }, 300), [setMo2Instance])

  const onChangeMo2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMo2(e.currentTarget.checked)
  }, [setMo2])

  const onClickRefreshInstallation = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    detectBadInstallation(gameFolder, game, mo2, mo2Instance)
  }, [detectBadInstallation, gameFolder, game, mo2, mo2Instance])

  useEffect(() => {
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

  const onClickUpdateDetectedSourcesFolders = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.blur()

    detectMo2SourcesFolder(mo2Instance, game)
  }, [detectMo2SourcesFolder, mo2Instance, game])

  return (
    <SettingsContextProvider limitation={actualMo2FolderStringLimitation}>
      <Box className={cx(classes.page, 'container')}>
        <Title>Settings</Title>

        <Paper>
          <h4>Game</h4>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row value={game} onChange={onClickRadio}>
              <FormControlLabel value={Games.LE} control={<Radio />} label={Games.LE} />
              <FormControlLabel value={Games.SE} control={<Radio />} label={Games.SE} />
            </RadioGroup>
          </FormControl>
          <FolderTextField
            error={installationIsBad}
            label={`${game} folder (where ${gameService.toExecutable(game)} is located)`}
            value={gameFolder}
            onChange={onChangeGameFolder}
          />

          <Collapse in={installationIsBad}>
            <Alert
              severity="error"
              className={classes.alert}
              action={(
                <Button onClick={onClickRefreshInstallation} startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              )}
            >
              <div>Installation seems invalid.</div>
              <div>Checks that you have extracted Scripts.zip from Creation Kit</div>
            </Alert>
          </Collapse>
        </Paper>

        <SettingsMo2
          onChangeMo2={onChangeMo2}
          onChangeMo2Instance={onChangeMo2Instance}
          onClickUpdateDetectedSourcesFolders={onClickUpdateDetectedSourcesFolders}
        />
      </Box>
    </SettingsContextProvider>
  )
}

const SettingsPage = connect(
  ({ settings, taskLoading: loading, error }: RootStore): StateProps => ({
    game: settings.game,
    gameFolder: settings.gameFolder,
    mo2: settings.mo2,
    mo2Instance: settings.mo2Instance,
    detectedMo2SourcesFolders: settings.mo2SourcesFolders,
    loading,
    detectSourcesFoldersError: error.detectSourcesFoldersFailed,
    installationIsBad: settings.installationIsBad
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
