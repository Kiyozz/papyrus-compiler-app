/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { CompilationLogsInterface, ScriptInterface } from '../../interfaces'
import { CONSTANTS } from '../actions'

export interface CompilationLogsState {
  logs: CompilationLogsInterface
  popupOpen: boolean
}

const initialState: CompilationLogsState = {
  logs: [],
  popupOpen: false
}

export default function compilationLogsReducer(
  state = initialState,
  action: AnyAction
): CompilationLogsState {
  switch (action.type) {
    case CONSTANTS.APP_COMPILATION_LOGS_POPUP_TOGGLE:
      return {
        ...state,
        popupOpen: action.payload ?? false
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION:
      return {
        logs: [],
        popupOpen: false
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS:
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED:
      const payload: [ScriptInterface, string] = action.payload

      if (typeof payload[1] !== 'string') {
        return {
          ...state,
          logs: [
            ...state.logs,
            [
              payload[0],
              'An error occurred. For more info, checks the log file (CTRL + ALT + J when focused on the app).'
            ]
          ]
        }
      }

      return {
        ...state,
        logs: [...state.logs, payload]
      }
    default:
      return state
  }
}
