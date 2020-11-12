import { AnyAction, Middleware } from 'redux'
import { RootStore } from '../../stores/root.store'
import { isProduction } from '../../../utils/is-production'

const logMiddleware: Middleware<unknown, RootStore> = store => next => async (
  action: AnyAction
) => {
  const production = await isProduction()

  if (production) {
    return next(action)
  }

  console.groupCollapsed(`ACTION = ${action.type}`)

  if (typeof action.payload !== 'undefined') {
    console.log('PAYLOAD =', action.payload)
  }

  const result = next(action)

  console.log('RESULT =', store.getState())
  console.groupEnd()

  return result
}

export default logMiddleware
