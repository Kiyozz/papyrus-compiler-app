import * as CONSTANTS from '../constants'
import { createAction } from 'redux-actions'
import { Games } from '../../../enums/games.enum'

export const actionSetGame = createAction<Games>(CONSTANTS.APP_SETTINGS_SET_GAME)
export const actionSetGameFolder = createAction<string>(CONSTANTS.APP_SETTINGS_SET_GAME_FOLDER)
export const actionSetUseMo2 = createAction<boolean>(CONSTANTS.APP_SETTINGS_SET_USE_MO2)
export const actionSetMo2Instance = createAction<string>(CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE)

export const actionSetDetectedMo2SourcesFolders = createAction<string[]>(CONSTANTS.APP_SETTINGS_SET_DETECTED_SOURCES_FOLDERS)
export const actionDetectMo2SourcesFolders = createAction<[string, string]>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS)
export const actionDetectMo2SourcesFoldersSuccess = createAction<string[]>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS)
export const actionDetectMo2SourcesFoldersFailed = createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_FAILED)

export const actionDetectBadInstallation = createAction<{ gamePath: string, gameType: Games }>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION)
export const actionDetectBadInstallationSuccess = createAction<boolean>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_SUCCESS)
export const actionDetectBadInstallationFailed = createAction<Error>(CONSTANTS.APP_SETTINGS_DETECT_BAD_INSTALLATION_FAILED)
