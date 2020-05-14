import { put, select, takeLatest } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import { actionSaveGroupsToLocal } from '../actions/groups/groups.actions'
import { RootStore } from '../stores/root.store'

function* onAddOrRemoveGroup() {
  const groups = yield select((state: RootStore) => state.groups.groups)

  yield put(actionSaveGroupsToLocal(groups))
}

export default function* groupsSaga() {
  yield takeLatest(CONSTANTS.APP_GROUPS_ADD_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_EDIT_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_REMOVE_GROUP, onAddOrRemoveGroup)
}
