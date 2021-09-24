/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

import { useFocus } from '../hooks/use-focus'

interface ActiveLinkProps extends NavLinkProps {
  to: string
  className?: string
  activeClassName?: string
  notFocusedActiveClassName?: string
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  notFocusedActiveClassName,
  ...props
}: ActiveLinkProps): JSX.Element {
  const isFocus = useFocus()

  return (
    <NavLink
      {...props}
      className={className}
      activeClassName={cx(
        activeClassName,
        !isFocus && notFocusedActiveClassName,
      )}
    >
      {children}
    </NavLink>
  )
}
