import React from 'react'
import './app-compilation.scss'

export interface StateProps {}

export interface DispatchesProps {}

type Props = StateProps & DispatchesProps

const AppCompilation: React.FC<Props> = () => {
  return (
    <div>AppCompilation works!</div>
  )
}

export default AppCompilation
