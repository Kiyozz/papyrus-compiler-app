import { Games, GameType } from '../../../common/game'
import RefreshIcon from '@material-ui/icons/Refresh'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { usePageContext } from '../../components/page/page-context'
import actions from '../../redux/actions'
import { useAction, useStoreSelector } from '../../redux/use-store-selector'
import SettingsContextProvider from './settings-context'
import { SettingsGame } from './settings-game'
import SettingsMo2 from './settings-mo2'
import classes from './settings-page.module.scss'
import { debounce } from 'lodash-es'

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const {
    config: { gameType, gamePath, mo2 },
    updateConfig,
    refreshConfig
  } = usePageContext()

  const debouncedUpdateConfig = useMemo(() => debounce(updateConfig, 500), [
    updateConfig
  ])

  const useMo2 = mo2.use
  const mo2Instance = mo2.instance
  const loading = useStoreSelector(state => state.taskLoading)
  const installationIsBad = useStoreSelector(
    state => state.settings.installationIsBad
  )
  const detectBadInstallation = useAction(
    actions.settingsPage.detectBadInstallation.start
  )
  const setGame = useCallback(
    (game: GameType) => updateConfig({ gameType: game }),
    [updateConfig]
  )
  const setGameFolder = useCallback(
    (path: string) => debouncedUpdateConfig({ gamePath: path }),
    [debouncedUpdateConfig]
  )
  const setCompilerPath = useCallback(
    (path: string) => debouncedUpdateConfig({ compilerPath: path }),
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
  const setEmptyDetectedSourcesFolders = useAction(
    actions.settingsPage.mo2.detectSources.empty
  )
  const detectMo2SourcesFolder = useAction(
    actions.settingsPage.mo2.detectSources.start
  )
  const setInstallationIsBad = useAction(actions.settingsPage.installationIsBad)

  const debouncedDetectBadInstallation = useMemo(
    () => debounce(detectBadInstallation, 500),
    [detectBadInstallation]
  )

  const onClickRadio = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInstallationIsBad(false)
      const value = e.target.value as GameType

      if (![Games.LE, Games.SE].includes(value)) {
        return
      }

      setGame(value)
    },
    [setGame, setInstallationIsBad]
  )

  useEffect(() => {
    if (!gameType || !gamePath || (useMo2 && !mo2Instance)) {
      return
    }

    debouncedDetectBadInstallation()
  }, [debouncedDetectBadInstallation, gamePath, gameType, useMo2, mo2Instance])

  useEffect(() => {
    if (useMo2 && !!mo2Instance && !!gameType) {
      detectMo2SourcesFolder()
    }
  }, [detectMo2SourcesFolder, useMo2, mo2Instance, gameType])

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

      if (checked) {
        setMo2(checked)
      } else {
        setDisableMo2()
        setEmptyDetectedSourcesFolders()
      }
    },
    [setDisableMo2, setEmptyDetectedSourcesFolders, setMo2]
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

    if (installationIsBad) {
      detectBadInstallation()
    }

    if (!!mo2Instance) {
      detectMo2SourcesFolder()
    }

    refreshConfig()
  }, [
    loading,
    installationIsBad,
    mo2Instance,
    refreshConfig,
    detectBadInstallation,
    detectMo2SourcesFolder
  ])

  return (
    <SettingsContextProvider>
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
          <SettingsGame
            onClickRadio={onClickRadio}
            onChangeGameFolder={onChangeGameFolder}
            onClickRefreshInstallation={onClickRefreshInstallation}
            onChangeCompilerPath={onChangeCompilerPath}
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

export default SettingsPage
