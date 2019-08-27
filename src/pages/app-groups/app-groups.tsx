import React from 'react'
import './app-groups.scss'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppGroups: React.FC<Props> = () => {
  return (
    <div>AppGroups works!</div>
  )
}

export default AppGroups
