/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'
import findScriptInList from '../../utils/scripts/find-script-in-list'
import { CONSTANTS } from '../actions'
import { uniqArray } from '../../utils/uniq-array'

export interface CompilationState {
  compilationScripts: ScriptInterface[]
  isCompilationRunning: boolean
}

const initialState: CompilationState = {
  compilationScripts: [],
  isCompilationRunning: false
}

export default function compilationReducer(
  state = initialState,
  action: AnyAction
): CompilationState {
  switch (action.type) {
    case CONSTANTS.APP_COMPILATION_SET_COMPILATION_SCRIPTS:
      return {
        ...state,
        compilationScripts: action.payload || []
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_START:
      const script = state.compilationScripts.find(
        s => s.id === action.payload.id
      )

      if (!script) {
        return state
      }

      script.status = ScriptStatus.RUNNING

      return {
        ...state,
        compilationScripts: uniqArray(
          [...state.compilationScripts, script],
          ['id']
        )
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION:
      const scripts = state.compilationScripts.map(s => {
        s.status = ScriptStatus.IDLE

        return s
      })

      return {
        ...state,
        compilationScripts: scripts,
        isCompilationRunning: true
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS:
      const scriptSuccessAction = findScriptInList(
        state.compilationScripts,
        action.payload[0]?.id,
        ScriptStatus.SUCCESS
      )

      if (!scriptSuccessAction) {
        return state
      }

      return {
        ...state,
        compilationScripts: uniqArray(
          [...state.compilationScripts, scriptSuccessAction],
          ['id']
        )
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED:
      const scriptFailedAction = findScriptInList(
        state.compilationScripts,
        action.payload[0]?.id,
        ScriptStatus.FAILED
      )

      if (!scriptFailedAction) {
        return state
      }

      return {
        ...state,
        compilationScripts: uniqArray(
          [...state.compilationScripts, scriptFailedAction],
          ['id']
        )
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_FINISH:
      return {
        ...state,
        isCompilationRunning: false
      }
    default:
      return state
  }
}
