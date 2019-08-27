import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppSettings, { DispatchesProps, StateProps } from '../../pages/app-settings/app-settings'

function mapStateToProps(store: RootStore): StateProps {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(AppSettings)

export default AppSettingsContainer
