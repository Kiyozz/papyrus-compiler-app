import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppGroups, { DispatchesProps, StateProps } from '../../pages/app-groups/app-groups'
import { actionAddGroup, actionEditGroup, actionRemoveGroup } from '../../redux/actions/groups/groups.actions'

function mapStateToProps(store: RootStore): StateProps {
  return {
    groups: store.groups.groups
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    addGroup: group => dispatch(actionAddGroup(group)),
    removeGroup: group => dispatch(actionRemoveGroup(group)),
    editGroup: group => dispatch(actionEditGroup(group))
  }
}

const AppGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(AppGroups)

export default AppGroupsContainer
