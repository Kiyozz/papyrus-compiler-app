import React from 'react'
import './app-not-found.scss'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppNotFound: React.FC<Props> = () => {
  return (
    <div className="app-not-found container">AppNotFound works!</div>
  )
}

export default AppNotFound
