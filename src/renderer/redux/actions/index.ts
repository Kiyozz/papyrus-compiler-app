import { createAction } from 'redux-actions'
import { Games } from '../../enums/games.enum'
import { CompilationLogsModel, GroupModel, ScriptModel } from '../../models'
import * as CONSTANTS from './constants'

const actions = {
  initialization: {
    start: createAction(CONSTANTS.APP_INITIALIZATION_START),
    success: createAction(CONSTANTS.APP_INITIALIZATION_SUCCESS),
    failed: createAction<Error>(CONSTANTS.APP_INITIALIZATION_FAILED)
  },
  openLogFile: createAction(CONSTANTS.APP_LOG_OPEN),
  changelog: {
    latestVersion: createAction<string>(CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION),
    showNotes: createAction<boolean>(CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES),
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
  groupsPage: {
    save: createAction<GroupModel[]>(CONSTANTS.APP_GROUPS_SAVE_GROUPS),
    saveToLocal: createAction<GroupModel[]>(CONSTANTS.APP_GROUPS_SAVE_GROUPS_TO_LOCAL),
    add: createAction<GroupModel>(CONSTANTS.APP_GROUPS_ADD_GROUP),
    edit: createAction<{ group: GroupModel; lastName: string }>(CONSTANTS.APP_GROUPS_EDIT_GROUP),
    remove: createAction<GroupModel>(CONSTANTS.APP_GROUPS_REMOVE_GROUP)
  },
  settingsPage: {
    restore: createAction(CONSTANTS.APP_INITIALIZATION_RESTORE_SETTINGS),
    detectBadInstallation: {
      start: createAction<{
        gamePath: string
        gameType: Games
        isUsingMo2: boolean
        mo2Path: string
      }>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION),
      success: createAction<boolean>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS),
      failed: createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_FAILED)
    },
    game: {
      type: createAction<Games>(CONSTANTS.APP_SETTINGS_SET_GAME),
      folder: createAction<string>(CONSTANTS.APP_SETTINGS_SET_GAME_FOLDER)
    },
    mo2: {
      use: createAction<boolean>(CONSTANTS.APP_SETTINGS_SET_USE_MO2),
      instance: createAction<string>(CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE),
      detectSources: {
        start: createAction<[string, string]>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS),
        success: createAction<string[]>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS),
        failed: createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED)
      }
    }
  },
  task: {
    loading: createAction<boolean>(CONSTANTS.APP_TASK_LOADING_SET)
  }
}

export { CONSTANTS }

export default actions
