import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppSplashScreen, { DispatchesProps, StateProps } from './app-splash-screen'

function mapStateToProps(store: RootStore): StateProps {
  return {
    initialized: store.initialization
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {}
}

const AppSplashScreenContainer = connect(mapStateToProps, mapDispatchToProps)(AppSplashScreen)

export default AppSplashScreenContainer
