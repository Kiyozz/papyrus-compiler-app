import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'
import { ScriptModel } from '../../models'

export interface CompilationLogsState {
  logs: Array<[ScriptModel, string]>
}

const initialState: CompilationLogsState = {
  logs: []
}

export default function compilationLogsReducer(state = initialState, action: AnyAction): CompilationLogsState {
  switch (action.type) {
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS:
    case CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED:
      return {
        ...state,
        logs: [...state.logs, action.payload] || []
      }
    default:
      return state
  }
}
