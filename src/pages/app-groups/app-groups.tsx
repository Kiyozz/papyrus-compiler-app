import React from 'react'
import './app-groups.scss'
import AppTitle from '../../components/app-title/app-title'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppGroups: React.FC<Props> = () => {
  return (
    <div className="app-groups">
      <AppTitle>Groups</AppTitle>

      <div className="app-groups-content">
      </div>
    </div>
  )
}

export default AppGroups
