import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import './app-task-loading.scss'
import { CSSTransition } from 'react-transition-group'

export interface StateProps {
  loading: boolean
}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppTaskLoading: React.FC<Props> = ({ loading }) => {
  return (
    <CSSTransition
      timeout={300}
      classNames="app-fade"
      in={loading}
      mountOnEnter
      unmountOnExit
    >
      <div className="app-task-loading">
        <span className="app-task-loading-spin">
          <CircularProgress />
        </span>
      </div>
    </CSSTransition>
  )
}

export default AppTaskLoading
