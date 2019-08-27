import React from 'react'
import './app-settings.scss'
import AppTitle from '../../components/app-title/app-title'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppSettings: React.FC<Props> = () => {
  return (
    <div className="app-settings">
      <AppTitle>Settings</AppTitle>

      <div className="app-settings-content">
      </div>
    </div>
  )
}

export default AppSettings
