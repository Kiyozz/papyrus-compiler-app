import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'
import { GroupModel } from '../../models'

export interface GroupsState {
  groups: GroupModel[]
}

const initialState: GroupsState = {
  groups: []
}

export default function groupsReducer(state = initialState, action: AnyAction): GroupsState {
  switch (action.type) {
    case CONSTANTS.APP_GROUPS_ADD_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload]
      }
    case CONSTANTS.APP_GROUPS_REMOVE_GROUP:
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload.id)
      }
    case CONSTANTS.APP_GROUPS_EDIT_GROUP:
      return {
        ...state,
        groups: state.groups.map((group) => {
          if (group.id === action.payload.id) {
            group = { ...action.payload }
          }

          return group
        })
      }
    default:
      return state
  }
}
