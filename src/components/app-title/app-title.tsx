import classNames from 'classnames'
import React from 'react'
import './app-title.scss'

interface Props {
  className?: string
}

const AppTitle: React.FC<Props> = ({ children, className }) => {
  return (
    <h1 className={classNames(['app-title', className])}>{children}</h1>
  )
}

export default AppTitle
