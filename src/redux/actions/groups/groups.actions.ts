import { createAction } from 'redux-actions'
import { GroupModel } from '../../../models'
import * as CONSTANTS from '../constants'

export const actionSaveGroups = createAction<GroupModel[]>(CONSTANTS.APP_GROUPS_SAVE_GROUPS)
export const actionSaveGroupsToLocal = createAction<GroupModel[]>(CONSTANTS.APP_GROUPS_SAVE_GROUPS_TO_LOCAL)

export const actionAddGroup = createAction<GroupModel>(CONSTANTS.APP_GROUPS_ADD_GROUP)
export const actionEditGroup = createAction<GroupModel>(CONSTANTS.APP_GROUPS_EDIT_GROUP)
export const actionRemoveGroup = createAction<GroupModel>(CONSTANTS.APP_GROUPS_REMOVE_GROUP)
