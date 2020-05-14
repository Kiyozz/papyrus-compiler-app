import find from 'lodash-es/find'
import uniqBy from 'lodash-es/uniqBy'
import { AnyAction } from 'redux'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptModel } from '../../models'
import findScriptInList from '../../utils/scripts/find-script-in-list'
import * as CONSTANTS from '../actions/constants'

export interface CompilationState {
  compilationScripts: ScriptModel[]
  isCompilationRunning: boolean
}

const initialState: CompilationState = {
  compilationScripts: [],
  isCompilationRunning: false
}

export default function compilationReducer(state = initialState, action: AnyAction): CompilationState {
  switch (action.type) {
    case CONSTANTS.APP_COMPILATION_SET_COMPILATION_SCRIPTS:
      return {
        ...state,
        compilationScripts: action.payload || []
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_START:
      const script = find(state.compilationScripts, { id: action.payload.id })

      if (!script) {
        return state
      }

      script.status = ScriptStatus.RUNNING

      return {
        ...state,
        compilationScripts: uniqBy([...state.compilationScripts, script], 'id')
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION:
      const scripts = state.compilationScripts.map(script => {
        script.status = ScriptStatus.IDLE

        return script
      })

      return {
        ...state,
        compilationScripts: scripts,
        isCompilationRunning: true
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS:
      const scriptSuccessAction = findScriptInList(state.compilationScripts, action.payload[0]?.id, ScriptStatus.SUCCESS)

      if (!scriptSuccessAction) {
        return state
      }

      return {
        ...state,
        compilationScripts: uniqBy([...state.compilationScripts, scriptSuccessAction], 'id')
      }
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED:
      const scriptFailedAction = findScriptInList(state.compilationScripts, action.payload[0]?.id, ScriptStatus.FAILED)

      if (!scriptFailedAction) {
        return state
      }

      return {
        ...state,
        compilationScripts: uniqBy([...state.compilationScripts, scriptFailedAction], 'id')
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
