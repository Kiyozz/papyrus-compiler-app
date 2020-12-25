/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { CONSTANTS } from '../actions'

interface LocalSettings {
  installationIsBad: boolean
  mo2: {
    sources: string[]
    sourcesError?: Error
  }
  isDrawerExpand: boolean
}

export type SettingsState = LocalSettings

export default function createSettingsReducer(prefix: string) {
  const isDrawerExpandKey = `${prefix}/${CONSTANTS.APP_SETTINGS_IS_EXPAND_SET}`
  const isDrawerExpandSaved =
    (localStorage.getItem(isDrawerExpandKey) ?? 'true') === 'true'

  const defaultInitial: LocalSettings = {
    installationIsBad: false,
    mo2: {
      sources: []
    },
    isDrawerExpand: isDrawerExpandSaved
  }

  return function settingsReducer(
    state = defaultInitial,
    action: AnyAction
  ): SettingsState {
    switch (action.type) {
      case CONSTANTS.APP_SETTINGS_IS_EXPAND_SET:
        const drawerValue = action.payload ?? true

        localStorage.setItem(isDrawerExpandKey, `${drawerValue}`)

        return {
          ...state,
          isDrawerExpand: action.payload ?? true
        }
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS:
        return {
          ...state,
          mo2: {
            sources: action.payload ?? [],
            sourcesError: undefined
          }
        }
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED:
        return {
          ...state,
          mo2: {
            sources: [],
            sourcesError: action.payload
          }
        }
      case CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_EMPTY:
        return {
          ...state,
          mo2: {
            sources: [],
            sourcesError: undefined
          }
        }
      case CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS:
        return {
          ...state,
          installationIsBad: !(action.payload ?? true)
        }
      case CONSTANTS.APP_SETTINGS_INSTALLATION_IS_BAD:
        return {
          ...state,
          installationIsBad: action.payload ?? false
        }
      default:
        return state
    }
  }
}
