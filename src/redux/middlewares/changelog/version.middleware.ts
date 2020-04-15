import { Middleware } from 'redux'
import * as CONSTANTS from '../../actions/constants'
import { RootStore } from '../../stores/root.store'

type VersionMiddleware = (prefix: string) => Middleware<{}, RootStore>

const versionMiddleware: VersionMiddleware = (prefix: string) => () => next => action => {
  if (action.type === CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION) {
    localStorage.setItem(`${prefix}/${CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION}`, action.payload || '')
  }

  if (action.type === CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES) {
    localStorage.setItem(`${prefix}/${CONSTANTS.APP_CHANGELOG_SET_SHOW_NOTES}`, `${action.payload}` || 'false')
  }

  return next(action)
}

export default versionMiddleware
