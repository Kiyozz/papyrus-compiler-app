import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import RefreshIcon from '@material-ui/icons/Refresh'
import Alert from '@material-ui/lab/Alert'
import debounce from 'lodash-es/debounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppButton from '../../components/app-button/app-button'
import AppDialogFolderInput from '../../components/app-dialog-folder-input/app-dialog-folder-input'
import AppPaper from '../../components/app-paper/app-paper'
import AppTitle from '../../components/app-title/app-title'
import { Games } from '../../enums/games.enum'
import { GameService } from '../../services/game.service'
import './app-settings.scss'
import { Mo2Service } from '../../services/mo2.service'

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

const AppSettings: React.FC<Props> = ({ game, gameFolder, installationIsBad, mo2, mo2Instance, detectedMo2SourcesFolders, detectBadInstallation, loading, detectSourcesFoldersError, setGame, setGameFolder, setMo2, setMo2Instance, detectMo2SourcesFolder }) => {
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

  const Mo2SourcesFoldersList = useMemo(() => {
    if (detectedMo2SourcesFolders && detectedMo2SourcesFolders.length === 0) {
      return null
    }

    return detectedMo2SourcesFolders
      .map((folder) => folder.replace(`${mo2Instance}\\mods\\`, ''))
      .map((folder) => {
        return (
          <li
            className="app-settings-folder"
            key={folder}
          >
            {folder}
          </li>
        )
      })
  }, [detectedMo2SourcesFolders, mo2Instance])

  const onClickUpdateDetectedSourcesFolders = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.currentTarget.blur()

    detectMo2SourcesFolder(mo2Instance, game)
  }, [detectMo2SourcesFolder, mo2Instance, game])

  return (
    <Box className="app-settings container">
      <AppTitle className="mb-3">Settings</AppTitle>

      <div className="app-settings-content">
        <AppPaper>
          <h4>Game</h4>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup row value={game} onChange={onClickRadio}>
              <FormControlLabel value={Games.LE} control={<Radio />} label={Games.LE} />
              <FormControlLabel value={Games.SE} control={<Radio />} label={Games.SE} />
            </RadioGroup>
          </FormControl>
          <AppDialogFolderInput
            error={installationIsBad}
            label={`${game} folder (where ${gameService.toExecutable(game)} is located)`}
            value={gameFolder}
            onChange={onChangeGameFolder}
          />

          <Collapse in={installationIsBad}>
            <Alert
              severity="error"
              className="app-settings-alert"
              action={(
                <AppButton onClick={onClickRefreshInstallation}>
                  <RefreshIcon /> Refresh
                </AppButton>
              )}
            >
              <div>Installation seems invalid.</div>
              <div>Checks that you have extracted Scripts.zip (from Creation Kit)</div>
            </Alert>
          </Collapse>
        </AppPaper>

        <AppPaper>
          <h4>Mod Organizer 2</h4>

          <FormControlLabel
            control={(
              <Checkbox
                className="form-check-input"
                id="mo2"
                name="mo2"
                checked={mo2}
                onChange={onChangeMo2}
              />
            )}
            label="Using Mod Organizer 2"
          />

          <Fade
            in={mo2}
            unmountOnExit
          >
            <div>
              <AppDialogFolderInput
                error={!!detectSourcesFoldersError}
                value={mo2Instance}
                label="MO2 Instance folder"
                onChange={onChangeMo2Instance}
              />

              <Fade
                in={!!Mo2SourcesFoldersList || !!detectSourcesFoldersError}
                unmountOnExit
              >
                <div>
                  <Collapse in={!!detectSourcesFoldersError}>
                    <Alert severity="error">
                      {detectSourcesFoldersError}
                    </Alert>
                  </Collapse>

                  <Collapse in={!!Mo2SourcesFoldersList}>
                    <h5 className="app-settings-label">
                      <span>Detected ({actualMo2FolderStringLimitation}/{mo2Service.windowsCmdLimitation})</span>

                      <AppButton
                        size="small"
                        className="app-settings-mo2-sources-folders-update"
                        onClick={onClickUpdateDetectedSourcesFolders}
                        disabled={loading}
                      >
                        <RefreshIcon /> Refresh
                      </AppButton>
                    </h5>

                    <ul className="app-settings-folders-list">
                      {Mo2SourcesFoldersList}
                    </ul>
                  </Collapse>
                </div>
              </Fade>
            </div>
          </Fade>
        </AppPaper>
      </div>
    </Box>
  )
}

export default AppSettings
