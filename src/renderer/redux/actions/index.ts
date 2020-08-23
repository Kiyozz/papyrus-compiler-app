import { createAction } from 'redux-actions'
import { CompilationLogsModel, ScriptModel } from '../../models'
import * as CONSTANTS from './constants'

const actions = {
  initialization: {
    start: createAction(CONSTANTS.APP_INITIALIZATION_START),
    success: createAction(CONSTANTS.APP_INITIALIZATION_SUCCESS),
    failed: createAction<Error>(CONSTANTS.APP_INITIALIZATION_FAILED)
  },
  changelog: {
    showNotes: createAction<boolean>(CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES),
    latestVersion: createAction<string>(CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION),
    version: createAction<string>(CONSTANTS.APP_CHANGELOG_SET_VERSION),
    latestNotes: {
      start: createAction(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES),
      success: createAction<string>(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_SUCCESS),
      failed: createAction<Error>(CONSTANTS.APP_CHANGELOG_GET_LATEST_NOTES_FAILED)
    }
  },
  compilationPage: {
    setScripts: createAction<ScriptModel[]>(CONSTANTS.APP_COMPILATION_SET_COMPILATION_SCRIPTS),
    compilation: {
      startWholeCompilation: createAction<ScriptModel[]>(CONSTANTS.APP_COMPILATION_START_COMPILATION),
      script: {
        start: createAction<ScriptModel>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_START),
        success: createAction<[ScriptModel, string]>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_SUCCESS),
        failed: createAction<[ScriptModel, string]>(CONSTANTS.APP_COMPILATION_START_COMPILATION_SCRIPT_FAILED)
      },
      finish: createAction(CONSTANTS.APP_COMPILATION_START_COMPILATION_FINISH)
    },
    logs: {
      set: createAction<CompilationLogsModel>(CONSTANTS.APP_COMPILATION_LOGS_SET_LOGS),
      popupToggle: createAction<boolean>(CONSTANTS.APP_COMPILATION_LOGS_POPUP_TOGGLE)
    }
  },
  settingsPage: {
    installationIsBad: createAction<boolean>(CONSTANTS.APP_SETTINGS_INSTALLATION_IS_BAD),
    detectBadInstallation: {
      start: createAction(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION),
      success: createAction<boolean>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS),
      failed: createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_FAILED)
    },
    mo2: {
      detectSources: {
        start: createAction(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS),
        success: createAction<string[]>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS),
        failed: createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED),
        empty: createAction(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_EMPTY)
      }
    }
  },
  task: {
    loading: createAction<boolean>(CONSTANTS.APP_TASK_LOADING_SET)
  }
}

export { CONSTANTS }

export default actions
