import React from 'react'
import './app-task-loading.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
          <FontAwesomeIcon
            icon="circle-notch"
            spin
          />
        </span>
      </div>
    </CSSTransition>
  )
}

export default AppTaskLoading
