import React, { useCallback } from 'react'
import './app-sidebar-link.scss'
import { NavLink } from 'react-router-dom'

interface Props {
  to: string
  exact?: boolean
}

const AppSidebarLink: React.FC<Props> = ({ to, exact, children }) => {
  const onClickLink = useCallback((e: React.MouseEvent) => {
    (e.currentTarget as HTMLAnchorElement).blur()
  }, [])

  return (
    <NavLink
      to={to}
      exact={exact}
      className="app-sidebar-link"
      activeClassName="app-sidebar-link-active"
      onClick={onClickLink}
    >
      {children}
    </NavLink>
  )
}

export default AppSidebarLink
