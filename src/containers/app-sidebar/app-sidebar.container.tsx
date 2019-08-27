import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppSideBar, { DispatchesProps, StateProps } from '../../components/app-sidebar/app-sidebar'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppSideBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppSideBar)

export default AppSideBarContainer
