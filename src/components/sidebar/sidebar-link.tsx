import React, { useCallback } from 'react'
import { NavLink } from 'react-router-dom'

import classes from './sidebar-link.module.scss'

interface Props {
  to: string
  exact?: boolean
}

const SidebarLink: React.FC<Props> = ({ to, exact, children }) => {
  const onClickLink = useCallback((e: React.MouseEvent) => {
    (e.currentTarget as HTMLAnchorElement).blur()
  }, [])

  return (
    <NavLink
      to={to}
      exact={exact}
      className={classes.link}
      activeClassName={classes.active}
      onClick={onClickLink}
    >
      {children}
    </NavLink>
  )
}

export default SidebarLink
