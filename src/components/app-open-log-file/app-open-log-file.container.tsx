import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { actionOpenLog } from '../../redux/actions'
import AppOpenLogFile, { DispatchesProps, OwnProps, StateProps } from './app-open-log-file'

function mapStateToProps(_: any, own: OwnProps): StateProps {
  return {
    open: own.open
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchesProps {
  return {
    openLogFile: () => dispatch(actionOpenLog())
  }
}

const AppOpenLogFileContainer = connect(mapStateToProps, mapDispatchToProps)(AppOpenLogFile)

export default AppOpenLogFileContainer
