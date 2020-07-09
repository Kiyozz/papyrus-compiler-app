import { Link, LinkProps } from '@reach/router'
import cx from 'classnames'
import React, { useCallback } from 'react'

import classes from './sidebar-link.module.scss'

interface Props {
  to: string
  exact?: boolean
}

type LinkPropsAny = React.PropsWithoutRef<LinkProps<any>> & React.RefAttributes<HTMLAnchorElement>

interface ActiveLinkProps extends LinkPropsAny {
  to: string
  className?: string
  activeClassName?: string
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({ children, className, activeClassName, ...props }) => {
  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => ({
        className: cx({ [activeClassName ?? '']: isCurrent }, className)
      })}
    >
      {children}
    </Link>
  )
}

const SidebarLink: React.FC<Props> = ({ to, exact, children }) => {
  const onClickLink = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.blur()
  }, [])

  return (
    <ActiveLink
      to={to}
      className={classes.link}
      activeClassName={classes.active}
      onClick={onClickLink as any}
    >
      {children}
    </ActiveLink>
  )
}

export default SidebarLink
