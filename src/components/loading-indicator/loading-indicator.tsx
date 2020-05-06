import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

import React from 'react'
import { connect } from 'react-redux'

import { RootStore } from '../../redux/stores/root.store'
import classes from './loading-indicator.module.scss'

interface StateProps {
  loading: boolean
}

type Props = StateProps

const Component: React.FC<Props> = ({ loading }) => {
  return (
    <Fade
      in={loading}
      mountOnEnter
      unmountOnExit
    >
      <div className={classes.overlay}>
        <CircularProgress size={32} />
      </div>
    </Fade>
  )
}

const LoadingIndicator = connect((store: RootStore): StateProps => ({
  loading: store.taskLoading
}))(Component)

export default LoadingIndicator
