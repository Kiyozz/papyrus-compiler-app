import React, { useCallback } from 'react'
import './app-settings.scss'
import AppTitle from '../../components/app-title/app-title'
import { Games } from '../../enums/games.enum'
import AppDialogFolderInput from '../../components/app-dialog-folder-input/app-dialog-folder-input'
import { CSSTransition } from 'react-transition-group'
import { debounce } from 'lodash-es'

export interface StateProps {
  game: Games
  gameFolder: string
  mo2: boolean
  mo2Instance: string
}

export interface DispatchesProps {
  setGame: (game: Games) => void
  setGameFolder: (gameFolder: string) => void
  setMo2: (mo2: boolean) => void
  setMo2Instance: (mo2Instance: string) => void
}

type Props = StateProps & DispatchesProps

const AppSettings: React.FC<Props> = ({ game, gameFolder, mo2, mo2Instance, setGame, setGameFolder, setMo2, setMo2Instance }) => {
  const onClickRadio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (![Games.LE, Games.SE].includes(value as Games)) {
      return
    }

    setGame(value as Games)
  }, [setGame])

  const onChangeGameFolder = useCallback(debounce((value: string) => {
    setGameFolder(value)
  }, 300), [setGameFolder])

  const onChangeMo2Instance = useCallback(debounce((value: string) => {
    setMo2Instance(value)
  }, 300), [setMo2Instance])

  const onChangeMo2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMo2(e.currentTarget.checked)
  }, [setMo2])

  const onSubmitForm = useCallback((e: React.FormEvent) => {
    e.preventDefault()
  }, [])

  console.log(game)

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
            <div className="form-group">
              <label htmlFor="mo2Instance">Mod Organizer 2 Instance</label>

              <AppDialogFolderInput
                id="mo2Instance"
                name="mo2Instance"
                value={mo2Instance}
                onChange={onChangeMo2Instance}
              />
            </div>
          </CSSTransition>
        </form>
      </div>
    </div>
  )
}

export default AppSettings
