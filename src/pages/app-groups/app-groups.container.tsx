import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppGroups, { DispatchesProps, StateProps } from './app-groups'
import { actionAddGroup, actionEditGroup, actionRemoveGroup } from '../../redux/actions'

function mapStateToProps(store: RootStore): StateProps {
  return {
    groups: store.groups.groups
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    addGroup: group => dispatch(actionAddGroup(group)),
    removeGroup: group => dispatch(actionRemoveGroup(group)),
    editGroup: (lastGroupName, group) => dispatch(actionEditGroup({ group, lastName: lastGroupName }))
  }
}

const AppGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(AppGroups)

export default AppGroupsContainer
