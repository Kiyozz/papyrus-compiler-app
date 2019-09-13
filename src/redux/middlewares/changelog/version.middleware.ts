import { AnyAction, Middleware } from 'redux'
import * as CONSTANTS from '../../actions/constants'

const versionMiddleware: Middleware = () => next => (action: AnyAction) => {
  if (action.type === CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION) {
    localStorage.setItem(CONSTANTS.APP_CHANGELOG_SET_LATEST_VERSION, action.payload || '')
  }

  return next(action)
}

export default versionMiddleware
