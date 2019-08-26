import React, { useEffect } from 'react'
import './app.scss'

export interface StateProps {
  initialized: boolean
}

export interface DispatchesProps {
  initialization: () => void
}

type Props = StateProps & DispatchesProps

const App: React.FC<Props> = ({ initialization, initialized }) => {
  useEffect(() => {
    initialization()
  }, [initialization])

  if (!initialized) {
    return (
      <div className="app">
        <div className="container">Not initialized</div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">to</div>
    </div>
  )
}

export default App
