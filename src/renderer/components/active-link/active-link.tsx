/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { Link, LinkProps } from '@reach/router'
import cx from 'classnames'
import React from 'react'

type LinkPropsAny = React.PropsWithoutRef<LinkProps<any>> &
  React.RefAttributes<HTMLAnchorElement>

interface ActiveLinkProps extends LinkPropsAny {
  to: string
  className?: string
  activeClassName?: string
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  ...props
}: ActiveLinkProps) {
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
