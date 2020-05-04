import styled from '@emotion/styled'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'

import React from 'react'
import { connect } from 'react-redux'

import { RootStore } from '../../redux/stores/root.store'

interface StateProps {
  loading: boolean
}

type Props = StateProps

const Overlay = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
`

const Component: React.FC<Props> = ({ loading }) => {
  return (
    <Fade
      in={loading}
      mountOnEnter
      unmountOnExit
    >
      <Overlay>
        <CircularProgress size={32} />
      </Overlay>
    </Fade>
  )
}

const AppTaskLoading = connect((store: RootStore): StateProps => ({
  loading: store.taskLoading
}))(Component)

export default AppTaskLoading
