import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'

export type InitializationState = boolean

const initialState: InitializationState = false

export default function initializationReducer(state = initialState, action: AnyAction): InitializationState {
  if (action.type === CONSTANTS.APP_INITIALIZATION_SUCCESS) {
    return true
  }

  return state
}
