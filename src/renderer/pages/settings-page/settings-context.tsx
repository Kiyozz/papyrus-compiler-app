import React, { createContext, useContext, useMemo } from 'react'
import { SettingsState } from '../../redux/reducers/settings.reducer'
import { useStoreSelector } from '../../redux/use-store-selector'

interface StateProps extends SettingsState {
  loading: boolean
}

type SettingsContextInterface = StateProps

const SettingsContext = createContext({} as SettingsContextInterface)

export const useSettings = () => useContext(SettingsContext)

const SettingsContextProvider: React.FC = ({ children, ...props }) => {
  const state = useStoreSelector(({ settings, taskLoading }) => ({
    ...settings,
    loading: taskLoading
  }))

  const value = useMemo(
    () => ({
      ...props,
      ...state
    }),
    [state, props]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContextProvider
