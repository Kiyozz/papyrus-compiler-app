import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './app-settings.scss'
import AppButton from '../../components/app-button/app-button'
import AppTitle from '../../components/app-title/app-title'
import { Games } from '../../enums/games.enum'
import AppDialogFolderInput from '../../components/app-dialog-folder-input/app-dialog-folder-input'
import { CSSTransition } from 'react-transition-group'
import debounce from 'lodash-es/debounce'

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
  detectBadInstallation: (gamePath: string, gameType: Games) => void
}

type Props = StateProps & DispatchesProps

interface CalculateMo2StringLimitationOptions {
  folders: string[]
  mo2Instance: string
  gamePath: string
  game: Games
}

const windowsCmdLimitation = 8191

function calculateMo2StringLimitation({ folders, mo2Instance, gamePath, game }: CalculateMo2StringLimitationOptions): number {
  const sourcesType = game === 'Skyrim Special Edition' ? 'Source\\Scripts' : 'Scripts\\Source'
  const gameFolderData = gamePath + '\\Data\\' + sourcesType
  const gameFolderPapyrus = gamePath + '\\Papyrus Compiler\\PapyrusCompiler.exe'
  const mo2InstanceWithMods = mo2Instance + '\\mods'
  const flagLength = `-f="TESV_Papyrus_Flags.flg"`.length
  const output = `-o="${mo2Instance}\\overwrite\\${sourcesType}"`
  const spacesBetweenArgs = 4
  const averageScriptLength = 15
  const foldersSum = folders
    .map(folder => folder.replace(mo2Instance, ''))
    .reduce((previous, next) => {
      previous = next.length + previous

      return previous
    }, 0)

  return (
    gameFolderData.length +
    gameFolderPapyrus.length +
    mo2InstanceWithMods.length +
    flagLength +
    output.length +
    spacesBetweenArgs +
    averageScriptLength +
    foldersSum
  )
}

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

    detectBadInstallation(gameFolder, value)
  }, [setGame, mo2Instance, detectMo2SourcesFolder, mo2, detectBadInstallation, gameFolder])

  useEffect(() => {
    detectBadInstallation(gameFolder, game)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChangeGameFolder = useCallback(debounce((value: string) => {
    setGameFolder(value)
    detectBadInstallation(value, game)
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

  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault()
  }, [])

  const onClickRefreshInstallation = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    detectBadInstallation(gameFolder, game)
  }, [detectBadInstallation, gameFolder, game])

  useEffect(() => {
    if (!mo2 || typeof detectSourcesFoldersError !== 'undefined') {
      setStringLimitation(0)

      return
    }

    setStringLimitation(calculateMo2StringLimitation({
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
    <div className="app-settings container">
      <AppTitle className="mb-3">Settings</AppTitle>

      <div className="app-settings-content">
        <form onSubmit={onSubmitForm}>
          <div className="form-group">
            <h4>General</h4>

            <div>Game</div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                id="gameLE"
                type="radio"
                name="game"
                value={Games.LE}
                onChange={onClickRadio}
                checked={game === Games.LE}
              />
              <label
                className="form-check-label"
                htmlFor="gameLE"
              >
                {Games.LE}
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                id="gameSE"
                type="radio"
                name="game"
                value={Games.SE}
                onChange={onClickRadio}
                checked={game === Games.SE}
              />
              <label
                className="form-check-label"
                htmlFor="gameSE"
              >
                {Games.SE}
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="gameFolder">{game} folder (where {game === Games.SE ? 'SkyrimSE.exe' : 'TESV.exe'} is located)</label>

            <AppDialogFolderInput
              id="gameFolder"
              name="gameFolder"
              value={gameFolder}
              onChange={onChangeGameFolder}
            />

            <CSSTransition
              timeout={150}
              in={installationIsBad}
              classNames="app-fade"
              mountOnEnter
              unmountOnExit
            >
              <div className="alert alert-danger app-settings-alert" role="alert">
                <div>Installation seems invalid.</div>
                <div>Checks that you have extracted Scripts.zip (from Creation Kit)</div>
                <AppButton onClick={onClickRefreshInstallation}>
                  <FontAwesomeIcon icon="sync-alt" spin={loading} />
                </AppButton>
              </div>
            </CSSTransition>
          </div>

          <div className="form-group">
            <h4>Mod Organizer 2</h4>

            <div className="form-check">
              <input
                className="form-check-input"
                id="mo2"
                name="mo2"
                type="checkbox"
                checked={mo2}
                onChange={onChangeMo2}
              />
              <label
                className="form-check-label"
                htmlFor="mo2"
              >
                Using Mod Organizer 2
              </label>
            </div>
          </div>

          <CSSTransition
            in={mo2}
            timeout={300}
            classNames="app-slide-inner"
            mountOnEnter
            unmountOnExit
          >
            <>
              <div className="form-group">
                <label htmlFor="mo2Instance">Mod Organizer 2 Instance</label>

                <AppDialogFolderInput
                  id="mo2Instance"
                  name="mo2Instance"
                  value={mo2Instance}
                  onChange={onChangeMo2Instance}
                />
              </div>

              <CSSTransition
                timeout={300}
                classNames="app-fade"
                in={!!Mo2SourcesFoldersList || !!detectSourcesFoldersError}
                mountOnEnter
                unmountOnExit
              >
                <>
                  <h5 className="app-settings-label">
                    Detected sources folders ({actualMo2FolderStringLimitation}/{windowsCmdLimitation})

                    {Mo2SourcesFoldersList && (
                      <button
                        className="btn btn-primary btn-sm app-settings-mo2-sources-folders-update"
                        onClick={onClickUpdateDetectedSourcesFolders}
                        disabled={loading}
                      >
                        Update
                      </button>
                    )}
                  </h5>

                  {detectSourcesFoldersError && (
                    <span className="app-error">
                      {detectSourcesFoldersError}
                    </span>
                  )}

                  {Mo2SourcesFoldersList && (
                    <ul className="app-settings-folders-list">
                      {Mo2SourcesFoldersList}
                    </ul>
                  )}
                </>
              </CSSTransition>
            </>
          </CSSTransition>
        </form>
      </div>
    </div>
  )
}

export default AppSettings
