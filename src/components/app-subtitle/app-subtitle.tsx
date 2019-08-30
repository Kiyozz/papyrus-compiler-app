import React from 'react'
import './app-subtitle.scss'

interface Props {}

const AppSubtitle: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="app-subtitle">{children}</h2>
  )
}

export default AppSubtitle
