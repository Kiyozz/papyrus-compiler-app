/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { AnyAction } from 'redux'
import { CONSTANTS } from '../actions'

export type TaskLoadingState = boolean

const initialState: TaskLoadingState = false

export default function taskLoadingReducer(
  state = initialState,
  action: AnyAction
): TaskLoadingState {
  if (action.type === CONSTANTS.APP_TASK_LOADING_SET) {
    return action.payload || false
  }

  return state
}
