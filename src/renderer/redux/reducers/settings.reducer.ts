/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { CONSTANTS } from '../actions'
import { BadErrorType } from '../../../common/interfaces/bad-error.type'

interface LocalSettings {
  isInstallationBad: BadErrorType
  isDrawerExpand: boolean
}

export type SettingsState = LocalSettings

export default function createSettingsReducer(prefix: string) {
  const isDrawerExpandKey = `${prefix}/${CONSTANTS.APP_SETTINGS_IS_EXPAND_SET}`
  const isDrawerExpandSaved =
    (localStorage.getItem(isDrawerExpandKey) ?? 'true') === 'true'

  const defaultInitial: LocalSettings = {
    isInstallationBad: false,
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
      case CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS:
        return {
          ...state,
          isInstallationBad: action.payload ?? false
        }
      case CONSTANTS.APP_SETTINGS_INSTALLATION_IS_BAD:
        return {
          ...state,
          isInstallationBad: action.payload ?? false
        }
      default:
        return state
    }
  }
}
