import { takeLatest, select, put } from 'redux-saga/effects'
import * as CONSTANTS from '../actions/constants'
import { RootStore } from '../stores/root.store'
import { actionSaveGroupsToLocal } from '../actions/groups/groups.actions'

function* onAddOrRemoveGroup() {
  const groups = yield select((state: RootStore) => state.groups.groups)

  yield put(actionSaveGroupsToLocal(groups))
}

export default function* groupsSaga() {
  yield takeLatest(CONSTANTS.APP_GROUPS_ADD_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_EDIT_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_REMOVE_GROUP, onAddOrRemoveGroup)
}
