import React from 'react'
import './app-loading.scss'
import appLogo from '../../assets/papyrus-compiler-app-@2x.png'

export interface StateProps {
  initialized: boolean
}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppLoading: React.FC<Props> = ({ initialized }) => {
  if (initialized) {
    return null
  }

  return (
    <div className="app-loading">
      <img
        src={appLogo}
        alt="Application logo"
      />
    </div>
  )
}

export default AppLoading
