import React from 'react'
import './app-compilation.scss'
import AppTitle from '../../components/app-title/app-title'
import AppContainerLogs from '../../containers/app-compilation-logs/app-compilation-logs.container'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppCompilation: React.FC<Props> = () => {
  return (
    <div className="app-compilation">
      <AppTitle>Compilation</AppTitle>

      <div className="app-compilation-content">
        <AppContainerLogs />
      </div>
    </div>
  )
}

export default AppCompilation
