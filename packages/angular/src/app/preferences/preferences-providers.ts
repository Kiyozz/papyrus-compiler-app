import * as sessionLocalForageDrive from 'localforage-sessionstoragewrapper'
import { Themes } from '../common/enums/themes.enum'
import { LocalPreferences, PreferencesService, SessionPreferences } from './services/preferences.service'

export const APP_PREFERENCES_SESSION = 'APP_PREFERENCES_SESSION'
export const APP_PREFERENCES_LOCAL = 'APP_PREFERENCES_LOCAL'
export const APP_LOCALFORAGE = 'APP_LOCALFORAGE'

export const createSession = (localForage: LocalForage) => {
  const storage = localForage.createInstance({
    name: 'papyrus-compiler-app',
    storeName: 'session',
    driver: [sessionLocalForageDrive._driver, localForage.INDEXEDDB, localForage.LOCALSTORAGE]
  })

  return new PreferencesService<SessionPreferences>(storage, {
    group: null
  })
}

export const createLocal = (localForage: LocalForage) => {
  const storage = localForage.createInstance({ name: 'papyrus-compiler-app', storeName: 'local', driver: localForage.INDEXEDDB })

  return new PreferencesService<LocalPreferences>(storage, {
    flag: '',
    gamePathFolder: '',
    outputFolder: '',
    importsFolder: '',
    groups: [],
    theme: Themes.DARK
  })
}
