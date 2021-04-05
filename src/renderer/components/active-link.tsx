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
  activeUnfocusClassName?: string
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  activeUnfocusClassName,
  ...props
}: ActiveLinkProps): JSX.Element {
  const isFocus = useFocus()

  return (
    <NavLink
      {...props}
      className={className}
      activeClassName={cx(activeClassName, !isFocus && activeUnfocusClassName)}
    >
      {children}
    </NavLink>
  )
}
