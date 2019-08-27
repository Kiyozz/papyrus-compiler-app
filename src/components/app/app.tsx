import React, { useEffect } from 'react'
import './app.scss'
import AppSidebar from '../app-sidebar/app-sidebar'
import AppContent from '../app-content/app-content'
import AppLoading from '../../containers/app-loading/app-loading.container'

export interface StateProps {}

export interface DispatchesProps {
  initialization: () => void
}

type Props = StateProps & DispatchesProps

const App: React.FC<Props> = ({ initialization }) => {
  useEffect(() => {
    initialization()
  }, [initialization])

  return (
    <div className="app">
      <AppLoading />
      <AppSidebar />
      <AppContent />
    </div>
  )
}

export default App
