import { Middleware } from 'redux'
import { GroupModel } from '../../../models'
import actions, { CONSTANTS } from '../../actions'
import { RootStore } from '../../stores/root.store'

function transformPayload(payload: any) {
  if (payload === false) {
    return 'false'
  }

  if (Array.isArray(payload) || typeof payload === 'object') {
    return JSON.stringify(payload)
  }

  return payload || ''
}

type StorageMiddleware = (prefix: string) => Middleware<unknown, RootStore>

const storageMiddleware: StorageMiddleware = (prefix: string) => store => next => action => {
  const actionsToListen = [
    CONSTANTS.APP_SETTINGS_SET_GAME_FOLDER,
    CONSTANTS.APP_SETTINGS_SET_USE_MO2,
    CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE,
    CONSTANTS.APP_SETTINGS_SET_GAME
  ]

  if (action.type === CONSTANTS.APP_GROUPS_SAVE_GROUPS_TO_LOCAL) {
    const groups: GroupModel[] = action.payload

    localStorage.setItem(`${prefix}/${CONSTANTS.APP_GROUPS_SAVE_GROUPS}`, JSON.stringify(groups || []))
  }

  if (action.type === CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS) {
    const files: string[] = action.payload

    localStorage.setItem(`${prefix}/${CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS}`, JSON.stringify(files || []))
  }

  if (action.type === CONSTANTS.APP_INITIALIZATION_RESTORE_SETTINGS) {
    const savedGroupsString = localStorage.getItem(`${prefix}/${CONSTANTS.APP_GROUPS_SAVE_GROUPS}`) || '[]'

    const groups: GroupModel[] = JSON.parse(savedGroupsString)

    store.dispatch(actions.groupsPage.save(groups))

    actionsToListen.forEach(actionToListen => {
      const key = `${prefix}/${actionToListen}`
      let item = null

      try {
        const savedItemString = localStorage.getItem(key)

        if (!savedItemString) {
          item = ''
        } else {
          item = JSON.parse(savedItemString)
        }
      } catch (e) {
        item = localStorage.getItem(key)
      }

      if (item) {
        store.dispatch({
          type: actionToListen,
          payload: item === 'true' ? true : item,
          ignoreStorageMiddleware: true
        })
      }
    })
  }

  if (action.ignoreStorageMiddleware || !actionsToListen.includes(action.type)) {
    return next(action)
  }

  if (action.type === CONSTANTS.APP_SETTINGS_SET_USE_MO2 && !action.payload) {
    localStorage.setItem(`${prefix}/${CONSTANTS.APP_SETTINGS_SET_MO2_INSTANCE}`, '')
    localStorage.setItem(`${prefix}/${CONSTANTS.APP_SETTINGS_DETECT_SOURCES_FOLDERS_SUCCESS}`, '[]')

    store.dispatch(actions.settingsPage.mo2.instance(''))
    store.dispatch(actions.settingsPage.mo2.detectSources.success([]))
  }

  localStorage.setItem(`${prefix}/${action.type}`, transformPayload(action.payload))

  return next(action)
}

export default storageMiddleware
