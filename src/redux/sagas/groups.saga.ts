import { put, select, takeLatest } from 'redux-saga/effects'
import actions, { CONSTANTS } from '../actions'
import { RootStore } from '../stores/root.store'

function* onAddOrRemoveGroup() {
  const groups = yield select((state: RootStore) => state.groups.groups)

  yield put(actions.groupsPage.saveToLocal(groups))
}

export default function* groupsSaga() {
  yield takeLatest(CONSTANTS.APP_GROUPS_ADD_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_EDIT_GROUP, onAddOrRemoveGroup)
  yield takeLatest(CONSTANTS.APP_GROUPS_REMOVE_GROUP, onAddOrRemoveGroup)
}
