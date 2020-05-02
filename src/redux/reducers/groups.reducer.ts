import { AnyAction } from 'redux'
import * as CONSTANTS from '../actions/constants'
import uniqBy from 'lodash-es/uniqBy'
import { GroupModel } from '../../models'

export interface GroupsState {
  groups: GroupModel[]
}

const initialState: GroupsState = {
  groups: []
}

export default function groupsReducer(state = initialState, action: AnyAction): GroupsState {
  switch (action.type) {
    case CONSTANTS.APP_GROUPS_SAVE_GROUPS:
      let groups: GroupModel[] = action.payload || []

      groups = groups.map((group) => {
        const scripts = group.scripts.map((script, index) => {
          return {
            ...script,
            id: index + 1
          }
        })

        return {
          ...group,
          scripts
        }
      })

      return {
        ...state,
        groups
      }
    case CONSTANTS.APP_GROUPS_ADD_GROUP:
      return {
        ...state,
        groups: uniqBy([...state.groups, action.payload], 'name')
      }
    case CONSTANTS.APP_GROUPS_REMOVE_GROUP:
      return {
        ...state,
        groups: state.groups.filter(group => group.name !== action.payload.name)
      }
    case CONSTANTS.APP_GROUPS_EDIT_GROUP:
      return {
        ...state,
        groups: state.groups.map((group) => {
          if (group.name === action.payload.lastName) {
            group = { ...action.payload.group }
          }

          return group
        })
      }
    default:
      return state
  }
}
