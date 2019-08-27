import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppGroups, { DispatchesProps, StateProps } from '../../pages/app-groups/app-groups'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(AppGroups)

export default AppGroupsContainer
