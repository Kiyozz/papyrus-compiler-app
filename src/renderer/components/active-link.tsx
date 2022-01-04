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

const ActiveLink = ({
  children,
  className,
  activeClassName,
  notFocusedActiveClassName,
  ...props
}: ActiveLinkProps) => {
  const isFocus = useFocus()

  return (
    <NavLink
      {...props}
      className={({ isActive }) => {
        return cx(
          className,
          isActive && activeClassName,
          !isFocus && isActive && notFocusedActiveClassName,
        )
      }}
    >
      {children}
    </NavLink>
  )
}

export default ActiveLink
