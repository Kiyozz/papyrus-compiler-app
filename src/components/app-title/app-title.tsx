import React from 'react'
import './app-title.scss'

interface Props {}

const AppTitle: React.FC<Props> = ({ children }) => {
  return (
    <h1 className="app-title">{children}</h1>
  )
}

export default AppTitle
