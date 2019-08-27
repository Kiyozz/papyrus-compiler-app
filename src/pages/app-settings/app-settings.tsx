import React from 'react'
import './app-settings.scss'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppSettings: React.FC<Props> = () => {
  return (
    <div>AppSettings works!</div>
  )
}

export default AppSettings
