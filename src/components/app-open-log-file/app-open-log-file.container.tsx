import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { actionOpenLog } from '../../redux/actions/app/app.actions'
import { RootStore } from '../../redux/stores/root.store'
import AppOpenLogFile, { DispatchesProps, StateProps } from './app-open-log-file'

function mapStateToProps(store: RootStore): StateProps {
  return {
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    openLogFile: () => dispatch(actionOpenLog())
  }
}

const AppOpenLogFileContainer = connect(mapStateToProps, mapDispatchToProps)(AppOpenLogFile)

export default AppOpenLogFileContainer
