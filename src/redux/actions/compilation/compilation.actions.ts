import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'
import { ScriptModel } from '../../../models'

export const actionSetCompilationScripts = createAction<ScriptModel[]>(CONSTANTS.APP_COMPILATION_SET_COMPILATION_SCRIPTS)

export const actionStartCompilation = createAction<ScriptModel[]>(CONSTANTS.APP_COMPILATION_START_COMPILATION)
export const actionStartCompilationScriptStart = createAction<ScriptModel>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_START)
export const actionStartCompilationScriptSuccess = createAction<ScriptModel>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS)
export const actionStartCompilationScriptFailed = createAction<[ScriptModel, string]>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED)
export const actionStartCompilationFinish = createAction(CONSTANTS.APP_COMPILATION_START_COMPILATION_FINISH)
