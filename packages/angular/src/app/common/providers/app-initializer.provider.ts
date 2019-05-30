import * as sessionStorageDriver from 'localforage-sessionstoragewrapper'
import { PreferencesService } from '../../preferences/services/preferences.service'

export function appInitializer(local: PreferencesService, session: PreferencesService, localForage: LocalForage) {
  return async () => {
    await localForage.defineDriver(sessionStorageDriver)
    await local.init()
    await session.init()
  }
}
