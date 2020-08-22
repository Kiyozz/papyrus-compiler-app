import { AnyAction, Middleware } from 'redux'
import { RootStore } from '../../stores/root.store'

const logMiddleware: Middleware<unknown, RootStore> = store => next => (action: AnyAction) => {
  if (process.env.NODE_ENV !== 'development') {
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
